const express = require("express");
const router = express.Router();
const db = require("../db");

// Log admin action
router.post("/log-action", async (req, res) => {
  const { admin_name, action, application_unique_id } = req.body;

  if (!admin_name || !action || !application_unique_id) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    await db.execute(
      "INSERT INTO admin_actions (admin_name, action, application_unique_id) VALUES (?, ?, ?)",
      [admin_name, action, application_unique_id]
    );
    res.json({ success: true, message: "Action logged" });
  } catch (err) {
    console.error("Failed to log admin action:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

module.exports = router;
