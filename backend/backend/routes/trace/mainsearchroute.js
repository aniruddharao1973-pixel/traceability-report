// // routes/trace/mainsearchroute.js
// // * Part 1: Main search route — delegates to UID exact, EOL exact, Other columns exact

// const { poolPromise, sql } = require("../../db"); // * path fixed (one level up from routes/trace)
// const { handleUidExact } = require("./uid");      // * Part 2 handler
// const { handleEndOfLineExact } = require("./endoflineuid"); // * Part 3 handler
// const { handleOtherColumnsExact } = require("./othercolumns"); // * Part 4 handler
// const registerProductionLineRoutes = require("./productionline"); // << add
// const { registerEndOfLineUidRoutes } = require('./endoflineuid') // ✅ correct relative path

// function registerMainSearchRoute(router) {
//   router.get("/", async (req, res) => {
//     try {
//       // * Allowed keys (same as original)
//       const allowedKeys = [
//         "uid",
//         "productid",
//         "productmodelname",
//         "productvariant",
//         "productionstartdate",
//         "productionenddate",
//         "status",
//         "endoflineuid",
//       ];

//       // * Pick active search key
//       const searchKey = allowedKeys.find((k) => req.query[k] !== undefined);
//       if (!searchKey) {
//         return res.status(400).json({ ok: false, error: "Search key required" });
//       }

//       // * Validate value existence
//       const rawValue = req.query[searchKey];
//       if (!rawValue || String(rawValue).trim().length === 0) {
//         return res.status(400).json({ ok: false, error: `${searchKey} value required` });
//       }

//       // * Common params
//       const value = String(rawValue).trim();
//       const fromDate = req.query.fromDate || null;
//       const toDate = req.query.toDate || null;
//       const fromTime = req.query.fromTime || "00:00:00";
//       const toTime = req.query.toTime || "23:59:59";

//       // ✅ OPTIMIZATION: Remove pool await - it's already connected
//       // const pool = await poolPromise; // ❌ REMOVED - causing 19s delay

//       // * Dispatch to parts
//       if (searchKey === "uid") {
//         // * Part 2a: UID exact
//         return await handleUidExact({ req, res, sql, value, fromDate, toDate, fromTime, toTime });
//         // ✅ Remove 'pool' parameter
//       }

//       if (searchKey === "endoflineuid") {
//         // * Part 3: End-of-line UID exact
//         return await handleEndOfLineExact({ req, res, sql, value, fromDate, toDate, fromTime, toTime });
//         // ✅ Remove 'pool' parameter
//       }

//       // * Part 4: Other columns exact match (with pagination rules)
//       return await handleOtherColumnsExact({
//         req,
//         res,
//         sql,
//         searchKey,
//         value,
//         fromDate,
//         toDate,
//         fromTime,
//         toTime,
//         // ✅ Remove 'pool' parameter
//       });

//     } catch (err) {
//       console.error("[trace] error", err);
//       return res.status(500).json({ ok: false, error: String(err) });
//     }
//   });
// }

// module.exports = registerMainSearchRoute;



  // routes/trace/mainsearchroute.js
// * Part 1: Main search route — delegates to UID exact, EOL exact, Other columns exact

const { pool } = require("../../db"); // * Updated to use pool directly
const { handleUidExact } = require("./uid");      // * Part 2 handler
const { handleEndOfLineExact } = require("./endoflineuid"); // * Part 3 handler
const { handleOtherColumnsExact } = require("./othercolumns"); // * Part 4 handler
const registerProductionLineRoutes = require("./productionline"); // << add
const { registerEndOfLineUidRoutes } = require('./endoflineuid') // ✅ correct relative path

function registerMainSearchRoute(router) {
  router.get("/", async (req, res) => {
    try {
      // * Allowed keys (same as original)
      const allowedKeys = [
        "uid",
        "productid",
        "productmodelname",
        "productvariant",
        "productionstartdate",
        "productionenddate",
        "status",
        "endoflineuid",
      ];

      // * Pick active search key
      const searchKey = allowedKeys.find((k) => req.query[k] !== undefined);
      if (!searchKey) {
        return res.status(400).json({ ok: false, error: "Search key required" });
      }

      // * Validate value existence
      const rawValue = req.query[searchKey];
      if (!rawValue || String(rawValue).trim().length === 0) {
        return res.status(400).json({ ok: false, error: `${searchKey} value required` });
      }

      // * Common params
      const value = String(rawValue).trim();
      const fromDate = req.query.fromDate || null;
      const toDate = req.query.toDate || null;
      const fromTime = req.query.fromTime || "00:00:00";
      const toTime = req.query.toTime || "23:59:59";

      // * Dispatch to parts (REMOVED sql parameter from all handlers)
      if (searchKey === "uid") {
        // * Part 2a: UID exact
        return await handleUidExact({ req, res, value, fromDate, toDate, fromTime, toTime });
      }

      if (searchKey === "endoflineuid") {
        // * Part 3: End-of-line UID exact
        return await handleEndOfLineExact({ req, res, value, fromDate, toDate, fromTime, toTime });
      }

      // * Part 4: Other columns exact match (with pagination rules)
      return await handleOtherColumnsExact({
        req,
        res,
        searchKey,
        value,
        fromDate,
        toDate,
        fromTime,
        toTime,
      });

    } catch (err) {
      console.error("[trace] error", err);
      return res.status(500).json({ ok: false, error: String(err) });
    }
  });
}

module.exports = registerMainSearchRoute;