import React, { useEffect, useState } from "react";
import axios from "axios";
import Port from "../Components/link.js";

const FeesRecordTable = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [classOptions, setClassOptions] = useState(["1st-A", "1st-B"]);
  const [feesHeadOptions, setFeesHeadOptions] = useState(["Tuition Fee"]);
  const [filters, setFilters] = useState({
    feesHead: "",
    className: "",
    from: "",
    to: "",
  });

  const [totalFees, setTotalFees] = useState(0);

  // Fetch all records on mount
  useEffect(() => {
    axios
      .get(`${Port}/api/fees/record`)
      .then((res) => {
        setRecords(res.data);
        setFilteredRecords(res.data);
        updateTotal(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Filter handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply Filter Logic
  const applyFilters = () => {
    const { feesHead, className, from, to } = filters;
    const filtered = records.filter((rec) => {
      const recDate = new Date(rec.date);
      const fromDate = from ? new Date(from) : null;
      const toDate = to ? new Date(to) : null;

      return (
        (!feesHead || rec.fees_heading === feesHead) &&
        (!className || rec.class === className) &&
        (!fromDate || recDate >= fromDate) &&
        (!toDate || recDate <= toDate)
      );
    });
    setFilteredRecords(filtered);
    updateTotal(filtered);
  };

  // Add new class or fee head
  const addNewOption = (type) => {
    const value = prompt(`Enter new ${type}`);
    if (value) {
      if (type === "Class") {
        setClassOptions((prev) => [...new Set([...prev, value])]);
      } else if (type === "Fees Head") {
        setFeesHeadOptions((prev) => [...new Set([...prev, value])]);
      }
    }
  };

  // Update total fees calculation
  const updateTotal = (data) => {
    const total = data.reduce(
      (sum, record) => sum + (record.totalAmount || 0),
      0
    );
    setTotalFees(total);
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Fees Head Wise Collection</h1>

      {/* Filter Panel */}
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div>
          <label className="block text-sm font-medium">Fees Head</label>
          <select
            name="feesHead"
            value={filters.feesHead}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          >
            <option value="">All</option>
            {feesHeadOptions.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <button
            className="ml-2 text-blue-500 text-sm underline"
            onClick={() => addNewOption("Fees Head")}
          >
            + Add
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium">Class</label>
          <select
            name="className"
            value={filters.className}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          >
            <option value="">All</option>
            {classOptions.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <button
            className="ml-2 text-blue-500 text-sm underline"
            onClick={() => addNewOption("Class")}
          >
            + Add
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium">From</label>
          <input
            type="date"
            name="from"
            value={filters.from}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">To</label>
          <input
            type="date"
            name="to"
            value={filters.to}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          />
        </div>

        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Apply
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto border rounded">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Dt</th>
              <th className="border p-2">Rec No</th>
              <th className="border p-2">Adm No</th>
              <th className="border p-2">Student</th>
              <th className="border p-2">Class</th>
              <th className="border p-2">Roll No</th>
              <th className="border p-2">Route</th>
              <th className="border p-2">Catg</th>
              <th className="border p-2">Father</th>
              <th className="border p-2">Mobile</th>
              <th className="border p-2">Month</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((rec) => (
                <tr key={rec.receiptNo} className="even:bg-gray-50">
                  <td className="border p-2">{new Date(rec.date).toLocaleDateString()}</td>
                  <td className="border p-2">{rec.receiptNo}</td>
                  <td className="border p-2">{rec.admissionNumber}</td>
                  <td className="border p-2">{rec.name}</td>
                  <td className="border p-2">{rec.class}</td>
                  <td className="border p-2">{rec.rollNo}</td>
                  <td className="border p-2">{rec.route}</td>
                  <td className="border p-2">{rec.category}</td>
                  <td className="border p-2">{rec.fatherName}</td>
                  <td className="border p-2">{rec.mobile}</td>
                  <td className="border p-2">{rec.month}</td>
                  <td className="border p-2">{rec.totalAmount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center p-4">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="mt-4 text-right font-semibold">
        Total: ₹{totalFees.toFixed(2)}
      </div>
    </div>
  );
};

export default FeesRecordTable;
