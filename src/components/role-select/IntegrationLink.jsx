import React from "react";
import { Button } from "@/components/ui/button";

export default function IntegrationLink({ url }) {
  return (
    <div className="glass-card rounded-2xl border border-white/20 p-3 flex items-center justify-between">
      <div>
        <p className="text-white text-sm font-medium">Google Maps Autocomplete Integration</p>
        <p className="text-xs text-pink-200/80">Manage or view this integration in Base44</p>
      </div>
      <Button
        asChild
        className="bg-white text-[#8B1E1E] hover:bg-gray-100 rounded-full h-8 px-4"
      >
        <a href={url} target="_blank" rel="noreferrer">Open</a>
      </Button>
    </div>
  );
}