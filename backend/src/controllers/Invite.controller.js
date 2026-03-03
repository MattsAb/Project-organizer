import {prisma} from '../prismaClient.js';

export async function getInvites(req, res) {

  try {
    const invites = await prisma.projectInvite.findMany({
      where: {
        invitedUserId: req.userId
      },
      include: {
        invitedBy: {
          select: {
            username: true
          }
        },
        project: {
          select: {
            title: true
          }
        }
      }
    })

    res.status(200).json({invites})
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'internal server error' })
  }
}

export async function getNotifications(req, res) {

  try {
        const inviteCount = await prisma.projectInvite.count({
        where: {
            invitedUserId: req.userId
        }
        });

        const messageCount = await prisma.message.count({
        where: {
            receiverId: req.userId
        }
        });
    res.status(200).json({invites: inviteCount, messages: messageCount})
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'internal server error' })
  }
}

export async function createInvite(req, res) {

    const invitedUserId = Number(req.params.invitedUserId)
    const projectId = Number(req.params.projectId)

    if(invitedUserId === req.userId)
    {
        return res.status(403).json({success: false, message: "you are not allowed to invite yourself"})
    }

    try {
        const invite = await prisma.projectInvite.create({
        data: {
            invitedUserId: invitedUserId,
            invitedById: req.userId,
            projectId: projectId
        }
        })

        console.log('created an invite')
    res.status(200).json({invite})
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'internal server error' })
  }
}

export async function processInvite(req, res) {

    const inviteId = Number(req.params.inviteId)
    const projectId = Number(req.params.projectId)

    const process = req.query.process

    try {
        if (process === 'ACCEPTED')
        {
            const member = await prisma.projectMember.create({
            data: {
                userId: req.userId,
                projectId: projectId,
                }
            })
        }

        const invite = await prisma.projectInvite.delete({
            where: {
                id: inviteId
            }
        })


    res.status(200).json({success: true})
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'internal server error' })
  }
}
