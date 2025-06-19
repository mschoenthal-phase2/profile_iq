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
            ProfileIQ
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-raleway leading-relaxed max-w-3xl mx-auto mb-8">
            Intelligent healthcare provider profile management that transforms
            how you showcase your expertise, credentials, and professional
            achievements in today's digital healthcare landscape.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-white text-phase2-blue hover:bg-white/90 transform hover:scale-105"
              >
                Elevate Your Profile
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

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-raleway font-extrabold text-phase2-soft-black mb-4">
              Intelligent Profile Management for Healthcare Excellence
            </h2>
            <p className="text-xl text-phase2-dark-gray font-raleway max-w-2xl mx-auto">
              Advanced technology meets healthcare expertise. Showcase your
              credentials, build meaningful professional connections, and
              accelerate your career growth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-phase2-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-raleway font-semibold text-phase2-soft-black mb-2">
                Strategic Networking
              </h3>
              <p className="text-phase2-dark-gray font-raleway">
                Build meaningful professional relationships with intelligent
                matching and advanced networking tools designed for healthcare
                leaders
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-phase2-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-raleway font-semibold text-phase2-soft-black mb-2">
                Enterprise Security
              </h3>
              <p className="text-phase2-dark-gray font-raleway">
                Bank-level encryption and HIPAA compliance ensure your
                professional data remains secure while maintaining accessibility
                and performance
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-phase2-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-raleway font-semibold text-phase2-soft-black mb-2">
                Intelligent Automation
              </h3>
              <p className="text-phase2-dark-gray font-raleway">
                AI-powered profile optimization and smart credential management
                that adapts to your career progression and industry trends
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-phase2-soft-black">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-raleway font-extrabold text-white mb-4">
            Transform Your Professional Presence
          </h2>
          <p className="text-xl text-white/80 font-raleway mb-8">
            Join the next generation of healthcare professionals leveraging
            intelligent profile management to accelerate their careers and
            expand their impact
          </p>
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-phase2-blue hover:bg-phase2-blue/90"
            >
              Start Your Intelligent Profile
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
