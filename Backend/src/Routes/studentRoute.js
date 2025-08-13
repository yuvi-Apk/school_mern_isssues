import express from "express";
import multer from "multer";
import {
  addStudent,
  getStudents,
  getStudentById,
  getStudentByAdmissionNumber
} from "../Controller/StudentController.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("photo"), addStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);
router.get("/student/:admissionNumber", getStudentByAdmissionNumber);

export default router;
