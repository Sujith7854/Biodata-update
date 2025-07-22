const express = require("express");
const router = express.Router();
const db = require("../db");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const csv = require("csv-parser");


// ────────────────────────────────
// Ensure uploads directory exists
// ────────────────────────────────
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const csvUpload = multer({ dest: "uploads/" });

// ────────────────────────────────
// Compress and Save Image
// ────────────────────────────────
const savePhoto = async (base64, filename) => {
  const filePath = path.join(uploadsDir, filename);
  const imageBuffer = Buffer.from(base64, "base64");

  await sharp(imageBuffer)
    .resize({ width: 1000, withoutEnlargement: true }) // Slightly larger width for clarity
    .jpeg({
      quality: 85,                // 🔥 High visual quality + great compression
      mozjpeg: true,              // Better encoding
      chromaSubsampling: '4:4:4'  // Preserve color sharpness
    })
    .toFile(filePath);

  return filename;
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
      main_contact_number,
      alternative_contact_number,
      main_photo_base64,
      side_photo_base64,
    } = req.body;

    const unique_id = uuidv4().slice(0, 8);

    let main_photo_url = null;
    let side_photo_url = null;

    if (main_photo_base64) {
      main_photo_url = await savePhoto(main_photo_base64, `main_${unique_id}.jpg`);
    }

    if (side_photo_base64) {
      side_photo_url = await savePhoto(side_photo_base64, `side_${unique_id}.jpg`);
    }

    await db.execute(
      `INSERT INTO applications (
        unique_id, name, gender, date_of_birth, time_of_birth, place_of_birth,
        height, birth_star, zodiac_sign, gothram, current_living,
        educational_details, designation, company, previous_work_experience,
        fathers_name, fathers_father_name, mothers_name, mothers_father_name,
        siblings, email_id, main_contact_number, alternative_contact_number,
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
        main_contact_number,
        alternative_contact_number,
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
    const { gender } = req.query; // 🔍 Get gender from query

    let query = `
      SELECT * FROM applications 
      WHERE YEAR(date_of_birth) = ? AND approved_at IS NOT NULL
    `;
    const values = [year];

    if (gender) {
      query += ` AND gender = ?`;
      values.push(gender);
    }

    query += ` ORDER BY created_at DESC`;

    const [results] = await db.execute(query, values);

    res.json({ success: true, applications: results });
  } catch (err) {
    console.error("Error fetching applications by year and gender:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ────────────────────────────────
// Legacy or alternative route (optional)
// ────────────────────────────────
router.get("/approved/:year", async (req, res) => {
  const { year } = req.params;
  const { gender } = req.query;

  try {
    let query = `
      SELECT * FROM applications 
      WHERE approved_at IS NOT NULL AND YEAR(date_of_birth) = ?
    `;
    const values = [year];

    if (gender) {
      query += ` AND gender = ?`;
      values.push(gender);
    }

    query += ` ORDER BY approved_at DESC`;

    const [rows] = await db.execute(query, values);
    res.json({ success: true, applications: rows });
  } catch (error) {
    console.error("Error fetching year applications:", error);
    res.status(500).json({ success: false });
  }
});



// ────────────────────────────────
// CSV Upload and Insert to Applications Table
// ────────────────────────────────
router.post("/upload-csv", csvUpload.single("file"), (req, res) => {
  const fileRows = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      fileRows.push(row);
    })
    .on("end", async () => {
      fs.unlinkSync(req.file.path); // Delete temp file

      try {
        for (const item of fileRows) {
          const unique_id = uuidv4().slice(0, 8);
          const approved_at = new Date(); // Automatically approve

          await db.execute(
            `INSERT INTO applications (
              unique_id, name, gender, date_of_birth, time_of_birth, place_of_birth,
              height, birth_star, zodiac_sign, gothram, current_living,
              educational_details, designation, company, previous_work_experience,
              fathers_name, fathers_father_name, mothers_name, mothers_father_name,
              siblings, email_id, main_contact_number, alternative_contact_number,
              main_photo_url, side_photo_url, approved_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              unique_id,
              item.name,
              item.gender,
              item.date_of_birth,
              item.time_of_birth,
              item.place_of_birth,
              item.height,
              item.birth_star,
              item.zodiac_sign,
              item.gothram,
              item.current_living,
              item.educational_details,
              item.designation,
              item.company,
              item.previous_work_experience,
              item.fathers_name,
              item.fathers_father_name,
              item.mothers_name,
              item.mothers_father_name,
              item.siblings,
              item.email_id,
              item.main_contact_number,
              item.alternative_contact_number,
              item.main_photo_url,
              item.side_photo_url,
              approved_at // auto-approved here
            ]
          );
        }

        res.json({ success: true, message: "✅ CSV uploaded and applications auto-approved!" });
      } catch (err) {
        console.error("CSV upload error:", err);
        res.status(500).json({ success: false, error: "Database error" });
      }
    });
});


// ────────────────────────────────
// Get Applications (Used in ManageApplications page)
// ────────────────────────────────
{/*router.get("/applications", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT 
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
        main_contact_number,
        alternative_contact_number,
        main_photo_url,
        side_photo_url,
        created_at,
        approved_at
      FROM applications
      ORDER BY created_at DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});?*/}

// Get specific applications based on contact number

router.get("/applications", async (req, res) => {
  const mainContact = req.query.main_contact_number;

  if (!mainContact) {
    return res.status(400).json({ success: false, message: "Missing main_contact_number" });
  }

  try {
    // Fetch approved applications
    const [approvedRows] = await db.execute(
      `SELECT *, 'Approved' AS status FROM applications WHERE main_contact_number = ?`,
      [mainContact]
    );

    // Fetch rejected applications
    const [rejectedRows] = await db.execute(
      `SELECT *, 'Rejected' AS status FROM rejected_applications WHERE main_contact_number = ?`,
      [mainContact]
    );

    // Combine both
    const applications = [...approvedRows, ...rejectedRows];

    res.json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});


/// ✅ Update application by main_contact_number
router.put("/applications/update", async (req, res) => {
  const data = req.body;

  try {
    // 🛠️ Fix the date format to 'YYYY-MM-DD'
    const formattedDate = data.date_of_birth ? data.date_of_birth.slice(0, 10) : null;

    const query = `
      UPDATE applications SET
        name=?, gender=?, email_id=?, date_of_birth=?, time_of_birth=?, place_of_birth=?, height=?, birth_star=?, zodiac_sign=?, gothram=?,
        current_living=?, designation=?, company=?, previous_work_experience=?, educational_details=?,
        alternative_contact_number=?, fathers_name=?, fathers_father_name=?, mothers_name=?, mothers_father_name=?, siblings=?
      WHERE main_contact_number=?
    `;

    await db.execute(query, [
      data.name,
      data.gender,
      data.email_id,
      formattedDate, // ✅ safe for MySQL
      data.time_of_birth,
      data.place_of_birth,
      data.height,
      data.birth_star,
      data.zodiac_sign,
      data.gothram,
      data.current_living,
      data.designation,
      data.company,
      data.previous_work_experience,
      data.educational_details,
      data.alternative_contact_number,
      data.fathers_name,
      data.fathers_father_name,
      data.mothers_name,
      data.mothers_father_name,
      data.siblings,
      data.main_contact_number
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: "Failed to update application" });
  }
});

// ✅ Upload photo by main_contact_number
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/upload-photo/:main_contact_number", upload.single("photo"), async (req, res) => {
  const { main_contact_number } = req.params;
  const type = req.query.type;
  const filename = req.file.filename;

  if (!["main", "side"].includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  const column = type === "main" ? "main_photo_url" : "side_photo_url";

  try {
    await db.execute(`UPDATE applications SET ${column}=? WHERE main_contact_number=?`, [
      filename,
      main_contact_number,
    ]);
    res.json({ success: true, path: filename });
  } catch (err) {
    console.error("Photo upload error", err);
    res.status(500).json({ success: false, message: "Photo upload failed" });
  }
});

//-----------------
// Rejected applications
//-----------------



router.post("/admin/reject/:unique_id", async (req, res) => {
  const { unique_id } = req.params;
  const { rejection_note } = req.body;

  try {
    const [result] = await db.execute(
      `SELECT * FROM applications WHERE unique_id = ?`,
      [unique_id]
    );

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const app = result[0];

    await db.execute(
  `INSERT INTO rejected_applications (
    unique_id, name, gender, date_of_birth, time_of_birth, place_of_birth,
    height, birth_star, zodiac_sign, gothram, current_living,
    educational_details, designation, company, previous_work_experience,
    fathers_name, fathers_father_name, mothers_name, mothers_father_name,
    siblings, email_id, main_contact_number, alternative_contact_number,
    main_photo_url, side_photo_url, rejection_note, rejected_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`, // ⬅ 26 ? placeholders
  [
    app.unique_id, app.name, app.gender, app.date_of_birth, app.time_of_birth,
    app.place_of_birth, app.height, app.birth_star, app.zodiac_sign,
    app.gothram, app.current_living, app.educational_details, app.designation,
    app.company, app.previous_work_experience, app.fathers_name,
    app.fathers_father_name, app.mothers_name, app.mothers_father_name,
    app.siblings, app.email_id, app.main_contact_number,
    app.alternative_contact_number, app.main_photo_url, app.side_photo_url,
    rejection_note
  ]
);


    await db.execute(`DELETE FROM applications WHERE unique_id = ?`, [unique_id]);

    res.json({ success: true, message: "Application rejected with note" });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ────────────────────────────────
// Get all rejected applications  
// ────────────────────────────────
router.get("/admin/rejected-applications", async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM rejected_applications ORDER BY rejected_at DESC`
    );
    res.json({ success: true, applications: rows });
  } catch (err) {
    console.error("Fetch rejected error:", err);
    res.status(500).json({ success: false });
  }
});

// ────────────────────────────────
// Re-submit rejected application
// ────────────────────────────────
// This endpoint allows re-submitting a rejected application by moving it back to the applications table


router.put("/resubmit/:main_contact_number", async (req, res) => {
  const { main_contact_number } = req.params;
  const updatedData = req.body;

  try {
    // Fetch existing rejected data
    const [rejectedRows] = await db.execute(
      `SELECT * FROM rejected_applications WHERE main_contact_number = ?`,
      [main_contact_number]
    );

    if (rejectedRows.length === 0) {
      return res.status(404).json({ success: false, message: "Rejected application not found" });
    }

    // Remove from rejected_applications
    await db.execute(`DELETE FROM rejected_applications WHERE main_contact_number = ?`, [main_contact_number]);

    // Insert into applications table
    await db.execute(
      `INSERT INTO applications (
        unique_id, name, gender, date_of_birth, time_of_birth, place_of_birth,
        height, birth_star, zodiac_sign, gothram, current_living,
        educational_details, designation, company, previous_work_experience,
        fathers_name, fathers_father_name, mothers_name, mothers_father_name,
        siblings, email_id, main_contact_number, alternative_contact_number,
        main_photo_url, side_photo_url, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        rejectedRows[0].unique_id,
        updatedData.name,
        updatedData.gender,
        updatedData.date_of_birth,
        updatedData.time_of_birth,
        updatedData.place_of_birth,
        updatedData.height,
        updatedData.birth_star,
        updatedData.zodiac_sign,
        updatedData.gothram,
        updatedData.current_living,
        updatedData.educational_details,
        updatedData.designation,
        updatedData.company,
        updatedData.previous_work_experience,
        updatedData.fathers_name,
        updatedData.fathers_father_name,
        updatedData.mothers_name,
        updatedData.mothers_father_name,
        updatedData.siblings,
        updatedData.email_id,
        updatedData.main_contact_number,
        updatedData.alternative_contact_number,
        rejectedRows[0].main_photo_url,
        rejectedRows[0].side_photo_url
      ]
    );

    res.json({ success: true, message: "Application re-submitted successfully" });
  } catch (err) {
    console.error("Re-submit error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
