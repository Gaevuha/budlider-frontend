import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import styles from "./Badge.module.css";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface BadgeProps extends React.ComponentProps<"span"> {
  variant?: BadgeVariant;
  asChild?: boolean;
}

function Badge({
  className = "",
  variant = "default",
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  const classes = [
    styles.badge,
    styles[variant],
    className
  ].filter(Boolean).join(" ");

  return (
    <Comp
      data-slot="badge"
      className={classes}
      {...props}
    />
  );
}

export { Badge };
export type { BadgeProps, BadgeVariant };
