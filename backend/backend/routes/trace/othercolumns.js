// // routes/trace/othercolumns.js
// const { poolPromise, sql } = require("../../db");

// const COLUMN_MAP = {
//   productid: "productid",
//   productmodelname: "productmodelname", 
//   productvariant: "productvariant",
//   productionstartdate: "productionstartdate",
//   productionenddate: "productionenddate",
//   status: "status",
// };  

// async function handleOtherColumnsExact({ req, res, sql, searchKey, value, fromDate, toDate, fromTime, toTime }) {
//   let connection;
//   const startTime = Date.now();
  
//   try {
//     // ✅ Single connection for all queries
//     const db = await poolPromise;
//     connection = await db.connect();
//     const reqS = connection.request();
//     reqS.timeout = 30000;

//     // Validate key
//     const col = COLUMN_MAP[searchKey];
//     if (!col) {
//       return res.status(400).json({ ok: false, error: `Unsupported search key: ${searchKey}` });
//     }

//     // Inputs
//     const isDateKey = searchKey === "productionstartdate" || searchKey === "productionenddate";
//     if (isDateKey) {
//       reqS.input("valueDate", sql.VarChar(19), value);
//     } else {
//       reqS.input("value", sql.VarChar(200), value);
//     }

//     // Optional date range filter
//     let dateFilter = "";
//     if (fromDate && toDate) {
//       const startStr = `${fromDate} ${fromTime || "00:00:00"}`;
//       const endStr = `${toDate} ${toTime || "23:59:59"}`;
//       reqS.input("startDTStr", sql.VarChar(19), startStr);
//       reqS.input("endDTStr", sql.VarChar(19), endStr);
//       dateFilter = `AND ps.productionstartdate BETWEEN @startDTStr AND @endDTStr`;
//     }

//     // Where clause
//     let whereClause = "";
//     if (isDateKey) {
//       whereClause = `WHERE CONVERT(varchar(19), ps.${col}, 120) = @valueDate`;
//     } else if (searchKey === "status") {
//       whereClause = `WHERE ps.status = @value`; 
//     } else {
//       whereClause = `WHERE ps.${col} = @value`;
//     }

//     // Base columns
//     const baseColumns = `
//       ps.uid,
//       ps.productid,
//       ps.productmodelname,
//       ps.productvariant,
//       ps.lastequipmentid AS equipmentid,
//       ps.status,
//       CONVERT(varchar(19), ps.productionstartdate, 120) AS productionstartdate,
//       CONVERT(varchar(19), ps.productionenddate, 120) AS productionenddate,
//       'production_status' AS _source,
//       '${searchKey}' AS _matchedBy
//     `;

//     // If short value (<=3), return ALL rows
//     if (value.length <= 3) {
//       const unlimitedSql = `
//         SELECT ${baseColumns}
//         FROM trace.production_status ps WITH (NOLOCK)
//         ${whereClause}
//         ${dateFilter}
//         ORDER BY ps.productionenddate DESC
//         OPTION (RECOMPILE, MAXDOP 4); -- ✅ REMOVED QUERYTRACEON 8649
//       `;
      
//       const unlimitedStart = Date.now();
//       const unlimitedRes = await reqS.query(unlimitedSql);
//       const unlimitedTime = Date.now() - unlimitedStart;
      
//       const totalTime = Date.now() - startTime;
      
//       console.log(`[${searchKey.toUpperCase()} exact UNLIMITED] SQL: ${unlimitedTime}ms`);
//       console.log(`[${searchKey.toUpperCase()} exact OPTIMIZED] TOTAL: ${totalTime}ms`);
      
//       return res.json({
//         ok: true,
//         total: unlimitedRes.recordset.length,
//         data: unlimitedRes.recordset || [],
//         returnedAll: true,
//         searchBy: searchKey,
//         searchValue: value,
//         executionTime: {
//           unlimitedQuery: `${unlimitedTime}ms`,
//           total: `${totalTime}ms`
//         }
//       });
//     }

//     // Pagination
//     const page = Math.max(parseInt(req.query.page || "1", 10), 1);
//     const limit = parseInt(req.query.limit, 10) || 50000;
//     const offset = (page - 1) * limit;

//     reqS.input("offset", sql.Int, offset);
//     reqS.input("limit", sql.Int, limit);

//     let total = 0;
//     let countTime = 0;

//     // COUNT query
//     const countSql = `
//       SELECT COUNT_BIG(*) AS total
//       FROM trace.production_status ps WITH (NOLOCK)
//       ${whereClause}
//       ${dateFilter}
//       OPTION (RECOMPILE, MAXDOP 4); -- ✅ REMOVED QUERYTRACEON 8649
//     `;
    
//     const countStart = Date.now();
//     const countRes = await reqS.query(countSql);
//     countTime = Date.now() - countStart;
//     total = Number(countRes.recordset?.[0]?.total || 0);

//     // DATA query
//     const pageSql = `
//       SELECT ${baseColumns}
//       FROM trace.production_status ps WITH (NOLOCK)
//       ${whereClause}
//       ${dateFilter}
//       ORDER BY ps.productionenddate DESC
//       OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
//       OPTION (RECOMPILE, MAXDOP 4); -- ✅ REMOVED QUERYTRACEON 8649
//     `;
    
//     const dataStart = Date.now();
//     const pageRes = await reqS.query(pageSql);
//     const dataTime = Date.now() - dataStart;
    
//     const totalTime = Date.now() - startTime;

//     console.log(`[${searchKey.toUpperCase()} exact COUNT] SQL: ${countTime}ms`);
//     console.log(`[${searchKey.toUpperCase()} exact DATA] SQL: ${dataTime}ms`);
//     console.log(`[${searchKey.toUpperCase()} exact OPTIMIZED] TOTAL: ${totalTime}ms`);

//     return res.json({
//       ok: true,
//       total,
//       page,
//       limit,
//       data: pageRes.recordset || [],
//       returnedAll: false,
//       searchBy: searchKey,
//       searchValue: value,
//       executionTime: {
//         countQuery: `${countTime}ms`,
//         dataQuery: `${dataTime}ms`,
//         total: `${totalTime}ms`
//       }
//     });

//   } catch (err) {
//     const totalTime = Date.now() - startTime;
//     console.error(`[${searchKey.toUpperCase()} exact ERROR] TOTAL: ${totalTime}ms`, err);
//     return res.status(500).json({ 
//       ok: false, 
//       error: "Server error. Please try again later.",
//       executionTime: {
//         total: `${totalTime}ms`
//       }
//     });
//   } finally {
//     if (connection) {
//       connection.release();
//     }
//   }
// }

// module.exports = { handleOtherColumnsExact };


// routes/trace/othercolumns.js
const { pool } = require("../../db");

const COLUMN_MAP = {
  productid: "productid",
  productmodelname: "productmodelname", 
  productvariant: "productvariant",
  productionstartdate: "productionstartdate",
  productionenddate: "productionenddate",
  status: "status",
};  

async function handleOtherColumnsExact({ req, res, searchKey, value, fromDate, toDate, fromTime, toTime }) {
  const client = await pool.connect();
  const startTime = Date.now();
  
  try {
    // Validate key
    const col = COLUMN_MAP[searchKey];
    if (!col) {
      return res.status(400).json({ ok: false, error: `Unsupported search key: ${searchKey}` });
    }

    // Optional date range filter
    let dateFilter = "";
    let queryParams = [];
    if (fromDate && toDate) {
      const startStr = `${fromDate} ${fromTime || "00:00:00"}`;
      const endStr = `${toDate} ${toTime || "23:59:59"}`;
      dateFilter = `AND ps.productionstartdate BETWEEN $${queryParams.length + 2} AND $${queryParams.length + 3}`;
      queryParams.push(startStr, endStr);
    }

    // Where clause
    let whereClause = "";
    const isDateKey = searchKey === "productionstartdate" || searchKey === "productionenddate";
    
    if (isDateKey) {
      whereClause = `WHERE TO_CHAR(ps.${col}, 'YYYY-MM-DD HH24:MI:SS') = $1`;
    } else if (searchKey === "status") {
      whereClause = `WHERE UPPER(ps.status) = UPPER($1)`;
    } else {
      whereClause = `WHERE ps.${col} = $1`;
    }
    
    queryParams.unshift(value); // Add value as first parameter

    // Base columns
    const baseColumns = `
      ps.uid, 
      ps.productid,
      ps.productmodelname,
      ps.productvariant,
      ps.lastequipmentid AS equipmentid,
      ps.status,
      TO_CHAR(ps.productionstartdate, 'YYYY-MM-DD HH24:MI:SS') AS productionstartdate,
      TO_CHAR(ps.productionenddate, 'YYYY-MM-DD HH24:MI:SS') AS productionenddate,
      'production_status' AS _source,
      '${searchKey}' AS _matchedBy
    `;

    // If short value (<=3), return ALL rows
    if (value.length <= 3) {
      const unlimitedSql = `
        SELECT ${baseColumns}
        FROM public.production_status ps
        ${whereClause}
        ${dateFilter}
        ORDER BY ps.productionenddate DESC
      `;
      
      const unlimitedStart = Date.now();
      const unlimitedRes = await client.query(unlimitedSql, queryParams);
      const unlimitedTime = Date.now() - unlimitedStart;
      
      const totalTime = Date.now() - startTime;
      
      console.log(`[${searchKey.toUpperCase()} exact UNLIMITED] SQL: ${unlimitedTime}ms`);
      console.log(`[${searchKey.toUpperCase()} exact OPTIMIZED] TOTAL: ${totalTime}ms`);
      
      return res.json({
        ok: true,
        total: unlimitedRes.rows.length,
        data: unlimitedRes.rows || [],
        returnedAll: true,
        searchBy: searchKey,
        searchValue: value,
        executionTime: {
          unlimitedQuery: `${unlimitedTime}ms`,
          total: `${totalTime}ms`
        }
      });
    }

    // Pagination
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = parseInt(req.query.limit, 10) || 50000;
    const offset = (page - 1) * limit;

    let total = 0;
    let countTime = 0;

    // COUNT query
    const countSql = `
      SELECT COUNT(*) AS total
      FROM public.production_status ps
      ${whereClause}
      ${dateFilter}
    `;
    
    const countStart = Date.now();
    const countRes = await client.query(countSql, queryParams);
    countTime = Date.now() - countStart;
    total = Number(countRes.rows?.[0]?.total || 0);

    // DATA query with pagination - FIXED PostgreSQL syntax
    const pageSql = `
      SELECT ${baseColumns}
      FROM public.production_status ps
      ${whereClause}
      ${dateFilter}
      ORDER BY ps.productionenddate DESC
      OFFSET $${queryParams.length + 1} LIMIT $${queryParams.length + 2}
    `;
    
    // Add pagination parameters
    const pageParams = [...queryParams, offset, limit];
    
    const dataStart = Date.now();
    const pageRes = await client.query(pageSql, pageParams);
    const dataTime = Date.now() - dataStart;
    
    const totalTime = Date.now() - startTime;

    console.log(`[${searchKey.toUpperCase()} exact COUNT] SQL: ${countTime}ms`);
    console.log(`[${searchKey.toUpperCase()} exact DATA] SQL: ${dataTime}ms`);
    console.log(`[${searchKey.toUpperCase()} exact OPTIMIZED] TOTAL: ${totalTime}ms`);

    return res.json({
      ok: true,
      total,
      page,
      limit,
      data: pageRes.rows || [],
      returnedAll: false,
      searchBy: searchKey,
      searchValue: value,
      executionTime: {
        countQuery: `${countTime}ms`,
        dataQuery: `${dataTime}ms`,
        total: `${totalTime}ms`
      }
    });

  } catch (err) {
    const totalTime = Date.now() - startTime;
    console.error(`[${searchKey.toUpperCase()} exact ERROR] TOTAL: ${totalTime}ms`, err);
    return res.status(500).json({ 
      ok: false, 
      error: "Server error. Please try again later.",
      executionTime: {
        total: `${totalTime}ms`
      }
    });
  } finally {
    client.release();
  }
}

module.exports = { handleOtherColumnsExact };