import express from "express";
import db from "../Config/db.js"; // your MySQL DB connection

const router = express.Router();

// Create route
router.post("/create", async (req, res) => {
  const { route_name, frequency, months } = req.body;
  
  if (!route_name || !frequency || !months) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Store months as comma-separated string to match your existing structure
    const monthsString = Array.isArray(months) ? months.join(", ") : months;
    
    await db.query(
      "INSERT INTO routes (route_name, frequency, months) VALUES (?, ?, ?)",
      [route_name, frequency, monthsString]
    );
    
    res.status(201).json({ message: "Route created successfully" });
  } catch (err) {
    console.error("Error creating route:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all routes
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM routes");
    
    const routes = rows.map(route => ({
      ...route,
      months: route.months ? route.months.split(", ").map(m => m.trim()) : []
    }));
    
    res.json(routes);
  } catch (err) {
    console.error("Error fetching routes:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update route
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { route_name, frequency, months } = req.body;
  
  if (!route_name || !frequency || !months) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Store months as comma-separated string
    const monthsString = Array.isArray(months) ? months.join(", ") : months;
    
    await db.query(
      "UPDATE routes SET route_name = ?, frequency = ?, months = ? WHERE id = ?",
      [route_name, frequency, monthsString, id]
    );
    
    res.json({ message: "Route updated successfully" });
  } catch (err) {
    console.error("Error updating route:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete route
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    await db.query("DELETE FROM routes WHERE id = ?", [id]);
    res.json({ message: "Route deleted successfully" });
  } catch (err) {
    console.error("Error deleting route:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;