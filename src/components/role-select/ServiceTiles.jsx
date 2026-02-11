import React from "react";
import { Mic, Bot, Users, GraduationCap, Store, Languages, ShieldCheck, LineChart } from "lucide-react";

const features = [
  { icon: Mic, title: "Voice-First Interface", desc: "Record your pitch in any language—no typing needed.", color: "from-rose-500 to-pink-500" },
  { icon: Bot, title: "AI Pitch Coach", desc: "Instant feedback to improve clarity, structure, and impact.", color: "from-violet-500 to-fuchsia-500" },
  { icon: Users, title: "Verified Investors", desc: "Connect with trusted CSR funds, angels, and MFIs.", color: "from-blue-500 to-cyan-500" },
  { icon: GraduationCap, title: "Learning Hub", desc: "Courses, templates, and guidance to grow smart.", color: "from-emerald-500 to-teal-500" },
  { icon: Store, title: "D2C Marketplace", desc: "Showcase products and sell directly to customers.", color: "from-orange-500 to-amber-500" },
  { icon: Languages, title: "Multilingual Support", desc: "Work in 12+ Indian languages with voice assistance.", color: "from-purple-500 to-indigo-500" },
  { icon: ShieldCheck, title: "Safe & Secure", desc: "KYC-verified investors and privacy-first controls.", color: "from-green-500 to-emerald-500" },
  { icon: LineChart, title: "Impact Tracking", desc: "Track growth, jobs created, and community outcomes.", color: "from-amber-500 to-yellow-500" },
];

export default function ServiceTiles() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {features.map((f) => (
        <div key={f.title} className="rounded-xl bg-white/90 backdrop-blur border border-white/30 shadow-md p-5">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${f.color} text-white flex items-center justify-center mb-3`}>
            <f.icon className="w-5 h-5" />
          </div>
          <div className="font-semibold text-gray-900">{f.title}</div>
          <div className="text-sm text-gray-600 mt-1">{f.desc}</div>
        </div>
      ))}
    </div>
  );
}