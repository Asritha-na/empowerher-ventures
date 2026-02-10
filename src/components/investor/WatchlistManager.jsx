import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Star, Trash2, Calendar, Edit2, Save, X, Bell } from "lucide-react";
import { format } from "date-fns";

export default function WatchlistManager({ investorEmail }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const queryClient = useQueryClient();

  const { data: watchlistItems = [] } = useQuery({
    queryKey: ["watchlist", investorEmail],
    queryFn: () => base44.entities.InvestorWatchlistItem.filter({ investor_email: investorEmail }),
    enabled: !!investorEmail,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.InvestorWatchlistItem.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
      setEditingId(null);
      setEditData({});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.InvestorWatchlistItem.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }),
  });

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditData({
      notes: item.notes || "",
      reminder_date: item.reminder_date || "",
      status: item.status || "watching",
      priority: item.priority || "medium",
    });
  };

  const saveEdit = (id) => {
    updateMutation.mutate({ id, data: editData });
  };

  const statusColors = {
    watching: "bg-blue-100 text-blue-800",
    contacted: "bg-yellow-100 text-yellow-800",
    meeting_scheduled: "bg-purple-100 text-purple-800",
    invested: "bg-green-100 text-green-800",
    passed: "bg-gray-100 text-gray-800",
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-red-100 text-red-700",
  };

  if (watchlistItems.length === 0) {
    return (
      <Card className="border-none shadow-md">
        <CardContent className="p-8 text-center">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Your Watchlist is Empty</h3>
          <p className="text-sm text-gray-500">
            Add pitches to your watchlist to track opportunities and set follow-up reminders
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {watchlistItems.map((item) => {
        const isEditing = editingId === item.id;
        const isReminderDue = item.reminder_date && new Date(item.reminder_date) <= new Date();

        return (
          <Card key={item.id} className={`border-none shadow-md ${isReminderDue ? "border-2 border-red-400" : ""}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{item.pitch_title}</h4>
                  <p className="text-sm text-gray-600">by {item.entrepreneur_name}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={statusColors[item.status]}>
                      {item.status.replace(/_/g, " ")}
                    </Badge>
                    <Badge className={priorityColors[item.priority]}>
                      {item.priority} priority
                    </Badge>
                    {isReminderDue && (
                      <Badge className="bg-red-100 text-red-700 animate-pulse">
                        <Bell className="w-3 h-3 mr-1" />
                        Follow-up Due
                      </Badge>
                    )}
                  </div>
                </div>
                {!isEditing && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(item)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 p-2"
                    >
                      <option value="watching">Watching</option>
                      <option value="contacted">Contacted</option>
                      <option value="meeting_scheduled">Meeting Scheduled</option>
                      <option value="invested">Invested</option>
                      <option value="passed">Passed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Priority</label>
                    <select
                      value={editData.priority}
                      onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 p-2"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Follow-up Reminder
                    </label>
                    <Input
                      type="date"
                      value={editData.reminder_date}
                      onChange={(e) => setEditData({ ...editData, reminder_date: e.target.value })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Notes</label>
                    <Textarea
                      value={editData.notes}
                      onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                      placeholder="Add your notes about this pitch..."
                      rows={4}
                      className="w-full"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => saveEdit(item.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingId(null)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {item.notes && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.notes}</p>
                    </div>
                  )}
                  {item.reminder_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Follow-up: {format(new Date(item.reminder_date), "MMM d, yyyy")}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}