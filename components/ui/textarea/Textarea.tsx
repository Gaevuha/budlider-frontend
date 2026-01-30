import * as React from "react";
import styles from "./Textarea.module.css";

function Textarea({ className = "", ...props }: React.ComponentProps<"textarea">) {
  const classes = [styles.textarea, className].filter(Boolean).join(" ");

  return (
    <textarea
      data-slot="textarea"
      className={classes}
      {...props}
    />
  );
}

export { Textarea };
