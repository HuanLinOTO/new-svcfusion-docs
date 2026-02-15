import type { Metadata } from "next";
import Link from "next/link";
import { Space_Grotesk, Noto_Sans_SC, IBM_Plex_Mono } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import { MobileNavDropdown } from "@/components/mobile-nav-dropdown";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const sans = Noto_Sans_SC({ subsets: ["latin"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

const navItems = [
  { href: "/", label: "Home" },
  { href: "/docs/start", label: "全流程教程" },
  { href: "/docs/faq", label: "常见问题" },
  { href: "/docs/daomai", label: "二次贩卖授权" },
  {
    href: "https://r1kc63iz15l.feishu.cn/wiki/JSp3wk7zuinvIXkIqSUcCXY1nKc",
    label: "MSST WebUI",
    external: true
  },
  {
    href: "https://perf.svcfusion.com/?from=sf-docs",
    label: "性能数据统计平台",
    external: true
  }
];

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
          <div className="container flex min-h-16 items-center justify-between gap-3 py-2 sm:h-16">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 whitespace-nowrap font-[family-name:var(--font-display)] text-lg font-semibold"
            >
              <img src="/favicon.ico" alt="" aria-hidden="true" className="h-6 w-6 object-contain" />
              SVC Fusion
            </Link>
            <nav className="hidden items-center gap-3 text-sm font-medium sm:flex">
              {navItems.map((item) =>
                item.external ? (
                  <a key={item.href} className="whitespace-nowrap transition-colors hover:text-primary" href={item.href} target="_blank" rel="noreferrer noopener">
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.href} className="whitespace-nowrap transition-colors hover:text-primary" href={item.href}>
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            <MobileNavDropdown items={navItems} />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
