"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { IPortrait } from "@/types";

export function usePortraits() {
  return useQuery<IPortrait[]>({
    queryKey: ["portraits"],
    queryFn: async () => (await api.get("/portraits")).data,
    staleTime: 0,             // always treat as stale — cheap GET, big UX win
  });
}

export function useCreatePortrait() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { imageUrl: string; name?: string }) =>
      (await api.post<IPortrait>("/portraits", input)).data,
    onSuccess: async (created) => {
      // Optimistic insert so the UI reflects the new portrait instantly.
      qc.setQueryData<IPortrait[]>(["portraits"], (prev = []) => [
        created,
        ...prev,
      ]);
      // Then reconcile with the server.
      await qc.invalidateQueries({ queryKey: ["portraits"], refetchType: "all" });
    },
  });
}

export function useDeletePortrait() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/portraits/${id}`);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["portraits"], refetchType: "all" });
    },
  });
}