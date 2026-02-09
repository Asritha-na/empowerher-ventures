import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, Loader2, MessageCircle, Phone } from "lucide-react";
import InvestorCard from "@/components/investors/InvestorCard";

export default function FindInvestors() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: investors = [], isLoading } = useQuery({
    queryKey: ["investors"],
    queryFn: () => base44.entities.Investor.list(),
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
    const currentReviews = investor.reviews || [];
    const newReviews = [...currentReviews, review];
    const avgRating = newReviews.reduce((acc, r) => acc + r.rating, 0) / newReviews.length;
    
    updateMutation.mutate({
      id: investorId,
      data: { 
        reviews: newReviews,
        rating: Math.round(avgRating * 10) / 10
      },
    });
  };

  const filtered = investors.filter((inv) => {
    const matchesSearch =
      inv.name?.toLowerCase().includes(search.toLowerCase()) ||
      inv.location?.toLowerCase().includes(search.toLowerCase()) ||
      inv.focus_areas?.some((a) => a.toLowerCase().includes(search.toLowerCase()));
    
    const matchesType = selectedType === "all" || inv.investor_type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const investorTypes = [
    { value: "all", label: "All Types" },
    { value: "angel", label: "Angel" },
    { value: "csr", label: "CSR" },
    { value: "ngo", label: "NGO" },
    { value: "micro_fund", label: "Micro Fund" },
    { value: "vc", label: "VC" },
    { value: "government", label: "Government" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-rose-600">Find Investors</h1>
            <p className="text-gray-500 text-sm">Connect with verified investors ready to support your business</p>
          </div>
        </div>

        {/* Shakti Connect Banner */}
        <div className="bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 rounded-2xl p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MessageCircle className="w-10 h-10 text-white" />
            <div className="text-white">
              <h3 className="font-bold text-lg">Shakti Connect - WhatsApp Bridge</h3>
              <p className="text-sm text-white/90">Connect directly with investors via WhatsApp for quick, low-data communication</p>
            </div>
          </div>
          <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-xl">
            <Phone className="w-4 h-4 mr-2" />
            Call Support
          </Button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {investorTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedType === type.value
                  ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Investor Cards Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500 mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No investors found. Try adjusting your filters!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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