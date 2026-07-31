import { z } from "zod";

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