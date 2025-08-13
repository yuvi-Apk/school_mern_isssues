import express from "express";
import {
  addFeesPlan,
  getStudentByAdmission,
  feesApply,
  addFeesHeading,
  fees_Register,
  getAllFeesRecords,
  getPendingFees,
  updateFeesHeading,
  deleteFeesHeading,
  getAllFeesHeadings,
  updateFeesPlan,
  deleteFeesPlan,
  getAllFeesPlans
} from "../Controller/FeesController.js";

const router = express.Router();
router.post("/record",fees_Register)
router.get("/pending", getPendingFees);
router.delete("/:id",deleteFeesHeading);
// POST API - e.g., body: { "admissionNumber": "A1001" }
// router.post("/pending", getPendingFees);
router.get("/",getAllFeesHeadings)
// POST /api/fees/plan
router.post("/plan", addFeesPlan);
router.put("/plan/:id", updateFeesPlan);    // Update
router.delete("/plan/:id", deleteFeesPlan); // Delete
router.get("/plan", getAllFeesPlans); // GET /api/fees/plan

router.post("/", addFeesHeading);
// POST /api/fees/apply
router.put("/:id",updateFeesHeading)
router.post("/apply", feesApply);
router.get("/record",getAllFeesRecords)
// GET /api/fees/student/:admissionNumber
router.get("/student/:admissionNumber", getStudentByAdmission);

export default router;
