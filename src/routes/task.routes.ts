import { Router } from 'express';
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/task.controller.js';
import { validate } from '../middlewares/validate.js';
import { createTaskSchema } from '../validators/task.validator.js';

const router = Router();

// Route: GET /api/tasks/
router.get('/', getTasks);


// Route: POST /api/tasks/
router.post('/', validate(createTaskSchema), createTask);

// Route: GET /api/tasks/:id
router.get('/:id', getTaskById);

// Route: PUT /api/tasks/:id
router.put('/:id', updateTask);

// Route: DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

export default router;
