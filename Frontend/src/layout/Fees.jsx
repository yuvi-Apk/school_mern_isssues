import React, { useState } from "react";
import axios from "axios";
import { FaSearch, FaMoneyBillWave } from "react-icons/fa";

const FeesReceipt = () => {
  const [admissionNumber, setadmissionNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [remainingMonths, setRemainingMonths] = useState([]);
  const [paidMonths, setPaidMonths] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterData, setFilterData] = useState({
    name: "",
    className: "",
    section: "",
    routeName: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [feesHeading, setFeesHeading] = useState("Academic Fee");

  // Fees Calculation States
  const [lateFee, setLateFee] = useState(0);
  const [ledgerAmt, setLedgerAmt] = useState(0);
  const [discountAmt, setDiscountAmt] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [receiptAmt, setReceiptAmt] = useState(0);
  const [balanceAmt, setBalanceAmt] = useState(0);

  const [showCashModal, setShowCashModal] = useState(false);
  const [cashAmount, setCashAmount] = useState("");

  const API_BASE = "http://localhost:3000/api";

  // Fetch Student Details by Admission No
  const fetchStudentDetails = async () => {
    if (!admissionNumber.trim()) {
      setError("Please enter an admission number");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const studentRes = await axios.get(
        `${API_BASE}/students/student/${admissionNumber}`
      );

      if (!studentRes.data?.student) throw new Error("Student not found");

      setStudent(studentRes.data.student);

      // Fetch Remaining Months
      const pendingRes = await axios.get(`${API_BASE}/fees/pending`, {
        params: { admissionNumber },
      });

      if (pendingRes.data.success) {
        setRemainingMonths(pendingRes.data.remainingMonths || []);
        setPaidMonths(pendingRes.data.paidMonths || []);
        setSelectedMonths([]); // reset on new search
        updateTotalFees(pendingRes.data.remainingMonths || []);
      } else {
        setRemainingMonths([]);
        setPaidMonths([]);
        setTotalFees(0);
      }
    } catch (err) {
      setError("Failed to fetch student data. Please check the admission number.");
      setStudent(null);
      setRemainingMonths([]);
      setPaidMonths([]);
    } finally {
      setLoading(false);
    }
  };

  const updateTotalFees = (months) => {
    const monthlyFee = 1000; // TODO: replace with API value if available
    const calculatedTotal = months.length * monthlyFee;
    setTotalFees(calculatedTotal);
    recalcBalance(calculatedTotal, lateFee, ledgerAmt, discountAmt, receiptAmt);
  };

  const recalcBalance = (
    total = totalFees,
    late = lateFee,
    ledger = ledgerAmt,
    discount = discountAmt,
    receipt = receiptAmt
  ) => {
    const net = total + late + ledger - discount;
    setBalanceAmt(net - receipt);
    return net;
  };

  const updateField = (setter, value) => {
    setter(Number(value) || 0);
    recalcBalance();
  };

  const toggleMonth = (month) => {
    const updated = selectedMonths.includes(month)
      ? selectedMonths.filter((m) => m !== month)
      : [...selectedMonths, month];
    setSelectedMonths(updated);
    updateTotalFees(updated);
  };

  const selectAllMonths = () => {
    setSelectedMonths(remainingMonths);
    updateTotalFees(remainingMonths);
  };

  const searchStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/students`, {
        params: {
          keyword: filterData.name,
          class: filterData.className,
          section: filterData.section,
          routeName: filterData.routeName,
        },
      });
      setSearchResults(res.data || []);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to search students. Please try again.");
    }
  };

  const applyFees = async () => {
    if (!student || selectedMonths.length === 0) {
      alert("Please select a student and at least one month");
      return;
    }

    try {
      const payload = {
        date: new Date().toISOString().split("T")[0],
        rec_no: `REC-${Date.now()}`,
        admissionNumber: student.admissionNumber,
        student_name: `${student.firstName} ${student.lastName}`,
        className: student.class,
        category: student.category,
        routeName: student.routeName,
        selectedMonths: selectedMonths,
        fees: totalFees,
        total: totalFees,
        recd_amt: receiptAmt,
        balance: balanceAmt,
        feesHeading: feesHeading,
        late_fee: lateFee,
        discount: discountAmt,
      };

      console.log(payload);

      const res = await axios.post(`${API_BASE}/fees/apply`, payload);
      alert(res.data.message || "Fees applied successfully");
      fetchStudentDetails();
    } catch (err) {
      alert("Failed to apply fees. Please try again.");
    }
  };

  const handleCashPayment = () => {
    const netFees = recalcBalance();
    const cash = Number(cashAmount);

    if (cash >= netFees) {
      setReceiptAmt(netFees);
      setBalanceAmt(0);
    } else {
      setReceiptAmt(cash);
      setBalanceAmt(netFees - cash);
    }

    setShowCashModal(false);
    setCashAmount("");
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-7xl mx-auto relative">
        <h1 className="text-2xl font-bold mb-6 border-b pb-3 flex justify-between items-center">
          FEES RECEIPT
          <button
            className="text-blue-600"
            onClick={() => setShowFilter(!showFilter)}
          >
            <FaSearch size={18} />
          </button>
        </h1>

        {/* Advanced Search */}
        {showFilter && (
          <div className="absolute top-16 right-4 bg-white shadow-lg p-4 rounded w-80 border z-10">
            <h3 className="font-semibold mb-3">Advanced Search</h3>
            {["name", "className", "section", "routeName"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.replace(/([A-Z])/g, " $1")}
                className="border rounded p-2 w-full mb-2"
                value={filterData[field]}
                onChange={(e) =>
                  setFilterData({ ...filterData, [field]: e.target.value })
                }
              />
            ))}
            <button
              onClick={searchStudents}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Search
            </button>
            {searchResults.length > 0 && (
              <div className="mt-3 max-h-40 overflow-y-auto border rounded p-2">
                {searchResults.map((stu) => (
                  <p
                    key={stu.id}
                    className="cursor-pointer hover:bg-gray-200 p-1"
                    onClick={() => {
                      setadmissionNumber(stu.admissionNumber);
                      setShowFilter(false);
                    }}
                  >
                    {stu.firstName} {stu.lastName} ({stu.class}-{stu.section})
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Admission No Search */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={admissionNumber}
            onChange={(e) => setadmissionNumber(e.target.value)}
            className="border rounded w-1/3 p-2"
            placeholder="Admission No."
          />
          <button
            onClick={fetchStudentDetails}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
            disabled={loading}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {student && (
          <>
            {/* Student Details */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <input
                type="text"
                value={`${student.firstName} ${student.lastName}`}
                className="border rounded p-2"
                readOnly
              />
              <input
                type="text"
                value={student.fatherName || ""}
                className="border rounded p-2"
                readOnly
              />
              <input
                type="text"
                value={student.class}
                className="border rounded p-2"
                readOnly
              />
              <input
                type="text"
                value={student.routeName || "N/A"}
                className="border rounded p-2"
                readOnly
              />
            </div>

            {/* Month Selection */}
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div className="col-span-1 border rounded bg-gray-50 p-4">
                <h3 className="font-semibold mb-3 border-b pb-2">
                  Select Months
                </h3>
                <div className="flex flex-col space-y-1 text-sm max-h-40 overflow-y-auto">
                  {remainingMonths.map((month) => (
                    <label key={month}>
                      <input
                        type="checkbox"
                        checked={selectedMonths.includes(month)}
                        onChange={() => toggleMonth(month)}
                        className="mr-2"
                      />
                      {month}
                    </label>
                  ))}
                </div>
                <div className="flex justify-between mt-3">
                  <button
                    onClick={selectAllMonths}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMonths([]);
                      updateTotalFees([]);
                    }}
                    className="bg-gray-500 text-white px-3 py-1 rounded text-xs"
                  >
                    Clear
                  </button>
                </div>
                <button
                  onClick={applyFees}
                  className="bg-green-600 w-full mt-3 text-white px-3 py-2 rounded text-sm"
                >
                  Apply Fees
                </button>
              </div>

              {/* Paid Months */}
              <div className="col-span-3 border rounded p-4 bg-green-50">
                <h3 className="font-semibold mb-2">Paid Months</h3>
                {paidMonths.length > 0 ? (
                  <p className="text-sm">{paidMonths.join(", ")}</p>
                ) : (
                  <p className="text-sm text-gray-500">No months paid yet</p>
                )}
              </div>
            </div>

            {/* Fees Summary */}
            <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
              <input
                type="number"
                placeholder="Late Fees"
                value={lateFee}
                onChange={(e) => updateField(setLateFee, e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Ledger Amt"
                value={ledgerAmt}
                onChange={(e) => updateField(setLedgerAmt, e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Discount Amt"
                value={discountAmt}
                onChange={(e) => updateField(setDiscountAmt, e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Total Fees"
                value={totalFees}
                readOnly
                className="border p-2 rounded bg-gray-100"
              />
              <input
                type="text"
                placeholder="Receipt Amt"
                value={receiptAmt}
                readOnly
                className="border p-2 rounded bg-gray-100"
              />
              <input
                type="text"
                placeholder="Balance Amt"
                value={balanceAmt}
                readOnly
                className="border p-2 rounded bg-gray-100"
              />

              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2 col-span-2"
                onClick={() => setShowCashModal(true)}
              >
                <FaMoneyBillWave /> Enter Cash Amount
              </button>
            </div>
          </>
        )}

        {/* Cash Modal */}
        {showCashModal && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg p-6 rounded w-80 border z-50">
            <h3 className="text-lg font-semibold mb-4">Enter Cash Amount</h3>
            <input
              type="number"
              placeholder="Cash Amount"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              className="border rounded p-2 w-full mb-4"
            />
            <div className="flex justify-between">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowCashModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleCashPayment}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeesReceipt;
