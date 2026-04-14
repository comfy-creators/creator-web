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

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-001",
    type: "credit_purchase",
    amount: 100,
    description: "Credit top-up — Starter pack",
    created_at: "2026-04-14T09:00:00Z",
  },
  {
    id: "tx-002",
    type: "generation_spend",
    amount: 4,
    description: "Generation: A serene mountain landscape at golden hour",
    created_at: "2026-04-14T08:00:42Z",
  },
  {
    id: "tx-003",
    type: "generation_spend",
    amount: 4,
    description: "Generation: Cyberpunk city with neon lights and rain",
    created_at: "2026-04-13T16:22:58Z",
  },
  {
    id: "tx-004",
    type: "credit_purchase",
    amount: 500,
    description: "Credit top-up — Pro pack",
    created_at: "2026-04-12T10:15:00Z",
  },
  {
    id: "tx-005",
    type: "generation_spend",
    amount: 4,
    description:
      "Generation: Minimalist Japanese ink brush painting of a crane",
    created_at: "2026-04-12T14:44:50Z",
  },
  {
    id: "tx-006",
    type: "generation_spend",
    amount: 4,
    description: "Generation: Victorian-era street market, oil painting style",
    created_at: "2026-04-11T11:30:00Z",
  },
];

// TODO: no backend endpoint exists for transaction history yet.
// Replace this placeholder with a real API call once the endpoint is available.
export function useTransactionHistory() {
  return useQuery<Transaction[]>({
    queryKey: TRANSACTION_HISTORY_QUERY_KEY,
    queryFn: async () => MOCK_TRANSACTIONS,
    staleTime: Infinity,
  });
}
