import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star, StarOff, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function AddToWatchlistButton({ pitch, investorEmail, variant = "default" }) {
  const [showDialog, setShowDialog] = useState(false);
  const [notes, setNotes] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const queryClient = useQueryClient();

  const { data: watchlistItems = [] } = useQuery({
    queryKey: ["watchlist", investorEmail],
    queryFn: () => base44.entities.InvestorWatchlistItem.filter({ investor_email: investorEmail }),
    enabled: !!investorEmail,
  });

  const isInWatchlist = watchlistItems.some(item => item.pitch_id === pitch.id);

  const addMutation = useMutation({
    mutationFn: (data) => base44.entities.InvestorWatchlistItem.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      setShowDialog(false);
      setNotes("");
      setReminderDate("");
      setPriority("medium");
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id) => base44.entities.InvestorWatchlistItem.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }),
  });

  const handleAddToWatchlist = () => {
    addMutation.mutate({
      investor_email: investorEmail,
      pitch_id: pitch.id,
      pitch_title: pitch.title,
      entrepreneur_name: pitch.created_by,
      notes,
      reminder_date: reminderDate || null,
      priority,
      status: "watching",
    });
  };

  const handleRemoveFromWatchlist = () => {
    const item = watchlistItems.find(item => item.pitch_id === pitch.id);
    if (item) {
      removeMutation.mutate(item.id);
    }
  };

  if (!investorEmail) return null;

  if (isInWatchlist) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={handleRemoveFromWatchlist}
        disabled={removeMutation.isPending}
        className="border-amber-300 text-amber-700 hover:bg-amber-50"
      >
        {removeMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <StarOff className="w-4 h-4 mr-2" />
            Remove from Watchlist
          </>
        )}
      </Button>
    );
  }

  return (
    <>
      <Button
        size="sm"
        variant={variant}
        onClick={() => setShowDialog(true)}
        className={variant === "default" ? "bg-amber-500 hover:bg-amber-600" : ""}
      >
        <Star className="w-4 h-4 mr-2" />
        Add to Watchlist
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Watchlist</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="font-bold text-gray-900 mb-1">{pitch.title}</h4>
              <p className="text-sm text-gray-500">by {pitch.created_by}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Follow-up Reminder (Optional)
              </label>
              <Input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Notes (Optional)
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your initial thoughts about this pitch..."
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAddToWatchlist}
                disabled={addMutation.isPending}
                className="flex-1 bg-amber-500 hover:bg-amber-600"
              >
                {addMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Add to Watchlist"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}