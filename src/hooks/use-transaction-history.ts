/** @format */

import { useQuery } from "@tanstack/react-query";

export interface Transaction {
  id: string;
  type: "credit_purchase" | "generation_spend";
  amount: number;
  description: string;
  created_at: string;
}

export const TRANSACTION_HISTORY_QUERY_KEY = ["transactions"] as const;

// TODO: no backend endpoint exists for transaction history yet.
// Replace this placeholder with a real API call once the endpoint is available.
export function useTransactionHistory() {
  return useQuery<Transaction[]>({
    queryKey: TRANSACTION_HISTORY_QUERY_KEY,
    queryFn: async () => [],
    staleTime: Infinity,
  });
}
