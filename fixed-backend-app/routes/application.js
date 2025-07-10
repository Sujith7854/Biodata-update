const express = require("express");
const router = express.Router();
const db = require("../db");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const savePhoto = (base64, filename) => {
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, Buffer.from(base64, "base64"));
  return filename; // return only the filename
};

// ────────────────────────────────
// Submit Application Route
// ────────────────────────────────
router.post("/submit-application", async (req, res) => {
  try {
    const {
      name,
      gender,
      date_of_birth,
      time_of_birth,
      place_of_birth,
      height,
      birth_star,
      zodiac_sign,
      gothram,
      current_living,
      educational_details,
      designation,
      company,
      previous_work_experience,
      fathers_name,
      fathers_father_name,
      mothers_name,
      mothers_father_name,
      siblings,
      email_id,
      contact_no1,
      contact_no2,
      main_photo_base64,
      side_photo_base64,
    } = req.body;

    const unique_id = uuidv4().slice(0, 8);

    let main_photo_url = null;
    let side_photo_url = null;

    if (main_photo_base64) {
      main_photo_url = savePhoto(main_photo_base64, `main_${unique_id}.jpg`);
    }

    if (side_photo_base64) {
      side_photo_url = savePhoto(side_photo_base64, `side_${unique_id}.jpg`);
    }

    await db.execute(
      `INSERT INTO applications (
        unique_id, name, gender, date_of_birth, time_of_birth, place_of_birth,
        height, birth_star, zodiac_sign, gothram, current_living,
        educational_details, designation, company, previous_work_experience,
        fathers_name, fathers_father_name, mothers_name, mothers_father_name,
        siblings, email_id, contact_no1, contact_no2,
        main_photo_url, side_photo_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        unique_id,
        name,
        gender,
        date_of_birth,
        time_of_birth,
        place_of_birth,
        height,
        birth_star,
        zodiac_sign,
        gothram,
        current_living,
        educational_details,
        designation,
        company,
        previous_work_experience,
        fathers_name,
        fathers_father_name,
        mothers_name,
        mothers_father_name,
        siblings,
        email_id,
        contact_no1,
        contact_no2,
        main_photo_url,
        side_photo_url,
      ]
    );

    res.json({ success: true, unique_id });
  } catch (error) {
    console.error("Error in submit-application:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ────────────────────────────────
// Group approved applications by gender, then year
// ────────────────────────────────
router.get("/grouped-by-gender", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT gender, YEAR(date_of_birth) AS year, COUNT(*) AS count
      FROM applications
      WHERE approved_at IS NOT NULL
      GROUP BY gender, year
      ORDER BY gender ASC, year DESC
    `);

    const result = {};
    rows.forEach(({ gender, year, count }) => {
      if (!result[gender]) result[gender] = [];
      result[gender].push({ year, count });
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error grouping applications by gender and year:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ────────────────────────────────
// Get approved applications for a specific year
// ────────────────────────────────
router.get("/applications/by-year/:year", async (req, res) => {
  try {
    const { year } = req.params;
    const [results] = await db.execute(
      `SELECT * FROM applications 
       WHERE YEAR(date_of_birth) = ? AND approved_at IS NOT NULL
       ORDER BY created_at DESC`,
      [year]
    );
    res.json({ success: true, applications: results });
  } catch (err) {
    console.error("Error fetching applications by year:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ────────────────────────────────
// Legacy or alternative route (optional)
// ────────────────────────────────
router.get("/approved/:year", async (req, res) => {
  const { year } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT * FROM applications 
       WHERE approved_at IS NOT NULL AND YEAR(date_of_birth) = ? 
       ORDER BY approved_at DESC`,
      [year]
    );
    res.json({ success: true, applications: rows });
  } catch (error) {
    console.error("Error fetching year applications:", error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
