import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import taskRoutes from './src/routes/task.routes.js';
import { requestLogger } from './src/middlewares/logger.middleware.js';
import { errorHandler } from './src/middlewares/error.middleware.js';
// Initialize Express App
const app: Application = express();

// Middleware to parse JSON body data
app.use(express.json());

// Custom Logger Middleware (Runs on every request)
app.use(requestLogger);

// Task Manager API Routes (Imported from src/routes)
app.use('/api/tasks', taskRoutes);



// CENTRALIZED ERROR HANDLER (Must be the last middleware before app.listen)
app.use(errorHandler);
// Define the port to listen on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
