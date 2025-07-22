import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [uploadingId, setUploadingId] = useState(null);
  const navigate = useNavigate();
  const contact = localStorage.getItem("main_contact_number");

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/applications?main_contact_number=${contact}`);
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error("Error fetching applications", err);
      toast.error("Failed to fetch applications");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handlePhotoUpload = async (e, id, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setUploadingId(id);
      await axios.post(`${BASE_URL}/api/upload-photo/${id}?type=${type}`, formData);
      toast.success("Photo uploaded successfully!");
      fetchApplications();
    } catch (err) {
      console.error("Error uploading photo", err);
      toast.error("Upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  const handleResubmit = async (app) => {
    try {
      await axios.put(`${BASE_URL}/api/resubmit/${app.main_contact_number}`, app);
      toast.success("Application updated and resubmitted!");
      fetchApplications();
      navigate("/manage-applications");
    } catch (err) {
      toast.error("Failed to resubmit application.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate("/home")}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ⬅ Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Manage Applications
      </h1>

      {applications.length === 0 ? (
        <p className="text-center text-gray-600">No applications found.</p>
      ) : (
        applications.map((app, index) => (
          <div key={index} className="bg-white p-6 mb-8 rounded-lg shadow-md border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {app.name}
                <span className="text-sm text-gray-600 ml-2">
                  • ID: <span className="font-mono">{app.unique_id || "—"}</span> (
                  <span
                    className={`font-semibold ${
                      app.status === "Rejected" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {app.status || "Pending"}
                  </span>)
                </span>
              </h2>
              <button
                onClick={() => navigate(`/edit-application/${app.main_contact_number}`)}
                className="bg-yellow-400 text-white px-3 py-1 text-sm rounded hover:bg-yellow-500"
              >
                ✏️ Edit
              </button>
            </div>

            {/* Show rejection reason if rejected */}
            {app.status === "Rejected" && app.rejection_note && (
              <p className="text-sm text-red-600 italic mb-3">
                Reason: {app.rejection_note}
              </p>
            )}

            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <p><strong>DOB:</strong> {new Date(app.date_of_birth).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
                <p><strong>Time of Birth:</strong> {app.time_of_birth}</p>
                <p><strong>Place of Birth:</strong> {app.place_of_birth}</p>
                <p><strong>Height:</strong> {app.height}</p>
                <p><strong>Birth Star:</strong> {app.birth_star}</p>
                <p><strong>Zodiac Sign:</strong> {app.zodiac_sign}</p>
                <p><strong>Gothram:</strong> {app.gothram}</p>
              </div>
              <div>
                <p><strong>Current Living:</strong> {app.current_living}</p>
                <p><strong>Designation:</strong> {app.designation}</p>
                <p><strong>Company:</strong> {app.company}</p>
                <p><strong>Experience:</strong> {app.previous_work_experience}</p>
                <p><strong>Education:</strong> {app.educational_details}</p>
                <p><strong>Email:</strong> {app.email_id}</p>
                <p><strong>Main Contact:</strong> {app.main_contact_number}</p>
              </div>
              <div>
                <p><strong>Alt Contact:</strong> {app.alternative_contact_number}</p>
                <p><strong>Father:</strong> {app.fathers_name}</p>
                <p><strong>Father’s Father:</strong> {app.fathers_father_name}</p>
                <p><strong>Mother:</strong> {app.mothers_name}</p>
                <p><strong>Mother’s Father:</strong> {app.mothers_father_name}</p>
                <p><strong>Siblings:</strong> {app.siblings}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mt-6">
              <div className="flex-1 border p-4 rounded shadow bg-white text-center">
                <h4 className="font-semibold mb-2 text-gray-700">Main Photo</h4>
                {app.main_photo_url ? (
                  <img
                    src={`${BASE_URL}/uploads/${app.main_photo_url?.replace(/\\/g, "/")}`}
                    alt="Main"
                    className="w-full max-h-64 object-contain border rounded"
                  />
                ) : (
                  <p className="text-gray-500 mb-2">No main photo uploaded.</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="mt-3 text-sm"
                  onChange={(e) => handlePhotoUpload(e, app.main_contact_number, "main")}
                  disabled={uploadingId === app.main_contact_number}
                />
              </div>

              <div className="flex-1 border p-4 rounded shadow bg-white text-center">
                <h4 className="font-semibold mb-2 text-gray-700">Side Photo</h4>
                {app.side_photo_url ? (
                  <img
                    src={`${BASE_URL}/uploads/${app.side_photo_url?.replace(/\\/g, "/")}`}
                    alt="Side"
                    className="w-full max-h-64 object-contain border rounded"
                  />
                ) : (
                  <p className="text-gray-500 mb-2">No side photo uploaded.</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="mt-3 text-sm"
                  onChange={(e) => handlePhotoUpload(e, app.main_contact_number, "side")}
                  disabled={uploadingId === app.main_contact_number}
                />
              </div>
            </div>

            {/* ✅ Resubmit button */}
            {app.status === "Rejected" && (
              <button
                onClick={() => handleResubmit(app)}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Resubmit Application
              </button>
            )}

            <div className="text-sm text-gray-500 mt-4">
              <p><strong>Submitted:</strong> {app.created_at?.slice(0, 10)}</p>
              <p><strong>Approved:</strong> {app.approved_at?.slice(0, 10) || "—"}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageApplications;
