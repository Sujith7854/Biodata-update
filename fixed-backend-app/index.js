const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());

// ✅ Add body size limits (for JSON and form data)
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// ✅ Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api", require("./routes/application"));
app.use("/api/admin", require("./routes/admin")); // Dashboard actions
app.use("/api/admin/auth", require("./routes/adminAuth")); // 🔐 Login
app.use("/api/admin", require("./routes/adminActions"));
app.use("/uploads", express.static("uploads"));

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
