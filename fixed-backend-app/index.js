const express = require("express");
const cors = require("cors");
const app = express();

// Increase JSON and URL-encoded body size limit
app.use(express.json({ limit: "10mb" })); // 🔼 JSON payload limit
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // 🔼 for form-data (non-file)

// Whitelist of allowed origins
const whitelist = [
  "http://localhost:5173", // Local development
  "https://tkkv.netlify.app", // Replace with your actual Netlify domain
  "https://www.yourcustomdomain.com", // Optional: if you use a custom domain
];

// Dynamic CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
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

const PORT = process.env.PORT || 5050; // ✅ Let Render assign it

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
