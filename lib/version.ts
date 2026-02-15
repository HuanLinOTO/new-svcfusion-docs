import fs from "node:fs";
import path from "node:path";

export type VersionEntry = {
  link: string;
  date: string;
  version: string;
  changes?: string[];
  env?: string | null;
  linux?: string;
};

export type LatestVersionInfo = {
  version: string;
  link: string;
  date: string;
  isNewWithin3Days: boolean;
};

const FALLBACK_LATEST: LatestVersionInfo = {
  version: "Latest",
  link: "https://pan.quark.cn/s/f5476dfbde71",
  date: "1970/1/1",
  isNewWithin3Days: false
};

function isNewWithin3Days(dateString: string, nowMs: number) {
  const ms = new Date(dateString).getTime();
  if (!Number.isFinite(ms)) return false;
  return ms > nowMs - 3 * 24 * 60 * 60 * 1000;
}

export function getLatestVersionInfo(): LatestVersionInfo {
  try {
    const filePath = path.join(process.cwd(), "public", "version.json");
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed) || parsed.length === 0) return FALLBACK_LATEST;
    const first = parsed[0] as Partial<VersionEntry>;
    if (!first?.link || !first?.version || !first?.date) return FALLBACK_LATEST;

    const nowMs = Date.now();
    return {
      link: String(first.link),
      version: String(first.version),
      date: String(first.date),
      isNewWithin3Days: isNewWithin3Days(String(first.date), nowMs)
    };
  } catch {
    return FALLBACK_LATEST;
  }
}
