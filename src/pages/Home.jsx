import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import EntrepreneurCarousel from "@/components/home/EntrepreneurCarousel";
import { useLanguage } from "@/components/LanguageProvider";


export default function Home() {
  const [user, setUser] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#D97B8E] via-[#C96A7E] to-[#B85A6E] text-white min-h-[calc(100vh-4rem)]">
        {/* Decorative Circles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 left-20 w-[500px] h-[500px] rounded-full bg-white/20 blur-3xl" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl">

            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8 text-sm border border-white/30">
              <Sparkles className="w-4 h-4" />
              Welcome{user?.full_name ? `, ${user.full_name.toUpperCase()}` : ""}!
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Transform Your Ideas into Thriving Enterprises
            </h1>
            
            <p className="text-xl md:text-2xl text-white/95 mb-10 leading-relaxed">
              Every great business started with a single idea. Share yours today and connect with investors who believe in you.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to={createPageUrl("MyIdea")}
                className="inline-flex items-center gap-2 bg-white text-[#C96A7E] hover:bg-gray-50 font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-lg">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <a
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Watch Demo Video
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>);

}