import express from 'express';
import { createAssignment, getAssignments, getInfo, setProcess, setFinish, deleteAssignment, declineAssignment } from '../controllers/assignment.controller.js';
import  projectAuthMiddleware from '../middleware/projectAuth.js';
import { idValidator, validate } from '../middleware/validationMiddleware.js';
import { createAssignmentSchema } from '../schemas/assignmentSchemas.js';

const router = express.Router();

router.post('/create/:id', idValidator(['id']), validate(createAssignmentSchema), projectAuthMiddleware(["OWNER", "ADMIN"]), createAssignment)
router.get('/:id', idValidator(['id']),projectAuthMiddleware(["OWNER", "ADMIN","MEMBER"]), getAssignments)
router.get('/:projectId/info/:id', idValidator(['id', 'projectId']), projectAuthMiddleware(["OWNER", "ADMIN", 'MEMBER']), getInfo)
router.put('/:projectId/process/:id',idValidator(['id', 'projectId']),projectAuthMiddleware(["OWNER", "ADMIN","MEMBER"]), setProcess)
router.put('/:projectId/finish/:id',idValidator(['id', 'projectId']),projectAuthMiddleware(["OWNER", "ADMIN"]),  setFinish)
router.put('/:projectId/decline/:id',idValidator(['id', 'projectId']),projectAuthMiddleware(["OWNER", "ADMIN"]),  declineAssignment)
router.delete('/:projectId/delete/:id',idValidator(['id', 'projectId']), projectAuthMiddleware(["OWNER", "ADMIN"]), deleteAssignment)


export default router