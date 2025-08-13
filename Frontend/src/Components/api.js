// src/api.js
import axios from "axios";

const API_BASE = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Endpoints used by FeesReceipt
export const getStudentByAdmission = (admissionNumber) =>
  api.get(`/students/student/${admissionNumber}`);

export const getPendingFees = (admissionNumber) =>
  api.get("/fees/pending", { params: { admissionNumber } });

export const searchStudents = (params) =>
  api.get("/students", { params });

export const applyFees = (payload) => api.post("/fees/apply", payload);

export default api;
