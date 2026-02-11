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
  { name: t("home"), icon: Home, page: "Dashboard" },
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
    <div className="min-h-screen flex items-stretch" style={{ background: 'linear-gradient(135deg, #FDE8EC 0%, #FCF4F6 100%)' }}>
      <style>{`
        :root {
          --color-primary: #8B1E1E;
          --color-sidebar: #E79A9A;
          --color-hero-start: #B94B5A;
          --color-hero-end: #D8707C;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #FDE8EC;
        }
        ::-webkit-scrollbar-thumb {
          background: #E79A9A;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #B94B5A;
        }
      `}</style>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-50 shadow-md" style={{ background: '#E79A9A' }}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#E31B23] flex items-center justify-center">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/f64248ae0_WhatsAppImage2026-02-10at1233471.jpeg" 
              alt="Shakti Logo" 
              className="w-6 h-6 object-cover rounded-full"
            />
          </div>
          <span className="font-bold text-gray-900">Shakti</span>
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)} 
          className="p-2 text-gray-900 hover:text-[#8B1E1E] transition-colors"
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
        className={`fixed md:static top-0 left-0 h-screen md:h-auto md:self-stretch w-[260px] z-50 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ background: '#E79A9A' }}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-full bg-[#E31B23] flex items-center justify-center shadow-md">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/f64248ae0_WhatsAppImage2026-02-10at1233471.jpeg" 
                alt="Shakti Logo" 
                className="w-8 h-8 object-cover rounded-full"
              />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg">Shakti</span>
              <p className="text-xs text-gray-700">Empowering Women</p>
            </div>
          </div>

          <div className="space-y-3">
            {navItems.map((item) => {
              const isActive = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all duration-200 text-white shadow-md"
                  style={{
                    background: '#8B1E1E',
                    borderRadius: '24px'
                  }}
                >
                  <item.icon className="w-5 h-5 text-white" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 min-h-screen md:ml-0 mt-16 md:mt-0 mb-16">
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

  // Public pages (no sidebar/layout)
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

  // Wait for auth check (avoid loops)
  if (loading) return null;

  // Redirect to public Home if not authenticated
  if (!user) {
    base44.auth.redirectToLogin(createPageUrl("Profile"));
    return null;
  }

  // Enforce profile completion before accessing the app (except Profile)
  const isProfileComplete = Boolean(user?.phone);
  if (!isProfileComplete && currentPageName !== "Profile") {
    window.location.href = createPageUrl("Profile");
    return null;
  }
  // If profile is complete and user visits Profile, send to Dashboard
  if (isProfileComplete && currentPageName === "Profile") {
    window.location.href = createPageUrl("Dashboard");
    return null;
  }

  return (
    <LanguageProvider>
      <LayoutInner children={children} currentPageName={currentPageName} user={user} />
    </LanguageProvider>
  );
}