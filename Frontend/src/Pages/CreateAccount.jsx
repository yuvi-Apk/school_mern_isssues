import { useState } from "react";

import MainLayout from "../layout/MainLayout";
import Port from "../Components/link.js"
const CreateAccount = () => {
  
  const [form, setForm] = useState({
    name: "",
    printAs: "",
    group: "Income (Indirect)",
    openingBalance: "",
    drCr: "Dr.",
    taxNo: "",
    address1: "",
    address2: "",
    city: "",
    pincode: "",
    state: "",
    stateCode: "",
    mobile: "",
    phone: "",
    email: "",
    contactPerson: "",
    panCard: "",
  });

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = async () => {
  try {
     const response = await fetch(`${Port}/api/accounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Account created successfully!");
      console.log("Saved Data:", result);

      // Reset the form
      setForm({
        name: "",
        printAs: "",
        group: "Income (Indirect)",
        openingBalance: "",
        drCr: "Dr.",
        taxNo: "",
        address1: "",
        address2: "",
        city: "",
        pincode: "",
        state: "",
        stateCode: "",
        mobile: "",
        phone: "",
        email: "",
        contactPerson: "",
        panCard: "",
      });
    } else {
      alert(result.error || "Failed to create account");
    }
  } catch (error) {
    console.error("Error saving account:", error);
    alert("An error occurred while saving the account.");
  }
};

  return (
    <MainLayout>
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
     

        <main className="p-4">
          <div className="bg-white p-6 rounded shadow max-w-5xl mx-auto">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold">Create Account</h2>
              <div className="space-x-2">
                <button className="bg-gray-200 px-4 py-1 rounded">
                  Settings
                </button>
                <button className="bg-red-500 text-white px-4 py-1 rounded">
                  Delete
                </button>
                <button className="bg-blue-500 text-white px-4 py-1 rounded"
                onClick={()=>window.location.href="/accounts"}>
                  List
                </button>
                <button className="bg-gray-600 text-white px-4 py-1 rounded">
                  Close
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="printAs"
                placeholder="Print As"
                value={form.printAs}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />

              <div className="grid md:grid-cols-5 gap-4">
                <input
                  type="text"
                  name="group"
                  value={form.group}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <button className="bg-blue-500 text-white px-3 py-2 rounded">
                  +
                </button>
                <button className="bg-yellow-500 text-white px-3 py-2 rounded">
                  ✎
                </button>
                <input
                  type="text"
                  name="openingBalance"
                  placeholder="Opening Bal."
                  value={form.openingBalance}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <select
                  name="drCr"
                  value={form.drCr}
                  onChange={handleChange}
                  className="border p-2 rounded"
                >
                  <option value="Dr.">Dr.</option>
                  <option value="Cr.">Cr.</option>
                </select>
              </div>

              <input
                type="text"
                name="taxNo"
                placeholder="Tax No. (GSTIN / VAT No.)"
                value={form.taxNo}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="address1"
                placeholder="Address Line 1"
                value={form.address1}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="address2"
                placeholder="Address Line 2"
                value={form.address2}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />

              <div className="grid md:grid-cols-4 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="stateCode"
                  placeholder="State Code"
                  value={form.stateCode}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="mobile"
                  placeholder="Mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="contactPerson"
                  placeholder="Contact Person"
                  value={form.contactPerson}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="panCard"
                  placeholder="PAN Card No."
                  value={form.panCard}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
              </div>

              <div className="text-right">
                <button
                  onClick={handleSave}
                  className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default CreateAccount;
