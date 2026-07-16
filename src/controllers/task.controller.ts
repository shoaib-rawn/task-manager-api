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


// 5. Controller to create a new task
export const createTask = (req: Request, res: Response) => {
    const { title } = req.body;
    
    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }
    
    const newTask: Task = {
        id: Date.now().toString(),
        title,
        completed: false
    };
    
    tasks.push(newTask);
    res.status(201).json(newTask);
};

// 6. Controller to update an existing task
export const updateTask = (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }
    
    task.title = title !== undefined ? title : task.title;
    task.completed = completed !== undefined ? completed : task.completed;
    
    res.json(task);
};

// 7. Controller to delete a task
export const deleteTask = (req: Request, res: Response) => {
    const { id } = req.params;
    
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
        return res.status(404).json({ message: "Task not found" });
    }
    
    tasks.splice(taskIndex, 1);
    res.json({ message: "Task deleted successfully" });
};

export const throwError = (req: Request, res: Response) => {
    res.status(400).json({ message: "Something went wrong!" });
};
