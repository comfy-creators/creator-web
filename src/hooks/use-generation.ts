/** @format */

import { useQuery } from "@tanstack/react-query";
import { getApiV1GenerationsId } from "@/api/generations/generations";

export const generationQueryKey = (id: string) => ["generations", id] as const;

export function useGeneration(id: string) {
  return useQuery({
    queryKey: generationQueryKey(id),
    queryFn: () => getApiV1GenerationsId(id),
    enabled: !!id,
  });
}
