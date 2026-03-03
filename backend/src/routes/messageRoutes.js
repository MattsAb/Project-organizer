import express from 'express';
import { getMessages, createMessage, getMessageInfo, deleteMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/', getMessages)
router.get('/info/:id', getMessageInfo)
router.post('/create/:id', createMessage)
router.delete('/delete/:id', deleteMessage)

export default router