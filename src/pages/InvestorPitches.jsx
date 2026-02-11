import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Search, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

  // Keep co-founders query only for dashboard stats context (no UI section rendered)
  const { data: coFounders = [] } = useQuery({
    queryKey: ["co-founders"],
    queryFn: () => base44.entities.CommunityMember.list("-created_date", 100),
  });

  const { data: pitches = [] } = useQuery({
    queryKey: ["investor-pitches"],
    queryFn: () => base44.entities.Pitch.list("-created_date", 100),
  });

  const stats = [
    { label: "Active Co-Founders", value: coFounders.length, color: "text-pink-600" },
    { label: "Skills Available", value: `${coFounders.length * 3}+`, color: "text-blue-600" },
    { label: "Successful Matches", value: "120", color: "text-green-600" },
    { label: "Other Connect", value: "15+", color: "text-purple-600" },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'linear-gradient(135deg, #FDE8EC 0%, #FCF4F6 100%)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header (renamed tab label only) */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#8B1E1E] flex items-center justify-center shadow-md" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find Pitches</h1>
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
              <p className="text-sm text-white/95">{t("aiAnalyzes")}</p>
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
              {pitches.slice(0, 6).map((pitch) => (
                <Card key={pitch.id} className="glass-card hover:shadow-md transition-all">
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
      </div>
    </div>
  );
}