"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { IClothingItem } from "@/types";

export function useClothing() {
  return useQuery<IClothingItem[]>({
    queryKey: ["wardrobe"],
    queryFn: async () => (await api.get("/wardrobe")).data,
  });
}

export function useCreateClothing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { imageUrl: string; name?: string }) =>
      (await api.post<IClothingItem>("/wardrobe", input)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wardrobe"] }),
  });
}

export function useDeleteClothing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/wardrobe/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wardrobe"] }),
  });
}