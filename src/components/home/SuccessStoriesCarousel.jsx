import React, { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const successStories = [
  {
    id: 1,
    name: "Priya Sharma",
    businessType: "Textiles",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    quote: "Shakti helped me connect with investors who believed in my handloom business. Today, I employ 25 women from my village.",
    metric: "₹4.5L raised • 25 employees"
  },
  {
    id: 2,
    name: "Anjali Patel",
    businessType: "Food & Catering",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop",
    quote: "From my kitchen to 3 cities! The AI coaching and investor network transformed my home-based catering into a thriving enterprise.",
    metric: "₹2.5L raised • 150+ customers"
  },
  {
    id: 3,
    name: "Meera Reddy",
    businessType: "Handicrafts",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    quote: "The platform gave me the confidence to pitch my pottery business. Now I'm exporting to international markets.",
    metric: "₹6L raised • 3 countries"
  },
  {
    id: 4,
    name: "Sunita Kumar",
    businessType: "Agriculture",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop",
    quote: "With Shakti's support, my organic farming venture now supplies to 50+ retail stores across the state.",
    metric: "₹8L raised • 50+ stores"
  },
  {
    id: 5,
    name: "Kavita Singh",
    businessType: "Tech Solutions",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop",
    quote: "Shakti connected me with mentors who helped scale my tech startup. We've now launched in 5 cities.",
    metric: "₹12L raised • 5 cities"
  }
];

export default function SuccessStoriesCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: "start",
    skipSnaps: false,
    slidesToScroll: 1
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
    
    // Auto-scroll every 4 seconds
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {successStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-[0_0_100%] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] min-w-0"
            >
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-6 h-full">
                {/* Profile Section */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{story.name}</h3>
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      {story.businessType}
                    </span>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  "{story.quote}"
                </p>

                {/* Metric */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-[#8B1E1E]">{story.metric}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === selectedIndex ? "bg-[#8B1E1E] w-8" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}