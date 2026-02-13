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

  const { data: entrepreneurs = [], isLoading } = useQuery({
    queryKey: ["entrepreneur-users-ic"],
    queryFn: () => base44.entities.User.filter({ user_role: "entrepreneur", profile_completed: true }, "-created_date", 1000),
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

  const allConns = [...connsA, ...connsB];

  React.useEffect(() => {
    const u1 = base44.entities.InvestorConnection.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["ic-conns-a", selfUserId] });
      queryClient.invalidateQueries({ queryKey: ["ic-conns-b", selfUserId] });
    });
    const u2 = base44.entities.User.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["entrepreneur-users-ic"] });
    });
    const u3 = base44.entities.Pitch.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["ic-all-pitches"] });
    });
    return () => { u1(); u2(); u3(); };
  }, [selfUserId, queryClient]);

  const connectMutation = useMutation({
    mutationFn: async (targetUser) => {
      if (!selfUserId || !targetUser?.id || selfUserId === targetUser.id) return null;
      const existingAB = await base44.entities.InvestorConnection.filter({ investor_a_id: selfUserId, investor_b_id: targetUser.id, status: 'connected' }, "-created_date", 1);
      const existingBA = await base44.entities.InvestorConnection.filter({ investor_a_id: targetUser.id, investor_b_id: selfUserId, status: 'connected' }, "-created_date", 1);
      if ((existingAB?.length || 0) > 0 || (existingBA?.length || 0) > 0) return null;
      return base44.entities.InvestorConnection.create({
        investor_a_id: selfUserId,
        investor_b_id: targetUser.id,
        timestamp: new Date().toISOString(),
        status: 'connected',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ic-conns-a", selfUserId] });
      queryClient.invalidateQueries({ queryKey: ["ic-conns-b", selfUserId] });
    },
  });



  const isConnectedTo = (targetUser) => {
    if (!selfUserId || !targetUser?.id) return false;
    return allConns.some(c => (c.investor_a_id === selfUserId && c.investor_b_id === targetUser.id) || (c.investor_b_id === selfUserId && c.investor_a_id === targetUser.id));
  };

  const visibleEntrepreneurs = entrepreneurs
    .filter((e) => e.id !== user?.id)
    .filter((e) => e.profile_completed === true);

  // Debug safety: if none found, log all users and their roles (admin only)
  React.useEffect(() => {
    if (!isLoading && investors.length === 0 && user) {
      (async () => {
        if (user.role === 'admin') {
          const all = await base44.entities.User.list();
          console.log('DEBUG users roles:', all.map(u => ({ id: u.id, email: u.email, full_name: u.full_name, role: u.role, user_role: u.user_role })));
        } else {
          console.log('DEBUG: No investors found; cannot list all users as non-admin.');
        }
      })();
    }
  }, [isLoading, investors, user]);

  if (user && user.user_role !== "investor") {
    return (
      <div className="p-6 md:p-8">
        <p className="text-sm text-gray-600">This section is available for investors only.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'linear-gradient(135deg, #FDE8EC 0%, #FCF4F6 100%)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#8B1E1E] flex items-center justify-center shadow-md">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Investor Connect</h1>
            <p className="text-sm text-gray-700">Discover and connect with fellow investors</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading investors...</p>
          </div>
        ) : visibleEntrepreneurs.length === 0 ? (
         <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
           <p className="text-gray-500">No entrepreneurs available to connect</p>
         </div>
        ) : (
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {visibleEntrepreneurs.map((e) => {
              const connected = isConnectedTo(inv);
              const displayName = inv.investor_name || inv.full_name || (inv.email?.split('@')[0] || 'Investor');
              const phone = inv.investor_phone;
              const waMsg = encodeURIComponent(`Hi ${displayName}, I found your profile on Shakti Investor Network and would like to connect with you.`);
              const waUrl = phone ? `https://wa.me/${phone}?text=${waMsg}` : null;
              const targetInvestor = allInvestorEntities.find(e => e.email === inv.email) || null;
              const canConnect = !!selfInvestorId && !!targetInvestor?.id;
              return (
                <Card key={inv.id} className="glass-card hover:shadow-md transition-all h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <img src={inv.profile_image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=60'} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <h3 className="font-bold text-gray-900">{displayName}</h3>
                          <p className="text-sm text-gray-600">{inv.investor_company || 'Not provided'}</p>
                          {(inv.investor_location || inv.location) && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{inv.investor_location || inv.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-700">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-xs font-medium">Verified</span>
                      </div>
                    </div>

                    {Array.isArray(inv.investor_focus_areas) && inv.investor_focus_areas.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Investment Focus</p>
                        <div className="flex flex-wrap gap-1.5">
                          {inv.investor_focus_areas.slice(0, 6).map((fa, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-pink-100 text-pink-700 text-xs px-2 py-0.5">{fa}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {inv.investor_bio && (
                      <p className="mt-3 text-sm text-gray-700 line-clamp-3">{inv.investor_bio}</p>
                    )}

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      {connected ? (
                        <Button
                          className="bg-white text-[#8B1E1E] border border-[#8B1E1E] hover:bg-white/80 rounded-2xl"
                          onClick={() => disconnectMutation.mutate(inv)}
                          disabled={disconnectMutation.isPending || !canConnect}
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          className="bg-[#8B1E1E] hover:opacity-90 text-white rounded-2xl"
                          onClick={() => connectMutation.mutate(inv)}
                          disabled={connectMutation.isPending || !canConnect}
                        >
                          {connectMutation.isPending ? 'Connecting...' : 'Connect'}
                        </Button>
                      )}

                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white rounded-2xl"
                        onClick={() => waUrl && window.open(waUrl, '_blank')}
                        disabled={!waUrl}
                      >
                        <Phone className="w-4 h-4" /> WhatsApp
                      </Button>

                      <Button
                        className="bg-white text-[#8B1E1E] border border-[#8B1E1E] hover:bg-white/80 rounded-2xl"
                        onClick={() => inv.email && window.open(`mailto:${inv.email}?subject=${encodeURIComponent('Investor Connection Request')}&body=${encodeURIComponent(`Hello ${displayName}, I found your profile on Shakti and would like to connect.`)}`)}
                        disabled={!inv.email}
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