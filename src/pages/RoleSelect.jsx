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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <LanguageSelector />
      </div>
      
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12">

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-900 to-blue-800 mb-6">
            <Sprout className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {t('shakti')}
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            {t('empoweringRuralWomen')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => selectRole("entrepreneur")}
            disabled={loading}
            className="group glass-card rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-indigo-900 text-left">

            <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors">
              <Sprout className="w-8 h-8 text-indigo-900" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('imAnEntrepreneur')}
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              {t('entrepreneurDescription')}
            </p>
            {loading &&
            <Loader2 className="w-5 h-5 animate-spin text-indigo-900 mt-4" />
            }
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => selectRole("investor")}
            disabled={loading}
            className="group glass-card rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-gray-600 text-left">

            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-6 group-hover:bg-gray-200 transition-colors">
              <TrendingUp className="w-8 h-8 text-gray-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('imAnInvestor')}
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              {t('investorDescription')}
            </p>
            {loading &&
            <Loader2 className="w-5 h-5 animate-spin text-gray-700 mt-4" />
            }
          </motion.button>
        </div>

        {/* Watch Demo Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Button
            onClick={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")}
            variant="outline"
            size="lg"
            className="rounded-full border-2 border-indigo-900 text-indigo-900 hover:bg-indigo-50 px-8 py-6 text-base"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            {t("watchDemo")}
          </Button>
          <p className="text-sm text-gray-500 mt-3">
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