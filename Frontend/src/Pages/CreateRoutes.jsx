import React, { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";

const monthsList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const API = "http://localhost:3000/routes";

const CreateRoutes = () => {
  const [routeName, setRouteName] = useState("");
  const [frequency, setFrequency] = useState("Annual");
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [editingRouteId, setEditingRouteId] = useState(null);

  // Frequency-based month auto-check
  const handleFrequencyChange = (value) => {
    setFrequency(value);
    switch (value) {
      case "Annual":
        setSelectedMonths(["Jan"]);
        break;
      case "BiMonthly":
        setSelectedMonths(["Jan", "Mar", "May", "Jul", "Sep", "Nov"]);
        break;
      case "Quarterly":
        setSelectedMonths(["Jan", "Apr", "Jul", "Oct"]);
        break;
      case "HalfYearly":
        setSelectedMonths(["Jan", "Jul"]);
        break;
      case "Monthly":
        setSelectedMonths([...monthsList]);
        break;
      case "FourMonthly":
        setSelectedMonths(["Jan", "May", "Sep"]);
        break;
      case "OneTime":
        setSelectedMonths(["Jan"]);
        break;
      default:
        setSelectedMonths([]);
    }
  };

  // Handle checkbox change
  const handleMonthChange = (month) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  // Create or Update Route
  const saveRoute = async () => {
    if (!routeName) return alert("Enter route name");

    const payload = { route_name: routeName, frequency, months: selectedMonths };

    if (editingRouteId) {
      await axios.put(`${API}/${editingRouteId}`, payload);
      setEditingRouteId(null);
    } else {
      await axios.post(`${API}/create`, payload);
      
    }
    

    setRouteName("");
    setSelectedMonths([]);
    fetchRoutes();
  };

  // Fetch Routes
  const fetchRoutes = async () => {
    const res = await axios.get(`${API}`);
    setRoutes(res.data);
  };

  // Edit Route
  const editRoute = (route) => {
    setRouteName(route.route_name);
    setFrequency(route.frequency);
    setSelectedMonths(route.months);
    setEditingRouteId(route.id);
  };

  // Delete Route
  const deleteRoute = async (id) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      await axios.delete(`${API}/${id}`);
      fetchRoutes();
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <MainLayout>
    <div className="p-6 bg-gray-100 min-h-screen">
      
      <h1 className="text-2xl font-bold mb-4">Create Route Master</h1>

      <div className="bg-white shadow rounded p-4">
        <input
          type="text"
          placeholder="Route Name"
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
          className="border p-2 mr-2"
        />

        <select
          value={frequency}
          onChange={(e) => handleFrequencyChange(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="Annual">Annual</option>
          <option value="BiMonthly">Bi Monthly</option>
          <option value="HalfYearly">Half Yearly</option>
          <option value="Monthly">Monthly</option>
          <option value="OneTime">One Time</option>
          <option value="Quarterly">Quarterly</option>
          <option value="FourMonthly">Four Monthly</option>
        </select>

        <div className="grid grid-cols-6 gap-2 my-4">
          {monthsList.map((month) => (
            <label key={month} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={selectedMonths.includes(month)}
                onChange={() => handleMonthChange(month)}
              />
              <span>{month}</span>
            </label>
          ))}
        </div>

        <button
          onClick={saveRoute}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingRouteId ? "Update Route" : "Save Route"}
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-6">Existing Routes</h2>
      <table className="table-auto w-full mt-2 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Route Name</th>
            <th className="p-2 border">Frequency</th>
            <th className="p-2 border">Months</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.id}>
              <td className="border p-2">{route.route_name}</td>
              <td className="border p-2">{route.frequency}</td>
              <td className="border p-2">{route.months.join(", ")}</td>
              <td className="border p-2 space-x-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => editRoute(route)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteRoute(route.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </MainLayout>
  );
};

export default CreateRoutes;
