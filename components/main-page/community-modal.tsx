"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { animate } from "@motionone/dom";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type GroupCard = {
  id: number;
  name: string;
  desc: string;
  url: string;
  avatar: string;
  recommended?: boolean;
  fallbackMembers: string;
};

type GroupInfo = {
  id: number;
  member_count: number;
  name: string;
};

const GROUPS: GroupCard[] = [
  {
    id: 172701496,
    name: "幻灵的炼丹工坊一群",
    desc: "人多·首选",
    recommended: true,
    fallbackMembers: "~2000 成员",
    avatar: "https://p.qlogo.cn/gh/172701496/172701496/40",
    url: "https://qm.qq.com/cgi-bin/qm/qr?k=IZUTPdPpO2o-v4jt4i5LqUl5ZqXWLhpL&jump_from=webapi&authKey=EoTXKZUb7L6ooqWHEAV7qcGfFnczg1b7JuXlWVwYtXcX2cCJbTsqLCcJlkfD+xAW"
  },
  {
    id: 894118597,
    name: "幻灵的炼丹工坊二群",
    desc: "活跃讨论",
    fallbackMembers: "~1000 成员",
    avatar: "https://p.qlogo.cn/gh/894118597/894118597/40",
    url: "https://qm.qq.com/cgi-bin/qm/qr?k=Z93WMbn5a8v6MXDiBzcywyEFcIdhi_ls&jump_from=webapi&authKey=tCNl9eJLLVY2TNgf2KyT2cWylxNMAlWxScUHIVqc2bz0xbSf05ZMLR4ooq0yGcim"
  },
  {
    id: 1038540343,
    name: "幻灵的炼丹工坊三群",
    desc: "新群 · 欢迎加入",
    fallbackMembers: "成员增长中",
    avatar: "https://p.qlogo.cn/gh/1038540343/1038540343/40",
    url: "https://qm.qq.com/cgi-bin/qm/qr?k=lbGSH-YcsabtCsy7g7ckpvBlPaLLwKdi&jump_from=webapi&authKey=UzTwXtfSKvkiBavgYQgkJ8lrcbV3lK0evVuYZjtKYcBiHdnyo8Q1JBOC4pmE2y65"
  }
];

const MAX_MEMBER_LEVELS = [100, 300, 500, 1000, 2000, 3000];

function getMaxMembers(currentCount: number): number {
  for (const level of MAX_MEMBER_LEVELS) {
    if (currentCount <= level) return level;
  }
  return 3000;
}

function getProgressColor(progress: number): string {
  if (progress >= 90) return "bg-rose-500";
  if (progress >= 70) return "bg-amber-500";
  return "bg-emerald-500";
}

type CommunityModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function CommunityModal({ visible, onClose }: CommunityModalProps) {
  const [groupsData, setGroupsData] = useState<Map<number, GroupInfo>>(new Map());
  const [reduceMotion, setReduceMotion] = useState(false);
  const [mounted, setMounted] = useState(visible);
  const [opening, setOpening] = useState(false);
  const [closing, setClosing] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const overlayAnim = useRef<ReturnType<typeof animate> | null>(null);
  const panelAnim = useRef<ReturnType<typeof animate> | null>(null);
  const prevVisibleRef = useRef<boolean>(visible);

  useEffect(() => {
    const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mql) return;
    const apply = () => setReduceMotion(Boolean(mql.matches));
    apply();
    // Safari < 14
    // eslint-disable-next-line deprecation/deprecation
    if (typeof mql.addEventListener === "function") mql.addEventListener("change", apply);
    // eslint-disable-next-line deprecation/deprecation
    else mql.addListener(apply);
    return () => {
      // eslint-disable-next-line deprecation/deprecation
      if (typeof mql.removeEventListener === "function") mql.removeEventListener("change", apply);
      // eslint-disable-next-line deprecation/deprecation
      else mql.removeListener(apply);
    };
  }, []);

  useEffect(() => {
    const prev = prevVisibleRef.current;
    prevVisibleRef.current = visible;

    if (visible && !prev) {
      setMounted(true);
      setClosing(false);
      setOpening(!reduceMotion);
      return;
    }

    if (!visible && prev) {
      if (!mounted) return;
      if (reduceMotion) {
        setMounted(false);
        setOpening(false);
        setClosing(false);
        return;
      }
      setOpening(false);
      setClosing(true);
    }
  }, [visible, mounted, reduceMotion]);

  useLayoutEffect(() => {
    if (!mounted || !visible) return;
    if (reduceMotion) return;
    if (!opening) return;

    const overlayEl = overlayRef.current;
    const panelEl = panelRef.current;
    if (!overlayEl || !panelEl) return;

    overlayAnim.current?.cancel();
    panelAnim.current?.cancel();

    // Ensure initial state is applied before first paint to avoid flicker.
    overlayEl.style.opacity = "0";
    panelEl.style.opacity = "0";
    panelEl.style.transform = "translate3d(0, 14px, 0) scale(0.985)";

    overlayAnim.current = animate(overlayEl, { opacity: 1 }, { duration: 0.16, easing: "ease-out" });
    panelAnim.current = animate(
      panelEl,
      { opacity: 1, transform: "translate3d(0, 0px, 0) scale(1)" },
      { duration: 0.18, easing: [0.2, 0.8, 0.2, 1] }
    );

    Promise.allSettled([overlayAnim.current.finished, panelAnim.current.finished]).then(() => {
      setOpening(false);
    });
  }, [mounted, visible, reduceMotion, opening]);

  useLayoutEffect(() => {
    if (!mounted) return;
    if (visible) return;
    if (reduceMotion) return;
    if (!closing) return;

    const overlayEl = overlayRef.current;
    const panelEl = panelRef.current;
    if (!overlayEl || !panelEl) {
      setMounted(false);
      setClosing(false);
      return;
    }

    overlayAnim.current?.cancel();
    panelAnim.current?.cancel();

    overlayAnim.current = animate(overlayEl, { opacity: 0 }, { duration: 0.12, easing: "ease-in" });
    panelAnim.current = animate(
      panelEl,
      { opacity: 0, transform: "translate3d(0, 10px, 0) scale(0.99)" },
      { duration: 0.14, easing: "ease-in" }
    );

    Promise.allSettled([overlayAnim.current.finished, panelAnim.current.finished]).then(() => {
      setMounted(false);
      setClosing(false);
    });
  }, [mounted, visible, reduceMotion, closing]);

  useEffect(() => {
    if (!visible) return;

    let aborted = false;
    const t = window.setTimeout(
      () => {
        (async () => {
          try {
            const res = await fetch("https://syg.xdy.huanlin2026.me/api/groups", { cache: "no-store" });
            const json = (await res.json()) as any;
            const list = json?.data?.groups as GroupInfo[] | undefined;
            if (!Array.isArray(list) || aborted) return;

            const map = new Map<number, GroupInfo>();
            for (const item of list) {
              if (item?.id) map.set(item.id, item);
            }
            setGroupsData(map);
          } catch {
            // ignore
          }
        })();
      },
      reduceMotion ? 0 : 220
    );

    return () => {
      aborted = true;
      window.clearTimeout(t);
    };
  }, [visible, reduceMotion]);

  const computed = useMemo(() => {
    return GROUPS.map((group) => {
      const data = groupsData.get(group.id);
      const count = data?.member_count;
      const max = typeof count === "number" ? getMaxMembers(count) : null;
      const progress = typeof count === "number" && max ? Math.min((count / max) * 100, 100) : null;
      return {
        group,
        memberText: typeof count === "number" ? `${count} 成员` : group.fallbackMembers,
        maxText: max ? `/ ${max}` : "",
        progress,
        progressClass: progress == null ? "bg-muted" : getProgressColor(progress)
      };
    });
  }, [groupsData]);

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{ willChange: "opacity" }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-2xl transform-gpu"
        onClick={(e: MouseEvent) => e.stopPropagation()}
        style={{ willChange: "transform, opacity" }}
      >
        <Card className="overflow-hidden rounded-2xl border bg-white/95 shadow-2xl">
              <div className="relative border-b bg-gradient-to-r from-primary/10 via-white to-secondary/10 p-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-lg border bg-white/70 p-2 text-muted-foreground transition hover:text-foreground"
                  aria-label="关闭"
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  加入社区交流
                </p>
                <p className="mt-1 text-sm text-muted-foreground">与开发者和用户一起探讨 SVC Fusion</p>
              </div>

              <div className="p-6">
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                  <p className="text-sm font-semibold text-amber-900">💝 维护社区需要成本，欢迎赞助支持我们</p>
                </div>

                <div className="mt-5 grid gap-3">
                  {computed.map(({ group, memberText, maxText, progress, progressClass }) => (
                    <a
                      key={group.id}
                      href={group.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative rounded-2xl border bg-white p-4 transition hover:border-primary/40 hover:bg-primary/5"
                    >
                      {group.recommended ? (
                        <Badge className="absolute right-4 top-4 rounded-full bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10">
                          推荐
                        </Badge>
                      ) : null}

                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 overflow-hidden rounded-full border bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={group.avatar} alt="群头像" className="h-full w-full object-cover" loading="lazy" />
                          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-base font-semibold text-foreground">{group.name}</p>
                          <p className="mt-0.5 text-sm text-muted-foreground">{group.desc}</p>
                        </div>
                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground transition group-hover:bg-primary/15 group-hover:text-primary">
                          立即加入
                        </span>
                      </div>

                      <Separator className="my-4" />
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-700">
                          {memberText} <span className="text-xs font-medium text-muted-foreground">{maxText}</span>
                        </p>
                      </div>
                      {progress != null ? (
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                          <div className={`h-full ${progressClass}`} style={{ width: `${progress}%` }} />
                        </div>
                      ) : null}
                    </a>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
                  <p className="mb-2 text-sm font-semibold text-sky-900">Tips</p>
                  <div className="grid gap-2 text-sm text-sky-900/90">
                    <p>🔥 分享使用技巧和经验</p>
                    <p>❓ 获取技术支持和帮助</p>
                    <p>🚀 第一时间了解更新动态</p>
                  </div>
                </div>
              </div>
        </Card>
      </div>
    </div>
  );
}
