/** @format */

import { useQuery } from "@tanstack/react-query";
import { getApiV1Generations } from "@/api/generations/generations";
import type { GetApiV1GenerationsParams } from "@/api/models";

export const GENERATIONS_QUERY_KEY = ["generations"] as const;

export function useGenerations(params?: GetApiV1GenerationsParams) {
  return useQuery({
    queryKey: [...GENERATIONS_QUERY_KEY, params],
    queryFn: () => getApiV1Generations(params),
  });
}
