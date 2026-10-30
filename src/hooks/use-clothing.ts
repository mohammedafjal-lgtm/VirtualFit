"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { IClothingItem } from "@/types";

export function useClothing() {
  return useQuery<IClothingItem[]>({
    queryKey: ["clothing"],
    queryFn: async () => (await api.get("/clothing")).data,
  });
}

export function useCreateClothing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { imageUrl: string; name?: string }) =>
      (await api.post<IClothingItem>("/clothing", input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clothing"] }),
  });
}

export function useDeleteClothing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/clothing/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clothing"] }),
  });
}