/** @format */

import { useQuery } from "@tanstack/react-query";
import { getApiV1BatchesIdGenerations } from "@/api/generations/generations";

export const batchGenerationsQueryKey = (id: string) =>
  ["batches", id, "generations"] as const;

export function useBatchGenerations(id: string) {
  return useQuery({
    queryKey: batchGenerationsQueryKey(id),
    queryFn: () => getApiV1BatchesIdGenerations(id),
    enabled: !!id,
  });
}
