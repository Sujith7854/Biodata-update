import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditApplication = () => {
  const { main_contact_number } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email_id: "",
    date_of_birth: "",
    time_of_birth: "",
    place_of_birth: "",
    height: "",
    birth_star: "",
    zodiac_sign: "",
    gothram: "",
    current_living: "",
    designation: "",
    company: "",
    previous_work_experience: "",
    educational_details: "",
    alternative_contact_number: "",
    fathers_name: "",
    fathers_father_name: "",
    mothers_name: "",
    mothers_father_name: "",
    siblings: "",
    main_photo_url: "",
    side_photo_url: "",
    main_contact_number: "",
  });

  const [mainPhoto, setMainPhoto] = useState(null);
  const [sidePhoto, setSidePhoto] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/applications?main_contact_number=${main_contact_number}`);
        if (res.data.applications?.length > 0) {
          setFormData(res.data.applications[0]);
        } else {
          toast.error("Application not found");
        }
      } catch (err) {
        toast.error("Failed to fetch application");
      }
    };

    fetchData();
  }, [main_contact_number]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoUpload = async (type) => {
    const file = type === "main" ? mainPhoto : sidePhoto;
    if (!file) {
      toast.warning("No photo selected");
      return;
    }

    const photoForm = new FormData();
    photoForm.append("photo", file);

    try {
      const res = await axios.post(`${BASE_URL}/api/upload-photo/${main_contact_number}?type=${type}`, photoForm);
      toast.success(`${type === "main" ? "Main" : "Side"} photo uploaded`);
      window.location.reload(); // refresh photo
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/api/applications/update`, formData);
      toast.success("Application updated successfully");
      navigate("/manage-applications");
    } catch (err) {
      toast.error("Failed to update application");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white shadow rounded-md">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/manage-applications")}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ⬅ Back to Manage Applications
      </button>

      <h2 className="text-3xl font-bold text-center mb-8">✏️ Edit Application</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="p-2 border rounded" />
        <input name="email_id" value={formData.email_id} onChange={handleChange} placeholder="Email" className="p-2 border rounded" />
        <input name="date_of_birth" value={formData.date_of_birth?.slice(0, 10)} onChange={handleChange} type="date" className="p-2 border rounded" />
        <input name="time_of_birth" value={formData.time_of_birth} onChange={handleChange} type="time" className="p-2 border rounded" />
        <input name="place_of_birth" value={formData.place_of_birth} onChange={handleChange} placeholder="Place of Birth" className="p-2 border rounded" />
        <input name="height" value={formData.height} onChange={handleChange} placeholder="Height" className="p-2 border rounded" />
        <input name="birth_star" value={formData.birth_star} onChange={handleChange} placeholder="Birth Star" className="p-2 border rounded" />
        <input name="zodiac_sign" value={formData.zodiac_sign} onChange={handleChange} placeholder="Zodiac" className="p-2 border rounded" />
        <input name="gothram" value={formData.gothram} onChange={handleChange} placeholder="Gothram" className="p-2 border rounded" />
        <input name="current_living" value={formData.current_living} onChange={handleChange} placeholder="Current Living" className="p-2 border rounded" />
        <input name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation" className="p-2 border rounded" />
        <input name="company" value={formData.company} onChange={handleChange} placeholder="Company" className="p-2 border rounded" />
        <input name="previous_work_experience" value={formData.previous_work_experience} onChange={handleChange} placeholder="Experience" className="p-2 border rounded" />
        <input name="educational_details" value={formData.educational_details} onChange={handleChange} placeholder="Education" className="p-2 border rounded" />
        <input name="alternative_contact_number" value={formData.alternative_contact_number} onChange={handleChange} placeholder="Alt Contact" className="p-2 border rounded" />
        <input name="fathers_name" value={formData.fathers_name} onChange={handleChange} placeholder="Father" className="p-2 border rounded" />
        <input name="fathers_father_name" value={formData.fathers_father_name} onChange={handleChange} placeholder="Father's Father" className="p-2 border rounded" />
        <input name="mothers_name" value={formData.mothers_name} onChange={handleChange} placeholder="Mother" className="p-2 border rounded" />
        <input name="mothers_father_name" value={formData.mothers_father_name} onChange={handleChange} placeholder="Mother's Father" className="p-2 border rounded" />
        <input name="siblings" value={formData.siblings} onChange={handleChange} placeholder="Siblings" className="p-2 border rounded" />

        {/* 📷 Photo Upload */}
       <div className="grid md:grid-cols-2 gap-6 mt-6">
  {/* 🔷 Main Photo Section */}
  <div className="text-center">
    <h4 className="font-semibold mb-2">Main Photo</h4>
    {formData.main_photo_url ? (
      <img
        src={`${BASE_URL}/uploads/${formData.main_photo_url.replace(/\\/g, "/")}`}
        alt="Main"
        className="w-full h-[180px] object-contain border rounded shadow"
      />
    ) : (
      <p className="text-sm text-gray-500 mb-2">No main photo uploaded.</p>
    )}

    <input
      type="file"
      accept="image/*"
      onChange={(e) => setMainPhoto(e.target.files[0])}
      className="mt-2"
    />
    <button
      type="button"
      onClick={() => handlePhotoUpload("main")}
      className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
    >
      Update Main Photo
    </button>
  </div>

  {/* 🔷 Side Photo Section */}
  <div className="text-center">
    <h4 className="font-semibold mb-2">Side Photo</h4>
    {formData.side_photo_url ? (
      <img
        src={`${BASE_URL}/uploads/${formData.side_photo_url.replace(/\\/g, "/")}`}
        alt="Side"
        className="w-full h-[180px] object-contain border rounded shadow"
      />
    ) : (
      <p className="text-sm text-gray-500 mb-2">No side photo uploaded.</p>
    )}

    <input
      type="file"
      accept="image/*"
      onChange={(e) => setSidePhoto(e.target.files[0])}
      className="mt-2"
    />
    <button
      type="button"
      onClick={() => handlePhotoUpload("side")}
      className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
    >
      Update Side Photo
    </button>
  </div>
</div>


        <div className="col-span-2 text-center mt-6">
          <button type="submit" className="bg-green-600 text-white px-8 py-2 rounded text-lg">✅ Update Application</button>
        </div>
      </form>
    </div>
  );
};

export default EditApplication;
