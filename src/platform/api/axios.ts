import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/platform/auth/auth.store";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _skipAuthRefresh?: boolean;
}

let isRefreshing = false;

let refreshPromise:
  | Promise<string>
  | null = null;

let failedQueue: Array<{
  resolve: (
    token: string,
  ) => void;

  reject: (
    error: unknown,
  ) => void;
}> = [];

function processQueue(
  error: unknown,
  token: string | null,
) {
  failedQueue.forEach(
    ({
      resolve,
      reject,
    }) => {
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
  (
    config,
  ) => {
    const token =
      useAuthStore
        .getState()
        .accessToken;

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
);

api.interceptors.response.use(
  (response) =>
    response,

  async (
    error: AxiosError,
  ) => {
    const originalRequest =
      error.config as
        | RetryConfig
        | undefined;

    if (!originalRequest) {
      return Promise.reject(
        error,
      );
    }

    const status =
      error.response?.status;

    /*
     * Do NOT refresh for:
     *
     * /auth/login
     * /auth/register
     * /auth/refresh
     * etc.
     */
    if (
      originalRequest
        ._skipAuthRefresh
    ) {
      return Promise.reject(
        error,
      );
    }

    /*
     * Only 401 should trigger refresh.
     */
    if (
      status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(
        error,
      );
    }

    originalRequest._retry =
      true;

    /*
     * Another request is already
     * refreshing the token.
     */
    if (isRefreshing) {
      return new Promise(
        (
          resolve,
          reject,
        ) => {
          failedQueue.push({
            resolve: (
              token,
            ) => {
              originalRequest.headers.Authorization =
                `Bearer ${token}`;

              resolve(
                api(
                  originalRequest,
                ),
              );
            },

            reject,
          });
        },
      );
    }

    isRefreshing = true;

    refreshPromise =
      refreshAccessToken();

    try {
      const newToken =
        await refreshPromise;

      processQueue(
        null,
        newToken,
      );

      originalRequest.headers.Authorization =
        `Bearer ${newToken}`;

      return api(
        originalRequest,
      );
    } catch (
      refreshError
    ) {
      processQueue(
        refreshError,
        null,
      );

      useAuthStore
        .getState()
        .clearAuth();

      return Promise.reject(
        refreshError,
      );
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  },
);




async function refreshAccessToken(): Promise<string> {
  const response =
    await axios.post(
      `${API_URL}/auth/refresh`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type":
            "application/json",
        },
      },
    );

  const newAccessToken =
    response.data?.data
      ?.accessToken;

  if (!newAccessToken) {
    throw new Error(
      "Refresh endpoint did not return accessToken",
    );
  }

  useAuthStore
    .getState()
    .setAccessToken(
      newAccessToken,
    );

  return newAccessToken;
}