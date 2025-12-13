// const express = require('express');
// const router = express.Router();
// const db = require('../../db');

// // GET Rework Approved Report Summary (UID Count)
// router.get('/summary', async (req, res) => {
//     try {
//         const { fromDate, toDate } = req.query;
        
//         let query = `
//             SELECT 
//                 COUNT(DISTINCT uid) as approvedCount,
//                 COUNT(*) as totalRecords
//             FROM [trace].[reworkdetailreport] 
//             WHERE rework_approveddate IS NOT NULL
//         `;
        
//         const request = (await db.poolPromise).request();
        
//         if (fromDate) {
//             query += ` AND CAST(productionstartdate AS DATE) >= @fromDate`;
//             request.input('fromDate', db.sql.Date, fromDate);
//         }
        
//         if (toDate) {
//             query += ` AND CAST(productionstartdate AS DATE) <= @toDate`;
//             request.input('toDate', db.sql.Date, toDate);
//         }
        
//         const result = await request.query(query);
        
//         res.json({
//             success: true,
//             data: {
//                 approvedCount: result.recordset[0]?.approvedCount || 0,
//                 totalRecords: result.recordset[0]?.totalRecords || 0
//             }
//         });
        
//     } catch (error) {
//         console.error('Error fetching rework approved summary:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: error.message
//         });
//     }
// });

// // GET UID List for dropdown/search
// router.get('/uids', async (req, res) => {
//     try {
//         const { search } = req.query;
        
//         let query = `
//             SELECT DISTINCT uid, productmodelname as model, productvariant as variant
//             FROM [trace].[reworkdetailreport] 
//             WHERE uid IS NOT NULL
//         `;
        
//         const request = (await db.poolPromise).request();
        
//         if (search) {
//             query += ` AND (uid LIKE @search OR productmodelname LIKE @search OR productvariant LIKE @search)`;
//             request.input('search', db.sql.VarChar, `%${search}%`);
//         }
        
//         query += ` ORDER BY uid`;
        
//         const result = await request.query(query);
        
//         res.json({
//             success: true,
//             message: 'Successfully fetched UIDs from Azure SQL',
//             data: result.recordset
//         });
        
//     } catch (error) {
//         console.error('Error fetching UID list:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: error.message
//         });
//     }
// });

// // GET Rework Approved Report Details for specific UID
// router.get('/uid/:uid', async (req, res) => {
//     try {
//         const { uid } = req.params;
//         const { fromDate, toDate } = req.query;
        
//         // Get data from reworkdetailreport view for the specific UID
//         let query = `
//             SELECT 
//                 equipmentname AS Equipment,
//                 equipmentid AS EquipmentId,
//                 productionstartdate AS ProductionStartDate,
//                 productionenddate AS ProductionEndDate,
//                 rework_bookdate AS RewarkBookDate,
//                 rework_approveddate AS RewarkApprovedDate,
//                 COALESCE(defectcode, '') AS DefectCode,
//                 COALESCE(description, '') AS Description,
//                 COALESCE(approvedcount, 0) AS RewarkCount,
//                 COALESCE(productionremarks, '') AS QualityRemarks,
//                 COALESCE(operatorname, '') AS Operator,
//                 COALESCE(shift, '') AS Shift,
//                 COALESCE(cycletime, '0') AS CycleTime,
//                 COALESCE(productstatus, 'PAGE') AS Status,
//                 productmodelname AS Model,
//                 productvariant AS Variant
//             FROM [trace].[reworkdetailreport] 
//             WHERE uid = @uid
//         `;
        
//         const request = (await db.poolPromise).request();
//         request.input('uid', db.sql.VarChar, uid);
        
//         if (fromDate) {
//             query += ` AND CAST(productionstartdate AS DATE) >= @fromDate`;
//             request.input('fromDate', db.sql.Date, fromDate);
//         }
        
//         if (toDate) {
//             query += ` AND CAST(productionstartdate AS DATE) <= @toDate`;
//             request.input('toDate', db.sql.Date, toDate);
//         }
        
//         query += ` ORDER BY productionstartdate, approvedcount`;
        
//         const result = await request.query(query);
        
//         // Get UID header info from the same view
//         const headerQuery = `
//             SELECT DISTINCT 
//                 uid,
//                 productmodelname AS Model,
//                 productvariant AS Variant
//             FROM [trace].[reworkdetailreport] 
//             WHERE uid = @uid
//         `;
        
//         const headerRequest = (await db.poolPromise).request();
//         headerRequest.input('uid', db.sql.VarChar, uid);
//         const headerResult = await headerRequest.query(headerQuery);
//         const headerInfo = headerResult.recordset[0] || {};
        
//         res.json({
//             success: true,
//             data: {
//                 header: {
//                     uid: headerInfo.uid,
//                     model: headerInfo.Model,
//                     variant: headerInfo.Variant
//                 },
//                 tableData: result.recordset,
//                 summary: {
//                     totalProcesses: result.recordset.length,
//                     reworkProcesses: result.recordset.filter(row => row.RewarkCount > 0).length,
//                     approvedProcesses: result.recordset.filter(row => row.Status === 'HARMONY').length
//                 }
//             }
//         });
        
//     } catch (error) {
//         console.error('Error fetching UID details:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: error.message
//         });
//     }
// });

// // GET All Rework Approved Data with filtering
// router.get('/all', async (req, res) => {
//     try {
//         const { fromDate, toDate, page = 1, limit = 50 } = req.query;
//         const offset = (page - 1) * limit;
        
//         let query = `
//             SELECT 
//                 uid,
//                 productmodelname AS Model,
//                 productvariant AS Variant,
//                 equipmentname AS Equipment,
//                 equipmentid AS EquipmentId,
//                 productionstartdate AS ProductionStartDate,
//                 productionenddate AS ProductionEndDate,
//                 rework_bookdate AS RewarkBookDate,
//                 rework_approveddate AS RewarkApprovedDate,
//                 COALESCE(defectcode, '') AS DefectCode,
//                 COALESCE(description, '') AS Description,
//                 COALESCE(approvedcount, 0) AS RewarkCount,
//                 COALESCE(productionremarks, '') AS QualityRemarks,
//                 COALESCE(operatorname, '') AS Operator,
//                 COALESCE(shift, '') AS Shift,
//                 COALESCE(cycletime, '0') AS CycleTime,
//                 COALESCE(productstatus, 'PAGE') AS Status
//             FROM [trace].[reworkdetailreport] 
//             WHERE rework_approveddate IS NOT NULL
//         `;
        
//         let countQuery = `
//             SELECT COUNT(*) as total
//             FROM [trace].[reworkdetailreport] 
//             WHERE rework_approveddate IS NOT NULL
//         `;
        
//         const request = (await db.poolPromise).request();
//         const countRequest = (await db.poolPromise).request();
        
//         if (fromDate) {
//             query += ` AND CAST(productionstartdate AS DATE) >= @fromDate`;
//             countQuery += ` AND CAST(productionstartdate AS DATE) >= @fromDate`;
//             request.input('fromDate', db.sql.Date, fromDate);
//             countRequest.input('fromDate', db.sql.Date, fromDate);
//         }
        
//         if (toDate) {
//             query += ` AND CAST(productionstartdate AS DATE) <= @toDate`;
//             countQuery += ` AND CAST(productionstartdate AS DATE) <= @toDate`;
//             request.input('toDate', db.sql.Date, toDate);
//             countRequest.input('toDate', db.sql.Date, toDate);
//         }
        
//         query += ` ORDER BY uid, productionstartdate, approvedcount`;
//         query += ` OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
        
//         request.input('offset', db.sql.Int, offset);
//         request.input('limit', db.sql.Int, parseInt(limit));
        
//         const [dataResult, countResult] = await Promise.all([
//             request.query(query),
//             countRequest.query(countQuery)
//         ]);
        
//         const totalRecords = parseInt(countResult.recordset[0]?.total || 0);
//         const totalPages = Math.ceil(totalRecords / limit);
        
//         res.json({
//             success: true,
//             data: {
//                 records: dataResult.recordset,
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
//         console.error('Error fetching all rework data:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: error.message
//         });
//     }
// });

// module.exports = router;



// \backend\backend\routes\trace\reworkapprovedcount.js

const express = require('express');
const router = express.Router();
const { pool, poolPromise } = require('../../db');

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



// ✅ GET Rework Approved Report Summary (UID Count)
router.get('/summary', async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;
        let paramIndex = 1;
        let params = [];

        let query = `
            SELECT 
                COUNT(DISTINCT uid) AS "approvedCount",
                COUNT(*) AS "totalRecords"
            FROM public.reworkdetailreport
            WHERE approvedcount <> 0
        `;


        // if (fromDate) {
        //     query += ` AND DATE(productionstartdate) >= $${paramIndex++}`;
        //     params.push(fromDate);
        // }
        // if (toDate) {
        //     query += ` AND DATE(productionstartdate) <= $${paramIndex++}`;
        //     params.push(toDate);
        // }

        const result = await pool.query(query, params);

        res.json({
            success: true,
            data: {
                approvedCount: result.rows[0]?.approvedCount || 0,
                totalRecords: result.rows[0]?.totalRecords || 0
            }
        });

    } catch (error) {
        console.error('Error fetching rework approved summary:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

// ✅ GET UID List for dropdown/search
router.get('/uids', async (req, res) => {
    try {
        const { search } = req.query;
        let paramIndex = 1;
        let params = [];

        let query = `
            SELECT DISTINCT uid, productmodelname AS model, productvariant AS variant
            FROM public.reworkdetailreport
            WHERE uid IS NOT NULL
            AND approvedcount <> 0
        `;

        if (search) {
            query += ` AND (uid ILIKE $${paramIndex} OR productmodelname ILIKE $${paramIndex} OR productvariant ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        query += ` ORDER BY uid`;

        const result = await pool.query(query, params);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Error fetching UID list:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

// ✅ GET Rework Approved Details for specific UID
// router.get('/uid/:uid', async (req, res) => {
//     try {
//         const { uid } = req.params;
//         const { fromDate, toDate } = req.query;

//         let paramIndex = 1;
//         let params = [uid];

//         let query = `
//             SELECT 
//                 equipmentname AS "Equipment",
//                 equipmentid AS "EquipmentId",
//                 productionstartdate AS "ProductionStartDate",
//                 productionenddate AS "ProductionEndDate",
//                 rework_bookdate AS "RewarkBookDate",
//                 rework_approveddate AS "RewarkApprovedDate",
//                 COALESCE(defectcode, '') AS "DefectCode",
//                 COALESCE(description, '') AS "Description",
//                 COALESCE(approvedcount, 0) AS "RewarkCount",
//                 COALESCE(productionremarks, '') AS "QualityRemarks",
//                 COALESCE(operatorname, '') AS "Operator",
//                 COALESCE(shift, '') AS "Shift",
//                 COALESCE(cycletime, '0') AS "CycleTime",
//                 COALESCE(productstatus, 'PAGE') AS "Status",
//                 productmodelname AS "Model",
//                 productvariant AS "Variant"
//             FROM public.reworkdetailreport
//             WHERE uid = $${paramIndex}
//             AND (rework_bookdate IS NOT NULL OR rework_approveddate IS NOT NULL OR approvedcount > 0)
//         `;

//         paramIndex++;

//         if (fromDate) {
//             query += ` AND DATE(productionstartdate) >= $${paramIndex++}`;
//             params.push(fromDate);
//         }
//         if (toDate) {
//             query += ` AND DATE(productionstartdate) <= $${paramIndex++}`;
//             params.push(toDate);
//         }

//         query += ` ORDER BY productionstartdate, approvedcount`;

//         const result = await pool.query(query, params);

//         // ✅ Header Query
//         const headerQuery = `
//             SELECT DISTINCT uid,
//                 productmodelname AS "Model",
//                 productvariant AS "Variant"
//             FROM public.reworkdetailreport
//             WHERE uid = $1
//         `;
//         const headerResult = await pool.query(headerQuery, [uid]);
//         const headerInfo = headerResult.rows[0] || {};

//         res.json({
//             success: true,
//             data: {
//                 header: {
//                     uid: headerInfo.uid,
//                     model: headerInfo.Model,
//                     variant: headerInfo.Variant
//                 },
//                 tableData: result.rows,
//                 summary: {
//                     totalProcesses: result.rows.length,
//                     reworkProcesses: result.rows.filter(r => r.RewarkCount > 0).length,
//                     approvedProcesses: result.rows.filter(r => r.Status === 'HARMONY').length
//                 }
//             }
//         });

//     } catch (error) {
//         console.error('Error fetching UID details:', error);
//         res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
//     }
// });



// ✅ GET Rework Approved Details for specific UID
router.get('/uid/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const { fromDate, toDate } = req.query;

        // 1. Check if UID has any rework
        const reworkCheckQuery = `
            SELECT 1 FROM public.reworkdetailreport
            WHERE uid = $1 
        AND (
        rework_approveddate IS NOT NULL
        OR approvedcount IN (0, 1)
      )
            LIMIT 1
        `;
        const reworkCheckResult = await pool.query(reworkCheckQuery, [uid]);
        if (reworkCheckResult.rowCount === 0) {
            // No rework for this UID
            return res.json({
                success: true,
                data: {
                    header: { uid },
                    tableData: [],
                    summary: {}
                },
                message: `No rework data found for UID: ${uid}`
            });
        }

        // 2. Fetch all process steps for the UID (with optional date filters)
        let paramIndex = 1;
        let params = [uid];
        // let query = `
        //     SELECT 
        //         equipmentname AS "Equipment",
        //         equipmentid AS "EquipmentId",
        //         productionstartdate AS "ProductionStartDate",
        //         productionenddate AS "ProductionEndDate",
        //         rework_bookdate AS "RewarkBookDate",
        //         rework_approveddate AS "RewarkApprovedDate",
        //         COALESCE(defectcode, '') AS "DefectCode",
        //         COALESCE(description, '') AS "Description",
        //         COALESCE(approvedcount, 0) AS "RewarkCount",
        //         COALESCE(productionremarks, '') AS "QualityRemarks",
        //         COALESCE(operatorname, '') AS "Operator",
        //         COALESCE(shift, '') AS "Shift",
        //         COALESCE(cycletime, '0') AS "CycleTime",
        //         COALESCE(productstatus, 'PAGE') AS "Status",
        //         productmodelname AS "Model",
        //         productvariant AS "Variant"
        //     FROM public.reworkdetailreport
        //     WHERE uid = $${paramIndex++}
        // `;
        let query = `
    SELECT 
        r.equipmentname AS "Equipment",
        r.equipmentid AS "EquipmentId",
        r.productionstartdate AS "ProductionStartDate",
        r.productionenddate AS "ProductionEndDate",
        r.rework_bookdate AS "RewarkBookDate",
        r.rework_approveddate AS "RewarkApprovedDate",
        COALESCE(r.defectcode, '') AS "DefectCode",
        COALESCE(r.description, '') AS "Description",
        COALESCE(r.approvedcount, 0) AS "RewarkCount",
        COALESCE(r.productionremarks, '') AS "QualityRemarks",
        COALESCE(r.operatorname, '') AS "Operator",
        COALESCE(r.shift, '') AS "Shift",
        COALESCE(r.cycletime, '0') AS "CycleTime",
        COALESCE(r.productstatus, 'PAGE') AS "Status",
        r.productmodelname AS "Model",
        r.productvariant AS "Variant"
    FROM public.reworkdetailreport r
    JOIN LATERAL (
        SELECT pl.reworkcount::integer AS latest_reworkcount,
               pl.productstatus
        FROM public.productionlifecycle pl
        WHERE pl.uid = r.uid
        ORDER BY pl.productionenddate DESC
        LIMIT 1
    ) latest ON TRUE
    WHERE r.uid = $${paramIndex++}
      AND (r.rework_approveddate IS NOT NULL OR r.approvedcount IN (0, 1))
`;


        if (fromDate) {
            query += ` AND DATE(productionstartdate) >= $${paramIndex++}`;
            params.push(fromDate);
        }
        if (toDate) {
            query += ` AND DATE(productionstartdate) <= $${paramIndex++}`;
            params.push(toDate);
        }

        query += ` ORDER BY productionstartdate, approvedcount`;

        const result = await pool.query(query, params);

        // ✅ Header Query
        const headerQuery = `
            SELECT DISTINCT uid,
                productmodelname AS "Model",
                productvariant AS "Variant"
            FROM public.reworkdetailreport
            WHERE uid = $1
        `;
        const headerResult = await pool.query(headerQuery, [uid]);
        const headerInfo = headerResult.rows[0] || {};

        // res.json({
        //     success: true,
        //     data: {
        //         header: {
        //             uid: headerInfo.uid,
        //             model: headerInfo.Model,
        //             variant: headerInfo.Variant
        //         },
        //         tableData: result.rows,
        //         summary: {
        //             totalProcesses: result.rows.length,
        //             reworkProcesses: result.rows.filter(r => r.RewarkCount > 0).length,
        //             approvedProcesses: result.rows.filter(r => r.Status === 'HARMONY').length
        //         }
        //     }
        // });

                const formattedRows = result.rows.map(row => ({
            ...row,
            ProductionStartDate: formatDate(row.ProductionStartDate),
            ProductionEndDate: formatDate(row.ProductionEndDate),
            RewarkBookDate: formatDate(row.RewarkBookDate),
            RewarkApprovedDate: formatDate(row.RewarkApprovedDate)
        }));

        res.json({
            success: true,
            data: {
                header: {
                    uid: headerInfo.uid,
                    model: headerInfo.Model,
                    variant: headerInfo.Variant
                },
                tableData: formattedRows, // <-- Now dates are formatted!
                summary: {
                    totalProcesses: formattedRows.length,
                    reworkProcesses: formattedRows.filter(r => r.RewarkCount > 0).length,
                    approvedProcesses: formattedRows.filter(r => r.Status === 'HARMONY').length
                }
            }
        });

    } catch (error) {
        console.error('Error fetching UID details:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

// ✅ GET All Rework Approved Data with Pagination & Filters
router.get('/all', async (req, res) => {
    try {
        const { fromDate, toDate, page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;

        let params = [];
        let paramIndex = 1;

        // let baseWhere = `WHERE rework_approveddate IS NOT NULL`;
        let baseWhere = `
        WHERE uid IN (
            SELECT DISTINCT uid
            FROM public.reworkdetailreport
            WHERE approvedcount <> 0
        )
        `;


        if (fromDate) {
            baseWhere += ` AND DATE(productionstartdate) >= $${paramIndex++}`;
            params.push(fromDate);
        }
        if (toDate) {
            baseWhere += ` AND DATE(productionstartdate) <= $${paramIndex++}`;
            params.push(toDate);
        }

        let query = `
            SELECT 
                uid,
                productmodelname AS "Model",
                productvariant AS "Variant",
                equipmentname AS "Equipment",
                equipmentid AS "EquipmentId",
                productionstartdate AS "ProductionStartDate",
                productionenddate AS "ProductionEndDate",
                rework_bookdate AS "RewarkBookDate",
                rework_approveddate AS "RewarkApprovedDate",
                COALESCE(defectcode, '') AS "DefectCode",
                COALESCE(description, '') AS "Description",
                COALESCE(approvedcount, 0) AS "RewarkCount",
                COALESCE(productionremarks, '') AS "QualityRemarks",
                COALESCE(operatorname, '') AS "Operator",
                COALESCE(shift, '') AS "Shift",
                COALESCE(cycletime, '0') AS "CycleTime",
                COALESCE(productstatus, 'PAGE') AS "Status"
            FROM public.reworkdetailreport
            ${baseWhere}
            ORDER BY uid, productionstartdate, approvedcount
            OFFSET $${paramIndex++} LIMIT $${paramIndex++}
        `;
        params.push(offset, parseInt(limit));

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM public.reworkdetailreport
            ${baseWhere}
        `;

        const [dataResult, countResult] = await Promise.all([
            pool.query(query, params),
            pool.query(countQuery, params.slice(0, paramIndex - 3))
        ]);

        const totalRecords = parseInt(countResult.rows[0]?.total || 0);
        const totalPages = Math.ceil(totalRecords / limit);

        // res.json({
        //     success: true,
        //     data: {
        //         records: dataResult.rows,
        //         pagination: {
        //             currentPage: parseInt(page),
        //             totalPages,
        //             totalRecords,
        //             hasNext: page < totalPages,
        //             hasPrev: page > 1
        //         }
        //     }
        // });

            const formattedRecords = dataResult.rows.map(row => ({
        ...row,
        ProductionStartDate: formatDate(row.ProductionStartDate),
        ProductionEndDate: formatDate(row.ProductionEndDate),
        RewarkBookDate: formatDate(row.RewarkBookDate),
        RewarkApprovedDate: formatDate(row.RewarkApprovedDate)
    }));

    res.json({
        success: true,
        data: {
            records: formattedRecords,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalRecords,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        }
    });

    } catch (error) {
        console.error('Error fetching all rework data:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
