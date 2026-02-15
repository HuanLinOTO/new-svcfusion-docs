"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
  external?: boolean;
};

type MobileNavDropdownProps = {
  items: NavItem[];
  label?: string;
};

const itemClass =
  "block w-full rounded-md px-3 py-2 text-left text-sm whitespace-nowrap transition-colors hover:bg-muted hover:text-primary";

export function MobileNavDropdown({ items, label = "菜单" }: MobileNavDropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const closeOnOutside = (event: MouseEvent) => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const target = event.target;
      if (target instanceof Node && !wrapper.contains(target)) {
        setOpen(false);
      }
    };

    const closeOnEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEsc);

    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEsc);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="mobile-nav-wrap relative ml-auto w-auto sm:hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex w-auto cursor-pointer items-center justify-center rounded-full border border-border/70 bg-background px-3 py-1.5 text-sm font-medium text-foreground/90 shadow-sm"
      >
        {label}
        <span
          className={`ml-2 inline-block transform transition-transform duration-200 ease-out ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          ▾
        </span>
      </button>

      <div
        className={`absolute right-0 top-full mt-2 min-w-48 rounded-xl border bg-background/95 p-1 shadow-lg transition-[max-height,opacity,transform] duration-200 ease-out origin-top overflow-hidden ${
          open
            ? "max-h-80 opacity-100 translate-y-0 pointer-events-auto"
            : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {items.map((item) =>
          item.external ? (
            <a key={item.href} className={itemClass} href={item.href} target="_blank" rel="noreferrer noopener">
              {item.label}
            </a>
          ) : (
            <Link key={item.href} className={itemClass} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          )
        )}
      </div>
    </div>
  );
}
