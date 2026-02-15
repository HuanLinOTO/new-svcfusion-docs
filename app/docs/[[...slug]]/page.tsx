import Link from "next/link";
import { notFound } from "next/navigation";
import { Children, isValidElement } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { Separator } from "@/components/ui/separator";
import { getDocBySlug, getDocsMeta } from "@/lib/docs";
import { getDlcSections } from "@/lib/dlc";
import { DlcView } from "@/components/docs/dlc-view";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export function generateStaticParams() {
  return getDocsMeta().map((doc) => ({ slug: doc.slug }));
}

export default async function DocsPage({ params }: PageProps) {
  const allDocs = getDocsMeta();
  const resolved = await params;
  const slug = resolved.slug ?? ["start"];
  const doc = getDocBySlug(slug);

  if (!doc) notFound();

  const slugKey = slug.join("/");

  return (
    <article className="rounded-2xl border border-border/80 bg-white/95 p-6 shadow-lg md:p-8">
      <h1 className="text-3xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
        {doc.title}
      </h1>
      <Separator className="my-6" />
      {slugKey === "dlc" ? (
        <DlcView sections={getDlcSections()} />
      ) : (
        <div className="prose-docs">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              iframe: (rawProps: any) => {
                const allow = rawProps?.allowFullScreen;
                const normalized = allow === true || allow === "true" || allow === "" || allow === "allowfullscreen";
                const { allowFullScreen: _ignored, ...props } = rawProps ?? {};

                return (
                  <div data-md-block="1" className="my-6 overflow-hidden rounded-xl border bg-black/5">
                    <iframe className="aspect-video w-full" {...props} allowFullScreen={normalized} />
                  </div>
                );
              },
              img: (props) => (
                <span data-md-block="1" className="my-6 block overflow-hidden rounded-xl border bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt={props.alt || ""} src={props.src || ""} className="block h-auto w-full" loading="lazy" />
                </span>
              ),
              div: ({ className, children, ...props }) => {
                return <div className={className}>{children}</div>;
              },
              blockquote: ({ children }) => {
                const nodes = Children.toArray(children);
                const first = nodes[0];

                const getText = (node: any): string => {
                  if (typeof node === "string") return node;
                  if (Array.isArray(node)) return node.map(getText).join("");
                  if (isValidElement(node)) return getText((node.props as any)?.children);
                  return "";
                };

                const stripEmptyParagraphs = (list: any[]) => {
                  let start = 0;
                  while (start < list.length) {
                    const el = list[start];
                    if (!isValidElement(el) || el.type !== "p") break;
                    const txt = getText(el).trim();
                    if (txt.length) break;
                    start++;
                  }
                  return list.slice(start);
                };

                if (isValidElement(first) && first.type === "p") {
                  const line = getText(first).trim();
                  const m = line.match(/^\[!\s*(TIP|WARNING|DANGER)\]\s*(.*)$/i);
                  if (m) {
                    const kind = m[1].toLowerCase();
                    const title = m[2].trim() || (kind === "tip" ? "提示" : kind === "warning" ? "警告" : "危险");
                    const rest = stripEmptyParagraphs(nodes.slice(1));

                    const colors = {
                      tip: "border-emerald-300 bg-emerald-50/80",
                      warning: "border-amber-300 bg-amber-50/80",
                      danger: "border-rose-300 bg-rose-50/80"
                    };

                    return (
                      <div className={`my-6 rounded-xl border-l-4 ${colors[kind as keyof typeof colors]} p-4`}>
                        <p className="mb-2 font-semibold text-foreground">{title}</p>
                        {rest}
                      </div>
                    );
                  }
                }

                return (
                  <blockquote className="my-6 border-l-4 border-border/70 bg-muted/30 px-4 py-3 text-sm text-foreground">
                    {children}
                  </blockquote>
                );
              },
              p: ({ className, children, ...props }) => {
                const nodes = Array.isArray(children) ? children : [children];
                const hasBlockChild = nodes.some(
                  (child) => {
                    if (!isValidElement(child)) return false;
                    const propsAny = child.props as any;
                    return propsAny?.["data-md-block"] === "1" || propsAny?.["data-md-block"] === 1;
                  }
                );
                if (hasBlockChild) return <div className={className}>{children}</div>;

                return <p className={className}>{children}</p>;
              },
              table: (props) => (
                <div className="my-6 overflow-x-auto rounded-lg border">
                  <table className="w-full text-sm" {...props} />
                </div>
              ),
              th: (props) => <th className="border-b bg-muted px-3 py-2 text-left font-semibold" {...props} />,
              td: (props) => <td className="border-b px-3 py-2 align-top" {...props} />
            }}
          >
            {doc.content}
          </ReactMarkdown>
        </div>
      )}
    </article>
  );
}
