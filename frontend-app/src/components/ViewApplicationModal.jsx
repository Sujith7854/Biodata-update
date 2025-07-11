import React, { useEffect, useState, useRef } from "react";

const ViewApplicationModal = ({ application, onClose, onApprove, onReject }) => {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageRef = useRef(null);
  const touchStartX = useRef(null);
   const BASE_URL = import.meta.env.VITE_API_BASE_URL;


  if (!application) return null;

  const {
    name,
    gender,
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
    submitted_at,
    approved_at,
    unique_id,
  } = application;

  const images = [
    { src: main_photo_url, label: "Main Photo" },
    { src: side_photo_url, label: "Side Photo" },
  ].filter((img) => img.src);

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setIsImageOpen(true);
  };

  const closeImageModal = () => {
    setIsImageOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e) => {
    if (!isImageOpen) return;
    if (e.key === "ArrowRight") nextImage();
    else if (e.key === "ArrowLeft") prevImage();
    else if (e.key === "Escape") closeImageModal();
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    if (diffX > 50) prevImage();
    else if (diffX < -50) nextImage();
    touchStartX.current = null;
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isImageOpen]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-6xl w-full h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">View Application</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left section */}
          <div className="space-y-2 text-sm">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Gender:</strong> {gender}</p>
            <p><strong>Date of Birth:</strong> {date_of_birth}</p>
            <p><strong>Time of Birth:</strong> {time_of_birth}</p>
            <p><strong>Place of Birth:</strong> {place_of_birth}</p>
            <p><strong>Height:</strong> {height}</p>
            <p><strong>Birth Star:</strong> {birth_star}</p>
            <p><strong>Zodiac Sign:</strong> {zodiac_sign}</p>
            <p><strong>Gothram:</strong> {gothram}</p>
            <p><strong>Current Living:</strong> {current_living}</p>
            <p><strong>Education:</strong> {educational_details}</p>
            <p><strong>Work Experience:</strong> {previous_work_experience}</p>
            <p><strong>Father's Name:</strong> {fathers_name}</p>
            <p><strong>Father's Father:</strong> {fathers_father_name}</p>
            <p><strong>Mother's Name:</strong> {mothers_name}</p>
            <p><strong>Mother's Father:</strong> {mothers_father_name}</p>
            <p><strong>Siblings:</strong> {siblings}</p>
            <p><strong>Submitted:</strong> {submitted_at?.slice(0, 10)}</p>
            {approved_at && <p><strong>Approved:</strong> {approved_at.slice(0, 10)}</p>}
          </div>

          {/* Right section */}
          <div className="space-y-4">
            <div>
              <p><strong>Email:</strong> {email_id}</p>
              <p><strong>Contact No 1:</strong> {contact_no1}</p>
              <p><strong>Contact No 2:</strong> {contact_no2}</p>
              <p><strong>Designation:</strong> {designation}</p>
              <p><strong>Company:</strong> {company}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {images.map((img, index) => (
                <div key={index} className="text-center">
                  <p className="font-semibold mb-1">{img.label}</p>
                  <img
                    src={`${BASE_URL}/uploads/${img.src}`}
                    alt={img.label}
                    className="w-full h-auto max-h-[160px] object-cover rounded cursor-pointer hover:scale-[1.02] transition"
                    onClick={() => openImageModal(index)}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <span className="text-gray-500 font-mono">ID: {unique_id}</span>
              {approved_at && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Approved
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>

          {!approved_at && (
            <div className="space-x-2">
              <button
                onClick={() => onApprove(application.unique_id)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => onReject(application.unique_id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Viewer */}
      {isImageOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={closeImageModal}
          >
            ✕
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 text-white text-4xl hover:scale-110"
              >
                ‹
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 text-white text-4xl hover:scale-110"
              >
                ›
              </button>
            </>
          )}

          <img
            ref={imageRef}
            src={`${BASE_URL}/uploads/${images[currentImageIndex].src}`}
            alt="Preview"
            className="max-w-full max-h-[80vh] object-contain rounded shadow-xl transition"
          />
        </div>
      )}
    </div>
  );
};

export default ViewApplicationModal;
