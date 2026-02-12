import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export default function InvestorConnections() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: investors = [], isLoading: loadingInvestors } = useQuery({
    queryKey: ["investor-entities"],
    queryFn: () => base44.entities.Investor.list("-created_date", 200),
  });

  const currentInvestor = investors.find((inv) => inv.email === user?.email);
  const connectedEntrepreneurs = currentInvestor?.is_connected || [];

  const { data: allPitches = [], isLoading: loadingPitches } = useQuery({
    queryKey: ["all-pitches-for-connections"],
    queryFn: () => base44.entities.Pitch.list("-created_date", 200),
  });

  const { data: allMembers = [], isLoading: loadingMembers } = useQuery({
    queryKey: ["all-members-for-connections"],
    queryFn: () => base44.entities.CommunityMember.list("-created_date", 200),
  });

  const connectionCards = connectedEntrepreneurs.map((email) => {
    const latestPitch = allPitches.find((p) => p.created_by === email);
    const member = allMembers.find((m) => m.created_by === email);
    const name = member?.name || (email || "").split("@")[0].replace(/[._-]/g, " ");
    const ideaTitle = member?.business_name || latestPitch?.title || "—";
    const section = latestPitch?.category || member?.business_type || null;
    const skills = Array.isArray(member?.skills) ? member.skills : [];
    return { email, name, ideaTitle, section, skills };
  });

  const isLoading = loadingInvestors || loadingPitches || loadingMembers;

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'linear-gradient(135deg, #FDE8EC 0%, #FCF4F6 100%)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#8B1E1E] flex items-center justify-center shadow-md">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Connections</h1>
            <p className="text-sm text-gray-700">Entrepreneurs you have connected with</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading connections...</p>
          </div>
        ) : connectionCards.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">You have not connected with any entrepreneurs yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectionCards.map((c) => (
              <Card key={c.email} className="glass-card hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{c.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{c.ideaTitle}</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 text-xs">Connected</Badge>
                  </div>

                  {c.skills && c.skills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {c.skills.slice(0, 6).map((s, i) => (
                          <Badge key={i} variant="secondary" className="bg-pink-100 text-pink-700 text-xs px-2 py-0.5">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {c.section && (
                    <div className="mt-3 text-sm text-gray-700">
                      <span className="font-medium">Section of Interest: </span>
                      <span className="capitalize">{c.section}</span>
                    </div>
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