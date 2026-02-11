import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, FileText, Brain, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिंदी (Hindi)" },
  { value: "ta", label: "தமிழ் (Tamil)" },
  { value: "te", label: "తెలుగు (Telugu)" },
  { value: "bn", label: "বাংলা (Bengali)" },
  { value: "mr", label: "मराठी (Marathi)" },
  { value: "gu", label: "ગુજરાતી (Gujarati)" },
  { value: "kn", label: "ಕನ್ನಡ (Kannada)" },
  { value: "ml", label: "മലയാളം (Malayalam)" },
];

export default function MeetingNotes() {
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [language, setLanguage] = useState("en");
  const [feedback, setFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedPitch, setExpandedPitch] = useState(null);

  const { data: pitches = [], isLoading } = useQuery({
    queryKey: ["pitches-feedback"],
    queryFn: () => base44.entities.Pitch.list("-created_date"),
  });

  const analyzePitch = async (pitch) => {
    setSelectedPitch(pitch.id);
    setIsAnalyzing(true);
    setFeedback(null);

    const langName = languages.find(l => l.value === language)?.label || "English";

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a business mentor for rural women entrepreneurs. Analyze this pitch and provide detailed, encouraging feedback.

Pitch Title: ${pitch.title}
Pitch Content: ${pitch.structured_pitch || pitch.raw_speech || "No content available"}
Category: ${pitch.category || "Not specified"}

IMPORTANT: Provide the feedback in ${langName} language.

Include:
1. Overall Score (out of 10)
2. Strengths - What's great about this idea
3. Areas to Improve - Gentle suggestions
4. Market Advice - Simple tips for reaching customers
5. Next Steps - 3 simple action items
6. Investor Appeal - How attractive is this to investors

Be warm, supportive, and use simple language. Remember this person may not have formal business education.`,
      response_json_schema: {
        type: "object",
        properties: {
          overall_score: { type: "number" },
          strengths: { type: "string" },
          improvements: { type: "string" },
          market_advice: { type: "string" },
          next_steps: { type: "string" },
          investor_appeal: { type: "string" },
          encouragement: { type: "string" }
        }
      }
    });

    setFeedback(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'linear-gradient(135deg, #FDE8EC 0%, #FCF4F6 100%)'}}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#8B1E1E] flex items-center justify-center shadow-md">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meeting Notes</h1>
            <p className="text-gray-700">AI-powered feedback on your pitches</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-sm text-gray-600 font-medium">Feedback Language:</span>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-56 rounded-xl h-11 border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value} className="py-2">
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
          </div>
        ) : pitches.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No pitches to analyze. Create your first pitch in "My Idea" tab!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pitches.map((pitch) => (
              <Card key={pitch.id} className="glass-card rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg text-gray-900">{pitch.title}</h3>
                        {pitch.category && (
                          <Badge variant="secondary" className="text-xs capitalize rounded-full">
                            {pitch.category?.replace(/_/g, " ")}
                          </Badge>
                        )}
                      </div>
                      <button
                        onClick={() => setExpandedPitch(expandedPitch === pitch.id ? null : pitch.id)}
                        className="text-sm text-gray-400 mt-1 flex items-center gap-1 hover:text-gray-600"
                      >
                        {expandedPitch === pitch.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {expandedPitch === pitch.id ? "Hide pitch" : "View pitch"}
                      </button>
                    </div>
                    <Button
                      onClick={() => analyzePitch(pitch)}
                      disabled={isAnalyzing && selectedPitch === pitch.id}
                    >
                      {isAnalyzing && selectedPitch === pitch.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Get Feedback
                        </>
                      )}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {expandedPitch === pitch.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-600 text-sm mt-3 bg-gray-50 p-4 rounded-xl whitespace-pre-wrap">
                          {pitch.structured_pitch || pitch.raw_speech || "No content"}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Feedback */}
                  {feedback && selectedPitch === pitch.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-5 glass-card p-6 space-y-4"
                    >
                      {/* Score */}
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#B94B5A] to-[#D8707C] flex items-center justify-center shadow-md">
                          <span className="text-2xl font-bold text-white">{feedback.overall_score}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Overall Score</p>
                          <p className="text-sm text-gray-600">out of 10</p>
                        </div>
                      </div>

                      {[
                        { label: "💪 Strengths", value: feedback.strengths },
                        { label: "🎯 Areas to Improve", value: feedback.improvements },
                        { label: "📈 Market Advice", value: feedback.market_advice },
                        { label: "📋 Next Steps", value: feedback.next_steps },
                        { label: "💰 Investor Appeal", value: feedback.investor_appeal },
                        { label: "🌟 Encouragement", value: feedback.encouragement },
                      ].map((section, i) => (
                        <div key={i}>
                          <h4 className="font-semibold text-gray-800 text-sm mb-1">{section.label}</h4>
                          <p className="text-gray-600 text-sm whitespace-pre-wrap">{section.value}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}