"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import styles from "./Separator.module.css";

function Separator({
  className = "",
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  const classes = [styles.separator, className].filter(Boolean).join(" ");

  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={classes}
      {...props}
    />
  );
}

export { Separator };
