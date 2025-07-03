// backend-app/db.js
const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "my-secret-pw",
  database: "form_applications",
});

module.exports = db;
