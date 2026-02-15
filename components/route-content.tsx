"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type RouteContentProps = {
  children: React.ReactNode;
};

export function RouteContent({ children }: RouteContentProps) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement | null>(null);
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const el = ref.current;
    if (!el) return;

    el.classList.remove("content-transition");
    // Force reflow to restart keyframes.
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    el.offsetWidth;
    el.classList.add("content-transition");

    const t = window.setTimeout(() => {
      el.classList.remove("content-transition");
    }, 260);

    return () => window.clearTimeout(t);
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
