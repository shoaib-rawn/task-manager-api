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

// 3. Controller to get all tasks
export const getAllTasks = (req: Request, res: Response) => {
    res.status(200).json({
        message: "Successfully fetched all tasks!",
        tasks: tasks
    });
};



export const throwError = (req: Request, res: Response) => {
    res.status(400).json({ message: "Something went wrong!" });
};
