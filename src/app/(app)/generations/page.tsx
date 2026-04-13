/** @format */

"use client";

/** @format */

import Link from "next/link";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

import { useGenerations } from "@/hooks/use-generations";
import {
  formatGenerationStatus,
  statusColorClass,
  statusVariant,
} from "@/lib/generation-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Queued", value: "queued" },
  { label: "Running", value: "running" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number]["value"];

export default function GenerationsPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const { data: generations, isLoading } = useGenerations({ limit: 100 });

  const filtered =
    filter === "all"
      ? (generations ?? [])
      : (generations ?? []).filter((g) => g.generation?.status === filter);

  return (
    <>
      <div>
        <h1 className="text-xl font-semibold">Generations</h1>
        <p className="text-sm text-muted-foreground">
          All your generation requests
        </p>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as StatusFilter)}>
        <TabsList>
          {STATUS_FILTERS.map((s) => (
            <TabsTrigger key={s.value} value={s.value}>
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col gap-3 p-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : !filtered.length ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
              <ImageIcon className="size-8 opacity-40" />
              <p className="text-sm">
                {filter === "all"
                  ? "No generations yet."
                  : `No ${filter} generations.`}
              </p>
              {filter === "all" && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/generate">Create your first one</Link>
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Credits</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => {
                  const gen = item.generation;
                  return (
                    <TableRow key={gen?.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {gen?.id?.slice(0, 8)}…
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusVariant(gen?.status)}
                          className={statusColorClass(gen?.status)}
                        >
                          {formatGenerationStatus(gen?.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {gen?.enqueued_at
                          ? new Date(gen.enqueued_at).toLocaleString()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-xs">
                        {gen?.credit_cost ?? "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/generations/${gen?.id}`}>View</Link>
                        </Button>
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
