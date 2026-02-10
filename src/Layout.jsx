import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import AINavigationBot from "@/components/AINavigationBot";
import BottomUtilityBar from "@/components/BottomUtilityBar";
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
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <style>{`
        :root {
          --color-primary: #f59e0b;
          --color-primary-dark: #d97706;
          --color-accent: #3b82f6;
          --color-royal: #1e293b;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0f172a;
        }
        ::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/50 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber-500/30">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/f64248ae0_WhatsAppImage2026-02-10at1233471.jpeg" 
              alt="Shakti Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-slate-100">Shakti</span>
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)} 
          className="p-2 text-slate-300 hover:text-amber-400 transition-colors"
        >
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
        className={`fixed md:static top-0 left-0 h-full w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 z-50 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/f64248ae0_WhatsAppImage2026-02-10at1233471.jpeg" 
                alt="Shakti Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-bold text-slate-100 text-lg">Shakti</span>
              <p className="text-xs text-slate-400">Empowering Women</p>
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500/20 to-orange-600/20 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.1)] border border-amber-500/30"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-amber-400" : ""}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="absolute bottom-20 left-0 right-0 p-4 border-t border-slate-800/50">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                {user.full_name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{user.full_name}</p>
                <p className="text-xs text-slate-500 capitalize">{user.user_role || "User"}</p>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 min-h-screen md:ml-0 mt-16 md:mt-0 mb-16 overflow-auto">
        {children}
      </main>

      {/* Bottom Utility Bar */}
      <BottomUtilityBar />

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
    return (
      <LanguageProvider>
        {children}
      </LanguageProvider>
    );
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