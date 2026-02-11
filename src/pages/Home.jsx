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
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white">
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
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6 text-sm border border-white/20">
              <Sparkles className="w-4 h-4" />
              Welcome{user?.full_name ? `, ${user.full_name}` : ""}!
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Transform Your Ideas into Thriving Enterprises
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Every great business started with a single idea. Share yours today and connect with investors who believe in you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to={createPageUrl("MyIdea")}
                className="inline-flex items-center gap-2 bg-white text-purple-600 font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-gray-50 transition-colors shadow-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-2xl text-lg hover:border-white/50 transition-colors backdrop-blur-sm"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Watch Demo Video
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Entrepreneur Carousel */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass-card text-purple-400 font-medium px-4 py-2 rounded-full text-sm mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Real Stories, Real Impact
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Women Who Made It Happen
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Get inspired by real rural women entrepreneurs who turned their skills into thriving businesses
          </p>
        </div>

        <EntrepreneurCarousel />
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Everything You Need to <span className="text-gradient-purple">Succeed</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            From idea to execution, we provide the tools, connections, and support to help you build a thriving business
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: "🎤",
              color: "from-pink-500 to-rose-500",
              title: "Voice-First Interface",
              description: "Record your pitch in any language - no typing needed. Perfect for rural entrepreneurs."
            },
            {
              icon: "💬",
              color: "from-purple-500 to-indigo-500",
              title: "AI Pitch Coach",
              description: "Get instant feedback on your pitch with our AI-powered coach. Improve clarity, structure, and impact."
            },
            {
              icon: "👥",
              color: "from-blue-500 to-cyan-500",
              title: "Verified Investors",
              description: "Connect with verified CSR funds, angel investors, NGOs, and micro-finance institutions."
            },
            {
              icon: "📚",
              color: "from-green-500 to-emerald-500",
              title: "Learning Hub",
              description: "Access free courses, templates, pitch deck generators, and business guidance."
            },
            {
              icon: "🛍️",
              color: "from-orange-500 to-amber-500",
              title: "D2C Marketplace",
              description: "Sell your products directly to customers. Showcase with photos and AR/VR technology."
            },
            {
              icon: "🌐",
              color: "from-violet-500 to-purple-500",
              title: "Multilingual Support",
              description: "Available in 12+ Indian languages. Voice assistance for non-literate users."
            },
            {
              icon: "🔒",
              color: "from-teal-500 to-cyan-500",
              title: "Safe & Secure",
              description: "KYC-verified investors, content moderation, and privacy controls to keep you safe."
            },
            {
              icon: "📈",
              color: "from-yellow-500 to-orange-500",
              title: "Impact Tracking",
              description: "Track your growth, jobs created, and community impact with beautiful dashboards."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-3xl p-6 hover:shadow-xl transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4`}>
                {feature.icon}
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">{feature.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
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

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-pink-700 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of women entrepreneurs who are building their dreams with Shakti
            </p>
            <Link
            to={createPageUrl("MyIdea")}
            className="inline-flex items-center gap-3 bg-white text-purple-600 font-semibold px-8 py-4 rounded-full text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}