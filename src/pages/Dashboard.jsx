import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import SuccessStoriesCarousel from "@/components/landing/SuccessStoriesCarousel.jsx";
import { ArrowRight, PlayCircle, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'linear-gradient(135deg, #FDE8EC 0%, #FCF4F6 100%)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Welcome badge */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm shadow-sm bg-white/90 border border-white/60">
            <BadgeCheck className="w-4 h-4 text-[#8B1E1E]" />
            <span className="text-gray-700">Welcome, {user?.full_name || "Entrepreneur"}!</span>
          </div>
        </div>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-12 text-white mb-10 shadow-md">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight"
            >
              Transform Your Ideas into Thriving Enterprises
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="mt-4 text-lg text-white/90"
            >
              Every great business started with a single idea. Share yours today and connect with investors who believe in you.
            </motion.p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to={createPageUrl("MyIdea")}> 
                <Button className="bg-white text-[#8B1E1E] hover:bg-white/90 rounded-full px-6 h-11 font-medium">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")}
                className="rounded-full h-11 px-6 bg-white/10 border-white/40 text-white hover:bg-white/15"
              >
                <PlayCircle className="w-4 h-4 mr-2" /> Watch Demo Video
              </Button>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Success Stories</h2>
          <div className="max-w-4xl mx-auto">
            <SuccessStoriesCarousel />
          </div>
        </section>

        {/* Bottom Support Strip */}
        <div className="fixed left-0 right-0 bottom-0 z-40">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between bg-white/90 backdrop-blur rounded-t-2xl border border-white/60 px-4 py-3 shadow">
              <div className="flex items-center gap-3 text-gray-800">
                <div className="w-9 h-9 rounded-full bg-[#E6F4EF] text-[#1F7A5B] flex items-center justify-center font-semibold">☎</div>
                <div>
                  <div className="text-sm font-semibold">24/7 Support</div>
                  <div className="text-xs text-gray-600">1800-123-4567</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">We’re here to help</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}