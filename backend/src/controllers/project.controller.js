import {prisma} from '../prismaClient.js';

export async function getUserProjects(req, res) {
  const userId = req.userId

  try {

    const myProjects = await prisma.project.findMany({
      where: {
        ownerId: userId
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

    const memberProjects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: userId
          }
        },
        NOT: {
          ownerId: userId
        }
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

    return res.status(200).json({
      myProjects,
      memberProjects
    })

  } catch (err) {
    console.error(err)
    return res.status(500).json({
      success: false,
      message: 'internal server error'
    })
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

    const membership = req.membership;

    res.status(200).json({members, membership})
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'internal server error' })
  }
}

export async function getUsers(req, res) {
  const projectId = Number(req.params.id);

  try {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          memberships: {
            some: {
              projectId: projectId
            }
          }
        }
      },
      select: {
        id: true,
        username: true
      }
    });

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'internal server error' });
  }
}

export async function getSearch(req, res) {
  const search = req.query.search;

  if (!search || typeof search !== "string") {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: search,
          mode: "insensitive"
        }
      },
      select: {
        id: true,
        username: true
      }
    });

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function getDashboard(req, res) {

  try {
        const projects = await prisma.project.findMany({
          where: {
            ownerId: req.userId,
            assignments: {
              some: {
                status: "IN_PROGRESS"
              }
            }
          },
          include: {
            assignments: {
              where: { status: "IN_PROGRESS" },
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
        });

  const assignments = await prisma.assignment.findMany({
    where: {
      status: "TODO",  
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


export async function changeRole(req, res) {

    const memberId = Number(req.params.memberId);

  try {

    const member = await prisma.projectMember.findUnique({
    where: {
        id: memberId
    }
      })

    if (member.role === "OWNER")
    {
      return res.status(403).json("Can't demote the Owner of the project")
    }

    const updatedMember = await prisma.projectMember.update({
      where: { id: memberId },
      data: {
        role: member.role === "MEMBER" ? "ADMIN" : "MEMBER"
      }
    });

    res.status(200).json(updatedMember)
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'internal server error' })
  }
}
export async function kickMember(req, res) {

    const memberId = Number(req.params.memberId);


  try {

    const member = await prisma.projectMember.delete({
    where: {
        id: memberId
    }
      })

    if (member.role === "OWNER")
    {
      return res.status(403).json("Can't demote the Owner of the project")
    }


    res.status(200).json(member)
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'internal server error' })
  }
}

export async function leaveProject(req, res) {
  const projectId = Number(req.params.id)
  const userId = req.userId

    if(req.membership === "OWNER")
    {
      console.log("cant leave")
      return res.status(403).json({ message: "Owner canno't leave their own project" })
    }

  try {
    await prisma.projectMember.delete({
      where: {
        userId_projectId: {
          userId,
          projectId
        }
      }
    })

    return res.status(200).json({ success: true })

  } catch (err) {
    console.error(err)
    return res.status(500).json({
      success: false,
      message: 'internal server error'
    })
  }
}

export async function deleteProject(req, res) {

  const projectrId = Number(req.params.id);

  try {
     await prisma.project.delete({
      where: {
        id: projectrId
      }
    })

    res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'internal server error' })
  }
}