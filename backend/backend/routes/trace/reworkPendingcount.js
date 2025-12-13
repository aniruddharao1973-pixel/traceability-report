// // routes/reworkpendingcount.js
// const express = require('express');
// const router = express.Router();
// const db = require('../../db');

// // GET Rework Pending Report Summary (UID Count)
// router.get('/summary', async (req, res) => {
//     try {
//         const { fromDate, toDate } = req.query;
        
//         let query = `
//             SELECT 
//                 COUNT(DISTINCT uid) as pendingCount,
//                 COUNT(*) as totalRecords
//             FROM [trace].[reworkdata]
//             WHERE reworkflag IS NULL 
//             AND reworkapproveddatetime IS NULL
//             AND reworkdatetime IS NOT NULL
//         `;
        
//         const request = (await db.poolPromise).request();
        
//         if (fromDate) {
//             query += ` AND CAST(reworkdatetime AS DATE) >= @fromDate`;
//             request.input('fromDate', db.sql.Date, fromDate);
//         }
        
//         if (toDate) {
//             query += ` AND CAST(reworkdatetime AS DATE) <= @toDate`;
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
//         const { search, fromDate, toDate } = req.query;
        
//         let query = `
//             SELECT DISTINCT uid, model, variant
//             FROM [trace].[reworkdata]
//             WHERE reworkflag IS NULL 
//             AND reworkapproveddatetime IS NULL
//             AND reworkdatetime IS NOT NULL
//         `;
        
//         const request = (await db.poolPromise).request();
        
//         if (search) {
//             query += ` AND (uid LIKE @search OR model LIKE @search OR variant LIKE @search)`;
//             request.input('search', db.sql.VarChar, `%${search}%`);
//         }
        
//         if (fromDate) {
//             query += ` AND CAST(reworkdatetime AS DATE) >= @fromDate`;
//             request.input('fromDate', db.sql.Date, fromDate);
//         }
        
//         if (toDate) {
//             query += ` AND CAST(reworkdatetime AS DATE) <= @toDate`;
//             request.input('toDate', db.sql.Date, toDate);
//         }
        
//         query += ` ORDER BY reworkdatetime DESC, uid`;
        
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
//                 uid AS Uid,
//                 equipmentname AS Equipment,
//                 productid AS ProductId,
//                 model AS Model,
//                 variant AS Variant,
//                 defectcode AS Defectcode,
//                 description AS Description,
//                 reworkdatetime AS ReworkBookDate,
//                 reworkapproveddatetime AS ReworkApprovedDateTime,
//                 rwequipmentname AS ReworkEquipment,
//                 operatorid AS Operator,
//                 shift AS Shift
//             FROM [trace].[reworkdata]
//             WHERE uid = @uid 
//             AND reworkflag IS NULL 
//             AND reworkapproveddatetime IS NULL
//             AND reworkdatetime IS NOT NULL
//         `;
        
//         const request = (await db.poolPromise).request();
//         request.input('uid', db.sql.VarChar, uid);
        
//         if (fromDate) {
//             query += ` AND CAST(reworkdatetime AS DATE) >= @fromDate`;
//             request.input('fromDate', db.sql.Date, fromDate);
//         }
        
//         if (toDate) {
//             query += ` AND CAST(reworkdatetime AS DATE) <= @toDate`;
//             request.input('toDate', db.sql.Date, toDate);
//         }
        
//         query += ` ORDER BY reworkdatetime DESC`;
        
//         const result = await request.query(query);
        
//         // ✅ CHECK: If no records found for this UID with criteria
//         if (result.recordset.length === 0) {
//             return res.json({
//                 success: false,
//                 message: 'UID mismatch or no pending rework data found for this UID',
//                 data: {
//                     header: {
//                         uid: uid,
//                         model: '',
//                         variant: ''
//                     },
//                     tableData: [],
//                     summary: {
//                         totalPending: 0,
//                         pendingCount: 0
//                     }
//                 }
//             });
//         }
        
//         // ✅ Format the data if records found
//         const formattedData = result.recordset.map(row => ({
//             Unit: row.Uid,
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
//             Shift: row.Shift
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

// // GET All Rework Pending Data with filtering (MAIN ENDPOINT)
// router.get('/all', async (req, res) => {
//     try {
//         const { fromDate, toDate, page = 1, limit = 50 } = req.query;
//         const offset = (page - 1) * limit;
        
//         let query = `
//             SELECT 
//                 uid AS Uid,
//                 equipmentname AS Equipment,
//                 productid AS ProductId,
//                 model AS Model,
//                 variant AS Variant,
//                 defectcode AS Defectcode,
//                 description AS Description,
//                 reworkdatetime AS ReworkBookDate,
//                 reworkapproveddatetime AS ReworkApprovedDateTime,
//                 rwequipmentname AS ReworkEquipment,
//                 operatorid AS Operator,
//                 shift AS Shift
//             FROM [trace].[reworkdata]
//             WHERE reworkflag IS NULL 
//             AND reworkapproveddatetime IS NULL
//             AND reworkdatetime IS NOT NULL
//         `;
        
//         let countQuery = `
//             SELECT COUNT(*) as total
//             FROM [trace].[reworkdata]
//             WHERE reworkflag IS NULL 
//             AND reworkapproveddatetime IS NULL
//             AND reworkdatetime IS NOT NULL
//         `;
        
//         const request = (await db.poolPromise).request();
//         const countRequest = (await db.poolPromise).request();
        
//         if (fromDate) {
//             query += ` AND CAST(reworkdatetime AS DATE) >= @fromDate`;
//             countQuery += ` AND CAST(reworkdatetime AS DATE) >= @fromDate`;
//             request.input('fromDate', db.sql.Date, fromDate);
//             countRequest.input('fromDate', db.sql.Date, fromDate);
//         }
        
//         if (toDate) {
//             query += ` AND CAST(reworkdatetime AS DATE) <= @toDate`;
//             countQuery += ` AND CAST(reworkdatetime AS DATE) <= @toDate`;
//             request.input('toDate', db.sql.Date, toDate);
//             countRequest.input('toDate', db.sql.Date, toDate);
//         }
        
//         query += ` ORDER BY reworkdatetime DESC`;
//         query += ` OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
        
//         request.input('offset', db.sql.Int, offset);
//         request.input('limit', db.sql.Int, parseInt(limit));
        
//         const [dataResult, countResult] = await Promise.all([
//             request.query(query),
//             countRequest.query(countQuery)
//         ]);
        
//         // Format data
//         const formattedData = dataResult.recordset.map(row => ({
//             Unit: row.Uid,
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
//             Shift: row.Shift
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




// // routes/reworkpendingcount.js
// const express = require('express');
// const router = express.Router();
// const { pool } = require('../../db');

// // GET Rework Pending Report Summary (UID Count)
// router.get('/summary', async (req, res) => {
//     const client = await pool.connect();
//     try {
//         const { fromDate, toDate } = req.query;
        
//         let query = `
//             SELECT 
//                 COUNT(DISTINCT uid) as pendingCount,
//                 COUNT(*) as totalRecords
//             FROM public.reworkdata
//             WHERE reworkflag IS NULL 
//             AND reworkapproveddatetime IS NULL
//             AND reworkdatetime IS NOT NULL
//         `;
        
//         let queryParams = [];
        
//         if (fromDate) {
//             query += ` AND CAST(reworkdatetime AS DATE) >= $${queryParams.length + 1}`;
//             queryParams.push(fromDate);
//         }
        
//         if (toDate) {
//             query += ` AND CAST(reworkdatetime AS DATE) <= $${queryParams.length + 1}`;
//             queryParams.push(toDate);
//         }
        
//         const result = await client.query(query, queryParams);
        
//         res.json({
//             success: true,
//             data: {
//                 pendingCount: result.rows[0]?.pendingcount || 0,
//                 totalRecords: result.rows[0]?.totalrecords || 0
//             }
//         });
        
//     } catch (error) {
//         console.error('Error fetching rework pending summary:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: error.message
//         });
//     } finally {
//         client.release();
//     }
// });

// // GET Pending UID List for dropdown/search
// router.get('/uids', async (req, res) => {
//     const client = await pool.connect();
//     try {
//         const { search, fromDate, toDate } = req.query;
        
//         let query = `
//             SELECT DISTINCT uid, model, variant
//             FROM public.reworkdata
//             WHERE reworkflag IS NULL 
//             AND reworkapproveddatetime IS NULL
//             AND reworkdatetime IS NOT NULL
//         `;
        
//         let queryParams = [];
        
//         if (search) {
//             query += ` AND (uid LIKE $${queryParams.length + 1} OR model LIKE $${queryParams.length + 1} OR variant LIKE $${queryParams.length + 1})`;
//             queryParams.push(`%${search}%`);
//         }
        
//         if (fromDate) {
//             query += ` AND CAST(reworkdatetime AS DATE) >= $${queryParams.length + 1}`;
//             queryParams.push(fromDate);
//         }
        
//         if (toDate) {
//             query += ` AND CAST(reworkdatetime AS DATE) <= $${queryParams.length + 1}`;
//             queryParams.push(toDate);
//         }
        
//         query += ` ORDER BY reworkdatetime DESC, uid`;
        
//         const result = await client.query(query, queryParams);
        
//         res.json({
//             success: true,
//             message: 'Successfully fetched pending UIDs from PostgreSQL',
//             data: result.rows
//         });
        
//     } catch (error) {
//         console.error('Error fetching pending UID list:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: error.message
//         });
//     } finally {
//         client.release();
//     }
// });

// // GET Rework Pending Report Details for specific UID
// router.get('/uid/:uid', async (req, res) => {
//     const client = await pool.connect();
//     try {
//         const { uid } = req.params;
//         const { fromDate, toDate } = req.query;
        
//         let query = `
//             SELECT 
//                 uid AS Uid,
//                 equipmentname AS Equipment,
//                 productid AS ProductId,
//                 model AS Model,
//                 variant AS Variant,
//                 defectcode AS Defectcode,
//                 description AS Description,
//                 reworkdatetime AS ReworkBookDate,
//                 reworkapproveddatetime AS ReworkApprovedDateTime,
//                 rwequipmentname AS ReworkEquipment,
//                 operatorid AS Operator,
//                 shift AS Shift
//             FROM public.reworkdata
//             WHERE uid = $1 
//             AND reworkflag IS NULL 
//             AND reworkapproveddatetime IS NULL
//             AND reworkdatetime IS NOT NULL
//         `;
        
//         let queryParams = [uid];
        
//         if (fromDate) {
//             query += ` AND CAST(reworkdatetime AS DATE) >= $${queryParams.length + 1}`;
//             queryParams.push(fromDate);
//         }
        
//         if (toDate) {
//             query += ` AND CAST(reworkdatetime AS DATE) <= $${queryParams.length + 1}`;
//             queryParams.push(toDate);
//         }
        
//         query += ` ORDER BY reworkdatetime DESC`;
        
//         const result = await client.query(query, queryParams);
        
//         // ✅ CHECK: If no records found for this UID with criteria
//         if (result.rows.length === 0) {
//             return res.json({
//                 success: false,
//                 message: 'UID mismatch or no pending rework data found for this UID',
//                 data: {
//                     header: {
//                         uid: uid,
//                         model: '',
//                         variant: ''
//                     },
//                     tableData: [],
//                     summary: {
//                         totalPending: 0,
//                         pendingCount: 0
//                     }
//                 }
//             });
//         }
        
//         // ✅ Format the data if records found
//         const formattedData = result.rows.map(row => ({
//             Unit: row.uid,
//             Equipment: row.equipment,
//             ProductId: row.productid,
//             Model: row.model,
//             Variant: row.variant,
//             Defectcode: row.defectcode,
//             Description: row.description,
//             ReworkBookDate: formatDate(row.reworkbookdate),
//             ReworkApprovedDateTime: formatDate(row.reworkapproveddatetime),
//             ReworkEquipment: row.reworkequipment,
//             Operator: row.operator,
//             Shift: row.shift
//         }));
        
//         res.json({
//             success: true,
//             data: {
//                 header: {
//                     uid: uid,
//                     model: result.rows[0]?.model || '',
//                     variant: result.rows[0]?.variant || ''
//                 },
//                 tableData: formattedData,
//                 summary: {
//                     totalPending: result.rows.length,
//                     pendingCount: result.rows.length
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
//     } finally {
//         client.release();
//     }
// });

// // GET All Rework Pending Data with filtering (MAIN ENDPOINT)
// router.get('/all', async (req, res) => {
//     const client = await pool.connect();
//     try {
//         const { fromDate, toDate, page = 1, limit = 50 } = req.query;
//         const offset = (page - 1) * limit;
        
//         let query = `
//             SELECT 
//                 uid AS Uid,
//                 equipmentname AS Equipment,
//                 productid AS ProductId,
//                 model AS Model,
//                 variant AS Variant,
//                 defectcode AS Defectcode,
//                 description AS Description,
//                 reworkdatetime AS ReworkBookDate,
//                 reworkapproveddatetime AS ReworkApprovedDateTime,
//                 rwequipmentname AS ReworkEquipment,
//                 operatorid AS Operator,
//                 shift AS Shift
//             FROM public.reworkdata
//             WHERE reworkflag IS NULL 
//             AND reworkapproveddatetime IS NULL
//             AND reworkdatetime IS NOT NULL
//         `;
        
//         let countQuery = `
//             SELECT COUNT(*) as total
//             FROM public.reworkdata
//             WHERE reworkflag IS NULL 
//             AND reworkapproveddatetime IS NULL
//             AND reworkdatetime IS NOT NULL
//         `;
        
//         let queryParams = [];
//         let countParams = [];
        
//         if (fromDate) {
//             query += ` AND CAST(reworkdatetime AS DATE) >= $${queryParams.length + 1}`;
//             countQuery += ` AND CAST(reworkdatetime AS DATE) >= $${countParams.length + 1}`;
//             queryParams.push(fromDate);
//             countParams.push(fromDate);
//         }
        
//         if (toDate) {
//             query += ` AND CAST(reworkdatetime AS DATE) <= $${queryParams.length + 1}`;
//             countQuery += ` AND CAST(reworkdatetime AS DATE) <= $${countParams.length + 1}`;
//             queryParams.push(toDate);
//             countParams.push(toDate);
//         }
        
//         query += ` ORDER BY reworkdatetime DESC`;
//         query += ` OFFSET $${queryParams.length + 1} ROWS FETCH NEXT $${queryParams.length + 2} ROWS ONLY`;
        
//         queryParams.push(offset);
//         queryParams.push(parseInt(limit));
        
//         const [dataResult, countResult] = await Promise.all([
//             client.query(query, queryParams),
//             client.query(countQuery, countParams)
//         ]);
        
//         // Format data
//         const formattedData = dataResult.rows.map(row => ({
//             Unit: row.uid,
//             Equipment: row.equipment,
//             ProductId: row.productid,
//             Model: row.model,
//             Variant: row.variant,
//             Defectcode: row.defectcode,
//             Description: row.description,
//             ReworkBookDate: formatDate(row.reworkbookdate),
//             ReworkApprovedDateTime: formatDate(row.reworkapproveddatetime),
//             ReworkEquipment: row.reworkequipment,
//             Operator: row.operator,
//             Shift: row.shift
//         }));
        
//         const totalRecords = parseInt(countResult.rows[0]?.total || 0);
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
//     } finally {
//         client.release();
//     }
// });

// // Helper function to format dates with correct AM/PM
// function formatDate(dateString) {
//     if (!dateString) return '';
//     try {
//         // Parse the date - let JavaScript handle the timezone conversion
//         const date = new Date(dateString);
//         if (isNaN(date.getTime())) return '';
        
//         // Use the date as-is (PostgreSQL already gives local time)
//         const month = date.getMonth() + 1;
//         const day = date.getDate();
//         const year = date.getFullYear();
        
//         let hours = date.getHours();
//         const minutes = date.getMinutes().toString().padStart(2, '0');
//         const seconds = date.getSeconds().toString().padStart(2, '0');
//         const ampm = hours >= 12 ? 'PM' : 'AM';
        
//         // Convert to 12-hour format
//         hours = hours % 12;
//         hours = hours ? hours : 12; // 0 should be 12
        
//         return `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
//     } catch (error) {
//         console.error('Date formatting error:', error);
//         return '';
//     }
// }

// module.exports = router;


/////////////////////////////////////////////////////// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // backend/routes/trace/reworkpendingcount.js
// const express = require('express');
// const router = express.Router();
// const { pool } = require('../../db');

// // helper validators
// const isValidDateString = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d);
// const isValidTimeString = (t) => /^\d{2}:\d{2}:\d{2}$/.test(t);

// // GET /api/trace?uid=...&fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD&fromTime=HH:mm:ss&toTime=HH:mm:ss&detail=1
// router.get('/', async (req, res) => {
//   const client = await pool.connect();
//   try {
//     let uid = req.query.uid;
//     if (!uid) return res.status(400).json({ error: 'uid query parameter is required' });
//     uid = String(uid).trim();

//     const fromDate = req.query.fromDate ? String(req.query.fromDate).trim() : null; // YYYY-MM-DD
//     const toDate = req.query.toDate ? String(req.query.toDate).trim() : null;     // YYYY-MM-DD
//     const fromTime = req.query.fromTime ? String(req.query.fromTime).trim() : '00:00:00';
//     const toTime = req.query.toTime ? String(req.query.toTime).trim() : '23:59:59';
//     const detailMode = String(req.query.detail || '').trim() === '1';

//     // date filter validity check
//     const dateFilterValid =
//       fromDate && toDate &&
//       isValidDateString(fromDate) && isValidDateString(toDate) &&
//       isValidTimeString(fromTime) && isValidTimeString(toTime);

//     // Build params (Postgres $1, $2, $3)
//     const params = [uid];

//     let query = '';

//     if (dateFilterValid) {
//       const startStr = `${fromDate} ${fromTime}`; // "YYYY-MM-DD HH:mm:ss"
//       const endStr   = `${toDate} ${toTime}`;
//       params.push(startStr); // $2
//       params.push(endStr);   // $3

//       if (detailMode) {
//         // detail mode: return one production lifecycle row per productionlifecycle row
//         // with aggregated tests JSON (keeps pl rows even when no tests)
//         query = `
//           SELECT
//             pl.uid,
//             COALESCE(e.equipmentname, pl.equipmentid) AS equipmentname,
//             pl.productmodelname,
//             pl.productvariant,
//             to_char(pl.productionstartdate, 'FMMM/FMDD/YYYY HH12:MI:SS AM') AS productionstartdate,
//             to_char(pl.productionenddate,   'FMMM/FMDD/YYYY HH12:MI:SS AM') AS productionenddate,
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
//             SELECT json_agg(json_build_object(
//               'testid', pe.testid,
//               'lsl', pe.lsl,
//               'value', pe.value,
//               'hsl', pe.hsl,
//               'unit', pe.unit,
//               'teststatus', pe.teststatus,
//               'reworkcount', COALESCE(pe.reworkcount, 0)
//             ) ORDER BY pe.testid) AS tests_json
//             FROM public.producteolresults pe
//             WHERE pe.uid = pl.uid
//               AND pe.equipmentid = pl.equipmentid
//               AND COALESCE(pe.approvedcount, 0) = COALESCE(pl.approvedcount, 0)
//           ) t ON TRUE
//           WHERE TRIM(pl.uid) = $1
//             AND pl.productionstartdate BETWEEN $2::timestamp AND $3::timestamp
//           ORDER BY pl.productionstartdate;
//         `;
//       } else {
//         // non-detail (flat) filtered query: multiple rows (one per producteolresults row)
//         query = `
//           SELECT
//             pl.uid,
//             COALESCE(e.equipmentname, pl.equipmentid) AS equipmentname,
//             pl.productmodelname,
//             pl.productvariant,
//             to_char(pl.productionstartdate, 'FMMM/FMDD/YYYY HH12:MI:SS AM') AS productionstartdate,
//             to_char(pl.productionenddate,   'FMMM/FMDD/YYYY HH12:MI:SS AM') AS productionenddate,
//             pe.testid,
//             pe.lsl,
//             pe.value,
//             pe.hsl,
//             pe.unit,
//             pe.teststatus,
//             COALESCE(pe.reworkcount, COALESCE(NULLIF(pl.reworkcount::text, '' )::int, 0)) AS reworkcount,
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
//           WHERE TRIM(pl.uid) = $1
//             AND pl.productionstartdate BETWEEN $2::timestamp AND $3::timestamp
//           ORDER BY pl.productionstartdate;
//         `;
//       }
//     } else {
//       // no date filters
//       if (detailMode) {
//         query = `
//           SELECT
//             pl.uid,
//             COALESCE(e.equipmentname, pl.equipmentid) AS equipmentname,
//             pl.productmodelname,
//             pl.productvariant,
//             to_char(pl.productionstartdate, 'FMMM/FMDD/YYYY HH12:MI:SS AM') AS productionstartdate,
//             to_char(pl.productionenddate,   'FMMM/FMDD/YYYY HH12:MI:SS AM') AS productionenddate,
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
//             SELECT json_agg(json_build_object(
//               'testid', pe.testid,
//               'lsl', pe.lsl,
//               'value', pe.value,
//               'hsl', pe.hsl,
//               'unit', pe.unit,
//               'teststatus', pe.teststatus,
//               'reworkcount', COALESCE(pe.reworkcount, 0)
//             ) ORDER BY pe.testid) AS tests_json
//             FROM public.producteolresults pe
//             WHERE pe.uid = pl.uid
//               AND pe.equipmentid = pl.equipmentid
//               AND COALESCE(pe.approvedcount, 0) = COALESCE(pl.approvedcount, 0)
//           ) t ON TRUE
//           WHERE TRIM(pl.uid) = $1
//           ORDER BY pl.productionstartdate;
//         `;
//       } else {
//         query = `
//           SELECT
//             pl.uid,
//             COALESCE(e.equipmentname, pl.equipmentid) AS equipmentname,
//             pl.productmodelname,
//             pl.productvariant,
//             to_char(pl.productionstartdate, 'FMMM/FMDD/YYYY HH12:MI:SS AM') AS productionstartdate,
//             to_char(pl.productionenddate,   'FMMM/FMDD/YYYY HH12:MI:SS AM') AS productionenddate,
//             pe.testid,
//             pe.lsl,
//             pe.value,
//             pe.hsl,
//             pe.unit,
//             pe.teststatus,
//             COALESCE(pe.reworkcount, COALESCE(NULLIF(pl.reworkcount::text, '')::int, 0)) AS reworkcount,
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
//           WHERE TRIM(pl.uid) = $1
//           ORDER BY pl.productionstartdate;
//         `;
//       }
//     }

//     // execute
//     const result = await client.query(query, params);
//     let rows = result.rows || [];

//     // When detailMode was used, convert tests_json into tests array (and remove tests_json)
//     if (detailMode) {
//       rows = rows.map(r => {
//         // r.tests_json may already be parsed (object) or string, normalize to array
//         let tests = [];
//         try {
//           if (r.tests_json === null) tests = [];
//           else if (Array.isArray(r.tests_json)) tests = r.tests_json;
//           else tests = JSON.parse(r.tests_json);
//         } catch (e) {
//           tests = [];
//         }
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





// backend\backend\routes\trace\reworkPendingcount.js
const express = require('express');
const router = express.Router();
const { pool } = require('../../db');

// Helper: Format date to MM/DD/YYYY HH:MM:SS AM/PM
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

// GET Rework Pending Report Summary (UID Count)
router.get('/summary', async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        let paramIndex = 1;
        let params = [];

        let query = `
            SELECT 
                COUNT(DISTINCT uid) as "pendingCount",
                COUNT(*) as "totalRecords"
            FROM public.reworkdata
            WHERE reworkflag IS NULL 
              AND reworkapproveddatetime IS NULL
              AND reworkdatetime IS NOT NULL
        `;

        if (fromDate) {
            query += ` AND DATE(reworkdatetime) >= $${paramIndex++}`;
            params.push(fromDate);
        }
        if (toDate) {
            query += ` AND DATE(reworkdatetime) <= $${paramIndex++}`;
            params.push(toDate);
        }

        const result = await pool.query(query, params);

        res.json({
            success: true,
            data: {
                pendingCount: result.rows[0]?.pendingCount || 0,
                totalRecords: result.rows[0]?.totalRecords || 0
            }
        });

    } catch (error) {
        console.error('Error fetching rework pending summary:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});


// GET Rework Pending UID List (PostgreSQL-safe)
router.get('/uids', async (req, res) => {
  try {
    const { search, fromDate, toDate } = req.query;

    let params = [];
    let idx = 1;

    let query = `
      SELECT
        uid,
        model,
        variant
      FROM (
        SELECT
          rd.uid,
          rd.model,
          rd.variant,
          MAX(rd.reworkdatetime) AS last_rework_dt
        FROM public.reworkdata rd
        WHERE rd.reworkflag IS NULL
          AND rd.reworkapproveddatetime IS NULL
          AND rd.reworkdatetime IS NOT NULL
    `;

    if (search) {
      query += `
        AND (
          rd.uid ILIKE $${idx}
          OR rd.model ILIKE $${idx}
          OR rd.variant ILIKE $${idx}
        )
      `;
      params.push(`%${search}%`);
      idx++;
    }

    if (fromDate) {
      query += ` AND DATE(rd.reworkdatetime) >= $${idx++}`;
      params.push(fromDate);
    }

    if (toDate) {
      query += ` AND DATE(rd.reworkdatetime) <= $${idx++}`;
      params.push(toDate);
    }

    query += `
        GROUP BY rd.uid, rd.model, rd.variant
      ) t
      ORDER BY t.last_rework_dt DESC, t.uid
    `;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching pending UID list:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});


// GET Rework Pending Report Details for specific UID
router.get('/uid/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const { fromDate, toDate } = req.query;
        let paramIndex = 2;
        let params = [uid];

        let query = `
            SELECT 
                uid AS "Uid",
                equipmentname AS "Equipment",
                productid AS "ProductId",
                model AS "Model",
                variant AS "Variant",
                defectcode AS "Defectcode",
                description AS "Description",
                reworkdatetime AS "ReworkBookDate",
                reworkapproveddatetime AS "ReworkApprovedDateTime",
                rwequipmentname AS "ReworkEquipment",
                operatorid AS "Operator",
                shift AS "Shift"
            FROM public.reworkdata
            WHERE uid = $1
              AND reworkflag IS NULL 
              AND reworkapproveddatetime IS NULL
              AND reworkdatetime IS NOT NULL
        `;

        if (fromDate) {
            query += ` AND DATE(reworkdatetime) >= $${paramIndex++}`;
            params.push(fromDate);
        }
        if (toDate) {
            query += ` AND DATE(reworkdatetime) <= $${paramIndex++}`;
            params.push(toDate);
        }

        query += ` ORDER BY reworkdatetime DESC`;

        const result = await pool.query(query, params);

        if (result.rows.length === 0) {
            return res.json({
                success: false,
                message: 'UID mismatch or no pending rework data found for this UID',
                data: {
                    header: {
                        uid: uid,
                        model: '',
                        variant: ''
                    },
                    tableData: [],
                    summary: {
                        totalPending: 0,
                        pendingCount: 0
                    }
                }
            });
        }

        // Format the data if records found
        const formattedData = result.rows.map(row => ({
            Uid: row.Uid,
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
            Shift: row.Shift
        }));

        res.json({
            success: true,
            data: {
                header: {
                    uid: uid,
                    model: result.rows[0]?.Model || '',
                    variant: result.rows[0]?.Variant || ''
                },
                tableData: formattedData,
                summary: {
                    totalPending: result.rows.length,
                    pendingCount: result.rows.length
                }
            }
        });

    } catch (error) {
        console.error('Error fetching pending UID details:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// GET All Rework Pending Data with filtering (MAIN ENDPOINT)
router.get('/all', async (req, res) => {
    try {
        const { fromDate, toDate, page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;
        let paramIndex = 1;
        let params = [];

        let query = `
            SELECT 
                uid AS "Uid",
                equipmentname AS "Equipment",
                productid AS "ProductId",
                model AS "Model",
                variant AS "Variant",
                defectcode AS "Defectcode",
                description AS "Description",
                reworkdatetime AS "ReworkBookDate",
                reworkapproveddatetime AS "ReworkApprovedDateTime",
                rwequipmentname AS "ReworkEquipment",
                operatorid AS "Operator",
                shift AS "Shift"
            FROM public.reworkdata
            WHERE reworkflag IS NULL 
              AND reworkapproveddatetime IS NULL
              AND reworkdatetime IS NOT NULL
        `;

        let countQuery = `
            SELECT COUNT(*) as total
            FROM public.reworkdata
            WHERE reworkflag IS NULL 
              AND reworkapproveddatetime IS NULL
              AND reworkdatetime IS NOT NULL
        `;

        if (fromDate) {
            query += ` AND DATE(reworkdatetime) >= $${paramIndex}`;
            countQuery += ` AND DATE(reworkdatetime) >= $${paramIndex}`;
            params.push(fromDate);
            paramIndex++;
        }
        if (toDate) {
            query += ` AND DATE(reworkdatetime) <= $${paramIndex}`;
            countQuery += ` AND DATE(reworkdatetime) <= $${paramIndex}`;
            params.push(toDate);
            paramIndex++;
        }

        query += ` ORDER BY reworkdatetime DESC OFFSET $${paramIndex} LIMIT $${paramIndex + 1}`;
        params.push(offset, parseInt(limit));

        const [dataResult, countResult] = await Promise.all([
            pool.query(query, params),
            pool.query(countQuery, params.slice(0, paramIndex - 2))
        ]);

        const totalRecords = parseInt(countResult.rows[0]?.total || 0);
        const totalPages = Math.ceil(totalRecords / limit);

        res.json({
            success: true,
            data: {
                records: dataResult.rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: totalPages,
                    totalRecords: totalRecords,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Error fetching all pending rework data:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

module.exports = router;