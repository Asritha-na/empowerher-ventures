import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Users, Briefcase, Target, ArrowRight, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";

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

  const stats = [
    { label: t("activePitches"), value: "24", icon: Briefcase, color: "from-blue-500 to-cyan-600" },
    { label: t("entrepreneurs"), value: "156", icon: Users, color: "from-purple-500 to-pink-600" },
    { label: t("opportunities"), value: "12", icon: Target, color: "from-amber-500 to-orange-600" },
    { label: t("growthRate"), value: "+23%", icon: TrendingUp, color: "from-green-500 to-emerald-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white p-4 md:p-8">
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
              <Card className="border-none shadow-md hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-none shadow-md bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
            <CardContent className="p-8">
              <Search className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">{t("explorePitches")}</h3>
              <p className="mb-6 text-blue-50">{t("browseInnovative")}</p>
              <Link to={createPageUrl("InvestorPitches")}>
                <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                  {t("viewAllPitches")} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <CardContent className="p-8">
              <Briefcase className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">{t("myPortfolio")}</h3>
              <p className="mb-6 text-purple-50">{t("trackInvestments")}</p>
              <Link to={createPageUrl("InvestorPortfolio")}>
                <Button variant="secondary" className="bg-white text-purple-600 hover:bg-purple-50">
                  {t("viewPortfolio")} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Pitches */}
        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t("recentPitches")}</h2>
              <Link to={createPageUrl("InvestorPitches")}>
                <Button variant="ghost" className="text-blue-600">
                  {t("viewAll")} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {pitches.slice(0, 3).map((pitch) => (
                <div key={pitch.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                    {pitch.created_by?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{pitch.title}</h4>
                    <p className="text-sm text-gray-500">{pitch.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {pitch.funding_needed ? `₹${pitch.funding_needed.toLocaleString()}` : "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">Funding needed</p>
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