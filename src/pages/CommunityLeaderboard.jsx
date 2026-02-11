import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Award, Heart, Users2, Star, Medal, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";

const getBadges = (t) => [
  {
    icon: Star,
    title: t("topInnovator"),
    subtitle: t("recognizingExcellence"),
    gradient: "from-amber-400 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50",
  },
  {
    icon: Award,
    title: t("bestPitch"),
    subtitle: t("recognizingExcellence"),
    gradient: "from-purple-400 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
  },
  {
    icon: Heart,
    title: t("communityHelper"),
    subtitle: t("recognizingExcellence"),
    gradient: "from-rose-400 to-pink-500",
    bgGradient: "from-rose-50 to-pink-50",
  },
  {
    icon: Users2,
    title: t("cofounderConnector"),
    subtitle: t("recognizingExcellence"),
    gradient: "from-blue-400 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
  },
];

const medalColors = {
  1: { bg: "bg-gradient-to-br from-yellow-400 to-yellow-600", text: "text-yellow-600", badge: "Gold", icon: "🏆" },
  2: { bg: "bg-gradient-to-br from-gray-300 to-gray-500", text: "text-gray-600", badge: "Silver", icon: "🥈" },
  3: { bg: "bg-gradient-to-br from-orange-400 to-orange-600", text: "text-orange-600", badge: "Bronze", icon: "🥉" },
};

export default function CommunityLeaderboard() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: pitches = [], isLoading } = useQuery({
    queryKey: ["pitches"],
    queryFn: () => base44.entities.Pitch.list("-created_date", 100),
  });

  // Calculate leaderboard
  const leaderboard = React.useMemo(() => {
    const userStats = {};
    
    pitches.forEach(pitch => {
      const email = pitch.created_by;
      if (!userStats[email]) {
        userStats[email] = {
          email,
          pitchCount: 0,
          totalViews: 0,
        };
      }
      userStats[email].pitchCount += 1;
      userStats[email].totalViews += Math.floor(Math.random() * 5000) + 1000; // Mock views
    });

    return Object.values(userStats)
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, 10);
  }, [pitches]);

  const badges = getBadges(t);

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'linear-gradient(135deg, #F5E6EA 0%, #FCF8F9 100%)'}}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-rose mb-3">
            {t("community")}
          </h1>
          <p className="text-gray-700 text-lg">{t("celebratingAmazingWomen")}</p>
        </div>

        {/* Badges Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {badges.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${badge.bgGradient} rounded-3xl p-8 text-center shadow-md hover:shadow-xl transition-all`}
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center`}>
                <badge.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{badge.title}</h3>
              <p className="text-sm text-gray-500">{badge.subtitle}</p>
            </motion.div>
          ))}
        </div>

        {/* Leaderboard Section */}
        <div className="gradient-depth rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6 text-white">
            <Trophy className="w-8 h-8" />
            <h2 className="text-2xl font-bold">{t("topEntrepreneursThisMonth")}</h2>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-white mx-auto" />
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12 text-white/80">
              <p>No entrepreneurs to display yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entrepreneur, index) => {
                const rank = index + 1;
                const medal = medalColors[rank];
                
                return (
                  <motion.div
                    key={entrepreneur.email}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl p-5 flex items-center justify-between hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Rank Badge */}
                      <div className={`w-12 h-12 rounded-full ${medal?.bg || 'bg-gray-200'} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                        {rank}
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{entrepreneur.email}</p>
                        <p className="text-sm text-gray-500">
                          {entrepreneur.pitchCount} pitch{entrepreneur.pitchCount !== 1 ? 'es' : ''} • {entrepreneur.totalViews.toLocaleString()} views
                        </p>
                      </div>

                      {/* Medal Badge */}
                      {medal && (
                        <div className={`px-4 py-2 rounded-full ${medal.bg} text-white font-bold text-sm flex items-center gap-2`}>
                          <span>{medal.icon}</span>
                          {medal.badge}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}