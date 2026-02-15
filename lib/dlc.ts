import fs from "node:fs";
import path from "node:path";

export type DlcItem = {
  icon?: string;
  title: string;
  description?: string;
  netdiskLink?: string;
  primaryLink?: string;
  mirrorLink?: string;
};

export type DlcSection = {
  id: string;
  title: string;
  note?: string;
  items: DlcItem[];
};

function parseDlcSectionsFromSource(source: string): DlcSection[] {
  const match = source.match(/const\s+dlcSections\s*=\s*(\[[\s\S]*?\])\s*\n\s*<\/script>/);
  if (!match) return [];

  try {
    const parsed = Function(`"use strict"; return (${match[1]});`)() as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as DlcSection[];
  } catch {
    return [];
  }
}

export function getDlcSections(): DlcSection[] {
  try {
    const filePath = path.join(process.cwd(), "raw", "dlc.md");
    const source = fs.readFileSync(filePath, "utf8");
    return parseDlcSectionsFromSource(source);
  } catch {
    return [];
  }
}
