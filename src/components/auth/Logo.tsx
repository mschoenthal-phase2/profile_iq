import React from "react";

interface LogoProps {
  className?: string;
  variant?: "white" | "dark";
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  variant = "dark",
}) => {
  const logoSrc =
    variant === "white"
      ? "https://cdn.builder.io/api/v1/assets/e4cd6bb42bf2415795f15b194eaadb85/phase2-logo-white-burst-ae069c?format=webp&width=800"
      : "https://cdn.builder.io/api/v1/assets/e4cd6bb42bf2415795f15b194eaadb85/phase2-logo-soft-black-burst-95c589?format=webp&width=800";

  const textColor =
    variant === "white" ? "text-white" : "text-phase2-soft-black";

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img src={logoSrc} alt="Phase2 Logo" className="w-8 h-8 object-contain" />
      <span className={`text-2xl font-big-shoulders font-bold ${textColor}`}>
        ProfileIQ
      </span>
    </div>
  );
};
