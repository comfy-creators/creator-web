/** @format */

import { useQuery } from "@tanstack/react-query";
import { getApiV1Credits } from "@/api/credits/credits";

export const CREDIT_BALANCE_QUERY_KEY = ["me", "credits"] as const;

export function useCreditBalance() {
  return useQuery({
    queryKey: CREDIT_BALANCE_QUERY_KEY,
    queryFn: () => getApiV1Credits(),
    staleTime: 30_000,
  });
}
