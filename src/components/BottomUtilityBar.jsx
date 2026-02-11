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
      className="fixed bottom-0 left-0 right-0 z-50 sidebar-berry backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_20px_rgba(163,55,87,0.2)]"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Toll-Free Support - Left */}
        <a
          href="tel:1800-123-4567"
          className="flex items-center gap-3 text-white/90 hover:text-white transition-all duration-200 group"
        >
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:border-white/40 transition-all duration-200">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs text-white/70 font-medium">24/7 Support</p>
            <p className="text-sm font-semibold">1800-123-4567</p>
          </div>
        </a>

        {/* Language Selector - Right */}
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-white/70 hidden sm:block" />
          <LanguageSelector />
        </div>
      </div>
    </motion.div>
  );
}