/** @format */

import { useQuery } from "@tanstack/react-query";
import type { GetApiV1GenerationsParams } from "@/api/models";
import type { GithubComComfyCreatorsCreatorBackendInternalServiceGenerationGenerationResult } from "@/api/models";

export const GENERATIONS_QUERY_KEY = ["generations"] as const;

const MOCK_GENERATIONS: GithubComComfyCreatorsCreatorBackendInternalServiceGenerationGenerationResult[] =
  [
    {
      generation: {
        id: "a1b2c3d4-0001-0001-0001-000000000001",
        status: "completed",
        prompt: "A serene mountain landscape at golden hour",
        credit_cost: 4,
        enqueued_at: "2026-04-14T08:00:00Z",
        started_at: "2026-04-14T08:00:05Z",
        finished_at: "2026-04-14T08:00:42Z",
        attachments: [
          { type: "image", url: "https://picsum.photos/seed/gen1/400/300" },
        ],
      },
    },
    {
      generation: {
        id: "a1b2c3d4-0002-0002-0002-000000000002",
        status: "completed",
        prompt: "Cyberpunk city with neon lights and rain",
        credit_cost: 4,
        enqueued_at: "2026-04-13T16:22:10Z",
        started_at: "2026-04-13T16:22:15Z",
        finished_at: "2026-04-13T16:22:58Z",
        attachments: [
          { type: "image", url: "https://picsum.photos/seed/gen2/400/300" },
        ],
      },
    },
    {
      generation: {
        id: "a1b2c3d4-0003-0003-0003-000000000003",
        status: "running",
        prompt: "Abstract watercolor portrait of a futuristic robot",
        credit_cost: 4,
        enqueued_at: "2026-04-14T09:10:00Z",
        started_at: "2026-04-14T09:10:08Z",
      },
    },
    {
      generation: {
        id: "a1b2c3d4-0004-0004-0004-000000000004",
        status: "queued",
        prompt: "Victorian-era street market, oil painting style",
        credit_cost: 4,
        enqueued_at: "2026-04-14T09:12:30Z",
      },
    },
    {
      generation: {
        id: "a1b2c3d4-0005-0005-0005-000000000005",
        status: "failed",
        prompt: "Deep sea creature bioluminescent glow",
        credit_cost: 0,
        enqueued_at: "2026-04-13T11:05:00Z",
        started_at: "2026-04-13T11:05:10Z",
        finished_at: "2026-04-13T11:05:25Z",
        error_log: "Worker timeout after 15s",
      },
    },
    {
      generation: {
        id: "a1b2c3d4-0006-0006-0006-000000000006",
        status: "completed",
        prompt: "Minimalist Japanese ink brush painting of a crane",
        credit_cost: 4,
        enqueued_at: "2026-04-12T14:44:00Z",
        started_at: "2026-04-12T14:44:06Z",
        finished_at: "2026-04-12T14:44:50Z",
        attachments: [
          { type: "image", url: "https://picsum.photos/seed/gen6/400/300" },
        ],
      },
    },
  ];

export function useGenerations(params?: GetApiV1GenerationsParams) {
  return useQuery({
    queryKey: [...GENERATIONS_QUERY_KEY, params],
    queryFn: async () => MOCK_GENERATIONS,
  });
}
