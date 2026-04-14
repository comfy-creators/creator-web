/** @format */

import type { GetApiV1GenerationsParams } from "@/api/models";
import { useGenerationsSimulator } from "@/contexts/generations-simulator";

export const GENERATIONS_QUERY_KEY = ["generations"] as const;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useGenerations(_params?: GetApiV1GenerationsParams) {
  const { generations } = useGenerationsSimulator();
  return { data: generations, isLoading: false };
}
