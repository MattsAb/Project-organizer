import express from 'express';

import { createProject, getUserProjects, getProjectMembers,
     getUsers, getDashboard, changeRole, kickMember, deleteProject,
      leaveProject, getSearch} from '../controllers/project.controller.js';

import authMiddleware from "../middleware/auth.js"
import  projectAuthMiddleware from '../middleware/projectAuth.js';

const router = express.Router();

router.post('/create', authMiddleware, createProject)

router.get('/userprojects', authMiddleware, getUserProjects)

router.get('/members/:id',authMiddleware,projectAuthMiddleware(["OWNER", "ADMIN", "MEMBER"]), getProjectMembers)

router.get('/users/:id',authMiddleware,projectAuthMiddleware(["OWNER", "ADMIN"]), getUsers);

router.get('/search',authMiddleware, getSearch);

router.get('/', authMiddleware, getDashboard)

router.put("/:projectId/members/:memberId/role", authMiddleware, projectAuthMiddleware(["OWNER", "ADMIN"]), changeRole)

router.delete("/:id/members/:memberId/kick", authMiddleware, projectAuthMiddleware(["OWNER", "ADMIN"]), kickMember)

router.delete("/leave/:id", authMiddleware, projectAuthMiddleware(["OWNER", "ADMIN", "MEMBER"]), leaveProject)

router.delete("/delete/:id", authMiddleware, projectAuthMiddleware(["OWNER"]), deleteProject)

export default router