import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Users, TrendingUp, Calendar, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function InvestorPortfolio() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: investors = [] } = useQuery({
    queryKey: ["investor-data"],
    queryFn: () => base44.entities.Investor.list(),
  });

  // Find current investor's data
  const currentInvestor = investors.find((inv) => inv.email === user?.email);
  const connectedEntrepreneurs = currentInvestor?.is_connected || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/30 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Portfolio</h1>
          <p className="text-gray-600">Track your investments and connections</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white rounded-xl p-1 shadow-sm">
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="connections" className="rounded-lg">Connections</TabsTrigger>
            <TabsTrigger value="activity" className="rounded-lg">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mb-4">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {currentInvestor?.investments_made || 0}
                  </p>
                  <p className="text-sm text-gray-500">Total Investments</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {connectedEntrepreneurs.length}
                  </p>
                  <p className="text-sm text-gray-500">Connected Entrepreneurs</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {currentInvestor?.rating?.toFixed(1) || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Rating</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">Active</p>
                  <p className="text-sm text-gray-500">Status</p>
                </CardContent>
              </Card>
            </div>

            {/* Investor Profile */}
            {currentInvestor && (
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Investor Profile</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Focus Areas</p>
                      <div className="flex flex-wrap gap-2">
                        {currentInvestor.focus_areas?.map((area, i) => (
                          <Badge key={i} variant="secondary">{area}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Investment Range</p>
                      <p className="font-semibold text-gray-900">
                        ₹{currentInvestor.min_investment?.toLocaleString()} - ₹{currentInvestor.max_investment?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Location</p>
                      <p className="font-semibold text-gray-900">{currentInvestor.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Investor Type</p>
                      <Badge className="capitalize">{currentInvestor.category_label || currentInvestor.investor_type}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="connections">
            <Card className="border-none shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Connected Entrepreneurs</h2>
                {connectedEntrepreneurs.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No connections yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {connectedEntrepreneurs.map((email, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                          {email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{email}</p>
                          <p className="text-sm text-gray-500">Entrepreneur</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="border-none shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}