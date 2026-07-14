import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import taskRoutes from './src/routes/task.routes.js';
// Initialize Express App
const app: Application = express();

// Middleware to parse JSON body data
app.use(express.json());



// Task Manager API Routes (Imported from src/routes)
app.use('/api/tasks', taskRoutes);



// CENTRALIZED ERROR HANDLER (Must be the last middleware before app.listen)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error intercepted by Centralized Error Handler:", err.message);

    // Respond with a clean JSON format and a 500 status code
    res.status(500).json({
        error: err.message || "Internal Server Error"
    });
});

// Define the port to listen on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
