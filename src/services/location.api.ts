import { apiClient } from "@/services/api-client";

export const getDivisions = async () => {
  const { data } = await apiClient.get("/address/divisions");
  return data;
};

export const getDistricts = async (
  divisionId: number
) => {
  const { data } = await apiClient.get("/address/districts", {
    params: {
      divisionId,
    },
  });

  return data;
};