import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/auth/Logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-phase2-net-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo />
            <Link to="/login">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={16} className="mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-raleway font-extrabold text-phase2-soft-black mb-8 text-center">
          Forgot Password
        </h1>

        <div className="bg-phase2-blue/5 border border-phase2-blue/20 rounded-lg p-8 text-center">
          <h2 className="text-xl font-raleway font-semibold text-phase2-soft-black mb-4">
            Password Recovery Coming Soon
          </h2>
          <p className="text-phase2-dark-gray font-raleway mb-6">
            Password recovery functionality is being implemented. For now,
            please contact support if you need help accessing your account.
          </p>
          <Link to="/login">
            <Button>
              <ArrowLeft size={16} className="mr-2" />
              Return to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
