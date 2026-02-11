import React from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Mic,
  Bot,
  ShieldCheck,
  Languages,
  GraduationCap,
  Store,
  LineChart,
  Users,
  Lightbulb,
} from "lucide-react";
import SuccessStoriesCarousel from "@/components/landing/SuccessStoriesCarousel.jsx";

// PUBLIC LANDING PAGE (marketing) - separate from dashboard
export default function Home() {
  const handleLogin = () => base44.auth.redirectToLogin(createPageUrl("Profile"));
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Top Navigation (public only) */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#8B1E1E] flex items-center justify-center text-white font-bold">S</div>
            <span className="text-lg font-semibold tracking-tight">Shakti</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <button onClick={() => scrollTo("features")} className="hover:text-gray-900">Features</button>
            <button onClick={() => scrollTo("stories")} className="hover:text-gray-900">Success Stories</button>
            <button onClick={() => scrollTo("how-it-works")} className="hover:text-gray-900">How it works</button>
            <button onClick={handleLogin} className="hover:text-gray-900">Login</button>
            <Button onClick={handleLogin} className="bg-[#8B1E1E] hover:bg-[#751818] text-white rounded-full px-5 py-2 h-auto">Get Started</Button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_100%_0%,#EEF2FF_0%,transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight"
            >
              Empowering Women to Build Scalable Businesses
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="mt-5 text-lg text-gray-600 max-w-xl"
            >
              A powerful bridge between women entrepreneurs and verified investors.
            </motion.p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button onClick={handleLogin} className="bg-[#8B1E1E] hover:bg-[#751818] text-white rounded-full px-7 py-3 h-auto text-base">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={() => scrollTo("features")} className="rounded-full px-7 py-3 h-auto text-base border-gray-300">
                Learn More
              </Button>
            </div>
          </div>

          {/* Right visual (replace with your image asset later) */}
          <div className="relative">
            <div className="aspect-[4/3] w-full rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm" />
            <p className="sr-only">Hero visual placeholder</p>
          </div>
        </div>
      </section>

      {/* TRUST & IMPACT */}
      <section className="py-12 md:py-16 border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[{k:"1,000+",l:"Women Entrepreneurs"},{k:"250+",l:"Verified Investors"},{k:"₹5Cr+",l:"Funding Facilitated"},{k:"30+",l:"Cities Connected"}].map((s,idx)=>(
              <div key={idx} className="rounded-xl bg-white border border-gray-100 p-6 text-center shadow-sm">
                <div className="text-2xl font-bold tracking-tight">{s.k}</div>
                <div className="text-sm text-gray-600 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVERYTHING YOU NEED TO SUCCEED */}
      <section id="features" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything You Need to Succeed</h2>
            <p className="mt-3 text-gray-600">Shakti is a modern, secure platform that accelerates women-led entrepreneurship.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {icon: Mic, title: "Voice-First Pitch Submission", desc: "Record or upload your idea in minutes—no complex forms."},
              {icon: Bot, title: "AI Pitch Coach", desc: "Instant, actionable feedback to make your pitch investor-ready."},
              {icon: Users, title: "Verified Investors", desc: "Connect with a growing network of trusted investors."},
              {icon: GraduationCap, title: "Learning Hub", desc: "Short courses and templates to build and scale smart."},
              {icon: Store, title: "D2C Marketplace", desc: "Launch and showcase your products to real customers."},
              {icon: Languages, title: "Multilingual Support", desc: "Work in the language you’re most comfortable with."},
              {icon: ShieldCheck, title: "Safe & Secure Platform", desc: "Enterprise-grade security and privacy controls."},
              {icon: LineChart, title: "Impact Tracking", desc: "Track growth, outcomes, and social impact over time."},
            ].map((f, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 mb-4">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section id="stories" className="py-16 bg-gray-50/60 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Success Stories</h2>
            <p className="mt-3 text-gray-600">Women building impactful businesses through Shakti</p>
          </div>
          <SuccessStoriesCarousel />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {icon: Lightbulb, title: "Share Your Idea", desc: "Describe your business in your voice—fast and simple."},
              {icon: Bot, title: "Get AI Feedback", desc: "Receive clear suggestions to refine your pitch instantly."},
              {icon: Users, title: "Connect with Investors", desc: "Reach verified investors and take the next step."},
            ].map((s, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto flex items-center justify-center text-gray-700 mb-4">
                  <s.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 md:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Start Your Entrepreneurial Journey Today</h2>
          <p className="mt-3 text-gray-600">Join Shakti and turn your vision into impact.</p>
          <Button onClick={handleLogin} className="mt-8 bg-[#8B1E1E] hover:bg-[#751818] text-white rounded-full px-8 py-3 h-auto text-base">
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-sm text-gray-600">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-[#8B1E1E] text-white flex items-center justify-center text-xs font-bold">S</div>
              <span className="font-semibold text-gray-900">Shakti</span>
            </div>
            <p className="text-gray-600">A trusted platform bridging women entrepreneurs and verified investors.</p>
          </div>
          <div>
            <div className="font-semibold text-gray-900 mb-3">About</div>
            <ul className="space-y-2">
              <li><button onClick={() => scrollTo("features")} className="hover:text-gray-900">Platform</button></li>
              <li><button onClick={() => scrollTo("how-it-works")} className="hover:text-gray-900">How it Works</button></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-gray-900 mb-3">Legal</div>
            <ul className="space-y-2">
              <li><a className="hover:text-gray-900" href="#" onClick={(e)=>e.preventDefault()}>Privacy Policy</a></li>
              <li><a className="hover:text-gray-900" href="#" onClick={(e)=>e.preventDefault()}>Terms</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-gray-900 mb-3">Contact</div>
            <ul className="space-y-2">
              <li><a className="hover:text-gray-900" href="mailto:hello@shakti.app">hello@shakti.app</a></li>
              <li className="flex gap-3">
                <a className="hover:text-gray-900" href="#" onClick={(e)=>e.preventDefault()}>LinkedIn</a>
                <a className="hover:text-gray-900" href="#" onClick={(e)=>e.preventDefault()}>Twitter/X</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-6">© {new Date().getFullYear()} Shakti. All rights reserved.</div>
      </footer>
    </div>
  );
}