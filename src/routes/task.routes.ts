import { Router } from 'express';
import { getAllTasks, getTaskById } from '../controllers/task.controller.js';

const router = Router();

// Route: GET /api/tasks/
router.get('/', getAllTasks);

// Route: GET /api/tasks/:id
router.get('/:id', getTaskById);

export default router;
