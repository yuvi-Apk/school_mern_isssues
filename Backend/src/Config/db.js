import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "school_db",
//   port: 3306, // Use the default MySQL port
//   // ssl: {
//   //   rejectUnauthorized: true,
//   // },
//   // waitForConnections: true,
//   // connectionLimit: 10,
//   // queueLimit: 0,
// });

const pool = mysql.createPool({
  host: "103.185.75.157",
  user: "imslite_local_test",
  password: 'Mc$zdCf4J%wM',
  database: "imslite_school_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
(async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("✅ MySQL Connected");
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  } finally {
    if (conn) conn.release(); // Ensure the connection is released
  }
})();

export default pool;
