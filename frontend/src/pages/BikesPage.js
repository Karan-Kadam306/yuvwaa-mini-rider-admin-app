import React, { useState, useEffect } from "react";
import { Bike } from "lucide-react";
import Header from "../layout/header";

function BikesPage() {
  const [bikes, setBikes] = useState([]);
  const [formData, setFormData] = useState({
    bike_code: "",
    model: "",
  });

  const API_URL = "http://localhost:5000/api/bikes";

  // Load all bikes
  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBikes(data);
    } catch (err) {
      console.error("Error fetching bikes:", err);
    }
  };

  // Bike Code Checker (YUV-001 format)
  const isValidBikeCode = (code) => {
    const regex = /^YUV-\d{3}$/;
    return regex.test(code);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate bike code format
    if (!isValidBikeCode(formData.bike_code)) {
      alert("Invalid Bike Code! Format must be YUV-001");
      return;
    }

    // Check duplicate bike code
    const exists = bikes.some(
      (b) => b.bike_code.toLowerCase() === formData.bike_code.toLowerCase()
    );
    if (exists) {
      alert("Bike code already exists!");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const newBike = await res.json();
      setBikes([...bikes, newBike]);

      setFormData({ bike_code: "", model: "" });
    } catch (err) {
      console.error("Error adding bike:", err);
    }
  };

  // Badge color
  const getStatusColor = (status) => {
    return status === "available"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="mt-8">
        <h1 className="text-green-800 mb-2 font-bold text-xl">Bikes Management</h1>
        <p className="text-green-600">Create and manage bikes.</p>
      </div>

      {/* Add Bike Form */}
      <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-md mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
            <Bike className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-green-800 font-semibold">Add New Bike</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-green-700 mb-2">Bike Code</label>
              <input
                type="text"
                value={formData.bike_code}
                onChange={(e) =>
                  setFormData({ ...formData, bike_code: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-green-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
                placeholder="e.g. YUV-006"
                required
              />
            </div>

            <div>
              <label className="block text-green-700 mb-2">Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-green-300 rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
                placeholder="e.g. Honda Activa 6G"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
            >
              <Bike className="w-5 h-5" />
              Add Bike
            </button>
          </div>
        </form>
      </div>

      {/* Bikes Table */}
      <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-md mt-8 mb-16">
        <h2 className="text-green-800 mb-6 font-semibold">All Bikes</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-green-200 bg-green-50">
                <th className="text-left py-4 px-4 text-green-700">Bike Code</th>
                <th className="text-left py-4 px-4 text-green-700">Model</th>
                <th className="text-left py-4 px-4 text-green-700">Status</th>
                <th className="text-left py-4 px-4 text-green-700">Created At</th>
              </tr>
            </thead>

            <tbody>
              {bikes.map((bike) => (
                <tr
                  key={bike.id}
                  className="border-b border-green-100 hover:bg-green-50 transition-all"
                >
                  <td className="py-4 px-4 text-green-800">{bike.bike_code}</td>
                  <td className="py-4 px-4 text-green-800">{bike.model}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm capitalize ${getStatusColor(
                        bike.status
                      )}`}
                    >
                      {bike.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-green-700">
                    {new Date(bike.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}

              {bikes.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="py-6 text-center text-green-600 italic"
                  >
                    No bikes found.
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

export default BikesPage;
