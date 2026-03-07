import express from 'express';
import { registerUser, loginUser, checkAuth } from '../controllers/user.controller.js';
import authMiddleware from "../middleware/auth.js"
import { validate } from '../middleware/validationMiddleware.js';
import { loginUserSchema, registerUserSchema } from '../schemas/userSchemas.js';

const router = express.Router();

router.post('/register', validate(registerUserSchema), registerUser)

router.post('/login', validate(loginUserSchema), loginUser)

router.get('/me', authMiddleware, checkAuth)

export default router