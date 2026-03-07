import { z } from "zod"

export const validate =
  (schema) =>
  (req, res, next) => {

    const result = schema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues[0].message
      })
    }

    req.body = result.data
    next()
  }

export function idValidator(idFields = ['id']) {
  return (req, res, next) => {
    try {
      idFields.forEach((field) => {
        req.params[field] = z.coerce.number().int().positive().parse(req.params[field])
      })
      next()
    } catch (err) {
      if (err) {
        return res.status(400).json({ success: false, message: "Invalid ID" })
      }
      next(err)
    }
  }
}