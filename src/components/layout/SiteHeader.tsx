import Link from "next/link";
import { NAV, SITE } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:gap-6 sm:px-5">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span
            aria-hidden
            className="grid h-7 w-7 place-items-center rounded-md bg-accent font-display text-[15px] font-bold text-white"
          >
            {SITE.symbol}
          </span>
          <span className="font-display text-[17px] font-semibold tracking-tight text-ink">
            {SITE.name}
          </span>
        </Link>

        <nav className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto sm:gap-1" aria-label="เมนูหลัก">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-lg px-2 py-1.5 text-[14px] whitespace-nowrap text-ink-2 no-underline hover:bg-surface-2 hover:text-ink sm:px-3 sm:text-[14.5px] ${
                item.href === "/about" ? "hidden sm:block" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            href="/courses"
            className="hidden rounded-lg bg-accent px-3.5 py-1.5 text-[14px] font-medium text-white no-underline hover:opacity-90 sm:inline-block"
          >
            เริ่มเรียน
          </Link>
        </div>
      </div>
    </header>
  );
}
