import React, { useState } from "react";
import MainLayout from "../layout/MainLayout";
import Port from "../Components/link.js"
const ClassManager = () => {
  const availableSections = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const [className, setClassName] = useState("");
  const [selectedSections, setSelectedSections] = useState([]);
  const [classes, setClasses] = useState([]);

  const toggleSection = (section) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const addClass = async () => {
    if (!className || selectedSections.length === 0) {
      alert("Please enter a class name and select at least one section.");
      return;
    }

    try {
      const response = await fetch(`${Port}/api/classes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: className,
          sections: selectedSections,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setClasses([
          ...classes,
          { name: className, sections: selectedSections },
        ]);
        setClassName("");
        setSelectedSections([]);
        alert("✅ Class and sections saved!");
      } else {
        alert("❌ " + (data?.error || data?.message || "Server Error"));
      }
    } catch (err) {
      alert("❌ Network error: " + err.message);
    }
  };

  return (
    <MainLayout>
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Class Manager</h2>

      <div className="bg-white shadow p-4 rounded mb-6">
        <input
          type="text"
          placeholder="Enter class name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />

        <div className="mb-4">
          <label className="block font-semibold mb-1">Select Sections:</label>
          <div className="flex flex-wrap gap-4">
            {availableSections.map((sec) => (
              <label key={sec} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedSections.includes(sec)}
                  onChange={() => toggleSection(sec)}
                />
                <span>{sec}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={addClass}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Class
        </button>
      </div>

      <div className="bg-white shadow p-4 rounded">
        <h3 className="text-lg font-semibold mb-3">Class List</h3>
        <ul>
          {classes.map((cls, i) => (
            <li key={i} className="mb-2">
              <strong>{cls.name}</strong> — Sections: {cls.sections.join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </div>
    </MainLayout>
  );
};

export default ClassManager;
