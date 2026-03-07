import {prisma} from '../prismaClient.js';

export async function getMessages(req, res) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        receiverId: req.userId
      },
        orderBy: [
        { isChecked: "asc" },
        { createdAt: "desc" }, 
        ],
      include: {
        sender: {
          select: {
            username: true
          }
        }
      }
    });

    res.status(200).json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'internal server error' });
  }
}

export async function getMessageInfo(req, res) {

 const messageId = req.params.id;

  try {
    await prisma.message.update({
        where: {
            id: messageId
        },
        data: {
            isChecked: true
        }
        
    })

    const message = await prisma.message.findUnique({
      where: {
        id: messageId
      },
      include: {
        sender: {
          select: {
            username: true
          }
        }
      }
    });

    res.status(200).json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'internal server error' });
  }
}

export async function createMessage(req, res) {

    const receiverId = req.params.id;
    const {body, description} = req.body;

    if(receiverId === req.userId)
    {
        return res.status(403).json({success: false, message: "you are not allowed to send messages to yourself"})
    }

    try {
        await prisma.message.create({
        data: {
            receiverId: receiverId,
            senderId: req.userId,
            body: body,
            description: description
        }
        })

    res.status(200).json({success: true})
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'internal server error' })
  }
}

export async function deleteMessage(req, res) {

    const messageId = req.params.id;

    try {
        const message = await prisma.message.findUnique({
            where:{
                id: messageId
            }
        })

        if (message.receiverId !== req.userId)
        {
            return res.status(403).json({message: "you are not the owner of this message"})
        }

        await prisma.message.delete({
            where: {
                id: messageId
            }
        })

    res.status(200).json({success: true})
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'internal server error' })
  }
}
