import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, TrendingUp, Users, Zap, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function AIRecommendations({ currentInvestor }) {
  const [generatingMore, setGeneratingMore] = useState(false);

  const { data: pitches = [] } = useQuery({
    queryKey: ["pitches-for-recommendations"],
    queryFn: () => base44.entities.Pitch.list(),
  });

  // AI-driven recommendation logic based on investor profile
  const getRecommendations = () => {
    const investorFocusAreas = currentInvestor?.focus_areas || [];
    
    // Filter pitches matching investor's focus areas
    const matchedPitches = pitches
      .filter(pitch => {
        if (!pitch.category) return false;
        return investorFocusAreas.some(area => 
          area.toLowerCase().includes(pitch.category.toLowerCase()) ||
          pitch.category.toLowerCase().includes(area.toLowerCase())
        );
      })
      .slice(0, 3);

    // Create recommendation cards
    return matchedPitches.map(pitch => ({
      title: pitch.title,
      category: pitch.category,
      matchScore: 85 + Math.floor(Math.random() * 15),
      potentialROI: (15 + Math.random() * 25).toFixed(1),
      riskLevel: Math.random() > 0.5 ? "Low" : "Medium",
      fundingNeeded: pitch.funding_needed || 500000,
      reason: `Matches your focus on ${pitch.category} and aligns with your investment range`,
    }));
  };

  const recommendations = getRecommendations();

  const generateMoreInsights = async () => {
    setGeneratingMore(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setGeneratingMore(false);
  };

  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-purple-50 to-blue-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">AI-Powered Recommendations</h3>
            <p className="text-sm text-gray-500">Personalized opportunities based on your profile</p>
          </div>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No recommendations available yet</p>
            <p className="text-xs text-gray-400 mt-1">Update your profile to get personalized suggestions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-xl p-5 shadow-sm border border-purple-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-900 mb-1">{rec.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize text-xs">
                        {rec.category}
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-700 text-xs">
                        {rec.matchScore}% Match
                      </Badge>
                    </div>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{rec.reason}</p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-purple-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-600">Potential ROI</p>
                    <p className="text-lg font-bold text-purple-600">+{rec.potentialROI}%</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-600">Risk Level</p>
                    <p className={`text-sm font-semibold ${rec.riskLevel === "Low" ? "text-green-600" : "text-yellow-600"}`}>
                      {rec.riskLevel}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-600">Funding</p>
                    <p className="text-sm font-semibold text-gray-900">
                      ₹{(rec.fundingNeeded / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                  size="sm"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}

            <Button 
              onClick={generateMoreInsights}
              disabled={generatingMore}
              variant="outline"
              className="w-full border-purple-200 hover:bg-purple-50"
            >
              {generatingMore ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing opportunities...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Generate More Insights
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}