import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { User, Save, Loader2, Camera, Mail, Phone, MapPin, Building2, LogOut, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageSelector from "@/components/LanguageSelector";

const businessTypes = [
  { value: "handicrafts", label: "🎨 Handicrafts" },
  { value: "textiles", label: "🧵 Textiles" },
  { value: "food", label: "🍳 Food" },
  { value: "agriculture", label: "🌾 Agriculture" },
  { value: "retail", label: "🛍️ Retail" },
  { value: "services", label: "💼 Services" },
  { value: "other", label: "📦 Other" },
];

const languages = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
  { value: "bn", label: "Bengali" },
  { value: "mr", label: "Marathi" },
  { value: "gu", label: "Gujarati" },
  { value: "kn", label: "Kannada" },
  { value: "ml", label: "Malayalam" },
];

const investorSkillsOptions = ["Finance", "Marketing", "Tech", "Legal", "Operations", "Strategy"];
const investorSectionsOptions = ["Agriculture", "Handmade Products", "Technology", "Retail", "Social Impact", "Education", "Healthcare"];
const entrepreneurSkillsNeededOptions = ["Marketing", "Finance", "Technical Co-founder", "Legal Support", "Operations", "Supply Chain"];

export default function Profile() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const locationInputRef = useRef(null);
  const [budgetError, setBudgetError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    user_role: "",
    phone: "",
    location: "",
    bio: "",
    business_name: "",
    business_type: "",
    preferred_language: "en",
    investor_skills: [],
    investor_budget_min: "",
    investor_budget_max: "",
    investor_sections_of_interest: [],
    entrepreneur_skills_needed: [],
    upi_id: "",
    preferred_upi_app: "",
  });

  useEffect(() => {
    base44.auth.me().then((u) => {
      setUser(u);
      setForm({
        full_name: u.full_name || "",
        user_role: u.user_role || "",
        phone: u.phone || "",
        location: u.location || "",
        bio: u.bio || "",
        business_name: u.business_name || "",
        business_type: u.business_type || "",
        preferred_language: u.preferred_language || "en",
        investor_skills: u.investor_skills || [],
        investor_budget_min: typeof u.investor_budget_min === 'number' ? String(u.investor_budget_min) : "",
        investor_budget_max: typeof u.investor_budget_max === 'number' ? String(u.investor_budget_max) : "",
        investor_sections_of_interest: u.investor_sections_of_interest || [],
        entrepreneur_skills_needed: u.entrepreneur_skills_needed || [],
        upi_id: u.upi_id || "",
        preferred_upi_app: u.preferred_upi_app || "",

      });
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let ac;
    function ensureScript() {
      if (window.google && window.google.maps && window.google.maps.places) return Promise.resolve();
      const key = window.GOOGLE_MAPS_API_KEY || "";
      if (!key) return Promise.resolve();
      return new Promise((resolve, reject) => {
        const existing = document.querySelector("script[data-google-maps]");
        if (existing) {
          existing.addEventListener("load", resolve, { once: true });
          existing.addEventListener("error", reject, { once: true });
          return;
        }
        const s = document.createElement("script");
        s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&v=weekly`;
        s.async = true;
        s.defer = true;
        s.setAttribute("data-google-maps", "true");
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    ensureScript().then(() => {
      if (!locationInputRef.current || !window.google?.maps?.places) return;
      ac = new window.google.maps.places.Autocomplete(locationInputRef.current, {
        fields: ["address_components", "geometry", "formatted_address"],
        types: ["(cities)"],
        componentRestrictions: { country: "in" },
      });
      ac.addListener("place_changed", async () => {
        const place = ac.getPlace();
        if (!place || !place.geometry) return;
        const comps = place.address_components || [];
        const getComp = (type) => {
          const c = comps.find((x) => x.types.includes(type));
          return c ? c.long_name : "";
        };
        const city = getComp("locality") || getComp("administrative_area_level_2") || getComp("administrative_area_level_1") || "";
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const formatted = place.formatted_address || city;
        setForm((prev) => ({ ...prev, location: city || formatted }));
        const data = {
          location_formatted: formatted,
          location_latitude: lat,
          location_longitude: lng,
          location_city: city,
        };
        const isAuthed = await base44.auth.isAuthenticated().catch(() => false);
        if (isAuthed) {
          await base44.auth.updateMe(data);
        } else {
          sessionStorage.setItem("location_data", JSON.stringify(data));
        }
      });
    });
    return () => { ac = null; };
  }, [locationInputRef]);

  const handleSave = async () => {
    setBudgetError("");
    setSaving(true);

    // Validate investor budget range if investor
    if (form.user_role === 'investor') {
      const min = form.investor_budget_min === "" ? null : Number(form.investor_budget_min);
      const max = form.investor_budget_max === "" ? null : Number(form.investor_budget_max);
      if (min !== null && max !== null && (isNaN(min) || isNaN(max) || min >= max)) {
        setBudgetError("Minimum must be less than Maximum");
        setSaving(false);
        return;
      }
    }

    const payload = {
      ...form,
      full_name: form.full_name,
      user_role: form.user_role,
      profile_completed: true,
    };

    if (form.user_role === 'investor') {
      if (form.investor_budget_min !== "") payload.investor_budget_min = Number(form.investor_budget_min);
      if (form.investor_budget_max !== "") payload.investor_budget_max = Number(form.investor_budget_max);
    }

    await base44.auth.updateMe(payload);

    // Mirror to PublicProfile for entrepreneurs (publicly visible in production)
    try {
      if (form.user_role === 'entrepreneur') {
        const me = await base44.auth.me();
        const existing = await base44.entities.PublicProfile.filter({ user_id: me.id }, "-created_date", 1);
        const record = {
          user_id: me.id,
          email: me.email,
          full_name: form.full_name || me.full_name || "",
          user_role: 'entrepreneur',
          business_name: form.business_name || "",
          business_type: form.business_type || "",
          bio: form.bio || "",
          location: form.location || "",
          location_formatted: me.location_formatted || null,
          profile_image: me.profile_image || null,
          entrepreneur_skills_needed: form.entrepreneur_skills_needed || [],
          profile_completed: true,
          is_public: true,
          phone: form.phone || me.phone || "",
        };
        if (existing && existing.length > 0) {
          await base44.entities.PublicProfile.update(existing[0].id, record);
        } else {
          await base44.entities.PublicProfile.create(record);
        }
      }
    } catch (e) {
      // Do not block profile save on mirror failure
    }

    setSaving(false);
    window.location.href = createPageUrl("Dashboard");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.auth.updateMe({ profile_image: file_url });
    setUser({ ...user, profile_image: file_url });
  };

  const toggleInArray = (field, value) => {
    setForm((prev) => {
      const set = new Set(prev[field] || []);
      if (set.has(value)) set.delete(value); else set.add(value);
      return { ...prev, [field]: Array.from(set) };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'linear-gradient(135deg, #FDE8EC 0%, #FCF4F6 100%)'}}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#8B1E1E] flex items-center justify-center shadow-md">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("myProfile")}</h1>
            <p className="text-gray-700">{t("yourPersonalDetails")}</p>
          </div>
        </div>

        {/* Language Selector */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <LanguageSelector />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile Picture */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {user?.profile_image ? (
                <img
                  src={user.profile_image}
                  alt="Profile"
                  className="w-28 h-28 rounded-3xl object-cover shadow-lg"
                />
              ) : (
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#B94B5A] to-[#D8707C] flex items-center justify-center shadow-lg">
                  <span className="text-4xl font-bold text-white">
                    {user?.full_name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
              )}
              <label className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4 text-gray-600" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          <Card className="glass-card rounded-3xl">
            <CardContent className="p-6 space-y-5">
              {/* Read-only fields */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> {t("fullName")}
                </label>
                <Input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder={t("fullName")}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {t("email")}
                </label>
                <div className="h-12 bg-gray-50 rounded-xl flex items-center px-4 text-gray-700">
                  {user?.email || t("notSet")}
                </div>
              </div>

              {/* Editable fields */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> {t("phoneNumber")}
                </label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={t("yourPhoneNumber")}
                  className="rounded-xl h-12"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {t("location")}
                </label>
                <Input
                  ref={locationInputRef}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder={t("villageCityState")}
                  className="rounded-xl h-12"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> {t("businessName")}
                </label>
                <Input
                  value={form.business_name}
                  onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                  placeholder={t("yourBusinessName")}
                  className="rounded-xl h-12"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">{t("businessType")}</label>
                <Select
                  value={form.business_type}
                  onValueChange={(v) => setForm({ ...form, business_type: v })}
                >
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder={t("selectBusinessType")} />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((bt) => (
                      <SelectItem key={bt.value} value={bt.value} className="py-2">
                        {t(bt.value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Role</label>
                <Select value={form.user_role} onValueChange={(v) => setForm({ ...form, user_role: v })}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                    <SelectItem value="investor">Investor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Investor-specific fields */}
              {form.user_role === 'investor' && (
                <>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Skills Area</label>
                    <div className="grid grid-cols-2 gap-3">
                      {investorSkillsOptions.map((opt) => (
                        <label key={opt} className="flex items-center gap-2 h-12 rounded-xl border border-gray-200 bg-white px-3 cursor-pointer">
                          <Checkbox checked={form.investor_skills?.includes(opt)} onCheckedChange={() => toggleInArray('investor_skills', opt)} />
                          <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Investment Budget Range</label>
                    <div className="grid grid-cols-2 gap-3">
                      <Input type="number" min={0} placeholder="Minimum Budget" className="rounded-xl h-12" value={form.investor_budget_min} onChange={(e) => { setForm({ ...form, investor_budget_min: e.target.value }); setBudgetError(""); }} />
                      <Input type="number" min={0} placeholder="Maximum Budget" className="rounded-xl h-12" value={form.investor_budget_max} onChange={(e) => { setForm({ ...form, investor_budget_max: e.target.value }); setBudgetError(""); }} />
                    </div>
                    {(form.investor_budget_min && form.investor_budget_max) && (
                      <div className="text-sm text-gray-500 mt-1">{form.investor_budget_min} amount - {form.investor_budget_max} amount</div>
                    )}
                    {budgetError && <div className="text-sm text-red-600 mt-1">{budgetError}</div>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Sections of Interest</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button type="button" className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-left">
                          {form.investor_sections_of_interest?.length ? form.investor_sections_of_interest.join(', ') : 'Select sections'}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-72 p-3">
                        <div className="space-y-2">
                          {investorSectionsOptions.map((opt) => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox checked={form.investor_sections_of_interest?.includes(opt)} onCheckedChange={() => toggleInArray('investor_sections_of_interest', opt)} />
                              <span className="text-sm text-gray-700">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
              )}

              {/* Entrepreneur-specific fields */}
              {form.user_role === 'entrepreneur' && (
                <>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Skills They Are Looking For</label>
                    <div className="grid grid-cols-2 gap-3">
                      {entrepreneurSkillsNeededOptions.map((opt) => (
                        <label key={opt} className="flex items-center gap-2 h-12 rounded-xl border border-gray-200 bg-white px-3 cursor-pointer">
                          <Checkbox checked={form.entrepreneur_skills_needed?.includes(opt)} onCheckedChange={() => toggleInArray('entrepreneur_skills_needed', opt)} />
                          <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">UPI ID (to receive payments)</label>
                    <Input
                      value={form.upi_id}
                      onChange={(e) => setForm({ ...form, upi_id: e.target.value })}
                      placeholder="e.g., yourname@upi"
                      className="rounded-xl h-12"
                    />
                    <p className="text-xs text-gray-500">Investors can send funds directly via UPI.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Preferred UPI App</label>
                    <Select
                      value={form.preferred_upi_app || ""}
                      onValueChange={(v) => setForm({ ...form, preferred_upi_app: v })}
                    >
                      <SelectTrigger className="rounded-xl h-12">
                        <SelectValue placeholder="Select app (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpay">Google Pay</SelectItem>
                        <SelectItem value="paytm">Paytm</SelectItem>
                        <SelectItem value="phonepe">PhonePe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">{t("preferredLanguage")}</label>
                <Select
                  value={form.preferred_language}
                  onValueChange={(v) => setForm({ ...form, preferred_language: v })}
                >
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((l) => (
                      <SelectItem key={l.value} value={l.value} className="py-2">
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">{t("aboutMe")}</label>
                <Textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder={t("tellUsAboutYourself")}
                  className="rounded-xl min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-[#8B1E1E] hover:opacity-90 text-white rounded-2xl h-12 text-base shadow-md"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {t("saveProfile")}
              </Button>

              <Button
                variant="outline"
                onClick={() => base44.auth.logout()}
                className="w-full rounded-xl h-12 text-red-500 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t("logout")}
              </Button>
            </CardContent>
          </Card>

          {/* Toll-Free Support */}
          <Card className="glass-card mt-6">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B94B5A] to-[#D8707C] flex items-center justify-center mx-auto mb-4 shadow-md">
                <PhoneCall className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("tollFreeSupport")}</h3>
              <p className="text-4xl font-bold text-[#8B1E1E] mb-2">1800-123-123</p>
              <p className="text-sm text-gray-600">{t("available24x7")}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}