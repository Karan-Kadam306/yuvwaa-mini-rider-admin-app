import React, { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import Header from "../layout/header";

function RidersPage() {
  const [riders, setRiders] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const API_URL = "http://localhost:5000/api/riders";

  // Fetch riders on load
  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setRiders(data);
    } catch (err) {
      console.error("Error fetching riders:", err);
    }
  };

  // Add Rider
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setErrorMessage(errorData.error);  
      } else {
        const newRider = await res.json();
        setRiders([...riders, newRider]);
        setFormData({ first_name: "", last_name: "", mobile: "" });
        setErrorMessage(""); 
      }
    } catch (err) {
      console.error("Error adding rider:", err);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="mt-8">
        <h1 className="text-green-800 mb-2 font-bold text-xl">Riders Management</h1>
        <p className="text-green-600">Create and manage riders.</p>
      </div>

      {/* Error message display */}
      {errorMessage && (
        <div className="bg-red-100 text-red-800 p-4 mb-4 rounded-xl">
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Add Rider Form */}
      <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-md mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-green-800 font-semibold">Add New Rider</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-green-700 mb-2">First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-green-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
                placeholder="Enter first name"
                required
              />
            </div>

            <div>
              <label className="block text-green-700 mb-2">Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-green-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
                placeholder="Enter last name"
                required
              />
            </div>

            <div>
              <label className="block text-green-700 mb-2">Mobile</label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-green-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
            >
              <UserPlus className="w-5 h-5" />
              Add Rider
            </button>
          </div>
        </form>
      </div>

      {/* Riders Table */}
      <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-md mt-8">
        <h2 className="text-green-800 mb-6 font-semibold">All Riders</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-green-200 bg-green-50">
                <th className="text-left py-4 px-4 text-green-700">First Name</th>
                <th className="text-left py-4 px-4 text-green-700">Last Name</th>
                <th className="text-left py-4 px-4 text-green-700">Mobile</th>
                <th className="text-left py-4 px-4 text-green-700">Created At</th>
              </tr>
            </thead>

            <tbody>
              {riders.map((rider) => (
                <tr
                  key={rider.id}
                  className="border-b border-green-100 hover:bg-green-50 transition-all"
                >
                  <td className="py-4 px-4 text-green-800">{rider.first_name}</td>
                  <td className="py-4 px-4 text-green-800">{rider.last_name}</td>
                  <td className="py-4 px-4 text-green-700">{rider.mobile}</td>
                  <td className="py-4 px-4 text-green-700">
                    {new Date(rider.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}

              {riders.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="py-6 text-center text-green-600 italic"
                  >
                    No riders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RidersPage;
