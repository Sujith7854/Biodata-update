import React, { useState } from "react";

const ApplicationModal = ({ application, onClose }) => {
  const [zoomedImage, setZoomedImage] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const images = [
    application.main_photo_url && `${BASE_URL}/uploads/${application.main_photo_url}`,
    application.side_photo_url && `${BASE_URL}/uploads/${application.side_photo_url}`,
  ].filter(Boolean);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleZoom = (index) => {
    setActiveImageIndex(index);
    setZoomedImage(images[index]);
  };

  const handleImageNav = (direction) => {
    const newIndex =
      (activeImageIndex + direction + images.length) % images.length;
    setActiveImageIndex(newIndex);
    setZoomedImage(images[newIndex]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4">{application.name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p><strong>Date of Birth:</strong> {application.date_of_birth?.slice(0, 10)}</p>
            <p><strong>Time of Birth:</strong> {application.time_of_birth}</p>
            <p><strong>Place of Birth:</strong> {application.place_of_birth}</p>
            <p><strong>Height:</strong> {application.height}</p>
            <p><strong>Birth Star:</strong> {application.birth_star}</p>
            <p><strong>Zodiac Sign:</strong> {application.zodiac_sign}</p>
            <p><strong>Gothram:</strong> {application.gothram}</p>
            <p><strong>Current Living:</strong> {application.current_living}</p>
            <p><strong>Educational Details:</strong> {application.educational_details}</p>
            <p><strong>Designation:</strong> {application.designation}</p>
            <p><strong>Company:</strong> {application.company}</p>
            <p><strong>Previous Work Experience:</strong> {application.previous_work_experience}</p>
          </div>
          <div>
            <p><strong>Father's Name:</strong> {application.fathers_name}</p>
            <p><strong>Father's Father Name:</strong> {application.fathers_father_name}</p>
            <p><strong>Mother's Name:</strong> {application.mothers_name}</p>
            <p><strong>Mother's Father Name:</strong> {application.mothers_father_name}</p>
            <p><strong>Siblings:</strong> {application.siblings}</p>
            <p><strong>Email:</strong> {application.email_id}</p>
            <p><strong>Contact 1:</strong> {application.contact_no1}</p>
            <p><strong>Contact 2:</strong> {application.contact_no2}</p>
            <p><strong>Submitted:</strong> {application.created_at?.slice(0, 10)}</p>
            <p><strong>Approved:</strong> {application.approved_at?.slice(0, 10)}</p>
          </div>
        </div>

        {images.length > 0 && (
          <div className="flex gap-4 justify-center mt-4">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Photo ${index + 1}`}
                onClick={() => handleZoom(index)}
                className="w-32 h-32 object-cover rounded shadow cursor-pointer hover:scale-105 transition"
              />
            ))}
          </div>
        )}
      </div>

      {/* Zoomed Image Overlay */}
      {zoomedImage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-80">
          <div className="relative max-w-3xl">
            <button
              className="absolute top-2 right-2 text-white text-2xl"
              onClick={() => setZoomedImage(null)}
            >
              &times;
            </button>
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-2xl"
              onClick={() => handleImageNav(-1)}
            >
              &#10094;
            </button>
            <img src={zoomedImage} alt="Zoomed" className="rounded max-h-[80vh]" />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-2xl"
              onClick={() => handleImageNav(1)}
            >
              &#10095;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationModal;
