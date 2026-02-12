import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, MapPin, Users, Briefcase } from "lucide-react";

export default function InvestorConnect() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: investors = [], isLoading } = useQuery({
    queryKey: ["investors"],
    queryFn: () => base44.entities.Investor.list("-created_date", 200),
  });

  const { data: myInvestor = null } = useQuery({
    queryKey: ["myInvestor", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const r = await base44.entities.Investor.filter({ email: user.email }, "-created_date", 1);
      return r?.[0] || null;
    },
  });

  const connectMutation = useMutation({
    mutationFn: async (targetInvestor) => {
      return base44.entities.InvestorConnection.create({
        investor_a_id: myInvestor?.id || user?.id,
        investor_b_id: targetInvestor.id,
        timestamp: new Date().toISOString(),
      });
    },
  });

  const visibleInvestors = investors.filter((inv) => inv.email !== user?.email);

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
            <p className="text-gray-500">No investors found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleInvestors.map((inv) => (
              <Card key={inv.id} className="glass-card hover:shadow-md transition-all h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{inv.name || inv.email?.split('@')[0]}</h3>
                      {inv.location && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{inv.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-emerald-700">
                      <ShieldCheck className="w-5 h-5" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  </div>

                  {/* Skills Area */}
                  {Array.isArray(inv.focus_areas) && inv.focus_areas.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Skills Area</p>
                      <div className="flex flex-wrap gap-1.5">
                        {inv.focus_areas.slice(0, 6).map((fa, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-pink-100 text-pink-700 text-xs px-2 py-0.5">
                            {fa}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Budget Range */}
                  {(typeof inv.min_investment === 'number' || typeof inv.max_investment === 'number') && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-700">
                      <Briefcase className="w-4 h-4" />
                      <span>
                        Budget Range: ₹{inv.min_investment?.toLocaleString?.() || 0} - ₹{inv.max_investment?.toLocaleString?.() || 0}
                      </span>
                    </div>
                  )}

                  {/* Sections of Interest */}
                  {(inv.category_label || inv.investor_type) && (
                    <div className="mt-3 text-sm text-gray-700">
                      <span className="font-medium">Sections of Interest: </span>
                      <span className="capitalize">{inv.category_label || inv.investor_type}</span>
                    </div>
                  )}

                  <div className="mt-5">
                    <Button
                      className="w-full bg-[#8B1E1E] hover:opacity-90 text-white rounded-2xl"
                      disabled={connectMutation.isPending}
                      onClick={() => connectMutation.mutate(inv)}
                    >
                      {connectMutation.isPending ? 'Connecting...' : 'Connect'}
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