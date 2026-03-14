import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap border-0 border-b bg-transparent px-0 text-sm font-semibold tracking-[0.02em] ring-offset-background transition-[color,border-color,opacity] focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-primary/40 text-primary hover:border-twitter-blue hover:text-twitter-blue",
        destructive: "border-destructive/35 text-destructive hover:border-twitter-blue hover:text-twitter-blue",
        outline: "border-border text-foreground hover:border-twitter-blue hover:text-twitter-blue",
        secondary: "border-border text-civic-slate hover:border-twitter-blue/60 hover:text-twitter-blue",
        ghost: "border-transparent text-muted-foreground hover:border-twitter-blue/40 hover:text-twitter-blue",
        link: "text-primary underline-offset-4 hover:text-twitter-blue hover:underline",
        civic: "border-civic-amber/60 text-foreground hover:border-twitter-blue hover:text-twitter-blue",
        "civic-outline": "border-border text-civic-slate hover:border-twitter-blue/60 hover:text-twitter-blue",
      },
      size: {
        default: "min-h-10 py-2",
        sm: "min-h-9 py-1.5 text-xs",
        lg: "min-h-11 py-2.5 text-base",
        icon: "h-10 w-10 border-0 p-0",
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
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
