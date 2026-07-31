import { useQuery } from "@tanstack/react-query";
import { getDivisions, getDistricts } from "@/services/location.api";

export const useDivisions = () =>
    useQuery({
        queryKey: ["divisions"],
        queryFn: getDivisions,
});


export const useDistricts = (divisionId?: number ) =>
    useQuery({
        queryKey: ["districts", divisionId],
        queryFn: () => getDistricts(divisionId!),
        enabled: !!divisionId,
});