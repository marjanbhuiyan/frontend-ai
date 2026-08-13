export type UserStatus = "Active" | "Pending" | "Inactive";

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  phone: string;
  age: number;
  country: string;
  status: UserStatus;
}
