import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Star, MapPin, TrendingUp, Building2, Check, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function AIInvestorMatcher({ userPitches }) {
  const [connecting, setConnecting] = useState({});

  const { data: investors = [] } = useQuery({
    queryKey: ["investors-for-matching"],
    queryFn: () => base44.entities.Investor.list(),
  });

  // AI matching algorithm
  const getMatchedInvestors = () => {
    if (!userPitches || userPitches.length === 0) return [];

    const latestPitch = userPitches[userPitches.length - 1];
    
    return investors
      .map(investor => {
        let matchScore = 0;
        let matchReasons = [];

        // Category/Focus area match (40 points)
        if (latestPitch.category && investor.focus_areas) {
          const categoryMatch = investor.focus_areas.some(area => 
            area.toLowerCase().includes(latestPitch.category.toLowerCase()) ||
            latestPitch.category.toLowerCase().includes(area.toLowerCase())
          );
          if (categoryMatch) {
            matchScore += 40;
            matchReasons.push(`Invests in ${latestPitch.category}`);
          }
        }

        // Funding range match (30 points)
        if (latestPitch.funding_needed && investor.min_investment && investor.max_investment) {
          if (latestPitch.funding_needed >= investor.min_investment && 
              latestPitch.funding_needed <= investor.max_investment) {
            matchScore += 30;
            matchReasons.push("Within investment range");
          }
        }

        // Location proximity (20 points)
        if (latestPitch.location && investor.location) {
          const pitchLocation = latestPitch.location.toLowerCase();
          const investorLocation = investor.location.toLowerCase();
          if (pitchLocation.includes(investorLocation) || investorLocation.includes(pitchLocation)) {
            matchScore += 20;
            matchReasons.push("Same region");
          }
        }

        // Investor activity (10 points)
        if (investor.investments_made > 0) {
          matchScore += 10;
          matchReasons.push("Active investor");
        }

        return {
          ...investor,
          matchScore,
          matchReasons,
        };
      })
      .filter(inv => inv.matchScore > 30)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
  };

  const matchedInvestors = getMatchedInvestors();

  const handleConnect = async (investorId) => {
    setConnecting(prev => ({ ...prev, [investorId]: true }));
    await new Promise(resolve => setTimeout(resolve, 1000));
    setConnecting(prev => ({ ...prev, [investorId]: false }));
  };

  if (!userPitches || userPitches.length === 0) {
    return (
      <Card className="border-none shadow-md bg-gradient-to-br from-purple-50 to-blue-50">
        <CardContent className="p-6 text-center">
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Create a Pitch First</h3>
          <p className="text-sm text-gray-500">
            Submit your business idea to get AI-powered investor recommendations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-purple-50 to-blue-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">AI-Recommended Investors</h3>
            <p className="text-sm text-gray-500">Best matches for your business pitch</p>
          </div>
        </div>

        {matchedInvestors.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No matching investors found yet</p>
            <p className="text-xs text-gray-400 mt-1">More investors will join soon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {matchedInvestors.map((investor) => (
              <div
                key={investor.id}
                className="bg-white rounded-xl p-5 shadow-sm border border-purple-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Investor Avatar */}
                  <div className="flex-shrink-0">
                    {investor.image_url ? (
                      <img
                        src={investor.image_url}
                        alt={investor.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                        {investor.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                    )}
                  </div>

                  {/* Investor Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">{investor.name}</h4>
                        {investor.bio && (
                          <p className="text-sm text-gray-600 line-clamp-1">{investor.bio}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-purple-600" />
                        <span className="font-bold text-purple-700">{investor.matchScore}%</span>
                      </div>
                    </div>

                    {/* Match Reasons */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {investor.matchReasons.map((reason, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-purple-50 text-purple-700">
                          <Check className="w-3 h-3 mr-1" />
                          {reason}
                        </Badge>
                      ))}
                    </div>

                    {/* Investment Details */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                      {investor.category_label && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{investor.category_label}</span>
                        </div>
                      )}
                      {investor.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{investor.location}</span>
                        </div>
                      )}
                      {investor.investments_made > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{investor.investments_made} investments</span>
                        </div>
                      )}
                    </div>

                    {/* Investment Range */}
                    {investor.min_investment && investor.max_investment && (
                      <p className="text-sm text-gray-600 mb-3">
                        Investment Range: <span className="font-semibold text-gray-900">
                          ₹{investor.min_investment.toLocaleString()} - ₹{investor.max_investment.toLocaleString()}
                        </span>
                      </p>
                    )}

                    {/* Connect Button */}
                    <Button
                      onClick={() => handleConnect(investor.id)}
                      disabled={connecting[investor.id]}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                    >
                      {connecting[investor.id] ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        "Connect with Investor"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}