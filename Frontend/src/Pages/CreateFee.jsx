import { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Plus } from "lucide-react";
import Port from "../Components/link.js"
const monthsList = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const frequencyMonthsMap = {
  Annual: ["Apr"],
  Monthly: [...monthsList],
  Quarterly: ["Apr", "Jul", "Oct", "Jan"],
  "Semi-annual": ["Apr", "Oct"],
  Retainer: [],
};

const CreateFeesHeading = () => {
  const [formData, setFormData] = useState({
    feesHeading: "",
    groupName: "DEVELOPMENT FEE",
    frequency: "Annual",
    accountName: "Admission Fees",
    months: [],
  });

  const [feesList, setFeesList] = useState([]);
  const [editId, setEditId] = useState(null);

  const [groupOptions, setGroupOptions] = useState([
    "DEVELOPMENT FEE", "EXAM FEE", "General"
  ]);
  const [accountOptions, setAccountOptions] = useState([
    "Admission Fees", "Tuition Fee", "Transport Fee"
  ]);
  const [frequencyOptions, setFrequencyOptions] = useState(
    Object.keys(frequencyMonthsMap)
  );

  useEffect(() => {
    const autoMonths = frequencyMonthsMap[formData.frequency] || [];
    setFormData((prev) => ({ ...prev, months: autoMonths }));
  }, [formData.frequency]);

  useEffect(() => {
    fetchFeesList();
  }, []);

  const fetchFeesList = async () => {
    try {
      const res = await axios.get(`${Port}/api/fees`);
      setFeesList(res.data.data);
    } catch (err) {
      toast.error("❌ Failed to fetch fees list");
    }
  };

  const toggleMonth = (month) => {
    setFormData((prev) => {
      const months = prev.months.includes(month)
        ? prev.months.filter((m) => m !== month)
        : [...prev.months, month];
      return { ...prev, months };
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectAllMonths = () => {
    setFormData((prev) => ({ ...prev, months: [...monthsList] }));
  };

  const clearAllMonths = () => {
    setFormData((prev) => ({ ...prev, months: [] }));
  };

  const handleAddOption = (field) => {
    const newOption = prompt(`Enter new ${field}`);
    if (newOption && newOption.trim()) {
      const value = newOption.trim();
      switch (field) {
        case "groupName":
          setGroupOptions((prev) => [...new Set([...prev, value])]);
          setFormData((prev) => ({ ...prev, groupName: value }));
          break;
        case "accountName":
          setAccountOptions((prev) => [...new Set([...prev, value])]);
          setFormData((prev) => ({ ...prev, accountName: value }));
          break;
        case "frequency":
          setFrequencyOptions((prev) => [...new Set([...prev, value])]);
          setFormData((prev) => ({ ...prev, frequency: value }));
          break;
        default:
          break;
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`${Port}/api/fees/${editId}`, formData);
        toast.success("✅ Fee Heading updated successfully!");
      } else {
        await axios.post(`${Port}/api/fees`, formData);
        toast.success("✅ Fee Heading saved successfully!");
      }
      setFormData({
        feesHeading: "",
        groupName: "DEVELOPMENT FEE",
        frequency: "Annual",
        accountName: "Admission Fees",
        months: [],
      });
      setEditId(null);
      fetchFeesList();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("❌ Failed to save. Try again!");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      feesHeading: item.fees_heading,
      groupName: item.groupName,
      frequency: item.frequency,
      accountName: item.accountName,
      months: item.months.split(","),
    });
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fee heading?")) return;
    try {
      await axios.delete(`${Port}/api/fees/${id}`);
      toast.success("🗑️ Fee heading deleted");
      fetchFeesList();
    } catch (err) {
      toast.error("❌ Delete failed");
    }
  };

  return (
    <MainLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-4 bg-white">
        <h2 className="text-2xl font-bold text-cyan-700 mb-4">
          CREATE FEES HEADING
        </h2>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <input
            name="feesHeading"
            value={formData.feesHeading}
            onChange={handleInputChange}
            placeholder="Fees Heading"
            className="border p-2"
          />

          {/* Group Name */}
          <div className="flex gap-1">
            <select
              name="groupName"
              value={formData.groupName}
              onChange={handleInputChange}
              className="border p-2 flex-grow"
            >
              {groupOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <button
              onClick={() => handleAddOption("groupName")}
              className="bg-green-500 text-white px-2 rounded"
              title="Add Group"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Frequency */}
          <div className="flex gap-1">
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleInputChange}
              className="border p-2 flex-grow"
            >
              {frequencyOptions.map((freq) => (
                <option key={freq} value={freq}>{freq}</option>
              ))}
            </select>
            <button
              onClick={() => handleAddOption("frequency")}
              className="bg-green-500 text-white px-2 rounded"
              title="Add Frequency"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Account Name */}
          <div className="flex gap-1">
            <select
              name="accountName"
              value={formData.accountName}
              onChange={handleInputChange}
              className="border p-2 flex-grow"
            >
              {accountOptions.map((acc) => (
                <option key={acc} value={acc}>{acc}</option>
              ))}
            </select>
            <button
              onClick={() => handleAddOption("accountName")}
              className="bg-green-500 text-white px-2 rounded"
              title="Add Account Name"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="mb-2 text-sm text-blue-600 font-medium">
          Select Months in which this fee becomes due
        </div>
        <div className="mb-3 flex gap-4 text-sm">
          <button onClick={selectAllMonths} className="text-green-600 underline">
            Select All
          </button>
          <button onClick={clearAllMonths} className="text-red-600 underline">
            Clear All
          </button>
          <span className="text-gray-500 italic">Click on any month to customize</span>
        </div>

        <div className="grid grid-cols-6 gap-2 mb-4">
          {monthsList.map((month) => (
            <label
              key={month}
              className={`p-2 text-center cursor-pointer border rounded ${
                formData.months.includes(month) ? "bg-cyan-300" : "bg-gray-100"
              }`}
            >
              <input
                type="checkbox"
                checked={formData.months.includes(month)}
                onChange={() => toggleMonth(month)}
                className="hidden"
              />
              {month}
            </label>
          ))}
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleSubmit}
        >
          {editId ? "Update" : "Save"}
        </button>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-cyan-700 text-white">
              <tr>
                <th className="border px-2 py-1">Fees Heading</th>
                <th className="border px-2 py-1">Group</th>
                <th className="border px-2 py-1">Account</th>
                <th className="border px-2 py-1">Frequency</th>
                {monthsList.map((month) => (
                  <th key={month} className="border px-2 py-1">{month}</th>
                ))}
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feesList.map((fee) => (
                <tr key={fee.id}>
                  <td className="border px-2 py-1">{fee.feesHeading}</td>
                  <td className="border px-2 py-1">{fee.groupName}</td>
                  <td className="border px-2 py-1">{fee.accountName}</td>
                  <td className="border px-2 py-1">{fee.frequency}</td>
                  {monthsList.map((month) => (
                    <td key={month} className="border px-2 py-1 text-center">
                      {fee.months.includes(month) ? "✓" : ""}
                    </td>
                  ))}
                  <td className="border px-2 py-1 flex gap-2">
                    <button
                      onClick={() => handleEdit(fee)}
                      className="text-blue-600 underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(fee.id)}
                      className="text-red-600 underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateFeesHeading;
