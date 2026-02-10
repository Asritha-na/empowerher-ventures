import React from "react";
import { Phone, Globe } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { motion } from "framer-motion";

export default function BottomUtilityBar() {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50 shadow-[0_-4px_30px_rgba(0,0,0,0.3)]"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Toll-Free Support - Left */}
        <a
          href="tel:1800-123-4567"
          className="flex items-center gap-3 text-slate-200 hover:text-amber-400 transition-all duration-200 group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center border border-amber-500/30 group-hover:border-amber-400/50 transition-all duration-200 group-hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]">
            <Phone className="w-5 h-5 text-amber-400" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs text-slate-400 font-medium">24/7 Support</p>
            <p className="text-sm font-semibold">1800-123-4567</p>
          </div>
        </a>

        {/* Language Selector - Right */}
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-slate-400 hidden sm:block" />
          <LanguageSelector />
        </div>
      </div>
    </motion.div>
  );
}