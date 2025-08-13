import React, { useState } from "react";
import MainLayout from "../layout/MainLayout";

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
    panCardNo: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Account Info:", form);
  };

  return (
    <MainLayout>
    <div className="p-6 bg-white">
      <h2 className="text-2xl font-bold text-cyan-700 mb-6">Create Account</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2"
        />
        <input
          name="printAs"
          value={form.printAs}
          onChange={handleChange}
          placeholder="Print As"
          className="border p-2"
        />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <select
          name="group"
          value={form.group}
          onChange={handleChange}
          className="border p-2"
        >
          <option value="Income (Indirect)">Income (Indirect)</option>
          <option value="Expense (Direct)">Expense (Direct)</option>
          <option value="Liability">Liability</option>
        </select>
        <input
          name="openingBalance"
          value={form.openingBalance}
          onChange={handleChange}
          placeholder="Opening Bal."
          className="border p-2"
        />
        <select
          name="drCr"
          value={form.drCr}
          onChange={handleChange}
          className="border p-2"
        >
          <option value="Dr.">Dr.</option>
          <option value="Cr.">Cr.</option>
        </select>
        <input
          name="taxNo"
          value={form.taxNo}
          onChange={handleChange}
          placeholder="Tax No. (GSTIN / VAT No.)"
          className="border p-2"
        />
      </div>

      <input
        name="address1"
        value={form.address1}
        onChange={handleChange}
        placeholder="Address Line 1"
        className="border p-2 w-full mb-2"
      />
      <input
        name="address2"
        value={form.address2}
        onChange={handleChange}
        placeholder="Address Line 2"
        className="border p-2 w-full mb-4"
      />

      <div className="grid grid-cols-4 gap-4 mb-4">
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="border p-2"
        />
        <input
          name="pincode"
          value={form.pincode}
          onChange={handleChange}
          placeholder="Pincode"
          className="border p-2"
        />
        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="State"
          className="border p-2"
        />
        <input
          name="stateCode"
          value={form.stateCode}
          onChange={handleChange}
          placeholder="State Code"
          className="border p-2"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <input
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          placeholder="Mobile"
          className="border p-2"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border p-2"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          name="contactPerson"
          value={form.contactPerson}
          onChange={handleChange}
          placeholder="Contact Person"
          className="border p-2"
        />
        <input
          name="panCardNo"
          value={form.panCardNo}
          onChange={handleChange}
          placeholder="PAN Card No."
          className="border p-2"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
      >
        Save
      </button>
    </div>
    </MainLayout>
  );
};

export default CreateAccount;
