import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Sprout, TrendingUp, Loader2, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageSelector from "@/components/LanguageSelector";
import RoleSelectBot from "@/components/RoleSelectBot";
import VoiceAccessibilityAssistant from "@/components/VoiceAccessibilityAssistant";
import { Button } from "@/components/ui/button";

export default function RoleSelect() {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const selectRole = async (role) => {
    setLoading(true);
    await base44.auth.updateMe({ user_role: role });
    window.location.href = createPageUrl("Home");
  };

  return (
    <div className="bg-red-400 p-4 min-h-screen flex items-center justify-center from-gray-50 to-gray-100">

      <div className="absolute top-6 right-6 flex items-center gap-3">
        <LanguageSelector />
      </div>
      
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12">

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 mb-6 glow-purple">
            <Sprout className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {t('shakti')}
          </h1>
          <p className="text-lg text-purple-200 max-w-md mx-auto">
            {t('empoweringRuralWomen')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => selectRole("entrepreneur")}
            disabled={loading} className="bg-orange-900 p-8 text-left rounded-3xl group glass-card hover:glow-purple transition-all duration-300 border border-black-500/30 hover:border-purple-500">


            <div className="w-16 h-16 rounded-2xl bg-purple-600/30 flex items-center justify-center mb-6 group-hover:bg-purple-600/50 transition-colors">
              <Sprout className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {t('imAnEntrepreneur')}
            </h2>
            <p className="text-purple-200 text-base leading-relaxed">
              {t('entrepreneurDescription')}
            </p>
            {loading &&
            <Loader2 className="w-5 h-5 animate-spin text-purple-400 mt-4" />
            }
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => selectRole("investor")}
            disabled={loading} className="bg-orange-900 p-8 text-left rounded-3xl group glass-card hover:glow-pink transition-all duration-300 border border-black-500/30 hover:border-pink-500">


            <div className="w-16 h-16 rounded-2xl bg-pink-600/30 flex items-center justify-center mb-6 group-hover:bg-pink-600/50 transition-colors">
              <TrendingUp className="w-8 h-8 text-pink-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {t('imAnInvestor')}
            </h2>
            <p className="text-purple-200 text-base leading-relaxed">
              {t('investorDescription')}
            </p>
            {loading &&
            <Loader2 className="w-5 h-5 animate-spin text-pink-400 mt-4" />
            }
          </motion.button>
        </div>

        {/* Watch Demo Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center">

          <Button
            onClick={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")}
            variant="outline"
            size="lg" className="bg-amber-900 text-white px-8 py-6 text-base font-medium rounded-full inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-sm hover:text-accent-foreground h-12 border-2 border-purple-500 hover:bg-purple-900/30">


            <PlayCircle className="w-5 h-5 mr-2" />
            {t("watchDemo")}
          </Button>
          <p className="bg-red-950 p-8 text-left rounded-3xl glass-card group transition-all duration-300 border border-white/20 hover:border-pink-300/50 hover:shadow-2xl hover:shadow-pink-500/30 hover:-translate-y-1 disabled:opacity-50">
            Learn about the app and understand the difference between roles
          </p>
        </motion.div>
      </div>

      {/* AI Language Bot */}
      <RoleSelectBot />

      {/* Voice Accessibility Assistant */}
      <VoiceAccessibilityAssistant />
    </div>);

}