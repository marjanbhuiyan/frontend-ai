import { useQuery } from "@tanstack/react-query";
import { getResourceConfig, getResourceData } from "@/features/resources/api/resource-api";
import type { ResourceConfig } from "@/features/resources/types";

export function useResourceConfig(name: string) {
  return useQuery<ResourceConfig | null>({
    queryKey: ["resource-config", name],
    queryFn: () => getResourceConfig(name),
    enabled: !!name,
    staleTime: 5 * 60 * 1000,
  });
}

export function useResourceData(name: string, params?: Record<string, unknown>) {
  return useQuery<{ data: unknown[]; total: number }>({
    queryKey: ["resource-data", name, params],
    queryFn: () => getResourceData(name, params),
    enabled: !!name,
  });
}
