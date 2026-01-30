import * as React from "react";
import styles from "./Skeleton.module.css";

function Skeleton({ className = "", ...props }: React.ComponentProps<"div">) {
  const classes = [styles.skeleton, className].filter(Boolean).join(" ");

  return (
    <div
      data-slot="skeleton"
      className={classes}
      {...props}
    />
  );
}

export { Skeleton };
