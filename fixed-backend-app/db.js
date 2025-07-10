require("dotenv").config();
const mysql = require("mysql2/promise"); // ✅ Required import

const db = mysql.createPool({
  host: process.env.DB_HOST, // ✅ Use correct keys
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = db;
