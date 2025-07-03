import React from "react";

const ViewApplicationModal = ({ application, onClose, onApprove, onReject }) => {
  if (!application) return null;

  const {
    name,
    date_of_birth,
    time_of_birth,
    place_of_birth,
    height,
    birth_star,
    zodiac_sign,
    gothram,
    current_living,
    educational_details,
    designation,
    company,
    previous_work_experience,
    fathers_name,
    fathers_father_name,
    mothers_name,
    mothers_father_name,
    siblings,
    email_id,
    contact_no1,
    contact_no2,
    main_photo_url,
    side_photo_url,
    approved_at
  } = application;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-y-auto p-6">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Application Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Date of Birth:</strong> {date_of_birth}</p>
          <p><strong>Time of Birth:</strong> {time_of_birth}</p>
          <p><strong>Place of Birth:</strong> {place_of_birth}</p>
          <p><strong>Height:</strong> {height}</p>
          <p><strong>Birth Star:</strong> {birth_star}</p>
          <p><strong>Zodiac Sign:</strong> {zodiac_sign}</p>
          <p><strong>Gothram:</strong> {gothram}</p>
          <p><strong>Current Living:</strong> {current_living}</p>
          <p><strong>Educational Details:</strong> {educational_details}</p>
          <p><strong>Designation:</strong> {designation}</p>
          <p><strong>Company:</strong> {company}</p>
          <p><strong>Previous Work Experience:</strong> {previous_work_experience}</p>
          <p><strong>Father's Name:</strong> {fathers_name}</p>
          <p><strong>Father's Father Name:</strong> {fathers_father_name}</p>
          <p><strong>Mother's Name:</strong> {mothers_name}</p>
          <p><strong>Mother's Father Name:</strong> {mothers_father_name}</p>
          <p><strong>Siblings:</strong> {siblings}</p>
          <p><strong>Email ID:</strong> {email_id}</p>
          <p><strong>Contact No 1:</strong> {contact_no1}</p>
          <p><strong>Contact No 2:</strong> {contact_no2}</p>
        </div>

        <div className="flex gap-8 my-6">
          {main_photo_url && (
            <div>
              <p className="font-semibold mb-1">Main Photo</p>
              <img
                src={`http://localhost:5050/uploads/${main_photo_url}`}
                alt="Main"
                className="w-40 h-40 object-cover border"
              />
            </div>
          )}
          {side_photo_url && (
            <div>
              <p className="font-semibold mb-1">Side Photo</p>
              <img
                src={`http://localhost:5050/uploads/${side_photo_url}`}
                alt="Side"
                className="w-40 h-40 object-cover border"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Close
          </button>
          {!approved_at && (
            <>
              <button
                onClick={() => onApprove(application.unique_id)}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Approve
              </button>
              <button
                onClick={() => onReject(application.unique_id)}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewApplicationModal;
