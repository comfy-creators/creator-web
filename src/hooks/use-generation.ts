/** @format */

import { useGenerationsSimulator } from "@/contexts/generations-simulator";

export const generationQueryKey = (id: string) => ["generations", id] as const;

export function useGeneration(id: string) {
  const { generations } = useGenerationsSimulator();
  const data = generations.find((r) => r.generation?.id === id);
  return { data, isLoading: false };
}
