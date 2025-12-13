// // routes/trace.js  (replace the existing router.get('/', ...) handler with this)
// // # CHANGED: use OUTER APPLY so detail mode returns all productionlifecycle rows even if no tests

// const express = require('express');
// const router = express.Router();
// const { poolPromise, sql } = require('../../db');



// // helper validators
// const isValidDateString = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d);
// const isValidTimeString = (t) => /^\d{2}:\d{2}:\d{2}$/.test(t);

// // GET /api/trace?uid=...&fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD&fromTime=HH:mm:ss&toTime=HH:mm:ss&detail=1
// router.get('/', async (req, res) => {
//   try {
//     let uid = req.query.uid;
//     if (!uid) return res.status(400).json({ error: 'uid query parameter is required' });
//     uid = String(uid).trim();

//     const fromDate = req.query.fromDate ? String(req.query.fromDate).trim() : null; // YYYY-MM-DD
//     const toDate = req.query.toDate ? String(req.query.toDate).trim() : null;     // YYYY-MM-DD
//     const fromTime = req.query.fromTime ? String(req.query.fromTime).trim() : '00:00:00';
//     const toTime = req.query.toTime ? String(req.query.toTime).trim() : '23:59:59';
//     const detailMode = String(req.query.detail || '').trim() === '1'; // # CHANGED: enable nested JSON mode

//     console.log('[trace] incoming uid:', JSON.stringify(uid));
//     console.log('[trace] date filters:', { fromDate, toDate, fromTime, toTime, detailMode });

//     const pool = await poolPromise;
//     const dbReq = pool.request();
//     dbReq.input('uid', sql.VarChar(200), uid);

//     let query;
//     // If date filters are valid, bind start/end strings
//     if (fromDate && toDate && isValidDateString(fromDate) && isValidDateString(toDate)
//         && isValidTimeString(fromTime) && isValidTimeString(toTime)) {

//       const startStr = `${fromDate} ${fromTime}`; // "YYYY-MM-DD HH:mm:ss"
//       const endStr   = `${toDate} ${toTime}`;

//       dbReq.input('startDTStr', sql.VarChar(19), startStr);
//       dbReq.input('endDTStr', sql.VarChar(19), endStr);

//       // # CHANGED: detail mode -> use OUTER APPLY to compute tests_json (keeps pl rows even when no tests)
//       if (detailMode) {
//         query = `
//           SELECT
//             pl.uid,
//             ISNULL(e.equipmentname, pl.equipmentid) AS equipmentname,
//             pl.productmodelname,
//             pl.productvariant,
//             FORMAT(pl.productionstartdate, 'M/d/yyyy, h:mm:ss tt') AS productionstartdate,
//             FORMAT(pl.productionenddate,   'M/d/yyyy, h:mm:ss tt') AS productionenddate,
//             pl.operatorid,
//             pl.shift,
//             pl.cycletime,
//             pl.productstatus,
//             pl.productionremarks AS qualityremarks,
//             eu.endoflineuid,
//             COALESCE(t.tests_json, '[]') AS tests_json
//           FROM trace.productionlifecycle pl
//           LEFT JOIN trace.eoluid eu
//             ON pl.uid = eu.uid AND pl.productid = eu.productid
//           LEFT JOIN trace.equipments e
//             ON e.equipmentid = pl.equipmentid AND e.productid = pl.productid
//           OUTER APPLY (
//             SELECT
//               pe.testid,
//               pe.lsl,
//               pe.value,
//               pe.hsl,
//               pe.unit,
//               pe.teststatus,
//               COALESCE(pe.reworkcount, 0) AS reworkcount
//             FROM trace.producteolresults pe
//             WHERE pe.uid = pl.uid
//               AND pe.equipmentid = pl.equipmentid
//               AND ISNULL(pe.approvedcount, 0) = ISNULL(pl.approvedcount, 0)
//             ORDER BY pe.testid
//             FOR JSON PATH
//           ) AS t(tests_json)
//           WHERE RTRIM(LTRIM(pl.uid)) = @uid
//             AND pl.productionstartdate BETWEEN CONVERT(datetime2, @startDTStr, 120) AND CONVERT(datetime2, @endDTStr, 120)
//           ORDER BY pl.productionstartdate;
//         `;
//       } else {
//         // original (flat) filtered query
//         query = `
//           SELECT
//             pl.uid,
//             ISNULL(e.equipmentname, pl.equipmentid) AS equipmentname,
//             pl.productmodelname,
//             pl.productvariant,
//             FORMAT(pl.productionstartdate, 'M/d/yyyy, h:mm:ss tt') AS productionstartdate,
//             FORMAT(pl.productionenddate,   'M/d/yyyy, h:mm:ss tt') AS productionenddate,
//             pe.testid,
//             pe.lsl,
//             pe.value,
//             pe.hsl,
//             pe.unit,
//             pe.teststatus,
//             COALESCE(pe.reworkcount, TRY_CAST(pl.reworkcount AS int), 0) AS reworkcount,
//             pl.productionremarks AS qualityremarks,
//             pl.operatorid,
//             pl.shift,
//             pl.cycletime,
//             pl.productstatus,
//             eu.endoflineuid
//           FROM trace.productionlifecycle pl
//           LEFT JOIN trace.producteolresults pe
//             ON pl.uid = pe.uid
//             AND pl.equipmentid = pe.equipmentid
//             AND ISNULL(pl.approvedcount, 0) = ISNULL(pe.approvedcount, 0)
//           LEFT JOIN trace.eoluid eu
//             ON pl.uid = eu.uid
//             AND pl.productid = eu.productid
//           LEFT JOIN trace.equipments e
//             ON e.equipmentid = pl.equipmentid
//             AND e.productid = pl.productid
//           WHERE RTRIM(LTRIM(pl.uid)) = @uid
//             AND pl.productionstartdate BETWEEN CONVERT(datetime2, @startDTStr, 120) AND CONVERT(datetime2, @endDTStr, 120)
//           ORDER BY pl.productionstartdate;
//         `;
//       }
//     } else {
//       // unfiltered (no date) paths
//       if (detailMode) {
//         // # CHANGED: nested JSON unfiltered using OUTER APPLY
//         query = `
//           SELECT
//             pl.uid,
//             ISNULL(e.equipmentname, pl.equipmentid) AS equipmentname,
//             pl.productmodelname,
//             pl.productvariant,
//             FORMAT(pl.productionstartdate, 'M/d/yyyy, h:mm:ss tt') AS productionstartdate,
//             FORMAT(pl.productionenddate,   'M/d/yyyy, h:mm:ss tt') AS productionenddate,
//             pl.operatorid,
//             pl.shift,
//             pl.cycletime,
//             pl.productstatus,
//             pl.productionremarks AS qualityremarks,
//             eu.endoflineuid,
//             COALESCE(t.tests_json, '[]') AS tests_json
//           FROM trace.productionlifecycle pl
//           LEFT JOIN trace.eoluid eu
//             ON pl.uid = eu.uid AND pl.productid = eu.productid
//           LEFT JOIN trace.equipments e
//             ON e.equipmentid = pl.equipmentid AND e.productid = pl.productid
//           OUTER APPLY (
//             SELECT
//               pe.testid,
//               pe.lsl,
//               pe.value,
//               pe.hsl,
//               pe.unit,
//               pe.teststatus,
//               COALESCE(pe.reworkcount, 0) AS reworkcount
//             FROM trace.producteolresults pe
//             WHERE pe.uid = pl.uid
//               AND pe.equipmentid = pl.equipmentid
//               AND ISNULL(pe.approvedcount, 0) = ISNULL(pl.approvedcount, 0)
//             ORDER BY pe.testid
//             FOR JSON PATH
//           ) AS t(tests_json)
//           WHERE RTRIM(LTRIM(pl.uid)) = @uid
//           ORDER BY pl.productionstartdate;
//         `;
//       } else {
//         // existing unfiltered query kept as-is
//         query = `
//           SELECT
//             pl.uid,
//             ISNULL(e.equipmentname, pl.equipmentid) AS equipmentname,
//             pl.productmodelname,
//             pl.productvariant,
//             FORMAT(pl.productionstartdate, 'M/d/yyyy, h:mm:ss tt') AS productionstartdate,
//             FORMAT(pl.productionenddate,   'M/d/yyyy, h:mm:ss tt') AS productionenddate,
//             pe.testid,
//             pe.lsl,
//             pe.value,
//             pe.hsl,
//             pe.unit,
//             pe.teststatus,
//             COALESCE(pe.reworkcount, TRY_CAST(pl.reworkcount AS int), 0) AS reworkcount,
//             pl.productionremarks AS qualityremarks,
//             pl.operatorid,
//             pl.shift,
//             pl.cycletime,
//             pl.productstatus,
//             eu.endoflineuid
//           FROM trace.productionlifecycle pl
//           LEFT JOIN trace.producteolresults pe
//             ON pl.uid = pe.uid
//             AND pl.equipmentid = pe.equipmentid
//             AND ISNULL(pl.approvedcount, 0) = ISNULL(pe.approvedcount, 0)
//           LEFT JOIN trace.eoluid eu
//             ON pl.uid = eu.uid
//             AND pl.productid = eu.productid
//           LEFT JOIN trace.equipments e
//             ON e.equipmentid = pl.equipmentid
//             AND e.productid = pl.productid
//           WHERE RTRIM(LTRIM(pl.uid)) = @uid
//           ORDER BY pl.productionstartdate;
//         `;
//       }
//     }

//     const result = await dbReq.query(query);
//     let rows = result?.recordset ?? [];
//     console.log(`[trace] rows returned for uid=${uid}: ${rows.length}`);

//     // # CHANGED: parse tests_json into tests[] when detailMode was active
//     if (detailMode) {
//       rows = rows.map(r => {
//         let tests = [];
//         try { tests = r.tests_json ? JSON.parse(r.tests_json) : []; } catch (e) { tests = []; }
//         // remove tests_json string, add parsed tests array
//         const { tests_json, ...rest } = r;
//         return { ...rest, tests };
//       });
//     }

//     return res.json(rows);
//   } catch (err) {
//     console.error('[trace] API error:', err);
//     return res.status(500).json({ error: err?.message || String(err) });
//   }
// });

// module.exports = router;




// // routes/trace.js
// const express = require('express');
// const router = express.Router();
// const { pool } = require('../../db');

// // helper validators
// const isValidDateString = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d);
// const isValidTimeString = (t) => /^\d{2}:\d{2}:\d{2}$/.test(t);

// // GET /api/trace/report?uid=...&fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD&fromTime=HH:mm:ss&toTime=HH:mm:ss&detail=1
// router.get('/report', async (req, res) => {
//   const client = await pool.connect();
//   try {
//     let uid = req.query.uid;
//     if (!uid) return res.status(400).json({ error: 'uid query parameter is required' });
//     uid = String(uid).trim();

//     const fromDate = req.query.fromDate ? String(req.query.fromDate).trim() : null;
//     const toDate = req.query.toDate ? String(req.query.toDate).trim() : null;
//     const fromTime = req.query.fromTime ? String(req.query.fromTime).trim() : '00:00:00';
//     const toTime = req.query.toTime ? String(req.query.toTime).trim() : '23:59:59';
//     const detailMode = String(req.query.detail || '').trim() === '1';

//     console.log('[trace] incoming uid:', JSON.stringify(uid));
//     console.log('[trace] date filters:', { fromDate, toDate, fromTime, toTime, detailMode });

//     let query;
//     let queryParams = [uid];

//     // If date filters are valid, bind start/end strings
//     if (fromDate && toDate && isValidDateString(fromDate) && isValidDateString(toDate)
//         && isValidTimeString(fromTime) && isValidTimeString(toTime)) {

//       const startStr = `${fromDate} ${fromTime}`;
//       const endStr   = `${toDate} ${toTime}`;

//       queryParams.push(startStr, endStr);

//       if (detailMode) {
//         query = `
//           SELECT
//             pl.uid,
//             COALESCE(e.equipmentname, pl.equipmentid) AS equipmentname,
//             pl.productmodelname,
//             pl.productvariant,
//             TO_CHAR(pl.productionstartdate, 'MM/DD/YYYY, HH12:MI:SS AM') AS productionstartdate,
//             TO_CHAR(pl.productionenddate, 'MM/DD/YYYY, HH12:MI:SS AM') AS productionenddate,
//             pl.operatorid,
//             pl.shift,
//             pl.cycletime,
//             pl.productstatus,
//             pl.productionremarks AS qualityremarks,
//             eu.endoflineuid,
//             COALESCE(t.tests_json, '[]') AS tests_json
//           FROM public.productionlifecycle pl
//           LEFT JOIN public.eoluid eu
//             ON pl.uid = eu.uid AND pl.productid = eu.productid
//           LEFT JOIN public.equipments e
//             ON e.equipmentid = pl.equipmentid AND e.productid = pl.productid
//           LEFT JOIN LATERAL (
//             SELECT JSON_AGG(
//               JSON_BUILD_OBJECT(
//                 'testid', pe.testid,
//                 'lsl', pe.lsl,
//                 'value', pe.value,
//                 'hsl', pe.hsl,
//                 'unit', pe.unit,
//                 'teststatus', pe.teststatus,
//                 'reworkcount', COALESCE(pe.reworkcount, 0)
//               )
//             ) AS tests_json
//             FROM public.producteolresults pe
//             WHERE pe.uid = pl.uid
//               AND pe.equipmentid = pl.equipmentid
//               AND COALESCE(pe.approvedcount, 0) = COALESCE(pl.approvedcount, 0)
            
//           ) AS t ON true
//           WHERE TRIM(pl.uid)::text = TRIM($1)::text
//             AND pl.productionstartdate BETWEEN $2 AND $3
//           ORDER BY pl.productionstartdate;
//         `;
//       } else {
//         // original (flat) filtered query
//         query = `
//           SELECT
//             pl.uid,
//             COALESCE(e.equipmentname, pl.equipmentid) AS equipmentname,
//             pl.productmodelname,
//             pl.productvariant,
//             TO_CHAR(pl.productionstartdate, 'MM/DD/YYYY, HH12:MI:SS AM') AS productionstartdate,
//             TO_CHAR(pl.productionenddate, 'MM/DD/YYYY, HH12:MI:SS AM') AS productionenddate,
//             pe.testid,
//             pe.lsl,
//             pe.value,
//             pe.hsl,
//             pe.unit,
//             pe.teststatus,
//             COALESCE(pe.reworkcount, pl.reworkcount::integer, 0) AS reworkcount,
//             pl.productionremarks AS qualityremarks,
//             pl.operatorid,
//             pl.shift,
//             pl.cycletime,
//             pl.productstatus,
//             eu.endoflineuid
//           FROM public.productionlifecycle pl
//           LEFT JOIN public.producteolresults pe
//             ON pl.uid = pe.uid
//             AND pl.equipmentid = pe.equipmentid
//             AND COALESCE(pl.approvedcount, 0) = COALESCE(pe.approvedcount, 0)
//           LEFT JOIN public.eoluid eu
//             ON pl.uid = eu.uid
//             AND pl.productid = eu.productid
//           LEFT JOIN public.equipments e
//             ON e.equipmentid = pl.equipmentid
//             AND e.productid = pl.productid
//           WHERE TRIM(pl.uid)::text = TRIM($1)::text
//             AND pl.productionstartdate BETWEEN $2 AND $3
//           ORDER BY pl.productionstartdate;
//         `;
//       }
//     } else {
//       // unfiltered (no date) paths
//       if (detailMode) {
//         query = `
//           SELECT
//             pl.uid,
//             COALESCE(e.equipmentname, pl.equipmentid) AS equipmentname,
//             pl.productmodelname,
//             pl.productvariant,
//             TO_CHAR(pl.productionstartdate, 'MM/DD/YYYY, HH12:MI:SS AM') AS productionstartdate,
//             TO_CHAR(pl.productionenddate, 'MM/DD/YYYY, HH12:MI:SS AM') AS productionenddate,
//             pl.operatorid,
//             pl.shift,
//             pl.cycletime,
//             pl.productstatus,
//             pl.productionremarks AS qualityremarks,
//             eu.endoflineuid,
//             COALESCE(t.tests_json, '[]') AS tests_json
//           FROM public.productionlifecycle pl
//           LEFT JOIN public.eoluid eu
//             ON pl.uid = eu.uid AND pl.productid = eu.productid
//           LEFT JOIN public.equipments e
//             ON e.equipmentid = pl.equipmentid AND e.productid = pl.productid
//           LEFT JOIN LATERAL (
//             SELECT JSON_AGG(
//               JSON_BUILD_OBJECT(
//                 'testid', pe.testid,
//                 'lsl', pe.lsl,
//                 'value', pe.value,
//                 'hsl', pe.hsl,
//                 'unit', pe.unit,
//                 'teststatus', pe.teststatus,
//                 'reworkcount', COALESCE(pe.reworkcount, 0)
//               )
//             ) AS tests_json
//             FROM public.producteolresults pe
//             WHERE pe.uid = pl.uid
//               AND pe.equipmentid = pl.equipmentid
//               AND COALESCE(pe.approvedcount, 0) = COALESCE(pl.approvedcount, 0)
            
//           ) AS t ON true
//           WHERE TRIM(pl.uid)::text = TRIM($1)::text
//           ORDER BY pl.productionstartdate;
//         `;
//       } else {
//         query = `
//           SELECT
//             pl.uid,
//             COALESCE(e.equipmentname, pl.equipmentid) AS equipmentname,
//             pl.productmodelname,
//             pl.productvariant,
//             TO_CHAR(pl.productionstartdate, 'MM/DD/YYYY, HH12:MI:SS AM') AS productionstartdate,
//             TO_CHAR(pl.productionenddate, 'MM/DD/YYYY, HH12:MI:SS AM') AS productionenddate,
//             pe.testid,
//             pe.lsl,
//             pe.value,
//             pe.hsl,
//             pe.unit,
//             pe.teststatus,
//             COALESCE(pe.reworkcount, pl.reworkcount::integer, 0) AS reworkcount,
//             pl.productionremarks AS qualityremarks,
//             pl.operatorid,
//             pl.shift,
//             pl.cycletime,
//             pl.productstatus,
//             eu.endoflineuid
//           FROM public.productionlifecycle pl
//           LEFT JOIN public.producteolresults pe
//             ON pl.uid = pe.uid
//             AND pl.equipmentid = pe.equipmentid
//             AND COALESCE(pl.approvedcount, 0) = COALESCE(pe.approvedcount, 0)
//           LEFT JOIN public.eoluid eu
//             ON pl.uid = eu.uid
//             AND pl.productid = eu.productid
//           LEFT JOIN public.equipments e
//             ON e.equipmentid = pl.equipmentid
//             AND e.productid = pl.productid
//           WHERE TRIM(pl.uid)::text = TRIM($1)::text
//           ORDER BY pl.productionstartdate;
//         `;
//       }
//     }

//     const result = await client.query(query, queryParams);
//     let rows = result?.rows ?? [];
//     console.log(`[trace] rows returned for uid=${uid}: ${rows.length}`);

//     if (detailMode) {
//       rows = rows.map(r => {
//         let tests = [];
//         try { tests = r.tests_json ? JSON.parse(r.tests_json) : []; } catch (e) { tests = []; }
//         const { tests_json, ...rest } = r;
//         return { ...rest, tests };
//       });
//     }

//     return res.json(rows);
//   } catch (err) {
//     console.error('[trace] API error:', err);
//     return res.status(500).json({ error: err?.message || String(err) });
//   } finally {
//     client.release();
//   }
// });

// module.exports = router;



// routes/trace.js
const express = require('express');
const router = express.Router();
const { pool } = require('../../db');

// helper validators
const isValidDateString = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d);
const isValidTimeString = (t) => /^\d{2}:\d{2}:\d{2}$/.test(t);

// GET /api/trace/report?uid=...&fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD&fromTime=HH:mm:ss&toTime=HH:mm:ss
router.get('/report', async (req, res) => {
  const client = await pool.connect();
  try {
    let uid = req.query.uid;
    if (!uid) return res.status(400).json({ error: 'uid query parameter is required' });
    uid = String(uid).trim();

    const fromDate = req.query.fromDate ? String(req.query.fromDate).trim() : null;
    const toDate = req.query.toDate ? String(req.query.toDate).trim() : null;
    const fromTime = req.query.fromTime ? String(req.query.fromTime).trim() : '00:00:00';
    const toTime = req.query.toTime ? String(req.query.toTime).trim() : '23:59:59';

    let query;
    let queryParams = [uid];

    // If date filters are valid, bind start/end strings
    if (
      fromDate && toDate &&
      isValidDateString(fromDate) && isValidDateString(toDate) &&
      isValidTimeString(fromTime) && isValidTimeString(toTime)
    ) {
      const startStr = `${fromDate} ${fromTime}`;
      const endStr = `${toDate} ${toTime}`;
      queryParams.push(startStr, endStr);

      query = `
        SELECT
          pl.uid,
          COALESCE(e.equipmentname, pl.equipmentid) AS equipmentname,
          pl.productmodelname,
          pl.productvariant,
          TO_CHAR(pl.productionstartdate, 'MM/DD/YYYY, HH12:MI:SS AM') AS productionstartdate,
          TO_CHAR(pl.productionenddate, 'MM/DD/YYYY, HH12:MI:SS AM') AS productionenddate,
          pe.testid,
          pe.lsl,
          pe.value,
          pe.hsl,
          pe.unit,
          pe.teststatus,
          COALESCE(pe.reworkcount, 0) AS reworkcount,
          pl.productionremarks AS qualityremarks,
          pl.operatorid,
          pl.shift,
          pl.cycletime,
          pl.productstatus,
          eu.endoflineuid
        FROM public.productionlifecycle pl
        LEFT JOIN public.producteolresults pe
          ON pl.uid = pe.uid
          AND pl.equipmentid = pe.equipmentid
          AND COALESCE(pl.approvedcount, 0) = COALESCE(pe.approvedcount, 0)
        LEFT JOIN public.eoluid eu
          ON pl.uid = eu.uid
          AND pl.productid = eu.productid
        LEFT JOIN public.equipments e
          ON e.equipmentid = pl.equipmentid
          AND e.productid = pl.productid
        WHERE TRIM(pl.uid)::text = TRIM($1)::text
          AND pl.productionstartdate BETWEEN $2 AND $3
        ORDER BY pl.productionstartdate, pe.testid;
      `;
    } else {
      // No date filter
      query = `
        SELECT
          pl.uid,
          COALESCE(e.equipmentname, pl.equipmentid) AS equipmentname,
          pl.productmodelname,
          pl.productvariant,
          TO_CHAR(pl.productionstartdate, 'MM/DD/YYYY, HH12:MI:SS AM') AS productionstartdate,
          TO_CHAR(pl.productionenddate, 'MM/DD/YYYY, HH12:MI:SS AM') AS productionenddate,
          pe.testid,
          pe.lsl,
          pe.value,
          pe.hsl,
          pe.unit,
          pe.teststatus,
          COALESCE(pe.reworkcount, 0) AS reworkcount,
          pl.productionremarks AS qualityremarks,
          pl.operatorid,
          pl.shift,
          pl.cycletime,
          pl.productstatus,
          eu.endoflineuid
        FROM public.productionlifecycle pl
        LEFT JOIN public.producteolresults pe
          ON pl.uid = pe.uid
          AND pl.equipmentid = pe.equipmentid
          AND COALESCE(pl.approvedcount, 0) = COALESCE(pe.approvedcount, 0)
        LEFT JOIN public.eoluid eu
          ON pl.uid = eu.uid
          AND pl.productid = eu.productid
        LEFT JOIN public.equipments e
          ON e.equipmentid = pl.equipmentid
          AND e.productid = pl.productid
        WHERE TRIM(pl.uid)::text = TRIM($1)::text
        ORDER BY pl.productionstartdate, pe.testid;
      `;
    }

    const result = await client.query(query, queryParams);
    let rows = result?.rows ?? [];
    console.log(`[trace] rows returned for uid=${uid}: ${rows.length}`);

    // No need to flatten or parse anything!
    return res.json(rows);
  } catch (err) {
    console.error('[trace] API error:', err);
    return res.status(500).json({ error: err?.message || String(err) });
  } finally {
    client.release();
  }
});

module.exports = router;
