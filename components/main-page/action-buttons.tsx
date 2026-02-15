"use client";

import Link from "next/link";
import { CloudDownload, MessageCircle, Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { LatestVersionInfo } from "@/lib/version";

type ActionButtonsProps = {
  latest: LatestVersionInfo;
  onShowCommunity: () => void;
};

function encodeBase64Utf8(input: string) {
  try {
    return btoa(unescape(encodeURIComponent(input)));
  } catch {
    try {
      return btoa(input);
    } catch {
      return "";
    }
  }
}

export function ActionButtons({ latest, onShowCommunity }: ActionButtonsProps) {
  const link = encodeBase64Utf8(latest.link);
  const version = encodeBase64Utf8(latest.version);
  const href = `/download?link=${encodeURIComponent(link)}&version=${encodeURIComponent(version)}`;

  return (
    <div className="mt-7 flex flex-wrap gap-3">
      <Button asChild size="lg" className="rounded-full">
        <Link href="/docs/start/download">
          马上开始
          <Rocket className="h-4 w-4" />
        </Link>
      </Button>

      <div className="relative">
        {latest.isNewWithin3Days ? (
          <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
            新
          </span>
        ) : null}
        <Button asChild variant="outline" size="lg" className="rounded-full bg-white/70">
          <Link href={href}>
            下载最新版本 {latest.version}
            <CloudDownload className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Button
        type="button"
        onClick={onShowCommunity}
        variant="secondary"
        size="lg"
        className="rounded-full"
      >
        立即加群
        <MessageCircle className="h-4 w-4" />
      </Button>
    </div>
  );
}
