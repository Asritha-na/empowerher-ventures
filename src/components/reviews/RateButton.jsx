import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

export default function RateButton({ targetUserId, disabled }) {
  const qc = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [me, setMe] = React.useState(null);
  const [rating, setRating] = React.useState(5);
  const [text, setText] = React.useState("");

  React.useEffect(() => { base44.auth.me().then(setMe).catch(() => {}); }, []);

  const { data: existing = null } = useQuery({
    queryKey: ["review", me?.id, targetUserId],
    enabled: !!me?.id && !!targetUserId && open,
    queryFn: async () => {
      const rows = await base44.entities.Review.filter({ reviewer_id: me.id, target_user_id: targetUserId }, "-created_date", 1);
      return rows?.[0] || null;
    }
  });

  React.useEffect(() => {
    if (existing) { setRating(existing.rating || 5); setText(existing.review_text || ""); }
  }, [existing]);

  const upsertMutation = useMutation({
    mutationFn: async () => {
      if (!me?.id || !targetUserId || !rating) return;
      const rows = await base44.entities.Review.filter({ reviewer_id: me.id, target_user_id: targetUserId }, "-created_date", 1);
      const payload = { reviewer_id: me.id, target_user_id: targetUserId, rating: Number(rating), review_text: text || "", created_at: new Date().toISOString() };
      if (rows?.length) return base44.entities.Review.update(rows[0].id, payload);
      return base44.entities.Review.create(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews-all"] });
      qc.invalidateQueries({ queryKey: ["reviews", targetUserId] });
      setOpen(false);
    }
  });

  const StarPicker = () => (
    <div className="flex items-center gap-2">
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1;
        const filled = n <= rating;
        return (
          <button key={n} type="button" onClick={() => setRating(n)} className="p-1">
            <Star width={24} height={24} strokeWidth={1.5} fill={filled ? "#FBBF24" : "none"} color="#F59E0B" />
          </button>
        );
      })}
      <span className="text-sm text-gray-600">{rating}/5</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="bg-amber-500 hover:bg-amber-600 text-white rounded-2xl w-full">Rate</Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <StarPicker />
          <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Share your experience (optional)" className="min-h-24" />
        </div>
        <DialogFooter>
          <Button onClick={() => upsertMutation.mutate()} className="bg-[#8B1E1E] hover:opacity-90 rounded-2xl">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}