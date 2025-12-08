const pool = require("../db/connection");

exports.createAssignment = async (req, res) => {
  const { rider_id, bike_id } = req.body;

  try {
    const riderCheck = await pool.query(
      `SELECT id FROM bike_assignments 
       WHERE rider_id = $1 AND active = true`,
      [rider_id]
    );

    if (riderCheck.rows.length > 0) {
      return res.status(400).json({ error: "Rider already has an active bike" });
    }

    const bikeCheck = await pool.query(
      `SELECT status FROM bikes WHERE id=$1`,
      [bike_id]
    );

    if (bikeCheck.rows[0].status === "assigned") {
      return res.status(400).json({ error: "Bike is already assigned" });
    }

    await pool.query(
      `UPDATE bikes SET status='assigned' WHERE id=$1`,
      [bike_id]
    );

    const result = await pool.query(
      `INSERT INTO bike_assignments (rider_id, bike_id)
       VALUES ($1, $2) RETURNING *`,
      [rider_id, bike_id]
    );

    res.json(result.rows[0]);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ba.id, ba.assigned_at,
             r.first_name, r.last_name, r.mobile,
             b.bike_code, b.model
      FROM bike_assignments ba
      JOIN riders r ON ba.rider_id = r.id
      JOIN bikes b ON ba.bike_id = b.id
      WHERE ba.active = true
      ORDER BY ba.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  const { id } = req.params;

  try {
    const assignment = await pool.query(
      `SELECT bike_id FROM bike_assignments WHERE id = $1`,
      [id]
    );

    if (assignment.rows.length === 0) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    const bikeId = assignment.rows[0].bike_id;

    await pool.query(
      `UPDATE bike_assignments SET active = false WHERE id = $1`,
      [id]
    );

    await pool.query(
      `UPDATE bikes SET status='available' WHERE id=$1`,
      [bikeId]
    );

    res.json({ message: "Assignment deleted & bike made available" });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
