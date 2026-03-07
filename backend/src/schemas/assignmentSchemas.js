import { z } from "zod"

export const createAssignmentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(40, "Title must be under 40 characters"),

  description: z
    .string()
    .max(150, "Description too long")
    .optional(),

  dueDate: z
    .string("please provide a due date")
    .datetime(),

  assignees: z
    .array(z.number())
    .min(1, "At least one assignee required")
})