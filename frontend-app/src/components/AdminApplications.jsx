import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditApplicationModal from "./EditApplicationModal";
import ViewApplicationModal from "./ViewApplicationModal";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [editingApplication, setEditingApplication] = useState(null);
  const [viewingApplication, setViewingApplication] = useState(null);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [rejectionNote, setRejectionNote] = useState("");

  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/applications`);
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin-login";
  };

  const openRejectModal = (id) => {
    setSelectedId(id);
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    try {
      await axios.post(`${BASE_URL}/api/admin/reject/${selectedId}`, {
        rejection_note: rejectionNote,
      });
      toast.success("Application rejected with note");
      setShowRejectModal(false);
      fetchApplications();
    } catch (err) {
      toast.error("Rejection failed");
    }
  };

  const handleApprove = async (unique_id) => {
    await fetch(`${BASE_URL}/api/admin/approve/${unique_id}`, {
      method: "POST",
    });
    await logAdminAction("approve", unique_id);
    fetchApplications();
    setViewingApplication(null);
  };

  const handleDelete = async (unique_id) => {
    await fetch(`${BASE_URL}/api/admin/application/${unique_id}`, {
      method: "DELETE",
    });
    await logAdminAction("delete", unique_id);
    fetchApplications();
  };

  const handleSaveEdit = async (updatedData, photoFiles) => {
    try {
      const formData = new FormData();
      Object.keys(updatedData).forEach((key) => {
        formData.append(key, updatedData[key]);
      });

      if (photoFiles.main_photo) {
        formData.append("main_photo", photoFiles.main_photo);
      }
      if (photoFiles.side_photo) {
        formData.append("side_photo", photoFiles.side_photo);
      }

      const response = await fetch(`${BASE_URL}/api/admin/application/${updatedData.unique_id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const result = await response.json();
      if (result.success) {
        await logAdminAction("edit", updatedData.unique_id);
        setEditingApplication(null);
        fetchApplications();
      } else {
        alert("Failed to update application.");
      }
    } catch (err) {
      console.error("Edit error:", err);
      alert("An error occurred while saving changes.");
    }
  };

  const logAdminAction = async (action, unique_id) => {
    await fetch(`${BASE_URL}/api/admin/log-action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        admin_name: "admin",
        action,
        application_unique_id: unique_id,
      }),
    });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Applications</h2>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Back
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">Unique ID</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Gender</th>
              <th className="px-4 py-2 border-b">Status</th>
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
                  {app.approved_at ? "Approved" : "Pending"}
                </td>
                <td className="px-4 py-2 border-b space-x-2">
                  {app.approved_at ? (
                    <>
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                        onClick={() => setEditingApplication(app)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => handleDelete(app.unique_id)}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                        onClick={() => setViewingApplication(app)}
                      >
                        View
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => openRejectModal(app.unique_id)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingApplication && (
        <EditApplicationModal
          application={editingApplication}
          onClose={() => setEditingApplication(null)}
          onSave={handleSaveEdit}
        />
      )}

      {viewingApplication && (
        <ViewApplicationModal
          application={viewingApplication}
          onClose={() => setViewingApplication(null)}
          onApprove={handleApprove}
          onReject={openRejectModal}
        />
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-lg">
            <h2 className="text-xl font-semibold mb-3">Reason for Rejection</h2>
            <textarea
              className="w-full border rounded p-2 text-sm"
              placeholder="Write reason to help applicant update..."
              rows={4}
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowRejectModal(false)} className="bg-gray-500 text-white px-4 py-1 rounded">Cancel</button>
              <button onClick={handleReject} className="bg-red-600 text-white px-4 py-1 rounded">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;