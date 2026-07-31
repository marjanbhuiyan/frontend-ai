import { useQuery } from "@tanstack/react-query";
import { getMenus } from "@/features/menus/api/menus-api";
import type { MenuResponse } from "@/features/menus/types";

export function useMenus(){
    return useQuery<MenuResponse>({
        queryKey: ["menus"],
        queryFn: () => getMenus(),
    });
}
