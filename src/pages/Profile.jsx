import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export default function Profile() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    phone: "",
    location: "",
    bio: "",
    business_name: "",
    business_type: "",
    preferred_language: "en",
  });

  useEffect(() => {
    base44.auth.me().then((u) => {
      setUser(u);
      setForm({
        phone: u.phone || "",
        location: u.location || "",
        bio: u.bio || "",
        business_name: u.business_name || "",
        business_type: u.business_type || "",
        preferred_language: u.preferred_language || "en",
      });
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe(form);
    setSaving(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.auth.updateMe({ profile_image: file_url });
    setUser({ ...user, profile_image: file_url });
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
                <div className="h-12 bg-gray-50 rounded-xl flex items-center px-4 text-gray-700 font-medium">
                  {user?.full_name || t("notSet")}
                </div>
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