import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});


export const registerSchema = z.object({
  firstName: z.string().max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  avatar: z.instanceof(File).optional(),
  gender: z.enum(['male', 'female', 'other']),
  status: z.enum(['active', 'inactive', 'pending']),
  roleName: z.string().min(1, 'Role name is required').max(50),
  roleId: z.string().max(50).optional(),
  storeName: z.string().min(1, 'Store name is required').max(50),
  storeId: z.string().max(50).optional(),
  storeLocation: z.string().max(50),
  country: z.string().min(1, 'Country is required').max(50),
  city: z.string().min(1, 'City is required').max(50),
  state: z.string().min(1, 'State is required').max(50),
  phone: z.string().min(11, 'Phone number must be 11 digits').max(11, 'Phone number must be 11 digits'),
  address: z.string().max(100),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
