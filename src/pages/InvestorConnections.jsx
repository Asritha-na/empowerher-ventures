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

  const { data: investors = [] } = useQuery({
    queryKey: ["investors"],
    queryFn: () => base44.entities.Investor.list("-created_date", 200),
  });

  const { data: allMembers = [] } = useQuery({
    queryKey: ["all-members"],
    queryFn: () => base44.entities.CommunityMember.list("-created_date", 500),
  });

  const { data: allPitches = [] } = useQuery({
    queryKey: ["all-pitches"],
    queryFn: () => base44.entities.Pitch.list("-created_date", 500),
  });

  const currentInvestor = investors.find((inv) => inv.email === user?.email);
  const connectedEntrepreneurs = currentInvestor?.is_connected || [];

  const cards = connectedEntrepreneurs.map((email) => {
    const member = allMembers.find((m) => m.created_by === email);
    const pitch = allPitches.find((p) => p.created_by === email);
    const name = member?.name || (email?.split("@")[0]?.replace(/[._-]/g, " ") || "Entrepreneur");
    const business = member?.business_name || pitch?.title || "Business Idea";
    const skills = Array.isArray(member?.skills) ? member.skills.slice(0, 6) : [];
    const section = member?.business_type || pitch?.category || null;
    return { email, name, business, skills, section };
  });

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'linear-gradient(135deg, #FDE8EC 0%, #FCF4F6 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#8B1E1E] flex items-center justify-center shadow-md">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Connections</h1>
            <p className="text-sm text-gray-700">Entrepreneurs you’ve connected with</p>
          </div>
        </div>

        {connectedEntrepreneurs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">You have not connected with any entrepreneurs yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((c, i) => (
              <Card key={c.email + i} className="glass-card hover:shadow-md transition-all h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{c.name}</h3>
                      <p className="text-sm text-gray-600">{c.business}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Connected</Badge>
                  </div>

                  {c.skills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {c.skills.map((s, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-pink-100 text-pink-700 text-xs px-2 py-0.5">{s}</Badge>
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