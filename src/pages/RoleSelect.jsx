import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Sprout, TrendingUp, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function RoleSelect() {
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const selectRole = async (role) => {
    setLoading(true);
    await base44.auth.updateMe({ user_role: role });
    window.location.href = createPageUrl("Home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12">

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 mb-6">
            <Sprout className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Shakti

          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Empowering rural women to turn their dreams into thriving businesses
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => selectRole("entrepreneur")}
            disabled={loading}
            className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-amber-400 text-left">

            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-6 group-hover:bg-amber-200 transition-colors">
              <Sprout className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              I'm an Entrepreneur
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              I have a business idea and want to share it with the world, find investors, and grow
            </p>
            {loading &&
            <Loader2 className="w-5 h-5 animate-spin text-amber-600 mt-4" />
            }
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => selectRole("investor")}
            disabled={loading}
            className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-emerald-400 text-left">

            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 group-hover:bg-emerald-200 transition-colors">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              I'm an Investor
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              I want to discover promising business ideas and support rural women entrepreneurs
            </p>
            {loading &&
            <Loader2 className="w-5 h-5 animate-spin text-emerald-600 mt-4" />
            }
          </motion.button>
        </div>
      </div>
    </div>);

}