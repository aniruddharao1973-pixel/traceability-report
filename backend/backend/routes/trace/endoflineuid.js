// // routes/trace/endoflineuid.js
// // * Part 3: End-of-line UID exact (used by main route)
// // * Now resolves EOL → UID via trace.eoluid, then reads canonical status from trace.production_status

// const { poolPromise, sql } = require("../../db"); // corrected path

// async function handleEndOfLineExact({ req, res, pool, sql, value, fromDate, toDate, fromTime, toTime }) {
//   const db = pool || (await poolPromise);
//   const r = db.request();
//   r.timeout = 60000;

//   // Inputs
//   r.input("needle", sql.VarChar(200), value);

//   // Optional date range (applies to productionstartdate from the view)
//   let dateFilter = "";
//   if (fromDate && toDate) {
//     const startStr = `${fromDate} ${fromTime || "00:00:00"}`;
//     const endStr = `${toDate} ${toTime || "23:59:59"}`;
//     r.input("startDTStr", sql.VarChar(19), startStr);
//     r.input("endDTStr", sql.VarChar(19), endStr);
//     dateFilter = `
//       AND ps.productionstartdate BETWEEN CONVERT(datetime2, @startDTStr, 120)
//                                     AND CONVERT(datetime2, @endDTStr, 120)
//     `;
//   }

//   // Resolve exact endoflineuid to UID/ProductID, then pull canonical row from production_status
//   const sqlText = `
//     SELECT
//       ps.uid,
//       ps.productid,
//       ps.productmodelname,
//       ps.productvariant,
//       ps.lastequipmentid                                 AS equipmentid,
//       ps.lastequipmentid                                 AS equipmentname,   -- view has no name; mirror id
//       NULL                                               AS operatorid,
//       NULL                                               AS shift,
//       NULL                                               AS cycletime,
//       ps.status                                          AS status,          -- 'IN PROGRESS' | 'COMPLETED' | 'SCRAP'
//       NULL                                               AS qualityremarks,
//       CONVERT(varchar(19), ps.productionstartdate, 120)  AS productionstartdate,
//       CONVERT(varchar(19), ps.productionenddate, 120)    AS productionenddate,
//       eu.endoflineuid,
//       'Yes'                                              AS hasEOLUID,
//       'production_status'                                AS _source,
//       'endoflineuid'                                     AS _matchedBy
//     FROM trace.eoluid eu
//     INNER JOIN trace.production_status ps
//       ON ps.uid = eu.uid AND ps.productid = eu.productid
//     WHERE RTRIM(LTRIM(eu.endoflineuid)) = @needle
//     ${dateFilter}
//     ORDER BY
//       CASE
//         WHEN ps.status = 'IN PROGRESS' THEN 1
//         WHEN ps.status = 'COMPLETED'   THEN 2
//         WHEN ps.status = 'SCRAP'       THEN 3
//         ELSE 4
//       END,
//       ps.productionenddate DESC,
//       ps.productionstartdate DESC;
//   `;

//   const q = await r.query(sqlText);
//   return res.json({ ok: true, data: q.recordset || [] });
// }

// // NEW FUNCTION: Get end of line UID for a given UID
// function registerEndOfLineUidRoutes(router) {
//   // Get end of line UID for a given UID
//   router.get("/endoflineuid/:uid", async (req, res) => {
//     try {
//       const uid = String(req.params.uid || "").trim();
//       if (!uid) {
//         return res.status(400).json({ ok: false, error: "UID required" });
//       }

//       const pool = await poolPromise;
//       const query = `
//         SELECT endoflineuid, productid, productline, testdate, currentdatetime
//         FROM trace.eoluid 
//         WHERE uid = @uid
//       `;
      
//       const result = await pool.request()
//         .input('uid', sql.VarChar(100), uid)
//         .query(query);

//       if (result.recordset.length === 0) {
//         return res.json({ 
//           ok: true, 
//           data: null,
//           message: "No end of line UID found for this UID" 
//         });
//       }

//       res.json({ 
//         ok: true, 
//         data: result.recordset[0] 
//       });

//     } catch (err) {
//       console.error("[trace/endoflineuid] error", err);
//       res.status(500).json({ ok: false, error: String(err) });
//     }
//   });
// }

// // Export both functions
// module.exports = { 
//   handleEndOfLineExact,
//   registerEndOfLineUidRoutes 
// };



// routes/trace/endoflineuid.js
// * Part 3: End-of-line UID exact (used by main route)
// * Now resolves EOL → UID via public.eoluid, then reads canonical status from public.production_status

const { pool } = require("../../db"); // corrected path

async function handleEndOfLineExact({ req, res, value, fromDate, toDate, fromTime, toTime }) {
  const client = await pool.connect();
  
  try {
    // Optional date range (applies to productionstartdate from the view)
    let dateFilter = "";
    let queryParams = [value];
    
    if (fromDate && toDate) {
      const startStr = `${fromDate} ${fromTime || "00:00:00"}`;
      const endStr = `${toDate} ${toTime || "23:59:59"}`;
      queryParams.push(startStr, endStr);
      dateFilter = `
        AND ps.productionstartdate BETWEEN $2 AND $3
      `;
    }

    // Resolve exact endoflineuid to UID/ProductID, then pull canonical row from production_status
    const sqlText = `
      SELECT
        ps.uid,
        ps.productid,
        ps.productmodelname,
        ps.productvariant,
        ps.lastequipmentid                                 AS equipmentid,
        ps.lastequipmentid                                 AS equipmentname,   -- view has no name; mirror id
        NULL                                               AS operatorid,
        NULL                                               AS shift,
        NULL                                               AS cycletime,
        ps.status                                          AS status,          -- 'IN PROGRESS' | 'COMPLETED' | 'SCRAP'
        NULL                                               AS qualityremarks,
        TO_CHAR(ps.productionstartdate, 'YYYY-MM-DD HH24:MI:SS')  AS productionstartdate,
        TO_CHAR(ps.productionenddate, 'YYYY-MM-DD HH24:MI:SS')    AS productionenddate,
        eu.endoflineuid,
        'Yes'                                              AS hasEOLUID,
        'production_status'                                AS _source,
        'endoflineuid'                                     AS _matchedBy
      FROM public.eoluid eu
      INNER JOIN public.production_status ps
        ON ps.uid = eu.uid AND ps.productid = eu.productid
      WHERE TRIM(eu.endoflineuid) = $1
      ${dateFilter}
      ORDER BY
        CASE
          WHEN ps.status = 'IN PROGRESS' THEN 1
          WHEN ps.status = 'COMPLETED'   THEN 2
          WHEN ps.status = 'SCRAP'       THEN 3
          ELSE 4
        END,
        ps.productionenddate DESC,
        ps.productionstartdate DESC;
    `;

    const result = await client.query(sqlText, queryParams);
    return res.json({ ok: true, data: result.rows || [] });
  } catch (error) {
    console.error("[EndOfLineExact] error", error);
    return res.status(500).json({ ok: false, error: String(error) });
  } finally {
    client.release();
  }
}

// NEW FUNCTION: Get end of line UID for a given UID
function registerEndOfLineUidRoutes(router) {
  // Get end of line UID for a given UID
  router.get("/endoflineuid/:uid", async (req, res) => {
    const client = await pool.connect();
    
    try {
      const uid = String(req.params.uid || "").trim();
      if (!uid) {
        return res.status(400).json({ ok: false, error: "UID required" });
      }

      const query = `
        SELECT endoflineuid, productid, productline, testdate, currentdatetime
        FROM public.eoluid 
        WHERE uid = $1
      `;
      
      const result = await client.query(query, [uid]);

      if (result.rows.length === 0) {
        return res.json({ 
          ok: true, 
          data: null,
          message: "No end of line UID found for this UID" 
        });
      }

      res.json({ 
        ok: true, 
        data: result.rows[0] 
      });

    } catch (err) {
      console.error("[trace/endoflineuid] error", err);
      res.status(500).json({ ok: false, error: String(err) });
    } finally {
      client.release();
    }
  });
}

// Export both functions
module.exports = { 
  handleEndOfLineExact,
  registerEndOfLineUidRoutes 
};