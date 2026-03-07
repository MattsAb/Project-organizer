import { z } from "zod"

export const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, "title is required")
    .max(30, "title must be under 30 characters"),

  description: z
    .string()
    .max(150, "password must be under 150 characters")
    .optional(),
})
