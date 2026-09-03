"use client";

import { useEffect } from "react";

/**
 * Wires the copy controls the server printed into each code block. Doing it
 * once from the top beats shipping a component per block.
 */
export default function CodeCopy() {
  useEffect(() => {
    const buttons = Array.from(
      document.querySelectorAll<HTMLButtonElement>("[data-copy]"),
    );

    const offs = buttons.map((button) => {
      const onClick = async () => {
        const code = button.closest("figure")?.querySelector("pre")?.innerText;
        if (!code) return;
        try {
          await navigator.clipboard.writeText(code);
          button.dataset.state = "copied";
          window.setTimeout(() => delete button.dataset.state, 1800);
        } catch {
          /* nothing useful to say if the clipboard is refused */
        }
      };
      button.addEventListener("click", onClick);
      return () => button.removeEventListener("click", onClick);
    });

    return () => offs.forEach((off) => off());
  }, []);

  return null;
}
