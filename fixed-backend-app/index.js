const express = require("express");
const app = express();
const cors = require("cors");
const applicationRoutes = require("./routes/application");
const adminAuthRoutes = require("./routes/adminAuth"); // ✅ Add this
const adminRoutes = require("./routes/admin");
const adminActionsRoutes = require("./routes/adminActions");
const accessControlRoutes = require("./routes/access");
const accessRoutes = require("./routes/access");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api", accessControlRoutes);
app.use("/api", accessRoutes);

// Routes
app.use("/api/access", accessControlRoutes);
app.use("/api", applicationRoutes);
app.use("/api/admin/auth", adminAuthRoutes); // ✅ Must be mounted
app.use("/api/admin", adminRoutes);
app.use("/api/admin/actions", adminActionsRoutes);
app.use("/api", require("./routes/access"));

app.listen(5050, () => {
  console.log("Server running on http://localhost:5050");
});
