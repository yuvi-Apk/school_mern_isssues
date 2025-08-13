import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Port from "../Components/link.js"
const FeesRegister = () => {
  const [feesData, setFeesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch all fee records
  const fetchData = async () => {
    try {
      const res = await axios.get(`${Port}/api/fees/record`);
      if (res.data.success) {
        const sorted = res.data.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setFeesData(sorted);
        setFilteredData(sorted);
      }
    } catch (err) {
      console.error("Error fetching fee data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Date range filter
  const handleFilter = () => {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      const filtered = feesData.filter((item) => {
        const createdAt = new Date(item.created_at);
        return createdAt >= from && createdAt <= to;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(feesData);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value);

  const calcTotal = (field) => {
    return filteredData.reduce(
      (acc, cur) => acc + parseFloat(cur[field] || 0),
      0
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Fees Register</h1>

      <div className="flex gap-4 mb-4 items-center">
        <label>
          From:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-1 ml-2"
          />
        </label>
        <label>
          To:
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-1 ml-2"
          />
        </label>
        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Apply Filter
        </button>
        <button
          onClick={() => {
            setFromDate("");
            setToDate("");
            setFilteredData(feesData);
          }}
          className="bg-gray-400 text-white px-4 py-1 rounded"
        >
          Reset
        </button>
      </div>

      <div className="overflow-x-auto max-h-[60vh] border rounded-md">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Receipt No</th>
              <th className="border p-2">Adm No</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Class</th>
              <th className="border p-2">Route</th>
              <th className="border p-2">Months</th>
              <th className="border p-2">Fees</th>
              <th className="border p-2">Late Fee</th>
              <th className="border p-2">Discount</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Recd Amt</th>
              <th className="border p-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="14" className="text-center p-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
            {filteredData.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-100">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">
                  {moment(item.date).format("DD-MM-YYYY")}
                </td>
                <td className="border p-2">{item.rec_no}</td>
                <td className="border p-2">{item.admissionNumber}</td>
                <td className="border p-2">{item.student_name}</td>
                <td className="border p-2">{item.class}</td>
                <td className="border p-2">{item.route}</td>
                <td className="border p-2">{item.months}</td>
                <td className="border p-2">{formatCurrency(item.fees)}</td>
                <td className="border p-2">{formatCurrency(item.late_fee)}</td>
                <td className="border p-2">{formatCurrency(item.discount)}</td>
                <td className="border p-2">{formatCurrency(item.total)}</td>
                <td className="border p-2">{formatCurrency(item.recd_amt)}</td>
                <td className="border p-2">{formatCurrency(item.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Summary */}
      <div className="mt-4 bg-gray-100 p-4 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-2">Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div>Total Fees: {formatCurrency(calcTotal("fees"))}</div>
          <div>Total Late Fee: {formatCurrency(calcTotal("late_fee"))}</div>
          <div>Total Discount: {formatCurrency(calcTotal("discount"))}</div>
          <div>Total Collected: {formatCurrency(calcTotal("recd_amt"))}</div>
          <div>Total Balance: {formatCurrency(calcTotal("balance"))}</div>
        </div>
      </div>
    </div>
  );
};

export default FeesRegister;
