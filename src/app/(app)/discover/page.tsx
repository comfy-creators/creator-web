/** @format */

"use client";

import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";

import { useWorkflows, type Workflow } from "@/hooks/use-workflows";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function groupByCategory(workflows: Workflow[]) {
  const groups: Record<string, Workflow[]> = {};
  for (const w of workflows) {
    if (!groups[w.category]) groups[w.category] = [];
    groups[w.category].push(w);
  }
  return groups;
}

export default function DiscoverPage() {
  const router = useRouter();
  const { data: workflows, isLoading } = useWorkflows();

  const featured = workflows?.[0];
  const rest = workflows?.slice(1) ?? [];
  const groups = groupByCategory(rest);
  const categories = Object.keys(groups);

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative min-h-[58vh] w-full overflow-hidden">
        {isLoading || !featured ? (
          <Skeleton className="h-[58vh] w-full rounded-none" />
        ) : (
          <>
            <img
              src={featured.thumbnailUrl}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Layered gradient: darken edges + heavy bottom fade */}
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-background/60 via-transparent to-transparent" />

            <div className="absolute inset-x-0 bottom-0 px-8 pb-12 md:px-14 md:pb-16">
              <Badge variant="secondary" className="mb-3 text-xs">
                {featured.category}
              </Badge>
              <h1 className="max-w-lg text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                {featured.name}
              </h1>
              <p className="mt-2 max-w-md text-sm text-muted-foreground line-clamp-2">
                {featured.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  size="default"
                  onClick={() =>
                    router.push(`/generate?workflow=${featured.id}`)
                  }
                  className="gap-2"
                >
                  Use this workflow
                  <ArrowRightIcon className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => router.push(`/workflows/${featured.id}`)}
                >
                  View details
                </Button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ── Category rows ── */}
      <div className="flex flex-col gap-10 px-8 py-10 md:px-14">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="h-4 w-28" />
                <div className="flex gap-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton
                      key={j}
                      className="aspect-2/3 w-44 shrink-0 rounded-xl"
                    />
                  ))}
                </div>
              </div>
            ))
          : categories.map((category) => (
              <div key={category}>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {category}
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {groups[category].map((workflow) => (
                    <WorkflowCard key={workflow.id} workflow={workflow} />
                  ))}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/workflows/${workflow.id}`)}
      className="group relative aspect-[2/3] w-44 shrink-0 cursor-pointer overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`View ${workflow.name} workflow`}
    >
      {/* Poster image */}
      <img
        src={workflow.thumbnailUrl}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Gradient overlay — always visible at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

      {/* Hover shade */}
      <div className="absolute inset-0 bg-black/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Info */}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="text-xs font-semibold text-white line-clamp-1">
          {workflow.name}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {workflow.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] leading-tight text-white/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
