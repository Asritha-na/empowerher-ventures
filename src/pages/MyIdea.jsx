import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Sparkles, Loader2, Send, FileText, Trash2, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SpeechRecorder from "@/components/idea/SpeechRecorder";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const categories = [
  { value: "handicrafts", label: "🎨 Handicrafts" },
  { value: "textiles", label: "🧵 Textiles & Clothing" },
  { value: "food", label: "🍳 Food & Cooking" },
  { value: "agriculture", label: "🌾 Agriculture" },
  { value: "retail", label: "🛍️ Retail & Shop" },
  { value: "services", label: "💼 Services" },
  { value: "other", label: "📦 Other" },
];

export default function MyIdea() {
  const [title, setTitle] = useState("");
  const [speechText, setSpeechText] = useState("");
  const [category, setCategory] = useState("");
  const [structuredPitch, setStructuredPitch] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [viewPitch, setViewPitch] = useState(null);
  const queryClient = useQueryClient();

  const { data: pitches = [], isLoading } = useQuery({
    queryKey: ["pitches"],
    queryFn: () => base44.entities.Pitch.list("-created_date"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Pitch.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pitches"] });
      setTitle("");
      setSpeechText("");
      setCategory("");
      setStructuredPitch("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Pitch.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pitches"] }),
  });

  const refinePitch = async () => {
    if (!speechText.trim()) return;
    setIsRefining(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a business pitch expert. A rural woman entrepreneur has spoken about her business idea. 
Her raw speech (may be in any language): "${speechText}"
Business category: ${category || "not specified"}
Title: ${title || "not specified"}

Please:
1. Understand the language and content
2. Create a well-structured, professional business pitch in English
3. Keep it simple, warm and authentic to her voice
4. Include sections: Problem, Solution, Market, Revenue Model, Why Me

Format it clearly with headers. Keep it concise but compelling.`,
      response_json_schema: {
        type: "object",
        properties: {
          structured_pitch: { type: "string" },
          detected_language: { type: "string" },
          suggested_title: { type: "string" }
        }
      }
    });
    setStructuredPitch(result.structured_pitch);
    if (!title && result.suggested_title) setTitle(result.suggested_title);
    setIsRefining(false);
  };

  const submitPitch = () => {
    createMutation.mutate({
      title,
      raw_speech: speechText,
      structured_pitch: structuredPitch,
      category,
      status: "submitted"
    });
  };

  const statusColors = {
    draft: "bg-gray-100 text-gray-700",
    submitted: "bg-amber-100 text-amber-700",
    reviewed: "bg-green-100 text-green-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Ideas</h1>
              <p className="text-gray-500">Share your business idea by speaking</p>
            </div>
          </div>
        </div>

        {/* New Idea Form */}
        <Card className="mb-8 border-2 border-dashed border-amber-200 bg-white rounded-3xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-gray-800">✨ Create New Pitch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              placeholder="Give your idea a name..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg rounded-xl h-14 border-gray-200"
            />

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="rounded-xl h-14 border-gray-200 text-base">
                <SelectValue placeholder="Choose your business type..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value} className="text-base py-3">
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Speech Recorder */}
            <div className="bg-amber-50/80 rounded-2xl p-6">
              <SpeechRecorder onTranscript={setSpeechText} />
            </div>

            {speechText && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-600">Your words:</label>
                <Textarea
                  value={speechText}
                  onChange={(e) => setSpeechText(e.target.value)}
                  className="min-h-[120px] rounded-xl border-gray-200 text-base"
                  placeholder="Your speech will appear here, or type your idea..."
                />
                <Button
                  onClick={refinePitch}
                  disabled={isRefining}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl h-12 px-6"
                >
                  {isRefining ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      AI is refining your pitch...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Refine with AI
                    </>
                  )}
                </Button>
              </div>
            )}

            {structuredPitch && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100"
              >
                <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> AI-Refined Pitch
                </h3>
                <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                  {structuredPitch}
                </div>
                <Button
                  onClick={submitPitch}
                  disabled={createMutation.isPending}
                  className="mt-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl h-12 px-8"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Submit Pitch
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* My Pitches */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">My Submitted Pitches</h2>
        <div className="space-y-4">
          <AnimatePresence>
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
              </div>
            ) : pitches.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No pitches yet. Share your first idea above!</p>
              </div>
            ) : (
              pitches.map((pitch) => (
                <motion.div
                  key={pitch.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg text-gray-900">{pitch.title}</h3>
                            <Badge className={statusColors[pitch.status]}>{pitch.status}</Badge>
                          </div>
                          {pitch.category && (
                            <span className="text-sm text-gray-400 capitalize">{pitch.category?.replace(/_/g, " ")}</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewPitch(pitch)}
                            className="text-gray-400 hover:text-amber-600"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMutation.mutate(pitch.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* View Pitch Dialog */}
      <Dialog open={!!viewPitch} onOpenChange={() => setViewPitch(null)}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>{viewPitch?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {viewPitch?.raw_speech && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Original Speech</h4>
                <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-xl">{viewPitch.raw_speech}</p>
              </div>
            )}
            {viewPitch?.structured_pitch && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Refined Pitch</h4>
                <p className="text-gray-700 text-sm whitespace-pre-wrap bg-indigo-50 p-3 rounded-xl">{viewPitch.structured_pitch}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}