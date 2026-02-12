import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";

const defaultStories = [
  {
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/7f6fbba2a_image.png",
    name: "Rural Entrepreneur",
    business: "Self-Help Group Enterprise",
    location: "Rajasthan, IN",
    funding: "Community-backed",
    quote: "Building sustainable income for my family and village.",
    description: "Local craft and micro-enterprise led by rural women."
  },
  {
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/5ee836ab0_image.png",
    name: "Rural Entrepreneur",
    business: "Cottage Industry",
    location: "Maharashtra, IN",
    funding: "Microfinance supported",
    quote: "Every order helps us train and employ more women.",
    description: "Grassroots venture growing with digital tools."
  },
  {
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/ef2755ded_image.png",
    name: "Rural Entrepreneur",
    business: "Agri & Handmade Goods",
    location: "West Bengal, IN",
    funding: "Seed capital raised",
    quote: "Shakti connected me with mentors and buyers.",
    description: "Small business scaling through local networks."
  }
];


export default function SuccessStoriesCarousel({ stories = defaultStories }) {
  const [index, setIndex] = React.useState(0);

  const prev = () => setIndex((i) => (i - 1 + stories.length) % stories.length);
  const next = () => setIndex((i) => (i + 1) % stories.length);

  const current = stories[index];

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          aria-label="Previous"
          onClick={prev}
          className="p-2 rounded-full border border-gray-200 hover:bg-gray-50">

          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-sm text-gray-500">
          {index + 1} / {stories.length}
        </div>
        <button
          aria-label="Next"
          onClick={next}
          className="p-2 rounded-full border border-gray-200 hover:bg-gray-50">

          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-white">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-72 md:h-full">
            <AnimatePresence mode="wait">
              <motion.img
                key={current.image}
                src={current.image}
                alt={current.name}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35 }}
                className="w-full h-full object-cover" />

            </AnimatePresence>
          </div>
          <div className="bg-red-300 p-6 md:p-8">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{current.business}</span>
              <span>•</span>
              <span>{current.location}</span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">{current.funding}</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900">{current.name}</h4>
            <p className="mt-3 text-gray-600">{current.description}</p>
            <div className="mt-6 flex items-start gap-3 text-gray-700">
              <Quote className="w-5 h-5 text-gray-400 mt-1" />
              <p className="italic">“{current.quote}”</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {stories.map((_, i) =>
        <button
          key={i}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => setIndex(i)}
          className={`h-2 w-2 rounded-full ${i === index ? "bg-gray-900" : "bg-gray-300"}`} />

        )}
      </div>
    </div>);

}