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
            receiverId: req.userId,
            isChecked: false
        }
        });
    res.status(200).json({invites: inviteCount, messages: messageCount})
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'internal server error' })
  }
}

export async function createInvite(req, res) {

    const invitedUserId = req.params.invitedUserId;
    const projectId = req.params.projectId;

    if(invitedUserId === req.userId)
    {
        return res.status(403).json({success: false, message: "you are not allowed to invite yourself"})
    }

    try {
        await prisma.projectInvite.create({
        data: {
            invitedUserId: invitedUserId,
            invitedById: req.userId,
            projectId: projectId
        }
        })

    res.status(200).json({success: true})
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'internal server error' })
  }
}

export async function processInvite(req, res) {

    const inviteId = req.params.inviteId;
    const projectId = req.params.projectId;

    const process = req.query.process

    try {
        if (process === 'ACCEPTED')
        {
          await prisma.projectMember.create({
            data: {
                userId: req.userId,
                projectId: projectId,
                }
            })
        }

        await prisma.projectInvite.delete({
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
