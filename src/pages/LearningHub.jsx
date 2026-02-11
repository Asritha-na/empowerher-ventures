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

const indianLanguages = [
  { code: "all", name: "All Languages" },
  { code: "hi", name: "Hindi (हिंदी)" },
  { code: "en", name: "English" },
  { code: "bn", name: "Bengali (বাংলা)" },
  { code: "te", name: "Telugu (తెలుగు)" },
  { code: "mr", name: "Marathi (मराठी)" },
  { code: "ta", name: "Tamil (தமிழ்)" },
  { code: "gu", name: "Gujarati (ગુજરાતી)" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
  { code: "ml", name: "Malayalam (മലയാളം)" },
  { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
  { code: "or", name: "Odia (ଓଡ଼ିଆ)" },
  { code: "as", name: "Assamese (অসমীয়া)" },
  { code: "ur", name: "Urdu (اردو)" },
  { code: "ks", name: "Kashmiri (کٲشُر)" },
  { code: "sd", name: "Sindhi (سنڌي)" },
  { code: "sa", name: "Sanskrit (संस्कृतम्)" },
  { code: "ne", name: "Nepali (नेपाली)" },
  { code: "mai", name: "Maithili (मैथिली)" },
  { code: "kok", name: "Konkani (कोंकणी)" },
  { code: "mni", name: "Manipuri (মৈতৈলোন্)" },
  { code: "sat", name: "Santali (ᱥᱟᱱᱛᱟᱲᱤ)" },
  { code: "doi", name: "Dogri (डोगरी)" },
  { code: "bho", name: "Bhojpuri (भोजपुरी)" },
];

const playlists = [
  {
    id: "p1",
    title: "Complete Business Fundamentals",
    description: "Learn all essential business skills from scratch",
    topic: "pitching",
    level: "beginner",
    languages: ["hi", "en"],
    videoCount: 12,
    duration: "3 hours",
    thumbnail: "https://img.youtube.com/vi/2b3xG_YjgvI/hqdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf",
  },
  {
    id: "p2",
    title: "Advanced Marketing Masterclass",
    description: "Master digital marketing and sales strategies",
    topic: "marketing",
    level: "pro",
    languages: ["hi", "en", "mr"],
    videoCount: 20,
    duration: "6 hours",
    thumbnail: "https://img.youtube.com/vi/K1O3U-dSnuU/hqdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf",
  },
  {
    id: "p3",
    title: "Financial Planning for Startups",
    description: "Understand finances, budgeting, and fundraising",
    topic: "finance",
    level: "intermediate",
    languages: ["hi", "en", "ta", "te"],
    videoCount: 15,
    duration: "4.5 hours",
    thumbnail: "https://img.youtube.com/vi/WEDIj9JBTC8/hqdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf",
  },
  {
    id: "p4",
    title: "Brand Building Essentials",
    description: "Create a strong brand identity from day one",
    topic: "branding",
    level: "beginner",
    languages: ["hi", "en", "gu"],
    videoCount: 8,
    duration: "2 hours",
    thumbnail: "https://img.youtube.com/vi/sO4te2QNsHY/hqdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf",
  },
  {
    id: "p5",
    title: "Social Media Growth Hacks",
    description: "Grow your business using social platforms",
    topic: "digital",
    level: "intermediate",
    languages: ["hi", "en", "bn", "pa"],
    videoCount: 18,
    duration: "5 hours",
    thumbnail: "https://img.youtube.com/vi/I2pwcAVonKI/hqdefault.jpg",
    playlistUrl: "https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf",
  },
];

const videos = [
  {
    id: "1",
    title: "How to Pitch Your Business Idea",
    channel: "TED",
    topic: "pitching",
    level: "beginner",
    languages: ["en", "hi"],
    thumbnail: "https://img.youtube.com/vi/2b3xG_YjgvI/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=2b3xG_YjgvI",
    duration: "15 min",
  },
  {
    id: "2",
    title: "Marketing Strategies for Small Business",
    channel: "GaryVee",
    topic: "marketing",
    level: "intermediate",
    languages: ["en", "hi", "mr"],
    thumbnail: "https://img.youtube.com/vi/K1O3U-dSnuU/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=K1O3U-dSnuU",
    duration: "12 min",
  },
  {
    id: "3",
    title: "Understanding Basic Finance for Business",
    channel: "Khan Academy",
    topic: "finance",
    level: "beginner",
    languages: ["en", "hi", "ta"],
    thumbnail: "https://img.youtube.com/vi/WEDIj9JBTC8/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=WEDIj9JBTC8",
    duration: "18 min",
  },
  {
    id: "4",
    title: "How to Build a Brand from Scratch",
    channel: "Business Insider",
    topic: "branding",
    level: "pro",
    languages: ["en", "hi"],
    thumbnail: "https://img.youtube.com/vi/sO4te2QNsHY/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=sO4te2QNsHY",
    duration: "10 min",
  },
  {
    id: "5",
    title: "Social Media Marketing for Beginners",
    channel: "Hubspot",
    topic: "digital",
    level: "beginner",
    languages: ["en", "hi", "bn"],
    thumbnail: "https://img.youtube.com/vi/I2pwcAVonKI/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=I2pwcAVonKI",
    duration: "20 min",
  },
  {
    id: "6",
    title: "Women Entrepreneurs Success Stories",
    channel: "Inspiring Stories",
    topic: "motivation",
    level: "beginner",
    languages: ["en", "hi", "te", "ta"],
    thumbnail: "https://img.youtube.com/vi/QnrKSZP7vi4/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=QnrKSZP7vi4",
    duration: "14 min",
  },
  {
    id: "7",
    title: "How to Sell Anything to Anyone",
    channel: "Valuetainment",
    topic: "marketing",
    level: "pro",
    languages: ["en", "hi"],
    thumbnail: "https://img.youtube.com/vi/OhAEAaZPYUE/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=OhAEAaZPYUE",
    duration: "22 min",
  },
  {
    id: "8",
    title: "Perfect Business Pitch in 60 Seconds",
    channel: "Harvard Business",
    topic: "pitching",
    level: "intermediate",
    languages: ["en", "hi", "gu"],
    thumbnail: "https://img.youtube.com/vi/Tq0tan49rmc/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=Tq0tan49rmc",
    duration: "8 min",
  },
  {
    id: "9",
    title: "How to Use WhatsApp for Business",
    channel: "Digital Marketing",
    topic: "digital",
    level: "intermediate",
    languages: ["en", "hi", "kn", "ml"],
    thumbnail: "https://img.youtube.com/vi/T3R3_kxyNqo/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=T3R3_kxyNqo",
    duration: "16 min",
  },
];

export default function LearningHub() {
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [viewMode, setViewMode] = useState("videos"); // "videos" or "playlists"

  const filteredVideos = videos
    .filter((v) => selectedTopic === "all" || v.topic === selectedTopic)
    .filter((v) => selectedLanguage === "all" || v.languages.includes(selectedLanguage))
    .filter((v) => selectedLevel === "all" || v.level === selectedLevel)
    .filter(
      (v) =>
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.channel.toLowerCase().includes(search.toLowerCase())
    );

  const filteredPlaylists = playlists
    .filter((p) => selectedTopic === "all" || p.topic === selectedTopic)
    .filter((p) => selectedLanguage === "all" || p.languages.includes(selectedLanguage))
    .filter((p) => selectedLevel === "all" || p.level === selectedLevel)
    .filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    );

  const getLevelColor = (level) => {
    const colors = {
      beginner: "bg-green-100 text-green-700",
      intermediate: "bg-yellow-100 text-yellow-700",
      pro: "bg-orange-100 text-orange-700",
    };
    return colors[level] || "bg-gray-100 text-gray-700";
  };

  const getRelatedPlaylists = (currentTopic) => {
    return playlists.filter(p => p.topic === currentTopic).slice(0, 2);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section - Exact Match */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-900 to-blue-800 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">Learning Hub</h1>
            <p className="text-gray-500 text-sm">Master the skills you need to build and grow your business</p>
          </div>
        </div>

        {/* Multilingual Learning Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-700 rounded-2xl p-6 mb-8">
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
                  ? "bg-gradient-to-r from-indigo-900 to-blue-800 text-white shadow-md"
                  : "glass-card text-gray-700"
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode("videos")}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
              viewMode === "videos"
                ? "bg-gradient-to-r from-indigo-900 to-blue-800 text-white shadow-md"
                : "glass-card text-gray-700"
            }`}
          >
            Individual Videos
          </button>
          <button
            onClick={() => setViewMode("playlists")}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
              viewMode === "playlists"
                ? "bg-gradient-to-r from-indigo-900 to-blue-800 text-white shadow-md"
                : "glass-card text-gray-700"
            }`}
          >
            Course Playlists
          </button>
        </div>

        {/* Filters */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="rounded-xl h-12 border-gray-200">
              <Languages className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {indianLanguages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="rounded-xl h-12 border-gray-200">
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="pro">Professional</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 rounded-xl border-gray-200 bg-white"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="rounded-xl h-12 border-gray-200">
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

        {/* Videos View */}
        {viewMode === "videos" && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video, i) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group glass-card rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <a href={video.url} target="_blank" rel="noopener noreferrer">
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
                      <div className="absolute top-2 left-2">
                        <Badge className={`${getLevelColor(video.level)} text-xs font-bold uppercase`}>
                          {video.level}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-rose-600 transition-colors">
                        {video.title}
                      </h3>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">{video.channel}</span>
                        <Badge variant="secondary" className="bg-violet-50 text-violet-600 text-xs capitalize rounded-full">
                          {video.topic}
                        </Badge>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {video.languages.slice(0, 3).map((lang) => (
                          <span key={lang} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {indianLanguages.find(l => l.code === lang)?.name.split(" ")[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>
                  
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

            {filteredVideos.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No videos found matching your filters.</p>
              </div>
            )}
          </>
        )}

        {/* Playlists View */}
        {viewMode === "playlists" && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredPlaylists.map((playlist, i) => {
                const relatedPlaylists = getRelatedPlaylists(playlist.topic).filter(p => p.id !== playlist.id);
                
                return (
                  <motion.div
                    key={playlist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                      <img
                        src={playlist.thumbnail}
                        alt={playlist.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <Badge className={`${getLevelColor(playlist.level)} text-xs font-bold uppercase`}>
                          {playlist.level}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <p className="text-xs mb-1">{playlist.videoCount} videos • {playlist.duration}</p>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{playlist.title}</h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{playlist.description}</p>
                      
                      <div className="flex gap-1 flex-wrap mb-4">
                        {playlist.languages.map((lang) => (
                          <span key={lang} className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-medium">
                            {indianLanguages.find(l => l.code === lang)?.name.split(" ")[0]}
                          </span>
                        ))}
                      </div>

                      <a
                        href={playlist.playlistUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-900 to-blue-800 hover:from-indigo-800 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all mb-3"
                      >
                        <Play className="w-5 h-5" />
                        Watch Course
                      </a>

                      {relatedPlaylists.length > 0 && (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-xs font-semibold text-gray-500 mb-2">Related Playlists:</p>
                          <div className="space-y-1">
                            {relatedPlaylists.map((related) => (
                              <a
                                key={related.id}
                                href={related.playlistUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1 hover:underline"
                              >
                                <Play className="w-3 h-3" />
                                {related.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredPlaylists.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No playlists found matching your filters.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}