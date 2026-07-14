import type { Request, Response, NextFunction } from 'express';

// Centralized Error Handling Middleware
// Notice it has 4 parameters, which tells Express this is an ERROR handler!
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error intercepted by Centralized Error Handler:", err.message);

    // Respond with a clean JSON format and a 500 status code
    res.status(500).json({
        error: err.message || "Internal Server Error"
    });
};
