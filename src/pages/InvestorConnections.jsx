import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Mail, Phone } from "lucide-react";

export default function InvestorConnections() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const queryClient = useQueryClient();

  useEffect(() => {
    const u0 = base44.entities.Connection.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["conn-sent", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["conn-recv", user?.id] });
    });
    const u2 = base44.entities.PublicProfile.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["entrepreneur-users-all"] });
    });
    const u3 = base44.entities.Pitch.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["all-pitches"] });
    });
    return () => { u0(); u2(); u3(); };
  }, [queryClient, user?.id]);

  const { data: investors = [] } = useQuery({
    queryKey: ["investors"],
    queryFn: () => base44.entities.Investor.list("-created_date", 200),
  });

  const { data: allPitches = [] } = useQuery({
    queryKey: ["all-pitches"],
    queryFn: () => base44.entities.Pitch.list("-created_date", 500),
  });

  // Connections based on new Connection entity
  const { data: sent = [] } = useQuery({
    queryKey: ["conn-sent", user?.id],
    enabled: !!user?.id,
    queryFn: () => base44.entities.Connection.filter({ sender_id: user.id, status: 'connected' }, "-created_date", 1000),
  });
  const { data: recv = [] } = useQuery({
    queryKey: ["conn-recv", user?.id],
    enabled: !!user?.id,
    queryFn: () => base44.entities.Connection.filter({ receiver_id: user.id, status: 'connected' }, "-created_date", 1000),
  });

  const { data: entrepreneurUsers = [] } = useQuery({
    queryKey: ["entrepreneur-users-all"],
    queryFn: () => base44.entities.PublicProfile.filter({ profile_completed: true, is_public: true }, "-created_date", 1000),
  });

  const otherIds = React.useMemo(() => {
    const s = new Set();
    sent.forEach(c => { if (c.receiver_id && c.receiver_id !== user?.id) s.add(c.receiver_id); });
    recv.forEach(c => { if (c.sender_id && c.sender_id !== user?.id) s.add(c.sender_id); });
    return Array.from(s);
  }, [sent, recv, user?.id]);

  const entreByUserId = new Map(entrepreneurUsers.map(u => [u.user_id, u]));

  const cards = otherIds.map((oid) => {
    const u = entreByUserId.get(oid);
    if (u) {
      const email = u.email;
      const pitch = allPitches.find((p) => p.created_by === email);
      const name = u.full_name || (email?.split('@')[0]?.replace(/[._-]/g, ' ') || 'Entrepreneur');
      const business = u.business_name || pitch?.title || 'Business Idea';
      const skills = Array.isArray(u.entrepreneur_skills_needed) ? u.entrepreneur_skills_needed.slice(0,6) : [];
      const investment = typeof pitch?.funding_needed === 'number' ? pitch.funding_needed : (typeof u.entrepreneur_investment_needed === 'number' ? u.entrepreneur_investment_needed : null);
      const whatsapp = u.whatsapp_number || null;
      const profile_image = u.profile_image;
      const location = u.location || u.location_formatted || null;
      return { email, name, business, skills, investment, whatsapp, profile_image, location };
    }
    // Fallback: try Investor entity by id (some investors may be connected)
    const inv = investors.find(i => (i.user_id || i.id) === oid);
    if (inv) {
      return {
        email: inv.email || null,
        name: inv.name || 'Investor',
        business: inv.category_label || inv.investor_type || 'Investor',
        skills: Array.isArray(inv.focus_areas) ? inv.focus_areas.slice(0,6) : [],
        investment: null,
        whatsapp: inv.whatsapp_number || null,
        profile_image: inv.image_url || null,
        location: inv.location || null,
      };
    }
    return { email: null, name: 'User', business: '', skills: [], investment: null, whatsapp: null, profile_image: null, location: null };
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
            <p className="text-sm text-gray-700">Your connections</p>
          </div>
        </div>

        {cards.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">You have not connected with any entrepreneurs yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((c, i) => (
              <Card key={c.email + i} className="glass-card hover:shadow-md transition-all h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img src={c.profile_image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=60'} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h3 className="font-bold text-gray-900">{c.name}</h3>
                        <p className="text-sm text-gray-600">{c.business}</p>
                        {c.location && <p className="text-xs text-gray-500 mt-0.5">{c.location}</p>}
                        {typeof c.investment === 'number' && (
                          <p className="text-xs text-gray-700 mt-1">Investment Needed: <span className="font-semibold text-green-600">₹{c.investment.toLocaleString()}</span></p>
                        )}
                      </div>
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

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white rounded-2xl"
                      onClick={() => c.phone && window.open(`https://wa.me/${c.phone.replace(/\D/g, '')}?text=${encodeURIComponent('Hi ' + c.name + ', I saw your business on Shakti and would like to connect.')}`, '_blank')}
                      disabled={!c.phone}
                    >
                      <Phone className="w-4 h-4 mr-1" /> WhatsApp
                    </Button>
                    <Button
                      className="bg-white text-[#8B1E1E] border border-[#8B1E1E] hover:bg-white/80 rounded-2xl"
                      onClick={() => c.email && window.open(`mailto:${c.email}?subject=${encodeURIComponent('Regarding your business idea on SHAKTI')}`)}
                      disabled={!c.email}
                    >
                      <Mail className="w-4 h-4 mr-1" /> Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}