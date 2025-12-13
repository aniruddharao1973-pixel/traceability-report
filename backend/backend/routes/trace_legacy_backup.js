// routes/trace.js
const express = require("express");
const router = express.Router();
const { poolPromise, sql } = require("../db");

// ------------------ MAIN SEARCH ROUTE ------------------
router.get("/", async (req, res) => {
  try {
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

    const searchKey = allowedKeys.find((k) => req.query[k] !== undefined);
    if (!searchKey) {
      return res.status(400).json({ ok: false, error: "Search key required" });
    }

    const rawValue = req.query[searchKey];
    if (!rawValue || String(rawValue).trim().length === 0) {
      return res.status(400).json({ ok: false, error: `${searchKey} value required` });
    }

    const value = String(rawValue).trim();
    const fromDate = req.query.fromDate || null;
    const toDate = req.query.toDate || null;
    const fromTime = req.query.fromTime || "00:00:00";
    const toTime = req.query.toTime || "23:59:59";
    const pool = await poolPromise;

    // ------------------ UID SEARCH (exact) ------------------
    if (searchKey === "uid") {
      const reqA = pool.request();
      reqA.input("needle", sql.VarChar(200), value);
      reqA.timeout = 60000;

      let lifecycleDateFilter = "";
      if (fromDate && toDate) {
        const startStr = `${fromDate} ${fromTime}`;
        const endStr = `${toDate} ${toTime}`;
        reqA.input("startDTStr", sql.VarChar(19), startStr);
        reqA.input("endDTStr", sql.VarChar(19), endStr);
        lifecycleDateFilter = `
          AND pl.productionstartdate BETWEEN CONVERT(datetime2, @startDTStr, 120)
                                       AND CONVERT(datetime2, @endDTStr, 120)
        `;
      }

      const latestOneSql = `
        WITH ranked AS (
          SELECT
            pl.uid,
            pl.productid,
            pl.productmodelname,
            pl.productvariant,
            pl.equipmentid,
            ISNULL(e.equipmentname, pl.equipmentid) AS equipmentname,
            pl.operatorid,
            pl.shift,
            pl.cycletime,
            pl.productstatus AS status,
            pl.productionremarks AS qualityremarks,
            FORMAT(pl.productionstartdate, 'yyyy-MM-dd HH:mm:ss') AS productionstartdate,
            FORMAT(pl.productionenddate, 'yyyy-MM-dd HH:mm:ss')   AS productionenddate,
            eu.endoflineuid,
            ROW_NUMBER() OVER (
              PARTITION BY pl.uid
              ORDER BY 
                CASE 
                  WHEN pl.productstatus = 'In Progress' THEN 1
                  WHEN pl.productstatus = 'Completed' THEN 2
                  WHEN pl.productstatus = 'Scrap' THEN 3
                  ELSE 4
                END,
                pl.productionenddate DESC,
                pl.productionstartdate DESC
            ) AS rn
          FROM trace.productionlifecycle pl
          LEFT JOIN trace.eoluid eu
            ON eu.uid = pl.uid AND eu.productid = pl.productid
          LEFT JOIN trace.equipments e
            ON e.equipmentid = pl.equipmentid AND e.productid = pl.productid
          WHERE (RTRIM(LTRIM(pl.uid)) = @needle OR RTRIM(LTRIM(eu.endoflineuid)) = @needle)
          ${lifecycleDateFilter}
        )
        SELECT
          uid, productid, productmodelname, productvariant,
          equipmentid, equipmentname, operatorid, shift, cycletime,
          status, qualityremarks, productionstartdate, productionenddate,
          endoflineuid,
          CASE WHEN endoflineuid IS NULL OR LTRIM(RTRIM(endoflineuid)) = '' THEN 'No' ELSE 'Yes' END AS hasEOLUID,
          'productionlifecycle' AS _source,
          'uid' AS _matchedBy
        FROM ranked
        WHERE rn = 1
        ORDER BY 
          CASE 
            WHEN status = 'In Progress' THEN 1
            WHEN status = 'Completed' THEN 2
            WHEN status = 'Scrap' THEN 3
            ELSE 4
          END,
          productionenddate DESC;
      `;

      const latestOneRes = await reqA.query(latestOneSql);
      const oneRow = latestOneRes.recordset || [];
      if (oneRow.length === 0) {
        return res.redirect(
          307,
          `/api/trace/uid-contains?term=${encodeURIComponent(value)}&page=1&limit=2000`
        );
      }
      return res.json({ ok: true, data: oneRow });
    }

    // ------------------ END OF LINE UID SEARCH (exact) ------------------
    if (searchKey === "endoflineuid") {
      const reqE = pool.request();
      reqE.input("needle", sql.VarChar(200), value);
      reqE.timeout = 60000;

      let dateFilter = "";
      if (fromDate && toDate) {
        const startStr = `${fromDate} ${fromTime}`;
        const endStr = `${toDate} ${toTime}`;
        reqE.input("startDTStr", sql.VarChar(19), startStr);
        reqE.input("endDTStr", sql.VarChar(19), endStr);
        dateFilter = `
          AND pl.productionstartdate BETWEEN CONVERT(datetime2, @startDTStr, 120)
                                       AND CONVERT(datetime2, @endDTStr, 120)
        `;
      }

      const lifecycleForEOLQuery = `
        WITH ranked AS (
          SELECT
            pl.uid,
            pl.productid,
            pl.productmodelname,
            pl.productvariant,
            pl.equipmentid,
            ISNULL(e.equipmentname, pl.equipmentid) AS equipmentname,
            pl.operatorid,
            pl.shift,
            pl.cycletime,
            pl.productstatus AS status,
            pl.productionremarks AS qualityremarks,
            FORMAT(pl.productionstartdate, 'yyyy-MM-dd HH:mm:ss') AS productionstartdate,
            FORMAT(pl.productionenddate, 'yyyy-MM-dd HH:mm:ss') AS productionenddate,
            eu.endoflineuid,
            ROW_NUMBER() OVER (
              PARTITION BY pl.uid
              ORDER BY 
                CASE 
                  WHEN pl.productstatus = 'In Progress' THEN 1
                  WHEN pl.productstatus = 'Completed' THEN 2
                  WHEN pl.productstatus = 'Scrap' THEN 3
                  ELSE 4
                END,
                pl.productionenddate DESC,
                pl.productionstartdate DESC
            ) AS rn
          FROM trace.productionlifecycle pl
          INNER JOIN trace.eoluid eu
            ON pl.uid = eu.uid AND pl.productid = eu.productid
          LEFT JOIN trace.equipments e
            ON e.equipmentid = pl.equipmentid AND e.productid = pl.productid
          WHERE RTRIM(LTRIM(eu.endoflineuid)) = @needle
          ${dateFilter}
        )
        SELECT
          uid, productid, productmodelname, productvariant,
          equipmentid, equipmentname, operatorid, shift, cycletime,
          status, qualityremarks, productionstartdate, productionenddate,
          endoflineuid,
          CASE WHEN endoflineuid IS NULL OR LTRIM(RTRIM(endoflineuid)) = '' THEN 'No' ELSE 'Yes' END AS hasEOLUID,
          'productionlifecycle' AS _source,
          'endoflineuid' AS _matchedBy
        FROM ranked
        WHERE rn = 1
        ORDER BY 
          CASE 
            WHEN status = 'In Progress' THEN 1
            WHEN status = 'Completed' THEN 2
            WHEN status = 'Scrap' THEN 3
            ELSE 4
          END,
          productionenddate DESC;
      `;

      const r = await reqE.query(lifecycleForEOLQuery);
      return res.json({ ok: true, data: r.recordset || [] });
    }

    // ------------------ OTHER COLUMNS (exact match) - ROBUST VERSION ------------------
    if (searchKey !== "uid" && searchKey !== "endoflineuid") {
        const reqS = pool.request();
        reqS.input("value", sql.VarChar(200), value);
        reqS.timeout = 60000;

        let dateFilter = "";
        if (fromDate && toDate) {
            const startStr = `${fromDate} ${fromTime}`;
            const endStr = `${toDate} ${toTime}`;
            reqS.input("startDTStr", sql.VarChar(19), startStr);
            reqS.input("endDTStr", sql.VarChar(19), endStr);
            dateFilter = `
                AND pl.productionstartdate BETWEEN CONVERT(datetime2, @startDTStr, 120)
                                             AND CONVERT(datetime2, @endDTStr, 120)
            `;
        }

        // For short searches (like productvariant="A"), return ALL results without pagination
        if (value.length <= 3) {
            const unlimitedSql = `
                WITH ranked AS (
                    SELECT
                        pl.uid,
                        pl.productid,
                        pl.productmodelname,
                        pl.productvariant,
                        pl.equipmentid,
                        ISNULL(e.equipmentname, pl.equipmentid) AS equipmentname,
                        pl.operatorid,
                        pl.shift,
                        pl.cycletime,
                        pl.productstatus AS status,
                        pl.productionremarks AS qualityremarks,
                        FORMAT(pl.productionstartdate, 'yyyy-MM-dd HH:mm:ss') AS productionstartdate,
                        FORMAT(pl.productionenddate, 'yyyy-MM-dd HH:mm:ss') AS productionenddate,
                        eu.endoflineuid,
                        ROW_NUMBER() OVER (
                            PARTITION BY pl.uid
                            ORDER BY 
                                CASE 
                                    WHEN pl.productstatus = 'In Progress' THEN 1
                                    WHEN pl.productstatus = 'Completed' THEN 2
                                    WHEN pl.productstatus = 'Scrap' THEN 3
                                    ELSE 4
                                END,
                                pl.productionenddate DESC,
                                pl.productionstartdate DESC
                        ) AS rn
                    FROM trace.productionlifecycle pl
                    LEFT JOIN trace.eoluid eu
                        ON eu.uid = pl.uid AND eu.productid = pl.productid
                    LEFT JOIN trace.equipments e
                        ON e.equipmentid = pl.equipmentid AND e.productid = pl.productid
                    WHERE RTRIM(LTRIM(pl.${searchKey})) = @value
                    ${dateFilter}
                )
                SELECT
                    uid, productid, productmodelname, productvariant,
                    equipmentid, equipmentname, operatorid, shift, cycletime,
                    status, qualityremarks, productionstartdate, productionenddate,
                    endoflineuid,
                    CASE WHEN endoflineuid IS NULL OR LTRIM(RTRIM(endoflineuid)) = '' THEN 'No' ELSE 'Yes' END AS hasEOLUID,
                    'productionlifecycle' AS _source,
                    '${searchKey}' AS _matchedBy
                FROM ranked
                WHERE rn = 1
                ORDER BY 
                    CASE 
                        WHEN status = 'In Progress' THEN 1
                        WHEN status = 'Completed' THEN 2
                        WHEN status = 'Scrap' THEN 3
                        ELSE 4
                    END,
                    productionenddate DESC;
            `;

            const unlimitedRes = await reqS.query(unlimitedSql);
            
            return res.json({
                ok: true,
                total: unlimitedRes.recordset.length,
                data: unlimitedRes.recordset || [],
                returnedAll: true,
                searchBy: searchKey,
                searchValue: value
            });
        } else {
            // For longer searches, use pagination
            const page = Math.max(parseInt(req.query.page || "1", 10), 1);
            const limit = parseInt(req.query.limit, 10) || 2000;
            const offset = (page - 1) * limit;

            reqS.input("offset", sql.Int, offset);
            reqS.input("limit", sql.Int, limit);

            // COUNT unique UIDs for this search
            const countUniqueSql = `
                WITH ranked AS (
                    SELECT
                        pl.uid,
                        ROW_NUMBER() OVER (
                            PARTITION BY pl.uid
                            ORDER BY 
                                CASE 
                                    WHEN pl.productstatus = 'In Progress' THEN 1
                                    WHEN pl.productstatus = 'Completed' THEN 2
                                    WHEN pl.productstatus = 'Scrap' THEN 3
                                    ELSE 4
                                END,
                                pl.productionenddate DESC,
                                pl.productionstartdate DESC
                        ) AS rn
                    FROM trace.productionlifecycle pl
                    WHERE RTRIM(LTRIM(pl.${searchKey})) = @value
                    ${dateFilter}
                )
                SELECT COUNT(*) AS totalUnique
                FROM ranked
                WHERE rn = 1;
            `;

            const countRes = await reqS.query(countUniqueSql);
            const total = Number(countRes.recordset?.[0]?.totalUnique || 0);

            // GET paginated results
            const pageSql = `
                WITH ranked AS (
                    SELECT
                        pl.uid,
                        pl.productid,
                        pl.productmodelname,
                        pl.productvariant,
                        pl.equipmentid,
                        ISNULL(e.equipmentname, pl.equipmentid) AS equipmentname,
                        pl.operatorid,
                        pl.shift,
                        pl.cycletime,
                        pl.productstatus AS status,
                        pl.productionremarks AS qualityremarks,
                        FORMAT(pl.productionstartdate, 'yyyy-MM-dd HH:mm:ss') AS productionstartdate,
                        FORMAT(pl.productionenddate, 'yyyy-MM-dd HH:mm:ss') AS productionenddate,
                        eu.endoflineuid,
                        ROW_NUMBER() OVER (
                            PARTITION BY pl.uid
                            ORDER BY 
                                CASE 
                                    WHEN pl.productstatus = 'In Progress' THEN 1
                                    WHEN pl.productstatus = 'Completed' THEN 2
                                    WHEN pl.productstatus = 'Scrap' THEN 3
                                    ELSE 4
                                END,
                                pl.productionenddate DESC,
                                pl.productionstartdate DESC
                        ) AS rn
                    FROM trace.productionlifecycle pl
                    LEFT JOIN trace.eoluid eu
                        ON eu.uid = pl.uid AND eu.productid = pl.productid
                    LEFT JOIN trace.equipments e
                        ON e.equipmentid = pl.equipmentid AND e.productid = pl.productid
                    WHERE RTRIM(LTRIM(pl.${searchKey})) = @value
                    ${dateFilter}
                )
                SELECT
                    uid, productid, productmodelname, productvariant,
                    equipmentid, equipmentname, operatorid, shift, cycletime,
                    status, qualityremarks, productionstartdate, productionenddate,
                    endoflineuid,
                    CASE WHEN endoflineuid IS NULL OR LTRIM(RTRIM(endoflineuid)) = '' THEN 'No' ELSE 'Yes' END AS hasEOLUID,
                    'productionlifecycle' AS _source,
                    '${searchKey}' AS _matchedBy
                FROM ranked
                WHERE rn = 1
                ORDER BY 
                    CASE 
                        WHEN status = 'In Progress' THEN 1
                        WHEN status = 'Completed' THEN 2
                        WHEN status = 'Scrap' THEN 3
                        ELSE 4
                    END,
                    productionenddate DESC
                OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
            `;

            const pageRes = await reqS.query(pageSql);

            return res.json({
                ok: true,
                total: total,
                page: page,
                limit: limit,
                data: pageRes.recordset || [],
                returnedAll: false,
                searchBy: searchKey,
                searchValue: value
            });
        }
    }

  } catch (err) {
    console.error("[trace] error", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// ------------------ UID CONTAINS (LIKE) SEARCH ------------------
router.get("/uid-contains", async (req, res) => {
  try {
    const termRaw = req.query.term;
    if (!termRaw || String(termRaw).trim().length === 0) {
      return res.status(400).json({ ok: false, error: "term is required" });
    }

    const term = String(termRaw).trim();
    const like = `%${term}%`;

    // For short searches, we'll handle them separately without pagination
    // For longer searches, use requested limit or default
    let limit = parseInt(req.query.limit, 10) || 2000;

    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const offset = (page - 1) * limit;

    const pool = await poolPromise;

    // Remove pagination limits for short searches - return ALL matching UIDs
    if (term.length <= 3) {
      // For short searches like "3", "34", etc. - get ALL results without pagination
      const unlimitedSql = `
        WITH ranked AS (
          SELECT
            pl.uid,
            pl.productid,
            pl.productmodelname,
            pl.productvariant,
            pl.equipmentid,
            ISNULL(e.equipmentname, pl.equipmentid) AS equipmentname,
            FORMAT(pl.productionstartdate, 'yyyy-MM-dd HH:mm:ss') AS productionstartdate,
            FORMAT(pl.productionenddate, 'yyyy-MM-dd HH:mm:ss')   AS productionenddate,
            pl.productstatus AS status,
            pl.productionremarks AS qualityremarks,
            eu.endoflineuid,
            ROW_NUMBER() OVER (
              PARTITION BY pl.uid
              ORDER BY 
                CASE 
                  WHEN pl.productstatus = 'In Progress' THEN 1
                  WHEN pl.productstatus = 'Completed' THEN 2
                  WHEN pl.productstatus = 'Scrap' THEN 3
                  ELSE 4
                END,
                pl.productionenddate DESC,
                pl.productionstartdate DESC
            ) AS rn
          FROM trace.productionlifecycle pl WITH (INDEX(IX_productionlifecycle_uid_cover))
          LEFT JOIN trace.eoluid eu
            ON eu.uid = pl.uid AND eu.productid = pl.productid
          LEFT JOIN trace.equipments e
            ON e.equipmentid = pl.equipmentid AND e.productid = pl.productid
          WHERE RTRIM(LTRIM(pl.uid)) LIKE @term
        )
        SELECT
          uid, productid, productmodelname, productvariant,
          equipmentid, equipmentname,
          productionstartdate, productionenddate,
          status, qualityremarks, endoflineuid
        FROM ranked
        WHERE rn = 1
        ORDER BY 
          CASE 
            WHEN status = 'In Progress' THEN 1
            WHEN status = 'Completed' THEN 2
            WHEN status = 'Scrap' THEN 3
            ELSE 4
          END,
          productionenddate DESC,
          productionstartdate DESC;
      `;
      
      const unlimitedReq = pool.request();
      unlimitedReq.input("term", sql.VarChar(200), like);
      unlimitedReq.timeout = 120000; // Longer timeout for large results
      
      const unlimitedRes = await unlimitedReq.query(unlimitedSql);
      
      return res.json({
        ok: true,
        total: unlimitedRes.recordset.length,
        data: unlimitedRes.recordset || [],
        returnedAll: true,
        searchTerm: term
      });
    }

    // For longer searches (4+ characters), use pagination
    const reqUnique = pool.request();
    reqUnique.timeout = 60000;
    reqUnique.input("term", sql.VarChar(200), like);
    reqUnique.input("offset", sql.Int, offset);
    reqUnique.input("limit", sql.Int, limit);

    // COUNT unique UIDs
    const countUniqueSql = `
      WITH ranked AS (
        SELECT
          pl.uid,
          ROW_NUMBER() OVER (
            PARTITION BY pl.uid
            ORDER BY 
              CASE 
                WHEN pl.productstatus = 'In Progress' THEN 1
                WHEN pl.productstatus = 'Completed' THEN 2
                WHEN pl.productstatus = 'Scrap' THEN 3
                ELSE 4
              END,
              pl.productionenddate DESC,
              pl.productionstartdate DESC
          ) AS rn
        FROM trace.productionlifecycle pl WITH (INDEX(IX_productionlifecycle_uid_cover))
        WHERE RTRIM(LTRIM(pl.uid)) LIKE @term
      )
      SELECT COUNT(*) AS totalUnique
      FROM ranked
      WHERE rn = 1;
    `;
    const countRes = await reqUnique.query(countUniqueSql);
    const total = Number(countRes.recordset?.[0]?.totalUnique || 0);

    // PAGE over the latest-per-UID rows
    const pageUniqueSql = `
      WITH ranked AS (
        SELECT
          pl.uid,
          pl.productid,
          pl.productmodelname,
          pl.productvariant,
          pl.equipmentid,
          ISNULL(e.equipmentname, pl.equipmentid) AS equipmentname,
          FORMAT(pl.productionstartdate, 'yyyy-MM-dd HH:mm:ss') AS productionstartdate,
          FORMAT(pl.productionenddate, 'yyyy-MM-dd HH:mm:ss')   AS productionenddate,
          pl.productstatus AS status,
          pl.productionremarks AS qualityremarks,
          eu.endoflineuid,
          ROW_NUMBER() OVER (
            PARTITION BY pl.uid
            ORDER BY 
              CASE 
                WHEN pl.productstatus = 'In Progress' THEN 1
                WHEN pl.productstatus = 'Completed' THEN 2
                WHEN pl.productstatus = 'Scrap' THEN 3
                ELSE 4
              END,
              pl.productionenddate DESC,
              pl.productionstartdate DESC
          ) AS rn
        FROM trace.productionlifecycle pl WITH (INDEX(IX_productionlifecycle_uid_cover))
        LEFT JOIN trace.eoluid eu
          ON eu.uid = pl.uid AND eu.productid = pl.productid
        LEFT JOIN trace.equipments e
          ON e.equipmentid = pl.equipmentid AND e.productid = pl.productid
        WHERE RTRIM(LTRIM(pl.uid)) LIKE @term
      )
      SELECT
        uid, productid, productmodelname, productvariant,
        equipmentid, equipmentname,
        productionstartdate, productionenddate,
        status, qualityremarks, endoflineuid
      FROM ranked
      WHERE rn = 1
      ORDER BY 
        CASE 
          WHEN status = 'In Progress' THEN 1
          WHEN status = 'Completed' THEN 2
          WHEN status = 'Scrap' THEN 3
          ELSE 4
        END,
        productionenddate DESC,
        productionstartdate DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
    `;
    const pageRes = await reqUnique.query(pageUniqueSql);
    
    return res.json({
      ok: true,
      total,                 // total UNIQUE UIDs
      page,
      limit,
      data: pageRes.recordset || [],   // one row per UID, latest only
      returnedAll: false,
      searchTerm: term
    });

  } catch (err) {
    console.error("[trace uid-contains] error", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

module.exports = router;