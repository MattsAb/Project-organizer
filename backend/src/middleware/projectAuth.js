import {prisma} from '../prismaClient.js';

export default function projectAuthMiddleware(roles) {
  return async (req, res, next) => {

    const projectId = Number(req.params.projectId || req.params.id)
    const userId = req.userId

    try {
      const membership = await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId,
            projectId
          }
        }
      })

      if (!membership) {
        return res.status(403).json({ message: "Not a project member" })
      }

      if (!roles.includes(membership.role)) {
        return res.status(403).json({ message: "Not permitted" })
      }

      req.membership = membership.role;
      next()
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: "internal server error" })
    }
  }
}