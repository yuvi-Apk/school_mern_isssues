import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import MainLayout from "../layout/MainLayout";
import Port from "../Components/link.js";

const FeesReceipt = () => {
  // ===== STATE =====
  const [admissionNumber, setadmissionNumber] = useState("");
  const [receiptNo, setReceiptNo] = useState("");
  const [date, setDate] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [pendingFees, setPendingFees] = useState([]);
  const [remainingMonths, setRemainingMonths] = useState([]);
  const [paidMonths, setPaidMonths] = useState([]);
  const [appliedFeeData, setAppliedFeeData] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [manualAmount, setManualAmount] = useState("");
  const [paymentType, setPaymentType] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);

  const receiptRef = useRef();

  // ===== INITIAL SETUP =====
  useEffect(() => {
    const today = new Date();
    setDate(today.toISOString().split("T")[0]);
    setReceiptNo(`RCPT-${Date.now().toString().slice(-6)}`);
  }, []);

  // ===== FETCH STUDENT DATA =====
  useEffect(() => {
    if (!admissionNumber.trim()) {
      resetStudentData();
      return;
    }

    const fetchStudentData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`${Port}/api/students/student/${admissionNumber}`);
        if (data.student) {
          setStudentData(data.student);
          await fetchPendingFees(admissionNumber);
        } else {
          setError("No student found.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch student data.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchStudentData, 500);
    return () => clearTimeout(timer);
  }, [admissionNumber]);

  // ===== RESET =====
  const resetStudentData = () => {
    setStudentData(null);
    setPendingFees([]);
    setRemainingMonths([]);
    setPaidMonths([]);
    setSelectedMonths([]);
    setManualAmount("");
    setPaymentType("monthly");
  };

  const fetchPendingFees = async (admissionNumber) => {
    try {
      const { data } = await axios.get(`${Port}/api/fees/pending?admissionNumber=${admissionNumber}`);
      if (data.success) {
        setPendingFees(data.pendingFees || []);
        setRemainingMonths(data.remainingMonths || []);
        setPaidMonths(data.paidMonths || []);
      }
    } catch (err) {
      console.error("Failed to fetch pending fees:", err.message);
    }
  };

  // ===== TOGGLE MONTH =====
  const toggleMonth = (month) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  // ===== APPLY FEES =====
  const handleApplyFees = async () => {
    if (!studentData) {
      setError("No student data found.");
      return;
    }

    if (paymentType === "monthly" && selectedMonths.length === 0) {
      setError("Select at least one month.");
      return;
    }

    if (paymentType === "manual" && (!manualAmount || manualAmount <= 0)) {
      setError("Enter a valid manual amount.");
      return;
    }

    setApplying(true);
    try {
      const payload = {
        admissionNumber,
        className: studentData.className || studentData.class || "",
        category: studentData.category || "",
        paymentType,
        ...(paymentType === "monthly" && { selectedMonths }),
        ...(paymentType === "manual" && { manualAmount: Number(manualAmount) }),
      };

      const { data } = await axios.post(`${Port}/api/fees/apply`, payload);

      if (data.success) {
        setAppliedFeeData(data.data);
        setReceiptNo(`RCPT-${Date.now().toString().slice(-6)}`);
        setSelectedMonths([]);
        setManualAmount("");
        await fetchPendingFees(admissionNumber);
      } else {
        setError(data.message || "Failed to apply fees.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply fees.");
    } finally {
      setApplying(false);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Receipt_${admissionNumber}_${receiptNo}`,
  });

  const handleClose = () => {
    setadmissionNumber("");
    resetStudentData();
    setAppliedFeeData(null);
    setError(null);
    setReceiptNo(`RCPT-${Date.now().toString().slice(-6)}`);
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-blue-800">FEES RECEIPT</h2>
              <p className="text-sm text-gray-500">Student Fee Payment Record</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <input
                type="text"
                value={admissionNumber}
                onChange={(e) => setadmissionNumber(e.target.value)}
                placeholder="Admission No"
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={receiptNo}
                readOnly
                className="border rounded px-3 py-2 w-32 text-sm bg-gray-100"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handlePrint}
                disabled={!appliedFeeData}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
              >
                Print
              </button>
              <button
                onClick={handleClose}
                className="bg-gray-200 px-4 py-2 rounded text-sm hover:bg-gray-300"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Loader & Error */}
          {loading && <p className="mt-4 text-blue-500">Loading...</p>}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Student Info */}
          {studentData && (
            <div className="mt-6 bg-gray-100 p-4 rounded-lg border">
              <h3 className="font-semibold text-lg mb-2">Student Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <p><strong>Name:</strong> {studentData.firstName} {studentData.lastName}</p>
                <p><strong>Class:</strong> {studentData.className || studentData.class}</p>
                <p><strong>Category:</strong> {studentData.category}</p>
                <p><strong>Route:</strong> {studentData.routeName || "Not Applied"}</p>
              </div>
            </div>
          )}

          {/* Pending Fees Table */}
          {pendingFees.length > 0 && (
            <div className="mt-6 bg-yellow-50 p-4 border border-yellow-200 rounded">
              <h4 className="text-lg font-semibold text-yellow-800 mb-3">Pending Fees</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Fee Type</th>
                      <th className="text-right py-2">Total</th>
                      <th className="text-right py-2">Paid</th>
                      <th className="text-right py-2">Balance</th>
                      <th className="text-left py-2">Pending Months</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingFees.map((fee, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2">{fee.feesHeading}</td>
                        <td className="text-right py-2">₹{fee.total}</td>
                        <td className="text-right py-2">₹{fee.paid}</td>
                        <td className="text-right py-2">₹{fee.balance}</td>
                        <td className="py-2">{fee.months}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payment Options */}
          {studentData && (
            <div className="mt-6 bg-blue-50 p-4 border border-blue-200 rounded">
              <h3 className="font-semibold text-blue-800 mb-3">Select Payment Mode</h3>
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentType"
                    value="monthly"
                    checked={paymentType === "monthly"}
                    onChange={() => setPaymentType("monthly")}
                  />
                  Month-wise Payment
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentType"
                    value="manual"
                    checked={paymentType === "manual"}
                    onChange={() => setPaymentType("manual")}
                  />
                  Manual Amount
                </label>
              </div>

              {/* Monthly UI */}
              {paymentType === "monthly" && remainingMonths.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                  {remainingMonths.map((month) => (
                    <label key={month} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedMonths.includes(month)}
                        onChange={() => toggleMonth(month)}
                      />
                      <span>{month}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Manual Amount UI */}
              {paymentType === "manual" && (
                <div className="mb-4">
                  <input
                    type="number"
                    value={manualAmount}
                    onChange={(e) => setManualAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="border rounded px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <button
                onClick={handleApplyFees}
                disabled={applying}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                {applying ? "Applying..." : "Apply Fees"}
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default FeesReceipt;
