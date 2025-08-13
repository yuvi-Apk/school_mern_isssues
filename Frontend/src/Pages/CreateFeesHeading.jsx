import { useState } from "react";
import MainLayout from "../layout/MainLayout";
import Port from "../Components/link.js";

const monthsList = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const frequencyMonthMap = {
  Annual: ["Apr"],
  Monthly: [...monthsList],
  Quarterly: ["Apr", "Jul", "Oct", "Jan"],
  "Semi-annual": ["Apr", "Oct"],
  Retainer: [],
  Other: [],
};

const CreateFeesHeading = () => {
  const [groupOptions, setGroupOptions] = useState([
    "Development Fee",
    "Exam Fee",
    "General",
  ]);

  const [accountOptions, setAccountOptions] = useState([
    "Admission Fees",
    "Tuition Fee",
    "Transport Fee",
  ]);

  const [formData, setFormData] = useState({
    feesHeading: "",
    groupName: "Development Fee",
    frequency: "Annual",
    accountName: "Admission Fees",
    months: frequencyMonthMap["Annual"],
  });

  const [submittedData, setSubmittedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (value === "__add_new_group__") {
      const newGroup = prompt("Enter new group name:");
      if (newGroup) {
        setGroupOptions((prev) => [...prev, newGroup]);
        setFormData((prev) => ({ ...prev, groupName: newGroup }));
      }
      return;
    }

    if (value === "__add_new_account__") {
      const newAccount = prompt("Enter new account name:");
      if (newAccount) {
        setAccountOptions((prev) => [...prev, newAccount]);
        setFormData((prev) => ({ ...prev, accountName: newAccount }));
      }
      return;
    }

    const updatedData = {
      ...formData,
      [name]: value,
    };

    if (name === "frequency") {
      updatedData.months = frequencyMonthMap[value] || [];
    }

    setFormData(updatedData);
    setError(null);
  };

  const toggleMonth = (month) => {
    setFormData((prev) => {
      const months = prev.months.includes(month)
        ? prev.months.filter((m) => m !== month)
        : [...prev.months, month];
      return { ...prev, months };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.feesHeading.trim()) {
      setError("Please enter a fees heading");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`${Port}/api/fees/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        setSubmittedData((prev) => [...prev, formData]);
        setFormData({
          feesHeading: "",
          groupName: "Development Fee",
          frequency: "Annual",
          accountName: "Admission Fees",
          months: frequencyMonthMap["Annual"],
        });
        setSuccessMessage("Fees heading created successfully!");
      } else {
        setError(result.message || "Error saving data");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setError("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MainLayout>
        <div className="w-full p-4 md:p-6">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b pb-2">
              Create Fees Heading
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded border border-green-200">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Fees Heading *
                  </label>
                  <input
                    name="feesHeading"
                    value={formData.feesHeading}
                    onChange={handleInputChange}
                    placeholder="Enter fees heading"
                    className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Group Name
                  </label>
                  <select
                    name="groupName"
                    value={formData.groupName}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    {groupOptions.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                    <option
                      value="__add_new_group__"
                      className="text-cyan-600 font-medium"
                    >
                      + Add New Group
                    </option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Frequency
                  </label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    {Object.keys(frequencyMonthMap).map((freq) => (
                      <option key={freq} value={freq}>
                        {freq}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Account Name
                  </label>
                  <select
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-cyan-500 focus:border-gray-600"
                  >
                    {accountOptions.map((acc) => (
                      <option key={acc} value={acc}>
                        {acc}
                      </option>
                    ))}
                    <option
                      value="__add_new_account__"
                      className="text-cyan-600 font-medium"
                    >
                      + Add New Account
                    </option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applicable Months
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {monthsList.map((month) => (
                    <label
                      key={month}
                      className={`flex items-center justify-center p-2 border rounded-md cursor-pointer transition-colors ${
                        formData.months.includes(month)
                          ? "bg-blue-500 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.months.includes(month)}
                        onChange={() => toggleMonth(month)}
                        className="hidden"
                      />
                      <span className="text-sm font-medium">{month}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || !formData.feesHeading.trim()}
                  className={`px-6 py-2 rounded-md font-medium ${
                    isLoading || !formData.feesHeading.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-cyan-600 hover:bg-cyan-700 text-white"
                  } transition-colors`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>

            {submittedData.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Recently Added Fees Headings
                </h3>
                <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-cyan-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Fees Heading
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Group
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Account
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Frequency
                        </th>
                        {monthsList.map((m) => (
                          <th
                            key={m}
                            className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                          >
                            {m}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {submittedData.map((data, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">
                            {data.feesHeading}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">
                            {data.groupName}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">
                            {data.accountName}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">
                            {data.frequency}
                          </td>
                          {monthsList.map((m) => (
                            <td
                              key={m}
                              className="px-2 py-2 whitespace-nowrap text-center"
                            >
                              <span
                                className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                                  data.months.includes(m)
                                    ? "bg-green-100 text-blue-500"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {data.months.includes(m) ? "✓" : ""}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </div>
  );
};

export default CreateFeesHeading;
