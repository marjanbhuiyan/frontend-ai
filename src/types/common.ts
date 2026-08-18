export type UserType = "global" | "store";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;

  type: UserType;

  role: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface ActiveStore {
  id: number;
  name: string;
  slug: string;

  role: {
    id: number;
    name: string;
    slug: string;
  };
}