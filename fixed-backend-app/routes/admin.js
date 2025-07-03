const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const db = require("../db");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${file.fieldname}_${req.params.unique_id}${ext}`;
    cb(null, uniqueName);
  },
});

// File upload middleware
const upload = multer({ storage });

// Approve application
router.post("/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(
      "UPDATE applications SET approved_at = NOW() WHERE unique_id = ?",
      [id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error approving:", err);
    res.status(500).json({ success: false, error: "Failed to approve" });
  }
});

// Reject application
router.post("/reject/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute("DELETE FROM applications WHERE unique_id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error rejecting:", err);
    res.status(500).json({ success: false, error: "Failed to reject" });
  }
});

// Fetch all applications
router.get("/applications", async (req, res) => {
  try {
    const [results] = await db.execute(
      "SELECT * FROM applications ORDER BY created_at DESC"
    );
    res.json({ success: true, applications: results });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ success: false });
  }
});

// Log admin action
router.post("/log-action", async (req, res) => {
  const { admin_name, action, application_unique_id } = req.body;
  try {
    await db.execute(
      `INSERT INTO admin_logs (admin_name, action, application_unique_id, timestamp)
       VALUES (?, ?, ?, NOW())`,
      [admin_name, action, application_unique_id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Log action error:", err);
    res.status(500).json({ success: false });
  }
});

// Update an application (with photo upload support)
router.put(
  "/application/:unique_id",
  upload.fields([
    { name: "main_photo", maxCount: 1 },
    { name: "side_photo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { unique_id } = req.params;
      const updated = req.body;
      const files = req.files;

      // Format date fields for MySQL
      const formatDate = (iso) => {
        if (!iso || !iso.includes("T")) return iso;
        const [date, time] = iso.split("T");
        return `${date} ${time.split(".")[0]}`;
      };

      if (updated.date_of_birth) {
        updated.date_of_birth = updated.date_of_birth.split("T")[0];
      }

      if (updated.created_at) {
        updated.created_at = formatDate(updated.created_at);
      }

      if (updated.approved_at) {
        updated.approved_at = formatDate(updated.approved_at);
      }

      // Handle new image uploads
      if (files?.main_photo) {
        const ext = path.extname(files.main_photo[0].originalname);
        const newPath = path.join("uploads", `main_${unique_id}${ext}`);
        const fullPath = path.join(__dirname, "..", newPath); // absolute path
        fs.renameSync(files.main_photo[0].path, fullPath);
        updated.main_photo_url = `main_${unique_id}${ext}`;
      }

      if (files?.side_photo) {
        const ext = path.extname(files.side_photo[0].originalname);
        const newPath = path.join("uploads", `side_${unique_id}${ext}`);
        const fullPath = path.join(__dirname, "..", newPath); // absolute path
        fs.renameSync(files.side_photo[0].path, fullPath);
        updated.side_photo_url = `side_${unique_id}${ext}`;
      }

      // Prevent updating immutable fields
      delete updated.unique_id;
      delete updated.id;

      const fields = Object.keys(updated);
      const values = Object.values(updated);

      const query = `
        UPDATE applications
        SET ${fields.map((field) => `${field} = ?`).join(", ")}
        WHERE unique_id = ?
      `;

      await db.execute(query, [...values, unique_id]);
      res.json({ success: true });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ success: false, error: "Update failed" });
    }
  }
);

// Delete an application
router.delete("/application/:unique_id", async (req, res) => {
  try {
    const { unique_id } = req.params;
    await db.execute("DELETE FROM applications WHERE unique_id = ?", [
      unique_id,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
