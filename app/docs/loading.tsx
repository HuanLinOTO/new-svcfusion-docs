import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <article className="rounded-2xl border border-border/80 bg-white/95 p-6 shadow-lg md:p-8">
      <div className="h-8 w-2/3 animate-pulse rounded-lg bg-muted" />
      <Separator className="my-6" />
      <div className="space-y-4">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
        <div className="h-4 w-10/12 animate-pulse rounded bg-muted" />
        <div className="h-4 w-9/12 animate-pulse rounded bg-muted" />
        <Card className="mt-6 bg-white/80 p-4">
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="mt-3 h-20 w-full animate-pulse rounded-xl bg-muted" />
        </Card>
      </div>
    </article>
  );
}
