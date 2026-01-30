"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import styles from "./Dialog.module.css";

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className = "",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  const classes = [styles.dialogOverlay, className].filter(Boolean).join(" ");

  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={classes}
      {...props}
    />
  );
}

function DialogContent({
  className = "",
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  const classes = [styles.dialogContent, className].filter(Boolean).join(" ");

  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={classes}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className={styles.dialogCloseButton}>
          <XIcon />
          <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className = "", ...props }: React.ComponentProps<"div">) {
  const classes = [styles.dialogHeader, className].filter(Boolean).join(" ");

  return (
    <div
      data-slot="dialog-header"
      className={classes}
      {...props}
    />
  );
}

function DialogFooter({ className = "", ...props }: React.ComponentProps<"div">) {
  const classes = [styles.dialogFooter, className].filter(Boolean).join(" ");

  return (
    <div
      data-slot="dialog-footer"
      className={classes}
      {...props}
    />
  );
}

function DialogTitle({
  className = "",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  const classes = [styles.dialogTitle, className].filter(Boolean).join(" ");

  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={classes}
      {...props}
    />
  );
}

function DialogDescription({
  className = "",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  const classes = [styles.dialogDescription, className].filter(Boolean).join(" ");

  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={classes}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
