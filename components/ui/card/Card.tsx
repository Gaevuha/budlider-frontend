import * as React from "react";
import styles from "./Card.module.css";

function Card({ className = "", ...props }: React.ComponentProps<"div">) {
  const classes = [styles.card, className].filter(Boolean).join(" ");

  return (
    <div
      data-slot="card"
      className={classes}
      {...props}
    />
  );
}

function CardHeader({ className = "", ...props }: React.ComponentProps<"div">) {
  const classes = [styles.cardHeader, className].filter(Boolean).join(" ");

  return (
    <div
      data-slot="card-header"
      className={classes}
      {...props}
    />
  );
}

function CardTitle({ className = "", ...props }: React.ComponentProps<"div">) {
  const classes = [styles.cardTitle, className].filter(Boolean).join(" ");

  return (
    <h4
      data-slot="card-title"
      className={classes}
      {...props}
    />
  );
}

function CardDescription({ className = "", ...props }: React.ComponentProps<"div">) {
  const classes = [styles.cardDescription, className].filter(Boolean).join(" ");

  return (
    <p
      data-slot="card-description"
      className={classes}
      {...props}
    />
  );
}

function CardAction({ className = "", ...props }: React.ComponentProps<"div">) {
  const classes = [styles.cardAction, className].filter(Boolean).join(" ");

  return (
    <div
      data-slot="card-action"
      className={classes}
      {...props}
    />
  );
}

function CardContent({ className = "", ...props }: React.ComponentProps<"div">) {
  const classes = [styles.cardContent, className].filter(Boolean).join(" ");

  return (
    <div
      data-slot="card-content"
      className={classes}
      {...props}
    />
  );
}

function CardFooter({ className = "", ...props }: React.ComponentProps<"div">) {
  const classes = [styles.cardFooter, className].filter(Boolean).join(" ");

  return (
    <div
      data-slot="card-footer"
      className={classes}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
