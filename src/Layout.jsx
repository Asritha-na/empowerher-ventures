import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import AINavigationBot from "@/components/AINavigationBot";
import BottomUtilityBar from "@/components/BottomUtilityBar";
import { LanguageProvider, useLanguage } from "@/components/LanguageProvider";
import { motion } from "framer-motion";
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
    <div className="min-h-screen flex" style={{background: 'linear-gradient(135deg, #000000 0%, #0a0a14 50%, #1a0b2e 100%)'}}>
      <style>{`
        :root {
          --color-primary: #7c3aed;
          --color-secondary: #ec4899;
          --color-accent: #3b82f6;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(10, 10, 20, 0.5);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(124, 58, 237, 0.5);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(124, 58, 237, 0.7);
        }
      `}</style>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black border-b border-purple-500/20 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-purple-500/30 shadow-sm">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/f64248ae0_WhatsAppImage2026-02-10at1233471.jpeg" 
              alt="Shakti Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-white">Shakti</span>
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)} 
          className="p-2 text-gray-300 hover:text-white transition-colors"
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
        className={`fixed md:static top-0 left-0 h-full w-64 bg-black border-r border-purple-500/20 z-50 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-purple-500/30 glow-purple">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/f64248ae0_WhatsAppImage2026-02-10at1233471.jpeg" 
                alt="Shakti Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-bold text-white text-lg">Shakti</span>
              <p className="text-xs text-purple-300">Empowering Women</p>
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
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white glow-purple"
                      : "text-gray-300 hover:bg-purple-900/30 hover:text-white"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>


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