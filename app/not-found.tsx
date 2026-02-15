import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <p className="text-sm text-muted-foreground">页面丢了，或者你手滑写错地址啦。</p>
      <h1 className="text-2xl font-semibold">404</h1>
      <Button asChild>
        <Link href="/">回到首页</Link>
      </Button>
    </main>
  );
}
