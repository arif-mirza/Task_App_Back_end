import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use( cors({
    origin: [
      "http://localhost:5173",
       "https://task-app-front-end-one.vercel.app", 
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
  }));

console.log("Main Server - Environment Variables Check:");
console.log("PORT:", process.env.PORT);
console.log("DB_URL exists:", !!process.env.MONGO_URI);

// Database connection
try {
  connectDB();
  console.log("Database connection successful");
} catch (error) {
  console.error("Database connection failed:", error.message);
  process.exit(1);
}

// app.get("/", (req, res) => {
//   res.send("task app is running...");
// });
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
