import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const languages = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी (Hindi)" },
  { value: "ta", label: "தமிழ் (Tamil)" },
  { value: "te", label: "తెలుగు (Telugu)" },
  { value: "bn", label: "বাংলা (Bengali)" },
  { value: "mr", label: "मराठी (Marathi)" },
  { value: "gu", label: "ગુજરાતી (Gujarati)" },
  { value: "kn", label: "ಕನ್ನಡ (Kannada)" },
  { value: "ml", label: "മലയാളം (Malayalam)" },
];

export default function LanguageSelector() {
  const { language, changeLanguage, t } = useLanguage();

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 block">
        {t("selectLanguage")}
      </label>
      <Select value={language} onValueChange={changeLanguage}>
        <SelectTrigger className="rounded-xl h-12 border-gray-200">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {languages.map((l) => (
            <SelectItem key={l.value} value={l.value} className="py-2">
              {l.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}