import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Briefcase, TrendingUp, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

const categories = ["all", "handicrafts", "textiles", "food", "agriculture", "retail", "services", "other"];

export default function InvestorPitches() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const { data: pitches = [], isLoading } = useQuery({
    queryKey: ["all-pitches"],
    queryFn: () => base44.entities.Pitch.list("-created_date", 100),
  });

  const filteredPitches = pitches.filter((pitch) => {
    const matchesSearch = pitch.title?.toLowerCase().includes(search.toLowerCase()) ||
      pitch.structured_pitch?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || pitch.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Explore Pitches</h1>
          <p className="text-gray-600">Discover innovative business ideas from women entrepreneurs</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search pitches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 rounded-xl"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-48 h-12 rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.slice(1).map((cat) => (
                <SelectItem key={cat} value={cat} className="capitalize">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pitches Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading pitches...</p>
          </div>
        ) : filteredPitches.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No pitches found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPitches.map((pitch, i) => (
              <motion.div
                key={pitch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-none shadow-md hover:shadow-xl transition-all h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
                        {pitch.created_by?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{pitch.title}</h3>
                        <p className="text-xs text-gray-500">{pitch.created_by}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {pitch.structured_pitch || pitch.raw_speech || "No description available"}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {pitch.category && (
                        <Badge variant="outline" className="capitalize">
                          {pitch.category}
                        </Badge>
                      )}
                      {pitch.status && (
                        <Badge variant="secondary" className="capitalize">
                          {pitch.status}
                        </Badge>
                      )}
                    </div>

                    {pitch.funding_needed && (
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">Funding needed</span>
                        <span className="font-bold text-blue-600">
                          ₹{pitch.funding_needed.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <Button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-xl">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}