import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Play, BookOpen, Filter, GraduationCap, Languages } from "lucide-react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const topics = [
  { id: "all", label: "All" },
  { id: "pitching", label: "Pitching" },
  { id: "marketing", label: "Marketing" },
  { id: "finance", label: "Finance" },
  { id: "branding", label: "Branding" },
  { id: "digital", label: "Digital Skills" },
  { id: "motivation", label: "Motivation" },
];

const videos = [
  {
    id: "1",
    title: "How to Pitch Your Business Idea",
    channel: "TED",
    topic: "pitching",
    thumbnail: "https://img.youtube.com/vi/2b3xG_YjgvI/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=2b3xG_YjgvI",
    duration: "15 min",
  },
  {
    id: "2",
    title: "Marketing Strategies for Small Business",
    channel: "GaryVee",
    topic: "marketing",
    thumbnail: "https://img.youtube.com/vi/K1O3U-dSnuU/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=K1O3U-dSnuU",
    duration: "12 min",
  },
  {
    id: "3",
    title: "Understanding Basic Finance for Business",
    channel: "Khan Academy",
    topic: "finance",
    thumbnail: "https://img.youtube.com/vi/WEDIj9JBTC8/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=WEDIj9JBTC8",
    duration: "18 min",
  },
  {
    id: "4",
    title: "How to Build a Brand from Scratch",
    channel: "Business Insider",
    topic: "branding",
    thumbnail: "https://img.youtube.com/vi/sO4te2QNsHY/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=sO4te2QNsHY",
    duration: "10 min",
  },
  {
    id: "5",
    title: "Social Media Marketing for Beginners",
    channel: "Hubspot",
    topic: "digital",
    thumbnail: "https://img.youtube.com/vi/I2pwcAVonKI/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=I2pwcAVonKI",
    duration: "20 min",
  },
  {
    id: "6",
    title: "Women Entrepreneurs Success Stories",
    channel: "Inspiring Stories",
    topic: "motivation",
    thumbnail: "https://img.youtube.com/vi/QnrKSZP7vi4/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=QnrKSZP7vi4",
    duration: "14 min",
  },
  {
    id: "7",
    title: "How to Sell Anything to Anyone",
    channel: "Valuetainment",
    topic: "marketing",
    thumbnail: "https://img.youtube.com/vi/OhAEAaZPYUE/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=OhAEAaZPYUE",
    duration: "22 min",
  },
  {
    id: "8",
    title: "Perfect Business Pitch in 60 Seconds",
    channel: "Harvard Business",
    topic: "pitching",
    thumbnail: "https://img.youtube.com/vi/Tq0tan49rmc/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=Tq0tan49rmc",
    duration: "8 min",
  },
  {
    id: "9",
    title: "How to Use WhatsApp for Business",
    channel: "Digital Marketing",
    topic: "digital",
    thumbnail: "https://img.youtube.com/vi/T3R3_kxyNqo/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=T3R3_kxyNqo",
    duration: "16 min",
  },
];

export default function LearningHub() {
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const filtered = videos
    .filter((v) => selectedTopic === "all" || v.topic === selectedTopic)
    .filter(
      (v) =>
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.channel.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section - Exact Match */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-rose-500">Learning Hub</h1>
            <p className="text-gray-500 text-sm">Master the skills you need to build and grow your business</p>
          </div>
        </div>

        {/* Multilingual Learning Banner */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Languages className="w-6 h-6 text-white shrink-0 mt-0.5" />
            <div>
              <h2 className="text-white font-bold text-lg mb-1">Multilingual Learning</h2>
              <p className="text-white/95 text-sm">All courses available in Hindi, English, and regional languages. Learn at your own pace with video lessons!</p>
            </div>
          </div>
        </div>

        {/* Topic Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedTopic === topic.id
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 rounded-xl border-gray-200 bg-white"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 rounded-xl h-12 border-gray-200">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="shortest">Shortest</SelectItem>
              <SelectItem value="longest">Longest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Video Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-6 h-6 text-gray-900 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-violet-600 transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{video.channel}</span>
                    <Badge variant="secondary" className="bg-violet-50 text-violet-600 text-xs capitalize rounded-full">
                      {video.topic}
                    </Badge>
                  </div>
                </div>
              </a>
              
              {/* Related Videos Section */}
              <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">Related Videos:</p>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(video.title + ' ' + video.topic)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  Find more on YouTube →
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No videos found for this topic.</p>
          </div>
        )}
      </div>
    </div>
  );
}