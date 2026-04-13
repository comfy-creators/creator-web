/** @format */

import { useGenerations } from "./use-generations";
import { useCreditBalance } from "./use-credit-balance";

export function useDashboardStats() {
  const { data: generations, isLoading: loadingGens } = useGenerations({
    limit: 100,
  });
  const { totalCredits, isLoading: loadingCredits } = useCreditBalance();

  const active =
    generations?.filter(
      (g) =>
        g.generation?.status === "queued" ||
        g.generation?.status === "running" ||
        g.generation?.status === "retrying",
    ).length ?? 0;

  const completed =
    generations?.filter((g) => g.generation?.status === "completed").length ??
    0;

  return {
    credits: totalCredits,
    total: generations?.length ?? 0,
    active,
    completed,
    isLoading: loadingGens || loadingCredits,
  };
}
