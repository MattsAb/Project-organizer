import express from 'express';
import { createAssignment, getAssignments, inviteUser } from '../controllers/assignment.controller.js';

const router = express.Router();

router.post('/create/:id', createAssignment)
router.get('/:id', getAssignments)
router.post('/invite/:id', inviteUser)


export default router