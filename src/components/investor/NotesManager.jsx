import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StickyNote, Plus, Trash2, Clock } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";

export default function NotesManager({ investorEmail, relatedToType, relatedToId, relatedToName }) {
  const [showDialog, setShowDialog] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [tags, setTags] = useState("");
  const queryClient = useQueryClient();

  const { data: notes = [] } = useQuery({
    queryKey: ["notes", investorEmail, relatedToId],
    queryFn: () => base44.entities.InvestorNote.filter({ 
      investor_email: investorEmail,
      related_to_id: relatedToId 
    }),
    enabled: !!investorEmail && !!relatedToId,
  });

  const addMutation = useMutation({
    mutationFn: (data) => base44.entities.InvestorNote.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setNewNote("");
      setTags("");
      setShowDialog(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.InvestorNote.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    addMutation.mutate({
      investor_email: investorEmail,
      related_to_type: relatedToType,
      related_to_id: relatedToId,
      related_to_name: relatedToName,
      note: newNote,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
    });
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setShowDialog(true)}
        className="gap-2"
      >
        <StickyNote className="w-4 h-4" />
        Notes ({notes.length})
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Notes for {relatedToName}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Add New Note */}
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write a new note..."
                rows={3}
              />
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (comma-separated, optional)"
                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
              />
              <Button
                onClick={handleAddNote}
                disabled={addMutation.isPending || !newNote.trim()}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </div>

            {/* Existing Notes */}
            <div className="space-y-3">
              {notes.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No notes yet</p>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {format(new Date(note.created_date), "MMM d, yyyy 'at' h:mm a")}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(note.id)}
                        className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap mb-2">{note.note}</p>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {note.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}