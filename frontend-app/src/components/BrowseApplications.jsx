import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


const BrowseApplications = () => {
  const [data, setData] = useState({});
  const { gender } = useParams(); // ← read gender from URL
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE_URL}/api/grouped-by-gender`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res.data);
      });
  }, []);

  const genders = Object.keys(data);

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
        {!gender ? (
          <>
          <button
              className="mb-4 text-sm text-blue-600 hover:underline"
              onClick={() => navigate("/home")}
            >
              ← Back
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">Select Gender</h2>
            <div className="flex justify-center gap-6">
              {genders.map((g) => (
                <button
                  key={g}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full"
                  onClick={() => navigate(`/browse/${g}`)}
                >
                  {g}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              className="mb-4 text-sm text-blue-600 hover:underline"
              onClick={() => navigate("/browse")}
            >
              ← Back to Gender Selection
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">
              {gender} Applications by Birth Year
            </h2>
            {data[gender]?.map(({ year, count }) => (
              <Link key={year} to={`/browse/${gender}/${year}`}>
                <div className="flex justify-between items-center bg-blue-100 hover:bg-blue-200 p-4 rounded mb-2 cursor-pointer">
                  <span className="text-blue-800 font-medium">{year}</span>
                  <span className="bg-blue-300 text-blue-900 px-3 py-1 rounded-full text-sm">
                    {count} application{count > 1 ? "s" : ""}
                  </span>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseApplications;
