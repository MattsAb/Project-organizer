import {prisma} from '../prismaClient.js';

export async function getUserProjects(req, res) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        ownerId: req.userId
      },
      include: {
        _count: {
          select: {
            members: true,
            assignments: true
          }
        }
      }
    })

    res.status(200).json(projects)
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'internal server error' })
  }
}

export async function createProject(req, res) {
  const { title, description } = req.body

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      msg: "please provide all requested information"
    })
  }

  try {
    const result = await prisma.$transaction(async (tx) => {

      const project = await tx.project.create({
        data: {
          title,
          description,
          ownerId: req.userId
        }
      })

      await tx.projectMember.create({
        data: {
          userId: req.userId,
          projectId: project.id,
          role: "OWNER"
        }
      })

      return project
    })

    return res.status(201).json(result)

  } catch (err) {
    console.error(err)
    return res.status(500).json({
      success: false,
      msg: "internal server error"
    })
  }
}

export async function getProjectMembers(req, res) {

    const projectId = Number(req.params.id);

  try {
    const members = await prisma.projectMember.findMany({
      where: {
        projectId: projectId
      },
        include: {
            user: true
        }
    })
    console.log(members)
    res.status(200).json(members)
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'internal server error' })
  }
}

export async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'internal server error' })
  }
}

export async function getDashboard(req, res) {

  try {

        const projects = await prisma.project.findMany({
          where: {
            ownerId: req.userId
          },
          include: {
            assignments: {
              include: {
                assignees: {
                  include: {
                    user: true
                  }
                }
              }
            },
            members: {
              include: {
                user: true
              }
            }
          }
        })

  const assignments = await prisma.assignment.findMany({
    where: {
      assignees: {
        some: { userId: req.userId }
      }
  }
})
    console.log(projects)
    res.status(200).json({projects, assignments})
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'internal server error' })
  }
}

