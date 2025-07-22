import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const [headerLine, ...lines] = text.split("\n").filter(Boolean);
      const headerArray = headerLine.split(",");
      const rowData = lines.map((line) => {
        const values = line.split(",");
        const row = {};
        headerArray.forEach((h, i) => {
          row[h.trim()] = values[i]?.trim() || "";
        });
        return row;
      });
      setHeaders(headerArray);
      setCsvData(rowData);
    };
    reader.readAsText(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${BASE_URL}/api/upload-csv`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setMessage("✅ Bulk data uploaded successfully!");
        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 1500);
      } else {
        setMessage("❌ Upload failed: " + data.error);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Something went wrong while uploading.");
    }
  };

  const handleRemoveRow = (indexToRemove) => {
    const updatedData = csvData.filter((_, index) => index !== indexToRemove);
    setCsvData(updatedData);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow relative">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="absolute top-4 left-4 text-blue-600 hover:text-blue-800 underline"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Upload CSV File</h2>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="mb-4 border border-gray-300 px-3 py-2 rounded w-full"
        />

        {csvData.length > 0 && (
          <div className="overflow-auto max-h-[450px] border border-gray-300 rounded mb-4">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  {headers.map((header, i) => (
                    <th key={i} className="px-4 py-2 font-semibold">
                      {header}
                    </th>
                  ))}
                  <th className="px-4 py-2 font-semibold text-red-600">Remove</th>
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    {headers.map((h, i) => (
                      <td key={i} className="px-4 py-2">
                        {row[h]}
                      </td>
                    ))}
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleRemoveRow(idx)}
                        className="text-red-600 font-bold text-lg hover:text-red-800"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {file && csvData.length > 0 && (
          <button
            onClick={handleUpload}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            Confirm & Upload CSV
          </button>
        )}

        {message && (
          <p className="mt-4 text-center font-medium text-sm text-blue-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadCSV;
