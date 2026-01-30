"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import styles from "./Checkbox.module.css";

function Checkbox({
  className = "",
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const classes = [styles.checkbox, className].filter(Boolean).join(" ");

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={classes}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={styles.indicator}
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
