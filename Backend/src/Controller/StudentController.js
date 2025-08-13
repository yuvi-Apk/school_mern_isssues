import express from "express";

import pool from "../Config/db.js";
import { cleanupFiles } from "../utils/fileUtils.js";
import upload from "../Config/multer.js";
import path from "path";
import fs from "fs/promises"; // ✅ Use fs.promises for async/await



// ✅ Search Students by multiple fields







export const getStudentByAdmissionNumber = async (req, res) => {
  const { admissionNumber } = req.params;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT * FROM students WHERE admissionNumber = ?`,
      [admissionNumber]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    
    const student = rows[0];

    // Fallback: all months
    const allMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Student's available months (or fallback to all)
    const studentMonths = student.months
      ? student.months.split(",").map((m) => m.trim())
      : allMonths;

    res.status(200).json({
      success: true,
      student,
      months: studentMonths,
    });
  } catch (err) {
    console.error("Error fetching student:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};


export const addStudent = async (req, res) => {
  const data = req.body;
  const file = req.file;

  const requiredFields = [
    "admissionNumber",
    "firstName",
    "lastName",
    "dob",
    "class",
    "section",
    "fatherName",
    "fatherPhoneNumber"
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      return res.status(400).json({
        success: false,
        message: `Missing required field: ${field}`
      });
    }
  }

  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // ✅ Check duplicate admission number
    const [existingStudent] = await connection.query(
      "SELECT admissionNumber FROM students WHERE admissionNumber = ?",
      [data.admissionNumber]
    );

    if (existingStudent.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: "Admission number already exists."
      });
    }

    // ✅ Handle file upload (optional)
    let studentPhoto = null;
    if (file) {
      const ext = path.extname(file.originalname);
      const fileName = `${data.admissionNumber}${ext}`;
      const uploadDir = path.join(process.cwd(), "uploads");

      // Ensure uploads folder exists
      await fs.mkdir(uploadDir, { recursive: true });

      const uploadPath = path.join(uploadDir, fileName);
      await fs.writeFile(uploadPath, file.buffer);
      studentPhoto = `uploads/${fileName}`;
    }

    // ✅ Generate default months dynamically (Apr to Mar)
    const months = [
      "Apr", "May", "Jun", "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"
    ].join(",");

    // ✅ Insert student
    const query = `
      INSERT INTO students (
        admissionNumber, firstName, lastName, middleName, dob, class, section, routeName, email,
        bloodGroup, gender, height, weight, category, religion, caste,
        fatherName, fatherPhoneNumber, fatherOccupation, fatherQualification, fatherAdharNo, fatherImage,
        motherName, motherPhoneNumber, motherOccupation, motherAdharNo, motherImage,
        documents, admissionDate, rollNo, currentAddress, permanentAddress, months
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.admissionNumber,
      data.firstName,
      data.lastName,
      data.middleName || null,
      data.dob,
      data.class,
      data.section,
      data.routeName || null,
      data.email || null,
      data.bloodGroup || null,
      data.gender || null,
      data.height || null,
      data.weight || null,
      data.category || null,
      data.religion || null,
      data.caste || null,
      data.fatherName,
      data.fatherPhoneNumber,
      data.fatherOccupation || null,
      data.fatherQualification || null,
      data.fatherAdharNo || null,
      data.fatherImage || studentPhoto,
      data.motherName || null,
      data.motherPhoneNumber || null,
      data.motherOccupation || null,
      data.motherAdharNo || null,
      data.motherImage || null,
      data.documents ? JSON.stringify(data.documents) : null,
      data.admissionDate || new Date().toISOString().split("T")[0],
      data.rollNo || null,
      data.currentAddress || null,
      data.permanentAddress || null,
      months
    ];

    await connection.query(query, values);
    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Student added successfully. Fees and months will be auto-generated."
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Insert error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add student.",
      error: error.message
    });
  } finally {
    if (connection) connection.release();
  }
};




export const getStudents = async (req, res) => {
  // Example Node.js backend for OR logic

  const { name, className, section, routeName } = req.query;

  let conditions = [];
  let values = [];

  if (name) {
    conditions.push("CONCAT(firstName, ' ', lastName) LIKE ?");
    values.push(`%${name}%`);
  }
  if (className) {
    conditions.push("class = ?");
    values.push(className);
  }
  if (section) {
    conditions.push("section = ?");
    values.push(section);
  }
  if (routeName) {
    conditions.push("routeName = ?");
    values.push(routeName);
  }

  if (conditions.length === 0) {
    return res.status(400).json({ error: "No search parameters provided" });
  }

  const sql = `SELECT * FROM students WHERE ${conditions.join(" OR ")}`;
  const [rows] = await pool.execute(sql, values);
  res.json(rows);

};

export const getStudentById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

function formatStudent(student) {
  return {
    admissionNumber: student.id || "—",
    studentName: [student.firstName, student.middleName, student.lastName]
      .filter(Boolean)
      .join(" "),
    class: student.class,
    section: student.section,
    fatherName: student.fatherName,
    motherName: student.motherName,
    dob: student.dob,
    gender: student.gender,
    rollNo: student.rollNo,
    mobileNo: student.mobileNo,
  };
}
