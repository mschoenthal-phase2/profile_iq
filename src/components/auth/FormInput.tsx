import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon, required = false, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-raleway font-semibold text-phase2-soft-black">
          {label}
          {required && <span className="text-phase2-karma-coral ml-1">*</span>}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-phase2-dark-gray">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full px-4 py-3 border-2 rounded-lg font-raleway text-phase2-soft-black placeholder-phase2-dark-gray transition-all duration-200",
              "focus:outline-none focus:border-phase2-blue focus:ring-2 focus:ring-phase2-blue/20",
              "border-phase2-net-gray hover:border-phase2-dark-gray",
              error &&
                "border-phase2-karma-coral focus:border-phase2-karma-coral focus:ring-phase2-karma-coral/20",
              icon && "pl-11",
              className,
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-phase2-karma-coral font-raleway">
            {error}
          </p>
        )}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
