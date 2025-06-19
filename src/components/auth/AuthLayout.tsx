import React from "react";
import { Logo } from "./Logo";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left side - Branding */}
      <div className="lg:w-1/2 bg-gradient-to-br from-phase2-blue to-phase2-electric-violet p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-phase2-misty-teal opacity-20 rounded-full transform translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-phase2-karma-coral opacity-20 rounded-full transform -translate-x-24 translate-y-24" />

        <div className="relative z-10">
          <Logo className="text-white mb-8" />
          <h1 className="text-4xl lg:text-5xl font-big-shoulders font-bold text-white mb-4">
            ProfileIQ
          </h1>
          <p className="text-xl text-white/90 font-raleway leading-relaxed max-w-md">
            Intelligent healthcare provider profile management that elevates
            your professional presence
          </p>

          {/* Flowing path element */}
          <div className="mt-8">
            <svg
              width="200"
              height="40"
              viewBox="0 0 200 40"
              className="text-white/30"
            >
              <path
                d="M0 20 Q50 10 100 20 T200 20"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl lg:text-4xl font-raleway font-extrabold text-phase2-soft-black mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-phase2-dark-gray font-raleway text-lg">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
