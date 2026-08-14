import { z } from "zod";
import type{ UseFormReturn } from "react-hook-form";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const createStoreSchema = z.object({
  name: z.string().min(3).nonempty(),
  phone: z.string(),
  address: z.string(),
  logo: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Maximum size is 5MB",
    })
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      {
        message: "Only JPG, PNG and WEBP allowed",
      }
    )
    .optional(),
});

export type CreateStoreForm = z.infer<typeof createStoreSchema>;

export interface CreateFormProps {
  form: UseFormReturn<CreateStoreForm>;
  // OLD: form used to close the dialog after an internal mutation succeeded.
  // onSuccess?: () => void;
  /* NEW: the parent dialog owns the mutation and passes the submit handler,
     so the form becomes a controlled presentational component. */
  onSubmit: (data: CreateStoreForm) => void | Promise<void>;
}