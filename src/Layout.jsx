import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import AINavigationBot from "@/components/AINavigationBot";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import {
  Home,
  Lightbulb,
  Users,
  BookOpen,
  Users2,
  Brain,
  Calendar,
  User,
  Sprout,
  Menu,
  X,
  Briefcase,
} from "lucide-react";

const entrepreneurNavItems = [
  { name: "Home", icon: Home, page: "Home" },
  { name: "My Idea", icon: Lightbulb, page: "MyIdea" },
  { name: "Find Investors", icon: Users, page: "FindInvestors" },
  { name: "Learning Hub", icon: BookOpen, page: "LearningHub" },
  { name: "Co-founder Connect", icon: Users2, page: "Community" },
  { name: "Community", icon: Users, page: "CommunityLeaderboard" },
  { name: "Meeting Notes", icon: Brain, page: "MeetingNotes" },
  { name: "Appointments", icon: Calendar, page: "Appointments" },
  { name: "Profile", icon: User, page: "Profile" },
];

const getInvestorNavItems = (t) => [
  { name: t("dashboard"), icon: Home, page: "InvestorHome" },
  { name: t("coFounderConnector"), icon: Lightbulb, page: "InvestorPitches" },
  { name: t("myPortfolio"), icon: Briefcase, page: "InvestorPortfolio" },
  { name: t("appointments"), icon: Calendar, page: "Appointments" },
  { name: t("profile"), icon: User, page: "Profile" },
];

const getEntrepreneurNavItems = (t) => [
  { name: t("home"), icon: Home, page: "Home" },
  { name: t("myIdea"), icon: Lightbulb, page: "MyIdea" },
  { name: t("findInvestors"), icon: Users, page: "FindInvestors" },
  { name: t("learningHub"), icon: BookOpen, page: "LearningHub" },
  { name: t("cofounderConnect"), icon: Users2, page: "Community" },
  { name: t("community"), icon: Users, page: "CommunityLeaderboard" },
  { name: t("meetingNotes"), icon: Brain, page: "MeetingNotes" },
  { name: t("appointments"), icon: Calendar, page: "Appointments" },
  { name: t("profile"), icon: User, page: "Profile" },
];

function LayoutInner({ children, currentPageName, user }) {
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Determine which navigation items to show
  const navItems = user?.user_role === "investor" 
    ? getInvestorNavItems(t) 
    : getEntrepreneurNavItems(t);

  return (
    <LanguageProvider>
      <div className="min-h-screen flex bg-gray-50">
        <style>{`
          :root {
            --color-primary: #d97706;
            --color-primary-light: #fef3c7;
          }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900">NariShakti</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-50 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg">NariShakti</span>
              <p className="text-xs text-gray-400">Empowering Women</p>
            </div>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-amber-600" : ""}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                {user.full_name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.full_name}</p>
                <p className="text-xs text-gray-400 capitalize">{user.user_role || "User"}</p>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 min-h-screen md:ml-0 mt-16 md:mt-0 overflow-auto">
        {children}
      </main>

      {/* AI Navigation Bot */}
      <AINavigationBot currentPage={currentPageName} />
      </div>
  );
}

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  // If no role selected, show role select page
  if (currentPageName === "RoleSelect") {
    return <>{children}</>;
  }

  // Redirect to role select if no role
  if (user && !user.user_role) {
    window.location.href = createPageUrl("RoleSelect");
    return null;
  }

  return (
    <LanguageProvider>
      <LayoutInner children={children} currentPageName={currentPageName} user={user} />
    </LanguageProvider>
  );
}