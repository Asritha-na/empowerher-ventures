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

  // New connections via Connection entity
  const { data: connSent = [] } = useQuery({
    queryKey: ["ic-conn-sent", selfUserId],
    enabled: !!selfUserId,
    queryFn: () => base44.entities.Connection.filter({ sender_id: selfUserId, status: 'connected' }, "-created_date", 1000),
  });
  const { data: connRecv = [] } = useQuery({
    queryKey: ["ic-conn-recv", selfUserId],
    enabled: !!selfUserId,
    queryFn: () => base44.entities.Connection.filter({ receiver_id: selfUserId, status: 'connected' }, "-created_date", 1000),
  });
  const allConnsNew = [...connSent, ...connRecv];
  const connectionWith = (otherId) => allConnsNew.find(c => (c.sender_id === selfUserId && c.receiver_id === otherId) || (c.receiver_id === selfUserId && c.sender_id === otherId));

  // legacy queries kept (no-op) for backward compatibility
  const { data: connsByInvestor = [] } = useQuery({ queryKey: ["ic-conns-investor", selfUserId], enabled: false, queryFn: async () => [] });

  const allConns = [...allConnsNew];

  React.useEffect(() => {
    const u0 = base44.entities.Connection.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["ic-conn-sent", selfUserId] });
      queryClient.invalidateQueries({ queryKey: ["ic-conn-recv", selfUserId] });
    });
    const u2 = base44.entities.Investor.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["investors-list-ic"] });
    });
    const u3 = base44.entities.Pitch.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["ic-all-pitches"] });
    });
    return () => { u0(); u2(); u3(); };
  }, [selfUserId, queryClient]);

  const connectMutation = useMutation({
    mutationFn: async (otherId) => {
      if (!selfUserId || !otherId || selfUserId === otherId) return null;
      const a = await base44.entities.Connection.filter({ sender_id: selfUserId, receiver_id: otherId, status: 'connected' }, "-created_date", 1);
      const b = await base44.entities.Connection.filter({ sender_id: otherId, receiver_id: selfUserId, status: 'connected' }, "-created_date", 1);
      if ((a?.length || 0) > 0 || (b?.length || 0) > 0) return null;
      return base44.entities.Connection.create({ sender_id: selfUserId, receiver_id: otherId, status: 'connected' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ic-conn-sent", selfUserId] });
      queryClient.invalidateQueries({ queryKey: ["ic-conn-recv", selfUserId] });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async (otherId) => {
      const a = await base44.entities.Connection.filter({ sender_id: selfUserId, receiver_id: otherId, status: 'connected' }, "-created_date", 10);
      const b = await base44.entities.Connection.filter({ sender_id: otherId, receiver_id: selfUserId, status: 'connected' }, "-created_date", 10);
      const targets = [...(a||[]), ...(b||[])];
      await Promise.all(targets.map(r => base44.entities.Connection.delete(r.id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ic-conn-sent", selfUserId] });
      queryClient.invalidateQueries({ queryKey: ["ic-conn-recv", selfUserId] });
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
    .filter((e) => (user?.email ? e.email !== user.email : true))
    .filter((e) => !!e.name && !!e.email);





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
              const displayName = e.name || (e.email?.split('@')[0] || 'Investor');
              const whatsapp = e.whatsapp_number || e.phone;
              const email = e.email;
              const connected = !!(connectionWith(e.user_id || e.id));
              const waUrl = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, '')}` : null;
              const investmentRange = (typeof e.min_investment === 'number' || typeof e.max_investment === 'number')
                ? `${typeof e.min_investment === 'number' ? '₹' + e.min_investment.toLocaleString() : '₹0'} - ${typeof e.max_investment === 'number' ? '₹' + e.max_investment.toLocaleString() : '₹0'}`
                : null;
              const description = e.bio || '';
              const skills = Array.isArray(e.focus_areas) ? e.focus_areas.slice(0,6) : [];

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
                        onClick={() => {
                          const otherId = e.user_id || e.id;
                          if (!otherId) return;
                          const c = connectionWith(otherId);
                          if (c) disconnectMutation.mutate(otherId); else connectMutation.mutate(otherId);
                        }}
                      >
                        {(connectionWith(e.user_id || e.id)) ? 'Connected' : 'Connect'}
                      </Button>

                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white rounded-2xl"
                        onClick={() => { if (waUrl && connected) window.open(waUrl, '_blank'); }}
                        disabled={!waUrl || !connected}
                      >
                        <Phone className="w-4 h-4" /> WhatsApp
                      </Button>

                      <Button
                        className="bg-white text-[#8B1E1E] border border-[#8B1E1E] hover:bg-white/80 rounded-2xl"
                        onClick={() => { if (email && connected) window.open(`mailto:${email}`); }}
                        disabled={!email || !connected}
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