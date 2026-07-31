export type UserStatus = "Complete" | "Pending" | "Canceled";

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  contact: string;
  age: number;
  country: string;
  status: UserStatus;
}
