// routes\trace\index.js
const express = require("express");
const router = express.Router();

const registerMainSearchRoute = require("./mainsearchroute");
const { registerUidRoutes } = require("./uid");
const registerProductionLineRoutes = require("./productionline");
const { registerEndOfLineUidRoutes } = require("./endoflineuid");

// ✅ Import the full traceability report route
const traceFullReport = require("./trace");

// ✅ Import the equipment pass rate route
const equipmentPassRate = require("./equipmentPassRate");

// ✅ Import the rework approved count route
const reworkApprovedCount = require("./reworkapprovedcount");

// ✅ Import the rework pending from production route
const reworkPendingFromProduction = require("./reworkPendingfromproduction");

// ✅ Import the rework pending count route
const reworkPendingCount = require("./reworkPendingcount");

// ✅ NEW — Import the Analysis route
const analysisRoute = require("./analysis");


/* ------------------------------------------------------------------
   ROUTE REGISTRATION ORDER
   (Keep more general search routes first,
    then specialized or detailed endpoints)
------------------------------------------------------------------- */


// ✅ Mount mainsearchroute FIRST (handles: /api/trace?productid=PR4, /api/trace?uid=... etc.)
registerMainSearchRoute(router);

// ✅ Mount traceFullReport for detailed reports ONLY (handles: /api/trace/report?uid=...&detail=1)
// router.use("/report", traceFullReport);
router.use("/", traceFullReport);


// ✅ Mount equipment pass rate route (handles: /api/trace/equipment-pass-rate?uid=...)
router.use("/equipment-pass-rate", equipmentPassRate);

// ✅ Mount rework approved count route (handles: /api/trace/rework-approved/...)
router.use("/rework-approved", reworkApprovedCount);

// ✅ Mount rework pending from production route (handles: /api/trace/rework-pending/...)
router.use("/rework-pending", reworkPendingFromProduction);

// ✅ Mount rework pending count route (handles: /api/trace/rework-pending-count/...)
router.use("/rework-pending-count", reworkPendingCount);

registerUidRoutes(router);
registerProductionLineRoutes(router);
registerEndOfLineUidRoutes(router);

// ✅ 6️⃣ NEW — Analysis data route
// Use at the bottom so it doesn't conflict with existing UID-report endpoints.
// Accessible at:  /api/trace/analysis?uid=<id>
router.use("/", analysisRoute);


module.exports = router;