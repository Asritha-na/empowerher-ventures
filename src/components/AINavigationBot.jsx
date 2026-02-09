import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { 
  MessageCircle, 
  X, 
  Send, 
  Mic, 
  Volume2, 
  VolumeX,
  Loader2,
  Sparkles 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AINavigationBot({ currentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSend(transcript);
      };
      
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    synthRef.current.cancel();
    setIsSpeaking(false);
  };

  const readScreen = async () => {
    const screenContent = `Current page: ${currentPage}. User role: ${user?.user_role || 'not set'}. `;
    const msg = {
      role: "assistant",
      content: "I'm reading the current screen for you..."
    };
    setMessages(prev => [...prev, msg]);
    
    setIsLoading(true);
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a helpful navigation assistant for NariShakti, a platform for rural women entrepreneurs.
      
Current screen: ${currentPage}
User role: ${user?.user_role || 'entrepreneur'}
User name: ${user?.full_name || 'User'}

Describe what's on this page and what the user can do here. Be concise and helpful.`,
    });
    
    const botMsg = { role: "assistant", content: response };
    setMessages(prev => [...prev, botMsg]);
    speak(response);
    setIsLoading(false);
  };

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    
    const userMsg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Check for navigation commands
    const lowerText = text.toLowerCase();
    const navMap = {
      "home": "Home",
      "my idea": "MyIdea",
      "idea": "MyIdea",
      "pitch": "MyIdea",
      "investor": "FindInvestors",
      "find investor": "FindInvestors",
      "learning": "LearningHub",
      "learn": "LearningHub",
      "community": "Community",
      "meeting": "MeetingNotes",
      "notes": "MeetingNotes",
      "appointment": "Appointments",
      "profile": "Profile",
      "setting": "Profile"
    };

    let shouldNavigate = null;
    for (const [keyword, page] of Object.entries(navMap)) {
      if (lowerText.includes(keyword)) {
        shouldNavigate = page;
        break;
      }
    }

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a helpful navigation assistant for NariShakti, a platform empowering rural women entrepreneurs.

Current page: ${currentPage}
User role: ${user?.user_role || 'entrepreneur'}
User name: ${user?.full_name || 'User'}
User message: "${text}"

Available pages: Home, My Idea (pitch creation), Find Investors, Learning Hub (videos), Community (network), Meeting Notes (AI feedback), Appointments, Profile

${shouldNavigate ? `The user wants to navigate to ${shouldNavigate}. Confirm this action in a friendly way.` : 'Help the user with their question. Be concise, warm, and supportive.'}

If they ask to read the screen, describe what's available on the current ${currentPage} page.`,
    });

    const botMsg = { role: "assistant", content: response };
    setMessages(prev => [...prev, botMsg]);
    speak(response);
    
    if (shouldNavigate) {
      setTimeout(() => {
        window.location.href = createPageUrl(shouldNavigate);
      }, 2000);
    }
    
    setIsLoading(false);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-8 h-8 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-md"
          >
            <Card className="rounded-3xl shadow-2xl border-2 border-indigo-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">AI Navigation Assistant</h3>
                    <p className="text-xs text-white/80">Here to help you navigate</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 bg-gray-50 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 mx-auto text-indigo-300 mb-3" />
                    <p className="text-gray-500 text-sm mb-4">Hi! I can help you navigate the app.</p>
                    <Button
                      onClick={readScreen}
                      size="sm"
                      className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-xl"
                    >
                      Read Current Screen
                    </Button>
                  </div>
                )}
                
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-gray-800 shadow-sm"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white px-4 py-3 rounded-2xl shadow-sm">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t">
                <div className="flex gap-2 mb-2">
                  <Button
                    onClick={readScreen}
                    size="sm"
                    variant="outline"
                    className="rounded-xl text-xs"
                  >
                    <Volume2 className="w-3 h-3 mr-1" />
                    Read Screen
                  </Button>
                  {isSpeaking && (
                    <Button
                      onClick={stopSpeaking}
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-xs text-red-600"
                    >
                      <VolumeX className="w-3 h-3 mr-1" />
                      Stop
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask me anything or say 'navigate to...'"
                    className="rounded-xl resize-none text-sm"
                    rows={2}
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={toggleListening}
                      size="icon"
                      variant={isListening ? "default" : "outline"}
                      className={`rounded-xl ${isListening ? "bg-red-500 hover:bg-red-600" : ""}`}
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isLoading}
                      size="icon"
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}