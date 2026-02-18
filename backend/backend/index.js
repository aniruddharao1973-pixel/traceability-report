// // backend\backend\index.js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// require('./db'); // triggers pool connection + logs

// // ✅ Use the new modular router instead of trace_backup
// const traceRouter = require('./routes/trace');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/trace', traceRouter);
// app.get('/health', (req, res) => res.send('ok'));

// const port = process.env.PORT || 4000;

// // ✅ Start server and store reference
// const server = app.listen(port, () => {
//   console.log(`✅ Server listening on ${port}`);
// });

// // ✅ Graceful shutdown - solves stuck port issues
// const shutdown = () => {
//   console.log('\n🛑 Shutting down server...');
//   server.close(() => {
//     console.log('🔁 Port released. Bye!');
//     process.exit(0);
//   });
// };

// process.on('SIGINT', shutdown);
// process.on('SIGTERM', shutdown);

require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./db");

const traceRouter = require("./routes/trace");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/trace", traceRouter);
app.get("/health", (req, res) => res.send("ok"));

const port = process.env.PORT || 4000;

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server listening on 0.0.0.0:${port}`);
});

// Graceful shutdown
const shutdown = () => {
  console.log("\n🛑 Shutting down server...");
  server.close(() => {
    console.log("🔁 Port released. Bye!");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
