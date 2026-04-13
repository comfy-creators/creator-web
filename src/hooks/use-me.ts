/** @format */

import { useQuery } from "@tanstack/react-query";
import { getApiV1Me } from "@/api/users/users";

export const ME_QUERY_KEY = ["me"] as const;

export function useMe() {
  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: () => getApiV1Me(),
  });
}
