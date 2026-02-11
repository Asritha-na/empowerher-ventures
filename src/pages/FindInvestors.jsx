import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search, Users, Loader2 } from "lucide-react";
import InvestorCard from "@/components/investors/InvestorCard";
import AIInvestorMatcher from "@/components/matching/AIInvestorMatcher";

export default function FindInvestors() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: investors = [], isLoading } = useQuery({
    queryKey: ["investors"],
    queryFn: () => base44.entities.Investor.list(),
  });

  const { data: userPitches = [] } = useQuery({
    queryKey: ["user-pitches", user?.email],
    queryFn: () => base44.entities.Pitch.filter({ created_by: user?.email }),
    enabled: !!user?.email,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Investor.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["investors"] }),
  });

  const handleConnect = (investor) => {
    if (!user?.email) return;
    const connected = investor.is_connected || [];
    if (!connected.includes(user.email)) {
      updateMutation.mutate({
        id: investor.id,
        data: { is_connected: [...connected, user.email] },
      });
    }
  };

  const handleDisconnect = (investor) => {
    if (!user?.email) return;
    const connected = (investor.is_connected || []).filter((e) => e !== user.email);
    updateMutation.mutate({
      id: investor.id,
      data: { is_connected: connected },
    });
  };

  const handleAddReview = (investorId, review) => {
    const investor = investors.find(inv => inv.id === investorId);
    if (!investor) return;

    const currentReviews = investor.reviews || [];
    const updatedReviews = [...currentReviews, review];
    
    // Calculate new average rating
    const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAvgRating = totalRating / updatedReviews.length;

    updateMutation.mutate({
      id: investorId,
      data: { 
        reviews: updatedReviews,
        rating: newAvgRating
      },
    });
  };

  const filtered = investors.filter(
    (inv) =>
      inv.name?.toLowerCase().includes(search.toLowerCase()) ||
      inv.location?.toLowerCase().includes(search.toLowerCase()) ||
      inv.focus_areas?.some((a) => a.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)'}}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] flex items-center justify-center shadow-md">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Find Investors</h1>
            <p className="text-gray-700">Connect with people who want to support your business</p>
          </div>
        </div>

        {/* AI-Powered Investor Recommendations */}
        <div className="mb-8">
          <AIInvestorMatcher userPitches={userPitches} />
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by name, location, or interest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-14 text-base"
          />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">All Investors</h2>

        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No investors found. Check back soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((investor, i) => (
              <InvestorCard
                key={investor.id}
                investor={investor}
                isConnected={investor.is_connected?.includes(user?.email)}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onAddReview={handleAddReview}
                currentUserEmail={user?.email}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}