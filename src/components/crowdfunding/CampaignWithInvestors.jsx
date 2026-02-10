import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, UserPlus, Building2, Briefcase, TrendingUp, Users, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function CampaignWithInvestors({ campaign }) {
  const progressPercentage = ((campaign.raised_amount || 0) / campaign.goal_amount) * 100;
  const daysLeft = campaign.end_date ? Math.max(0, Math.ceil((new Date(campaign.end_date) - new Date()) / (1000 * 60 * 60 * 24))) : 0;

  // Fetch all investors to match with backers
  const { data: allInvestors = [] } = useQuery({
    queryKey: ["all-investors"],
    queryFn: () => base44.entities.Investor.list(),
  });

  // Match backers with investor profiles
  const enrichedBackers = (campaign.backers || []).map((backer) => {
    const investorProfile = allInvestors.find((inv) => inv.email === backer.email);
    return {
      ...backer,
      profile: investorProfile,
    };
  });

  const getInvestmentStage = (amount) => {
    if (amount < 50000) return "Seed";
    if (amount < 200000) return "Early Stage";
    if (amount < 500000) return "Series A";
    return "Growth Stage";
  };

  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-0">
        {campaign.image_url && (
          <img
            src={campaign.image_url}
            alt={campaign.title}
            className="w-full h-56 object-cover rounded-t-xl"
          />
        )}
        <div className="p-6">
          {/* Campaign Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-2xl text-gray-900 mb-1">{campaign.title}</h3>
              <p className="text-sm text-gray-500">by {campaign.entrepreneur_name}</p>
              {campaign.location && (
                <p className="text-xs text-gray-400 mt-1">📍 {campaign.location}</p>
              )}
            </div>
            {campaign.category && (
              <Badge variant="secondary" className="capitalize text-sm px-3 py-1">
                {campaign.category}
              </Badge>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-5 leading-relaxed">{campaign.description}</p>

          {/* Progress Section */}
          <div className="mb-5">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-gray-900 text-lg">
                ₹{(campaign.raised_amount || 0).toLocaleString()}
              </span>
              <span className="text-gray-500">
                Goal: ₹{campaign.goal_amount.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <UserPlus className="w-4 h-4" />
                <span className="font-medium">{enrichedBackers.length} investors</span>
              </div>
              {daysLeft > 0 && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{daysLeft} days remaining</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>{progressPercentage.toFixed(0)}% funded</span>
              </div>
            </div>
          </div>

          {/* Investor Details Section */}
          {enrichedBackers.length > 0 && (
            <div className="border-t pt-5 mb-5">
              <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Participating Investors ({enrichedBackers.length})
              </h4>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {enrichedBackers.map((backer, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100"
                  >
                    <div className="flex items-start gap-4">
                      {/* Investor Avatar */}
                      <div className="flex-shrink-0">
                        {backer.profile?.image_url ? (
                          <img
                            src={backer.profile.image_url}
                            alt={backer.name}
                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {backer.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                      </div>

                      {/* Investor Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h5 className="font-bold text-gray-900 text-base">{backer.name}</h5>
                            {backer.profile?.bio && (
                              <p className="text-xs text-gray-600 mt-1 line-clamp-1">{backer.profile.bio}</p>
                            )}
                          </div>
                          {backer.profile?.is_verified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>

                        {/* Company/Organization */}
                        {backer.profile && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Building2 className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700 font-medium">
                                {backer.profile.category_label || backer.profile.investor_type || "Investor"}
                              </span>
                            </div>
                            {backer.profile.location && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500">📍</span>
                                <span className="text-gray-700">{backer.profile.location}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Investment Details */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3 bg-white rounded-lg p-3 border border-blue-200">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Investment Amount</p>
                            <p className="font-bold text-green-600 text-base">
                              ₹{backer.amount.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Investment Stage</p>
                            <Badge className="bg-purple-100 text-purple-700 text-xs">
                              {getInvestmentStage(backer.amount)}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Date</p>
                            <p className="text-sm text-gray-700">
                              {new Date(backer.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Focus Areas & Connections */}
                        {backer.profile && (
                          <div className="space-y-2">
                            {backer.profile.focus_areas && backer.profile.focus_areas.length > 0 && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Focus Areas</p>
                                <div className="flex flex-wrap gap-1">
                                  {backer.profile.focus_areas.slice(0, 3).map((area, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {area}
                                    </Badge>
                                  ))}
                                  {backer.profile.focus_areas.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{backer.profile.focus_areas.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}

                            {backer.profile.investments_made > 0 && (
                              <div className="flex items-center gap-3 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Briefcase className="w-3 h-3" />
                                  <span>{backer.profile.investments_made} investments</span>
                                </div>
                                {backer.profile.is_connected && backer.profile.is_connected.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    <span>{backer.profile.is_connected.length} connections</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Button */}
          <Button className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-lg h-12 text-base font-semibold">
            <Heart className="w-5 h-5 mr-2" />
            Back This Campaign
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}