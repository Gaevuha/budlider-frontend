import * as React from "react";
import styles from "./Input.module.css";

function Input({ className = "", type, ...props }: React.ComponentProps<"input">) {
  const classes = [styles.input, className].filter(Boolean).join(" ");

  return (
    <input
      type={type}
      data-slot="input"
      className={classes}
      {...props}
    />
  );
}

export { Input };
