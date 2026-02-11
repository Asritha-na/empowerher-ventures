import React from "react";
import { Phone, Globe } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { motion } from "framer-motion";

export default function BottomUtilityBar() {
  return (
    <>
      {/* Floating Support Card - Bottom Left */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed bottom-6 left-6 z-50 bg-white rounded-[14px] shadow-sm overflow-hidden hidden md:block border border-gray-200"
      >
        <a
          href="tel:1800-123-4567"
          className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-slate-600 font-medium">24/7 Support</p>
            <p className="text-sm font-bold text-slate-900">1800-123-4567</p>
          </div>
        </a>
      </motion.div>

      {/* Floating Language Selector - Bottom Right */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="fixed bottom-6 right-6 z-50 bg-white rounded-[14px] shadow-sm p-3 hidden md:flex items-center gap-2 border border-gray-200"
      >
        <Globe className="w-5 h-5 text-slate-600" />
        <LanguageSelector />
      </motion.div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="px-4 h-16 flex items-center justify-between">
          <a
            href="tel:1800-123-4567"
            className="flex items-center gap-2 text-gray-700"
          >
            <Phone className="w-5 h-5" />
            <span className="text-xs font-semibold">1800-123-4567</span>
          </a>
          <LanguageSelector />
        </div>
      </div>
    </>
  );
}