import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

// Button variants from the approved system (§7.6), written in the shadcn/ui
// pattern (cva + cn) and mapped to PartyQuest tokens.
const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-small font-bold transition-colors duration-[120ms] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "border border-action bg-action text-on-action hover:bg-action-hover",
        secondary: "border border-border-strong bg-surface text-action",
        text: "min-h-11 border-0 bg-transparent px-1 text-action",
      },
    },
    defaultVariants: { variant: "secondary" },
  },
);

export type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant }), className)} {...props} />;
}
