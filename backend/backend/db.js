// // db.js
// require('dotenv').config();
// const sql = require('mssql');

// const config = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   server: process.env.DB_SERVER,
//   database: process.env.DB_DATABASE,
//   options: {
//     encrypt: process.env.DB_ENCRYPT === 'true',
//     enableArithAbort: true,
//     trustServerCertificate: true // ✅ helps avoid cert issues in dev/local
//   },
//   connectionTimeout: 30000,
//   requestTimeout: 180000, // ✅ Reduced from 180s to 60s
//   pool: {
//     max: 15,             // ✅ Increased from 10 to 15
//     min: 5,              // ✅ Increased from 2 to 5 (keeps more connections ready)
//     idleTimeoutMillis: 120000, // ✅ Increased from 30s to 120s (2 minutes)
//     acquireTimeoutMillis: 30000,
//     createTimeoutMillis: 30000,
//     destroyTimeoutMillis: 5000,
//     reapIntervalMillis: 1000,
//     createRetryIntervalMillis: 200
//   }
// };

// // ✅ Handle pool connection cleanly
// const poolPromise = new sql.ConnectionPool(config)
//   .connect()
//   .then(async (pool) => {
//     console.log('✅ Connected to SQL Server. Good to go');

//     // ✅ PRE-WARM CONNECTIONS: Establish min connections immediately
//     console.log('🔥 Pre-warming database connections...');
//     const warmupPromises = [];
//     for (let i = 0; i < 3; i++) { // Pre-warm 3 connections (of min: 5)
//       warmupPromises.push(
//         pool.request().query('SELECT 1')
//           .catch(err => console.log(`⚠️ Warm-up connection ${i+1} failed:`, err.message))
//       );
//     }

//     await Promise.allSettled(warmupPromises);
//     console.log('✅ Database connections pre-warmed and ready');

//     return pool;
//   })
//   .catch(err => {
//     console.error('❌ SQL Connection Error:', err);
//     process.exit(1); // stop server if DB fails
//   });

// // ✅ KEEP-ALIVE: Prevent connections from going idle
// let keepAliveInterval;
// poolPromise.then((pool) => {
//   keepAliveInterval = setInterval(async () => {
//     try {
//       const request = pool.request();
//       await request.query('SELECT 1');
//       // console.log('🫀 Connection keep-alive successful'); // Optional: uncomment for debugging
//     } catch (err) {
//       console.log('⚠️ Keep-alive failed:', err.message);
//     }
//   }, 45000); // Run every 45 seconds (less than 120s idle timeout)
// });

// // ✅ Cleanup on server shutdown
// process.on('SIGTERM', () => {
//   if (keepAliveInterval) {
//     clearInterval(keepAliveInterval);
//   }
// });

// process.on('SIGINT', () => {
//   if (keepAliveInterval) {
//     clearInterval(keepAliveInterval);
//   }
// });

// // ✅ Optional: handle unexpected disconnections
// sql.on('error', err => {
//   console.error('⚠️ SQL Global Error:', err);
// });

// module.exports = { sql, poolPromise };

// db.js
require("dotenv").config();
const { Pool } = require("pg");

// PostgreSQL connection configuration
const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  max: 15,
  min: 5,
  idleTimeoutMillis: 120000,
  connectionTimeoutMillis: 30000,
});

// ✅ Handle pool connection cleanly
const poolPromise = pool
  .connect()
  .then(async (client) => {
    console.log("✅ Connected to PostgreSQL. Good to go");

    // ✅ PRE-WARM CONNECTIONS: Establish min connections immediately
    console.log("🔥 Pre-warming database connections...");
    const warmupPromises = [];
    for (let i = 0; i < 3; i++) {
      // Pre-warm 3 connections (of min: 5)
      warmupPromises.push(
        pool
          .query("SELECT 1")
          .catch((err) =>
            console.log(`⚠️ Warm-up connection ${i + 1} failed:`, err.message),
          ),
      );
    }

    await Promise.allSettled(warmupPromises);
    console.log("✅ Database connections pre-warmed and ready");

    client.release(); // Release the initial client back to pool
    return pool;
  })
  .catch((err) => {
    console.error("❌ PostgreSQL Connection Error:", err);
    process.exit(1); // stop server if DB fails
  });

// ✅ KEEP-ALIVE: Prevent connections from going idle
let keepAliveInterval;
poolPromise.then((pool) => {
  keepAliveInterval = setInterval(async () => {
    try {
      await pool.query("SELECT 1");
      // console.log('🫀 Connection keep-alive successful'); // Optional: uncomment for debugging
    } catch (err) {
      console.log("⚠️ Keep-alive failed:", err.message);
    }
  }, 45000); // Run every 45 seconds (less than 120s idle timeout)
});

// ✅ Cleanup on server shutdown
process.on("SIGTERM", async () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
  }
  await pool.end();
});

process.on("SIGINT", async () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
  }
  await pool.end();
});

// ✅ Optional: handle unexpected disconnections
pool.on("error", (err) => {
  console.error("⚠️ PostgreSQL Pool Error:", err);
});

module.exports = { pool, poolPromise };
