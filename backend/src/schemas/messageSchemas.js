import { z } from "zod"

export const createMessageSchema = z.object({
  body: z
    .string()
    .min(1, "body is required")
    .max(200, "body must be under 200 characters"),

  description: z
    .string()
    .max(50, "description must be under 50 characters")
    .optional(),

})
