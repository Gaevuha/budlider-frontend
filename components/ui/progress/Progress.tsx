"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import styles from "./Progress.module.css";

function Progress({
  className = "",
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const classes = [styles.progress, className].filter(Boolean).join(" ");

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={classes}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={styles.indicator}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
