"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";

type SponsorKey = "aigate" | "ucloud";

type Sponsor = {
  key: SponsorKey;
  iconSrc: string;
  alt: string;
  text: string;
  href: string;
  gtagEvent?: string;
};

const SPONSORS: Sponsor[] = [
  {
    key: "aigate",
    iconSrc: "/imgs/AIGate-Logo.png",
    alt: "智算云扉",
    text: "点击注册智算云扉，实名送 20 算力和 8 小时 4090D 算力券，公众号回复再得 8 小时券，充值额外 8% 优惠",
    href: "https://studio.aigate.cc/images/1007735255911759872?channel=E4Z7B2W5C&coupon=AM8HLIZE2C",
    gtagEvent: "click_aigate_ad"
  },
  {
    key: "ucloud",
    iconSrc: "/imgs/UCloud-AD.png",
    alt: "优云智算",
    text: "点击注册优云智算领 10 元算力金 GPU 免费用，高校/企业认证再得 10 元，算力购买 95 折",
    href: "https://www.compshare.cn/images/compshareImage-1aly0zqh3gvc?referral_code=1ywd4VqDKknFWCEUZvOoWo&ytag=GPU_aiguoliuguo_SF",
    gtagEvent: "click_ucloud_ad"
  }
];

function tryGtag(event: string) {
  const g = (globalThis as unknown as { gtag?: (...args: any[]) => void }).gtag;
  if (typeof g !== "function") return;
  try {
    g("event", event, { event_category: "ad" });
  } catch {
    // ignore
  }
}

export function Banner() {
  const [index, setIndex] = useState(0);

  const current = useMemo(() => SPONSORS[index % SPONSORS.length], [index]);

  useEffect(() => {
    let timer: number | null = null;

    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };

    const start = () => {
      if (timer) return;
      timer = window.setInterval(() => {
        setIndex((prev) => (prev + 1) % SPONSORS.length);
      }, 5000);
    };

    const onVis = () => {
      if (document.hidden) stop();
      else start();
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const bgClass =
    current.key === "aigate"
      ? "from-cyan-600/15 via-sky-500/10 to-orange-500/10"
      : "from-indigo-600/12 via-sky-500/10 to-amber-500/10";

  return (
    <div className="container pt-8">
      <button
        type="button"
        onClick={() => {
          if (current.gtagEvent) tryGtag(current.gtagEvent);
          window.open(current.href, "_blank", "noopener,noreferrer");
        }}
        className="group relative w-full overflow-hidden rounded-2xl border border-primary/20 bg-white/80 px-4 py-3 text-left shadow-sm transition hover:border-primary/30 hover:bg-white/90"
        aria-label={`Sponsor: ${current.alt}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${bgClass}`} aria-hidden="true" />
        <div className="absolute inset-0 hero-grid-pattern opacity-40" aria-hidden="true" />

        <div key={current.key} className="relative flex items-center gap-3 animate-in fade-in-0 duration-300">
          <div className="grid h-10 w-16 place-items-center overflow-hidden rounded-xl border border-white/60 bg-white/85 px-2 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.iconSrc} alt={current.alt} className="h-7 w-auto max-w-full object-contain" />
          </div>
          <p className="flex-1 text-sm font-semibold text-slate-800">
            <span className="mr-2 rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
              赞助
            </span>
            {current.text}
          </p>
          <ChevronRight className="h-5 w-5 text-slate-700 opacity-70 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
        </div>
      </button>
    </div>
  );
}
