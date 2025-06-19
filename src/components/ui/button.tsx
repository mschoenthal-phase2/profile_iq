import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-raleway font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-phase2-blue text-white hover:bg-phase2-blue/90 focus-visible:ring-phase2-blue/30 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
        destructive:
          "bg-phase2-karma-coral text-white hover:bg-phase2-karma-coral/90 focus-visible:ring-phase2-karma-coral/30",
        outline:
          "border-2 border-phase2-blue text-phase2-blue bg-white hover:bg-phase2-blue hover:text-white focus-visible:ring-phase2-blue/30",
        secondary:
          "bg-phase2-net-gray text-phase2-soft-black hover:bg-phase2-dark-gray hover:text-white focus-visible:ring-phase2-dark-gray/30",
        ghost:
          "text-phase2-blue hover:bg-phase2-blue/10 focus-visible:ring-phase2-blue/30",
        link: "text-phase2-blue underline-offset-4 hover:underline focus-visible:ring-phase2-blue/30",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-10 px-4 py-2 text-sm",
        lg: "h-14 px-8 py-4 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
