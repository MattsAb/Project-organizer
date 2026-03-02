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
      
    const membership = req.membership

    res.status(200).json({assignments, membership})
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'internal server error' })
  }
}

export async function createAssignment(req, res) {
  const { title, description, assignees, dueDate } = req.body
  const projectId = Number(req.params.id)

  if (!title || assignees.length === 0) {
    return res.status(400).json({
      success: false,
      message: "invalid input"
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

export async function getInfo(req, res) {
  const assignmentId = Number(req.params.id);

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        assignees: {
          include: { user: true }
        },
        }
    });

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const membership = req.membership
    console.log(assignment)

    res.status(200).json({ assignment, membership });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'internal server error' });
  }
}

export async function setProcess(req, res) {
  const assignmentId = Number(req.params.id);
  const userId = req.userId;

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        assignees: true
      }
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const isAssigned = assignment.assignees.some(
      (assignee) => assignee.userId === userId
    );

    if (!isAssigned) {
      return res.status(403).json({ message: "You are not assigned to this task" });
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        status: "IN_PROGRESS"
      }
    });

    return res.status(200).json(updatedAssignment);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "internal server error"
    });
  }
}

export async function setFinish(req, res) {
  const assignmentId = Number(req.params.id);
  const userId = req.userId;

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { assignees: true }
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: { status: "DONE" }
    });

    return res.status(200).json({success: false});

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "internal server error" });
  }
}

export async function declineAssignment(req, res) {
  const assignmentId = Number(req.params.id);
  const userId = req.userId;

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { assignees: true } // get all assigned users
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.status === "DONE")
    {
      return res.status(403).json({ message: "Assignment has already been finished" });
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: { status: "TODO" }
    });

    return res.status(200).json(updatedAssignment);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "internal server error" });
  }
}

export async function deleteAssignment(req, res) {

  const assignmnetId = Number(req.params.id);

  try {
     await prisma.assignment.delete({
      where: {
        id: assignmnetId
      }
    })

    res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'internal server error' })
  }
}
