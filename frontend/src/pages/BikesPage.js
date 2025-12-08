import React, { useEffect, useState } from "react";
import axios from "axios";

function BikesPage() {
  const [bikeCode, setBikeCode] = useState("");
  const [model, setModel] = useState("");
  const [bikes, setBikes] = useState([]);

  const API = "http://localhost:5000/api/bikes";

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    const res = await axios.get(API);
    setBikes(res.data);
  };

  const addBike = async (e) => {
    e.preventDefault();
    if (!bikeCode || !model) return alert("All fields required");

    try {
      await axios.post(API, { bike_code: bikeCode, model });

      setBikeCode("");
      setModel("");
      fetchBikes();
    } catch (err) {
      alert(err.response?.data?.error || "Error adding bike");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bikes Management</h2>

      <form onSubmit={addBike} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Bike Code"
          value={bikeCode}
          onChange={(e) => setBikeCode(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="text"
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          required
        />
        <br /><br />

        <button type="submit">Add Bike</button>
      </form>

      <h3>All Bikes</h3>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Bike Code</th>
            <th>Model</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          {bikes.map((bike) => (
            <tr key={bike.id}>
              <td>{bike.id}</td>
              <td>{bike.bike_code}</td>
              <td>{bike.model}</td>
              <td>{bike.status}</td>
              <td>{new Date(bike.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default BikesPage;
