import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const entrepreneurs = [
  {
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/5218d7148_image.png",
    name: "Kamala & Savita",
    business: "Traditional Bangle Making",
    story: "Started with just ₹500 and basic tools. Now they create stunning glass bangles and train 15 women in their village. Their designs are sold across 8 states and have become a symbol of hope for rural artisans."
  },
  {
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/a5c4ef058_image.png",
    name: "Geeta & Amma",
    business: "Tailoring & Embroidery",
    story: "Two generations, one dream. Grandmother taught her granddaughter the art of stitching. Today, they run a successful tailoring business from home, creating beautiful sarees and training young girls in the village."
  },
  {
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/4608cbb98_image.png",
    name: "Sunita Devi",
    business: "Madhubani Art & Crafts",
    story: "From painting walls to painting canvases. Sunita turned her traditional Madhubani art into a thriving business. Her artworks are now exported internationally, providing income for 20+ village artists."
  },
  {
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/b833c41f7_image.png",
    name: "Collective Sisters",
    business: "Handicraft Cooperative",
    story: "Four women came together to form a handicraft collective. They create embroidered textiles, bags, and home décor. Their cooperative now supports 30 families and has become a model for other villages."
  }
];

export default function EntrepreneurCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % entrepreneurs.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return entrepreneurs.length - 1;
      if (next >= entrepreneurs.length) return 0;
      return next;
    });
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      paginate(1);
    }
    if (touchStartX.current - touchEndX.current < -50) {
      paginate(-1);
    }
  };

  return (
    <div 
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-[500px] md:h-[600px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0"
          >
            <div className="relative h-full w-full">
              {/* Image */}
              <div className="absolute inset-0">
                <img
                  src={entrepreneurs[currentIndex].image}
                  alt={entrepreneurs[currentIndex].name}
                  className="w-full h-full object-cover"
                />
                {/* Dark overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-3xl"
                >
                  <div className="inline-block px-4 py-1.5 bg-amber-500/90 backdrop-blur-sm rounded-full text-sm font-medium mb-3">
                    {entrepreneurs[currentIndex].business}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
                    {entrepreneurs[currentIndex].name}
                  </h2>
                  <p className="text-base md:text-lg text-gray-200 leading-relaxed max-w-2xl">
                    {entrepreneurs[currentIndex].story}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <Button
          onClick={() => paginate(-1)}
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          onClick={() => paginate(1)}
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {entrepreneurs.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-amber-500"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}