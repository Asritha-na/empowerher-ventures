import React from "react";
import { Star } from "lucide-react";

export default function StarRating({ value = 0, count = 0, size = 16, className = "" }) {
  const full = Math.floor(Number(value) || 0);
  const stars = Array.from({ length: 5 }, (_, i) => i < full);
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {stars.map((filled, idx) => (
        <Star key={idx} className="" width={size} height={size} strokeWidth={1.5} fill={filled ? "#FBBF24" : "none"} color={filled ? "#F59E0B" : "#F59E0B"} />
      ))}
      <span className="ml-1 text-xs text-gray-600">{Number(value || 0).toFixed(1)} ({count})</span>
    </div>
  );
}