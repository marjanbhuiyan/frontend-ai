import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/platform/auth/auth.store";
import { API_BASE_URL } from "@/constants";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

interface RetryRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;

let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(
  error: unknown,
  token: string | null,
) {
  failedQueue.forEach(
    ({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else if (token) {
        resolve(token);
      }
    },
  );

  failedQueue = [];
}

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
);

api.interceptors.response.use((response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as | RetryRequestConfig | undefined;

    if (!originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise(
        (resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization =
                `Bearer ${token}`;

              resolve(
                api(originalRequest),
              );
            },

            reject,
          });
        },
      );
    }

    isRefreshing = true;

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          },
        );

      const newToken = response.data?.data?.accessToken;

      console.log("newToken in axios", newToken);

      if (!newToken) {
        throw new Error(
          "Refresh response did not contain access token",
        );
      }

      useAuthStore.getState().setAccessToken(newToken);

      processQueue(
        null,
        newToken,
      );

      originalRequest.headers.Authorization =
        `Bearer ${newToken}`;

      return api(
        originalRequest,
      );
    } catch (refreshError) {
      processQueue(
        refreshError,
        null,
      );

      useAuthStore
        .getState()
        .clearAuth();

      window.location.replace(
        "/login",
      );

      return Promise.reject(
        refreshError,
      );
    } finally {
      isRefreshing = false;
    }
  },
);