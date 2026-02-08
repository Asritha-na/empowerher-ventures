import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SuccessStoryCard from "@/components/home/SuccessStoryCard";

const successStories = [
  {
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=600&q=80",
    name: "Lakshmi Devi",
    business: "Handmade Bangles & Jewelry",
    description: "Started making traditional lac bangles from her village home. Now supplies to 15 cities with 20 women employed."
  },
  {
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    name: "Priya Sharma",
    business: "Textile & Embroidery",
    description: "Turned her grandmother's stitching skills into a flourishing business creating beautiful ethnic wear and home textiles."
  },
  {
    image: "https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=600&q=80",
    name: "Meera Patel",
    business: "Organic Pickles & Spices",
    description: "Her homemade pickles and spice blends are now sold across the country through online marketplaces."
  },
  {
    image: "https://images.unsplash.com/photo-1597742200037-aa4d3d70c846?w=600&q=80",
    name: "Sunita Kumari",
    business: "Handloom Weaving",
    description: "Revived the dying art of handloom weaving in her village, training 30+ women and exporting globally."
  },
  {
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&q=80",
    name: "Rani Begum",
    business: "Tailoring & Fashion",
    description: "From stitching clothes at home to running a boutique that creates modern designs inspired by traditional craft."
  },
  {
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80",
    name: "Kavita Singh",
    business: "Bamboo Craft & Decor",
    description: "Transforms bamboo into beautiful home décor pieces. Her products are featured in international craft fairs."
  }
];

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white" />
          <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-white" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm">
              <Sparkles className="w-4 h-4" />
              Welcome{user?.full_name ? `, ${user.full_name}` : ""}!
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Your Ideas Can Change the World
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Every great business started with a single idea. Share yours today and connect with investors who believe in you.
            </p>
            <Link
              to={createPageUrl("MyIdea")}
              className="inline-flex items-center gap-2 bg-white text-amber-700 font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-amber-50 transition-colors shadow-lg"
            >
              Share Your Idea
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-amber-600 font-medium mb-3">
            <Heart className="w-5 h-5" />
            Real Stories, Real Women
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Women Who Made It Happen
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto text-lg">
            Get inspired by women from rural areas who turned their skills into successful businesses
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {successStories.map((story, index) => (
            <SuccessStoryCard key={index} {...story} index={index} />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Women Empowered", value: "5,000+" },
              { label: "Ideas Funded", value: "1,200+" },
              { label: "Investors Active", value: "300+" },
              { label: "Villages Reached", value: "800+" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}