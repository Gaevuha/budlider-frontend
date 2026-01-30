"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import styles from "./Switch.module.css";

function Switch({
  className = "",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const classes = [styles.switch, className].filter(Boolean).join(" ");

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={classes}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={styles.thumb}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
