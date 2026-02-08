import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, Users2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const businessTypeColors = {
  handicrafts: "bg-rose-50 text-rose-600",
  textiles: "bg-purple-50 text-purple-600",
  food: "bg-amber-50 text-amber-600",
  agriculture: "bg-green-50 text-green-600",
  retail: "bg-blue-50 text-blue-600",
  services: "bg-indigo-50 text-indigo-600",
  other: "bg-gray-50 text-gray-600",
};

export default function Community() {
  const [search, setSearch] = useState("");

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["community"],
    queryFn: () => base44.entities.CommunityMember.list(),
  });

  const filtered = members.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
            <Users2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community</h1>
            <p className="text-gray-500">Discover women entrepreneurs near you</p>
          </div>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by name, business, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-14 rounded-2xl border-gray-200 bg-white shadow-sm text-base"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Users2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No community members found yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-14 h-14 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
                      {member.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900">{member.name}</h3>
                    <p className="text-amber-600 font-medium text-sm">{member.business_name}</p>
                  </div>
                </div>

                {member.description && (
                  <p className="text-gray-500 text-sm mt-3 line-clamp-2">{member.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {member.business_type && (
                    <Badge className={`${businessTypeColors[member.business_type]} text-xs rounded-full capitalize`}>
                      {member.business_type}
                    </Badge>
                  )}
                  {member.location && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {member.location}
                    </span>
                  )}
                  {member.years_in_business > 0 && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {member.years_in_business} yrs
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}