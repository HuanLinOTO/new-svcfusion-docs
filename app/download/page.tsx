"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Cloud, ExternalLink, ShieldAlert, Timer } from "lucide-react";

import { RouteContent } from "@/components/route-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DEFAULT_DOWNLOAD_LINK = "https://pan.quark.cn/s/f5476dfbde71";
const DEFAULT_VERSION = "Latest";

function decodeBase64(value: string | null) {
  if (!value) return "";
  try {
    const binary = atob(value);
    const percentEncoded = Array.from(binary)
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join("");
    return decodeURIComponent(percentEncoded);
  } catch {
    try {
      return atob(value);
    } catch {
      return "";
    }
  }
}

function DownloadContent() {
  const searchParams = useSearchParams();
  const [seconds, setSeconds] = useState(8);

  const link = useMemo(() => decodeBase64(searchParams.get("link")) || DEFAULT_DOWNLOAD_LINK, [searchParams]);
  const version = useMemo(() => decodeBase64(searchParams.get("version")) || DEFAULT_VERSION, [searchParams]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = link;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [link]);

  return (
    <RouteContent>
      <main className="container py-10 md:py-14">
        <div className="mx-auto max-w-3xl space-y-6">
          <Card className="relative overflow-hidden border-primary/30 bg-white/90 shadow-xl">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/20 blur-3xl" />
            <CardHeader className="relative">
              <Badge className="mb-2 w-fit rounded-full bg-primary/10 text-primary hover:bg-primary/10">下载中转</Badge>
              <CardTitle className="text-2xl" style={{ fontFamily: "var(--font-display)" }}>
                SVC Fusion {version}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-4">
            <p className="text-sm text-muted-foreground">你需要先看完注意事项，避免下载后启动失败或网络错误。</p>

            <div className="rounded-xl border border-amber-300/80 bg-amber-50 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                <ShieldAlert className="h-4 w-4" />
                启动器资源托管于 ModelScope，网络异常时请先排查运营商限制。
              </p>
            </div>

            <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-sky-900">
                <Cloud className="h-4 w-4" />
                云端算力入口
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  智算云扉: <a className="text-primary underline" href="https://studio.aigate.cc/images/1007735255911759872?channel=E4Z7B2W5C&coupon=AM8HLIZE2C">点击进入</a>
                </li>
                <li>
                  优云智算: <a className="text-primary underline" href="https://www.compshare.cn/images/compshareImage-1aly0zqh3gvc?referral_code=1ywd4VqDKknFWCEUZvOoWo&ytag=GPU_aiguoliuguo_SF">点击进入</a>
                </li>
                <li>
                  AutoDL: <a className="text-primary underline" href="https://www.codewithgpu.com/i/HuanLinOTO/SVCFusion/svc-fusion">点击进入</a>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild className="rounded-full">
                <a href={link}>
                  立即下载
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Timer className="h-4 w-4" />
                {seconds} 秒后自动跳转
              </p>
            </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </RouteContent>
  );
}

export default function DownloadPage() {
  return (
    <Suspense fallback={<main className="container py-16 text-center text-sm text-muted-foreground">加载下载信息中...</main>}>
      <DownloadContent />
    </Suspense>
  );
}
