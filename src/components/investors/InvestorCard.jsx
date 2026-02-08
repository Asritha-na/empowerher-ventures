import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, UserMinus, MapPin, Banknote } from "lucide-react";
import { motion } from "framer-motion";

export default function InvestorCard({ investor, isConnected, onConnect, onDisconnect, index }) {
  const whatsappUrl = `https://wa.me/${investor.phone?.replace(/[^0-9]/g, "")}?text=Hello! I'm an entrepreneur from NariShakti platform. I'd love to discuss my business idea with you.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
          {investor.name?.charAt(0)?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900">{investor.name}</h3>
          {investor.location && (
            <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
              <MapPin className="w-3 h-3" />
              {investor.location}
            </div>
          )}
          {investor.bio && (
            <p className="text-gray-500 text-sm mt-2 line-clamp-2">{investor.bio}</p>
          )}
          {investor.focus_areas?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {investor.focus_areas.map((area, i) => (
                <Badge key={i} variant="secondary" className="bg-emerald-50 text-emerald-700 text-xs rounded-full">
                  {area}
                </Badge>
              ))}
            </div>
          )}
          {(investor.min_investment || investor.max_investment) && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
              <Banknote className="w-3.5 h-3.5" />
              ₹{investor.min_investment?.toLocaleString()} - ₹{investor.max_investment?.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        {isConnected ? (
          <>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Connect on WhatsApp
            </a>
            <Button
              variant="outline"
              onClick={() => onDisconnect(investor)}
              className="rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 py-3 px-4"
            >
              <UserMinus className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <Button
            onClick={() => onConnect(investor)}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl py-3 h-auto text-sm font-medium"
          >
            Connect with {investor.name?.split(" ")[0]}
          </Button>
        )}
      </div>
    </motion.div>
  );
}