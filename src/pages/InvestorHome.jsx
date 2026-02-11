import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Users, Briefcase, Target, ArrowRight, Search, Phone, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageSelector from "@/components/LanguageSelector";
import MatchingPitchesNotification from "@/components/matching/MatchingPitchesNotification";
import WatchlistManager from "@/components/investor/WatchlistManager";

export default function InvestorHome() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: pitches = [] } = useQuery({
    queryKey: ["recent-pitches"],
    queryFn: () => base44.entities.Pitch.list("-created_date", 5),
  });

  const { data: allInvestors = [] } = useQuery({
    queryKey: ["all-investors-data"],
    queryFn: () => base44.entities.Investor.list(),
  });

  const currentInvestor = allInvestors.find(inv => inv.email === user?.email);

  const stats = [
    { label: t("activePitches"), value: "24", icon: Briefcase, color: "from-blue-500 to-cyan-600" },
    { label: t("entrepreneurs"), value: "156", icon: Users, color: "from-purple-500 to-pink-600" },
    { label: t("opportunities"), value: "12", icon: Target, color: "from-amber-500 to-orange-600" },
    { label: t("growthRate"), value: "+23%", icon: TrendingUp, color: "from-green-500 to-emerald-600" },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'linear-gradient(135deg, #FDE8EC 0%, #FCF4F6 100%)'}}>

      {/* Language Selector - Fixed Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSelector />
      </div>

<div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t("welcomeBack")}, {user?.full_name?.split(" ")[0] || "Investor"}
          </h1>
          <p className="text-gray-600 text-lg">{t("discoverInvest")}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card card-hover">
              <CardContent className="p-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
          ))}
        </div>

        {/* Matching Pitches Notification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <MatchingPitchesNotification currentInvestor={currentInvestor} />
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="glass-card hover:shadow-xl transition-all card-hover">
            <CardContent className="p-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#B94B5A] to-[#D8707C] flex items-center justify-center mb-5 shadow-md">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">{t("explorePitches")}</h3>
              <p className="mb-6 text-gray-600 leading-relaxed">{t("browseInnovative")}</p>
              <Link to={createPageUrl("InvestorPitches")}>
                <Button size="lg" className="w-full">
                  {t("viewAllPitches")} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-xl transition-all card-hover">
            <CardContent className="p-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D8707C] to-[#E89BAA] flex items-center justify-center mb-5 shadow-md">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">{t("myPortfolio")}</h3>
              <p className="mb-6 text-gray-600 leading-relaxed">{t("trackInvestments")}</p>
              <Link to={createPageUrl("InvestorPortfolio")}>
                <Button variant="secondary" size="lg" className="w-full">
                  {t("viewPortfolio")} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* My Watchlist Section */}
        <Card className="glass-card mb-8 card-hover">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Watchlist</h2>
                <p className="text-gray-600">Track opportunities and manage follow-ups</p>
              </div>
            </div>
            <div className="glass p-6">
              <WatchlistManager investorEmail={user?.email} />
            </div>
          </CardContent>
        </Card>

        {/* Recent Pitches */}
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t("recentPitches")}</h2>
              <Link to={createPageUrl("InvestorPitches")}>
                <Button variant="ghost" className="text-[#7A1C1C] hover:bg-[#E8A1A6]/20">
                  {t("viewAll")} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {pitches.slice(0, 3).map((pitch) => (
                <div key={pitch.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-all border border-transparent hover:border-[#E8A1A6]/40 hover:shadow-sm" style={{ borderRadius: '18px' }}>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B94B5A] to-[#D8707C] flex items-center justify-center text-white font-bold shadow-md">
                    {pitch.created_by?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{pitch.title}</h4>
                    <p className="text-sm text-gray-600">{pitch.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {pitch.funding_needed ? `₹${pitch.funding_needed.toLocaleString()}` : "N/A"}
                    </p>
                    <p className="text-xs text-gray-600">Funding needed</p>
                  </div>
                </div>
              ))}
              {pitches.length === 0 && (
                <p className="text-center text-gray-500 py-8">{t("noPitchesAvailable")}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}