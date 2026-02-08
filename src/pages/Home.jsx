import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import EntrepreneurCarousel from "@/components/home/EntrepreneurCarousel";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white" />
          <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-white" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm">
              <Sparkles className="w-4 h-4" />
              Welcome{user?.full_name ? `, ${user.full_name}` : ""}!
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Your Ideas Can Change the World
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Every great business started with a single idea. Share yours today and connect with investors who believe in you.
            </p>
            <Link
              to={createPageUrl("MyIdea")}
              className="inline-flex items-center gap-2 bg-white text-amber-700 font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-amber-50 transition-colors shadow-lg"
            >
              Share Your Idea
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Entrepreneur Carousel */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 font-medium px-4 py-2 rounded-full text-sm mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Real Stories, Real Impact
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
            Women Who Made It Happen
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Get inspired by real rural women entrepreneurs who turned their skills into thriving businesses
          </p>
        </div>

        <EntrepreneurCarousel />
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Women Empowered", value: "5,000+" },
              { label: "Ideas Funded", value: "1,200+" },
              { label: "Investors Active", value: "300+" },
              { label: "Villages Reached", value: "800+" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}