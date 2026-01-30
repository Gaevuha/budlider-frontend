"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import styles from "./Select.module.css";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className = "",
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  const classes = [styles.selectTrigger, className].filter(Boolean).join(" ");

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={classes}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon style={{ opacity: 0.5 }} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className = "",
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const classes = [styles.selectContent, className].filter(Boolean).join(" ");

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={classes}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className={styles.selectViewport}>
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className = "",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  const classes = [styles.selectLabel, className].filter(Boolean).join(" ");

  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={classes}
      {...props}
    />
  );
}

function SelectItem({
  className = "",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const classes = [styles.selectItem, className].filter(Boolean).join(" ");

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={classes}
      {...props}
    >
      <span className={styles.selectItemIndicator}>
        <SelectPrimitive.ItemIndicator>
          <CheckIcon />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className = "",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  const classes = [styles.selectSeparator, className].filter(Boolean).join(" ");

  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={classes}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className = "",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  const classes = [styles.selectScrollButton, className].filter(Boolean).join(" ");

  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={classes}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className = "",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  const classes = [styles.selectScrollButton, className].filter(Boolean).join(" ");

  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={classes}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
