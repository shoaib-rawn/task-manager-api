import { Router } from 'express';
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/task.controller.js';

const router = Router();

// Route: GET /api/tasks/
router.get('/', getAllTasks);

// Route: POST /api/tasks/
router.post('/', createTask);

// Route: GET /api/tasks/:id
router.get('/:id', getTaskById);

// Route: PUT /api/tasks/:id
router.put('/:id', updateTask);

// Route: DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

export default router;
