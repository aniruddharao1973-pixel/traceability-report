// // routes/trace/productionline.js
// const { poolPromise, sql } = require("../../db");

// function registerProductionLineRoutes(router) {
//   // Optimized cache with better memory management
//   let cache = null;
//   let lastFetch = 0;
//   const TTL_MS = 5 * 60 * 1000; // 5 minutes

//   // ⚡ OPTIMIZED: Single connection pattern for database queries
//   async function loadAll() {
//     let connection;
//     try {
//       const db = await poolPromise;
//       connection = await db.connect();
//       const startTime = Date.now();
      
//       const q = await connection.request().query(`
//         SELECT productid, productionlinename, productmodelname, productvariant
//         FROM trace.productionlines WITH (NOLOCK) -- ⚡ Performance hint
//         OPTION (RECOMPILE, MAXDOP 4); -- ⚡ Performance hints
//       `);
      
//       const queryTime = Date.now() - startTime;
//       console.log(`[PRODUCTIONLINES loadAll] SQL: ${queryTime}ms, Rows: ${q.recordset.length}`);
      
//       return q.recordset || [];
//     } catch (err) {
//       console.error('[PRODUCTIONLINES loadAll] error', err);
//       throw err;
//     } finally {
//       if (connection) {
//         connection.release();
//       }
//     }
//   }

//   // ⚡ OPTIMIZED: Better cache management with error handling
//   router.get("/productionlines", async (req, res) => {
//     const startTime = Date.now();
//     try {
//       const now = Date.now();
//       if (!cache || now - lastFetch > TTL_MS) {
//         console.log('[PRODUCTIONLINES] Cache refresh triggered');
//         cache = await loadAll();
//         lastFetch = now;
//       }
      
//       const totalTime = Date.now() - startTime;
//       console.log(`[PRODUCTIONLINES getAll] TOTAL: ${totalTime}ms, Cached: ${cache.length} rows`);
      
//       res.json({ 
//         ok: true, 
//         data: cache,
//         executionTime: {
//           total: `${totalTime}ms`,
//           cached: !!(cache && now - lastFetch < TTL_MS)
//         }
//       });
//     } catch (err) {
//       const totalTime = Date.now() - startTime;
//       console.error(`[PRODUCTIONLINES getAll ERROR] TOTAL: ${totalTime}ms`, err);
//       res.status(500).json({ 
//         ok: false, 
//         error: "Server error. Please try again later.",
//         executionTime: {
//           total: `${totalTime}ms`
//         }
//       });
//     }
//   });

//   // ⚡ OPTIMIZED: Faster lookup with pre-processing
//   router.get("/productionlines/:productid", async (req, res) => {
//     const startTime = Date.now();
//     try {
//       const pid = String(req.params.productid || "").trim();
//       if (!pid) {
//         return res.status(400).json({ 
//           ok: false, 
//           error: "productid required" 
//         });
//       }

//       // Ensure cache is loaded
//       if (!cache) {
//         console.log('[PRODUCTIONLINES] Cache miss, loading...');
//         cache = await loadAll();
//         lastFetch = Date.now();
//       }

//       // ⚡ OPTIMIZED: Use find with exact match
//       const row = cache.find(r => String(r.productid).trim() === pid);
//       const totalTime = Date.now() - startTime;

//       console.log(`[PRODUCTIONLINES getById] TOTAL: ${totalTime}ms, Found: ${!!row}`);

//       if (!row) {
//         return res.json({ 
//           ok: true, 
//           data: null,
//           executionTime: {
//             total: `${totalTime}ms`,
//             found: false
//           }
//         });
//       }
      
//       res.json({ 
//         ok: true, 
//         data: row,
//         executionTime: {
//           total: `${totalTime}ms`,
//           found: true
//         }
//       });
//     } catch (err) {
//       const totalTime = Date.now() - startTime;
//       console.error(`[PRODUCTIONLINES getById ERROR] TOTAL: ${totalTime}ms`, err);
//       res.status(500).json({ 
//         ok: false, 
//         error: "Server error. Please try again later.",
//         executionTime: {
//           total: `${totalTime}ms`
//         }
//       });
//     }
//   });
// }

// module.exports = registerProductionLineRoutes;



// routes/trace/productionline.js
const { pool } = require("../../db");

function registerProductionLineRoutes(router) {
  // Optimized cache with better memory management
  let cache = null;
  let lastFetch = 0;
  const TTL_MS = 5 * 60 * 1000; // 5 minutes

  // ⚡ OPTIMIZED: Single connection pattern for database queries
  async function loadAll() {
    const client = await pool.connect();
    try {
      const startTime = Date.now();
      
      const result = await client.query(`
        SELECT productid, productionlinename, productmodelname, productvariant
        FROM public.productionlines
      `);
      
      const queryTime = Date.now() - startTime;
      console.log(`[PRODUCTIONLINES loadAll] SQL: ${queryTime}ms, Rows: ${result.rows.length}`);
      
      return result.rows || [];
    } catch (err) {
      console.error('[PRODUCTIONLINES loadAll] error', err);
      throw err;
    } finally {
      client.release();
    }
  }

  // ⚡ OPTIMIZED: Better cache management with error handling
  router.get("/productionlines", async (req, res) => {
    const startTime = Date.now();
    try {
      const now = Date.now();
      if (!cache || now - lastFetch > TTL_MS) {
        console.log('[PRODUCTIONLINES] Cache refresh triggered');
        cache = await loadAll();
        lastFetch = now;
      }
      
      const totalTime = Date.now() - startTime;
      console.log(`[PRODUCTIONLINES getAll] TOTAL: ${totalTime}ms, Cached: ${cache.length} rows`);
      
      res.json({ 
        ok: true, 
        data: cache,
        executionTime: {
          total: `${totalTime}ms`,
          cached: !!(cache && now - lastFetch < TTL_MS)
        }
      });
    } catch (err) {
      const totalTime = Date.now() - startTime;
      console.error(`[PRODUCTIONLINES getAll ERROR] TOTAL: ${totalTime}ms`, err);
      res.status(500).json({ 
        ok: false, 
        error: "Server error. Please try again later.",
        executionTime: {
          total: `${totalTime}ms`
        }
      });
    }
  });

  // ⚡ OPTIMIZED: Faster lookup with pre-processing
  router.get("/productionlines/:productid", async (req, res) => {
    const startTime = Date.now();
    try {
      const pid = String(req.params.productid || "").trim();
      if (!pid) {
        return res.status(400).json({ 
          ok: false, 
          error: "productid required" 
        });
      }

      // Ensure cache is loaded
      if (!cache) {
        console.log('[PRODUCTIONLINES] Cache miss, loading...');
        cache = await loadAll();
        lastFetch = Date.now();
      }

      // ⚡ OPTIMIZED: Use find with exact match
      const row = cache.find(r => String(r.productid).trim() === pid);
      const totalTime = Date.now() - startTime;

      console.log(`[PRODUCTIONLINES getById] TOTAL: ${totalTime}ms, Found: ${!!row}`);

      if (!row) {
        return res.json({ 
          ok: true, 
          data: null,
          executionTime: {
            total: `${totalTime}ms`,
            found: false
          }
        });
      }
      
      res.json({ 
        ok: true, 
        data: row,
        executionTime: {
          total: `${totalTime}ms`,
          found: true
        }
      });
    } catch (err) {
      const totalTime = Date.now() - startTime;
      console.error(`[PRODUCTIONLINES getById ERROR] TOTAL: ${totalTime}ms`, err);
      res.status(500).json({ 
        ok: false, 
        error: "Server error. Please try again later.",
        executionTime: {
          total: `${totalTime}ms`
        }
      });
    }
  });
}

module.exports = registerProductionLineRoutes;