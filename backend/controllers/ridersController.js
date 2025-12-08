const pool = require("../db/connection");

exports.createRider = async (requestAnimationFrame, res) => {
    const { first_name, last_name, mobile } = requestAnimationFrame.body;

    try{
        const result = await pool.query(
            `INSERT INTO RIDERS (first_name, last_name, mobile)
            VALUES ($1, $2, $3) RETURNING *`,
            [first_name, last_name, mobile]
        );
        res.json(result.rows[0]);
    }catch (e){
        res.status(500).json({ error : e.message});
    }
}

exports.getRiders = async(req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM riders ORDER BY id DESC`);
        res.json(result.rows);
    }catch (e){
        res.status(500).json({ error : e.message});
    }
};