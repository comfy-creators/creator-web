/** @format */

import type { ComponentProps } from "react";

import type { Badge } from "@/components/ui/badge";

type BadgeVariant = ComponentProps<typeof Badge>["variant"];

export function formatGenerationStatus(status: string | undefined): string {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function statusVariant(
  status: string | undefined
): BadgeVariant {
  switch (status) {
    case "failed":
      return "destructive";
    case "queued":
    case "running":
    case "retrying":
    case "completed":
    default:
      return "secondary";
  }
}

export function statusColorClass(status: string | undefined): string {
  switch (status) {
    case "completed":
      return "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400";
    case "running":
      return "border-primary/30 bg-primary/10 text-primary";
    case "retrying":
      return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400";
    default:
      return "";
  }
}
