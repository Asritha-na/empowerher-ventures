import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Sparkles, Loader2, Send, FileText, Trash2, Eye, Video, Upload, FileEdit, Mic, Users } from "lucide-react";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import SpeechRecorder from "@/components/idea/SpeechRecorder";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState("voice");
  const [title, setTitle] = useState("");
  const [speechText, setSpeechText] = useState("");
  const [category, setCategory] = useState("");
  const [structuredPitch, setStructuredPitch] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [viewPitch, setViewPitch] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [submittedPitch, setSubmittedPitch] = useState(null);
  
  // Form fields
  const [formData, setFormData] = useState({
    problem: "",
    solution: "",
    target_market: "",
    revenue_model: "",
    funding_needed: ""
  });
  
  const queryClient = useQueryClient();

  const { data: pitches = [], isLoading } = useQuery({
    queryKey: ["pitches"],
    queryFn: () => base44.entities.Pitch.list("-created_date"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Pitch.create(data),
    onSuccess: (newPitch) => {
      queryClient.invalidateQueries({ queryKey: ["pitches"] });
      setSubmittedPitch(newPitch);
      setCurrentStep(2);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Pitch.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pitches"] }),
  });

  const resetForm = () => {
    setTitle("");
    setSpeechText("");
    setCategory("");
    setStructuredPitch("");
    setVideoFile(null);
    setFormData({
      problem: "",
      solution: "",
      target_market: "",
      revenue_model: "",
      funding_needed: ""
    });
  };

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

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 100 * 1024 * 1024) {
      alert("File size must be less than 100MB");
      return;
    }
    
    setVideoFile(file);
  };

  const submitVoicePitch = () => {
    createMutation.mutate({
      title,
      raw_speech: speechText,
      structured_pitch: structuredPitch,
      category,
      pitch_type: "voice",
      status: "submitted"
    });
  };

  const submitVideoPitch = async () => {
    if (!videoFile) return;
    
    setIsUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file: videoFile });
    
    createMutation.mutate({
      title,
      category,
      video_url: file_url,
      pitch_type: "video",
      status: "submitted"
    });
    setIsUploading(false);
  };

  const submitFormPitch = async () => {
    const pitchContent = `
Problem: ${formData.problem}
Solution: ${formData.solution}
Target Market: ${formData.target_market}
Revenue Model: ${formData.revenue_model}
Funding Needed: ₹${formData.funding_needed}
`;

    createMutation.mutate({
      title,
      category,
      structured_pitch: pitchContent,
      pitch_type: "form",
      problem: formData.problem,
      solution: formData.solution,
      target_market: formData.target_market,
      revenue_model: formData.revenue_model,
      funding_needed: parseFloat(formData.funding_needed),
      status: "submitted"
    });
  };

  const statusColors = {
    draft: "bg-gray-100 text-gray-700",
    submitted: "bg-amber-100 text-amber-700",
    reviewed: "bg-green-100 text-green-700",
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'linear-gradient(135deg, #FDE8EC 0%, #FCF4F6 100%)'}}>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="text-gray-900">Share Your </span>
            <span className="text-gradient-rose">Brilliant Idea</span>
          </h1>
          <p className="text-gray-700 text-lg mb-8">
            Record your pitch, upload video, and get expert AI feedback
          </p>

          {/* Progress Steps */}
          <div className="flex justify-center items-center gap-6 max-w-2xl mx-auto">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-3 transition-all"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shadow-sm transition-all ${
                currentStep === 1 
                  ? 'gradient-primary text-white' 
                  : currentStep > 1
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}>
                1
              </div>
              <span className={`text-base font-semibold ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>
                Share Your Idea
              </span>
            </button>
            <div className={`w-16 h-0.5 transition-colors ${currentStep >= 2 ? 'bg-green-500' : 'bg-gray-300'}`} />
            <button
              onClick={() => submittedPitch && setCurrentStep(2)}
              disabled={!submittedPitch}
              className="flex items-center gap-3 transition-all disabled:cursor-not-allowed"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                currentStep === 2 
                  ? 'gradient-primary text-white shadow-sm' 
                  : currentStep > 2
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}>
                2
              </div>
              <span className={`text-base font-medium ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>
                AI Review
              </span>
            </button>
            <div className={`w-16 h-0.5 transition-colors ${currentStep >= 3 ? 'bg-green-500' : 'bg-gray-300'}`} />
            <button
              onClick={() => submittedPitch && setCurrentStep(3)}
              disabled={!submittedPitch}
              className="flex items-center gap-3 transition-all disabled:cursor-not-allowed"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                currentStep === 3 
                  ? 'gradient-primary text-white shadow-sm' 
                  : 'bg-gray-200 text-gray-400'
              }`}>
                3
              </div>
              <span className={`text-base font-medium ${currentStep >= 3 ? 'text-gray-900' : 'text-gray-500'}`}>
                Find Investors
              </span>
            </button>
          </div>
        </div>

        {/* Step 1: Share Your Idea */}
        {currentStep === 1 && (
        <Card className="mb-8 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-xl text-gray-900">Step 1: Share Your Idea</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Choose voice recording OR video upload (or skip to form)</p>
          </CardHeader>
          <CardContent className="p-6">
            {/* Common Fields */}
            <div className="space-y-4 mb-6">
              <Input
                placeholder="Give your idea a name..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg h-14"
              />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-14 text-base">
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
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger value="voice" className="rounded-lg data-[state=active]:bg-white">
                  <Mic className="w-4 h-4 mr-2" />
                  Voice
                </TabsTrigger>
                <TabsTrigger value="video" className="rounded-lg data-[state=active]:bg-white">
                  <Video className="w-4 h-4 mr-2" />
                  Video
                </TabsTrigger>
                <TabsTrigger value="form" className="rounded-lg data-[state=active]:bg-white">
                  <FileEdit className="w-4 h-4 mr-2" />
                  Form
                </TabsTrigger>
              </TabsList>

              {/* Option 1: Voice Recording */}
              <TabsContent value="voice" className="space-y-6">
                <div className="glass-card p-6 border-2 border-dashed border-[#E79A9A]/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Mic className="w-5 h-5 text-[#8B1E1E]" />
                    <h3 className="font-semibold text-gray-900">Option 1: Record Your Pitch (Voice)</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Perfect for quick ideas - just speak naturally!</p>
                  <SpeechRecorder onTranscript={setSpeechText} />
                </div>

                {speechText && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-600">Your words:</label>
                    <Textarea
                      value={speechText}
                      onChange={(e) => setSpeechText(e.target.value)}
                      className="min-h-[120px] text-base"
                      placeholder="Your speech will appear here, or type your idea..."
                      style={{ borderRadius: '18px' }}
                    />
                    <Button
                      onClick={refinePitch}
                      disabled={isRefining}
                      size="lg"
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
                    className="glass-card p-6"
                  >
                    <h3 className="font-semibold text-[#8B1E1E] mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> AI-Refined Pitch
                    </h3>
                    <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                      {structuredPitch}
                    </div>
                    <Button
                      onClick={submitVoicePitch}
                      disabled={createMutation.isPending}
                      size="lg"
                      className="mt-4"
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
              </TabsContent>

              {/* Option 2: Video Upload */}
              <TabsContent value="video" className="space-y-6">
                <div className="glass-card p-8 border-2 border-dashed border-[#E79A9A]/50 text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Video className="w-5 h-5 text-[#8B1E1E]" />
                    <h3 className="font-semibold text-gray-900">Option 2: Upload a Pitch Video</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">Show your product, demonstrate your idea, or present yourself!</p>
                  
                  <div className="mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl glass-card flex items-center justify-center">
                      <Video className="w-10 h-10 text-[#8B1E1E]" />
                    </div>
                    <p className="text-gray-700 font-medium mb-2">Click to upload your pitch video</p>
                    <p className="text-sm text-gray-400">MP4, MOV, AVI up to 100MB</p>
                  </div>

                  <label className="inline-block">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                    <Button asChild size="lg">
                      <span className="cursor-pointer">
                        <Upload className="w-5 h-5 mr-2" />
                        Choose Video File
                      </span>
                    </Button>
                  </label>

                  {videoFile && (
                    <div className="mt-4 text-sm text-gray-600">
                      Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)}MB)
                    </div>
                  )}
                </div>

                {videoFile && (
                  <Button
                    onClick={submitVideoPitch}
                    disabled={isUploading || createMutation.isPending}
                    size="lg"
                    className="w-full"
                  >
                    {isUploading || createMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Video Pitch
                      </>
                    )}
                  </Button>
                )}
              </TabsContent>

              {/* Option 3: Form */}
              <TabsContent value="form" className="space-y-4">
                <div className="glass-card p-6 border-2 border-dashed border-[#E79A9A]/50">
                  <div className="flex items-center gap-2 mb-3">
                    <FileEdit className="w-5 h-5 text-[#8B1E1E]" />
                    <h3 className="font-semibold text-gray-900">Skip Recording - Fill Form Directly</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">You can submit your idea without recording</p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">What problem are you solving?</label>
                      <Textarea
                        value={formData.problem}
                        onChange={(e) => setFormData({...formData, problem: e.target.value})}
                        placeholder="Describe the problem your business addresses..."
                        className="rounded-xl"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Your solution</label>
                      <Textarea
                        value={formData.solution}
                        onChange={(e) => setFormData({...formData, solution: e.target.value})}
                        placeholder="How does your business solve this problem?"
                        className="rounded-xl"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Target market</label>
                      <Input
                        value={formData.target_market}
                        onChange={(e) => setFormData({...formData, target_market: e.target.value})}
                        placeholder="Who are your customers?"
                        className="rounded-xl h-12"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Revenue model</label>
                      <Input
                        value={formData.revenue_model}
                        onChange={(e) => setFormData({...formData, revenue_model: e.target.value})}
                        placeholder="How will you make money?"
                        className="rounded-xl h-12"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Funding needed (₹)</label>
                      <Input
                        type="number"
                        value={formData.funding_needed}
                        onChange={(e) => setFormData({...formData, funding_needed: e.target.value})}
                        placeholder="Amount in rupees"
                        className="rounded-xl h-12"
                      />
                    </div>

                    <Button
                      onClick={submitFormPitch}
                      disabled={createMutation.isPending || !formData.problem || !formData.solution}
                      size="lg"
                      className="w-full"
                    >
                      {createMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Submit Form Pitch
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        )}

        {/* Step 2: AI Review */}
        {currentStep === 2 && submittedPitch && (
        <Card className="mb-8 glass-card overflow-hidden shadow-md">
          <CardHeader className="glass-card border-b border-gray-200">
            <CardTitle className="text-xl text-gray-900">Step 2: AI Review & Feedback</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Get expert AI analysis of your pitch</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="font-semibold text-[#8B1E1E] mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> Your Pitch: {submittedPitch.title}
                </h3>
                {submittedPitch.structured_pitch && (
                  <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed mb-4">
                    {submittedPitch.structured_pitch}
                  </div>
                )}
                {submittedPitch.video_url && (
                  <video src={submittedPitch.video_url} controls className="w-full rounded-xl mb-4" />
                )}
                <div className="bg-white rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">💡 AI feedback coming soon! Your pitch is under review.</p>
                  <p className="text-xs text-gray-400">Check the "Meeting Notes" tab for detailed AI analysis.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                  size="lg"
                >
                  ← Back to Edit
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  size="lg"
                  className="flex-1"
                >
                  Continue to Find Investors →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Step 3: Find Investors */}
        {currentStep === 3 && (
        <Card className="mb-8 glass-card overflow-hidden shadow-md">
          <CardHeader className="glass-card border-b border-gray-200">
            <CardTitle className="text-xl text-gray-900">Step 3: Find Investors</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Connect with investors who can fund your idea</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#B94B5A] to-[#D8707C] flex items-center justify-center shadow-md">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Find Investors?</h3>
              <p className="text-gray-700 mb-6">Browse our network of investors interested in ideas like yours</p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => setCurrentStep(2)}
                  variant="outline"
                  size="lg"
                >
                  ← Back to Review
                </Button>
                <Button
                  onClick={() => window.location.href = createPageUrl("FindInvestors")}
                  size="lg"
                  className="px-8"
                >
                  Browse Investors →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        )}

        {/* My Pitches */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Submitted Pitches</h2>
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
                            {pitch.pitch_type && (
                              <Badge variant="outline" className="capitalize">
                                {pitch.pitch_type === "voice" && "🎤"}
                                {pitch.pitch_type === "video" && "🎥"}
                                {pitch.pitch_type === "form" && "📝"}
                                {pitch.pitch_type}
                              </Badge>
                            )}
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
            {viewPitch?.video_url && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Pitch Video</h4>
                <video src={viewPitch.video_url} controls className="w-full rounded-xl" />
              </div>
            )}
            {viewPitch?.raw_speech && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Original Speech</h4>
                <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-xl">{viewPitch.raw_speech}</p>
              </div>
            )}
            {viewPitch?.structured_pitch && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Pitch Details</h4>
                <p className="text-gray-700 text-sm whitespace-pre-wrap bg-indigo-50 p-3 rounded-xl">{viewPitch.structured_pitch}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}