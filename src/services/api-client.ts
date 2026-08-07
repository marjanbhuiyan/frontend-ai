import axios from "axios";
import { API_BASE_URL } from "@/constants";
import { useAuthStore } from "@/store/useAuthStore";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

const bareClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

let refreshPromise: Promise<any> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status !== 401 ||
      original._retry
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (!refreshPromise) {
      refreshPromise = bareClient
        .post("/auth/refresh")
        .then((res) => {
          const data = res.data?.data ?? res.data;
          useAuthStore
            .getState()
            .setSession(data);

          return data;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    await refreshPromise;

    return apiClient(original);
  }
);