import express from 'express';
import { getMessages, createMessage, getMessageInfo, deleteMessage } from '../controllers/message.controller.js';
import { idValidator, validate } from '../middleware/validationMiddleware.js';
import { createMessageSchema } from '../schemas/messageSchemas.js';

const router = express.Router();

router.get('/', getMessages)
router.get('/info/:id', idValidator(['id']), getMessageInfo)
router.post('/create/:id',idValidator(['id']), validate(createMessageSchema), createMessage)
router.delete('/delete/:id',idValidator(['id']), deleteMessage)

export default router