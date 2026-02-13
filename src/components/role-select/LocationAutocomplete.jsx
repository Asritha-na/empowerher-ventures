import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";

// Temporary simulation: predefined Indian cities (no Google Maps dependency)
const CITIES = [
  "Hyderabad", "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata",
  "Pune", "Jaipur", "Ahmedabad", "Surat", "Lucknow", "Kanpur",
  "Nagpur", "Indore", "Bhopal", "Patna", "Vadodara", "Visakhapatnam"
];

function simulateCoords(city) {
  // Deterministic pseudo-random coords within India bounds
  let h = 0;
  for (let i = 0; i < city.length; i++) h = (h * 31 + city.charCodeAt(i)) >>> 0;
  const lat = 8 + (h % 2900) / 100;   // 8 .. 37
  const lng = 68 + (Math.floor(h / 97) % 2900) / 100; // 68 .. 97
  return { lat: Number(lat.toFixed(5)), lng: Number(lng.toFixed(5)) };
}

export default function LocationAutocomplete() {
  const inputRef = useRef(null);
  const [status, setStatus] = useState("Location autocomplete is currently simulated for demo purposes. Real Google Maps API integration will be enabled in production.");
  const [ready, setReady] = useState(true);
  const [value, setValue] = useState("");
  const [filtered, setFiltered] = useState(CITIES);

  const onChange = (e) => {
    const v = e.target.value;
    setValue(v);
    const f = CITIES.filter((c) => c.toLowerCase().includes(v.toLowerCase())).slice(0, 10);
    setFiltered(f.length ? f : CITIES.slice(0, 10));
  };

  const trySelect = async (text) => {
    const city = CITIES.find((c) => c.toLowerCase() === text.trim().toLowerCase());
    if (!city) return; // only act on known cities
    const { lat, lng } = simulateCoords(city);
    const data = {
      location_formatted: city,
      location_city: city,
      location_latitude: lat,
      location_longitude: lng,
    };
    const isAuthed = await base44.auth.isAuthenticated().catch(() => false);
    if (isAuthed) {
      await base44.auth.updateMe(data);
    } else {
      sessionStorage.setItem("location_data", JSON.stringify(data));
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      trySelect(value);
    }
  };

  const onBlur = () => {
    trySelect(value);
  };

  useEffect(() => {
    // Simulation mode: no external scripts loaded
    setReady(true);
  }, []);

  return (
    <div>
      <label className="block text-sm text-pink-100 mb-2">Set your location</label>
      <Input
        ref={inputRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        placeholder={ready ? "Start typing your address..." : "Loading Google Autocomplete..."}
        disabled={!ready}
        className="bg-white/90 border-white/30 text-gray-900 placeholder:text-gray-500"
        list="city-list"
        autoComplete="off"
      />
      <datalist id="city-list">
        {filtered.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      {status && <p className="mt-2 text-xs text-pink-200">{status}</p>}
    </div>
  );
}