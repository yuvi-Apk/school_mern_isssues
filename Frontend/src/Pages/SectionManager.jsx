import React, { useState } from "react";
import MainLayout from "../layout/MainLayout";
const SectionManager = () => {
  const [sections, setSections] = useState(["A", "B", "C", "JAC", "CBSE"]);
  const [newSection, setNewSection] = useState("");
  
  const addSection = () => {
    const section = newSection.trim();
    if (section && !sections.includes(section)) {
      setSections([...sections, section]);
      setNewSection("");
    }
  };

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <MainLayout>
        <main className="p-6">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">
            Manage Sections
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Add Section */}
            <div className="bg-white p-4 shadow rounded">
              <h3 className="text-lg font-bold mb-4">Add Section</h3>
              <input
                type="text"
                placeholder="Section Name"
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3"
              />
              <button
                onClick={addSection}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>

            {/* Section List */}
            <div className="bg-white p-4 shadow rounded">
              <h3 className="text-lg font-bold mb-4">Section List</h3>
              <ul>
                {sections.map((sec, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <span>{sec}</span>
                    <button className="text-red-500 text-sm">✕</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </MainLayout>
    </div>
  );
};

export default SectionManager;
