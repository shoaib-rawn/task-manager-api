import type { Request, Response, NextFunction } from 'express';

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

// 3. Controller to get all tasks
export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { completed } = req.query;
        const tasks = await readTasks();
        let filteredTasks = tasks;

        if (completed === "true") filteredTasks = tasks.filter(task => task.completed === true);
        if (completed === "false") filteredTasks = tasks.filter(task => task.completed === false);

        res.status(200).json({ success: true, data: filteredTasks });
    } catch (error) {
        next(error);
    }
};

// 4. Controller to get a single task by ID
export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const tasks = await readTasks();
        const task = tasks.find(t => t.id === id);

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

// 5. Controller to create a new task
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title } = req.body;
        
        if (!title) {
            return res.status(400).json({ success: false, message: "Title is required" });
        }

        const tasks = await readTasks();
        const newTask: Task = {
            id: Date.now().toString(),
            title,
            completed: false
        };

        tasks.push(newTask);
        await writeTasks(tasks);

        res.status(201).json({ success: true, message: "Task created successfully", data: newTask });
    } catch (error) {
        next(error);
    }
};

// 6. Controller to update an existing task
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;
        
        const tasks = await readTasks();
        const task = tasks.find(t => t.id === id);

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        task.title = title !== undefined ? title : task.title;
        task.completed = completed !== undefined ? completed : task.completed;
        
        await writeTasks(tasks);

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

// 7. Controller to delete a task
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        
        const tasks = await readTasks();
        const taskIndex = tasks.findIndex(t => t.id === id);

        if (taskIndex === -1) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        tasks.splice(taskIndex, 1);
        await writeTasks(tasks);
        
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const throwError = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error("Something went wrong!");
    next(error);
};
