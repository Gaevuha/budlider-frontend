import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import styles from "./Button.module.css";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

function Button({
  className = "",
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  const classes = [
    styles.button,
    styles[variant],
    styles[`size${size.charAt(0).toUpperCase()}${size.slice(1)}`],
    className
  ].filter(Boolean).join(" ");

  return (
    <Comp
      data-slot="button"
      className={classes}
      {...props}
    />
  );
}

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
