"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import styles from "./Tabs.module.css";

function Tabs({
  className = "",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const classes = [styles.tabs, className].filter(Boolean).join(" ");

  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={classes}
      {...props}
    />
  );
}

function TabsList({
  className = "",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const classes = [styles.tabsList, className].filter(Boolean).join(" ");

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={classes}
      {...props}
    />
  );
}

function TabsTrigger({
  className = "",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const classes = [styles.tabsTrigger, className].filter(Boolean).join(" ");

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={classes}
      {...props}
    />
  );
}

function TabsContent({
  className = "",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  const classes = [styles.tabsContent, className].filter(Boolean).join(" ");

  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={classes}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
