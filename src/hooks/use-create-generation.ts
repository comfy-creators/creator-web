/** @format */

import { useCallback, useState } from "react";
import type { GithubComComfyCreatorsCreatorBackendInternalServiceGenerationGenerationInput as GenInput } from "@/api/models";
import { useGenerationsSimulator } from "@/contexts/generations-simulator";

export function useCreateGeneration() {
  const { createGeneration } = useGenerationsSimulator();
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    (
      input: GenInput,
      options?: {
        onSuccess?: (id: string) => void;
        onError?: (err: Error) => void;
      },
    ) => {
      setIsPending(true);
      try {
        const id = createGeneration(input);
        options?.onSuccess?.(id);
      } catch (err) {
        options?.onError?.(err as Error);
      } finally {
        setIsPending(false);
      }
    },
    [createGeneration],
  );

  return { mutate, isPending, error: null };
}
