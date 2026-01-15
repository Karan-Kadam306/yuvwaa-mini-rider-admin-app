import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserPlus } from "lucide-react";
import Header from "../layout/header";

function AssignmentsPage() {
  const [riderId, setRiderId] = useState("");
  const [bikeId, setBikeId] = useState("");
  const [riders, setRiders] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");

  const API_RIDERS = "http://localhost:5000/api/riders";
  const API_BIKES = "http://localhost:5000/api/bikes";
  const API_ASSIGN = "http://localhost:5000/api/assignments";

  useEffect(() => {
    fetchRiders();
    fetchBikes();
    fetchAssignments();
  }, []);

  const fetchRiders = async () => {
    const res = await axios.get(API_RIDERS);
    setRiders(res.data);
  };

  const fetchBikes = async () => {
    const res = await axios.get(API_BIKES);
    // Only available bikes
    setBikes(res.data.filter((b) => b.status === "available"));
  };

  const fetchAssignments = async () => {
    const res = await axios.get(API_ASSIGN);
    setAssignments(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!riderId || !bikeId) {
      setError("Please select both rider and bike");
      return;
    }

    // Check if rider already has an active assignment
    if (assignments.some((a) => a.rider_id === parseInt(riderId))) {
      setError("This rider already has a bike assigned");
      return;
    }

    try {
      await axios.post(API_ASSIGN, { rider_id: riderId, bike_id: bikeId });
      setRiderId("");
      setBikeId("");
      fetchAssignments();
      fetchBikes();
    } catch (err) {
      setError(err.response?.data?.error || "Error assigning bike");
    }
  };

  const deleteAssignment = async (id, bike_id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;

    try {
      await axios.delete(`${API_ASSIGN}/${id}`);
      // Also set bike status to available
      await axios.put(`${API_BIKES}/${bike_id}/status`, { status: "available" });
      fetchAssignments();
      fetchBikes();
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting assignment");
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="mt-8">
        <h1 className="text-green-800 mb-2 font-bold text-xl">Assignment Management</h1>
        <p className="text-green-600">Assign bikes to the riders.</p>
      </div>

      {/* Assignments form */}
      <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-md mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-green-800 font-semibold">Assign bike to Rider</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Select Rider</label>
              <select
                value={riderId}
                onChange={(e) => setRiderId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Choose a rider...</option>
                {riders.map((rider) => (
                  <option key={rider.id} value={rider.id}>
                    {rider.first_name} {rider.last_name} - {rider.mobile}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Select Bike (Available Only)</label>
              <select
                value={bikeId}
                onChange={(e) => setBikeId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Choose a bike...</option>
                {bikes.map((bike) => (
                  <option key={bike.id} value={bike.id}>
                    {bike.bike_code} - {bike.model}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
            >
              Assign Bike
            </button>
          </div>
        </form>
      </div>

      {/*Assignment Table */}
      <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-md mt-8">
        <h2 className="text-green-800 mb-6 font-semibold">All Assignmets</h2>
        
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-green-200 bg-green-50">
              <th className="text-left py-4 px-4 text-green-700">Rider Name</th>
              <th className="text-left py-4 px-4 text-green-700">Rider Mobile</th>
              <th className="text-left py-4 px-4 text-green-700">Bike Code</th>
              <th className="text-left py-4 px-4 text-green-700">Model</th>
              <th className="text-left py-4 px-4 text-green-700">Assigned At</th>
              <th className="text-left py-4 px-4 text-green-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.id} className="border-b border-green-100 hover:bg-green-50 transition-all">
                <td className="py-4 px-4 text-green-800">{assignment.first_name} {assignment.last_name}</td>
                <td className="py-4 px-4 text-green-800">{assignment.mobile}</td>
                <td className="py-4 px-4 text-green-800">{assignment.bike_code}</td>
                <td className="py-4 px-4 text-green-800">{assignment.model}</td>
                <td className="py-4 px-4 text-green-800">{new Date(assignment.assigned_at).toLocaleString()}</td>
                <td className="py-4 px-4 text-green-800">
                  <button
                    onClick={() => deleteAssignment(assignment.id, assignment.bike_id)}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-red-700 transition-all"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {assignments.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 px-4 text-center text-gray-500">
                  No active assignments yet
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

export default AssignmentsPage;
