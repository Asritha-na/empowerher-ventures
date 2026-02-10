import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Sparkles, Star, TrendingUp, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function MatchingPitchesNotification({ currentInvestor }) {
  const { data: pitches = [] } = useQuery({
    queryKey: ["pitches-for-investor-matching"],
    queryFn: () => base44.entities.Pitch.list(),
  });

  // AI matching for investor
  const getMatchingPitches = () => {
    if (!currentInvestor || !currentInvestor.focus_areas) return [];

    return pitches
      .filter(pitch => pitch.status !== 'draft')
      .map(pitch => {
        let matchScore = 0;
        let matchReasons = [];

        // Category match
        if (pitch.category && currentInvestor.focus_areas) {
          const categoryMatch = currentInvestor.focus_areas.some(area => 
            area.toLowerCase().includes(pitch.category.toLowerCase()) ||
            pitch.category.toLowerCase().includes(area.toLowerCase())
          );
          if (categoryMatch) {
            matchScore += 40;
            matchReasons.push("Matches your focus area");
          }
        }

        // Funding range match
        if (pitch.funding_needed && currentInvestor.min_investment && currentInvestor.max_investment) {
          if (pitch.funding_needed >= currentInvestor.min_investment && 
              pitch.funding_needed <= currentInvestor.max_investment) {
            matchScore += 30;
            matchReasons.push("Within your investment range");
          }
        }

        // Recent submission bonus
        const daysSinceCreated = Math.floor((new Date() - new Date(pitch.created_date)) / (1000 * 60 * 60 * 24));
        if (daysSinceCreated < 7) {
          matchScore += 20;
          matchReasons.push("New submission");
        }

        // Quality score (has structured data)
        if (pitch.structured_pitch || pitch.feedback) {
          matchScore += 10;
          matchReasons.push("AI-verified");
        }

        return {
          ...pitch,
          matchScore,
          matchReasons,
        };
      })
      .filter(pitch => pitch.matchScore > 40)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  };

  const matchingPitches = getMatchingPitches();

  if (matchingPitches.length === 0) return null;

  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center animate-pulse">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              New Matches for You!
            </h3>
            <p className="text-sm text-gray-600">
              {matchingPitches.length} {matchingPitches.length === 1 ? 'pitch matches' : 'pitches match'} your investment criteria
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {matchingPitches.map((pitch) => (
            <div
              key={pitch.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-amber-100"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{pitch.title}</h4>
                  {pitch.category && (
                    <Badge variant="secondary" className="mt-1 text-xs capitalize">
                      {pitch.category}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 text-amber-600" />
                  <span className="text-sm font-bold text-amber-700">{pitch.matchScore}%</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {pitch.matchReasons.map((reason, idx) => (
                  <span key={idx} className="text-xs text-gray-600 bg-amber-50 px-2 py-1 rounded">
                    • {reason}
                  </span>
                ))}
              </div>

              {pitch.funding_needed && (
                <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span>Seeking: <span className="font-semibold">₹{pitch.funding_needed.toLocaleString()}</span></span>
                </div>
              )}

              <Link to={createPageUrl("InvestorPitches")}>
                <Button size="sm" className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                  View Pitch
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}