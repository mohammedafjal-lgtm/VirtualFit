"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ITryOnResult } from "@/types";

export function useGenerateTryOn() {
  return useMutation({
    mutationFn: async (input: { portraitId: string; clothingIds: string[] }) =>
      (await api.post<{ jobId: string; status: "pending" }>("/ai/try-on", input))
        .data,
  });
}

export function usePollTryOn(jobId: string | null) {
  return useQuery<ITryOnResult>({
    queryKey: ["try-on", jobId],
    queryFn: async () => (await api.get(`/ai/try-on/${jobId}`)).data,
    enabled: !!jobId,
    refetchInterval: (query) => {
      const s = query.state.data?.status;
      return s === "pending" ? 3000 : false;
    },
  });
}

export function useTryOnHistory() {
  return useQuery<ITryOnResult[]>({
    queryKey: ["try-on-history"],
    queryFn: async () => (await api.get("/ai/try-on")).data,
  });
}