/** @format */

"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { useWorkflows } from "@/hooks/use-workflows";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkflowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: workflows, isLoading } = useWorkflows();

  const workflow = workflows?.find((w) => w.id === id);

  if (!isLoading && workflows && !workflow) {
    return (
      <div className="flex h-96 items-center justify-center text-sm text-muted-foreground">
        Workflow not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative min-h-[52vh] w-full overflow-hidden">
        {isLoading || !workflow ? (
          <Skeleton className="h-[52vh] w-full rounded-none" />
        ) : (
          <>
            <img
              src={workflow.thumbnailUrl}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-background/50 via-transparent to-transparent" />

            {/* Back */}
            <div className="absolute left-8 top-6 md:left-14 md:top-8">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 rounded-md border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Go back"
              >
                <ArrowLeftIcon className="size-3.5" />
                Back
              </button>
            </div>

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 px-8 pb-10 md:px-14 md:pb-14">
              <div className="mb-3 flex flex-wrap gap-2">
                {workflow.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="max-w-xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                {workflow.name}
              </h1>
              <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                {workflow.description}
              </p>
            </div>
          </>
        )}
      </section>

      {/* ── Sample outputs ── */}
      <section className="px-8 pt-8 md:px-14">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sample outputs
        </h2>
        {isLoading ? (
          <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-video w-64 shrink-0 rounded-xl"
              />
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {workflow?.sampleOutputs.map((src, i) => (
              <div
                key={i}
                className="aspect-video w-64 shrink-0 overflow-hidden rounded-xl bg-muted"
              >
                <img
                  src={src}
                  alt={`Sample output ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      <section className="px-8 py-10 md:px-14">
        {isLoading || !workflow ? (
          <Skeleton className="h-10 w-52" />
        ) : (
          <Button
            size="lg"
            className="gap-2"
            onClick={() => router.push(`/generate?workflow=${workflow.id}`)}
          >
            Use this workflow
            <ArrowRightIcon className="size-4" />
          </Button>
        )}
      </section>
    </div>
  );
}
