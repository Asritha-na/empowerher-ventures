import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import RatingSummary from "@/components/reviews/RatingSummary";
import RateButton from "@/components/reviews/RateButton";

export default function Community() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const qc = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  // Entrepreneurs dataset (same as entrepreneur profiles)
  const { data: entrepreneurs = [] } = useQuery({
    queryKey: ["entrepreneurs-public"],
    queryFn: () => base44.entities.PublicProfile.filter({ user_role: "entrepreneur", profile_completed: true, is_public: true }, "-created_date", 1000),
  });

  // Connections for current user
  const { data: sent = [] } = useQuery({
    queryKey: ["cf-conn-sent", user?.id],
    enabled: !!user?.id,
    queryFn: () => base44.entities.Connection.filter({ sender_id: user.id, status: "connected" }, "-created_date", 1000),
  });
  const { data: recv = [] } = useQuery({
    queryKey: ["cf-conn-recv", user?.id],
    enabled: !!user?.id,
    queryFn: () => base44.entities.Connection.filter({ receiver_id: user.id, status: "connected" }, "-created_date", 1000),
  });

  const connectionWith = (otherId) => {
    if (!otherId) return null;
    return [...sent, ...recv].find(
      (c) => (c.sender_id === user?.id && c.receiver_id === otherId) || (c.receiver_id === user?.id && c.sender_id === otherId)
    );
  };

  // Live updates
  useEffect(() => {
    const u1 = base44.entities.PublicProfile.subscribe(() => qc.invalidateQueries({ queryKey: ["entrepreneurs-public"] }));
    const u2 = base44.entities.Connection.subscribe(() => {
      qc.invalidateQueries({ queryKey: ["cf-conn-sent", user?.id] });
      qc.invalidateQueries({ queryKey: ["cf-conn-recv", user?.id] });
    });
    const u3 = base44.entities.Review.subscribe(() => qc.invalidateQueries({ queryKey: ["entrepreneurs-public"] }));
    return () => { u1(); u2(); u3(); };
  }, [qc, user?.id]);

  const filtered = entrepreneurs.filter((e) => {
    const q = search.toLowerCase();
    return (
      (e.full_name || "").toLowerCase().includes(q) ||
      (e.business_name || "").toLowerCase().includes(q) ||
      (e.location || e.location_formatted || "").toLowerCase().includes(q) ||
      (Array.isArray(e.entrepreneur_skills_needed) && e.entrepreneur_skills_needed.some((s) => (s || "").toLowerCase().includes(q)))
    );
  });

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: "linear-gradient(135deg, #FDE8EC 0%, #FCF4F6 100%)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#8B1E1E] flex items-center justify-center shadow-md">
            <Users2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Co-founder Connect</h1>
            <p className="text-gray-700 text-sm">Discover entrepreneurs looking for partners</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Input
            placeholder="Search by name, skills, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 rounded-2xl border-gray-200 bg-white shadow-sm"
          />
        </div>

        {/* Entrepreneurs Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No entrepreneurs found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((e, i) => {
              const otherId = e.user_id || e.id;
              const connected = !!connectionWith(otherId);
              const displayName = e.full_name || (e.email ? e.email.split("@")[0].replace(/[._-]/g, " ") : "Entrepreneur");
              const skills = Array.isArray(e.entrepreneur_skills_needed) ? e.entrepreneur_skills_needed.slice(0, 6) : [];

              return (
                <motion.div key={e.id || otherId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="glass-card hover:shadow-md transition-all h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <img
                          src={e.profile_image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=60"}
                          alt={displayName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="font-bold text-gray-900 truncate">{displayName}</h3>
                              {e.business_name && <p className="text-xs text-gray-600 truncate">{e.business_name}</p>}
                              {(e.location || e.location_formatted) && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                  <MapPin className="w-3 h-3" />
                                  <span className="truncate">{e.location || e.location_formatted}</span>
                                </div>
                              )}
                            </div>
                            <RatingSummary targetUserId={otherId} />
                          </div>
                        </div>
                      </div>

                      {skills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Skills Needed</p>
                          <div className="flex flex-wrap gap-1.5">
                            {skills.map((s, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-pink-100 text-pink-700 text-xs px-2 py-0.5">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <RateButton targetUserId={otherId} disabled={!connected || user?.id === otherId} />
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}