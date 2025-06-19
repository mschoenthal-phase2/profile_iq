import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/auth/Logo";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Shield, Zap } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-phase2-net-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo />
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-phase2-blue to-phase2-electric-violet py-20 lg:py-32 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-phase2-misty-teal opacity-10 rounded-full transform translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-phase2-karma-coral opacity-10 rounded-full transform -translate-x-32 translate-y-32" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-big-shoulders font-bold text-white mb-6">
            Amplify Your Professional Impact
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-raleway leading-relaxed max-w-3xl mx-auto mb-8">
            Your complete profile is your gateway to maximum visibility across
            all marketing initiatives. Transform your professional presence and
            reach thousands of patients through our integrated platform.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-white text-phase2-blue hover:bg-white/90 transform hover:scale-105"
              >
                Unlock Marketing Excellence
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-phase2-blue"
              >
                Access Your Dashboard
              </Button>
            </Link>
          </div>

          {/* Flowing path element */}
          <div className="mt-16">
            <svg
              width="400"
              height="60"
              viewBox="0 0 400 60"
              className="text-white/20 mx-auto"
            >
              <path
                d="M0 30 Q100 15 200 30 T400 30"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Marketing Channels Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-phase2-blue to-phase2-electric-violet rounded-2xl p-8 lg:p-12 text-white">
            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-raleway font-extrabold mb-4">
                🚀 Complete Profiles Unlock Marketing Excellence
              </h2>
              <p className="text-lg text-white/90 font-raleway max-w-3xl mx-auto">
                Transform your professional presence and reach thousands of
                patients through our integrated marketing platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold">🌐</span>
                </div>
                <span className="font-raleway font-medium">
                  Website physician listings
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold">📄</span>
                </div>
                <span className="font-raleway font-medium">
                  Print marketing materials
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold">📱</span>
                </div>
                <span className="font-raleway font-medium">
                  Digital advertising campaigns
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold">📚</span>
                </div>
                <span className="font-raleway font-medium">
                  Patient education materials
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold">🤝</span>
                </div>
                <span className="font-raleway font-medium">
                  Community outreach programs
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold">📲</span>
                </div>
                <span className="font-raleway font-medium">
                  Social media presence
                </span>
              </div>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-lg p-4 text-center">
              <p className="font-raleway font-semibold text-lg">
                🚀 Complete profiles receive 5x more patient visibility than
                incomplete ones
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-raleway font-extrabold text-phase2-soft-black mb-4">
              Four Key Benefits of Complete Profiles
            </h2>
            <p className="text-xl text-phase2-dark-gray font-raleway max-w-2xl mx-auto">
              Join thousands of healthcare providers who have unlocked their
              full marketing potential and transformed their professional
              presence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-phase2-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-raleway font-semibold text-phase2-soft-black mb-2">
                Maximum Reach
              </h3>
              <p className="text-phase2-dark-gray font-raleway">
                Your expertise featured across all marketing channels, reaching
                thousands of potential patients
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-phase2-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-raleway font-semibold text-phase2-soft-black mb-2">
                Instant Impact
              </h3>
              <p className="text-phase2-dark-gray font-raleway">
                Update once and see changes instantly reflected across all
                marketing materials
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-phase2-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-raleway font-semibold text-phase2-soft-black mb-2">
                Career Growth
              </h3>
              <p className="text-phase2-dark-gray font-raleway">
                Build your professional brand and enhance your reputation within
                your healthcare system
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-phase2-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-white text-2xl">🎯</div>
              </div>
              <h3 className="text-xl font-raleway font-semibold text-phase2-soft-black mb-2">
                Your Voice
              </h3>
              <p className="text-phase2-dark-gray font-raleway">
                Take control of your professional narrative and how patients
                discover your expertise
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-phase2-soft-black">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-phase2-blue/20 border border-phase2-blue/30 rounded-lg p-6 mb-8">
            <h3 className="text-2xl font-raleway font-bold text-white mb-2">
              ✅ 2,200+ Providers Already Participating
            </h3>
            <p className="text-white/80 font-raleway">
              Join the majority of healthcare providers who have unlocked their
              full marketing potential
            </p>
          </div>

          <h2 className="text-3xl md:text-4xl font-raleway font-extrabold text-white mb-4">
            Ready to Amplify Your Impact?
          </h2>
          <p className="text-xl text-white/80 font-raleway mb-8">
            Transform your professional presence and reach thousands of patients
            through our comprehensive marketing ecosystem
          </p>
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-phase2-blue hover:bg-phase2-blue/90"
            >
              Complete Your Profile Today
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-phase2-net-gray py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo />
            <p className="text-phase2-dark-gray font-raleway text-sm mt-4 md:mt-0">
              © 2024 ProfileIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
