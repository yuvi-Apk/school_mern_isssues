import React, { useEffect, useState } from "react";
import Port from "../Components/link.js"
const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [editingAccount, setEditingAccount] = useState(null);

  // Fetch all accounts
  const fetchAccounts = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/accounts");
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Delete account
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;
    try {
      await fetch(`${Port}/api/accounts/${id}`, { method: "DELETE" });
      fetchAccounts();
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  // Save updated account
  const handleUpdate = async () => {
    try {
      await fetch(`${Port}/api/accounts/${editingAccount.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAccount),
      });
      setEditingAccount(null);
      fetchAccounts();
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  // Track form changes for editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingAccount({ ...editingAccount, [name]: value });
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Accounts List</h2>

      {/* Account Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Group</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">City</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <tr key={acc.id}>
              <td className="p-2 border">{acc.name}</td>
              <td className="p-2 border">{acc.accountGroup}</td>
              <td className="p-2 border">{acc.email}</td>
              <td className="p-2 border">{acc.city}</td>
              <td className="p-2 border space-x-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => setEditingAccount(acc)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(acc.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Form (when user clicks Edit) */}
      {editingAccount && (
        <div className="mt-6 bg-gray-50 p-4 rounded shadow-lg">
          <h3 className="text-xl font-bold mb-4">Edit Account</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={editingAccount.name}
              onChange={handleEditChange}
              className="border p-2 rounded"
              placeholder="Name"
            />
            <input
              type="text"
              name="email"
              value={editingAccount.email}
              onChange={handleEditChange}
              className="border p-2 rounded"
              placeholder="Email"
            />
            <input
              type="text"
              name="city"
              value={editingAccount.city}
              onChange={handleEditChange}
              className="border p-2 rounded"
              placeholder="City"
            />
            <input
              type="text"
              name="accountGroup"
              value={editingAccount.accountGroup}
              onChange={handleEditChange}
              className="border p-2 rounded"
              placeholder="Group"
            />
          </div>

          <div className="mt-4 text-right">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleUpdate}
            >
              Save Changes
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded ml-2"
              onClick={() => setEditingAccount(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountList;
