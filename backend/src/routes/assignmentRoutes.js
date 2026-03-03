import express from 'express';
import { createAssignment, getAssignments, getInfo, setProcess, setFinish, deleteAssignment, declineAssignment } from '../controllers/assignment.controller.js';
import  projectAuthMiddleware from '../middleware/projectAuth.js';

const router = express.Router();

router.post('/create/:id', projectAuthMiddleware(["OWNER", "ADMIN"]), createAssignment)
router.get('/:id',projectAuthMiddleware(["OWNER", "ADMIN","MEMBER"]), getAssignments)
router.get('/:projectId/info/:id', projectAuthMiddleware(["OWNER", "ADMIN", 'MEMBER']), getInfo)
router.put('/:projectId/process/:id',projectAuthMiddleware(["OWNER", "ADMIN","MEMBER"]), setProcess)
router.put('/:projectId/finish/:id',projectAuthMiddleware(["OWNER", "ADMIN"]),  setFinish)
router.put('/:projectId/decline/:id',projectAuthMiddleware(["OWNER", "ADMIN"]),  declineAssignment)
router.delete('/:projectId/delete/:id', projectAuthMiddleware(["OWNER", "ADMIN"]), deleteAssignment)


export default router