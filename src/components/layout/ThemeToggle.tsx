"use client";

import { useEffect, useState } from "react";

type Mode = "system" | "light" | "dark";

const LABEL: Record<Mode, string> = { system: "ตามระบบ", light: "สว่าง", dark: "มืด" };
const NEXT: Record<Mode, Mode> = { system: "light", light: "dark", dark: "system" };

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("delta-theme");
    setMode(saved === "light" || saved === "dark" ? saved : "system");
    setReady(true);
  }, []);

  function apply(next: Mode) {
    setMode(next);
    if (next === "system") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("delta-theme");
    } else {
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("delta-theme", next);
    }
    // แจ้ง canvas ให้อ่านสีธีมใหม่
    window.dispatchEvent(new CustomEvent("delta:themechange"));
  }

  return (
    <button
      type="button"
      onClick={() => apply(NEXT[mode])}
      className="shrink-0 rounded-lg border border-line bg-surface px-2.5 py-1.5 font-mono text-[11px] whitespace-nowrap tracking-wide text-ink-2 hover:border-line-strong hover:text-ink sm:px-3"
      aria-label={`ธีม: ${LABEL[mode]} — กดเพื่อเปลี่ยนเป็น ${LABEL[NEXT[mode]]}`}
    >
      {ready ? LABEL[mode] : "ธีม"}
    </button>
  );
}
