const express = require("express");
const router = express.Router();
const db = require("../db");
const generateOTP = require("../utils/generateOTP");
const crypto = require("crypto");

// POST /api/request-access
router.post("/request-access", async (req, res) => {
  const { full_name, phone_number, country, state, city, is_existing } =
    req.body;

  try {
    const otp = generateOTP();

    if (is_existing) {
      // Check if user exists
      const [rows] = await db.query(
        "SELECT * FROM access_requests WHERE full_name = ? AND phone_number = ? AND is_verified = 1",
        [full_name, phone_number]
      );

      if (rows.length === 0) {
        return res.json({
          success: false,
          message: "User not found or not verified",
        });
      }

      // Update OTP
      await db.query(
        "UPDATE access_requests SET otp = ?, is_verified = 0 WHERE full_name = ? AND phone_number = ?",
        [otp, full_name, phone_number]
      );
    } else {
      // Insert new record
      await db.query(
        `INSERT INTO access_requests 
          (full_name, phone_number, country, state, city, otp, is_verified, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 0, NOW())`,
        [full_name, phone_number, country, state, city, otp]
      );
    }

    console.log(`Generated OTP for ${phone_number}: ${otp}`);
    return res.json({ success: true });
  } catch (err) {
    console.error("Error in /request-access", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/verify-otp
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone_number, otp } = req.body;

    if (!phone_number || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number and OTP are required" });
    }

    const [rows] = await db.query(
      `SELECT * FROM access_requests WHERE phone_number = ? AND otp = ? AND is_verified = 0 ORDER BY created_at DESC LIMIT 1`,
      [phone_number, otp]
    );

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid OTP or already verified" });
    }

    await db.query(`UPDATE access_requests SET is_verified = 1 WHERE id = ?`, [
      rows[0].id,
    ]);

    return res.json({ success: true, message: "OTP verified successfully" });
  } catch (err) {
    console.error("Error in /verify-otp:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
