import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import MainLayout from "../layout/MainLayout";
import Port from "../Components/link.js";
const PaymentDetailsTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    admissionNumber: "",
    className: "",
    category: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${Port}/api/fees/record`);
        console.log("Fetched Data:", res.data);
        const records = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        setData(records);
        setFilteredData(records);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payment details:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const applyFilters = () => {
    let updated = [...data];
    if (filters.admissionNumber.trim()) {
      updated = updated.filter((item) =>
        item.admissionNumber
          ?.toLowerCase()
          .includes(filters.admissionNumber.toLowerCase())
      );
    }
    if (filters.className.trim()) {
      updated = updated.filter((item) =>
        item.class?.toLowerCase().includes(filters.className.toLowerCase())
      );
    }
    if (filters.category.trim()) {
      updated = updated.filter((item) =>
        item.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }
    if (filters.startDate || filters.endDate) {
      updated = updated.filter((item) => {
        const itemDate = item.date ? new Date(item.date) : null;
        const start = filters.startDate ? new Date(filters.startDate) : null;
        const end = filters.endDate ? new Date(filters.endDate) : null;
        return (
          (!start || (itemDate && itemDate >= start)) &&
          (!end || (itemDate && itemDate <= end))
        );
      });
    }
    setFilteredData(updated);
  };

  const resetFilters = () => {
    setFilters({
      admissionNumber: "",
      className: "",
      category: "",
      startDate: "",
      endDate: "",
    });
    setFilteredData(data);
  };

  return (
    <MainLayout>
      <motion.div
        className="p-6 bg-white shadow-lg rounded-2xl border border-gray-200"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Payment Details
        </h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-5">
          <input
            type="text"
            placeholder="Admission No"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={filters.admissionNumber}
            onChange={(e) =>
              setFilters({ ...filters, admissionNumber: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Class"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={filters.className}
            onChange={(e) =>
              setFilters({ ...filters, className: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Category"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          />
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />
        </div>

        <div className="flex gap-2 mb-5">
          <button
            onClick={applyFilters}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Reset
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : filteredData.length === 0 ? (
          <p className="text-gray-500">No payment records found.</p>
        ) : (
          <motion.div
            className="overflow-x-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <table className="min-w-full border border-gray-200 rounded-lg shadow-sm text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {[
                    "Date",
                    "Receipt No",
                    "Admission No",
                    "Student Name",
                    "Class",
                    "Category",
                    "Months",
                    "Total",
                    "Received",
                    "Balance",
                    "Fees Heading",
                  ].map((header) => (
                    <th key={header} className="border p-2 font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => (
                  <motion.tr
                    key={item.id || idx}
                    className="hover:bg-gray-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <td className="border p-2">
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="border p-2">{item.rec_no || "-"}</td>
                    <td className="border p-2">{item.admissionNumber}</td>
                    <td className="border p-2">{item.student_name || "-"}</td>
                    <td className="border p-2">{item.class}</td>
                    <td className="border p-2">{item.category}</td>
                    <td className="border p-2">{item.months}</td>
                    <td className="border p-2 text-right">₹{item.total}</td>
                    <td className="border p-2 text-right">₹{item.recd_amt}</td>
                    <td className="border p-2 text-right">₹{item.balance}</td>
                    <td className="border p-2">{item.feesHeading || "-"}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </motion.div>
    </MainLayout>
  );
};

export default PaymentDetailsTable;
