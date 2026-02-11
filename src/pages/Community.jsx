import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Briefcase, Users2, Loader2, MessageCircle, Play, Sparkles, TrendingUp, Globe, Target } from "lucide-react";
import { motion } from "framer-motion";

const skillColors = [
  "bg-purple-50 text-purple-700",
  "bg-blue-50 text-blue-700",
  "bg-pink-50 text-pink-700",
  "bg-green-50 text-green-700",
];

export default function CoFounderConnect() {
  const [search, setSearch] = useState("");

  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ["community"],
    queryFn: () => base44.entities.CommunityMember.list(),
  });

  const { data: pitches = [], isLoading: pitchesLoading } = useQuery({
    queryKey: ["pitches"],
    queryFn: () => base44.entities.Pitch.list("-created_date"),
  });

  const isLoading = membersLoading || pitchesLoading;

  const filteredMembers = members.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.location?.toLowerCase().includes(search.toLowerCase()) ||
      m.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredPitches = pitches.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.structured_pitch?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Active Ideas", value: pitches.length, color: "from-rose-500 to-pink-500" },
    { label: "Active Co-Founders", value: members.length, color: "from-blue-500 to-cyan-500" },
    { label: "Successful Matches", value: "120", color: "from-green-500 to-emerald-500" },
    { label: "Cities Covered", value: "15+", color: "from-purple-500 to-violet-500" },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'linear-gradient(135deg, #FDE8EC 0%, #FCF4F6 100%)'}}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#8B1E1E] flex items-center justify-center shadow-md">
            <Users2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient-rose">Co-Founder Connector</h1>
            <p className="text-gray-700 text-sm">Find the perfect business partner to grow together</p>
          </div>
        </div>

        {/* AI-Powered Matching Banner */}
        <div className="bg-gradient-to-br from-[#B94B5A] to-[#D8707C] rounded-2xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-lg mb-1">AI-Powered Matching</h2>
              <p className="text-white/95 text-sm">Our AI analyzes your skills, experience, and goals to suggest the best co-founder matches</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by name, skills, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-14 text-base"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-5 text-center"
            >
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Business Ideas Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Business Ideas Shared</h2>
          {isLoading ? (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto" />
            </div>
          ) : filteredPitches.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-400">No ideas shared yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredPitches.map((pitch, i) => (
                <motion.div
                  key={pitch.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-900 flex-1">{pitch.title}</h3>
                      {pitch.category && (
                        <Badge className="bg-purple-100 text-purple-700 capitalize shrink-0 ml-2">
                          {pitch.category}
                        </Badge>
                      )}
                    </div>
                    
                    {pitch.structured_pitch && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {pitch.structured_pitch}
                      </p>
                    )}
                    
                    {pitch.funding_needed && (
                      <div className="bg-green-50 rounded-lg p-3 mb-4">
                        <p className="text-xs font-semibold text-green-900 mb-1">Funding Needed</p>
                        <p className="text-lg font-bold text-green-700">₹{pitch.funding_needed.toLocaleString()}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <TrendingUp className="w-4 h-4" />
                      <span>Posted by {pitch.created_by}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Co-Founders Grid */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Looking for Co-Founders</h2>
        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto" />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Users2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No co-founders found yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member, i) => {
              const whatsappUrl = `https://wa.me/${member.phone?.replace(/[^0-9]/g, "")}?text=Hi ${member.name}, I found your profile on NariShakti Co-Founder Connect. I'd love to discuss potential partnership opportunities!`;
              
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all"
                >
                  {/* Profile Image with Badge */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                          {member.name?.charAt(0)?.toUpperCase()}
                        </div>
                      </div>
                    )}
                    {member.commitment_type && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white text-gray-900 shadow-md capitalize font-semibold">
                          {member.commitment_type}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Name & Location */}
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{member.name}</h3>
                    {member.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                        <MapPin className="w-4 h-4" />
                        {member.location}
                      </div>
                    )}

                    {/* Experience */}
                    {member.years_experience > 0 && (
                      <div className="flex items-center gap-2 mb-4 text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm font-medium">{member.years_experience} years experience</span>
                      </div>
                    )}

                    {/* Skills */}
                    {member.skills && member.skills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {member.skills.slice(0, 4).map((skill, idx) => (
                            <Badge key={idx} className={`${skillColors[idx % skillColors.length]} text-xs font-medium rounded-full`}>
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Looking For */}
                    {member.looking_for && (
                      <div className="bg-rose-50 rounded-xl p-3 mb-4">
                        <p className="text-xs font-semibold text-rose-900 mb-1">Looking For</p>
                        <p className="text-sm text-rose-800 font-medium">{member.looking_for}</p>
                      </div>
                    )}

                    {/* Description */}
                    {member.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{member.description}</p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {member.phone && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button className="w-full font-semibold">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Connect
                          </Button>
                        </a>
                      )}
                      {member.pitch_video_url && (
                        <a
                          href={member.pitch_video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button variant="outline" className="w-full border-2 border-green-400 text-green-700 hover:bg-green-50 hover:border-green-500 font-semibold">
                            <Play className="w-4 h-4 mr-1" />
                            Pitch
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}