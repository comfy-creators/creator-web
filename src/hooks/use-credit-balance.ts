/** @format */

import { useQuery } from "@tanstack/react-query";
import { getApiV1MeCredits } from "@/api/users/users";

export const CREDIT_BALANCE_QUERY_KEY = ["me", "credits"] as const;

export function useCreditBalance() {
  const query = useQuery({
    queryKey: CREDIT_BALANCE_QUERY_KEY,
    queryFn: () => getApiV1MeCredits(),
    staleTime: 30_000,
  });

  const totalCredits =
    query.data !== undefined
      ? Object.values(query.data).reduce((sum, val) => sum + val, 0)
      : undefined;

  return { ...query, totalCredits };
}
