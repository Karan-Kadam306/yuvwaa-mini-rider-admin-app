const pool = require("../db/connection");

exports.createBike = async (req, res) => {
  const { bike_code, model } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO bikes (bike_code, model) VALUES ($1, $2) RETURNING *`,
      [bike_code, model]
    );
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getBikes = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM bikes ORDER BY id DESC`);
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
