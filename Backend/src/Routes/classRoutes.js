import express from "express";
import {
  addClass,
  getClassesWithSections,
  addSection,
} from "../Controller/classController.js";

const router = express.Router();

router.post("/", addClass);
router.get("/with-sections", getClassesWithSections);
router.post("/addSection", addSection);

export default router;
