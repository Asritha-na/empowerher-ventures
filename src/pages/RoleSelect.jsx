import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Sprout, TrendingUp, Loader2, PlayCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageSelector from "@/components/LanguageSelector";
import RoleSelectBot from "@/components/RoleSelectBot";
import VoiceAccessibilityAssistant from "@/components/VoiceAccessibilityAssistant";

export default function RoleSelect() {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const selectRole = async (role) => {
    setLoading(true);
    await base44.auth.updateMe({ user_role: role });
    window.location.href = createPageUrl("Home");
  };

  const successImages = [
    "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/a13fb5ccb_image.png",
    "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/97d9d515b_image.png",
    "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/e4a3188b1_image.png"
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 50%, #3e2463 100%)'
    }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 12px 48px 0 rgba(185, 75, 90, 0.3);
          transform: translateY(-4px);
        }
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden noise">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-pink-500/15 to-purple-500/15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="absolute top-6 right-6 flex items-center gap-3 z-50">
        <LanguageSelector />
      </div>

      <div className="max-w-7xl w-full relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 mb-6 shadow-2xl" style={{ animation: 'float 3s ease-in-out infinite' }}>
            <Sprout className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight">
            {t('shakti')}
          </h1>
          <p className="text-xl md:text-2xl text-purple-200/90 max-w-2xl mx-auto leading-relaxed">
            {t('empoweringRuralWomen')}
          </p>
        </motion.div>

        {/* Success Stories Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Real Stories, Real Impact</h2>
          </div>
          <div className="flex gap-4 justify-center overflow-hidden px-4">
            {successImages.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300">
                <img src={img} alt={`Success story ${idx + 1}`} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          <motion.button
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => selectRole("entrepreneur")}
            disabled={loading}
            className="glass-card p-10 text-left rounded-3xl group transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-600/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-purple-400/30">
                <Sprout className="w-10 h-10 text-purple-300" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                {t('imAnEntrepreneur')}
              </h2>
              <p className="text-purple-100/80 text-lg leading-relaxed mb-4">
                {t('entrepreneurDescription')}
              </p>
              {loading && (
                <Loader2 className="w-6 h-6 animate-spin text-purple-400 mt-4" />
              )}
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => selectRole("investor")}
            disabled={loading}
            className="glass-card p-10 text-left rounded-3xl group transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500/30 to-rose-600/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-pink-400/30">
                <TrendingUp className="w-10 h-10 text-pink-300" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                {t('imAnInvestor')}
              </h2>
              <p className="text-pink-100/80 text-lg leading-relaxed mb-4">
                {t('investorDescription')}
              </p>
              {loading && (
                <Loader2 className="w-6 h-6 animate-spin text-pink-400 mt-4" />
              )}
            </div>
          </motion.button>
        </div>

        {/* Watch Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center">
          <button
            onClick={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")}
            className="glass-card px-10 py-4 rounded-full inline-flex items-center gap-3 text-white font-semibold text-lg hover:scale-105 transition-all">
            <PlayCircle className="w-6 h-6" />
            {t("watchDemo")}
          </button>
          <p className="text-purple-200/70 mt-4 text-sm">
            See how Shakti transforms dreams into reality
          </p>
        </motion.div>
      </div>

      <RoleSelectBot />
      <VoiceAccessibilityAssistant />
    </div>
  );
}