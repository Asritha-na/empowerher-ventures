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
      <div className="relative overflow-hidden min-h-[calc(100vh-4rem)]" style={{ background: 'linear-gradient(135deg, #F9FAFB 0%, #EEF2FF 100%)' }}>
        {/* Decorative Blurred Circles */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-indigo-200/10 blur-[100px]" />
          <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full bg-purple-200/8 blur-[120px]" />
          <div className="absolute bottom-0 right-20 w-[450px] h-[450px] rounded-full bg-blue-200/10 blur-[100px]" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl">

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md rounded-full px-6 py-3 mb-10 text-sm border border-gray-200 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-gray-700">Welcome{user?.full_name ? `, ${user.full_name}` : ""}!</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.1] text-gray-900"
            >
              Transform Your Ideas Into Scalable Ventures
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-2xl"
            >
              Build, launch, and scale your business with powerful tools and expert guidance.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link to={createPageUrl("MyIdea")}>
                <Button size="lg" className="px-8 py-6 text-lg">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <a
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  Watch Demo
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>);

}