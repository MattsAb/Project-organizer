import express from 'express';
import projectAuthMiddleware from '../middleware/projectAuth.js';
import { getInvites, createInvite, processInvite, getNotifications } from '../controllers/Invite.controller.js';
import { idValidator } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', getInvites)
router.get('/notifications', getNotifications)
router.post('/:invitedUserId/create/:projectId', idValidator(['invitedUserId','projectId']), projectAuthMiddleware(["OWNER", "ADMIN"]), createInvite)
router.delete('/:projectId/process/:inviteId',idValidator(['inviteId','projectId']), processInvite)

export default router