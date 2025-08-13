import express from "express";

import pool from "../Config/db.js";
const router = express.Router();
// GET all route plans
router.get("/api/route-plans", async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM route_plans;");
    res.json(results);
  } catch (err) {
    console.error("Error fetching route plans:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/api/route-plans", async (req, res) => {
  const { className, categoryName, routeName, price } = req.body;
  if (!className || !categoryName || !routeName || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO route_plans (class_name, category_name, route_name, price) VALUES (?, ?, ?, ?)",
      [className, categoryName, routeName, price]
    );

    res.status(201).json({
      id: result.insertId,
      className,
      categoryName,
      routeName,
      price,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/api/route-plans/:id", async (req, res) => {
  const { id } = req.params;
  const { className, categoryName, routeName, price } = req.body;

  if (!className || !categoryName || !routeName || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE route_plans SET class_name=?, category_name=?, route_name=?, price=? WHERE id=?",
      [className, categoryName, routeName, price, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Route plan not found" });
    }

    res.json({ message: "Route plan updated successfully" });
  } catch (err) {
    console.error("Error updating route plan:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE a route plan
router.delete("/api/route-plans/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM route_plans WHERE id=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Route plan not found" });
    }

    res.json({ message: "Route plan deleted successfully" });
  } catch (err) {
    console.error("Error deleting route plan:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
