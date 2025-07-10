import React, { useState } from "react";

const AccessRequestEditModal = ({ request, onClose, onSave }) => {
  const [form, setForm] = useState({ ...request });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Edit Access Request</h2>
        {["full_name", "phone_number", "country", "state", "city"].map((field) => (
          <div key={field} className="mb-3">
            <label className="block text-gray-700 mb-1 capitalize">
              {field.replace("_", " ")}
            </label>
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}
        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessRequestEditModal;
