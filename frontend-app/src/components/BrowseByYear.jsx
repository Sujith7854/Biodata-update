import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ViewApplicationModal from "./ViewApplicationModal";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


const BrowseByYear = () => {
  const { gender, year, id } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/applications/by-year/${year}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setApplications(data.applications);
      });
  }, [year]);

  useEffect(() => {
    if (id && applications.length > 0) {
      const app = applications.find((a) => a.unique_id === id);
      if (app) setSelectedApplication(app);
    } else {
      setSelectedApplication(null);
    }
  }, [id, applications]);

  const handleBack = () => {
    navigate(`/browse/${gender}`);
  };

  const handleClickApp = (app) => {
    navigate(`/browse/${gender}/${year}/${app.unique_id}`);
  };

  const handleCloseModal = () => {
    navigate(`/browse/${gender}/${year}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Approved Applications for {year}
            </h1>
            <p className="text-gray-600 mt-1">
              {applications.length} approved application
              {applications.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            <span className="text-lg">←</span> Back
          </button>
        </div>

        {applications.map((app) => (
          <div
            key={app.id}
            onClick={() => handleClickApp(app)}
            className="bg-white p-6 rounded shadow mb-6 border border-gray-200 cursor-pointer hover:shadow-lg transition"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{app.name}</h2>
              <div className="flex items-center gap-3 mt-2 md:mt-0">
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  Approved
                </span>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-mono">
                  ID: {app.unique_id}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
              <div>
                <p><strong>Date of Birth:</strong> {new Date(app.date_of_birth).toLocaleDateString("en-GB")}</p>
                <p><strong>Time of Birth:</strong> {app.time_of_birth}</p>
                <p><strong>Place of Birth:</strong> {app.place_of_birth}</p>
                <p><strong>Height:</strong> {app.height}</p>
                <p><strong>Birth Star:</strong> {app.birth_star}</p>
                <p><strong>Zodiac Sign:</strong> {app.zodiac_sign}</p>
              </div>
              <div>
                <p><strong>Email:</strong> {app.email_id}</p>
                <p><strong>Contact:</strong> {app.contact_no1}</p>
                <p><strong>Designation:</strong> {app.designation}</p>
                <p><strong>Company:</strong> {app.company}</p>
                <p><strong>Current Living:</strong> {app.current_living}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              {app.main_photo_url && (
                <div className="flex-1 text-center">
                  <p className="text-sm font-semibold mb-2">Main Photo</p>
                  <img
                    src={`${BASE_URL}/uploads/${app.main_photo_url}`}
  alt="Main"
  className="w-full h-[180px] object-contain border rounded"
                  />
                </div>
              )}
              {app.side_photo_url && (
                <div className="flex-1 text-center">
                  <p className="text-sm font-semibold mb-2">Side Photo</p>
                  <img
                     src={`${BASE_URL}/uploads/${app.side_photo_url}`}
  alt="Side"
  className="w-full h-[180px] object-contain border rounded"
                  />
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500">
              <p>Submitted: {new Date(app.created_at).toLocaleDateString("en-GB")}</p>
              <p>Approved: {new Date(app.approved_at).toLocaleDateString("en-GB")}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedApplication && (
        <ViewApplicationModal
          application={selectedApplication}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default BrowseByYear;
