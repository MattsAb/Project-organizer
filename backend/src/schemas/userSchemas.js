import { z } from "zod"

export const loginUserSchema = z.object({
  username: z
    .string()
    .min(5, "username must be ateast 5 characters long")
    .max(25, "username must be under 25 characters"),

  password: z
    .string()
    .min(5, "password must be ateast 5 characters long")
    .max(50, "password must be under 50 characters"),
})

export const registerUserSchema = z.object({
  username: z
    .string()
    .min(5, "username must be ateast 5 characters long")
    .max(25, "username must be under 25 characters"),

  password: z
    .string()
    .min(5, "password must be ateast 5 characters long")
    .max(50, "password must be under 50 characters"),

  email: z
    .string()
    .min(1, "email is required")
    .max(50, "email must be under 50 characters")

})