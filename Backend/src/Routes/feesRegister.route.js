import express from "express";
import { 
  getAllFeesReceipts, 
  getFeesByAdmission, 
  getFeesByDateRange, 
  getFeesSummary 
} from "../Controller/feesRegister.controller.js";

const router = express.Router();

// ✅ Get all receipts
router.get("/", getAllFeesReceipts);

// ✅ Get receipts by admission number
router.get("/:admissionNumber", getFeesByAdmission);

// ✅ Get receipts by date range (query params)
router.get("/filter/date", getFeesByDateRange);

// ✅ Get summary (total fees stats)
router.get("/summary", getFeesSummary);

export default router;
