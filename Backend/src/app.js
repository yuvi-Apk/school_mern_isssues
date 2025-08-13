 import express from "express";
 import cors from "cors";
 import path from "path";
 import fs from "fs";
 import dotenv from "dotenv";
 import { fileURLToPath } from "url";
 import "./Config/db.js";
  dotenv.config();
  // Routes
 import dashboardRoutes from "./Routes/TotalAmount.js";
 import routesFeesApply from "./Routes/RoutesFeesApply.js";
 import transferRoutes from "./Routes/TransferRoutes.js";
 import studentRoutes from "./Routes/studentRoute.js";
 import classRoutes from "./Routes/classRoutes.js";
 import feesRoutes from "./Routes/feesRoutes.js";
 import createAccountRoutes from "./Routes/accountRoutes.js";
import feesRegister from './Routes/feesRegister.route.js'
 const __filename = fileURLToPath(import.meta.url);
 const __dirname = path.dirname(__filename);
const port=3000;

 const app = express();





  // Create uploads folder
 const uploadDir = path.join(__dirname, "uploads");
 if (!fs.existsSync(uploadDir)) {
   fs.mkdirSync(uploadDir, { recursive: true });
   console.log("📁 'uploads' folder created.");
 }

  // Middleware
 app.use(cors());
 app.use(express.json());
 app.use("/uploads", express.static(uploadDir));

  // Request logger
 app.use((req, res, next) => {
   console.log(`[${new Date().toISOString()}] ${req.method} -> ${req.originalUrl}`);
   next();
 });


 app.use("/api/fees", feesRoutes);
 app.use("/api/students", studentRoutes);
 app.use("/api/classes", classRoutes);
 app.use("/api/accounts", createAccountRoutes);
 app.use("/applyRouter", routesFeesApply);
 app.use("/routes", transferRoutes);
 app.use("/api/dashboard", dashboardRoutes);
app.use("/api/fees",feesRegister)
  // Test route
 app.get("/test", (req, res) => {
   res.send("✅ Test route working");
 });

  // Root route
 app.get("/", (_, res) => {
   res.send(`
     <h1>👋 Welcome to School Management System API</h1>
     <p>Server is running! Try accessing <a href="/test">/test</a></p>
   `);
 });


  // 404 handler
 app.use((req, res) => {
   res.status(404).json({ error: "❌ Route not found" });
 });

  // Error handler
 app.use((err, req, res, next) => {
   console.error("🚨 Server Error:", err.stack);
   res.status(500).json({ error: "Internal Server Error" });
 });

 app.listen(port, () => {
   console.log(`🚀 Server running at http:localhost:${port}`);
 });

