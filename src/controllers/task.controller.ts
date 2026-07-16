import type { Request, Response } from 'express';

import fs from 'fs/promises';
import path from 'path';

// Define the absolute path to our mock database file
const dataFilePath = path.resolve('src/data/tasks.json');

// 1. Define what a "Task" looks like
export interface Task {
    id: string;
    title: string;
    completed: boolean;
}

// --- File System Helper Functions ---
const readTasks = async (): Promise<Task[]> => {
    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is empty, return empty array
        return [];
    }
};

const writeTasks = async (tasks: Task[]): Promise<void> => {
    const jsonText = JSON.stringify(tasks, null, 2);
    await fs.writeFile(dataFilePath, jsonText, 'utf-8');
};

// --- HTTP Helper Functions ---
const sendSuccess = (res: Response, data?: any, message?: string, statusCode = 200) => {
    res.status(statusCode).json({ success: true, message, data });
};

const sendError = (res: Response, message: string, statusCode = 400) => {
    res.status(statusCode).json({ success: false, message });
};

// 3. Controller to get all tasks
export const getAllTasks = async (req: Request, res: Response) => {
    const { completed } = req.query;
    const tasks = await readTasks();
    let filteredTasks = tasks;

    if (completed === "true") filteredTasks = tasks.filter(task => task.completed === true);
    if (completed === "false") filteredTasks = tasks.filter(task => task.completed === false);

    sendSuccess(res, filteredTasks);
};

// 4. Controller to get a single task by ID
export const getTaskById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const tasks = await readTasks();
    const task = tasks.find(t => t.id === id);

    if (!task) return sendError(res, "Task not found", 404);

    sendSuccess(res, task);
};

// 5. Controller to create a new task
export const createTask = async (req: Request, res: Response) => {
    const { title } = req.body;
    if (!title) return sendError(res, "Title is required", 400);

    const tasks = await readTasks();
    const newTask: Task = {
        id: Date.now().toString(),
        title,
        completed: false
    };

    tasks.push(newTask);
    await writeTasks(tasks);

    sendSuccess(res, newTask, "Task created successfully", 201);
};

// 6. Controller to update an existing task
export const updateTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    
    const tasks = await readTasks();
    const task = tasks.find(t => t.id === id);

    if (!task) return sendError(res, "Task not found", 404);

    task.title = title !== undefined ? title : task.title;
    task.completed = completed !== undefined ? completed : task.completed;
    
    await writeTasks(tasks);

    sendSuccess(res, task);
};

// 7. Controller to delete a task
export const deleteTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) return sendError(res, "Task not found", 404);

    tasks.splice(taskIndex, 1);
    await writeTasks(tasks);
    
    sendSuccess(res, null, "Task deleted successfully");
};

export const throwError = (req: Request, res: Response) => {
    sendError(res, "Something went wrong!");
};
