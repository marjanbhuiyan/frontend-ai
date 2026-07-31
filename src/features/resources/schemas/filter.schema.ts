import { z } from "zod";

export const filterSchema = z.object({
  search: z.string().optional(),
});

export type FilterFormValues = z.infer<typeof filterSchema>;
