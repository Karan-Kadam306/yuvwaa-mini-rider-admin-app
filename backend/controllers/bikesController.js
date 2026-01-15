const pool = require("../db/connection");

exports.createBike = async (req, res) => {
  const { bike_code, model } = req.body;

  // 1️ Validation for bike code: uppercase + 3-15 characters + alphanumeric
  const codeRegex = /^YUV-\d{3}$/;

  if (!codeRegex.test(bike_code)) {
    return res.status(400).json({
      error: "Bike code must be 3–15 uppercase alphanumeric characters (A-Z, 0-9)"
    });
  }

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

exports.updateBikeStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE bikes SET status=$1 WHERE id=$2 RETURNING *`,
      [status, id]
    );

    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
