import * as React from "react";
import styles from "./Alert.module.css";

type AlertVariant = "default" | "destructive";

interface AlertProps extends React.ComponentProps<"div"> {
  variant?: AlertVariant;
}

function Alert({
  className = "",
  variant = "default",
  ...props
}: AlertProps) {
  const classes = [
    styles.alert,
    styles[variant],
    className
  ].filter(Boolean).join(" ");

  return (
    <div
      data-slot="alert"
      role="alert"
      className={classes}
      {...props}
    />
  );
}

function AlertTitle({ className = "", ...props }: React.ComponentProps<"div">) {
  const classes = [styles.alertTitle, className].filter(Boolean).join(" ");

  return (
    <div
      data-slot="alert-title"
      className={classes}
      {...props}
    />
  );
}

function AlertDescription({
  className = "",
  ...props
}: React.ComponentProps<"div">) {
  const classes = [styles.alertDescription, className].filter(Boolean).join(" ");

  return (
    <div
      data-slot="alert-description"
      className={classes}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
export type { AlertProps, AlertVariant };
