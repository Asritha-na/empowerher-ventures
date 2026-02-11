import React from "react";
import { MapPin, Search } from "lucide-react";

export default function StickySearchBar() {
  const [location, setLocation] = React.useState("");
  const [query, setQuery] = React.useState("");

  const detectLocation = async () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setLocation(`${latitude.toFixed(3)}, ${longitude.toFixed(3)}`);
    });
  };

  return (
    <div className="rounded-2xl bg-white/90 backdrop-blur border border-white/30 shadow-lg p-2 flex flex-col md:flex-row gap-2">
      <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-3 h-12 border border-gray-200">
        <MapPin className="w-5 h-5 text-gray-500" />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Set your location to personalize content"
          className="flex-1 outline-none text-sm"
        />
        <button onClick={detectLocation} className="text-xs text-gray-600 hover:text-gray-900">Detect</button>
      </div>
      <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-3 h-12 border border-gray-200">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ideas, investors, learning..."
          className="flex-1 outline-none text-sm"
        />
        <button className="text-sm font-medium text-white bg-[#8B1E1E] hover:bg-[#751818] rounded-lg px-4 h-8">Search</button>
      </div>
    </div>
  );
}