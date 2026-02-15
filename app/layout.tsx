import type { Metadata } from "next";
import Link from "next/link";
import { Space_Grotesk, Noto_Sans_SC, IBM_Plex_Mono } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const sans = Noto_Sans_SC({ subsets: ["latin"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "SVC Fusion Docs",
  description: "AI singing voice conversion toolbox docs"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body
        className={cn(
          display.variable,
          sans.variable,
          mono.variable,
          "min-h-screen font-[family-name:var(--font-sans)]"
        )}
      >
        <header className="sticky top-0 z-30 border-b border-border/80 bg-background/80 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold">
              <img src="/favicon.ico" alt="" aria-hidden="true" className="h-6 w-6 object-contain" />
              SVC Fusion
            </Link>
            <nav className="flex items-center gap-5 text-sm font-medium">
              <Link className="transition-colors hover:text-primary" href="/">
                Home
              </Link>
              <Link className="transition-colors hover:text-primary" href="/docs/start">
                全流程教程
              </Link>
              <Link className="transition-colors hover:text-primary" href="/docs/faq">
                常见问题
              </Link>
              <Link className="transition-colors hover:text-primary" href="/docs/daomai">
                二次贩卖授权
              </Link>
              <a
                className="transition-colors hover:text-primary"
                href="https://r1kc63iz15l.feishu.cn/wiki/JSp3wk7zuinvIXkIqSUcCXY1nKc"
                target="_blank"
                rel="noreferrer noopener"
              >
                MSST WebUI
              </a>
              <a
                className="transition-colors hover:text-primary"
                href="https://perf.svcfusion.com/?from=sf-docs"
                target="_blank"
                rel="noreferrer noopener"
              >
                性能数据统计平台
              </a>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
