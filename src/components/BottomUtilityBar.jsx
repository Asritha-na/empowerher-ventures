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
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t border-pink-200/30 shadow-[0_-4px_20px_rgba(231,154,154,0.15)]"
      style={{ background: 'rgba(253, 232, 236, 0.95)' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Toll-Free Support - Left */}
        <a
          href="tel:1800-123-4567"
          className="flex items-center gap-3 text-gray-700 hover:text-[#8B1E1E] transition-all duration-200 group"
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-200 group-hover:border-[#8B1E1E]/40 transition-all duration-200 shadow-sm">
            <Phone className="w-5 h-5 text-gray-700 group-hover:text-[#8B1E1E]" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs text-gray-500 font-medium">24/7 Support</p>
            <p className="text-sm font-semibold text-gray-900">1800-123-4567</p>
          </div>
        </a>

        {/* Language Selector - Right */}
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-gray-500 hidden sm:block" />
          <LanguageSelector />
        </div>
      </div>
    </motion.div>
  );
}