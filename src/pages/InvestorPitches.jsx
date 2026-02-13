import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Search, Sparkles, Users, Award, TrendingUp, MapPin, Briefcase, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import AddToWatchlistButton from "@/components/investor/AddToWatchlistButton";
import NotesManager from "@/components/investor/NotesManager";

export default function InvestorPitches() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: coFounders = [], isLoading } = useQuery({
    queryKey: ["co-founders"],
    queryFn: () => base44.entities.CommunityMember.list("-created_date", 100),
  });

  const { data: pitches = [] } = useQuery({
    queryKey: ["investor-pitches"],
    queryFn: () => base44.entities.Pitch.list("-created_date", 100),
  });

  // Fetch entrepreneur profiles (User records) to enrich pitch cards
  const { data: entrepreneurs = [] } = useQuery({
    queryKey: ["public-entrepreneur-profiles"],
    queryFn: () => base44.entities.PublicProfile.filter({ user_role: "entrepreneur", profile_completed: true, is_public: true }, "-created_date", 1000),
  });

  const filteredCoFounders = coFounders.filter((member) => {
    const searchLower = search.toLowerCase();
    return (
      member.name?.toLowerCase().includes(searchLower) ||
      member.location?.toLowerCase().includes(searchLower) ||
      member.skills?.some(skill => skill.toLowerCase().includes(searchLower))
    );
  });

  const stats = [
    { label: "Active Co-Founders", value: coFounders.length, color: "text-pink-600" },
    { label: "Skills Available", value: `${coFounders.length * 3}+`, color: "text-blue-600" },
    { label: "Successful Matches", value: "120", color: "text-green-600" },
    { label: "Other Connect", value: "15+", color: "text-purple-600" },
  ];

  // Build quick lookup for entrepreneur by email
  const entrepreneurByEmail = React.useMemo(() => {
    const map = new Map();
    entrepreneurs.forEach((e) => { if (e.email) map.set(e.email.toLowerCase(), e); });
    return map;
  }, [entrepreneurs]);

  const skillColors = [
    "bg-pink-100 text-pink-700",
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700",
    "bg-amber-100 text-amber-700",
    "bg-cyan-100 text-cyan-700",
  ];

  const getWhatsAppLink = (phone, message) => {
    const cleanPhone = phone?.replace(/\D/g, "");
    const text = message ? `?text=${encodeURIComponent(message)}` : "";
    return `https://wa.me/${cleanPhone}${text}`;
  };

  const isValidUpiId = (v) => /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/.test(String(v || "").trim());
  const buildUpiParams = ({ pa, pn, am, tn }) => `pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn || "")}${am ? `&am=${encodeURIComponent(am)}` : ""}&cu=INR&tn=${encodeURIComponent(tn || "")}`;
  const buildIntentUrl = (pkg, params) => `intent://pay?${params}#Intent;scheme=upi;package=${pkg};end`;
  const buildGenericUpiUrl = (params) => `upi://pay?${params}`;

  // Connections involving current user (investor)
  const { data: connsA = [] } = useQuery({
    queryKey: ["ip-conns-a", user?.id],
    enabled: !!user?.id,
    queryFn: () => base44.entities.InvestorConnection.filter({ investor_a_id: user.id, status: 'connected' }, "-created_date", 500),
  });
  const { data: connsB = [] } = useQuery({
    queryKey: ["ip-conns-b", user?.id],
    enabled: !!user?.id,
    queryFn: () => base44.entities.InvestorConnection.filter({ investor_b_id: user.id, status: 'connected' }, "-created_date", 500),
  });
  const { data: connsByInvestor = [] } = useQuery({
    queryKey: ["ip-conns-investor", user?.id],
    enabled: !!user?.id,
    queryFn: () => base44.entities.InvestorConnection.filter({ investor_id: user.id, status: 'connected' }, "-created_date", 500),
  });
  const allConns = [...connsA, ...connsB];

  // Mutation: connect investor -> entrepreneur
  const connectMutation = useMutation({
    mutationFn: async (entrepreneurUser) => {
      const targetId = entrepreneurUser?.user_id || entrepreneurUser?.id;
      if (!user?.id || !targetId || targetId === user.id) return;
      // Avoid duplicate connection (new + legacy)
      const existingNew = await base44.entities.InvestorConnection.filter({ investor_id: user.id, entrepreneur_id: targetId, status: 'connected' }, "-created_date", 1);
      const [existAB] = await base44.entities.InvestorConnection.filter({ investor_a_id: user.id, investor_b_id: targetId, status: 'connected' }, "-created_date", 1);
      const [existBA] = await base44.entities.InvestorConnection.filter({ investor_a_id: targetId, investor_b_id: user.id, status: 'connected' }, "-created_date", 1);
      if ((existingNew?.length || 0) > 0 || existAB || existBA) return;
      await base44.entities.InvestorConnection.create({
        investor_a_id: user.id,
        investor_b_id: targetId,
        investor_id: user.id,
        entrepreneur_id: targetId,
        entrepreneur_name: entrepreneurUser.full_name || (entrepreneurUser.email?.split('@')[0] || 'Entrepreneur'),
        entrepreneur_email: entrepreneurUser.email || null,
        timestamp: new Date().toISOString(),
        status: 'connected',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ip-conns-a", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["ip-conns-b", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["ip-conns-investor", user?.id] });
    }
  });

  // Real-time sync on connections and data updates
  useEffect(() => {
    const unsubConn = base44.entities.InvestorConnection.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["ip-conns-a", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["ip-conns-b", user?.id] });
    });
    const unsubPitch = base44.entities.Pitch.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["investor-pitches"] });
    });
    const unsubUser = base44.entities.PublicProfile.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["public-entrepreneur-profiles"] });
    });
    return () => { unsubConn(); unsubPitch(); unsubUser(); };
  }, [user?.id, queryClient]);

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'linear-gradient(135deg, #FDE8EC 0%, #FCF4F6 100%)'}}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#8B1E1E] flex items-center justify-center shadow-md">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t("coFounderConnector")}</h1>
              <p className="text-sm text-gray-700">{t("findPerfectPartner")}</p>
            </div>
          </div>
        </div>

        {/* AI-Powered Matching Banner */}
        <div className="mb-6 bg-gradient-to-br from-[#B94B5A] to-[#D8707C] rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1">{t("aiPoweredMatching")}</h3>
              <p className="text-sm text-white/95">
                {t("aiAnalyzes")}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder={t("searchByName")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 rounded-xl border-gray-200 shadow-sm"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card rounded-xl p-4 text-center">
              <p className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Pitches with Watchlist */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Business Pitches</h2>
          {pitches.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500">No pitches available yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {pitches.map((pitch) => {
                const eUser = pitch.created_by ? entrepreneurByEmail.get(pitch.created_by.toLowerCase()) : null;
                const otherId = eUser?.user_id || eUser?.id;
                const isConnected = !!otherId && (connsByInvestor.some(c => c.entrepreneur_id === otherId) || allConns.some(c => (c.investor_a_id === user?.id && c.investor_b_id === otherId) || (c.investor_b_id === user?.id && c.investor_a_id === otherId)));
                const displayName = eUser?.full_name || (pitch.created_by ? pitch.created_by.split('@')[0].replace(/[._-]/g, ' ') : 'Entrepreneur');
                const businessName = eUser?.business_name || pitch.title || '';
                const location = eUser?.location || eUser?.location_formatted || '';
                const skills = Array.isArray(eUser?.entrepreneur_skills_needed) ? eUser.entrepreneur_skills_needed : [];
                const funding = typeof pitch.funding_needed === 'number' ? pitch.funding_needed : null;
                const description = pitch.structured_pitch || pitch.problem || pitch.solution || eUser?.bio || pitch.raw_speech || '';
                const email = eUser?.email || pitch.created_by;
                const phone = eUser?.phone;
                const waMsg = `Hi ${displayName}, I'm an investor on Shakti and would like to discuss your business idea.`;
                const upiId = eUser?.upi_id?.trim();
                const validUpi = isValidUpiId(upiId);
                const handlePay = async (method) => {
                  if (!validUpi) return;
                  const params = buildUpiParams({ pa: upiId, pn: displayName, am: "", tn: "Investment via SHAKTI Platform" });
                  const pkgMap = { gpay: "com.google.android.apps.nbu.paisa.user", paytm: "net.one97.paytm", phonepe: "com.phonepe.app" };
                  try {
                    await base44.entities.PaymentTransaction.create({
                      investor_id: user?.id,
                      entrepreneur_id: otherId,
                      amount: typeof funding === "number" ? funding : null,
                      timestamp: new Date().toISOString(),
                      status: "initiated",
                      method,
                      pitch_id: pitch.id,
                    });
                  } catch (e) {}
                  const intentUrl = buildIntentUrl(pkgMap[method], params);
                  window.open(intentUrl, "_blank");
                  setTimeout(() => { window.open(buildGenericUpiUrl(params), "_blank"); }, 1200);
                };

                return (
                  <Card key={pitch.id} className="glass-card hover:shadow-md transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <img src={eUser?.profile_image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=60'} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <h4 className="font-bold text-gray-900 leading-tight">{displayName}</h4>
                          {businessName && <p className="text-xs text-gray-600">{businessName}</p>}
                          {location && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="w-3 h-3" /> {location}
                            </div>
                          )}
                        </div>
                      </div>

                      {pitch.category && (
                        <Badge variant="secondary" className="mb-3 capitalize">{pitch.category}</Badge>
                      )}

                      {funding !== null && (
                        <p className="text-sm text-gray-600 mb-2">
                          Seeking: <span className="font-semibold text-green-600">₹{funding.toLocaleString()}</span>
                        </p>
                      )}

                      {description && (
                        <p className="text-sm text-gray-700 line-clamp-3 mb-3">{description}</p>
                      )}

                      {skills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Skills</p>
                          <div className="flex flex-wrap gap-1.5">
                            {skills.slice(0,6).map((s, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-pink-100 text-pink-700 text-xs px-2 py-0.5">{s}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        {!isConnected ? (
                          <Button
                            className="w-full bg-[#8B1E1E] hover:opacity-90 text-white rounded-2xl"
                            onClick={() => eUser && connectMutation.mutate(eUser)}
                            disabled={!eUser || !user}
                          >
                            Connect
                          </Button>
                        ) : (
                          <div className={`grid ${validUpi ? 'grid-cols-6' : 'grid-cols-3'} gap-2`}>
                            <Button className="col-span-1 bg-gray-200 text-gray-700 rounded-2xl" disabled>
                              Connected
                            </Button>
                            <Button
                              className="col-span-1 bg-white text-[#8B1E1E] border border-[#8B1E1E] hover:bg-white/80 rounded-2xl"
                              onClick={() => email && window.open(`mailto:${email}?subject=${encodeURIComponent('Regarding your business idea on SHAKTI')}`)}
                              disabled={!email}
                            >
                              <Mail className="w-4 h-4 mr-1" /> Email
                            </Button>
                            <Button
                              className="col-span-1 bg-green-600 hover:bg-green-700 text-white rounded-2xl"
                              onClick={() => phone && window.open(getWhatsAppLink(phone, waMsg), '_blank')}
                              disabled={!phone}
                            >
                              <Phone className="w-4 h-4 mr-1" /> WhatsApp
                            </Button>
                            {validUpi && (
                              <>
                                <Button
                                  className="col-span-1 bg-white text-gray-800 border hover:bg-white/80 rounded-2xl"
                                  onClick={() => handlePay('gpay')}
                                >
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Google_Pay_Logo_%282018-2020%29.svg" alt="GPay" className="w-4 h-4 mr-1" />
                                  GPay
                                </Button>
                                <Button
                                  className="col-span-1 bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 rounded-2xl"
                                  onClick={() => handlePay('paytm')}
                                >
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/Paytm_Logo_.svg" alt="Paytm" className="w-4 h-4 mr-1" />
                                  Paytm
                                </Button>
                                <Button
                                  className="col-span-1 bg-white border border-purple-600 text-purple-700 hover:bg-purple-50 rounded-2xl"
                                  onClick={() => handlePay('phonepe')}
                                >
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/PhonePe_Logo.svg" alt="PhonePe" className="w-4 h-4 mr-1" />
                                  PhonePe
                                </Button>
                              </>
                            )}
                          </div>
                        )}

                        <AddToWatchlistButton pitch={pitch} investorEmail={user?.email} variant="outline" />
                        <NotesManager
                          investorEmail={user?.email}
                          relatedToType="pitch"
                          relatedToId={pitch.id}
                          relatedToName={pitch.title}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Co-Founders Grid */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Co-Founder Opportunities</h2>
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading co-founders...</p>
          </div>
        ) : filteredCoFounders.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No co-founders found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoFounders.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="glass-card hover:shadow-md transition-all h-full">
                  <CardContent className="p-0">
                    {/* Image */}
                    <div className="relative">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-pink-400 to-purple-500 rounded-t-lg flex items-center justify-center">
                          <span className="text-6xl font-bold text-white">
                            {member.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white text-gray-900 shadow-md border-0">
                          {member.commitment_type === "full-time" ? t("fullTime") : t("partTime")}
                        </Badge>
                      </div>
                      {member.image_url && (
                        <p className="absolute bottom-2 right-2 text-[10px] text-white/60 bg-black/20 px-2 py-0.5 rounded">
                          {member.image_url.includes('unsplash') ? 'unsplash.com' : 'image'}
                        </p>
                      )}
                    </div>

                    <div className="p-5">
                      {/* Name & Location */}
                      <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{member.location || "Location not specified"}</span>
                      </div>

                      {/* Experience */}
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{member.years_experience || member.years_in_business || 0} {t("yearsExperience")}</span>
                      </div>

                      {/* Skills */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{t("skills")}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {member.skills?.slice(0, 6).map((skill, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className={`${skillColors[idx % skillColors.length]} text-xs px-2 py-0.5`}
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Looking For */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-pink-600 uppercase mb-1">{t("lookingFor")}</p>
                        <p className="text-sm font-medium text-gray-900">
                          {member.looking_for || "Business Partner"}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {member.description || "Passionate entrepreneur looking to collaborate and grow together."}
                      </p>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 bg-[#8B1E1E] hover:opacity-90 text-white rounded-2xl shadow-md"
                            onClick={() => {
                              if (member.phone) {
                                window.open(getWhatsAppLink(member.phone), "_blank");
                              }
                            }}
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            {t("connect")}
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 border-green-500 text-green-600 hover:bg-green-50 rounded-lg"
                            onClick={() => {
                              if (member.pitch_video_url) {
                                window.open(member.pitch_video_url, "_blank");
                              }
                            }}
                          >
                            {t("pitch")}
                          </Button>
                        </div>
                        <NotesManager
                          investorEmail={user?.email}
                          relatedToType="entrepreneur"
                          relatedToId={member.id}
                          relatedToName={member.name}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}