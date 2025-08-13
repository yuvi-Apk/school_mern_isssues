import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Port from "../Components/link.js";
const StudentSearchPage = () => {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    class: "",
    section: "",
    keyword: "",
  });
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  // Fetch class-section data
  useEffect(() => {
    const fetchClassSectionData = async () => {
      try {
        const response = await fetch(`${Port}/api/classes/with-sections`);
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching class-section data:", error);
      }
    };
    fetchClassSectionData();
  }, []);

  // Update sections when class changes
  useEffect(() => {
    const selectedClass = classes.find((cls) => cls.name === formData.class);
    setSections(selectedClass?.sections || []);
    if (!selectedClass?.sections.includes(formData.section)) {
      setFormData((prev) => ({ ...prev, section: "" }));
    }
  }, [formData.class, classes]);

  // Search students
  const handleSearch = async () => {
    try {
      const res = await fetch(`${Port}/api/students/`);
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Handle row click
  const handleRowClick = (student) => {
    const studentId = student.id || student.admissionNumber || student._id;
    if (studentId) {
      navigate(`/students/${studentId}`);
    } else {
      console.error("No valid student ID found", student);
    }
  };

  return (
    <MainLayout>
      <div className="select-none p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          🎯 Search Students
        </h2>

        {/* Search Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium">Class</label>
            <select
              className="w-full mt-1 p-2 border rounded"
              value={formData.class}
              onChange={(e) =>
                setFormData({ ...formData, class: e.target.value })
              }
            >
              <option value="">Select</option>
              {classes.map((cls) => (
                <option key={cls.name} value={cls.name}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Section</label>
            <select
              className="w-full mt-1 p-2 border rounded"
              value={formData.section}
              onChange={(e) =>
                setFormData({ ...formData, section: e.target.value })
              }
            >
              <option value="">Select</option>
              {sections.map((sec, idx) => (
                <option key={idx} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Search By Keyword
            </label>
            <div className="flex mt-1">
              <input
                type="text"
                placeholder="Student Name"
                className="w-full p-2 border rounded-l"
                value={formData.keyword}
                onChange={(e) =>
                  setFormData({ ...formData, keyword: e.target.value })
                }
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 rounded-r"
              >
                🔍
              </button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto bg-white border rounded-lg shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Admission No</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Class</th>
                <th className="px-4 py-2">Father</th>
                <th className="px-4 py-2">Mother</th>
                <th className="px-4 py-2">DOB</th>
                <th className="px-4 py-2">Gender</th>
                <th className="px-4 py-2">Roll No</th>
                <th className="px-4 py-2">Mobile</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((stu, idx) => (
                  <tr
                    key={idx}
                    className="border-t hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleRowClick(stu)}
                  >
                    <td className="px-4 py-2">{stu.admissionNumber}</td>
                    <td className="px-4 py-2">{stu.studentName}</td>
                    <td className="px-4 py-2">{stu.class}</td>
                    <td className="px-4 py-2">{stu.fatherName}</td>
                    <td className="px-4 py-2">{stu.motherName}</td>
                    <td className="px-4 py-2">{stu.dob}</td>
                    <td className="px-4 py-2">{stu.gender}</td>
                    <td className="px-4 py-2">{stu.rollNo}</td>
                    <td className="px-4 py-2">{stu.mobileNo}</td>
                    <td className="px-4 py-2 text-blue-600 hover:underline">
                      View
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-gray-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentSearchPage;
