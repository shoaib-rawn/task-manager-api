import type { Request, Response } from 'express';

// 1. Define what a "Task" looks like
export interface Task {
    id: string;
    title: string;
    completed: boolean;
}

// 2. Mock Database (Array of Tasks)
let tasks: Task[] = [
    { id: "1", title: "Learn Express setup", completed: true },
    { id: "2", title: "Build Task Manager API", completed: false }
];

// --- Helper Functions for Clean JSON Responses ---
const sendSuccess = (res: Response, data?: any, message?: string, statusCode = 200) => {
    res.status(statusCode).json({ success: true, message, data });
};

const sendError = (res: Response, message: string, statusCode = 400) => {
    res.status(statusCode).json({ success: false, message });
};
// -----------------------------------------------

// 3. Controller to get all tasks (with optional filtering)
export const getAllTasks = (req: Request, res: Response) => {
    const { completed } = req.query;
    let filteredTasks = tasks;
    
    if (completed === "true") filteredTasks = tasks.filter(task => task.completed === true);
    if (completed === "false") filteredTasks = tasks.filter(task => task.completed === false);
    
    sendSuccess(res, filteredTasks);
};

// 4. Controller to get a single task by ID
export const getTaskById = (req: Request, res: Response) => {
    const task = tasks.find(t => t.id === req.params.id);
    
    if (!task) return sendError(res, "Task not found", 404);
    
    sendSuccess(res, task);
};

// 5. Controller to create a new task
export const createTask = (req: Request, res: Response) => {
    const { title } = req.body;
    
    if (!title) return sendError(res, "Title is required", 400);
    
    const newTask: Task = { id: Date.now().toString(), title, completed: false };
    tasks.push(newTask);
    
    sendSuccess(res, newTask, "Task created successfully", 201);
};

// 6. Controller to update an existing task
export const updateTask = (req: Request, res: Response) => {
    const { title, completed } = req.body;
    const task = tasks.find(t => t.id === req.params.id);
    
    if (!task) return sendError(res, "Task not found", 404);
    
    task.title = title !== undefined ? title : task.title;
    task.completed = completed !== undefined ? completed : task.completed;
    
    sendSuccess(res, task);
};

// 7. Controller to delete a task
export const deleteTask = (req: Request, res: Response) => {
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    
    if (taskIndex === -1) return sendError(res, "Task not found", 404);
    
    tasks.splice(taskIndex, 1);
    sendSuccess(res, null, "Task deleted successfully");
};

export const throwError = (req: Request, res: Response) => {
    sendError(res, "Something went wrong!");
};
