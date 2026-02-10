import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const languages = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
  { value: "ta", label: "தமிழ்" },
  { value: "te", label: "తెలుగు" },
  { value: "bn", label: "বাংলা" },
  { value: "mr", label: "मराठी" },
  { value: "gu", label: "ગુજરાતી" },
  { value: "kn", label: "ಕನ್ನಡ" },
  { value: "ml", label: "മലയാളം" },
];

export default function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={changeLanguage}>
      <SelectTrigger className="bg-slate-900/50 border-slate-700/50 text-slate-200 hover:bg-slate-800/50 hover:border-slate-600/50 transition-all duration-200 h-10 w-40 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-amber-400" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
        {languages.map((lang) => (
          <SelectItem 
            key={lang.value} 
            value={lang.value}
            className="focus:bg-slate-800 focus:text-amber-400 cursor-pointer"
          >
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}