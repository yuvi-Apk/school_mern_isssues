import express from "express";
import pool from "../Config/db.js";

const router = express.Router();


router.post("/", (req, res) => {
  const data = req.body;
  const sql = `INSERT INTO accounts 
    (name, printAs, accountGroup, openingBalance, drCr, taxNo, address1, address2, city, pincode, state, stateCode, mobile, phone, email, contactPerson, panCard)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  pool.query(sql, [
    data.name, data.printAs, data.group, data.openingBalance, data.drCr, data.taxNo,
    data.address1, data.address2, data.city, data.pincode, data.state, data.stateCode,
    data.mobile, data.phone, data.email, data.contactPerson, data.panCard
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: "Account created successfully", id: result.insertId });
  });
});

// GET ALL ACCOUNTS
router.get("/", (req, res) => {
  const sql = "SELECT * FROM accounts ORDER BY createdAt DESC";
  pool.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json(results);
  });
});
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const sql = `UPDATE accounts SET 
    name=?, printAs=?, accountGroup=?, openingBalance=?, drCr=?, taxNo=?, 
    address1=?, address2=?, city=?, pincode=?, state=?, stateCode=?, 
    mobile=?, phone=?, email=?, contactPerson=?, panCard=? WHERE id=?`;

  pool.query(sql, [
    data.name, data.printAs, data.group, data.openingBalance, data.drCr,
    data.taxNo, data.address1, data.address2, data.city, data.pincode,
    data.state, data.stateCode, data.mobile, data.phone, data.email,
    data.contactPerson, data.panCard, id
  ], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Account updated successfully" });
  });
});
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM accounts WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Account deleted successfully" });
  });
});
export default router;
