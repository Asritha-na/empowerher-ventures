import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import EntrepreneurCarousel from "@/components/home/EntrepreneurCarousel";
import SuccessStoriesCarousel from "@/components/home/SuccessStoriesCarousel";
import { useLanguage } from "@/components/LanguageProvider";


export default function Home() {
  const [user, setUser] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FDE8EC 0%, #FCF4F6 100%)' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #D8707C 0%, #E89AA8 100%)' }}>
        {/* Decorative Circles */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-[400px] h-[400px] rounded-full bg-white/15 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] rounded-full bg-white/15 blur-3xl" />
        </div>
        
        <div className="relative max-w-[1200px] mx-auto px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl">

            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2.5 mb-10 text-sm border border-white/30">
              <Sparkles className="w-4 h-4" />
              Welcome{user?.full_name ? `, ${user.full_name.toUpperCase()}` : ""}!
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
              Transform Your Ideas into Thriving Enterprises
            </h1>
            
            <p className="text-xl md:text-2xl text-white/95 mb-12 leading-relaxed max-w-3xl">
              Every great business started with a single idea. Share yours today and connect with investors who believe in you.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to={createPageUrl("MyIdea")}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 font-semibold px-8 py-4 text-lg transition-all shadow-lg"
                style={{ color: '#8B1E1E', borderRadius: '16px' }}>
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <a
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white/40 text-white font-semibold px-8 py-4 text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
                style={{ borderRadius: '16px' }}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Watch Demo Video
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Stories Section */}
      <div className="py-20">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Success Stories
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-lg max-w-2xl mx-auto"
            >
              Women entrepreneurs building impactful businesses through Shakti
            </motion.p>
          </div>

          <SuccessStoriesCarousel />
        </div>
      </div>
    </div>);

}