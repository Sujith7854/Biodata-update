import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApplicationModal from "./ApplicationModal";

const BrowseByYear = () => {
  const { year } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5050/api/applications/by-year/${year}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setApplications(data.applications);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [year]);

  const handleClick = (app) => setSelectedApp(app);
  const handleClose = () => setSelectedApp(null);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Approved Applications for {year}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            ← Back
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          {applications.length} approved application(s) found
        </p>

        {applications.map((app) => (
          <div
            key={app.unique_id}
            className="bg-white shadow rounded-lg p-6 mb-4 cursor-pointer hover:shadow-md"
            onClick={() => handleClick(app)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{app.name}</h2>
              <div className="flex gap-2 items-center">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  Approved
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-mono">
                  ID: {app.unique_id}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <p><strong>Date of Birth:</strong> {new Date(app.date_of_birth).toLocaleDateString()}</p>
                <p><strong>Time of Birth:</strong> {app.time_of_birth}</p>
                <p><strong>Place of Birth:</strong> {app.place_of_birth}</p>
                <p><strong>Height:</strong> {app.height}</p>
                <p><strong>Birth Star:</strong> {app.birth_star}</p>
                <p><strong>Zodiac Sign:</strong> {app.zodiac_sign}</p>
                <p><strong>Educational Details:</strong> {app.educational_details}</p>
                <p className="text-gray-400 text-sm mt-2">
                  Submitted: {new Date(app.created_at).toLocaleDateString()}
                </p>
                <p className="text-gray-400 text-sm">
                  Approved: {new Date(app.approved_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p><strong>Email:</strong> {app.email_id}</p>
                <p><strong>Contact:</strong> {app.contact_no1}</p>
                <p><strong>Designation:</strong> {app.designation}</p>
                <p><strong>Company:</strong> {app.company}</p>
                <p><strong>Current Living:</strong> {app.current_living}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedApp && (
        <ApplicationModal application={selectedApp} onClose={handleClose} />
      )}
    </div>
  );
};

export default BrowseByYear;
