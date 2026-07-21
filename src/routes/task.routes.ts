import { Router } from 'express';
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/task.controller.js';
import { validate } from '../middlewares/validate.js';
import { createTaskSchema } from '../validators/task.validator.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the task
 *         title:
 *           type: string
 *           description: The title of the task
 *         completed:
 *           type: boolean
 *           description: Whether the task is completed
 *         imageUrl:
 *           type: string
 *           description: The URL of the uploaded image
 *       example:
 *         id: "1721539200000"
 *         title: "Master Swagger Documentation"
 *         completed: false
 *         imageUrl: "/uploads/12345.png"
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Retrieve a list of all tasks
 *     description: Fetches all tasks. Supports pagination (?page=1&limit=5) and filtering (?completed=true).
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: A JSON array of tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get('/', getTasks);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     description: Upload a new task. Supports multipart/form-data for image uploads.
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Task successfully created.
 */
router.post('/', upload.single('image'), validate(createTaskSchema), createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a single task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested task.
 *       404:
 *         description: Task not found.
 */
router.get('/:id', getTaskById);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update an existing task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Task successfully updated.
 */
router.put('/:id', upload.single('image'), updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task successfully deleted.
 */
router.delete('/:id', deleteTask);

export default router;
