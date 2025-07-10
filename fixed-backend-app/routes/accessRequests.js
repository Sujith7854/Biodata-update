router.post("/verify-otp", async (req, res) => {
  const { phone_number, otp } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM access_requests WHERE phone_number = ? AND otp = ?",
      [phone_number, otp]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    // Mark as verified
    await db.query(
      "UPDATE access_requests SET is_verified = true WHERE phone_number = ?",
      [phone_number]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("OTP verification failed:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
