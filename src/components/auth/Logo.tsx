import React from "react";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="w-8 h-8 bg-phase2-blue rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-lg">P2</span>
      </div>
      <span className="text-2xl font-big-shoulders font-bold text-phase2-soft-black">
        Phase2
      </span>
    </div>
  );
};
