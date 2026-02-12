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
    queryKey: ["investor-users"],
    queryFn: () => base44.entities.User.filter({ user_role: "investor" }, "-created_date", 200),
  });

  const { data: myInvestor = null } = useQuery({
    queryKey: ["myInvestor", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const r = await base44.entities.Investor.filter({ email: user.email }, "-created_date", 1);
      return r?.[0] || null;
    },
  });

  const queryClient = useQueryClient();

  const { data: allInvestorEntities = [] } = useQuery({
    queryKey: ["all-investor-entities"],
    queryFn: () => base44.entities.Investor.list("-created_date", 500),
  });

  const selfUserId = user?.id;
  const selfInvestorId = myInvestor?.id;

  const { data: connsAUser = [] } = useQuery({
    queryKey: ["invconns-a-user", selfUserId],
    enabled: !!selfUserId,
    queryFn: () => base44.entities.InvestorConnection.filter({ investor_a_id: selfUserId, status: 'connected' }, "-created_date", 500),
  });
  const { data: connsBUser = [] } = useQuery({
    queryKey: ["invconns-b-user", selfUserId],
    enabled: !!selfUserId,
    queryFn: () => base44.entities.InvestorConnection.filter({ investor_b_id: selfUserId, status: 'connected' }, "-created_date", 500),
  });
  const { data: connsAInv = [] } = useQuery({
    queryKey: ["invconns-a-inv", selfInvestorId],
    enabled: !!selfInvestorId,
    queryFn: () => base44.entities.InvestorConnection.filter({ investor_a_id: selfInvestorId, status: 'connected' }, "-created_date", 500),
  });
  const { data: connsBInv = [] } = useQuery({
    queryKey: ["invconns-b-inv", selfInvestorId],
    enabled: !!selfInvestorId,
    queryFn: () => base44.entities.InvestorConnection.filter({ investor_b_id: selfInvestorId, status: 'connected' }, "-created_date", 500),
  });

  const allConns = [...connsAUser, ...connsBUser, ...connsAInv, ...connsBInv];

  React.useEffect(() => {
    const unsub = base44.entities.InvestorConnection.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["invconns-a-user", selfUserId] });
      queryClient.invalidateQueries({ queryKey: ["invconns-b-user", selfUserId] });
      queryClient.invalidateQueries({ queryKey: ["invconns-a-inv", selfInvestorId] });
      queryClient.invalidateQueries({ queryKey: ["invconns-b-inv", selfInvestorId] });
    });
    return unsub;
  }, [selfUserId, selfInvestorId, queryClient]);

  const connectMutation = useMutation({
    mutationFn: async (targetUser) => {
      const selfIds = [selfInvestorId, selfUserId].filter(Boolean);
      const targetInvestor = allInvestorEntities.find(e => e.email === targetUser.email) || null;
      const targetIds = [targetInvestor?.id, targetUser.id].filter(Boolean);

      if (targetIds.some(id => selfIds.includes(id))) return null; // prevent self-connection

      // Prevent duplicates across all id combinations
      for (const a of selfIds) {
        for (const b of targetIds) {
          const existingAB = await base44.entities.InvestorConnection.filter({ investor_a_id: a, investor_b_id: b, status: 'connected' }, "-created_date", 1);
          const existingBA = await base44.entities.InvestorConnection.filter({ investor_a_id: b, investor_b_id: a, status: 'connected' }, "-created_date", 1);
          if ((existingAB?.length || 0) > 0 || (existingBA?.length || 0) > 0) {
            return null;
          }
        }
      }

      const idA = selfInvestorId && targetInvestor?.id ? selfInvestorId : selfUserId;
      const idB = selfInvestorId && targetInvestor?.id ? targetInvestor.id : targetUser.id;

      return base44.entities.InvestorConnection.create({
        investor_a_id: idA,
        investor_b_id: idB,
        timestamp: new Date().toISOString(),
        status: 'connected',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invconns-a-user", selfUserId] });
      queryClient.invalidateQueries({ queryKey: ["invconns-b-user", selfUserId] });
      queryClient.invalidateQueries({ queryKey: ["invconns-a-inv", selfInvestorId] });
      queryClient.invalidateQueries({ queryKey: ["invconns-b-inv", selfInvestorId] });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async (targetUser) => {
      const targetInvestor = allInvestorEntities.find(e => e.email === targetUser.email) || null;
      const selfIds = [selfInvestorId, selfUserId].filter(Boolean);
      const targetIds = [targetInvestor?.id, targetUser.id].filter(Boolean);

      for (const a of selfIds) {
        for (const b of targetIds) {
          const [existingAB] = await base44.entities.InvestorConnection.filter({ investor_a_id: a, investor_b_id: b, status: 'connected' }, "-created_date", 1);
          if (existingAB) {
            await base44.entities.InvestorConnection.delete(existingAB.id);
            return;
          }
          const [existingBA] = await base44.entities.InvestorConnection.filter({ investor_a_id: b, investor_b_id: a, status: 'connected' }, "-created_date", 1);
          if (existingBA) {
            await base44.entities.InvestorConnection.delete(existingBA.id);
            return;
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invconns-a-user", selfUserId] });
      queryClient.invalidateQueries({ queryKey: ["invconns-b-user", selfUserId] });
      queryClient.invalidateQueries({ queryKey: ["invconns-a-inv", selfInvestorId] });
      queryClient.invalidateQueries({ queryKey: ["invconns-b-inv", selfInvestorId] });
    },
  });

  const isConnectedTo = (targetUser) => {
    const targetInvestor = allInvestorEntities.find(e => e.email === targetUser.email) || null;
    const selfIds = [selfInvestorId, selfUserId].filter(Boolean);
    const targetIds = [targetInvestor?.id, targetUser.id].filter(Boolean);
    return allConns.some(c => (selfIds.includes(c.investor_a_id) && targetIds.includes(c.investor_b_id)) || (selfIds.includes(c.investor_b_id) && targetIds.includes(c.investor_a_id)));
  };

  const visibleInvestors = investors
    .filter((inv) => inv.id !== user?.id)
    .filter((inv) => (inv.investor_name || inv.full_name) && (inv.investor_company || inv.investor_bio || inv.investor_location));

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
        ) : visibleInvestors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No investors available to connect</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleInvestors.map((inv) => {
              const connected = isConnectedTo(inv);
              const displayName = inv.investor_name || inv.full_name || (inv.email?.split('@')[0] || 'Investor');
              const phone = inv.investor_phone;
              const waMsg = encodeURIComponent(`Hi ${displayName}, I found your profile on Shakti Investor Network and would like to connect with you.`);
              const waUrl = phone ? `https://wa.me/${phone}?text=${waMsg}` : null;
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
                          disabled={disconnectMutation.isPending}
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          className="bg-[#8B1E1E] hover:opacity-90 text-white rounded-2xl"
                          onClick={() => connectMutation.mutate(inv)}
                          disabled={connectMutation.isPending}
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