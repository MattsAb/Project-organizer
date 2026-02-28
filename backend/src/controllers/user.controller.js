import {prisma} from '../prismaClient.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function loginUser (req, res)  {

    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'username and password required' })
    }

        try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if (!user) { return res.status(404).send({ message: "User not found" }) }

        const passwordIsValid = bcrypt.compareSync(password, user.password)

        if (!passwordIsValid) { return res.status(401).send({ message: "Invalid password" }) }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.status(200).json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
}

export async function registerUser (req, res) {

    const { username, password, email } = req.body

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'all fields are required' })
    }
    try {
        const hashedPassword = await bcrypt.hashSync(password, 8)
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        })

        if (!user || !user.username) {
        return res.status(400).json({ message: 'invalid user data' })
        }
        
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})
        res.status(200).json({token})
    } catch (err)
    {
        res.status(500).json({ message: 'internal server error' })
    }

}

export async function checkAuth (req, res) {
    try {
            const user = await prisma.user.findUnique({
            where: {
                id: req.userId
            }
        })

        res.status(200).json({id: req.userId,username: user.username})


    } catch (err) {
        console.error(err)
        res.status(500).json({success: false, msg: 'internal server error'})
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