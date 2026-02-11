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
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)' }}>
      <style>{`
        :root {
          --color-primary: #4F46E5;
          --color-sidebar: #1F2937;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #F9FAFB;
        }
        ::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #4F46E5;
        }
      `}</style>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-50 shadow-lg sidebar-dark">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#6366F1] flex items-center justify-center shadow-md">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/f64248ae0_WhatsAppImage2026-02-10at1233471.jpeg" 
              alt="Shakti Logo" 
              className="w-6 h-6 object-cover rounded-full"
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
        className={`fixed md:static top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 sidebar-dark ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#6366F1] flex items-center justify-center shadow-lg">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/f64248ae0_WhatsAppImage2026-02-10at1233471.jpeg" 
                alt="Shakti Logo" 
                className="w-8 h-8 object-cover rounded-full"
              />
            </div>
            <div>
              <span className="font-bold text-white text-lg">Shakti</span>
              <p className="text-xs text-gray-400">Empowering Women</p>
            </div>
          </div>

          <div className="space-y-2">
            {navItems.map((item, index) => {
              const isActive = currentPageName === item.page;
              return (
                <motion.div
                  key={item.page}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={createPageUrl(item.page)}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#4F46E5] text-white shadow-[0_4px_16px_rgba(79,70,229,0.3)]' 
                        : 'text-gray-300 hover:bg-[#374151] hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                </motion.div>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me()
      .then(setUser)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Show landing page (no layout)
  if (currentPageName === "Landing") {
    return children;
  }

  // If no role selected, show role select page
  if (currentPageName === "RoleSelect") {
    return (
      <LanguageProvider>
        {children}
      </LanguageProvider>
    );
  }

  // Wait for auth check
  if (loading) {
    return null;
  }

  // Redirect to landing if not authenticated
  if (!user) {
    window.location.href = createPageUrl("Landing");
    return null;
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