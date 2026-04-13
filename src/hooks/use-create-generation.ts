/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postApiV1Generate } from "@/api/generations/generations";
import type { GithubComComfyCreatorsCreatorBackendInternalServiceGenerationGenerationInput } from "@/api/models";
import { GENERATIONS_QUERY_KEY } from "./use-generations";

export function useCreateGeneration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      input: GithubComComfyCreatorsCreatorBackendInternalServiceGenerationGenerationInput,
    ) =>
      postApiV1Generate({
        generations: [input],
        // priority is an internal concept — not exposed in UI
        priority: "standard",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GENERATIONS_QUERY_KEY });
    },
  });
}
