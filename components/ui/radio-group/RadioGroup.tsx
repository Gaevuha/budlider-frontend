"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";
import styles from "./RadioGroup.module.css";

function RadioGroup({
  className = "",
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  const classes = [styles.radioGroup, className].filter(Boolean).join(" ");

  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={classes}
      {...props}
    />
  );
}

function RadioGroupItem({
  className = "",
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  const classes = [styles.radioItem, className].filter(Boolean).join(" ");

  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={classes}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className={styles.indicator}
      >
        <CircleIcon />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
