import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "text";
};

export function Button({ variant = "secondary", className = "", type = "button", ...props }: ButtonProps) {
  const style = variant === "primary"
    ? "border border-action bg-action text-on-action hover:bg-action-hover"
    : variant === "text"
      ? "border-0 bg-transparent px-1 text-action"
      : "border border-border-strong bg-surface text-action";

  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-small font-bold disabled:cursor-not-allowed disabled:opacity-50 ${style} ${className}`}
      {...props}
    />
  );
}
