import React, { useState } from "react";

const EditApplicationModal = ({ application, onClose, onSave }) => {
  const [applicationData, setApplicationData] = useState(() => ({
    ...application,
    date_of_birth: application.date_of_birth?.split("T")[0] || "", // ✅ Fix for date input
  }));
  const [mainPhotoFile, setMainPhotoFile] = useState(null);
  const [sidePhotoFile, setSidePhotoFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplicationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(applicationData, {
      main_photo: mainPhotoFile,
      side_photo: sidePhotoFile,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-y-scroll py-8">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Edit Application</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input name="name" value={applicationData.name} onChange={handleChange} className="border p-2" placeholder="Name" />
            <input name="date_of_birth" value={applicationData.date_of_birth} onChange={handleChange} type="date" className="border p-2" />
            <input name="time_of_birth" value={applicationData.time_of_birth} onChange={handleChange} className="border p-2" placeholder="Time of Birth" />
            <input name="place_of_birth" value={applicationData.place_of_birth} onChange={handleChange} className="border p-2" placeholder="Place of Birth" />
            <input name="height" value={applicationData.height} onChange={handleChange} className="border p-2" placeholder="Height" />
            <input name="birth_star" value={applicationData.birth_star} onChange={handleChange} className="border p-2" placeholder="Birth Star" />
            <input name="zodiac_sign" value={applicationData.zodiac_sign} onChange={handleChange} className="border p-2" placeholder="Zodiac Sign" />
            <input name="gothram" value={applicationData.gothram} onChange={handleChange} className="border p-2" placeholder="Gothram" />
            <input name="current_living" value={applicationData.current_living} onChange={handleChange} className="border p-2" placeholder="Current Living" />
            <input name="educational_details" value={applicationData.educational_details} onChange={handleChange} className="border p-2" placeholder="Education" />
            <input name="designation" value={applicationData.designation} onChange={handleChange} className="border p-2" placeholder="Designation" />
            <input name="company" value={applicationData.company} onChange={handleChange} className="border p-2" placeholder="Company" />
            <input name="previous_work_experience" value={applicationData.previous_work_experience} onChange={handleChange} className="border p-2" placeholder="Previous Work" />
            <input name="fathers_name" value={applicationData.fathers_name} onChange={handleChange} className="border p-2" placeholder="Father's Name" />
            <input name="fathers_father_name" value={applicationData.fathers_father_name} onChange={handleChange} className="border p-2" placeholder="Father's Father Name" />
            <input name="mothers_name" value={applicationData.mothers_name} onChange={handleChange} className="border p-2" placeholder="Mother's Name" />
            <input name="mothers_father_name" value={applicationData.mothers_father_name} onChange={handleChange} className="border p-2" placeholder="Mother's Father Name" />
            <input name="siblings" value={applicationData.siblings} onChange={handleChange} className="border p-2" placeholder="Siblings" />
            <input name="email_id" value={applicationData.email_id} onChange={handleChange} type="email" className="border p-2" placeholder="Email ID" />
            <input name="contact_no1" value={applicationData.contact_no1} onChange={handleChange} className="border p-2" placeholder="Contact No 1" />
            <input name="contact_no2" value={applicationData.contact_no2} onChange={handleChange} className="border p-2" placeholder="Contact No 2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold mb-1">Current Main Photo:</p>
              {applicationData.main_photo_url && (
                <img
                  src={`http://localhost:5050/uploads/${applicationData.main_photo_url}`}
                  alt="Main"
                  className="w-40 h-40 object-cover border"
                />
              )}
              <input type="file" onChange={(e) => setMainPhotoFile(e.target.files[0])} className="mt-2" />
            </div>

            <div>
              <p className="text-sm font-semibold mb-1">Current Side Photo:</p>
              {applicationData.side_photo_url && (
                <img
                  src={`http://localhost:5050/uploads/${applicationData.side_photo_url}`}
                  alt="Side"
                  className="w-40 h-40 object-cover border"
                />
              )}
              <input type="file" onChange={(e) => setSidePhotoFile(e.target.files[0])} className="mt-2" />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditApplicationModal;