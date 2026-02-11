import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Loader2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SuccessStoriesCarousel from "@/components/landing/SuccessStoriesCarousel";

export default function Dashboard() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    base44.auth.me().then((u) => {
      setUserName(u?.full_name || "");
    }).catch(() => {});
  }, []);

  const goToMyIdea = () => {
    window.location.href = createPageUrl("MyIdea");
  };

  return (
    <div className="p-6 md:p-8">
      <div className="gradient-hero rounded-3xl text-white p-8 md:p-12 shadow-lg relative overflow-hidden">
        <div className="mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
            {`Welcome${userName ? ", " + userName + "!" : "!"}`}
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight max-w-3xl">
          Transform Your Ideas into Thriving Enterprises
        </h1>
        <p className="mt-4 text-pink-50/90 max-w-2xl">
          Every great business started with a single idea. Share yours today and connect with investors who believe in you.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button onClick={goToMyIdea} className="bg-white text-[#8B1E1E] hover:bg-gray-100 rounded-full px-6 h-11">
            Get Started
          </Button>
          <Button variant="outline" onClick={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")} className="bg-white/10 hover:bg-white/20 border-white/40 text-white rounded-full px-6 h-11">
            <PlayCircle className="w-4 h-4 mr-2" />
            Watch Demo
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <SuccessStoriesCarousel />
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-white/70 backdrop-blur shadow-md">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold">24/7</div>
          <div className="text-gray-700">
            <div className="font-semibold">Support</div>
            <div className="text-sm">1800-123-4567</div>
          </div>
        </div>
      </div>
    </div>
  );
}