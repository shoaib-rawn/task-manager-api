import type { Request, Response } from 'express';

// 1. Define what a "Task" looks like
export interface Task {
    id: string;
    title: string;
    completed: boolean;
}

// 2. Mock Database (Array of Tasks)
let tasks: Task[] = [
    { id: "1", title: "Learn Express  setup", completed: true },
    { id: "2", title: "Build Task Manager", completed: false }
];

// 3. Controller to get all tasks (with optional filtering)
export const getAllTasks = (req: Request, res: Response) => {
    const { completed } = req.query;
    
    let filteredTasks = tasks;
    
    if (completed === "true") {
        filteredTasks = tasks.filter(task => task.completed === true);
    } else if (completed === "false") {
        filteredTasks = tasks.filter(task => task.completed === false);
    }
    
    res.status(200).json({
        message: "Successfully fetched tasks!",
        tasks: filteredTasks
    });
};

// 4. Controller to get a single task by ID
export const getTaskById = (req: Request, res: Response) => {
    const { id } = req.params;
    
    const task = tasks.find(t => t.id === id);
    
    if (task) {
        res.status(200).json(task);
    } else {
        res.status(404).json({ message: "Task not found" });
    }
};


export const throwError = (req: Request, res: Response) => {
    res.status(400).json({ message: "Something went wrong!" });
};
