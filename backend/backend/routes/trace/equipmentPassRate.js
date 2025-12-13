// const express = require('express');
// const router = express.Router();
// const sql = require('mssql');
// const { poolPromise } = require('../../db');

// // Equipment Pass Rate Report API - With Date/Time Filter
// router.get('/equipment-pass-rate', async (req, res) => {
//   try {
//     const { uid, fromDate, toDate, fromTime, toTime } = req.query;

//     console.log('Received request:', { uid, fromDate, toDate, fromTime, toTime });

//     if (!uid) {
//       return res.status(400).json({ error: 'UID is required' });
//     }

//     // Get ProductID from UID using your existing production_status view
//     const productId = await getProductIdFromUid(uid);
//     console.log('Found productId:', productId, 'for UID:', uid);
    
//     if (!productId) {
//       return res.status(404).json({ error: 'Product ID not found for the given UID' });
//     }

//     const pool = await poolPromise;
    
//     console.log('Executing stationcount_view02 query for productId:', productId);
    
//     let query = `
//       SELECT 
//         productid,
//         equipmentid,
//         equipmentname,
//         productmodelname,
//         productvariant,
//         COUNT(*) AS equipment_count
//       FROM [trace].[stationcount_view02]
//       WHERE productid = @productId
//     `;

//     const request = pool.request()
//       .input('productId', sql.VarChar(50), productId);

//     // Scene A: With Date/Time Filter
//     if (fromDate && toDate && fromTime && toTime) {
//       query += ` AND testdate BETWEEN @fromDateTime AND @toDateTime`;
//       request.input('fromDateTime', sql.DateTime2, `${fromDate}T${fromTime}`);
//       request.input('toDateTime', sql.DateTime2, `${toDate}T${toTime}`);
//       console.log('Scene A: With date/time filter');
//     } 
//     // Scene B: Without Date/Time Filter (get all data)
//     else {
//       console.log('Scene B: Without date/time filter - getting all data');
//     }

//     query += ` 
//       GROUP BY productid, equipmentid, equipmentname, productmodelname, productvariant
//       ORDER BY equipmentname
//     `;

//     const result = await request.query(query);

//     console.log('Query result:', result.recordset.length, 'records found');
//     if (result.recordset.length > 0) {
//       console.log('Sample record:', result.recordset[0]);
//     }
    
//     res.json(result.recordset);
//   } catch (error) {
//     console.error('Error in equipment pass rate report:', error);
//     console.error('Error details:', error.message);
//     res.status(500).json({ error: 'Internal server error: ' + error.message });
//   }
// });

// // Helper function to get ProductID from UID using your existing view
// async function getProductIdFromUid(uid) {
//   try {
//     const pool = await poolPromise;
    
//     const result = await pool.request()
//       .input('uid', sql.VarChar(200), uid.trim())
//       .query(`
//         SELECT TOP 1 productid 
//         FROM trace.production_status 
//         WHERE RTRIM(LTRIM(uid)) = @uid
//         ORDER BY 
//           CASE 
//             WHEN status = 'IN PROGRESS' THEN 1
//             WHEN status = 'COMPLETED' THEN 2
//             WHEN status = 'SCRAP' THEN 3
//             ELSE 4
//           END,
//           productionenddate DESC
//       `);
    
//     return result.recordset[0]?.productid;
//   } catch (error) {
//     console.error('Error getting product ID from UID:', error);
//     return null;
//   }
// }

// module.exports = router;



const express = require('express');
const router = express.Router();
const { pool } = require('../../db');

// Equipment Pass Rate Report API - With Date/Time Filter
// Now handles: /api/trace/equipment-pass-rate/equipment-pass-rate?uid=...
router.get('/equipment-pass-rate', async (req, res) => {
  const client = await pool.connect();
  try {
    const { uid, fromDate, toDate, fromTime, toTime } = req.query;

    console.log('Received request:', { uid, fromDate, toDate, fromTime, toTime });

    if (!uid) {
      return res.status(400).json({ error: 'UID is required' });
    }

    // Get ProductID from UID using your existing production_status view
    const productId = await getProductIdFromUid(uid);
    console.log('Found productId:', productId, 'for UID:', uid);
    
    if (!productId) {
      return res.status(404).json({ error: 'Product ID not found for the given UID' });
    }
    
    console.log('Executing stationcount_view02 query for productId:', productId);
    
    let query = `
      SELECT 
        productid,
        equipmentid,
        equipmentname,
        productmodelname,
        productvariant,
        COUNT(*) AS equipment_count
      FROM public.stationcount_view02
      WHERE productid = $1
    `;

    let queryParams = [productId];

    // Scene A: With Date/Time Filter
    if (fromDate && toDate && fromTime && toTime) {
      query += ` AND testdate BETWEEN $2 AND $3`;
      queryParams.push(`${fromDate} ${fromTime}`, `${toDate} ${toTime}`);
      console.log('Scene A: With date/time filter');
    } 
    // Scene B: Without Date/Time Filter (get all data)
    else {
      console.log('Scene B: Without date/time filter - getting all data');
    }

    query += ` 
      GROUP BY productid, equipmentid, equipmentname, productmodelname, productvariant
      ORDER BY equipmentname
    `;

    const result = await client.query(query, queryParams);

    console.log('Query result:', result.rows.length, 'records found');
    if (result.rows.length > 0) {
      console.log('Sample record:', result.rows[0]);
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error in equipment pass rate report:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  } finally {
    client.release();
  }
});

// Helper function to get ProductID from UID using your existing view
async function getProductIdFromUid(uid) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT productid 
      FROM public.production_status 
      WHERE TRIM(uid) = $1
      ORDER BY 
        CASE 
          WHEN status = 'IN PROGRESS' THEN 1
          WHEN status = 'COMPLETED' THEN 2
          WHEN status = 'SCRAP' THEN 3
          ELSE 4
        END,
        productionenddate DESC
      LIMIT 1
    `, [uid.trim()]);
    
    return result.rows[0]?.productid;
  } catch (error) {
    console.error('Error getting product ID from UID:', error);
    return null;
  } finally {
    client.release();
  }
}

module.exports = router;