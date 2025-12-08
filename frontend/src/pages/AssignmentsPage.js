import React, { useEffect, useState } from "react";
import axios from "axios";

function AssignmentsPage() {
  const [riderId, setRiderId] = useState("");
  const [bikeId, setBikeId] = useState("");
  
  const [riders, setRiders] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [assignments, setAssignments] = useState([]);

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
    setBikes(res.data.filter(b => b.status === "available"));
  };

  const fetchAssignments = async () => {
    const res = await axios.get(API_ASSIGN);
    setAssignments(res.data);
  };

  const assignBike = async (e) => {
    e.preventDefault();
    if (!riderId || !bikeId) {
      return alert("Please select both Rider and Bike");
    }

    try {
      await axios.post(API_ASSIGN, {
        rider_id: riderId,
        bike_id: bikeId
      });

      setRiderId("");
      setBikeId("");

      fetchAssignments();
      fetchBikes();
    } catch (err) {
      alert(err.response?.data?.error || "Error assigning bike");
    }
  };

  const deleteAssignment = async (id) => {
  if (!window.confirm("Are you sure you want to delete this assignment?")) return;

  try {
    await axios.delete(`${API_ASSIGN}/${id}`);

    fetchAssignments();
    fetchBikes();
  } catch (err) {
    alert(err.response?.data?.error || "Error deleting assignment");
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Assignments Management</h2>

      <form onSubmit={assignBike} style={{ marginBottom: "20px" }}>
        
        {/* Rider Selection */}
        <select
          value={riderId}
          onChange={(e) => setRiderId(e.target.value)}
          required
        >
          <option value="">Select Rider</option>
          {riders.map(r => (
            <option key={r.id} value={r.id}>
              {r.first_name} {r.last_name} ({r.mobile})
            </option>
          ))}
        </select>

        <br /><br />

        {/* Bike Selection */}
        <select
          value={bikeId}
          onChange={(e) => setBikeId(e.target.value)}
          required
        >
          <option value="">Select Bike</option>
          {bikes.map(b => (
            <option key={b.id} value={b.id}>
              {b.bike_code} — {b.model}
            </option>
          ))}
        </select>

        <br /><br />

        <button type="submit">Assign Bike</button>
      </form>

      <h3>Active Assignments</h3>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Rider</th>
            <th>Mobile</th>
            <th>Bike</th>
            <th>Model</th>
            <th>Assigned At</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.first_name} {a.last_name}</td>
              <td>{a.mobile}</td>
              <td>{a.bike_code}</td>
              <td>{a.model}</td>
              <td>{new Date(a.assigned_at).toLocaleString()}</td>
              <td>
                <button onClick={() => deleteAssignment(a.id)} style={{ color: "red" }}>
                   Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default AssignmentsPage;
