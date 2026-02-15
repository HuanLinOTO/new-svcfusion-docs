import Link from "next/link";

import { DocsShell } from "@/components/docs/docs-shell";
import { Card } from "@/components/ui/card";
import { getDocsMeta } from "@/lib/docs";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const allDocs = getDocsMeta();

  const grouped = allDocs.reduce<Record<string, { title: string; href: string; active: boolean }[]>>((acc, item) => {
    const key = item.section;
    if (!acc[key]) acc[key] = [];
    acc[key].push({
      title: item.title,
      href: `/docs/${item.slug.join("/")}`,
      active: false
    });
    return acc;
  }, {});

  const nav = (
    <Card className="sticky top-24 h-fit max-h-[calc(100vh-7rem)] overflow-auto bg-white/80 p-4">
      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">导航</p>
      <nav className="space-y-4">
        {Object.entries(grouped).map(([section, links]) => (
          <div key={section} className="space-y-2">
            <p className="px-2 text-sm font-semibold capitalize">{section}</p>
            <div className="space-y-1">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  className="block rounded-md px-2 py-1.5 text-sm transition hover:bg-muted"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </Card>
  );

  const aside = (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-4">
        <Card className="bg-white/80 p-4">
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">赞助</p>
          <div className="space-y-3">
            <a
              href="https://studio.aigate.cc/images/1007735255911759872?channel=E4Z7B2W5C&coupon=AM8HLIZE2C"
              target="_blank"
              rel="noreferrer noopener"
              className="group block overflow-hidden rounded-xl border bg-white/70 transition hover:border-primary/30 hover:bg-white/90"
            >
              <div className="grid aspect-[16/9] place-items-center bg-muted/60 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/imgs/AIGate-AD.jpg" alt="智算云扉" className="h-full w-full object-contain" loading="lazy" />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-foreground">智算云扉</p>
                <p className="mt-1 text-xs text-muted-foreground">20 元算力 + 16 小时 4090D 免费用，充值再享额外优惠</p>
              </div>
            </a>

            <a
              href="https://www.compshare.cn/images/compshareImage-1aly0zqh3gvc?referral_code=1ywd4VqDKknFWCEUZvOoWo&ytag=GPU_aiguoliuguo_SF"
              target="_blank"
              rel="noreferrer noopener"
              className="group block overflow-hidden rounded-xl border bg-white/70 transition hover:border-primary/30 hover:bg-white/90"
            >
              <div className="grid aspect-[16/9] place-items-center bg-muted/60 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/imgs/UCloud-AD.png" alt="优云智算" className="h-full w-full object-contain" loading="lazy" />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-foreground">优云智算</p>
                <p className="mt-1 text-xs text-muted-foreground">10 元算力金免费用，高校/企业认证再得 10 元，算力 95 折</p>
              </div>
            </a>

            <a
              href="https://www.kdocs.cn/l/cjQe2kMl8GuG"
              target="_blank"
              rel="noreferrer noopener"
              className="group block overflow-hidden rounded-xl border bg-white/70 transition hover:border-primary/30 hover:bg-white/90"
            >
              <div className="grid aspect-[16/9] place-items-center bg-muted/60 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/imgs/d793fa7b2a698aa722a2fa361cf6c48a.png"
                  alt="讯度云计算"
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-foreground">讯度云计算</p>
                <p className="mt-1 text-xs text-muted-foreground">服务器合作赞助 / 返利合作 / 独享大宽带服务器</p>
              </div>
            </a>
          </div>
        </Card>
      </div>
    </aside>
  );

  return <DocsShell nav={nav} content={children} aside={aside} />;
}
