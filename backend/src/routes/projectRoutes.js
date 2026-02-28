import express from 'express';
import { createProject, getUserProjects, getProjectMembers, getUsers, getDashboard } from '../controllers/project.controller.js';
import authMiddleware from "../middleware/auth.js"

const router = express.Router();

router.post('/create', authMiddleware, createProject)

router.get('/userprojects', authMiddleware, getUserProjects)

router.get('/members/:id', getProjectMembers)

router.get('/users', getUsers);

router.get('/', authMiddleware, getDashboard)

export default router