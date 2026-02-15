import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import StarRating from "./StarRating";

export default function RatingSummary({ targetUserId, className = "" }) {
  const qc = useQueryClient();
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", targetUserId],
    enabled: !!targetUserId,
    queryFn: () => base44.entities.Review.filter({ target_user_id: targetUserId }, "-created_date", 100),
    initialData: [],
  });

  React.useEffect(() => {
    const unsub = base44.entities.Review.subscribe(() => {
      qc.invalidateQueries({ queryKey: ["reviews", targetUserId] });
    });
    return () => unsub();
  }, [qc, targetUserId]);

  const avg = reviews.length ? (reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviews.length) : 0;

  return (
    <div className={className}>
      <StarRating value={avg} count={reviews.length} />
    </div>
  );
}