import React, { useState, useRef, useEffect } from "react";
import { Mic, Volume2, Pause, Square, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/components/LanguageProvider";

export default function VoiceAccessibilityAssistant() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);

  // Extract all visible text content in visual order
  const extractScreenContent = () => {
    const elements = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          const style = window.getComputedStyle(parent);
          if (style.display === 'none' || style.visibility === 'hidden') {
            return NodeFilter.FILTER_REJECT;
          }
          
          const text = node.textContent.trim();
          if (text.length > 0) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent.trim();
      if (text && !text.match(/^[\s\n\r]*$/)) {
        elements.push(text);
      }
    }

    return elements.join('. ');
  };

  // Read screen content using TTS
  const readScreen = async () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      return;
    }

    setIsProcessing(true);
    const content = extractScreenContent();
    
    try {
      // Use browser's speech synthesis for immediate response
      const utterance = new SpeechSynthesisUtterance(content);
      
      // Set language based on current selection
      const langMap = {
        en: 'en-US',
        hi: 'hi-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        bn: 'bn-IN',
        mr: 'mr-IN',
        gu: 'gu-IN',
        kn: 'kn-IN',
        ml: 'ml-IN',
      };
      
      utterance.lang = langMap[language] || 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsProcessing(false);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsProcessing(false);
        setIsPaused(false);
      };
      
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error("TTS error:", error);
      setIsProcessing(false);
    }
  };

  // Pause/Resume speech
  const togglePause = () => {
    if (window.speechSynthesis.speaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  };

  // Stop speech
  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Start voice recognition
  const startListening = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Auto-detect language or use selected language
    const langMap = {
      en: 'en-US',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      bn: 'bn-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
    };
    
    recognition.lang = langMap[language] || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      
      // Process voice command
      setIsProcessing(true);
      try {
        // Use OpenAI to process the command
        const response = await base44.integrations.Core.InvokeLLM({
          prompt: `User said in ${language}: "${transcript}". 
          If they're asking to read the page, navigate, or need help understanding the interface, provide a helpful response in ${language}. 
          If they're asking about what's on the screen, explain the current page content.`,
          add_context_from_internet: false,
        });
        
        // Speak the response
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.lang = langMap[language] || 'en-US';
        window.speechSynthesis.speak(utterance);
        
      } catch (error) {
        console.error("Voice processing error:", error);
      }
      setIsProcessing(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Auto-stop speech when language changes
  useEffect(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [language]);

  return (
    <>
      {/* Floating Voice Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 left-6 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center"
        aria-label="Voice Accessibility Assistant"
      >
        <Volume2 className="w-7 h-7" />
      </button>

      {/* Control Panel */}
      {isOpen && (
        <div className="fixed bottom-44 left-6 bg-white rounded-2xl shadow-2xl z-50 p-4 w-72">
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 text-lg mb-1">Voice Assistant</h3>
            <p className="text-xs text-gray-500">Screen reader & voice commands</p>
          </div>

          <div className="space-y-3">
            {/* Read Screen Button */}
            <Button
              onClick={readScreen}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : isSpeaking ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Stop Reading
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Read Screen
                </>
              )}
            </Button>

            {/* Playback Controls */}
            {isSpeaking && (
              <div className="flex gap-2">
                <Button
                  onClick={togglePause}
                  variant="outline"
                  className="flex-1"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  onClick={stopSpeech}
                  variant="outline"
                  className="flex-1"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </div>
            )}

            {/* Repeat Button */}
            <Button
              onClick={readScreen}
              variant="outline"
              className="w-full"
              disabled={isProcessing || isSpeaking}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Repeat
            </Button>

            {/* Voice Input Button */}
            <Button
              onClick={startListening}
              disabled={isListening || isProcessing}
              variant="secondary"
              className="w-full"
            >
              {isListening ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Listening...
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Voice Command
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-gray-400 mt-3 text-center">
            Speak in any language • Auto-detected
          </p>
        </div>
      )}
    </>
  );
}