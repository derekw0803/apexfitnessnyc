import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import contact from "./routes/contact";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(cors());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: "Too many requests from this IP, please try again later.",
    },
});
const routeBasePath = "/api/v1";

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(routeBasePath, limiter);

app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/", (_req: Request, res: Response) => {
    res.send("Hello World!");
});

app.use(`${routeBasePath}/contact`, contact);

// 404 handler
app.use("/{*path}", (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`,
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// For local development
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.EXPRESS_PORT || 8081;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/health`);
    });
}