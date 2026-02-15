"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { ActionButtons } from "@/components/main-page/action-buttons";
import { Banner } from "@/components/main-page/banner";
import { CommunityModal } from "@/components/main-page/community-modal";
import { HeroVisual } from "@/components/main-page/hero-visual";
import { NewYearEffects } from "@/components/main-page/new-year-effects";
import type { LatestVersionInfo } from "@/lib/version";

const bannerItems = [
  "启动器自动更新上线，支持断点续传",
  "FAQ 文档持续更新，常见报错一站解决",
  "DLC 模型仓库新增 DDSP 6.3 全套底模"
];

const featureItems = ["易于使用", "可用 CPU 训练", "面向小白", "预处理/训练/推理闭环"];

const comparisonRows: Array<{ name: string; feather: boolean; fusion: boolean; link?: string }> = [
  { name: "50系N卡支持", feather: false, fusion: true },
  { name: "自定义底模", feather: false, fusion: true },
  { name: "自定义声码器", feather: false, fusion: true },
  { name: "音区偏移", feather: false, fusion: true },
  { name: "内置离线分离", feather: false, fusion: true },
  { name: "自动混音", feather: false, fusion: true },
  { name: "实时（变声器）", feather: false, fusion: true },
  { name: "声码器变调", feather: false, fusion: true },
  { name: "完整的模型管理系统", feather: false, fusion: true },
  { name: "AMD 显卡支持", feather: false, fusion: true, link: "https://www.bilibili.com/video/BV1NdewzpE5K/" }
];

const models = [
  { name: "DDSP-SVC", versions: "6.3 / 6.1 / 6.0", wip: false },
  { name: "So-VITS-SVC", versions: "4.1", wip: false },
  { name: "Reflow-VAE-SVC", versions: "Latest", wip: false },
  { name: "RVC", versions: "", wip: true },
  { name: "RIFT-SVC", versions: "", wip: true }
] as const;

const tools = [
  { name: "CUDA 性能基准测试", description: "测试你的显卡性能，优化推理配置", accent: "primary" },
  { name: "音频切割", description: "精确切割音频文件，支持多种格式", accent: "secondary" },
  { name: "重采样", description: "改变音频采样率，匹配模型要求", accent: "primary" },
  { name: "批量转 WAV", description: "批量转换音频格式为 WAV", accent: "secondary" },
  { name: "人声分离", description: "智能分离人声和伴奏", accent: "primary" },
  { name: "声码器变调", description: "使用声码器进行音调变换", accent: "secondary" },
  { name: "实时变声器", description: "实时语音转换，即时体验", accent: "primary" }
] as const;

type LandingPageProps = {
  latest: LatestVersionInfo;
};

function useOneShotInView() {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -80px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

export function LandingPage({ latest }: LandingPageProps) {
  const [activeBanner, setActiveBanner] = useState(0);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const modelsInView = useOneShotInView();
  const toolsInView = useOneShotInView();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % bannerItems.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main>
      <NewYearEffects />
      <Banner />

      <section className="container py-10 md:py-14">
        <div className="hero-grid-pattern relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/85 p-7 shadow-2xl md:p-10">
          <div className="pulse-orb absolute -left-12 -top-16 h-60 w-60 rounded-full bg-secondary/40 blur-3xl" />
          <div className="pulse-orb delay-1 absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />

          <div className="relative grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <Badge className="mb-4 rounded-full bg-primary/10 text-primary hover:bg-primary/10">开箱即用的 AI 翻唱音频工具箱</Badge>
              <h1
                className="text-4xl font-semibold leading-tight md:text-6xl"
                style={{ fontFamily: "var(--font-display)", wordSpacing: "0.08em" }}
              >
                <span className="whitespace-nowrap text-slate-900">SVC</span>{" "}
                <span className="whitespace-nowrap bg-gradient-to-r from-cyan-700 via-sky-500 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_10px_24px_rgba(14,165,233,.26)]">
                  Fusion
                </span>
                <span className="mt-3 block text-sm font-semibold tracking-[0.26em] text-slate-500 md:text-base">
                  AUDIO WORKFLOW ENGINE
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-600">从数据集到训练、从推理到导出，整条链路做成可视化交互界面，真的顺手。</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {featureItems.map((item) => (
                  <Badge key={item} variant="secondary" className="rounded-full bg-secondary/30 text-foreground">
                    <Sparkles className="mr-1 h-3.5 w-3.5" />
                    {item}
                  </Badge>
                ))}
              </div>

              <ActionButtons latest={latest} onShowCommunity={() => setShowGroupModal(true)} />

              <p className="mt-4 text-sm text-muted-foreground">动态公告: {bannerItems[activeBanner]}</p>
            </div>

            <div className="grid justify-items-center gap-5">
              <HeroVisual />
              <Card className="relative w-full overflow-hidden border-white/70 bg-white/90 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">SVC Fusion 核心流程</CardTitle>
                  <CardDescription>从下载启动到训练推理，按阶段清晰拆分。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    ["01", "下载与部署", "启动器更新本体，快速进入工作目录"],
                    ["02", "数据预处理", "自动切片、特征提取，减少手工操作"],
                    ["03", "模型训练", "参数可视化配置，日志实时跟踪"],
                    ["04", "推理导出", "试听与参数微调后导出成品音频"]
                  ].map((item) => (
                    <div key={item[0]} className="rounded-xl border bg-white p-3">
                      <p className="text-xs font-semibold tracking-wide text-primary">STEP {item[0]}</p>
                      <p className="mt-1 font-semibold text-foreground">{item[1]}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item[2]}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-10">
        <Card className="bg-white/92">
          <CardHeader>
            <CardTitle>为什么推荐迁移</CardTitle>
            <CardDescription>相比羽毛 So-VITS-SVC 整合包，我们提供更多功能和更好的用户体验。</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left">功能特性</th>
                    <th className="px-4 py-3 text-left">旧整合包</th>
                    <th className="px-4 py-3 text-left">SVC Fusion</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.name} className="border-t">
                      <td className="px-4 py-3 font-medium">
                        {row.link ? (
                          <a
                            href={row.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary underline underline-offset-4"
                          >
                            {row.name}
                          </a>
                        ) : (
                          row.name
                        )}
                      </td>
                      <td className="px-4 py-3">{row.feather ? "✓" : "✗"}</td>
                      <td className="px-4 py-3 font-medium text-primary">{row.fusion ? "✓" : "✗"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">没有任何贬低羽毛的意思，但是羽毛确实很久没更新了（）</p>
          </CardContent>
        </Card>
      </section>

      <section className="container pb-10">
        <div ref={modelsInView.ref as any} className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-lg">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              支持的模型
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">SVC Fusion 支持多种主流 SVC 模型，满足不同用户的需求</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {models.map((item, idx) => (
              <Card
                key={item.name}
                className={`group relative bg-white/92 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  modelsInView.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${idx * 80}ms` }}
              >
                {item.wip ? (
                  <div className="pointer-events-none absolute -right-8 top-4 rotate-45 bg-amber-500/90 px-10 py-1 text-xs font-semibold text-white shadow">
                    WIP
                  </div>
                ) : null}
                <CardHeader>
                  <CardTitle className="text-base">{item.name}</CardTitle>
                  {item.versions ? <CardDescription>{item.versions}</CardDescription> : null}
                </CardHeader>
                <CardContent>
                  <Badge variant={item.wip ? "outline" : "default"}>{item.wip ? "开发中" : "已支持"}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">更多模型支持正在开发中，敬请期待！</p>
        </div>
      </section>

      <section className="container pb-20">
        <Card ref={toolsInView.ref as any} className="bg-white/92">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">丰富的小工具</CardTitle>
            <CardDescription>一站式音频处理工具集，让你的工作流程更加高效</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {tools.map((item, idx) => (
              <div
                key={item.name}
                className={`shine-mask rounded-2xl border bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                  toolsInView.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${idx * 70}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-foreground">{item.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Badge
                    className={
                      item.accent === "primary"
                        ? "rounded-full bg-primary/10 text-primary hover:bg-primary/10"
                        : "rounded-full bg-secondary/30 text-foreground hover:bg-secondary/30"
                    }
                  >
                    工具
                  </Badge>
                </div>
                <Separator className="my-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Workflow Friendly</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <CommunityModal visible={showGroupModal} onClose={() => setShowGroupModal(false)} />
    </main>
  );
}
