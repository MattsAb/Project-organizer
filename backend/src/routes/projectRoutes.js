import express from 'express';
import { createProject, getUserProjects, getProjectMembers,
     getUsers, getDashboard, changeRole, kickMember, deleteProject,
      leaveProject, getSearch} from '../controllers/project.controller.js';

import authMiddleware from "../middleware/auth.js"
import  projectAuthMiddleware from '../middleware/projectAuth.js';
import { idValidator, validate } from '../middleware/validationMiddleware.js';
import { createProjectSchema } from '../schemas/projectSchemas.js';

const router = express.Router();

router.post('/create', validate(createProjectSchema), authMiddleware, createProject)

router.get('/userprojects', authMiddleware, getUserProjects)

router.get('/members/:id', idValidator(["id"]) ,authMiddleware,projectAuthMiddleware(["OWNER", "ADMIN", "MEMBER"]), getProjectMembers)

router.get('/users/:id', idValidator(["id"]),authMiddleware,projectAuthMiddleware(["OWNER", "ADMIN"]), getUsers);

router.get('/search',authMiddleware, getSearch);

router.get('/', authMiddleware, getDashboard)

router.put("/:id/members/:memberId/role", idValidator(["id","memberId"]), authMiddleware, projectAuthMiddleware(["OWNER", "ADMIN"]), changeRole)

router.delete("/:id/members/:memberId/kick" , idValidator(["id","memberId"]), authMiddleware, projectAuthMiddleware(["OWNER", "ADMIN"]), kickMember)

router.delete("/leave/:id",idValidator(["id"]), authMiddleware, projectAuthMiddleware(["OWNER", "ADMIN", "MEMBER"]), leaveProject)

router.delete("/delete/:id",idValidator(["id"]), authMiddleware, projectAuthMiddleware(["OWNER"]), deleteProject)

export default router