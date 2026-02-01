"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import styles from "./Label.module.css";

export default function Label({
  className = "",
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const classes = [styles.label, className].filter(Boolean).join(" ");

  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={classes}
      {...props}
    />
  );
}

export { Label };
