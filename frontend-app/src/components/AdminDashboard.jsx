import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import EditApplicationModal from "./EditApplicationModal";
import ViewApplicationModal from "./ViewApplicationModal";

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [editingApplication, setEditingApplication] = useState(null);
  const [viewingApplication, setViewingApplication] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchApplications = async () => {
    const res = await fetch("http://localhost:5050/api/admin/applications");
    const data = await res.json();
    setApplications(data.applications);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin-login";
  };

  const handleApprove = async (unique_id) => {
    await fetch(`http://localhost:5050/api/admin/approve/${unique_id}`, {
      method: "POST",
    });
    await logAdminAction("approve", unique_id);
    fetchApplications();
    setViewingApplication(null);
  };

  const handleReject = async (unique_id) => {
    await fetch(`http://localhost:5050/api/admin/reject/${unique_id}`, {
      method: "POST",
    });
    await logAdminAction("reject", unique_id);
    fetchApplications();
    setViewingApplication(null);
  };

  const handleDelete = async (unique_id) => {
    await fetch(`http://localhost:5050/api/admin/delete/${unique_id}`, {
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

      const response = await fetch(
        `http://localhost:5050/api/admin/application/${updatedData.unique_id}`,
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
    await fetch("http://localhost:5050/api/admin/log-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        admin_name: "admin",
        action,
        application_unique_id: unique_id,
      }),
    });
  };

  const filteredApps = applications.filter((app) => {
    const matchStatus =
      filter === "all" ||
      (filter === "pending" && !app.approved_at) ||
      (filter === "approved" && app.approved_at) ||
      (filter === "rejected" && false); // Add logic if rejection is stored

    const matchSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.unique_id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchStatus && matchSearch;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Admin Dashboard</h2>
          <p className="text-gray-600">Welcome, Admin</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Tabs + Search */}
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          {["all", "pending", "approved", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1 rounded ${
                filter === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by name, email, or ID..."
          className="border rounded px-4 py-2 w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Application List */}
      <div className="bg-white border rounded-lg overflow-hidden">
        {filteredApps.map((app) => (
          <div
            key={app.unique_id}
            className="flex items-center justify-between border-b px-6 py-4"
          >
            <div>
              <h3 className="font-semibold">{app.name}</h3>
              <p className="text-sm text-gray-500">
                ID: {app.unique_id}
                <br />
                {app.designation} at {app.company}
              </p>
            </div>
            <div>
              <p className="text-sm">
                {app.email_id}
                <br />
                {app.contact_no1}
              </p>
            </div>
            <div>
              {app.approved_at ? (
                <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                  approved
                </span>
              ) : (
                <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full">
                  pending
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {new Date(app.created_at).toLocaleDateString("en-GB")}
            </div>
            <div className="flex space-x-3 text-sm">
              {app.approved_at ? (
                <>
                  <button
                    onClick={() => setEditingApplication(app)}
                    className="text-blue-600 flex items-center gap-1"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(app.unique_id)}
                    className="text-red-600 flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setViewingApplication(app)}
                  className="text-blue-600 flex items-center gap-1"
                >
                  <Eye size={16} /> View
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
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
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
