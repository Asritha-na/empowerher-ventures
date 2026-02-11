import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const successStories = [
  {
    id: 1,
    category: "Handicraft Cooperative",
    title: "Collective Sisters",
    description: "Four women came together to form a handicraft collective. They create embroidered textiles, bags, and home décor. Their cooperative now supports 30 families and has become a model for neighboring villages.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/9186105cf_WhatsAppImage2026-02-11at20335PM.jpg"
  },
  {
    id: 2,
    category: "Tailoring & Embroidery",
    title: "Geeta & Amma",
    description: "Two generations, one dream. Grandmother taught her granddaughter the art of stitching. Today, they run a successful tailoring business from home, creating beautiful sarees and training young girls in the village.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/c2404b3a7_WhatsAppImage2026-02-11at20342PM.jpg"
  },
  {
    id: 3,
    category: "Traditional Bangle Making",
    title: "Kamala & Savita",
    description: "Started with just ₹500 and basic tools. Now they create stunning glass bangles and train 15 women in their village. Their designs are sold across 8 states and have become a symbol of hope for rural artisans.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/cc2c93dd0_WhatsAppImage2026-02-11at20350PM.jpg"
  }
];

export default function SuccessStoriesCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: "center"
  });

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    
    // Auto-scroll every 5 seconds
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full">
      {/* Navigation Buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-800 hover:bg-white transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-800 hover:bg-white transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Carousel */}
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {successStories.map((story) => (
            <div
              key={story.id}
              className="flex-[0_0_100%] min-w-0 relative"
            >
              {/* Background Image with Gradient Overlay */}
              <div className="relative h-[500px] md:h-[600px] w-full">
                <img
                  src={story.image}
                  alt={story.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-8 md:p-16">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl"
                  >
                    {/* Category Badge */}
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold rounded-full mb-4">
                      {story.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                      {story.title}
                    </h3>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-white/95 leading-relaxed mb-6">
                      {story.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === selectedIndex 
                ? "bg-gradient-to-r from-orange-500 to-amber-500 w-8" 
                : "bg-gray-300 w-2"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}