import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Port from "../Components/link.js"
const StudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  
  
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`${Port}/api/students/${id}`);
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error("Failed to fetch student", err);
      }
    };

    fetchStudent();
  }, [id]);

  if (!student) {
    return (
      <div className="text-center py-10 text-gray-600 text-lg">
        Loading student profile...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
     <MainLayout>
        <div className="select-none max-w-7xl mx-auto p-6">
          <div className="select-none grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sidebar Card */}
            <div className="bg-white shadow rounded-2xl p-6 text-center">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3R1ZGVudCUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
                alt="Profile"
                className="w-24 h-24 mx-auto rounded-full mb-4 border-4 border-blue-100"
              />
              <h2 className="select-none text-xl font-semibold text-gray-800 mb-2">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-sm text-gray-500">
                Admission No:{" "}
                <span className="font-medium text-gray-700">{student.id}</span>
              </p>
              <p className="text-sm text-gray-500">
                Roll No:{" "}
                <span className="font-medium text-gray-700">
                  {student.rollNo}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Class: {student.class} ({student.academicYear})
              </p>
              <p className="text-sm text-gray-500">
                Section: {student.section}
              </p>
              <p className="text-sm text-gray-500">Gender: {student.gender}</p>
            </div>

            {/* Profile Info */}
            <div className="md:col-span-2 bg-white shadow rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
                Student Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
                <p>
                  <span className="font-medium">Admission Date:</span>{" "}
                  {student.admissionDate}
                </p>
                <p>
                  <span className="font-medium">Date of Birth:</span>{" "}
                  {student.dob}
                </p>
                <p>
                  <span className="font-medium">Mobile Number:</span>{" "}
                  {student.fatherPhoneNumber}
                </p>
                <p>
                  <span className="font-medium">Category:</span>{" "}
                  {student.category}
                </p>
                <p>
                  <span className="font-medium">Caste:</span> {student.caste}
                </p>
                <p>
                  <span className="font-medium">Religion:</span>{" "}
                  {student.religion}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {student.email}
                </p>
              </div>

              <h4 className="text-lg font-semibold mt-6 mb-2 text-gray-800">
                Address
              </h4>
              <p className="text-gray-700">
                <span className="font-medium">Current Address:</span>{" "}
                {student.currentAddress}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Permanent Address:</span>{" "}
                {student.permanentAddress}
              </p>

              <h4 className="text-lg font-semibold mt-6 mb-2 text-gray-800">
                Parent / Guardian
              </h4>
              <p className="text-gray-700">
                <span className="font-medium">Father Name:</span>{" "}
                {student.fatherName}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Father Phone:</span>{" "}
                {student.fatherPhoneNumber}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Father Occupation:</span>{" "}
                {student.fatherOccupation}
              </p>
            </div>
          </div>
        </div>
        </MainLayout>
      </div>
    
  );
};

export default StudentProfile;
