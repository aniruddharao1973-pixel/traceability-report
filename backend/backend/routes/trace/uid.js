
// // routes/trace/uid.js
// // OPTIMIZED VERSION - Same exact logic, better performance

// const { poolPromise, sql } = require("../../db");

// // --------------------------
// // Part 2a — UID exact search (Optimized: Same Logic + Performance)
// // --------------------------
// async function handleUidExact({ req, res, sql, value, fromDate, toDate, fromTime, toTime }) {
//   // ✅ OPTIMIZATION: Get pool internally instead of parameter
//   const db = await poolPromise;

//   // inputs: trimmed (no logic change)
//   const needle = (value || "").trim();

//   // Build date filter
//   let dateFilter = "";
//   const params = {};
//   if (fromDate && toDate) {
//     params.startDTStr = `${fromDate} ${fromTime || "00:00:00"}`;
//     params.endDTStr = `${toDate} ${toTime || "23:59:59"}`;
//     dateFilter = `
//       AND ps.productionstartdate BETWEEN CONVERT(datetime2, @startDTStr, 120)
//                                     AND CONVERT(datetime2, @endDTStr, 120)
//     `;
//   }

//   // Base SELECT (applied to both queries)
//   const baseSelect = `
//     SELECT 
//       ps.uid,
//       ps.productid,
//       ps.productmodelname,
//       ps.productvariant,
//       ps.lastequipmentid                                   AS equipmentid,
//       ps.lastequipmentid                                   AS equipmentname,
//       NULL                                                 AS operatorid,
//       NULL                                                 AS shift,
//       NULL                                                 AS cycletime,
//       ps.status                                            AS status,
//       NULL                                                 AS qualityremarks,
//       CONVERT(varchar(19), ps.productionstartdate, 120)    AS productionstartdate,
//       CONVERT(varchar(19), ps.productionenddate, 120)      AS productionenddate,
//       NULL                                                 AS endoflineuid,
//       'No'                                                 AS hasEOLUID,
//       'production_status'                                  AS _source,
//       'uid'                                                AS _matchedBy
//     FROM trace.production_status ps
//     WHERE
//   `;

//   const orderBy = `
//     ORDER BY
//       CASE
//         WHEN ps.status = 'IN PROGRESS' THEN 1
//         WHEN ps.status = 'COMPLETED'   THEN 2
//         WHEN ps.status = 'SCRAP'       THEN 3
//         ELSE 4
//       END,
//       ps.productionenddate ASC,
//       ps.productionstartdate ASC
//     OPTION (OPTIMIZE FOR (@needle UNKNOWN));
//   `;

//   console.time("[UID exact OPTIMIZED] TOTAL");

//   // ✅ OPTIMIZATION: Use single connection for both queries
//   const connection = await db.connect(); // Reuse connection
  
//   try {
//     // ✅ Fast seek query (index-friendly) - SAME LOGIC
//     const fastSql = `${baseSelect}
//         ps.uid = @needle
//         ${dateFilter}
//         ${orderBy}`;

//     const fastReq = connection.request();
//     fastReq.input("needle", sql.VarChar(200), needle);
//     if (params.startDTStr) {
//       fastReq.input("startDTStr", sql.VarChar(19), params.startDTStr);
//       fastReq.input("endDTStr", sql.VarChar(19), params.endDTStr);
//     }

//     console.time("[UID exact FAST] SQL");
//     const fastRes = await fastReq.query(fastSql);
//     console.timeEnd("[UID exact FAST] SQL");

//     if (fastRes.recordset.length > 0) {
//       console.timeEnd("[UID exact OPTIMIZED] TOTAL");
//       return res.json({ ok: true, data: fastRes.recordset });
//     }

//     // ✅ OPTIMIZATION: Reuse same connection for fallback query
//     console.time("[UID exact FALLBACK] SQL");

//     // ❌ No match? Run slower fallback — logic unchanged
//     const fallbackSql = `${baseSelect}
//         RTRIM(LTRIM(ps.uid)) = @needle
//         ${dateFilter}
//         ${orderBy}`;

//     const fallbackReq = connection.request();
//     fallbackReq.input("needle", sql.VarChar(200), needle);
//     if (params.startDTStr) {
//       fallbackReq.input("startDTStr", sql.VarChar(19), params.startDTStr);
//       fallbackReq.input("endDTStr", sql.VarChar(19), params.endDTStr);
//     }

//     const fallbackRes = await fallbackReq.query(fallbackSql);
//     console.timeEnd("[UID exact FALLBACK] SQL");
//     console.timeEnd("[UID exact OPTIMIZED] TOTAL");

//     const rows = fallbackRes.recordset || [];

//     if (rows.length === 0) {
//       return res.redirect(
//         307,
//         `/api/trace/uid-contains?term=${encodeURIComponent(needle)}&page=1&limit=50000`
//       );
//     }

//     return res.json({ ok: true, data: rows });
//   } finally {
//     // ✅ OPTIMIZATION: Proper connection cleanup
//     connection.release();
//   }
// }

// // ------------------------------------
// // Part 2b — UID contains (LIKE) search - OPTIMIZED (Same Logic)
// // ------------------------------------
// function registerUidRoutes(router) {
//   router.get("/uid-contains", async (req, res) => {
//     let connection;
//     try {
//       console.time("[UID contains OPTIMIZED] total");

//       const termRaw = req.query.term;
//       if (!termRaw || String(termRaw).trim().length === 0) {
//         return res.status(400).json({ ok: false, error: "term is required" });
//       }

//       const term = String(termRaw).trim();
//       const like = `%${term}%`;

//       const pool = await poolPromise;
      
//       // ✅ OPTIMIZATION: Use single connection for all queries
//       connection = await pool.connect();


//   // ✅ For very short terms (<=3), return ALL matches (no pagination) — ORIGINAL LOGIC
//   if (term.length <= 3) {
//     const rAll = connection.request();
//     rAll.timeout = 30000; // ✅ Reduced from 120s to 30s for faster timeout
//     rAll.input("term", sql.VarChar(200), like); // ✅ Original parameter size

//     // optional: allow date range filtering in contains too (same logic)
//     let dateFilter = "";
//     const { fromDate, toDate, fromTime, toTime } = req.query;
//     if (fromDate && toDate) {
//       const startStr = `${fromDate} ${fromTime || "00:00:00"}`;
//       const endStr = `${toDate} ${toTime || "23:59:59"}`;
//       rAll.input("startDTStr", sql.VarChar(19), startStr);
//       rAll.input("endDTStr", sql.VarChar(19), endStr);
//       dateFilter = `
//         AND ps.productionstartdate BETWEEN CONVERT(datetime2, @startDTStr, 120)
//                                       AND CONVERT(datetime2, @endDTStr, 120)
//       `;
//     }

//     // ✅ OPTIMIZED SQL: Unroll the view to filter before aggregating
//     const unlimitedSql = `
//         WITH lasteq AS (
//             SELECT 
//                 e.productid,
//                 e.equipmentid AS lastequipmentid
//             FROM trace.equipments e
//             WHERE e.lastequipment = '1'
//         ),
//         -- First, find the UIDs that match the search term from the base table.
//         -- This is the key optimization.
//         filtered_lifecycle AS (
//             SELECT *
//             FROM trace.productionlifecycle
//             WHERE uid LIKE @term
//         ),
//         -- Now, run the original view's logic ONLY on the pre-filtered data.
//         status_check AS (
//             SELECT 
//                 pl.uid,
//                 pl.productid,
//                 pl.productmodelname,
//                 pl.productvariant,
//                 le.lastequipmentid,
//                 MIN(pl.productionstartdate) AS productionstartdate,
//                 MAX(pl.productionenddate) AS productionenddate,
//                 CASE
//                     WHEN MAX(CASE WHEN pl.productstatus = 'SCRAP' THEN 1 ELSE 0 END) = 1 THEN 'SCRAP'
//                     WHEN MAX(CASE WHEN pl.equipmentid = le.lastequipmentid AND pl.productstatus = 'PASS' THEN 1 ELSE 0 END) = 1 THEN 'COMPLETED'
//                     ELSE 'IN PROGRESS'
//                 END AS status
//             FROM filtered_lifecycle pl -- Use the small, filtered set
//             LEFT JOIN lasteq le ON pl.productid = le.productid
//             GROUP BY pl.uid, pl.productid, pl.productmodelname, pl.productvariant, le.lastequipmentid
//         )
//         -- The final SELECT is the same as your original query
//         SELECT
//           ps.uid,
//           ps.productid,
//           ps.productmodelname,
//           ps.productvariant,
//           ps.lastequipmentid                                   AS equipmentid,
//           ps.lastequipmentid                                   AS equipmentname,
//           NULL                                                 AS operatorid,
//           NULL                                                 AS shift,
//           NULL                                                 AS cycletime,
//           ps.status                                            AS status,
//           NULL                                                 AS qualityremarks,
//           CONVERT(varchar(19), ps.productionstartdate, 120)    AS productionstartdate,
//           CONVERT(varchar(19), ps.productionenddate, 120)      AS productionenddate,
//           NULL                                                 AS endoflineuid,
//           'No'                                                 AS hasEOLUID,
//           'production_status'                                  AS _source,
//           'uid-contains'                                       AS _matchedBy
//         FROM status_check ps
//         WHERE 1=1 ${dateFilter.replace(/ps\./g, 'ps.')} -- Applying date filter here
//         ORDER BY
//           CASE
//             WHEN ps.status = 'IN PROGRESS' THEN 1
//             WHEN ps.status = 'COMPLETED'   THEN 2
//             WHEN ps.status = 'SCRAP'       THEN 3
//             ELSE 4
//           END,
//           ps.productionenddate DESC,
//           ps.productionstartdate DESC
//         OPTION (RECOMPILE, MAXDOP 8, USE HINT ('ENABLE_PARALLEL_PLAN_PREFERENCE'));
//     `;

//     console.time("[UID contains <=3] sql");
//     const rs = await rAll.query(unlimitedSql);
//     console.timeEnd("[UID contains <=3] sql");

//     console.timeEnd("[UID contains OPTIMIZED] total");
//     return res.json({
//       ok: true,
//       total: rs.recordset.length,
//       data: rs.recordset || [],
//       returnedAll: true,  // ✅ Keep original value
//       searchTerm: term,
//     });
//   }
  


//       // Long terms (>=4) — paginate (keep same logic)
//       const page = Math.max(parseInt(req.query.page || "1", 10), 1);
//       const limit = parseInt(req.query.limit, 10) || 50000; // default 50k - SAME LOGIC
//       const offset = (page - 1) * limit;

//       // ✅ OPTIMIZATION: Use same connection for count and data queries
//       const rCount = connection.request();
//       rCount.timeout = 60000;
//       rCount.input("term", sql.VarChar(200), like);

//       let dateFilter = "";
//       const { fromDate, toDate, fromTime, toTime } = req.query;
//       if (fromDate && toDate) {
//         const startStr = `${fromDate} ${fromTime || "00:00:00"}`;
//         const endStr = `${toDate} ${toTime || "23:59:59"}`;
//         rCount.input("startDTStr", sql.VarChar(19), startStr);
//         rCount.input("endDTStr", sql.VarChar(19), endStr);
//         dateFilter = `
//           AND ps.productionstartdate BETWEEN CONVERT(datetime2, @startDTStr, 120)
//                                         AND CONVERT(datetime2, @endDTStr, 120)
//         `;
//       }

    
//       const countSql = `
//         -- ✅ OPTIMIZED COUNT: This avoids the entire view logic completely.
//         -- It just counts the distinct UIDs that match the filter from the source table.
//         SELECT COUNT(DISTINCT uid) AS total
//         FROM trace.productionlifecycle
//         WHERE uid LIKE @term
//         -- The date filter must now join to get the productionstartdate
//         ${dateFilter.replace(/ps\./g, '')}; 
//       `;


//       console.time("[UID contains >=4] count");
//       const countRes = await rCount.query(countSql);
//       console.timeEnd("[UID contains >=4] count");

//       const total = Number(countRes.recordset?.[0]?.total || 0);

//       // ✅ OPTIMIZATION: Reuse same connection for data query
//       const rPage = connection.request();
//       rPage.timeout = 60000;
//       rPage.input("term", sql.VarChar(200), like);
//       rPage.input("offset", sql.Int, offset);
//       rPage.input("limit", sql.Int, limit);
//       if (fromDate && toDate) {
//         const startStr = `${fromDate} ${fromTime || "00:00:00"}`;
//         const endStr = `${toDate} ${toTime || "23:59:59"}`;
//         rPage.input("startDTStr", sql.VarChar(19), startStr);
//         rPage.input("endDTStr", sql.VarChar(19), endStr);
//       }

//       const unlimitedSql = `
//         WITH lasteq AS (
//             SELECT 
//                 e.productid,
//                 e.equipmentid AS lastequipmentid
//             FROM trace.equipments e
//             WHERE e.lastequipment = '1'
//         ),
//         filtered_lifecycle AS (
//             SELECT *
//             FROM trace.productionlifecycle
//             WHERE uid LIKE @term
//         ),
//         status_check AS (
//             SELECT 
//                 pl.uid,
//                 pl.productid,
//                 pl.productmodelname,
//                 pl.productvariant,
//                 le.lastequipmentid,
//                 MIN(pl.productionstartdate) AS productionstartdate,
//                 MAX(pl.productionenddate) AS productionenddate,
//                 CASE
//                     WHEN MAX(CASE WHEN pl.productstatus = 'SCRAP' THEN 1 ELSE 0 END) = 1 THEN 'SCRAP'
//                     WHEN MAX(CASE WHEN pl.equipmentid = le.lastequipmentid AND pl.productstatus = 'PASS' THEN 1 ELSE 0 END) = 1 THEN 'COMPLETED'
//                     ELSE 'IN PROGRESS'
//                 END AS status
//             FROM filtered_lifecycle pl
//             LEFT JOIN lasteq le ON pl.productid = le.productid
//             GROUP BY pl.uid, pl.productid, pl.productmodelname, pl.productvariant, le.lastequipmentid
//         )
//         SELECT
//           ps.uid,
//           ps.productid,
//           ps.productmodelname,
//           ps.productvariant,
//           ps.lastequipmentid                                   AS equipmentid,
//           ps.lastequipmentid                                   AS equipmentname,
//           NULL                                                 AS operatorid,
//           NULL                                                 AS shift,
//           NULL                                                 AS cycletime,
//           ps.status                                            AS status,
//           NULL                                                 AS qualityremarks,
//           CONVERT(varchar(19), ps.productionstartdate, 120)    AS productionstartdate,
//           CONVERT(varchar(19), ps.productionenddate, 120)      AS productionenddate,
//           NULL                                                 AS endoflineuid,
//           'No'                                                 AS hasEOLUID,
//           'production_status'                                  AS _source,
//           'uid-contains'                                       AS _matchedBy
//         FROM status_check ps
//         WHERE 1=1 ${dateFilter.replace(/ps\./g, 'ps.')}
//         ORDER BY
//           CASE
//             WHEN ps.status = 'IN PROGRESS' THEN 1
//             WHEN ps.status = 'COMPLETED'   THEN 2
//             WHEN ps.status = 'SCRAP'       THEN 3
//             ELSE 4
//           END,
//           ps.productionenddate DESC,
//           ps.productionstartdate DESC
//         OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
//         OPTION (RECOMPILE, MAXDOP 2);
//     `;

//       console.time("[UID contains >=4] page");
//       const pageRes = await rPage.query(unlimitedSql);
//       console.timeEnd("[UID contains >=4] page");

//       console.timeEnd("[UID contains OPTIMIZED] total");
//       return res.json({
//         ok: true,
//         total,
//         page,
//         limit,
//         data: pageRes.recordset || [],
//         returnedAll: false,
//         searchTerm: term,
//       });
//     } catch (err) {
//       console.error("[trace uid-contains] error", err);
//       return res.status(500).json({ ok: false, error: String(err) });
//     } finally {
//       // ✅ OPTIMIZATION: Always release connection
//       if (connection) {
//         connection.release();
//       }
//     }
//   });
// }

// module.exports = { registerUidRoutes, handleUidExact };



// routes/trace/uid.js
// OPTIMIZED VERSION - PostgreSQL

const { pool } = require("../../db");

// --------------------------
// Part 2a — UID exact search (Optimized: Same Logic + Performance)
// --------------------------
async function handleUidExact({ req, res, value, fromDate, toDate, fromTime, toTime }) {
  // ✅ PostgreSQL: Use pool directly
  const client = await pool.connect();

  // inputs: trimmed (no logic change)
  const needle = (value || "").trim();

  // Build date filter
  let dateFilter = "";
  const params = {};
  if (fromDate && toDate) {
    params.startDTStr = `${fromDate} ${fromTime || "00:00:00"}`;
    params.endDTStr = `${toDate} ${toTime || "23:59:59"}`;
    dateFilter = `
      AND ps.productionstartdate BETWEEN $2 AND $3
    `;
  }

  // Base SELECT (applied to both queries)
  const baseSelect = `
    SELECT 
      ps.uid,
      ps.productid,
      ps.productmodelname,
      ps.productvariant,
      ps.lastequipmentid                                   AS equipmentid,
      ps.lastequipmentid                                   AS equipmentname,
      NULL                                                 AS operatorid,
      NULL                                                 AS shift,
      NULL                                                 AS cycletime,
      ps.status                                            AS status,
      NULL                                                 AS qualityremarks,
      TO_CHAR(ps.productionstartdate, 'YYYY-MM-DD HH24:MI:SS') AS productionstartdate,
      TO_CHAR(ps.productionenddate, 'YYYY-MM-DD HH24:MI:SS')   AS productionenddate,
      NULL                                                 AS endoflineuid,
      'No'                                                 AS hasEOLUID,
      'production_status'                                  AS _source,
      'uid'                                                AS _matchedBy
    FROM public.production_status ps
    WHERE
  `;

  const orderBy = `
    ORDER BY
      CASE
        WHEN ps.status = 'IN PROGRESS' THEN 1
        WHEN ps.status = 'COMPLETED'   THEN 2
        WHEN ps.status = 'SCRAP'       THEN 3
        ELSE 4
      END,
      ps.productionenddate ASC,
      ps.productionstartdate ASC
  `;

  console.time("[UID exact OPTIMIZED] TOTAL");

  try {
    // ✅ Fast seek query (index-friendly) - SAME LOGIC
    let fastSql = `${baseSelect}
        ps.uid = $1
        ${dateFilter}
        ${orderBy}`;

    console.time("[UID exact FAST] SQL");
    let queryParams = [needle];
    if (params.startDTStr) {
      queryParams.push(params.startDTStr, params.endDTStr);
    }
    
    const fastRes = await client.query(fastSql, queryParams);
    console.timeEnd("[UID exact FAST] SQL");

    if (fastRes.rows.length > 0) {
      console.timeEnd("[UID exact OPTIMIZED] TOTAL");
      client.release();
      return res.json({ ok: true, data: fastRes.rows });
    }

    // ✅ Fallback query
    console.time("[UID exact FALLBACK] SQL");

    const fallbackSql = `${baseSelect}
        TRIM(ps.uid) = $1
        ${dateFilter}
        ${orderBy}`;

    const fallbackRes = await client.query(fallbackSql, queryParams);
    console.timeEnd("[UID exact FALLBACK] SQL");
    console.timeEnd("[UID exact OPTIMIZED] TOTAL");

    const rows = fallbackRes.rows || [];

    if (rows.length === 0) {
      client.release();
      return res.redirect(
        307,
        `/api/trace/uid-contains?term=${encodeURIComponent(needle)}&page=1&limit=50000`
      );
    }

    client.release();
    return res.json({ ok: true, data: rows });
  } catch (error) {
    client.release();
    throw error;
  }
}

// ------------------------------------
// Part 2b — UID contains (LIKE) search - OPTIMIZED (Same Logic)
// ------------------------------------
function registerUidRoutes(router) {
  router.get("/uid-contains", async (req, res) => {
    const client = await pool.connect();
    try {
      console.time("[UID contains OPTIMIZED] total");

      const termRaw = req.query.term;
      if (!termRaw || String(termRaw).trim().length === 0) {
        return res.status(400).json({ ok: false, error: "term is required" });
      }

      const term = String(termRaw).trim();
      const like = `%${term}%`;

      // ✅ For very short terms (<=3), return ALL matches (no pagination) — ORIGINAL LOGIC
      if (term.length <= 3) {
        // optional: allow date range filtering in contains too (same logic)
        let dateFilter = "";
        let queryParams = [like];
        const { fromDate, toDate, fromTime, toTime } = req.query;
        if (fromDate && toDate) {
          const startStr = `${fromDate} ${fromTime || "00:00:00"}`;
          const endStr = `${toDate} ${toTime || "23:59:59"}`;
          queryParams.push(startStr, endStr);
          dateFilter = `
            AND ps.productionstartdate BETWEEN $2 AND $3
          `;
        }

        // ✅ OPTIMIZED SQL: Unroll the view to filter before aggregating
        const unlimitedSql = `
            WITH lasteq AS (
                SELECT 
                    e.productid,
                    e.equipmentid AS lastequipmentid
                FROM public.equipments e
                WHERE e.lastequipment = '1'
            ),
            filtered_lifecycle AS (
                SELECT *
                FROM public.productionlifecycle
                WHERE uid LIKE $1
            ),
            status_check AS (
                SELECT 
                    pl.uid,
                    pl.productid,
                    pl.productmodelname,
                    pl.productvariant,
                    le.lastequipmentid,
                    MIN(pl.productionstartdate) AS productionstartdate,
                    MAX(pl.productionenddate) AS productionenddate,
                    CASE
                        WHEN MAX(CASE WHEN pl.productstatus = 'SCRAP' THEN 1 ELSE 0 END) = 1 THEN 'SCRAP'
                        WHEN MAX(CASE WHEN pl.equipmentid = le.lastequipmentid AND pl.productstatus = 'PASS' THEN 1 ELSE 0 END) = 1 THEN 'COMPLETED'
                        ELSE 'IN PROGRESS'
                    END AS status
                FROM filtered_lifecycle pl
                LEFT JOIN lasteq le ON pl.productid = le.productid
                GROUP BY pl.uid, pl.productid, pl.productmodelname, pl.productvariant, le.lastequipmentid
            )
            SELECT
              ps.uid,
              ps.productid,
              ps.productmodelname,
              ps.productvariant,
              ps.lastequipmentid                                   AS equipmentid,
              ps.lastequipmentid                                   AS equipmentname,
              NULL                                                 AS operatorid,
              NULL                                                 AS shift,
              NULL                                                 AS cycletime,
              ps.status                                            AS status,
              NULL                                                 AS qualityremarks,
              TO_CHAR(ps.productionstartdate, 'YYYY-MM-DD HH24:MI:SS') AS productionstartdate,
              TO_CHAR(ps.productionenddate, 'YYYY-MM-DD HH24:MI:SS')   AS productionenddate,
              NULL                                                 AS endoflineuid,
              'No'                                                 AS hasEOLUID,
              'production_status'                                  AS _source,
              'uid-contains'                                       AS _matchedBy
            FROM status_check ps
            WHERE 1=1 ${dateFilter}
            ORDER BY
              CASE
                WHEN ps.status = 'IN PROGRESS' THEN 1
                WHEN ps.status = 'COMPLETED'   THEN 2
                WHEN ps.status = 'SCRAP'       THEN 3
                ELSE 4
              END,
              ps.productionenddate DESC,
              ps.productionstartdate DESC
        `;

        console.time("[UID contains <=3] sql");
        const rs = await client.query(unlimitedSql, queryParams);
        console.timeEnd("[UID contains <=3] sql");

        console.timeEnd("[UID contains OPTIMIZED] total");
        return res.json({
          ok: true,
          total: rs.rows.length,
          data: rs.rows || [],
          returnedAll: true,
          searchTerm: term,
        });
      }

      // Long terms (>=4) — paginate (keep same logic)
      const page = Math.max(parseInt(req.query.page || "1", 10), 1);
      const limit = parseInt(req.query.limit, 10) || 50000;
      const offset = (page - 1) * limit;

      let dateFilter = "";
      let countParams = [like];
      const { fromDate, toDate, fromTime, toTime } = req.query;
      if (fromDate && toDate) {
        const startStr = `${fromDate} ${fromTime || "00:00:00"}`;
        const endStr = `${toDate} ${toTime || "23:59:59"}`;
        countParams.push(startStr, endStr);
        dateFilter = `
          AND productionstartdate BETWEEN $2 AND $3
        `;
      }

      const countSql = `
        SELECT COUNT(DISTINCT uid) AS total
        FROM public.productionlifecycle
        WHERE uid LIKE $1
        ${dateFilter}
      `;

      console.time("[UID contains >=4] count");
      const countRes = await client.query(countSql, countParams);
      console.timeEnd("[UID contains >=4] count");

      const total = Number(countRes.rows?.[0]?.total || 0);

      let pageParams = [like, offset, limit];
      if (fromDate && toDate) {
        const startStr = `${fromDate} ${fromTime || "00:00:00"}`;
        const endStr = `${toDate} ${toTime || "23:59:59"}`;
        pageParams = [like, startStr, endStr, offset, limit];
      }

      const pageDateFilter = fromDate && toDate ? `AND ps.productionstartdate BETWEEN $2 AND $3` : '';

      const pageSql = `
        WITH lasteq AS (
            SELECT 
                e.productid,
                e.equipmentid AS lastequipmentid
            FROM public.equipments e
            WHERE e.lastequipment = '1'
        ),
        filtered_lifecycle AS (
            SELECT *
            FROM public.productionlifecycle
            WHERE uid LIKE $1
        ),
        status_check AS (
            SELECT 
                pl.uid,
                pl.productid,
                pl.productmodelname,
                pl.productvariant,
                le.lastequipmentid,
                MIN(pl.productionstartdate) AS productionstartdate,
                MAX(pl.productionenddate) AS productionenddate,
                CASE
                    WHEN MAX(CASE WHEN pl.productstatus = 'SCRAP' THEN 1 ELSE 0 END) = 1 THEN 'SCRAP'
                    WHEN MAX(CASE WHEN pl.equipmentid = le.lastequipmentid AND pl.productstatus = 'PASS' THEN 1 ELSE 0 END) = 1 THEN 'COMPLETED'
                    ELSE 'IN PROGRESS'
                END AS status
            FROM filtered_lifecycle pl
            LEFT JOIN lasteq le ON pl.productid = le.productid
            GROUP BY pl.uid, pl.productid, pl.productmodelname, pl.productvariant, le.lastequipmentid
        )
        SELECT
          ps.uid,
          ps.productid,
          ps.productmodelname,
          ps.productvariant,
          ps.lastequipmentid                                   AS equipmentid,
          ps.lastequipmentid                                   AS equipmentname,
          NULL                                                 AS operatorid,
          NULL                                                 AS shift,
          NULL                                                 AS cycletime,
          ps.status                                            AS status,
          NULL                                                 AS qualityremarks,
          TO_CHAR(ps.productionstartdate, 'YYYY-MM-DD HH24:MI:SS') AS productionstartdate,
          TO_CHAR(ps.productionenddate, 'YYYY-MM-DD HH24:MI:SS')   AS productionenddate,
          NULL                                                 AS endoflineuid,
          'No'                                                 AS hasEOLUID,
          'production_status'                                  AS _source,
          'uid-contains'                                       AS _matchedBy
        FROM status_check ps
        WHERE 1=1 ${pageDateFilter}
        ORDER BY
          CASE
            WHEN ps.status = 'IN PROGRESS' THEN 1
            WHEN ps.status = 'COMPLETED'   THEN 2
            WHEN ps.status = 'SCRAP'       THEN 3
            ELSE 4
          END,
          ps.productionenddate DESC,
          ps.productionstartdate DESC
        OFFSET ${fromDate && toDate ? '$4' : '$2'} ROWS FETCH NEXT ${fromDate && toDate ? '$5' : '$3'} ROWS ONLY
      `;

      console.time("[UID contains >=4] page");
      const pageRes = await client.query(pageSql, pageParams);
      console.timeEnd("[UID contains >=4] page");

      console.timeEnd("[UID contains OPTIMIZED] total");
      return res.json({
        ok: true,
        total,
        page,
        limit,
        data: pageRes.rows || [],
        returnedAll: false,
        searchTerm: term,
      });
    } catch (err) {
      console.error("[trace uid-contains] error", err);
      return res.status(500).json({ ok: false, error: String(err) });
    } finally {
      client.release();
    }
  });
}

module.exports = { registerUidRoutes, handleUidExact };