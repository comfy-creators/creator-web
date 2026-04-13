/** @format */

import { useQuery } from "@tanstack/react-query";
import { getApiV1BatchesId } from "@/api/generations/generations";

export const batchQueryKey = (id: string) => ["batches", id] as const;

export function useBatch(id: string) {
  return useQuery({
    queryKey: batchQueryKey(id),
    queryFn: () => getApiV1BatchesId(id),
    enabled: !!id,
  });
}
