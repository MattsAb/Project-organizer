import {prisma} from '../prismaClient.js';

export async function getAssignments(req, res) {
    const projectId = Number(req.params.id);

  try {
        const assignments = await prisma.assignment.findMany({
        where: { projectId },
        include: {
            assignees: {
            include: {
                user: true
            }
            }
        }
        })
    console.log(assignments)
    res.status(200).json(assignments)
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'internal server error' })
  }
}

export async function createAssignment(req, res) {
  const { title, description, assignees, dueDate } = req.body
  const projectId = Number(req.params.id)

  if (!title || !assignees || !Array.isArray(assignees)) {
    return res.status(400).json({
      success: false,
      msg: "invalid input"
    })
  }

  try {
    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        createdById: req.userId,
        projectId,

        assignees: {
          create: assignees.map((userId) => ({
            userId
          }))
        }
      },
      include: {
        assignees: true
      }
    })

    return res.status(201).json(assignment)

  } catch (err) {
    console.error(err)
    return res.status(500).json({
      success: false,
      msg: "internal server error"
    })
  }
}

export async function inviteUser(req, res) {

  const projectId = Number(req.params.id)
  const {invitedId} = req.body;

  try
  {
      const member = await prisma.projectMember.create({
        data: {
          userId: invitedId,
          projectId: projectId,
        }
      })

      return res.status(201).json(member)
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      success: false,
      msg: "internal server error"
    })
  }
}