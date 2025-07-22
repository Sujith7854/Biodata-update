import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReadOnlyViewModal from "./ReadonlyViewModal.jsx";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RejectedApplications = () => {
  const [applications, setApplications] = useState([]);
  const [viewingApplication, setViewingApplication] = useState(null);
  const navigate = useNavigate();

  const fetchRejectedApplications = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/rejected-applications`);
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleAccept = async (unique_id) => {
    try {
      await fetch(`${BASE_URL}/api/admin/rejected/accept/${unique_id}`, {
        method: "POST",
      });
      fetchRejectedApplications(); // refresh list
    } catch (err) {
      console.error("Accept error:", err);
    }
  };

  useEffect(() => {
    fetchRejectedApplications();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Rejected Applications</h2>
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Back to Home
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border-b">Unique ID</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Gender</th>
              <th className="px-4 py-2 border-b">Rejected On</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.unique_id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{app.unique_id}</td>
                <td className="px-4 py-2 border-b">{app.name}</td>
                <td className="px-4 py-2 border-b">{app.gender || "-"}</td>
                <td className="px-4 py-2 border-b">
                  {new Date(app.rejected_at).toLocaleString()}
                </td>
                <td className="px-4 py-2 border-b space-x-2">
                  <button
                    onClick={() => setViewingApplication(app)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleAccept(app.unique_id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No rejected applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewingApplication && (
        <ReadOnlyViewModal
          application={viewingApplication}
          onClose={() => setViewingApplication(null)}
          onApprove={() => handleAccept(viewingApplication.unique_id)} // Optional reuse
          onReject={() => {}} // not needed for rejected view
        />
      )}
    </div>
  );
};

export default RejectedApplications;
