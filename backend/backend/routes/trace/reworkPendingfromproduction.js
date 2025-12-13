
// // routes/reworkPendingfromproduction.js
// const express = require('express');
// const router = express.Router();
// const db = require('../../db');

// // GET Rework Pending Report Summary (UID Count)
// router.get('/summary', async (req, res) => {
//     try {
//         const { fromDate, toDate } = req.query;
        
//         let query = `
//             SELECT 
//                 COUNT(DISTINCT pl.uid) as pendingCount,
//                 COUNT(*) as totalRecords
//             FROM [trace].[productionlifecycle] pl
//             LEFT JOIN [trace].[reworkdata] rd ON pl.uid = rd.uid AND pl.approvedcount = rd.approvedcount
//             WHERE rd.reworkapproveddatetime IS NULL 
//             AND rd.reworkdatetime IS NOT NULL
//         `;
        
//         const request = (await db.poolPromise).request();
        
//         if (fromDate) {
//             query += ` AND CAST(rd.reworkdatetime AS DATE) >= @fromDate`;
//             request.input('fromDate', db.sql.Date, fromDate);
//         }
        
//         if (toDate) {
//             query += ` AND CAST(rd.reworkdatetime AS DATE) <= @toDate`;
//             request.input('toDate', db.sql.Date, toDate);
//         }
        
//         const result = await request.query(query);
        
//         res.json({
//             success: true,
//             data: {
//                 pendingCount: result.recordset[0]?.pendingCount || 0,
//                 totalRecords: result.recordset[0]?.totalRecords || 0
//             }
//         });
        
//     } catch (error) {
//         console.error('Error fetching rework pending summary:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: error.message
//         });
//     }
// });

// // GET Pending UID List for dropdown/search
// router.get('/uids', async (req, res) => {
//     try {
//         const { search } = req.query;
        
//         let query = `
//             SELECT DISTINCT pl.uid, pl.productmodelname as model, pl.productvariant as variant
//             FROM [trace].[productionlifecycle] pl
//             LEFT JOIN [trace].[reworkdata] rd ON pl.uid = rd.uid AND pl.approvedcount = rd.approvedcount
//             WHERE pl.uid IS NOT NULL 
//             AND rd.reworkapproveddatetime IS NULL 
//             AND rd.reworkdatetime IS NOT NULL
//         `;
        
//         const request = (await db.poolPromise).request();
        
//         if (search) {
//             query += ` AND (pl.uid LIKE @search OR pl.productmodelname LIKE @search OR pl.productvariant LIKE @search)`;
//             request.input('search', db.sql.VarChar, `%${search}%`);
//         }
        
//         query += ` ORDER BY pl.uid`;
        
//         const result = await request.query(query);
        
//         res.json({
//             success: true,
//             message: 'Successfully fetched pending UIDs from Azure SQL',
//             data: result.recordset
//         });
        
//     } catch (error) {
//         console.error('Error fetching pending UID list:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: error.message
//         });
//     }
// });

// // GET Rework Pending Report Details for specific UID
// router.get('/uid/:uid', async (req, res) => {
//     try {
//         const { uid } = req.params;
//         const { fromDate, toDate } = req.query;
        
//         let query = `
//             SELECT 
//                 pl.uid AS Unit,
//                 e.equipmentname AS Equipment,
//                 pl.productid AS ProductId,
//                 pl.productmodelname AS Model,
//                 pl.productvariant AS Variant,
//                 rd.defectcode AS Defectcode,
//                 rd.description AS Description,
//                 rd.reworkdatetime AS ReworkBookDate,
//                 rd.reworkapproveddatetime AS ReworkApprovedDateTime,
//                 rd.rwequipmentname AS ReworkEquipment,
//                 pl.operatorid AS Operator,
//                 pl.shift AS SMR
//             FROM [trace].[productionlifecycle] pl
//             LEFT JOIN [trace].[equipments] e ON e.equipmentid = pl.equipmentid AND e.productid = pl.productid
//             LEFT JOIN [trace].[reworkdata] rd ON pl.uid = rd.uid AND e.equipmentname = rd.equipmentname AND pl.approvedcount = rd.approvedcount
//             WHERE pl.uid = @uid 
//             AND rd.reworkapproveddatetime IS NOT NULL 
//             AND rd.reworkdatetime IS NOT NULL
//         `;
        
//         const request = (await db.poolPromise).request();
//         request.input('uid', db.sql.VarChar, uid);
        
//         if (fromDate) {
//             query += ` AND CAST(rd.reworkdatetime AS DATE) >= @fromDate`;
//             request.input('fromDate', db.sql.Date, fromDate);
//         }
        
//         if (toDate) {
//             query += ` AND CAST(rd.reworkdatetime AS DATE) <= @toDate`;
//             request.input('toDate', db.sql.Date, toDate);
//         }
        
//         query += ` ORDER BY rd.reworkdatetime`;
        
//         const result = await request.query(query);
        
//         // Format the data
//         const formattedData = result.recordset.map(row => ({
//             Unit: row.Unit,
//             Equipment: row.Equipment,
//             ProductId: row.ProductId,
//             Model: row.Model,
//             Variant: row.Variant,
//             Defectcode: row.Defectcode,
//             Description: row.Description,
//             ReworkBookDate: formatDate(row.ReworkBookDate),
//             ReworkApprovedDateTime: formatDate(row.ReworkApprovedDateTime),
//             ReworkEquipment: row.ReworkEquipment,
//             Operator: row.Operator,
//             SMR: row.SMR
//         }));
        
//         res.json({
//             success: true,
//             data: {
//                 header: {
//                     uid: uid,
//                     model: result.recordset[0]?.Model || '',
//                     variant: result.recordset[0]?.Variant || ''
//                 },
//                 tableData: formattedData,
//                 summary: {
//                     totalPending: result.recordset.length,
//                     pendingCount: result.recordset.length
//                 }
//             }
//         });
        
//     } catch (error) {
//         console.error('Error fetching pending UID details:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: error.message
//         });
//     }
// });

// // GET All Rework Pending Data with filtering
// router.get('/all', async (req, res) => {
//     try {
//         const { fromDate, toDate, page = 1, limit = 50 } = req.query;
//         const offset = (page - 1) * limit;
        
//         let query = `
//             SELECT 
//                 pl.uid AS Unit,
//                 e.equipmentname AS Equipment,
//                 pl.productid AS ProductId,
//                 pl.productmodelname AS Model,
//                 pl.productvariant AS Variant,
//                 rd.defectcode AS Defectcode,
//                 rd.description AS Description,
//                 rd.reworkdatetime AS ReworkBookDate,
//                 rd.reworkapproveddatetime AS ReworkApprovedDateTime,
//                 rd.rwequipmentname AS ReworkEquipment,
//                 pl.operatorid AS Operator,
//                 pl.shift AS SMR
//             FROM [trace].[productionlifecycle] pl
//             LEFT JOIN [trace].[equipments] e ON e.equipmentid = pl.equipmentid AND e.productid = pl.productid
//             LEFT JOIN [trace].[reworkdata] rd ON pl.uid = rd.uid AND e.equipmentname = rd.equipmentname AND pl.approvedcount = rd.approvedcount
//             WHERE rd.reworkapproveddatetime IS NULL 
//             AND rd.reworkdatetime IS NOT NULL
//         `;
        
//         let countQuery = `
//             SELECT COUNT(*) as total
//             FROM [trace].[productionlifecycle] pl
//             LEFT JOIN [trace].[reworkdata] rd ON pl.uid = rd.uid AND pl.approvedcount = rd.approvedcount
//             WHERE rd.reworkapproveddatetime IS NULL 
//             AND rd.reworkdatetime IS NOT NULL
//         `;
        
//         const request = (await db.poolPromise).request();
//         const countRequest = (await db.poolPromise).request();
        
//         if (fromDate) {
//             query += ` AND CAST(rd.reworkdatetime AS DATE) >= @fromDate`;
//             countQuery += ` AND CAST(rd.reworkdatetime AS DATE) >= @fromDate`;
//             request.input('fromDate', db.sql.Date, fromDate);
//             countRequest.input('fromDate', db.sql.Date, fromDate);
//         }
        
//         if (toDate) {
//             query += ` AND CAST(rd.reworkdatetime AS DATE) <= @toDate`;
//             countQuery += ` AND CAST(rd.reworkdatetime AS DATE) <= @toDate`;
//             request.input('toDate', db.sql.Date, toDate);
//             countRequest.input('toDate', db.sql.Date, toDate);
//         }
        
//         query += ` ORDER BY pl.uid, rd.reworkdatetime`;
//         query += ` OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
        
//         request.input('offset', db.sql.Int, offset);
//         request.input('limit', db.sql.Int, parseInt(limit));
        
//         const [dataResult, countResult] = await Promise.all([
//             request.query(query),
//             countRequest.query(countQuery)
//         ]);
        
//         // Format data
//         const formattedData = dataResult.recordset.map(row => ({
//             Unit: row.Unit,
//             Equipment: row.Equipment,
//             ProductId: row.ProductId,
//             Model: row.Model,
//             Variant: row.Variant,
//             Defectcode: row.Defectcode,
//             Description: row.Description,
//             ReworkBookDate: formatDate(row.ReworkBookDate),
//             ReworkApprovedDateTime: formatDate(row.ReworkApprovedDateTime),
//             ReworkEquipment: row.ReworkEquipment,
//             Operator: row.Operator,
//             SMR: row.SMR
//         }));
        
//         const totalRecords = parseInt(countResult.recordset[0]?.total || 0);
//         const totalPages = Math.ceil(totalRecords / limit);
        
//         res.json({
//             success: true,
//             data: {
//                 records: formattedData,
//                 pagination: {
//                     currentPage: parseInt(page),
//                     totalPages: totalPages,
//                     totalRecords: totalRecords,
//                     hasNext: page < totalPages,
//                     hasPrev: page > 1
//                 }
//             }
//         });
        
//     } catch (error) {
//         console.error('Error fetching all pending rework data:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: error.message
//         });
//     }
// });


// // GET Complete Rework Approved Data (without UID dependency)
// router.get('/complete-data', async (req, res) => {
//     try {
//         const {
//             fromDate,
//             toDate,
//             fromTime = '00:00:00',
//             toTime = '23:59:59'
//         } = req.query;

//         let query = `
//             SELECT 
//                 rd.uid AS Uid,
//                 rd.equipmentname AS Equipment,
//                 rd.productid AS ProductId,
//                 rd.model AS Model,
//                 rd.variant AS Variant,
//                 rd.defectcode AS Defectcode,
//                 rd.description AS Description,
//                 FORMAT(rd.reworkdatetime, 'M/d/yyyy h:mm:ss tt') AS ReworkBookDate,
//                 FORMAT(rd.reworkapproveddatetime, 'M/d/yyyy h:mm:ss tt') AS ReworkApprovedDateTime,
//                 rd.rwequipmentname AS ReworkEquipment,
//                 rd.operatorid AS Operator,
//                 rd.shift AS Shift
//             FROM [trace].[reworkdata] rd
//             WHERE rd.reworkflag IS NOT NULL 
//             AND rd.reworkdone = 0
//             AND rd.reworkapproveddatetime IS NOT NULL
//         `;

//         const request = (await db.poolPromise).request();

//         // ✅ Date filtering
//         if (fromDate) {
//             query += ` AND CAST(rd.reworkapproveddatetime AS DATE) >= @fromDate`;
//             request.input('fromDate', db.sql.Date, fromDate);
//         }
        
//         if (toDate) {
//             query += ` AND CAST(rd.reworkapproveddatetime AS DATE) <= @toDate`;
//             request.input('toDate', db.sql.Date, toDate);
//         }

//         query += ` ORDER BY rd.reworkapproveddatetime ASC`;

//         const result = await request.query(query);

//         // ✅ Format the data
//         const formattedData = result.recordset.map(row => ({
//             Uid: row.Uid,
//             Equipment: row.Equipment,
//             ProductId: row.ProductId,
//             Model: row.Model,
//             Variant: row.Variant,
//             Defectcode: row.Defectcode,
//             Description: row.Description,
//             ReworkBookDate: row.ReworkBookDate,
//             ReworkApprovedDateTime: row.ReworkApprovedDateTime,
//             ReworkEquipment: row.ReworkEquipment || 'SPU Cover Screw Tighting',
//             Operator: row.Operator,
//             Shift: row.Shift
//         }));

//         const uniqueUidCount = new Set(formattedData.map(r => r.Uid)).size;

//         res.json({
//             success: true,
//             data: {
//                 header: {
//                     title: "Rework Approved Report Pending From Production",
//                     approvedCount: uniqueUidCount,
//                     fromDate: fromDate || '01/04/2025',
//                     toDate: toDate || '15/10/2025',
//                     fromTime: fromTime,
//                     toTime: toTime
//                 },
//                 tableData: formattedData
//             }
//         });

//     } catch (error) {
//         console.error('Error fetching complete rework approved data:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: error.message
//         });
//     }
// });


// // ✅ Helper function to validate time format
// function isValidTime(timeString) {
//     const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
//     return timeRegex.test(timeString);
// }


// // Helper function to format dates with correct AM/PM
// function formatDate(dateString) {
//     if (!dateString) return '';
//     try {
//         const date = new Date(dateString);
//         if (isNaN(date.getTime())) return '';
        
//         // Create a new date in local timezone to fix the AM/PM issue
//         const localDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
        
//         const month = localDate.getMonth() + 1;
//         const day = localDate.getDate();
//         const year = localDate.getFullYear();
        
//         let hours = localDate.getHours();
//         const minutes = localDate.getMinutes().toString().padStart(2, '0');
//         const seconds = localDate.getSeconds().toString().padStart(2, '0');
//         const ampm = hours >= 12 ? 'PM' : 'AM';
        
//         // Convert to 12-hour format
//         hours = hours % 12;
//         hours = hours ? hours : 12; // 0 should be 12
        
//         return `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
//     } catch (error) {
//         return '';
//     }
// }

// module.exports = router;




// routes/reworkPendingfromproduction.js
const express = require('express');
const router = express.Router();
const { pool } = require('../../db');

/**
 * Common WHERE clause for "Rework Approved Report Pending From Production"
 * Conditions confirmed by you:
 *   updateflag IS NULL
 *   reworkdatetime IS NOT NULL
 *   reworkapproveddatetime IS NOT NULL
 *   reworkdone IS FALSE
 *   rwequipmentname IS NOT NULL
 *   approvedcount = 1
 */
const PENDING_FROM_PROD_WHERE = `
  rd.reworkflag IS NOT NULL
  AND rd.reworkdone IS FALSE
`;


// ✅ GET Rework Approved Pending From Production — Summary (UID Count)
router.get('/summary', async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    let params = [];
    let idx = 1;

    let query = `
    SELECT
      COUNT(DISTINCT rd.uid) AS "pendingCount",
      COUNT(*) AS "totalRecords"
    FROM public.reworkdata rd
    WHERE ${PENDING_FROM_PROD_WHERE}


    `;

    // if (fromDate) {
    //   query += ` AND DATE(rd.reworkdatetime) >= $${idx++}`;
    //   params.push(fromDate);
    // }
    // if (toDate) {
    //   query += ` AND DATE(rd.reworkdatetime) <= $${idx++}`;
    //   params.push(toDate);
    // }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        pendingCount: result.rows[0]?.pendingCount || 0,
        totalRecords: result.rows[0]?.totalRecords || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching rework pending summary:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// ✅ GET Pending UID List for dropdown/search
router.get('/uids', async (req, res) => {
  try {
    const { search } = req.query;

    let params = [];
    let idx = 1;

    let query = `
      SELECT DISTINCT
        rd.uid,
        rd.model   AS model,
        rd.variant AS variant
      FROM public.reworkdata rd
      WHERE ${PENDING_FROM_PROD_WHERE}
    `;


    if (search) {
      // search on uid, model, variant
      query += ` AND (rd.uid ILIKE $${idx} OR rd.model ILIKE $${idx} OR rd.variant ILIKE $${idx})`;
      params.push(`%${search}%`);
      idx++;
    }

    query += ` ORDER BY rd.uid`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching pending UID list:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// ✅ GET Rework Pending Report Details for specific UID
router.get('/uid/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { fromDate, toDate } = req.query;

    let params = [uid];
    let idx = 2;

    let query = `
      SELECT
        rd.uid                 AS "Unit",
        rd.equipmentname       AS "Equipment",
        rd.productid           AS "ProductId",
        rd.model               AS "Model",
        rd.variant             AS "Variant",
        rd.defectcode          AS "Defectcode",
        rd.description         AS "Description",
        rd.reworkdatetime      AS "ReworkBookDate",
        rd.reworkapproveddatetime AS "ReworkApprovedDateTime",
        rd.rwequipmentname     AS "ReworkEquipment",
        rd.operatorid          AS "Operator",
        rd.shift               AS "SMR"
      FROM public.reworkdata rd
      WHERE rd.uid = $1
        AND ${PENDING_FROM_PROD_WHERE}
      ORDER BY rd.reworkapproveddatetime
    `;


    // if (fromDate) {
    //   query += ` AND DATE(rd.reworkdatetime) >= $${idx++}`;
    //   params.push(fromDate);
    // }
    // if (toDate) {
    //   query += ` AND DATE(rd.reworkdatetime) <= $${idx++}`;
    //   params.push(toDate);
    // }


    const result = await pool.query(query, params);

    // format in JS to keep your existing structure
    const formattedData = result.rows.map(row => ({
      Unit: row.Unit,
      Equipment: row.Equipment,
      ProductId: row.ProductId,
      Model: row.Model,
      Variant: row.Variant,
      Defectcode: row.Defectcode,
      Description: row.Description,
      ReworkBookDate: formatDate(row.ReworkBookDate),
      ReworkApprovedDateTime: formatDate(row.ReworkApprovedDateTime),
      ReworkEquipment: row.ReworkEquipment,
      Operator: row.Operator,
      SMR: row.SMR,
    }));

    res.json({
      success: true,
      data: {
        header: {
          uid,
          model: result.rows[0]?.Model || '',
          variant: result.rows[0]?.Variant || '',
        },
        tableData: formattedData,
        summary: {
          totalPending: result.rows.length,
          pendingCount: result.rows.length,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching pending UID details:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// ✅ GET All Rework Approved Pending From Production (with filtering + pagination)
router.get('/all', async (req, res) => {
  try {
    // const { fromDate, toDate, page = 1, limit = 50 } = req.query;
    const { page = 1, limit = 50 } = req.query;
    const pageNum = parseInt(page);
    const lim = parseInt(limit);
    const offset = (pageNum - 1) * lim;

    let whereParams = [];
    let idx = 1;

    // shared WHERE
    let where = `WHERE ${PENDING_FROM_PROD_WHERE}`;

    // if (fromDate) {
    //   where += ` AND DATE(rd.reworkdatetime) >= $${idx++}`;
    //   whereParams.push(fromDate);
    // }
    // if (toDate) {
    //   where += ` AND DATE(rd.reworkdatetime) <= $${idx++}`;
    //   whereParams.push(toDate);
    // }

    const dataQuery = `
      SELECT
        rd.uid                 AS "Unit",
        rd.equipmentname       AS "Equipment",
        rd.productid           AS "ProductId",
        rd.model               AS "Model",
        rd.variant             AS "Variant",
        rd.defectcode          AS "Defectcode",
        rd.description         AS "Description",
        rd.reworkdatetime      AS "ReworkBookDate",
        rd.reworkapproveddatetime AS "ReworkApprovedDateTime",
        rd.rwequipmentname     AS "ReworkEquipment",
        rd.operatorid          AS "Operator",
        rd.shift               AS "SMR"
      FROM public.reworkdata rd
      WHERE ${PENDING_FROM_PROD_WHERE}
      ORDER BY rd.uid, rd.reworkapproveddatetime
      OFFSET $1 LIMIT $2
    `;


    const dataParams = [...whereParams, offset, lim];

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM public.reworkdata rd
      WHERE ${PENDING_FROM_PROD_WHERE}
    `;


    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, dataParams),
      pool.query(countQuery, whereParams),
    ]);

    const formattedData = dataResult.rows.map(row => ({
      Unit: row.Unit,
      Equipment: row.Equipment,
      ProductId: row.ProductId,
      Model: row.Model,
      Variant: row.Variant,
      Defectcode: row.Defectcode,
      Description: row.Description,
      ReworkBookDate: formatDate(row.ReworkBookDate),
      ReworkApprovedDateTime: formatDate(row.ReworkApprovedDateTime),
      ReworkEquipment: row.ReworkEquipment,
      Operator: row.Operator,
      SMR: row.SMR,
    }));

    const totalRecords = parseInt(countResult.rows[0]?.total || 0, 10);
    const totalPages = Math.ceil(totalRecords / lim);

    res.json({
      success: true,
      data: {
        records: formattedData,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalRecords,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching all pending rework data:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// ✅ GET Complete Rework Approved Data (without UID dependency) — formatted in SQL
router.get('/complete-data', async (req, res) => {
  try {
    const {
      fromDate,
      toDate,
      fromTime = '00:00:00',
      toTime = '23:59:59',
    } = req.query;

    let params = [];
    let idx = 1;

    let query = `
      SELECT 
        rd.uid AS "Uid",
        rd.equipmentname AS "Equipment",
        rd.productid AS "ProductId",
        rd.model AS "Model",
        rd.variant AS "Variant",
        rd.defectcode AS "Defectcode",
        rd.description AS "Description",
        TO_CHAR(rd.reworkdatetime, 'MM/DD/YYYY HH12:MI:SS AM')        AS "ReworkBookDate",
        TO_CHAR(rd.reworkapproveddatetime, 'MM/DD/YYYY HH12:MI:SS AM') AS "ReworkApprovedDateTime",
        rd.rwequipmentname AS "ReworkEquipment",
        rd.operatorid AS "Operator",
        rd.shift AS "Shift"
      FROM public.reworkdata rd
      WHERE ${PENDING_FROM_PROD_WHERE}
    `;

    // if (fromDate) {
    //   query += ` AND DATE(rd.reworkapproveddatetime) >= $${idx++}`;
    //   params.push(fromDate);
    // }
    // if (toDate) {
    //   query += ` AND DATE(rd.reworkapproveddatetime) <= $${idx++}`;
    //   params.push(toDate);
    // }

    query += ` ORDER BY rd.reworkapproveddatetime ASC`;

    const result = await pool.query(query, params);

    const formattedData = result.rows.map(row => ({
      Uid: row.Uid,
      Equipment: row.Equipment,
      ProductId: row.ProductId,
      Model: row.Model,
      Variant: row.Variant,
      Defectcode: row.Defectcode,
      Description: row.Description,
      ReworkBookDate: row.ReworkBookDate,
      ReworkApprovedDateTime: row.ReworkApprovedDateTime,
      ReworkEquipment: row.ReworkEquipment || 'SPU Cover Screw Tighting',
      Operator: row.Operator,
      Shift: row.Shift,
    }));

    const uniqueUidCount = new Set(formattedData.map(r => r.Uid)).size;

    res.json({
      success: true,
      data: {
        header: {
          title: 'Rework Approved Report Pending From Production',
          approvedCount: uniqueUidCount,
          fromDate: '',
          toDate: '',
          fromTime,
          toTime,
        },
        tableData: formattedData,
      },
    });
  } catch (error) {
    console.error('Error fetching complete rework approved data:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Helper: format to "M/D/YYYY h:mm:ss AM/PM"
function formatDate(dateString) {
    if (!dateString) return '';
    try {
        // Parse the date - let JavaScript handle the timezone conversion
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        // Use the date as-is (PostgreSQL already gives local time)
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        
        return `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    } catch (error) {
        console.error('Date formatting error:', error);
        return '';
    }
}

module.exports = router;
