/** @format */

"use client";

/** @format */

import Link from "next/link";
import {
  ActivityIcon,
  CheckCircle2Icon,
  CoinsIcon,
  ImageIcon,
  SparklesIcon,
} from "lucide-react";

import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { useGenerations } from "@/hooks/use-generations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatGenerationStatus,
  statusColorClass,
  statusVariant,
} from "@/lib/generation-utils";

const statCards = [
  {
    label: "Credits",
    key: "credits" as const,
    icon: CoinsIcon,
    format: (v: number | undefined) =>
      v !== undefined ? v.toLocaleString() : "—",
  },
  {
    label: "Total Generations",
    key: "total" as const,
    icon: ImageIcon,
    format: (v: number | undefined) => String(v ?? 0),
  },
  {
    label: "Active",
    key: "active" as const,
    icon: ActivityIcon,
    format: (v: number | undefined) => String(v ?? 0),
  },
  {
    label: "Completed",
    key: "completed" as const,
    icon: CheckCircle2Icon,
    format: (v: number | undefined) => String(v ?? 0),
  },
];

export default function DashboardPage() {
  const stats = useDashboardStats();
  const { data: recent, isLoading: loadingRecent } = useGenerations({
    limit: 10,
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your generation activity
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/generate">
            <SparklesIcon data-icon="inline-start" />
            New Generation
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.key}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <card.icon className="size-3.5" />
                {card.label}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.isLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <p className="text-2xl font-semibold tabular-nums">
                  {card.format(stats[card.key] as number | undefined)}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent generations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Recent Generations
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/generations">View all</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loadingRecent ? (
            <div className="flex flex-col gap-3 p-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : !recent?.length ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
              <ImageIcon className="size-8 opacity-40" />
              <p className="text-sm">No generations yet.</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/generate">Create your first one</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Credits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((item) => {
                  const gen = item.generation;
                  return (
                    <TableRow
                      key={gen?.id}
                      className="cursor-pointer"
                      onClick={() => undefined}
                    >
                      <TableCell>
                        <Link
                          href={`/generations/${gen?.id}`}
                          className="font-mono text-xs hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {gen?.id?.slice(0, 8)}…
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusVariant(gen?.status)}
                          className={statusColorClass(gen?.status)}
                        >
                          {formatGenerationStatus(gen?.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {gen?.enqueued_at
                          ? new Date(gen.enqueued_at).toLocaleString()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {gen?.credit_cost ?? "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
