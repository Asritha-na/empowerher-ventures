import React, { useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  useEffect(() => {
    base44.auth.me().then((user) => {
      if (!user) {
        base44.auth.redirectToLogin(createPageUrl("Profile"));
        return;
      }
      // After login and profile completion, route to appropriate dashboard
      const target = user.user_role === "investor" ? "InvestorHome" : "MyIdea";
      window.location.href = createPageUrl(target);
    }).catch(() => {
      base44.auth.redirectToLogin(createPageUrl("Profile"));
    });
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex items-center gap-3 text-gray-600">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading your dashboard…</span>
      </div>
    </div>
  );
}