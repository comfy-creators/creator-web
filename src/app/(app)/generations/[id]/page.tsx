/** @format */

"use client";

/** @format */

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  ClockIcon,
  DownloadIcon,
  Loader2Icon,
  TimerIcon,
  XCircleIcon,
} from "lucide-react";

import { useGeneration } from "@/hooks/use-generation";
import {
  formatGenerationStatus,
  statusColorClass,
  statusVariant,
} from "@/lib/generation-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const STEPS = [
  { key: "queued", label: "Queued", icon: ClockIcon },
  { key: "running", label: "Processing", icon: Loader2Icon },
  { key: "completed", label: "Done", icon: CheckCircle2Icon },
] as const;

function getStepIndex(status: string | undefined) {
  if (status === "failed" || status === "retrying") return 1;
  if (status === "completed") return 2;
  if (status === "running") return 1;
  return 0;
}

export default function GenerationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: result, isLoading } = useGeneration(id);

  const gen = result?.generation;
  const activeStep = getStepIndex(gen?.status);
  const isFailed = gen?.status === "failed";

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          asChild
          aria-label="Back to generations"
        >
          <Link href="/generations" aria-label="Back to generations">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Generation Detail</h1>
          {gen?.id && (
            <p className="font-mono text-xs text-muted-foreground">{gen.id}</p>
          )}
        </div>
        {gen?.status && (
          <Badge
            variant={statusVariant(gen.status)}
            className={statusColorClass(gen.status)}
          >
            {formatGenerationStatus(gen.status)}
          </Badge>
        )}
      </div>

      {/* Timeline */}
      <Card>
        <CardContent className="py-6">
          <ol className="flex items-center gap-0">
            {STEPS.map((step, i) => {
              const isDone = activeStep > i;
              const isCurrent = activeStep === i;
              const isLast = i === STEPS.length - 1;

              return (
                <li key={step.key} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={[
                        "flex size-8 items-center justify-center rounded-full border-2 transition-colors",
                        isFailed && i === 1
                          ? "border-destructive bg-destructive/10 text-destructive"
                          : isDone || isCurrent
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      {isFailed && i === 1 ? (
                        <XCircleIcon className="size-4" />
                      ) : (
                        <step.icon className="size-4" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {step.label}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      className={[
                        "mx-2 h-0.5 flex-1 rounded transition-colors",
                        isDone ? "bg-primary" : "bg-border",
                      ].join(" ")}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Config summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Details</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            ) : (
              <dl className="flex flex-col gap-3 text-sm">
                <DetailRow
                  label="Submitted"
                  value={
                    gen?.enqueued_at
                      ? new Date(gen.enqueued_at).toLocaleString()
                      : "—"
                  }
                />
                <Separator />
                <DetailRow
                  label="Started"
                  value={
                    gen?.started_at
                      ? new Date(gen.started_at).toLocaleString()
                      : "—"
                  }
                />
                <Separator />
                <DetailRow
                  label="Finished"
                  value={
                    gen?.finished_at
                      ? new Date(gen.finished_at).toLocaleString()
                      : "—"
                  }
                />
                <Separator />
                <DetailRow
                  label="Credit cost"
                  value={gen?.credit_cost?.toLocaleString() ?? "—"}
                />
                {gen?.prompt && (
                  <>
                    <Separator />
                    <div className="flex flex-col gap-1">
                      <dt className="text-xs font-medium text-muted-foreground">
                        Prompt
                      </dt>
                      <dd className="text-xs leading-relaxed">{gen.prompt}</dd>
                    </div>
                  </>
                )}
                {gen?.error_log && (
                  <>
                    <Separator />
                    <div className="flex flex-col gap-1">
                      <dt className="text-xs font-medium text-destructive">
                        Error
                      </dt>
                      <dd className="rounded bg-destructive/5 px-2 py-1.5 font-mono text-xs text-destructive">
                        {gen.error_log}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            )}
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm font-medium">Output</CardTitle>
                {result?.output_expiry && (
                  <CardDescription className="mt-1 flex items-center gap-1 text-xs">
                    <TimerIcon className="size-3" />
                    Expires{" "}
                    {new Date(result.output_expiry).toLocaleDateString()}
                  </CardDescription>
                )}
              </div>
              {result?.output_url && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={result.output_url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <DownloadIcon data-icon="inline-start" />
                    Download
                  </a>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="aspect-square w-full rounded-md" />
            ) : result?.output_url ? (
              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
                <Image
                  src={result.output_url}
                  alt="Generation output"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-md bg-muted/40 text-muted-foreground">
                <Loader2Icon className="size-6 opacity-40" />
                <p className="text-xs">
                  {gen?.status === "completed"
                    ? "Output unavailable"
                    : "Waiting for output…"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-xs font-medium">{value}</dd>
    </div>
  );
}
