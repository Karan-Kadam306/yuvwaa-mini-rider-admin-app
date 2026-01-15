const pool = require("../db/connection");

exports.createRider = async (req, res) => {
  const { first_name, last_name, mobile } = req.body;

  const mobileRegex = /^(\+91\s?)?[0-9]{10}$/;

  if (!mobileRegex.test(mobile)) {
    return res.status(400).json({ error: "Mobile number must be 10 digits" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO riders (first_name, last_name, mobile)
       VALUES ($1, $2, $3) RETURNING *`,
      [first_name, last_name, mobile]
    );

    res.json(result.rows[0]);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


exports.getRiders = async(req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM riders ORDER BY id DESC`);
        res.json(result.rows);
    }catch (e){
        res.status(500).json({ error : e.message});
    }
};