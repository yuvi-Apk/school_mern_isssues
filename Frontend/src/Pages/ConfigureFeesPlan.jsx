import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";
import MainLayout from "../layout/MainLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Port from "../Components/link.js";
import Select from "react-select";

const ConfigureFeesPlan = () => {
  const [feeHeadings, setFeeHeadings] = useState([]);
  const [feesHeading, setFeesHeading] = useState("");
  const [feesValue, setFeesValue] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [classList, setClassList] = useState([...classList]); // Your existing class list
  const [categoryList, setCategoryList] = useState([...categoryList]); // Your existing category list
  const [loading, setLoading] = useState(false); // Loading state for API calls

  useEffect(() => {
    const fetchFeeHeadings = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${Port}/api/fees`);
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          setFeeHeadings(res.data.data);
          if (res.data.data.length > 0) {
            setFeesHeading(res.data.data[0]);
          }
        } else {
          toast.error("❌ Invalid data format received from server");
        }
      } catch (err) {
        console.error("Error fetching fees:", err);
        toast.error("❌ Error fetching fee headings");
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeeHeadings();
  }, []);

  const addNewClass = useCallback(() => {
    const trimmedName = newClassName.trim();
    if (trimmedName && !classList.some(cls => cls.value === trimmedName)) {
      setClassList([...classList, { value: trimmedName, label: trimmedName }]);
      setNewClassName("");
    }
  }, [newClassName, classList]);

  const addNewCategory = useCallback(() => {
    const trimmedCategory = newCategory.trim();
    if (trimmedCategory && !categoryList.some(cat => cat.value === trimmedCategory)) {
      setCategoryList([...categoryList, { value: trimmedCategory, label: trimmedCategory }]);
      setNewCategory("");
    }
  }, [newCategory, categoryList]);

  const deleteClass = useCallback((classValue) => {
    if (window.confirm(`Are you sure you want to delete "${classValue}"?`)) {
      setClassList(classList.filter((cls) => cls.value !== classValue));
      setSelectedClasses(selectedClasses.filter((cls) => cls.value !== classValue));
    }
  }, [classList, selectedClasses]);

  const deleteCategory = useCallback((categoryValue) => {
    if (window.confirm(`Are you sure you want to delete "${categoryValue}"?`)) {
      setCategoryList(categoryList.filter((cat) => cat.value !== categoryValue));
      setSelectedCategories(selectedCategories.filter((cat) => cat.value !== categoryValue));
    }
  }, [categoryList, selectedCategories]);

  const handleUpdate = async () => {
    const classValues = selectedClasses.map(cls => cls.value);
    const categoryValues = selectedCategories.map(cat => cat.value);

    if (!feesHeading || !feesValue || classValues.length === 0 || categoryValues.length === 0) {
      toast.error("❌ Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${Port}/api/fees/plan`, {
        feesHeading,
        value: feesValue,
        classes: classValues,
        categories: categoryValues,
      });

      if (response.data?.success) {
        const newRows = classValues.flatMap(cls => 
          categoryValues.map(cat => ({
            className: cls,
            category: cat,
            feesName: feesHeading,
            value: feesValue,
          }))
        );
        setTableData((prev) => [...prev, ...newRows]);

        // Reset form fields
        setFeesValue("");
        setSelectedClasses([]);
        setSelectedCategories([]);
        setNewClassName("");
        setNewCategory("");

        toast.success("✅ Fee plan saved successfully");
      } else {
        toast.error("❌ Failed to save fee plan");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("❌ Server error while saving fee plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <MainLayout>
        <ToastContainer position="top-right" autoClose={3000} />
        <main className="p-6 w-full">
          <h2 className="text-2xl font-bold mb-4 text-cyan-700">
            Configure Fees Plan
          </h2>

          <div className="flex gap-4 mb-4">
            <select
              value={feesHeading}
              onChange={(e) => setFeesHeading(e.target.value)}
              className="border p-2 w-1/2"
              required
            >
              {loading ? (
                <option value="">Loading fee headings...</option>
              ) : (
                <>
                  <option value="">Select a Fee Heading</option>
                  {feeHeadings.map((fee, idx) => (
                    <option key={idx} value={fee}>
                      {fee}
                    </option>
                  ))}
                </>
              )}
            </select>

            <input
              type="number"
              value={feesValue}
              onChange={(e) => setFeesValue(e.target.value)}
              className="border p-2 w-1/2"
              placeholder="Fees Value"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Class Section */}
            <div className="bg-white border rounded p-4">
              <h3 className="font-semibold text-blue-600 mb-2">
                Choose Classes
              </h3>
              <div className="mb-2">
                <Select
                  isMulti
                  options={classList}
                  value={selectedClasses}
                  onChange={setSelectedClasses}
                  placeholder="Select classes..."
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Add new class"
                  className="border p-2 rounded flex-1"
                />
                <button
                  onClick={addNewClass}
                  className="bg-blue-500 text-white px-3 py-2 rounded"
                  disabled={!newClassName.trim() || classList.some(cls => cls.value === newClassName.trim())}
                >
                  Add
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2 mt-4">
                {classList.map((cls) => (
                  <div key={cls.value} className="flex items-center justify-between">
                    <label className="flex-1">
                      {cls.label}
                    </label>
                    <button
                      onClick={() => deleteClass(cls.value)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Delete ${cls.label}`}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Section */}
            <div className="bg-white border rounded p-4">
              <h3 className="font-semibold text-blue-600 mb-2">
                Choose Categories
              </h3>
              <div className="mb-2">
                <Select
                  isMulti
                  options={categoryList}
                  value={selectedCategories}
                  onChange={setSelectedCategories}
                  placeholder="Select categories..."
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Add new category"
                  className="border p-2 rounded flex-1"
                />
                <button
                  onClick={addNewCategory}
                  className="bg-blue-500 text-white px-3 py-2 rounded"
                  disabled={!newCategory.trim() || categoryList.some(cat => cat.value === newCategory.trim())}
                >
                  Add
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2 mt-4">
                {categoryList.map((cat) => (
                  <div key={cat.value} className="flex items-center justify-between">
                    <label className="flex-1">
                      {cat.label}
                    </label>
                    <button
                      onClick={() => deleteCategory(cat.value)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Delete ${cat.label}`}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleUpdate}
            className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700"
            disabled={!feesHeading || !feesValue || selectedClasses.length === 0 || selectedCategories.length === 0 || loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>

          {tableData.length > 0 && (
            <div className="mt-6 overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full text-sm border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Class Name</th>
                    <th className="p-2 border">Category Name</th>
                    <th className="p-2 border">Fees Name</th>
                    <th className="p-2 border">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border">{row.className}</td>
                      <td className="p-2 border">{row.category}</td>
                      <td className="p-2 border">{row.feesName}</td>
                      <td className="p-2 border">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </MainLayout>
    </div>
  );
};

export default ConfigureFeesPlan;
