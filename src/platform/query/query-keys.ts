export const queryKeys = {
  app: {
    bootstrap: ["app", "bootstrap"] as const,
  },

  auth: {
    me: ["auth", "me"] as const,
  },

  stores: {
    all: ["stores"] as const,

    detail: (id: number) =>
      ["stores", id] as const,
  },

  users: {
    all: (
      storeId: number,
      params: unknown,
    ) =>
      [
        "store",
        storeId,
        "users",
        params,
      ] as const,

    detail: (
      storeId: number,
      id: number,
    ) =>
      [
        "store",
        storeId,
        "users",
        id,
      ] as const,
  },

  products: {
    all: (
      storeId: number,
      params: unknown,
    ) =>
      [
        "store",
        storeId,
        "products",
        params,
      ] as const,
  },
};