import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { DlcSection } from "@/lib/dlc";

type DlcViewProps = {
  sections: DlcSection[];
};

export function DlcView({ sections }: DlcViewProps) {
  if (!sections.length) {
    return (
      <Card className="rounded-2xl bg-white/85 p-6">
        <p className="text-sm text-muted-foreground">当前未解析出 DLC 内容。</p>
      </Card>
    );
  }

  return (
    <div className="space-y-10 pb-2">
      <Card className="hero-grid-pattern relative overflow-hidden rounded-3xl bg-white/85 p-6">
        <div className="pointer-events-none absolute -left-24 -top-20 h-60 w-60 rounded-full bg-secondary/35 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-primary/25 blur-3xl" aria-hidden="true" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              DLC 仓库
            </p>
            <p className="mt-1 text-sm text-muted-foreground">用于安装预训练底模与工具扩展。</p>
          </div>
          <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">持续更新</Badge>
        </div>
        <Separator className="my-5" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-2xl border bg-white/70 px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-md"
            >
              {s.title}
              {s.note ? <span className="ml-2 text-xs font-medium text-muted-foreground">· {s.note}</span> : null}
            </a>
          ))}
        </div>
      </Card>

      <Card className="rounded-3xl bg-white/85 p-6">
        <p className="text-base font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          安装说明
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>下载对应 DLC 文件（推荐优先使用网盘链接）。</li>
          <li>在 SVC Fusion 的“小工具 → DLC”页面上传文件。</li>
          <li>点击“安装”，完成后建议刷新页面。</li>
        </ol>
      </Card>

      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-28 space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                {section.title}
              </h2>
              {section.note ? <p className="mt-1 text-sm text-muted-foreground">{section.note}</p> : null}
            </div>
            <a href="#" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
              回到顶部
            </a>
          </div>
          <Separator />

          <div className="grid gap-4 lg:grid-cols-2">
            {(section.items ?? []).map((item) => (
              <Card key={item.title} className="overflow-hidden rounded-3xl bg-white/92 p-6 shadow-sm">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words text-base font-semibold text-foreground">
                      {item.icon ? <span className="mr-2">{item.icon}</span> : null}
                      {item.title}
                    </p>
                    {item.description ? <p className="mt-1 text-sm text-muted-foreground">{item.description}</p> : null}
                  </div>
                  <Badge variant="secondary" className="shrink-0 rounded-full">
                    .sf_dlc
                  </Badge>
                </div>
                <Separator className="my-4" />
                <div className="flex flex-wrap gap-2">
                  {item.netdiskLink ? (
                    <Button asChild size="sm" className="rounded-full">
                      <a href={item.netdiskLink} target="_blank" rel="noreferrer noopener">
                        网盘
                      </a>
                    </Button>
                  ) : null}
                  {item.primaryLink ? (
                    <Button asChild size="sm" variant="outline" className="rounded-full bg-white/70">
                      <a href={item.primaryLink} target="_blank" rel="noreferrer noopener">
                        HuggingFace
                      </a>
                    </Button>
                  ) : null}
                  {item.mirrorLink ? (
                    <Button asChild size="sm" variant="secondary" className="rounded-full">
                      <a href={item.mirrorLink} target="_blank" rel="noreferrer noopener">
                        镜像
                      </a>
                    </Button>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
