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
      <div className="relative overflow-hidden text-white min-h-[calc(100vh-4rem)]" style={{ background: 'linear-gradient(135deg, #B94B5A 0%, #D8707C 100%)' }}>
        {/* Decorative Blurred Circles */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-pink-200/20 blur-[80px]" />
          <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full bg-pink-300/15 blur-[100px]" />
          <div className="absolute bottom-0 right-20 w-[450px] h-[450px] rounded-full bg-rose-200/20 blur-[90px]" />
        </div>
        
        <div className="px-8 py-21 relative max-w-[1200px] md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl">

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-10 text-sm border border-white/30 shadow-[0_4px_20px_rgba(255,255,255,0.1)]">

              <Sparkles className="w-4 h-4" />
              Welcome{user?.full_name ? `, ${user.full_name.toUpperCase()}` : ""}!
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.1]">

              Transform Your Ideas into Thriving Enterprises
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-2xl">

              Every great business started with a single idea. Share yours today and connect with investors who believe in you.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4">

              <Link
                to={createPageUrl("MyIdea")}
                className="inline-flex items-center gap-2 bg-white hover:scale-105 font-semibold px-8 py-4 text-lg transition-all shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
                style={{ color: '#7A1C1C', borderRadius: '18px' }}>
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <a
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 border-2 border-white/40 text-white font-semibold px-8 py-4 text-lg hover:bg-white/20 transition-all backdrop-blur-md shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
                style={{ borderRadius: '18px' }}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Watch Demo Video
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>);

}