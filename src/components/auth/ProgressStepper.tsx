import React from "react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  completed: boolean;
  active: boolean;
}

interface ProgressStepperProps {
  steps: Step[];
  className?: string;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  steps,
  className,
}) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center space-y-2">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                  {
                    "bg-phase2-blue border-phase2-blue text-white":
                      step.completed || step.active,
                    "border-phase2-net-gray text-phase2-net-gray":
                      !step.completed && !step.active,
                  },
                )}
              >
                {step.completed ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-sm font-raleway font-semibold">
                    {step.id}
                  </span>
                )}
              </div>
              <span
                className={cn("text-xs font-raleway text-center max-w-16", {
                  "text-phase2-blue font-semibold":
                    step.completed || step.active,
                  "text-phase2-net-gray": !step.completed && !step.active,
                })}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn("flex-1 h-0.5 mx-4 transition-all duration-200", {
                  "bg-phase2-blue": step.completed,
                  "bg-phase2-net-gray": !step.completed,
                })}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
