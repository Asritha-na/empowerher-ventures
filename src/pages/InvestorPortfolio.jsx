import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Users, TrendingUp, Calendar, Mail, Phone, Camera, User, Save, Loader2, Heart, DollarSign, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/components/LanguageProvider";
import CampaignWithInvestors from "@/components/crowdfunding/CampaignWithInvestors";
import PortfolioPerformance from "@/components/investor/PortfolioPerformance";
import ProjectedReturns from "@/components/investor/ProjectedReturns";
import AIRecommendations from "@/components/investor/AIRecommendations";

export default function InvestorPortfolio() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    bio: "",
    location: "",
    phone: "",
    company: "",
    linkedin: "",
    website: "",
  });

  useEffect(() => {
    base44.auth.me().then((u) => {
      setUser(u);
      setProfileForm({
        name: u.investor_name || "",
        bio: u.investor_bio || "",
        location: u.investor_location || "",
        phone: u.investor_phone || "",
        company: u.investor_company || "",
        linkedin: u.investor_linkedin || "",
        website: u.investor_website || "",
      });
    }).catch(() => {});
  }, []);

  const { data: investors = [] } = useQuery({
    queryKey: ["investor-data"],
    queryFn: () => base44.entities.Investor.list(),
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ["crowdfunding-campaigns"],
    queryFn: () => base44.entities.CrowdFundingCampaign.list(),
  });

  // Data for Connections tab enrichment
  const { data: allPitches = [] } = useQuery({
    queryKey: ["all-pitches-for-connections"],
    queryFn: () => base44.entities.Pitch.list("-created_date", 200),
  });
  const { data: allMembers = [] } = useQuery({
    queryKey: ["all-members-for-connections"],
    queryFn: () => base44.entities.CommunityMember.list("-created_date", 200),
  });

  // Find current investor's data
  const currentInvestor = investors.find((inv) => inv.email === user?.email);
  const connectedEntrepreneurs = currentInvestor?.is_connected || [];

  // Connections count for Active Campaigns (investor-to-investor connections)
  const { data: invConnsA = [] } = useQuery({
    queryKey: ["investor-connections-a", currentInvestor?.id],
    enabled: !!currentInvestor?.id,
    queryFn: () => base44.entities.InvestorConnection.filter({ investor_a_id: currentInvestor.id, status: 'connected' }, "-created_date", 200),
  });
  const { data: invConnsB = [] } = useQuery({
    queryKey: ["investor-connections-b", currentInvestor?.id],
    enabled: !!currentInvestor?.id,
    queryFn: () => base44.entities.InvestorConnection.filter({ investor_b_id: currentInvestor.id, status: 'connected' }, "-created_date", 200),
  });
  const activeConnectionsCount = (invConnsA.length + invConnsB.length);

  const handleSaveProfile = async () => {
    setSaving(true);
    
    // Save to User entity
    await base44.auth.updateMe({
      investor_name: profileForm.name,
      investor_bio: profileForm.bio,
      investor_location: profileForm.location,
      investor_phone: profileForm.phone,
      investor_company: profileForm.company,
      investor_linkedin: profileForm.linkedin,
      investor_website: profileForm.website,
    });

    // Also save/update in Investor entity for public visibility
    if (currentInvestor) {
      await base44.entities.Investor.update(currentInvestor.id, {
        name: profileForm.name,
        bio: profileForm.bio,
        location: profileForm.location,
        phone: profileForm.phone,
        email: user.email,
        image_url: user.profile_image,
      });
    } else {
      await base44.entities.Investor.create({
        name: profileForm.name,
        bio: profileForm.bio,
        location: profileForm.location,
        phone: profileForm.phone,
        email: user.email,
        image_url: user.profile_image,
        focus_areas: [],
        min_investment: 0,
        max_investment: 0,
        is_verified: true,
      });
    }
    
    // Refresh the investor data
    queryClient.invalidateQueries({ queryKey: ["investor-data"] });
    queryClient.invalidateQueries({ queryKey: ["investors"] });
    
    setSaving(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.auth.updateMe({ profile_image: file_url });
    
    // Also update in Investor entity
    if (currentInvestor) {
      await base44.entities.Investor.update(currentInvestor.id, {
        image_url: file_url,
      });
      queryClient.invalidateQueries({ queryKey: ["investor-data"] });
    }
    
    setUser({ ...user, profile_image: file_url });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/30 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t("myPortfolio")}</h1>
          <p className="text-gray-600">{t("trackYourInvestments")}</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white rounded-xl p-1 shadow-sm">
            <TabsTrigger value="overview" className="rounded-lg">{t("overview")}</TabsTrigger>
            <TabsTrigger value="profile" className="rounded-lg">{t("profileDetails")}</TabsTrigger>
            <TabsTrigger value="crowdfunding" className="rounded-lg">Crowd Funding</TabsTrigger>
            {user?.user_role === "investor" && (
              <TabsTrigger value="connections" className="rounded-lg">{t("connections")}</TabsTrigger>
            )}
            <TabsTrigger value="activity" className="rounded-lg">{t("activity")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Portfolio Performance Chart */}
            <PortfolioPerformance investments={currentInvestor?.investments_made || 0} />
            <p className="text-xs italic text-gray-500 mt-2">This is a simulated projection to demonstrate potential growth after investor connections.</p>

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
                  <p className="text-sm text-gray-500">{t("totalInvestments")}</p>
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
                  <p className="text-sm text-gray-500">{t("connectedEntrepreneurs")}</p>
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
                  <p className="text-sm text-gray-500">{t("rating")}</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{t("active")}</p>
                  <p className="text-sm text-gray-500">{t("status")}</p>
                </CardContent>
              </Card>
            </div>

            {/* Investor Profile */}
            {currentInvestor && (
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t("investorProfile")}</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t("focusAreas")}</p>
                      <div className="flex flex-wrap gap-2">
                        {currentInvestor.focus_areas?.map((area, i) => (
                          <Badge key={i} variant="secondary">{area}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t("investmentRange")}</p>
                      <p className="font-semibold text-gray-900">
                        ₹{currentInvestor.min_investment?.toLocaleString()} - ₹{currentInvestor.max_investment?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t("location")}</p>
                      <p className="font-semibold text-gray-900">{currentInvestor.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{t("investorType")}</p>
                      <Badge className="capitalize">{currentInvestor.category_label || currentInvestor.investor_type}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Projected Returns and AI Recommendations */}
            <div className="grid lg:grid-cols-2 gap-6">
              <ProjectedReturns investments={currentInvestor?.investments_made || 0} />
              <AIRecommendations currentInvestor={currentInvestor} />
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Picture */}
            <Card className="border-none shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{t("profilePicture")}</h2>
                <div className="flex justify-center">
                  <div className="relative">
                    {user?.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                        <User className="w-16 h-16 text-white" />
                      </div>
                    )}
                    <label className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors border-2 border-purple-200">
                      <Camera className="w-5 h-5 text-purple-600" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Complete Details Form */}
            <Card className="border-none shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{t("completeInvestorDetails")}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">{t("fullName")}</label>
                    <Input
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder={t("yourFullName")}
                      className="rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">{t("bio")}</label>
                    <Textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder={t("tellAboutYourself")}
                      className="rounded-lg min-h-[100px]"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">{t("location")}</label>
                      <Input
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        placeholder="City, State"
                        className="rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">{t("phoneNumber")}</label>
                      <Input
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+91 XXXXXXXXXX"
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">{t("company")}</label>
                    <Input
                      value={profileForm.company}
                      onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                      placeholder={t("yourCompany")}
                      className="rounded-lg"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">{t("linkedinUrl")}</label>
                      <Input
                        value={profileForm.linkedin}
                        onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/..."
                        className="rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-1 block">{t("website")}</label>
                      <Input
                        value={profileForm.website}
                        onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                        placeholder="https://..."
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-lg h-12"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Save className="w-5 h-5 mr-2" />
                    )}
                    {t("saveProfile")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crowdfunding" className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-red-500 mb-2">Crowdfunding Campaigns</h2>
              <p className="text-gray-600 text-lg">Explore active campaigns and see who's investing</p>
            </div>

            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <TrendingUp className="w-7 h-7 text-red-500" />
                  </div>
                  <p className="text-4xl font-bold text-red-500 mb-1">
                    {activeConnectionsCount}
                  </p>
                  <p className="text-sm text-gray-600">Active Campaigns</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <DollarSign className="w-7 h-7 text-green-600" />
                  </div>
                  <p className="text-4xl font-bold text-green-600 mb-1">
                    ₹{campaigns.reduce((sum, c) => sum + (c.raised_amount || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Raised</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <UserPlus className="w-7 h-7 text-blue-600" />
                  </div>
                  <p className="text-4xl font-bold text-blue-600 mb-1">
                    {campaigns.reduce((sum, c) => sum + (c.backers?.length || 0), 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Backers</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <Heart className="w-7 h-7 text-purple-600" />
                  </div>
                  <p className="text-4xl font-bold text-purple-600 mb-1">
                    {campaigns.filter(c => c.status === "funded").length}
                  </p>
                  <p className="text-sm text-gray-600">Funded</p>
                </CardContent>
              </Card>
            </div>

            {/* Campaigns List with Investor Details */}
            {campaigns.filter(c => c.status === "active").length === 0 ? (
              <div className="text-center py-16">
                <TrendingUp className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-2xl text-gray-500 mb-2">No active campaigns yet</p>
                <p className="text-gray-400">Check back soon for new crowdfunding opportunities!</p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-8">
                {campaigns.filter(c => c.status === "active").map((campaign) => (
                  <CampaignWithInvestors key={campaign.id} campaign={campaign} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="connections">
            <Card className="border-none shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t("connectedEntrepreneurs")}</h2>
                {connectedEntrepreneurs.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">You have not connected with any entrepreneurs yet.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {connectedEntrepreneurs.map((email, i) => {
                      const member = allMembers.find(m => m.created_by === email);
                      const pitch = allPitches.find(p => p.created_by === email);
                      const displayName = member?.name || (email?.split('@')[0]?.replace(/[._-]/g, ' ') || 'Entrepreneur');
                      const businessTitle = member?.business_name || pitch?.title || 'Business Idea';
                      const skills = Array.isArray(member?.skills) ? member.skills.slice(0,6) : [];
                      const section = member?.business_type || pitch?.category || null;
                      return (
                        <div key={i} className="p-4 rounded-xl bg-white border border-gray-200">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-semibold text-gray-900">{displayName}</h3>
                              <p className="text-sm text-gray-600">{businessTitle}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-700">Connected</Badge>
                          </div>
                          {skills.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Skills</p>
                              <div className="flex flex-wrap gap-1.5">
                                {skills.map((s, idx) => (
                                  <Badge key={idx} variant="secondary" className="bg-pink-100 text-pink-700 text-xs px-2 py-0.5">{s}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {section && (
                            <div className="mt-3 text-sm text-gray-700">
                              <span className="font-medium">Section of Interest: </span>
                              <span className="capitalize">{section}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="border-none shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t("recentActivity")}</h2>
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{t("noRecentActivity")}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}