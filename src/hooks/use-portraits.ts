"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { IPortrait } from "@/types";

export function usePortraits() {
  return useQuery<IPortrait[]>({
    queryKey: ["portraits"],
    queryFn: async () => (await api.get("/portraits")).data,
  });
}

export function useCreatePortrait() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { imageUrl: string; name?: string }) =>
      (await api.post<IPortrait>("/portraits", input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portraits"] }),
  });
}

export function useDeletePortrait() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/portraits/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portraits"] }),
  });
}