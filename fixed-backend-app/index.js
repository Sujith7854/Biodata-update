const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// Increase JSON and URL-encoded body size limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Whitelist of allowed origins
const whitelist = [
  "http://localhost:5173",             // Local development
  "https://tkkv.netlify.app",         // Deployed Netlify app
  "https://www.yourcustomdomain.com"  // Optional custom domain
];

// Dynamic CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Serve uploaded images publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─────────────── Routes ───────────────
const applicationRoutes = require("./routes/application");
const adminAuthRoutes = require("./routes/adminAuth");
const adminRoutes = require("./routes/admin");
const adminActionsRoutes = require("./routes/adminActions");
const accessRoutes = require("./routes/access");

app.use("/api/access", accessRoutes);
app.use("/api", applicationRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/actions", adminActionsRoutes);

// ─────────────── Start Server ───────────────
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
