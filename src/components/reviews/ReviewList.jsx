import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import StarRating from "./StarRating";

export default function ReviewList({ targetUserId }) {
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
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
        <StarRating value={avg} count={reviews.length} />
      </div>
      {reviews.length === 0 ? (
        <p className="text-sm text-gray-600">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between">
                <StarRating value={r.rating} />
                <span className="text-xs text-gray-500">{new Date(r.created_at || r.created_date).toLocaleDateString()}</span>
              </div>
              {r.review_text && <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{r.review_text}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}