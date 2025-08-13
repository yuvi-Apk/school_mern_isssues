import express from "express";
import pool from "../Config/db.js"; // Your MySQL pool

const router = express.Router();

router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();

    // Total students
    const [[{ totalStudents }]] = await connection.query(
      "SELECT COUNT(*) AS totalStudents FROM students"
    );

    // Total fees collected
    const [[{ totalFeesCollected }]] = await connection.query(
      "SELECT COALESCE(SUM(recd_amt), 0) AS totalFeesCollected FROM fees_register"
    );

    // Dummy attendance
    const totalAttendance = 85; // Later replace with real table

    res.json({
      success: true,
      data: {
        totalStudents,
        totalFeesCollected,
        totalAttendance,
      },
    });
  } catch (error) {
    console.error("❌ Dashboard API Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
