import React from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Users, TrendingUp, Lightbulb, Heart, Shield, Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Lightbulb,
    title: "Voice-First Pitch Creation",
    description: "Share your business idea in your native language using voice or video. Our AI helps structure your pitch professionally.",
  },
  {
    icon: Users,
    title: "Connect with Investors",
    description: "Access a network of investors, CSR funds, NGOs, and angel investors interested in supporting women entrepreneurs.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Coaching",
    description: "Get personalized feedback on your pitch, business model, and growth strategy from our AI mentor.",
  },
  {
    icon: TrendingUp,
    title: "Learning Hub",
    description: "Access free business courses in multiple Indian languages covering marketing, finance, branding, and more.",
  },
  {
    icon: Heart,
    title: "Co-Founder Matching",
    description: "Find the perfect business partner with complementary skills to grow your venture together.",
  },
  {
    icon: Shield,
    title: "Verified Investor Network",
    description: "All investors are verified to ensure safe and genuine funding opportunities for your business.",
  },
];

const successStories = [
  {
    name: "Priya Sharma",
    business: "Handloom Textiles",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop",
    story: "Started with ₹50,000 investment through Shakti, now employing 25 women artisans with ₹2Cr annual revenue.",
    funding: "₹50,000",
    growth: "40x",
  },
  {
    name: "Lakshmi Reddy",
    business: "Organic Food Products",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    story: "Connected with CSR funding, scaled from village kitchen to 3 retail stores across Hyderabad.",
    funding: "₹2,00,000",
    growth: "15x",
  },
  {
    name: "Anjali Patel",
    business: "Beauty & Wellness",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    story: "Found a co-founder through Shakti, launched an app-based beauty service with 500+ bookings/month.",
    funding: "₹1,00,000",
    growth: "25x",
  },
];

export default function Landing() {
  const handleAuth = () => {
    base44.auth.redirectToLogin();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/f64248ae0_WhatsAppImage2026-02-10at1233471.jpeg" 
                alt="Shakti Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-gray-900 text-xl">Shakti</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={handleAuth} className="text-gray-700 hover:text-[#E31B23]">
              Login
            </Button>
            <Button onClick={handleAuth} className="bg-[#E31B23] hover:bg-[#C9161D] text-white shadow-sm">
              Sign Up Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Empowering Women
              <span className="block mt-2 bg-gradient-to-r from-[#E31B23] to-[#C9161D] bg-clip-text text-transparent">
                Entrepreneurs
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Turn your dreams into thriving businesses. Connect with investors, get AI coaching, and join a community of 10,000+ women entrepreneurs across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleAuth}
                className="bg-[#E31B23] hover:bg-[#C9161D] text-white text-lg px-8 py-6 h-auto shadow-lg"
              >
                Start Your Journey Free →
              </Button>
              <Button
                variant="outline"
                className="border-2 border-gray-300 hover:border-[#E31B23] hover:text-[#E31B23] text-lg px-8 py-6 h-auto"
                onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              ✓ No credit card required  ✓ 100% Free  ✓ Available in 15+ Indian languages
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto"
          >
            {[
              { value: "10,000+", label: "Women Entrepreneurs" },
              { value: "₹50 Cr+", label: "Funding Facilitated" },
              { value: "500+", label: "Verified Investors" },
              { value: "15+", label: "Indian Languages" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white shadow-md border border-gray-100">
                <p className="text-3xl font-bold text-[#E31B23] mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From idea to investment, we support you at every step of your entrepreneurial journey.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-gray-200">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#E31B23] to-[#C9161D] flex items-center justify-center mb-4 shadow-md">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Women Who Made It Happen
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories of women who transformed their dreams into successful businesses through Shakti.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200 h-full">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white font-bold text-lg">{story.name}</p>
                      <p className="text-white/90 text-sm">{story.business}</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-700 mb-4 leading-relaxed">{story.story}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-500">Funding</p>
                        <p className="font-bold text-[#E31B23]">{story.funding}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Growth</p>
                        <p className="font-bold text-green-600">{story.growth}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About/Vision Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Vision: Empowering 1 Million Women by 2030
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Shakti was born from a simple belief: every woman with a business idea deserves access to funding, mentorship, and a supportive community—regardless of education, background, or location.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We're breaking barriers with voice-first technology, multilingual support, and AI-powered coaching to make entrepreneurship accessible to every woman across India.
              </p>
              <div className="space-y-4">
                {[
                  "Voice & video pitch creation in 15+ languages",
                  "Direct access to verified investors and CSR funds",
                  "Free business education and AI mentorship",
                  "Safe, verified community of women entrepreneurs",
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#E31B23] flex items-center justify-center mt-0.5 flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=800&fit=crop"
                alt="Women entrepreneurs"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#E31B23] to-[#C9161D]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of women entrepreneurs building their dreams with Shakti.
          </p>
          <Button
            onClick={handleAuth}
            className="bg-white text-[#E31B23] hover:bg-gray-100 text-lg px-10 py-6 h-auto shadow-xl"
          >
            Get Started Free →
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6988ce510df9dcc25137f48f/f64248ae0_WhatsAppImage2026-02-10at1233471.jpeg" 
                    alt="Shakti Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-bold text-xl">Shakti</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering women entrepreneurs across India with funding, mentorship, and community.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">About</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mission & Vision</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Team</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>1800-123-4567</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>hello@shakti.in</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>Bangalore, Karnataka, India</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© 2026 Shakti. All rights reserved. Made with ❤️ for women entrepreneurs across India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}