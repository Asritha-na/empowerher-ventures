import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SpeechRecorder({ onTranscript }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = ""; // Auto-detect language

    recognition.onresult = (event) => {
      let fullTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript;
      }
      setTranscript(fullTranscript);
      onTranscript(fullTranscript);
    };

    recognition.onerror = (event) => {
      console.log("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  if (!supported) {
    return (
      <div className="text-center p-6 bg-amber-50 rounded-2xl">
        <p className="text-gray-600">
          Speech recognition is not supported in your browser. Please type your idea below.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <button
        onClick={toggleListening}
        className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
          isListening
            ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-200"
            : "bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-200"
        }`}
      >
        {isListening ? (
          <MicOff className="w-10 h-10 text-white" />
        ) : (
          <Mic className="w-10 h-10 text-white" />
        )}
      </button>
      <p className="text-lg font-medium text-gray-700">
        {isListening ? (
          <span className="text-red-600 flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Listening... Speak now
          </span>
        ) : (
          "Tap to start speaking"
        )}
      </p>
      <p className="text-sm text-gray-400">
        Speak in any language — Hindi, Tamil, Telugu, Bengali, or any other
      </p>
    </div>
  );
}