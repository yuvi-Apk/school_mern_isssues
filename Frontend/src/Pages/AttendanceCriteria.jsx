import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

const AttendanceCriteria = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [date, setDate] = useState("2025-06-24");
  const [submitStatus, setSubmitStatus] = useState(null);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const handleSearch = () => {
    if (!selectedClass || !selectedSection || !date) {
      setSubmitStatus("error");
      setError("Please fill all fields before searching.");
    } else {
      setSubmitStatus("success");
      setError("");
    }
  };

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const handleAddClass = () => {
    navigate("/class-manager");
  };

  const handleAddSection = () => {
    navigate("/section-manager");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <MainLayout>
        <main className="p-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-700 mb-6">
              Attendance Criteria
            </h1>

            {submitStatus === "success" && (
              <div className="mb-4 p-4 rounded bg-green-100 text-green-700 border border-green-300">
                Student attendance data fetched successfully!
              </div>
            )}
            {submitStatus === "error" && (
              <div className="mb-4 p-4 rounded bg-red-100 text-red-700 border border-red-300">
                {error}
              </div>
            )}

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Select Criteria
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Class*
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select</option>
                    <option value="TEN">TEN</option>
                    <option value="NINE">NINE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Section*
                  </label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date*
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Search
                </button>
                <button
                  onClick={handleAddClass}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Add Class
                </button>
                <button
                  onClick={handleAddSection}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Add Section
                </button>
              </div>
            </div>
          </div>
        </main>
      </MainLayout>
    </div>
  );
};

export default AttendanceCriteria;
