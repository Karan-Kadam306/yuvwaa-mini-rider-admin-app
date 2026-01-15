const pool = require('../db/connection');

exports.getRiderActivity = async (req, res) => {
  const date = req.query.date || new Date().toISOString().split("T")[0];

  try {
    const result = await pool.query(
      `
      SELECT *
      FROM rider_daily_activity
      WHERE earning_date = $1
      `,
      [date]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch rider activity" });
  }
};


exports.uploadExcelData = async (req, res) => {
  const { date, rows } = req.body;  // date string + array of riders from Excel

  if (!date || !rows || !Array.isArray(rows)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Delete existing data for this date
    await client.query(
      "DELETE FROM rider_daily_activity WHERE earning_date = $1",
      [date]
    );

    // Insert all Excel rows
    for (const r of rows) {
      await client.query(
        `INSERT INTO rider_daily_activity
         (rider_id, first_name, last_name, mobile, earning_date, daily_earnings)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          r.rider_id,
          r.first_name,
          r.last_name,
          r.mobile,
          date,
          r.daily_earnings || 0
        ]
      );
    }

    await client.query("COMMIT");
    res.json({ message: "Excel data stored successfully" });

  } catch (err) {
    console.error("❌ UPLOAD EXCEL ERROR:");
    console.error(err);
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};


// exports.uploadExcelData = async (req, res) => {
//   const { date, rows } = req.body;
//   const client = await pool.connect();

//   try {
//     await client.query("BEGIN");

//     // 1. Remove existing date data
//     await client.query(
//       "DELETE FROM rider_daily_activity WHERE earning_date = $1",
//       [date]
//     );

//     // 2.Insert excel rows
//     for (const r of rows) {
//       await client.query(`
//         INSERT INTO rider_daily_activity
//         (rider_id, first_name, last_name, mobile, earning_date, daily_earnings)
//         VALUES ($1, $2, $3, $4, $5, $6)
//       `, [
//         r.rider_id,
//         r.first_name,
//         r.last_name,
//         r.mobile,
//         date,
//         r.daily_earnings
//       ]);
//     }

//     await client.query("COMMIT");
//     res.json({ message: "Excel data stored successfully" });

//   } catch (err) {
//     await client.query("ROLLBACK");
//     res.status(500).json({ error: err.message });
//   } finally {
//     client.release();
//   }
// };



// exports.uploadExcelData = async (req, res) => {
//   const { date, rows } = req.body;

//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");

//     // Delete existing date data
//     await client.query(
//       "DELETE FROM rider_daily_earnings WHERE earning_date = $1",
//       [date]
//     );

//     // Insert excel data
//     for (const r of rows) {
//       await client.query(
//         `INSERT INTO rider_daily_earnings (rider_id, earning_date, daily_earnings)
//          VALUES ($1, $2, $3)`,
//         [r.rider_id, date, r.daily_earnings]
//       );
//     }

//     // Insert missing riders as 0
//     await client.query(`
//       INSERT INTO rider_daily_earnings (rider_id, earning_date, daily_earnings)
//       SELECT id, $1, 0 FROM riders
//       WHERE id NOT IN (
//         SELECT rider_id FROM rider_daily_earnings WHERE earning_date = $1
//       )
//     `, [date]);

//     // Update lifetime earnings
//     await client.query(`
//       UPDATE riders r
//       SET total_earnings = (
//         SELECT COALESCE(SUM(daily_earnings), 0)
//         FROM rider_daily_earnings
//         WHERE rider_id = r.id
//       )
//     `);

//     await client.query("COMMIT");
//     res.json({ message: "Excel data saved" });

//   } catch (err) {
//   console.error(" UPLOAD EXCEL ERROR:");
//   console.error(err);              // full error
//   console.error(err.message);      // message
//   console.error(err.stack);        // stack trace

//   await client.query("ROLLBACK");
//   res.status(500).json({ error: err.message });
// }
//  finally {
//     client.release();
//   }
// };

