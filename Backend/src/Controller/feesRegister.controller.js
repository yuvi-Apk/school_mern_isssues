import pool from "../Config/db.js"

// ✅ Get All Fees Receipts
export const getAllFeesReceipts = async (req, res) => {
  try {
    const [rows] = await pool.execute(`SELECT * FROM fees_register ORDER BY date DESC`);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching fees receipts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get Fees Receipts by Admission No.
export const getFeesByAdmission = async (req, res) => {
  const { admissionNumber } = req.params;
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM fees_register WHERE admissionNumber = ? ORDER BY date DESC`,
      [admissionNumber]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "No receipts found for this admission number" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error fetching fees by admission:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get Fees Receipts by Date Range
export const getFeesByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: "startDate and endDate are required" });
  }
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM fees_register WHERE date BETWEEN ? AND ? ORDER BY date ASC`,
      [startDate, endDate]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching fees by date range:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get Summary (Total Fees, Received, Balance)
export const getFeesSummary = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        COALESCE(SUM(fees), 0) AS totalFees,
        COALESCE(SUM(recd_amt), 0) AS totalReceived,
        COALESCE(SUM(balance), 0) AS totalBalance
      FROM fees_register
    `);
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
