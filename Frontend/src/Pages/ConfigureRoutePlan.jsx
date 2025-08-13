import React, { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "../layout/MainLayout";
import Port from "../Components/link.js"
const ConfigureRoutePlan = () => {
  const [classList, setClassList] = useState([
    "Nursery",
    "L.K.G",
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
  ]);
  const [categories, setCategories] = useState([
    "General",
    "New Student",
    "Old Student",
  ]);

  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [routeHeading, setRouteHeading] = useState("");
  const [routeValue, setRouteValue] = useState("");
  const [routesTable, setRoutesTable] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);

  const [newClass, setNewClass] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState(null);

  /** Fetch Routes and Plans */
  useEffect(() => {
    axios
      .get(`${Port}/routes/`)
      .then((res) => setRouteOptions(res.data.map((r) => r.route_name)))
      .catch((err) => console.error("Error fetching routes:", err));

    fetchRoutePlans();
  }, []);

  const fetchRoutePlans = () => {
    axios
      .get(`${Port}/applyRouter/api/route-plans`)
      .then((res) => setRoutesTable(res.data))
      .catch((err) => console.error("Error fetching route plans:", err));
  };

  /** Add new class */
  const handleAddClass = () => {
    const cls = newClass.trim();
    if (cls && !classList.includes(cls)) {
      setClassList((prev) => [...prev, cls]);
      setNewClass("");
    }
  };

  /** Add new category */
  const handleAddCategory = () => {
    const cat = newCategory.trim();
    if (cat && !categories.includes(cat)) {
      setCategories((prev) => [...prev, cat]);
      setNewCategory("");
    }
  };

  /** Toggle class/category selection */
  const toggleSelection = (item, setFunc, selected) => {
    setFunc(
      selected.includes(item)
        ? selected.filter((i) => i !== item)
        : [...selected, item]
    );
  };

  /** Save or Update Route */
  const handleSave = () => {
    if (
      !routeHeading ||
      !routeValue ||
      selectedClasses.length === 0 ||
      selectedCategories.length === 0
    ) {
      alert("Please fill all details and select classes & categories");
      return;
    }

    const requests = [];
    selectedClasses.forEach((cls) => {
      selectedCategories.forEach((cat) => {
        const newRoute = {
          className: cls,
          categoryName: cat,
          routeName: routeHeading,
          price: routeValue,
        };

        if (editId) {
          requests.push(
            axios.put(
              `${Port}/applyRouter/api/route-plans/${editId}`,
              newRoute
            )
          );
        } else {
          requests.push(
            axios.post(
              `${Port}/applyRouter/api/route-plans`,
              newRoute
            )
          );
        }
      });
    });

    Promise.all(requests)
      .then(() => {
        fetchRoutePlans();
        resetForm();
      })
      .catch((err) => console.error("Error saving route plan:", err));
  };

  /** Reset Form */
  const resetForm = () => {
    setSelectedClasses([]);
    setSelectedCategories([]);
    setRouteHeading("");
    setRouteValue("");
    setEditId(null);
  };

  /** Edit Route */
  const handleEdit = (route) => {
    setEditId(route.id);
    setRouteHeading(route.route_name || route.routeName);
    setRouteValue(route.price);
    setSelectedClasses([route.class_name || route.className]);
    setSelectedCategories([route.category_name || route.categoryName]);
  };

  /** Delete Route */
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this route plan?")) {
      axios
        .delete(`${Port}/applyRouter/api/route-plans/${id}`)
        .then(() => fetchRoutePlans())
        .catch((err) => console.error("Error deleting route plan:", err));
    }
  };

  return (
    <MainLayout>
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">
        Configure Route Plan
      </h1>

      {/* Route Heading & Value */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-medium">Select Route Heading</label>
          <select
            className="border p-2 rounded w-full"
            value={routeHeading}
            onChange={(e) => setRouteHeading(e.target.value)}
          >
            <option value="">-- Select Route --</option>
            {routeOptions.map((route, idx) => (
              <option key={idx} value={route}>
                {route}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Route Value (Price)</label>
          <input
            type="number"
            className="border p-2 rounded w-full"
            placeholder="Enter Price"
            value={routeValue}
            onChange={(e) => setRouteValue(e.target.value)}
          />
        </div>
      </div>

      {/* Classes & Categories */}
      <div className="grid grid-cols-2 gap-6">
        {/* Classes */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Choose Classes</h2>
          <div className="flex mb-2">
            <input
              type="text"
              className="border p-2 rounded w-full mr-2"
              placeholder="Add new class"
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
            />
            <button
              onClick={handleAddClass}
              className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
            >
              Add
            </button>
          </div>
          <ul className="max-h-48 overflow-y-auto">
            {classList.map((cls, index) => (
              <li key={index} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={selectedClasses.includes(cls)}
                  onChange={() =>
                    toggleSelection(cls, setSelectedClasses, selectedClasses)
                  }
                  className="mr-2"
                />
                {cls}
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Choose Category</h2>
          <div className="flex mb-2">
            <input
              type="text"
              className="border p-2 rounded w-full mr-2"
              placeholder="Add new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button
              onClick={handleAddCategory}
              className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
            >
              Add
            </button>
          </div>
          <ul className="max-h-48 overflow-y-auto">
            {categories.map((cat, index) => (
              <li key={index} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() =>
                    toggleSelection(
                      cat,
                      setSelectedCategories,
                      selectedCategories
                    )
                  }
                  className="mr-2"
                />
                {cat}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          {editId ? "Update" : "Save"}
        </button>
      </div>

      {/* Routes Table */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Applied Routes</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border border-gray-300 p-2">Class Name</th>
              <th className="border border-gray-300 p-2">Category Name</th>
              <th className="border border-gray-300 p-2">Route Name</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {routesTable.length > 0 ? (
              routesTable.map((route, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-300 p-2">
                    {route.class_name || route.className}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {route.category_name || route.categoryName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {route.route_name || route.routeName}
                  </td>
                  <td className="border border-gray-300 p-2">{route.price}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      onClick={() => handleEdit(route)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(route.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-2 text-gray-500">
                  No routes applied yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </MainLayout>
  );
};

export default ConfigureRoutePlan;
