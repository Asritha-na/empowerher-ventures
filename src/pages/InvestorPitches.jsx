import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Search, Sparkles, Users, Award, TrendingUp, MapPin, Briefcase, Phone } from "lucide-react";
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

  const skillColors = [
    "bg-pink-100 text-pink-700",
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700",
    "bg-amber-100 text-amber-700",
    "bg-cyan-100 text-cyan-700",
  ];

  const getWhatsAppLink = (phone) => {
    const cleanPhone = phone?.replace(/\D/g, "");
    return `https://wa.me/${cleanPhone}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-pink-600">{t("coFounderConnector")}</h1>
              <p className="text-sm text-gray-500">{t("findPerfectPartner")}</p>
            </div>
          </div>
        </div>

        {/* AI-Powered Matching Banner */}
        <div className="mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-1">{t("aiPoweredMatching")}</h3>
              <p className="text-sm text-white/90">
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
            <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
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
              {pitches.slice(0, 6).map((pitch) => (
                <Card key={pitch.id} className="border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-5">
                    <h4 className="font-bold text-gray-900 mb-2">{pitch.title}</h4>
                    {pitch.category && (
                      <Badge variant="secondary" className="mb-3 capitalize">
                        {pitch.category}
                      </Badge>
                    )}
                    {pitch.funding_needed && (
                      <p className="text-sm text-gray-600 mb-4">
                        Seeking: <span className="font-semibold text-green-600">₹{pitch.funding_needed.toLocaleString()}</span>
                      </p>
                    )}
                    <div className="space-y-2">
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
              ))}
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
                <Card className="border-gray-200 shadow-sm hover:shadow-md transition-all h-full">
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
                            className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 rounded-lg"
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