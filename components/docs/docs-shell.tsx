"use client";

import { useEffect, useState } from "react";
import { Maximize2, Minimize2, StretchHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RouteContent } from "@/components/route-content";

type LayoutMode = "normal" | "wide";

type DocsShellProps = {
  nav: React.ReactNode;
  content: React.ReactNode;
  aside: React.ReactNode;
};

function loadMode(): LayoutMode {
  try {
    const value = localStorage.getItem("docs-layout-mode");
    if (value === "wide" || value === "normal") return value;
  } catch {
    // ignore
  }
  return "normal";
}

function saveMode(mode: LayoutMode) {
  try {
    localStorage.setItem("docs-layout-mode", mode);
  } catch {
    // ignore
  }
}

export function DocsShell({ nav, content, aside }: DocsShellProps) {
  const [mode, setMode] = useState<LayoutMode>("normal");
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    setMode(loadMode());
  }, []);

  const setAndSave = (next: LayoutMode) => {
    setMode(next);
    saveMode(next);
  };

  const wrapperMax = focus ? "max-w-none" : mode === "wide" ? "max-w-[1680px]" : "max-w-[1480px]";
  const gridCols = focus
    ? "lg:grid-cols-1"
    : mode === "wide"
      ? "lg:grid-cols-[300px_minmax(0,1fr)_320px]"
      : "lg:grid-cols-[280px_minmax(0,1fr)_280px]";

  return (
    <main className={cn("mx-auto w-full px-4 py-8 md:py-12", wrapperMax)}>
      <div className={cn("grid gap-6", "md:grid-cols-[280px_minmax(0,1fr)]", gridCols)}>
        <div className={cn(focus ? "hidden" : "block")}>{nav}</div>

        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full bg-white/70"
              onClick={() => setAndSave(mode === "wide" ? "normal" : "wide")}
              aria-label={mode === "wide" ? "缩小布局" : "加宽布局"}
              title={mode === "wide" ? "缩小" : "加宽"}
            >
              <StretchHorizontal className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full bg-white/70"
              onClick={() => setFocus((v) => !v)}
              aria-label={focus ? "退出全屏" : "全屏阅读"}
              title={focus ? "退出全屏" : "全屏"}
            >
              {focus ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
          <RouteContent>{content}</RouteContent>
        </div>

        <div className={cn(focus ? "hidden" : "hidden lg:block")}>{aside}</div>
      </div>
    </main>
  );
}
