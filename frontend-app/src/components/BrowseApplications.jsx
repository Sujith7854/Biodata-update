import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BrowseApplications = () => {
  const [years, setYears] = useState([]);
  const navigate = useNavigate(); // ✅ Add navigate

  useEffect(() => {
    fetch("http://localhost:5050/api/grouped-by-year")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setYears(data.years);
      });
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      {/* ✅ Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-center mb-6">Browse Applications</h1>
      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Available Years:</h2>
        {years.map((item) => (
          <Link key={item.year} to={`/browse/${item.year}`}>
            <div className="flex justify-between items-center bg-blue-100 hover:bg-blue-200 p-4 rounded mb-2 cursor-pointer">
              <span className="text-blue-800 font-medium">{item.year}</span>
              <span className="bg-blue-300 text-blue-900 px-3 py-1 rounded-full text-sm">
                {item.count} application{item.count > 1 ? "s" : ""}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BrowseApplications;
