import React, { useState } from "react";
import { MessageCircle, X, Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/components/LanguageProvider";

export default function RoleSelectBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { language, t } = useLanguage();

  const greetings = {
    en: "Hello! Welcome to Shakti. Please select your preferred language to continue.",
    hi: "नमस्ते! शक्ति में आपका स्वागत है। कृपया जारी रखने के लिए अपनी पसंदीदा भाषा चुनें।",
    ta: "வணக்கம்! சக்திக்கு வரவேற்கிறோம். தொடர உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்.",
    te: "హలో! శక్తికి స్వాగతం. కొనసాగించడానికి దయచేసి మీ ఇష్టమైన భాషను ఎంచుకోండి.",
    bn: "হ্যালো! শক্তিতে স্বাগতম। অনুগ্রহ করে চালিয়ে যেতে আপনার পছন্দের ভাষা নির্বাচন করুন।",
    mr: "नमस्कार! शक्तीमध्ये आपले स्वागत आहे. कृपया सुरू ठेवण्यासाठी तुमची पसंतीची भाषा निवडा.",
    gu: "નમસ્તે! શક્તિમાં આપનું સ્વાગત છે. કૃપા કરીને ચાલુ રાખવા માટે તમારી પસંદીદા ભાષા પસંદ કરો.",
    kn: "ಹಲೋ! ಶಕ್ತಿಗೆ ಸುಸ್ವಾಗತ. ದಯವಿಟ್ಟು ಮುಂದುವರಿಸಲು ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    ml: "ഹലോ! ശക്തിയിലേക്ക് സ്വാഗതം. ദയവായി തുടരാൻ നിങ്ങളുടെ ഇഷ്ട ഭാഷ തിരഞ്ഞെടുക്കുക.",
  };

  const speak = async () => {
    setIsSpeaking(true);
    try {
      const text = greetings[language] || greetings.en;
      
      // Call OpenAI TTS via base44 integration
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Convert the following text to speech in ${language} language: "${text}". Use the latest OpenAI text-to-speech model.`,
        add_context_from_internet: false,
      });

      // For now, use browser's speech synthesis as fallback
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "en" ? "en-US" : `${language}-IN`;
      window.speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error("Speech error:", error);
    }
    setIsSpeaking(false);
  };

  return (
    <>
      {/* Floating Bot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Bot Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 text-white">
            <h3 className="font-bold text-lg">Shakti Assistant</h3>
            <p className="text-sm text-white/80">{t("selectLanguageToStart")}</p>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {greetings[language] || greetings.en}
              </p>
            </div>

            <Button
              onClick={speak}
              disabled={isSpeaking}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              {isSpeaking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Speaking...
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Listen to Greeting
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-500">
              <p>Select a language above to continue</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}