import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, MapPin, Users, Briefcase, Mail, Phone } from "lucide-react";

export default function InvestorConnect() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: investors = [], isLoading } = useQuery({
    queryKey: ["investors-list-ic"],
    queryFn: () => base44.entities.Investor.list("-created_date", 1000),
  });

  const { data: allPitches = [] } = useQuery({
    queryKey: ["ic-all-pitches"],
    queryFn: () => base44.entities.Pitch.list("-created_date", 1000),
  });

  const queryClient = useQueryClient();



  const selfUserId = user?.id;

  const { data: connsA = [] } = useQuery({
  queryKey: ["ic-conns-a", selfUserId],
  enabled: !!selfUserId,
  queryFn: () => base44.entities.InvestorConnection.filter({ investor_a_id: selfUserId, status: 'connected' }, "-created_date", 500),
  });
  const { data: connsB = [] } = useQuery({
  queryKey: ["ic-conns-b", selfUserId],
  enabled: !!selfUserId,
  queryFn: () => base44.entities.InvestorConnection.filter({ investor_b_id: selfUserId, status: 'connected' }, "-created_date", 500),
  });

  const { data: connsByInvestor = [] } = useQuery({
    queryKey: ["ic-conns-investor", selfUserId],
    enabled: !!selfUserId,
    queryFn: () => base44.entities.InvestorConnection.filter({ investor_id: selfUserId, status: 'connected' }, "-created_date", 500),
  });

  const allConns = [...connsA, ...connsB, ...connsByInvestor];

  React.useEffect(() => {
    const u1 = base44.entities.InvestorConnection.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["ic-conns-a", selfUserId] });
      queryClient.invalidateQueries({ queryKey: ["ic-conns-b", selfUserId] });
    });
    const u2 = base44.entities.Investor.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["investors-list-ic"] });
    });
    const u3 = base44.entities.Pitch.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["ic-all-pitches"] });
    });
    return () => { u1(); u2(); u3(); };
  }, [selfUserId, queryClient]);

  const connectMutation = useMutation({
    mutationFn: async (targetUser) => {
      const targetId = targetUser?.user_id || targetUser?.id;
      if (!selfUserId || !targetId || selfUserId === targetId) return null;
      const existingNew = await base44.entities.InvestorConnection.filter({ investor_id: selfUserId, entrepreneur_id: targetId, status: 'connected' }, "-created_date", 1);
      const existingAB = await base44.entities.InvestorConnection.filter({ investor_a_id: selfUserId, investor_b_id: targetId, status: 'connected' }, "-created_date", 1);
      const existingBA = await base44.entities.InvestorConnection.filter({ investor_a_id: targetId, investor_b_id: selfUserId, status: 'connected' }, "-created_date", 1);
      if ((existingNew?.length || 0) > 0 || (existingAB?.length || 0) > 0 || (existingBA?.length || 0) > 0) return null;
      const name = targetUser.full_name || (targetUser.email?.split('@')[0] || 'Entrepreneur');
      const email = targetUser.email || null;
      return base44.entities.InvestorConnection.create({
        investor_a_id: selfUserId,
        investor_b_id: targetId,
        investor_id: selfUserId,
        entrepreneur_id: targetId,
        entrepreneur_name: name,
        entrepreneur_email: email,
        timestamp: new Date().toISOString(),
        status: 'connected',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ic-conns-a", selfUserId] });
      queryClient.invalidateQueries({ queryKey: ["ic-conns-b", selfUserId] });
      queryClient.invalidateQueries({ queryKey: ["ic-conns-investor", selfUserId] });
    },
  });



  const isConnectedTo = (targetUser) => {
    if (!selfUserId) return false;
    const targetId = targetUser?.user_id || targetUser?.id;
    if (!targetId) return false;
    return allConns.some(c =>
      c.entrepreneur_id === targetId ||
      (c.investor_a_id === selfUserId && c.investor_b_id === targetId) ||
      (c.investor_b_id === selfUserId && c.investor_a_id === targetId)
    );
  };

  const visibleInvestors = investors
    .filter((e) => (user?.email ? e.email !== user.email : true));





  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'linear-gradient(135deg, #FDE8EC 0%, #FCF4F6 100%)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#8B1E1E] flex items-center justify-center shadow-md">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Investor Connect</h1>
            <p className="text-sm text-gray-700">Discover and connect with investors</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading investors...</p>
          </div>
        ) : visibleInvestors.length === 0 ? (
         <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
           <p className="text-gray-500">No investors available to connect</p>
         </div>
        ) : (
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {visibleInvestors.map((e) => {
              const connected = isConnectedTo(e);
              const displayName = e.full_name || (e.email?.split('@')[0] || 'Entrepreneur');
              const phone = e.phone;
              const waMsg = encodeURIComponent(`Hi ${displayName}, I saw your business on the SHAKTI platform and would like to connect.`);
              const waUrl = phone ? `https://wa.me/${phone.replace(/\D/g, '')}?text=${waMsg}` : null;
              const canConnect = !!selfUserId && !!e?.user_id;

              // enrich with pitch
              const pitch = allPitches.find(p => p.created_by === e.email);
              const investmentNeeded = typeof pitch?.funding_needed === 'number' ? pitch.funding_needed : null;
              const description = pitch?.structured_pitch || pitch?.problem || pitch?.solution || e.bio || '';
              const skills = Array.isArray(e.entrepreneur_skills_needed) ? e.entrepreneur_skills_needed.slice(0,6) : [];

              return (
                <Card key={e.id} className="glass-card hover:shadow-md transition-all h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <img src={e.image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=60'} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <h3 className="font-bold text-gray-900">{displayName}</h3>
                          <p className="text-sm text-gray-600">{e.category_label || e.investor_type || 'Investor'}</p>
                          {e.location && (
                           <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                             <MapPin className="w-3.5 h-3.5" />
                             <span>{e.location}</span>
                           </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-700">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-xs font-medium">Verified</span>
                      </div>
                    </div>

                    {investmentRange && (
                      <div className="mt-3 text-sm text-gray-700">
                        Investment Range: <span className="font-semibold text-green-600">{investmentRange}</span>
                      </div>
                    )}

                    {skills.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Focus Areas</p>
                        <div className="flex flex-wrap gap-1.5">
                          {skills.map((s, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-pink-100 text-pink-700 text-xs px-2 py-0.5">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {description && (
                      <p className="mt-3 text-sm text-gray-700 line-clamp-3">{description}</p>
                    )}

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <Button
                        className="bg-[#8B1E1E] hover:opacity-90 text-white rounded-2xl"
                        onClick={() => { if (email) { const subject = 'Investment Inquiry from SHAKTI Platform'; const body = `Hello ${displayName}, I found your profile on SHAKTI and would like to connect.`; window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`); } }}
                        disabled={!email}
                      >
                        Connect
                      </Button>

                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white rounded-2xl"
                        onClick={() => { if (waUrl) window.open(waUrl, '_blank'); }}
                        disabled={!waUrl}
                      >
                        <Phone className="w-4 h-4" /> WhatsApp
                      </Button>

                      <Button
                        className="bg-white text-[#8B1E1E] border border-[#8B1E1E] hover:bg-white/80 rounded-2xl"
                        onClick={() => { if (email) window.open(`mailto:${email}?subject=${encodeURIComponent('Investment Inquiry from SHAKTI Platform')}`); }}
                        disabled={!email}
                      >
                        <Mail className="w-4 h-4" /> Email
                      </Button>
                    </div>
                    </CardContent>
                    </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}