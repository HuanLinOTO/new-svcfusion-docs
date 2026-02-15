import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const RAW_ROOT = path.join(process.cwd(), "raw");
const HIDDEN_NAV_DOCS = new Set(["download", "start/old_launch"]);

type RawDoc = {
  absolutePath: string;
  relativePath: string;
  slug: string[];
};

type DlcSection = {
  id: string;
  title: string;
  note?: string;
  items: Array<{
    title: string;
    description?: string;
    netdiskLink?: string;
    primaryLink?: string;
    mirrorLink?: string;
  }>;
};

export type DocMeta = {
  slug: string[];
  title: string;
  section: string;
};

export type DocData = {
  title: string;
  content: string;
};

function walkMarkdownFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".md")) files.push(fullPath);
  }

  return files;
}

function rawDocs(): RawDoc[] {
  return walkMarkdownFiles(RAW_ROOT)
    .filter((file) => !(path.basename(file) === "index.md" && path.dirname(file) === RAW_ROOT))
    .map((absolutePath) => {
      const relativePath = path.relative(RAW_ROOT, absolutePath).replace(/\\/g, "/");
      const withoutExt = relativePath.replace(/\.md$/, "");
      const slug = withoutExt.endsWith("/index") ? withoutExt.replace(/\/index$/, "").split("/") : withoutExt.split("/");

      return { absolutePath, relativePath, slug: slug.filter(Boolean) };
    })
    .filter((entry) => entry.slug.length > 0);
}

function extractTitle(markdown: string, fallback: string): string {
  const line = markdown
    .split("\n")
    .find((entry) => entry.trim().startsWith("# "))
    ?.replace(/^#\s+/, "")
    .trim();

  return line || fallback;
}

function mapInternalLink(link: string): string {
  if (/^https?:\/\//.test(link) || link.startsWith("#")) return link;
  if (link.startsWith("/imgs/")) return link;
  if (link.startsWith("/download")) return "/download";
  if (link.startsWith("/docs")) return link;
  if (link.startsWith("/")) return `/docs${link.replace(/\/$/, "")}`;
  return link;
}

function extractFilenameFromPath(src: string): string {
  // Handle both Windows (\) and Unix (/) paths
  const normalized = src.replace(/\\/g, "/");
  const parts = normalized.split("/");
  return parts[parts.length - 1] || src;
}

function normalizeAssetReferences(input: string): string {
  let output = input;

  // Handle markdown image syntax: ![alt](path)
  output = output.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt: string, src: string) => {
    const filename = extractFilenameFromPath(src);
    return `![${alt}](/imgs/${filename})`;
  });

  // Handle HTML img tags
  output = output.replace(/<img([^>]*?)src=["']([^"']+)["']([^>]*)>/g, (match, before: string, src: string, after: string) => {
    const filename = extractFilenameFromPath(src);
    return `<img${before}src="/imgs/${filename}"${after}>`;
  });

  return output;
}

function convertAdmonitions(input: string): string {
  // Convert VitePress-style admonitions to blockquotes so nested Markdown still parses.
  // :::tip Title
  // markdown body
  // :::
  return input.replace(/:::(tip|warning|danger)(?:\s+([^\n]*))?\n([\s\S]*?)\n:::/g, (_match, type: string, title: string, body: string) => {
    const upper = String(type).toUpperCase();
    const trimmedTitle = title?.trim();
    const header = `> [!${upper}]${trimmedTitle ? ` ${trimmedTitle}` : ""}`;

    const lines = String(body ?? "")
      .trim()
      .split("\n")
      .map((line) => (line.trim().length ? `> ${line}` : ">"))
      .join("\n");

    // Keep an empty quoted line so Markdown treats header as its own paragraph.
    return `${header}\n>\n${lines}`;
  });
}

function removeVueScriptBlocks(input: string): string {
  // Remove Vue script blocks entirely
  let output = input.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  // Remove Vue style blocks
  output = output.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  // Remove Vue component tags
  output = output.replace(/<comp\b[^>]*><\/comp>/gi, "");
  return output;
}

function parseDlcSections(source: string): DlcSection[] {
  const match = source.match(/const\s+dlcSections\s*=\s*(\[[\s\S]*?\])\s*<\/script>/);
  if (!match) return [];

  try {
    const parsed = Function(`"use strict"; return (${match[1]});`)() as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as DlcSection[];
  } catch {
    return [];
  }
}

function buildDlcMarkdown(source: string): string {
  const sections = parseDlcSections(source);
  if (!sections.length) return "# DLC\n\n当前版本未解析出 DLC 内容。";

  const lines: string[] = ["# DLC", "", "## 索引", ""];
  for (const section of sections) {
    lines.push(`- [${section.title}](#${section.id})`);
  }

  lines.push("", "## 安装说明", "", "1. 下载对应 DLC 文件", "2. 在 SVC Fusion 的小工具 - DLC 页面上传", "3. 点击安装", "4. 安装后建议刷新页面", "");

  for (const section of sections) {
    lines.push(`## ${section.title}`, "");
    if (section.note) lines.push(`> ${section.note}`, "");

    for (const item of section.items ?? []) {
      lines.push(`### ${item.title}`);
      if (item.description) lines.push(item.description);
      const links: string[] = [];
      if (item.netdiskLink) links.push(`[网盘](${item.netdiskLink})`);
      if (item.primaryLink) links.push(`[HuggingFace](${item.primaryLink})`);
      if (item.mirrorLink) links.push(`[镜像](${item.mirrorLink})`);
      if (links.length) lines.push(`- ${links.join(" | ")}`);
      lines.push("");
    }
  }

  return lines.join("\n");
}

function preprocessMarkdown(content: string, relativePath: string): string {
  if (relativePath === "dlc.md") return buildDlcMarkdown(content);

  let output = content;

  // Remove Vue-specific blocks first
  output = removeVueScriptBlocks(output);

  // Convert admonitions before normalizing assets
  output = convertAdmonitions(output);

  // Normalize asset paths
  output = normalizeAssetReferences(output);

  // Fix internal links
  output = output.replace(/\]\((\/[^)]+)\)/g, (_m, link: string) => `](${mapInternalLink(link)})`);

  // Clean up empty headings
  output = output.replace(/^#{1,6}\s*$/gm, "");

  // Clean up excessive blank lines
  output = output.replace(/\n{3,}/g, "\n\n");

  return output.trim();
}

export function getDocsMeta(): DocMeta[] {
  return rawDocs()
    .filter((doc) => !HIDDEN_NAV_DOCS.has(doc.slug.join("/")))
    .map((doc) => {
      const source = fs.readFileSync(doc.absolutePath, "utf8");
      const parsed = matter(source);
      const content = preprocessMarkdown(parsed.content, doc.relativePath);
      const fallback = doc.slug[doc.slug.length - 1].replace(/[-_]/g, " ");

      return {
        slug: doc.slug,
        title: extractTitle(content, fallback),
        section: doc.slug[0]
      };
    })
    .sort((a, b) => a.slug.join("/").localeCompare(b.slug.join("/"), "zh-CN"));
}

export function getDocBySlug(slug: string[]): DocData | null {
  if (HIDDEN_NAV_DOCS.has(slug.join("/"))) return null;

  const found = rawDocs().find((entry) => entry.slug.join("/") === slug.join("/"));
  if (!found) return null;

  const source = fs.readFileSync(found.absolutePath, "utf8");
  const parsed = matter(source);
  const content = preprocessMarkdown(parsed.content, found.relativePath);

  return {
    title: extractTitle(content, slug[slug.length - 1]),
    content
  };
}
