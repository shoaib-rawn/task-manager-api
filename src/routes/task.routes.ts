import { Router } from 'express';
import { getAllTasks } from '../controllers/task.controller.js';

const router = Router();

// Route: GET /api/tasks/
router.get('/', getAllTasks);

export default router;
