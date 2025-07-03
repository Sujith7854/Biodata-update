const express = require("express");
const router = express.Router();

// Hardcoded credentials for now
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123", // You can change this to whatever you want
};

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  ) {
    return res.json({ success: true, admin: { name: username } });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }
});

module.exports = router;
