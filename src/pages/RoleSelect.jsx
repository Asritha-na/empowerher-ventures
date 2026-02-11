import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Sprout, TrendingUp, Loader2, PlayCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageSelector from "@/components/LanguageSelector";
import RoleSelectBot from "@/components/RoleSelectBot";
import VoiceAccessibilityAssistant from "@/components/VoiceAccessibilityAssistant";
import { Button } from "@/components/ui/button";
import StickySearchBar from "../components/role-select/StickySearchBar";
import ServiceTiles from "../components/role-select/ServiceTiles";

export default function RoleSelect() {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const handleLogin = () => base44.auth.redirectToLogin(createPageUrl("Dashboard"));
  const scrollTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };

  const selectRole = async (role) => {
    setLoading(true);
    await base44.auth.updateMe({ user_role: role });
    window.location.href = createPageUrl("Home");
  };

  const successStories = [
    {
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/b18b58bc3_image.png",
      name: "Rajeshwari",
      business: "Handicrafts"
    },
    {
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/0f273976e_image.png",
      name: "Priya",
      business: "Textiles"
    },
    {
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/009fff949_image.png",
      name: "Meera",
      business: "Agriculture"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 [&_svg]:pointer-events-none" style={{ background: 'linear-gradient(135deg, #4A1C40 0%, #8B1E5F 50%, #B94B5A 100%)' }}>

      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-[600px] h-[600px] rounded-full bg-pink-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-rose-500/10 blur-3xl" />
      </div>

      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#E31B23] flex items-center justify-center text-white font-bold">S</div>
            <span className="font-semibold text-white">Shakti</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleLogin} className="text-white/90 hover:text-white text-sm">Log In</button>
            <Button onClick={handleLogin} className="bg-white text-[#8B1E1E] hover:bg-gray-100 rounded-full h-9 px-4">Get Started</Button>
            <div className="hidden md:block">
              <div className="glass-card px-3 py-1.5 rounded-full border border-white/20">
                <LanguageSelector />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl w-full z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, #E79A9A 0%, #B94B5A 100%)', boxShadow: '0 0 40px rgba(185, 75, 90, 0.6)' }}>
            <Sprout className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            {t('shakti')}
          </h1>
          <p className="text-xl text-pink-100 max-w-2xl mx-auto leading-relaxed">
            {t('empoweringRuralWomen')}
          </p>
        </motion.div>

        {/* Central Search / Location */}
        <div className="max-w-3xl mx-auto mb-8">
          <StickySearchBar />
        </div>

         {/* Success Stories Strip */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12">
          <div className="glass-card rounded-3xl p-6 border border-white/20">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <h3 className="text-white font-semibold text-lg">Women Building Dreams</h3>
            </div>
            <div className="flex justify-center gap-4 overflow-hidden">
              {successStories.map((story, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="relative group">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl transition-transform duration-300 group-hover:scale-105">
                    <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                      <div className="text-white text-xs">
                        <div className="font-semibold">{story.name}</div>
                        <div className="text-pink-200">{story.business}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => selectRole("entrepreneur")}
            disabled={loading}
            className="glass-card p-8 text-left rounded-3xl group transition-all duration-300 border border-white/20 hover:border-pink-300/50 hover:shadow-2xl hover:shadow-pink-500/30 hover:-translate-y-1 disabled:opacity-50">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300" style={{ background: 'rgba(185, 75, 90, 0.3)', boxShadow: '0 4px 20px rgba(185, 75, 90, 0.2)' }}>
              <Sprout className="w-8 h-8 text-pink-200" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              {t('imAnEntrepreneur')}
            </h2>
            <p className="text-pink-100 text-base leading-relaxed mb-4">
              {t('entrepreneurDescription')}
            </p>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-pink-300" />
            ) : (
              <div className="inline-flex items-center gap-2 text-pink-200 text-sm font-medium group-hover:gap-3 transition-all">
                Continue as Entrepreneur
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => selectRole("investor")}
            disabled={loading}
            className="glass-card p-8 text-left rounded-3xl group transition-all duration-300 border border-white/20 hover:border-purple-300/50 hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-1 disabled:opacity-50">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300" style={{ background: 'rgba(139, 30, 95, 0.3)', boxShadow: '0 4px 20px rgba(139, 30, 95, 0.2)' }}>
              <TrendingUp className="w-8 h-8 text-purple-200" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              {t('imAnInvestor')}
            </h2>
            <p className="text-purple-100 text-base leading-relaxed mb-4">
              {t('investorDescription')}
            </p>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-purple-300" />
            ) : (
              <div className="inline-flex items-center gap-2 text-purple-200 text-sm font-medium group-hover:gap-3 transition-all">
                Continue as Investor
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </motion.button>
        </div>

        {/* Watch Demo Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center">
          <button
            onClick={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")}
            className="glass-card px-8 py-4 rounded-full border border-white/20 hover:border-white/40 text-white font-medium inline-flex items-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-white/20">
            <PlayCircle className="w-5 h-5" />
            {t("watchDemo")}
          </button>
          <p className="text-sm text-pink-200/80 mt-4">
            Learn how Shakti empowers women entrepreneurs
          </p>
        </motion.div>

        {/* Features Grid */}
        <section id="features" className="mt-12">
          <ServiceTiles />
        </section>
        </div>

        {/* AI Language Bot */
      <RoleSelectBot />

      {/* Voice Accessibility Assistant */}
      <VoiceAccessibilityAssistant />
    </div>);

}