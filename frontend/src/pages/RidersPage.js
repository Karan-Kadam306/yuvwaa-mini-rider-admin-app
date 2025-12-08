import React, { useEffect, useState } from "react";
import axios from "axios";

function RidersPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [riders, setRiders] = useState([]);

  const API = "http://localhost:5000/api/riders";

  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    const res = await axios.get(API);
    setRiders(res.data);
  };

  const addRider = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !mobile) return alert("All fields required");

    try {
      await axios.post(API, {
        first_name: firstName,
        last_name: lastName,
        mobile
      });

      setFirstName("");
      setLastName("");
      setMobile("");
      fetchRiders();
    } catch (err) {
      alert(err.response?.data?.error || "Error adding rider");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Riders Management</h2>

      <form onSubmit={addRider} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Add Rider</button>
      </form>

      <h3>All Riders</h3>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Mobile</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          {riders.map((rider) => (
            <tr key={rider.id}>
              <td>{rider.id}</td>
              <td>{rider.first_name} {rider.last_name}</td>
              <td>{rider.mobile}</td>
              <td>{new Date(rider.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default RidersPage;
