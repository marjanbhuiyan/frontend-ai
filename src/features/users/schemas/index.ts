import { z } from "zod";

export const registerFormSchema = z.object({
  firstName: z.string().trim().optional().or(z.literal("")),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required"),
  avatar: z.instanceof(File).optional(),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^\d{11}$/, "Phone must be exactly 11 digits"),
  gender: z.enum(["male", "female", "other"]),
  status: z.enum(["pending", "active", "inactive"]),
  storeName: z.string().trim().min(1, "Store name is required"),
  city: z.string().trim().min(1, "City is required"),
  country: z.string().trim().min(1, "Country is required"),
  address: z.string().trim().min(1, "Address is required"),
  role: z.enum(["admin", "user"]),
  storeLocation: z.string().trim().min(1, "Store location is required"),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  confirmPassword: z.string().min(8, { message: "Confirm password must be at least 8 characters long" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
export type RegisterFormData = z.infer<typeof registerFormSchema>;