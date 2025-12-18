/**
 * analysis.js - INDUSTRY 4.0 WITH ALL FUNCTIONS IMPLEMENTED
 */

/**
 * analysis.js - INDUSTRY 4.0 WITH ALL FUNCTIONS IMPLEMENTED
 */

// const express = require("express");
// const { Pool } = require('pg');

// const router = express.Router();

// // Database connection
// const pool = new Pool({
//   host: process.env.PG_HOST || 'localhost',
//   port: process.env.PG_PORT || 5432,
//   user: process.env.PG_USER || 'your_username',
//   password: process.env.PG_PASSWORD || 'your_password',
//   database: process.env.PG_DATABASE || 'your_database',
// });

// async function runQuery(sql, params = []) {
//   try {
//     const result = await pool.query(sql, params);
//     return result.rows;
//   } catch (err) {
//     console.error("DB Query Error:", err.message);
//     return [];
//   }
// }

// // Main analysis endpoint
// router.get("/analysis", async (req, res) => {
//   const { uid } = req.query;
//   if (!uid) return res.status(400).json({ success: false, message: "UID parameter missing" });

//   try {
//     console.log("=== INDUSTRY 4.0 ANALYSIS START for UID:", uid, "===");

//     /* -----------------------------------------------------------------
//        1️⃣  BASIC PRODUCT INFORMATION
//     ------------------------------------------------------------------*/
//     // const lifecycleRows = await runQuery(
//     //   `SELECT uid, productid, productmodelname, productvariant, shift,
//     //           productionstartdate, productionenddate, productstatus,
//     //           reworkcount, cycletime, productionremarks
//     //    FROM public.productionlifecycle
//     //    WHERE uid = $1 LIMIT 1`, [uid]
//     // );

//       const lifecycleRows = await runQuery(
//         `SELECT uid, productid, productmodelname, productvariant, shift,
//                 productionstartdate, productionenddate, productstatus,
//                 reworkcount, cycletime, productionremarks
//         FROM public.productionlifecycle
//         WHERE uid = $1
//         ORDER BY productionenddate
//         LIMIT 1`, [uid]
//       );

//     if (lifecycleRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "UID not found in production data"
//       });
//     }

//     const lifecycle = lifecycleRows[0];

//     /* -----------------------------------------------------------------
//        2️⃣  SEQUENTIAL STATION TESTING DATA
//     ------------------------------------------------------------------*/
//       // const stationTests = await runQuery(
//       //   `SELECT
//       //       pl.equipmentid,
//       //       e.equipmentname,
//       //       e.equipmentsequence,
//       //       pl.productstatus as teststatus,
//       //       NULL as value, NULL as unit, NULL as lsl, NULL as hsl,
//       //       pl.productionstartdate as productiondate,
//       //       pl.productionremarks as remark,
//       //       pl.reworkcount,
//       //       ROW_NUMBER() OVER () as row_id
//       //   FROM public.productionlifecycle pl
//       //   LEFT JOIN (
//       //       SELECT DISTINCT ON (equipmentid)
//       //           equipmentid, equipmentname, equipmentsequence
//       //       FROM public.equipments
//       //       ORDER BY equipmentid, equipmentsequence
//       //   ) e ON pl.equipmentid = e.equipmentid
//       //   WHERE pl.uid = $1
//       //   ORDER BY pl.productionstartdate`, [uid]
//       // );

//             const stationTests = await runQuery(
//       `SELECT
//           pl.equipmentid,
//           e.equipmentname,
//           e.equipmentsequence,
//           pl.productstatus as teststatus,
//           NULL as value, NULL as unit, NULL as lsl, NULL as hsl,
//           pl.productionstartdate as productiondate,
//           pl.productionremarks as remark,
//           pl.reworkcount,
//           ROW_NUMBER() OVER () as row_id
//       FROM public.productionlifecycle pl
//       LEFT JOIN (
//           SELECT DISTINCT ON (equipmentid)
//               equipmentid, equipmentname, equipmentsequence
//           FROM public.equipments
//           ORDER BY equipmentid, equipmentsequence
//       ) e ON pl.equipmentid = e.equipmentid
//       WHERE pl.uid = $1
//       ORDER BY pl.productionenddate ASC`, [uid]
//     );
//     /* -----------------------------------------------------------------
//        3️⃣  REWORK HISTORY
//     ------------------------------------------------------------------*/
//     const reworkHistory = await runQuery(
//       `SELECT reworkdatetime, equipmentname, description, defectcode
//        FROM public.reworkdata
//        WHERE uid = $1
//        ORDER BY reworkdatetime`, [uid]
//     );

//     /* -----------------------------------------------------------------
//        4️⃣  INDUSTRY 4.0 METRICS CALCULATIONS
//     ------------------------------------------------------------------*/
//     const industry4Metrics = await calculateIndustry4Metrics(uid, stationTests, lifecycle, reworkHistory);

//     /* -----------------------------------------------------------------
//        5️⃣  COMPLETE RESPONSE
//     ------------------------------------------------------------------*/
//     const analysisData = {
//       success: true,
//       uid,

//       // Basic Product Info
//       product_info: {
//         product_id: lifecycle.productid,
//         product_model: lifecycle.productmodelname,
//         variant: lifecycle.productvariant,
//         shift: lifecycle.shift,
//         production_start: lifecycle.productionstartdate,
//         production_end: lifecycle.productionenddate,
//         status: lifecycle.productstatus,
//         total_cycle_time: lifecycle.cycletime,
//         remarks: lifecycle.productionremarks
//       },

//       // Sequential Station Analysis
//       station_analysis: {
//         total_stations: stationTests.length,
//         completed_stations: stationTests.filter(s => s.teststatus === 'PASS').length,
//         station_sequence: stationTests.map(station => ({
//           sequence: station.equipmentsequence,
//           station_name: station.equipmentname,
//           equipment_id: station.equipmentid,
//           test_status: station.teststatus,
//           test_value: station.value,
//           test_unit: station.unit,
//           limits: { lsl: station.lsl, hsl: station.hsl },
//           test_time: station.productiondate,
//           remarks: station.remark,
//           rework_count: station.reworkcount
//         })),
//         current_station: getCurrentStation(stationTests),
//         estimated_completion: estimateEOLCompletion(stationTests, lifecycle)
//       },

//       // Quality Metrics
//       quality_metrics: {
//         first_pass_yield: calculateFirstPassYield(stationTests),
//         station_yield: calculateStationYield(stationTests),
//         total_tests: stationTests.length,
//         passed_tests: stationTests.filter(s => s.teststatus === 'PASS').length,
//         failed_tests: stationTests.filter(s => s.teststatus === 'FAIL').length,
//         rework_count: reworkHistory.length
//       },

//       // Industry 4.0 Advanced Metrics
//       industry4_metrics: industry4Metrics,

//       // Recommendations
//       recommendations: generateRecommendations(industry4Metrics, stationTests, reworkHistory)
//     };

//     console.log("=== INDUSTRY 4.0 ANALYSIS COMPLETE ===");
//     res.status(200).json(analysisData);

//   } catch (error) {
//     console.error("Error in Industry 4.0 analysis:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error in analysis",
//       error: error.message
//     });
//   }
// });

// /* -----------------------------------------------------------------
//    IMPLEMENTED INDUSTRY 4.0 CALCULATION FUNCTIONS
// -----------------------------------------------------------------*/

// async function calculateIndustry4Metrics(uid, stationTests, lifecycle, reworkHistory) {
//   // 1. Test Equipment Utilization
//   try {
//     const equipmentUtilization = {
//       overall_utilization: await calculateOverallUtilization(stationTests),
//       station_utilization: await calculateStationUtilization(stationTests),
//       bottleneck_analysis: findBottleneckStations(stationTests),
//       equipment_availability: await calculateEquipmentAvailability(stationTests)
//     };

//     // 2. Quality Assurance Processes
//     const qualityMetrics = {
//       first_pass_yield: calculateFirstPassYield(stationTests),
//       process_stability: analyzeProcessStability(stationTests),
//       defect_density: calculateDefectDensity(stationTests, reworkHistory),
//       quality_score: calculateOverallQualityScore(stationTests)
//     };

//     // 3. Predictive Maintenance Needs
//     const predictiveMaintenance = {
//       equipment_health: calculateEquipmentHealth(stationTests),
//       maintenance_priority: assessMaintenancePriority(stationTests),
//       risk_assessment: performRiskAssessment(stationTests)
//     };

//     // 4. Energy Monitoring Requirements
//     const energyMonitoring = {
//       energy_efficiency: calculateEnergyEfficiency(stationTests, lifecycle),
//       sustainability_score: calculateSustainabilityScore(stationTests),
//       carbon_impact: calculateCarbonImpact(stationTests)
//     };

//     // 5. Data Analytics Capabilities
//     const dataAnalytics = {
//       data_quality_score: assessDataQuality(stationTests),
//       analytics_readiness: assessAnalyticsReadiness(stationTests),
//       insights_generated: generateBasicInsights(stationTests, reworkHistory)
//     };

//     // 6. MECHANICAL MEASUREMENT DATA ONLY
//     const measurementData = {
//       mechanical_tests: await getMechanicalMeasurements(uid)
//     };

//     return {
//       equipment_utilization: equipmentUtilization,
//       quality_assurance: qualityMetrics,
//       predictive_maintenance: predictiveMaintenance,
//       energy_monitoring: energyMonitoring,
//       data_analytics: dataAnalytics,
//       measurement_data: measurementData
//     };
//   } catch (error) {
//     console.error('Industry 4.0 metrics error:', error);
//     return { error: 'Metrics calculation failed' };
//   }
// }

// /* -----------------------------------------------------------------
//    IMPLEMENTED HELPER FUNCTIONS
// -----------------------------------------------------------------*/

// // Equipment Utilization Functions
// async function calculateOverallUtilization(stationTests) {
//   const totalStations = stationTests.length;
//   const utilizedStations = stationTests.filter(station => station.teststatus).length;
//   return totalStations > 0 ? `${((utilizedStations / totalStations) * 100).toFixed(1)}%` : "0%";
// }

// async function calculateStationUtilization(stationTests) {
//   const utilization = {};
//   stationTests.forEach(station => {
//     // Simple utilization based on test completion
//     utilization[station.equipmentname] = station.teststatus ? "95%" : "5%";
//   });
//   return utilization;
// }

// async function calculateEquipmentAvailability(stationTests) {
//   const availability = {};
//   stationTests.forEach(station => {
//     // Assume equipment is available if it has test data
//     availability[station.equipmentname] = station.teststatus ? "98%" : "90%";
//   });
//   return availability;
// }

// function findBottleneckStations(stationTests) {
//   const bottlenecks = stationTests
//     .filter(station => station.teststatus === 'FAIL' || station.reworkcount > 0)
//     .map(station => ({
//       station: station.equipmentname,
//       issue: station.teststatus === 'FAIL' ? 'Test Failure' : 'Rework Required',
//       sequence: station.equipmentsequence
//     }));

//   return {
//     bottleneck_stations: bottlenecks,
//     severity: bottlenecks.length > 2 ? "HIGH" : bottlenecks.length > 0 ? "MEDIUM" : "LOW",
//     recommendation: bottlenecks.length > 0 ?
//       `Focus on stations: ${bottlenecks.map(b => b.station).join(', ')}` :
//       "No significant bottlenecks"
//   };
// }

// // Quality Assurance Functions
// function calculateFirstPassYield(stationTests) {
//   const totalTests = stationTests.length;
//   const passedFirstTime = stationTests.filter(s => s.teststatus === 'PASS' && s.reworkcount === 0).length;
//   return totalTests > 0 ? ((passedFirstTime / totalTests) * 100).toFixed(1) : 0;
// }

// function calculateStationYield(stationTests) {
//   const yieldByStation = {};
//   stationTests.forEach(station => {
//     if (!yieldByStation[station.equipmentname]) {
//       yieldByStation[station.equipmentname] = { passed: 0, total: 0 };
//     }
//     yieldByStation[station.equipmentname].total++;
//     if (station.teststatus === 'PASS') {
//       yieldByStation[station.equipmentname].passed++;
//     }
//   });

//   const result = {};
//   Object.keys(yieldByStation).forEach(station => {
//     const data = yieldByStation[station];
//     result[station] = data.total > 0 ? ((data.passed / data.total) * 100).toFixed(1) : 0;
//   });
//   return result;
// }

// function analyzeProcessStability(stationTests) {
//   const failCount = stationTests.filter(s => s.teststatus === 'FAIL').length;
//   const totalTests = stationTests.length;
//   const stability = totalTests > 0 ? ((totalTests - failCount) / totalTests * 100).toFixed(1) : 100;
//   return {
//     stability_score: `${stability}%`,
//     status: stability >= 95 ? "STABLE" : stability >= 85 ? "MODERATE" : "UNSTABLE",
//     variation: failCount > 0 ? "High variation detected" : "Low variation"
//   };
// }

// function calculateDefectDensity(stationTests, reworkHistory) {
//   const totalOpportunities = stationTests.length;
//   const totalDefects = stationTests.filter(s => s.teststatus === 'FAIL').length + reworkHistory.length;
//   return totalOpportunities > 0 ? (totalDefects / totalOpportunities).toFixed(4) : 0;
// }

// function calculateOverallQualityScore(stationTests) {
//   const fpy = calculateFirstPassYield(stationTests);
//   const stability = analyzeProcessStability(stationTests);
//   return Math.min(100, (parseFloat(fpy) + parseFloat(stability.stability_score)) / 2).toFixed(1);
// }

// // Predictive Maintenance Functions
// function calculateEquipmentHealth(stationTests) {
//   const failCount = stationTests.filter(s => s.teststatus === 'FAIL').length;
//   const totalTests = stationTests.length;
//   const healthScore = totalTests > 0 ? (100 - (failCount / totalTests * 25)) : 100;
//   return Math.max(0, healthScore).toFixed(1);
// }

// function assessMaintenancePriority(stationTests) {
//   const healthScore = calculateEquipmentHealth(stationTests);
//   let priority = "LOW";
//   if (healthScore < 70) priority = "HIGH";
//   else if (healthScore < 85) priority = "MEDIUM";

//   return {
//     priority: priority,
//     health_score: `${healthScore}%`,
//     recommended_action: priority === "HIGH" ? "Schedule immediate maintenance" :
//                        priority === "MEDIUM" ? "Plan maintenance within 2 weeks" :
//                        "Routine monitoring sufficient"
//   };
// }

// function performRiskAssessment(stationTests) {
//   const criticalStations = stationTests.filter(s =>
//     s.teststatus === 'FAIL' && s.equipmentsequence <= 3
//   );

//   return {
//     risk_level: criticalStations.length > 0 ? "MEDIUM" : "LOW",
//     critical_issues: criticalStations.length,
//     impact: criticalStations.length > 0 ? "Production line at risk" : "Minimal impact"
//   };
// }

// // Energy Monitoring Functions
// function calculateEnergyEfficiency(stationTests, lifecycle) {
//   const cycleTime = parseFloat(lifecycle.cycletime) || 60;
//   const idealCycleTime = 45; // Your target cycle time
//   const efficiency = Math.min(100, (cycleTime / idealCycleTime) * 100);
//   return {
//     efficiency_score: `${efficiency.toFixed(1)}%`,
//     energy_savings: efficiency > 90 ? "Optimal" : efficiency > 80 ? "Good" : "Needs improvement",
//     cycle_time_ratio: (cycleTime / idealCycleTime).toFixed(2)
//   };
// }

// function calculateSustainabilityScore(stationTests) {
//   const passedTests = stationTests.filter(s => s.teststatus === 'PASS').length;
//   const totalTests = stationTests.length;
//   const yieldRate = totalTests > 0 ? (passedTests / totalTests) : 0;
//   return Math.min(100, yieldRate * 100 + 20).toFixed(1);
// }

// function calculateCarbonImpact(stationTests) {
//   const totalTests = stationTests.length;
//   const estimatedCO2 = totalTests * 0.85;
//   return {
//     estimated_co2_kg: estimatedCO2.toFixed(2),
//     carbon_intensity: "Low",
//     offset_recommendation: "Within acceptable limits"
//   };
// }

// // Data Analytics Functions
// function assessDataQuality(stationTests) {
//   const stationsWithData = stationTests.filter(s => s.teststatus && s.value).length;
//   const totalStations = stationTests.length;
//   const qualityScore = totalStations > 0 ? (stationsWithData / totalStations * 100) : 0;
//   return {
//     score: `${qualityScore.toFixed(1)}%`,
//     completeness: qualityScore > 90 ? "EXCELLENT" : qualityScore > 75 ? "GOOD" : "NEEDS IMPROVEMENT",
//     missing_data: totalStations - stationsWithData
//   };
// }

// function assessAnalyticsReadiness(stationTests) {
//   const hasTestData = stationTests.length > 0;
//   const hasMultipleStations = stationTests.length > 1;
//   const hasQualityData = stationTests.filter(s => s.teststatus && s.value).length > 0;

//   let readiness = "LOW";
//   if (hasTestData && hasMultipleStations && hasQualityData) readiness = "HIGH";
//   else if (hasTestData && hasMultipleStations) readiness = "MEDIUM";

//   return {
//     readiness_level: readiness,
//     capabilities: {
//       predictive_analytics: readiness === "HIGH",
//       trend_analysis: readiness !== "LOW",
//       real_time_monitoring: true
//     }
//   };
// }

// function generateBasicInsights(stationTests, reworkHistory) {
//   const insights = [];

//   // Insight 1: First Pass Yield
//   const fpy = calculateFirstPassYield(stationTests);
//   if (fpy < 90) {
//     insights.push({
//       type: "QUALITY",
//       message: `First Pass Yield (${fpy}%) below optimal target of 90%`,
//       impact: "Increased rework costs",
//       suggestion: "Review test parameters at failing stations"
//     });
//   }

//   // Insight 2: Bottleneck detection
//   const bottlenecks = findBottleneckStations(stationTests);
//   if (bottlenecks.severity !== "LOW") {
//     insights.push({
//       type: "EFFICIENCY",
//       message: `Bottlenecks detected at ${bottlenecks.bottleneck_stations.map(b => b.station).join(', ')}`,
//       impact: "Reduced throughput",
//       suggestion: "Optimize station sequences and parameters"
//     });
//   }

//   // Insight 3: Maintenance needs
//   const maintenance = assessMaintenancePriority(stationTests);
//   if (maintenance.priority === "HIGH") {
//     insights.push({
//       type: "MAINTENANCE",
//       message: `Equipment health score (${maintenance.health_score}) indicates maintenance needed`,
//       impact: "Risk of unplanned downtime",
//       suggestion: maintenance.recommended_action
//     });
//   }

//   return insights.length > 0 ? insights : [{
//     type: "POSITIVE",
//     message: "All systems operating within optimal parameters",
//     impact: "High efficiency and quality",
//     suggestion: "Continue current operations"
//   }];
// }

// // Basic Helper Functions
// function getCurrentStation(stationTests) {
//   if (stationTests.length === 0) return null;

//   const lastTest = stationTests[stationTests.length - 1];
//   const allPassed = stationTests.every(s => s.teststatus === 'PASS');

//   return {
//     station: lastTest.equipmentname,
//     sequence: lastTest.equipmentsequence,
//     status: lastTest.teststatus,
//     is_final: allPassed,
//     progress: `${stationTests.filter(s => s.teststatus === 'PASS').length}/${stationTests.length}`
//   };
// }

// function estimateEOLCompletion(stationTests, lifecycle) {
//   if (lifecycle.productionenddate) {
//     return {
//       status: "COMPLETED",
//       completion_time: lifecycle.productionenddate,
//       total_duration: "Available in production data"
//     };
//   }

//   const completedStations = stationTests.filter(s => s.teststatus === 'PASS').length;
//   const totalStations = stationTests.length;
//   const progress = totalStations > 0 ? (completedStations / totalStations * 100) : 0;

//   return {
//     status: "IN_PROGRESS",
//     progress_percentage: `${progress.toFixed(1)}%`,
//     completed_stations: completedStations,
//     total_stations: totalStations,
//     estimated_remaining: `${totalStations - completedStations} stations remaining`
//   };
// }

// function generateRecommendations(metrics, stationTests, reworkHistory) {
//   const recommendations = [];

//   // Equipment recommendations
//   if (metrics.equipment_utilization.bottleneck_analysis.severity === "HIGH") {
//     recommendations.push({
//       category: "EQUIPMENT_OPTIMIZATION",
//       priority: "HIGH",
//       title: "Address Production Bottlenecks",
//       description: `Optimize stations: ${metrics.equipment_utilization.bottleneck_analysis.bottleneck_stations.map(b => b.station).join(', ')}`,
//       action: "Review station parameters and sequences"
//     });
//   }

//   // Quality recommendations
//   const fpy = calculateFirstPassYield(stationTests);
//   if (fpy < 95) {
//     recommendations.push({
//       category: "QUALITY_IMPROVEMENT",
//       priority: "MEDIUM",
//       title: "Improve First Pass Yield",
//       description: `Current FPY: ${fpy}% (Target: 95%)`,
//       action: "Analyze root causes of test failures"
//     });
//   }

//   // Maintenance recommendations
//   if (metrics.predictive_maintenance.maintenance_priority.priority === "HIGH") {
//     recommendations.push({
//       category: "MAINTENANCE",
//       priority: "HIGH",
//       title: "Schedule Preventive Maintenance",
//       description: `Equipment health: ${metrics.predictive_maintenance.equipment_health}%`,
//       action: "Plan maintenance within 48 hours"
//     });
//   }

//   // Energy recommendations
//   if (metrics.energy_monitoring.energy_efficiency.efficiency_score < "85%") {
//     recommendations.push({
//       category: "ENERGY_OPTIMIZATION",
//       priority: "MEDIUM",
//       title: "Improve Energy Efficiency",
//       description: `Current efficiency: ${metrics.energy_monitoring.energy_efficiency.efficiency_score}`,
//       action: "Review equipment power consumption"
//     });
//   }

//   return recommendations.length > 0 ? recommendations : [{
//     category: "OPERATIONS",
//     priority: "LOW",
//     title: "Continue Current Operations",
//     description: "All systems operating within acceptable parameters",
//     action: "Monitor performance and maintain current standards"
//   }];
// }

// /* -----------------------------------------------------------------
//    MECHANICAL MEASUREMENT DATA FUNCTION
// -----------------------------------------------------------------*/

// async function getMechanicalMeasurements(uid) {
//   // In real implementation, you would query your measurement database
//   // For now, returning realistic mechanical measurement data
//   return {
//     cover_screw_torque: {
//       value: 12.5,
//       unit: 'Nm',
//       tolerance: '±0.5',
//       status: 'PASS',
//       specification: '12.0-13.0 Nm'
//     },
//     main_bolt_torque: {
//       value: 45.2,
//       unit: 'Nm',
//       tolerance: '±1.0',
//       status: 'PASS',
//       specification: '44.0-46.0 Nm'
//     },
//     bracket_torque: {
//       value: 25.8,
//       unit: 'Nm',
//       tolerance: '±0.8',
//       status: 'PASS',
//       specification: '25.0-26.5 Nm'
//     },
//     connector_force: {
//       value: 35.6,
//       unit: 'N',
//       tolerance: '±2.0',
//       status: 'PASS',
//       specification: '33.0-38.0 N'
//     },
//     assembly_pressure: {
//       value: 8.3,
//       unit: 'bar',
//       tolerance: '±0.3',
//       status: 'PASS',
//       specification: '8.0-8.5 bar'
//     }
//   };
// }

// // Additional endpoints
// router.get("/find-uids", async (req, res) => {
//   try {
//     const productionUids = await runQuery(
//       `SELECT uid, productid, productmodelname FROM public.productionlifecycle LIMIT 10`
//     );

//     const testUids = await runQuery(
//       `SELECT uid, teststatus FROM public.producteolresults LIMIT 10`
//     );

//     res.json({
//       success: true,
//       production_uids: productionUids,
//       test_uids: testUids,
//       message: "Sample UIDs from database"
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// module.exports = router;

/**
 * analysis.js - FINAL CLEAN VERSION
 * Matches Analytics 4.0 UI EXACTLY as per requirement
 * No Industry 4.0 heavy calculations
 * No recommendations
 * No predictive maintenance
 * No insights
 * Only the fields your UI needs
 */

// const express = require("express");
// const { Pool } = require("pg");

// const router = express.Router();

// /* -----------------------------------------
//    DATABASE CONNECTION
// ------------------------------------------ */
// const pool = new Pool({
//   host: process.env.PG_HOST || "localhost",
//   port: process.env.PG_PORT || 5432,
//   user: process.env.PG_USER || "your_username",
//   password: process.env.PG_PASSWORD || "your_password",
//   database: process.env.PG_DATABASE || "your_database",
// });

// async function runQuery(sql, params = []) {
//   try {
//     const result = await pool.query(sql, params);
//     return result.rows;
//   } catch (err) {
//     console.error("DB Error:", err.message);
//     throw err;
//   }
// }

// /* -----------------------------------------
//    MAIN ANALYSIS ENDPOINT
// ------------------------------------------ */

// router.get("/analysis", async (req, res) => {
//   const { uid } = req.query;

//   if (!uid) {
//     return res.status(400).json({ success: false, message: "UID parameter missing" });
//   }

//   try {
//     console.log("[ANALYSIS] Start:", uid);

//     /* ---------------------------------------------------------
//        1️⃣ BASIC PRODUCT INFO (MODEL, VARIANT)
//     ---------------------------------------------------------- */
//     const productRow = await runQuery(
//       `SELECT productid, productmodelname, productvariant, shift,
//               productionstartdate, productionenddate, productstatus, productionremarks
//        FROM productionlifecycle
//        WHERE uid = $1
//        ORDER BY productionstartdate ASC
//        LIMIT 1`,
//       [uid]
//     );

//     if (productRow.length === 0) {
//       return res.status(404).json({ success: false, message: "UID not found" });
//     }

//     const product = productRow[0];

//     /* ---------------------------------------------------------
//        2️⃣ STATION TESTS (PASS/FAIL/REWORK)
//     ---------------------------------------------------------- */
//     // const stationTests = await runQuery(
//     //   `SELECT
//     //       equipmentid AS station_name,
//     //       productstatus
//     //   FROM productionlifecycle
//     //   WHERE uid = $1
//     //   ORDER BY productionstartdate ASC`,
//     //   [uid]
//     // );

//     // const stationTests = await runQuery(
//     //     `SELECT DISTINCT ON (pl.equipmentid)
//     //         pl.equipmentid,
//     //         eq.equipmentname,
//     //         pl.productstatus
//     //     FROM productionlifecycle pl
//     //     LEFT JOIN equipments eq
//     //           ON pl.equipmentid = eq.equipmentid
//     //     WHERE pl.uid = $1
//     //     ORDER BY pl.equipmentid, pl.productionstartdate DESC`,
//     //     [uid]
//     // );

//           /* ---------------------------------------------------------
//       2️⃣ STATION TESTS (PASS/FAIL/REWORK) - IN PRODUCTION FLOW ORDER
//     ---------------------------------------------------------- */
//       // const stationTests = await runQuery(
//       //   `SELECT DISTINCT
//       //       pl.equipmentid,
//       //       eq.equipmentname,
//       //       pl.productstatus,
//       //       pl.productionstartdate,
//       //       pl.productionenddate
//       //   FROM productionlifecycle pl
//       //   LEFT JOIN equipments eq ON pl.equipmentid = eq.equipmentid
//       //   WHERE pl.uid = $1
//       //   ORDER BY pl.productionenddate ASC`,
//       //   [uid]
//       // );

//             /* ---------------------------------------------------------
//         2️⃣ STATION TESTS - UNIQUE EQUIPMENT IN FLOW ORDER
//       ---------------------------------------------------------- */
//       // const stationTests = await runQuery(
//       //   `SELECT DISTINCT ON (pl.equipmentid)
//       //       pl.equipmentid,
//       //       eq.equipmentname,
//       //       pl.productstatus,
//       //       pl.productionenddate
//       //   FROM productionlifecycle pl
//       //   LEFT JOIN equipments eq ON pl.equipmentid = eq.equipmentid
//       //   WHERE pl.uid = $1
//       //   ORDER BY pl.equipmentid, pl.productionenddate ASC`,
//       //   [uid]
//       // );

//           const stationTests = await runQuery(
//       `SELECT DISTINCT ON (equipmentid, productstatus, productionstartdate, productionenddate)
//           pl.equipmentid,
//           eq.equipmentname,
//           pl.productstatus,
//           pl.productionstartdate,
//           pl.productionenddate
//       FROM productionlifecycle pl
//       LEFT JOIN equipments eq ON pl.equipmentid = eq.equipmentid
//       WHERE pl.uid = $1
//       ORDER BY pl.productionenddate ASC`,  // ← CHANGED TO chronological order
//       [uid]
//     );

//     /* ---------------------------------------------------------
//        3️⃣ NUMBER OF CYCLES
//     ---------------------------------------------------------- */
//     const cycles = await runQuery(
//       `SELECT COUNT(*)::int AS count
//        FROM productionlifecycle
//        WHERE uid = $1`,
//       [uid]
//     );
//     const number_of_cycles = cycles[0].count;

//     /* ---------------------------------------------------------
//        4️⃣ NUMBER OF EQUIPMENTS
//     ---------------------------------------------------------- */
//     // const equipments = await runQuery(
//     //   `SELECT COUNT(DISTINCT equipmentid)::int AS count
//     //    FROM productionlifecycle
//     //    WHERE uid = $1`,
//     //   [uid]
//     // );
//     // const number_of_equipments = equipments[0].count;

//     const stationVisits = await runQuery(
//       `SELECT COUNT(*)::int AS count
//       FROM productionlifecycle
//       WHERE uid = $1`,
//       [uid]
//     );
//     const number_of_equipments = stationVisits[0].count; // ← KEEP ORIGINAL NAME

//     /* ---------------------------------------------------------
//        5️⃣ CYCLE TIME IN MINUTES (END-TO-END)
//     ---------------------------------------------------------- */
//     const cycleTimeQuery = await runQuery(
//       `SELECT ROUND(
//           EXTRACT(EPOCH FROM (MAX(productionenddate) - MIN(productionstartdate))) / 60.0,
//           2
//         ) AS cycle_time_minutes
//        FROM productionlifecycle
//        WHERE uid = $1`,
//       [uid]
//     );
//     const cycle_time_minutes = Number(cycleTimeQuery[0].cycle_time_minutes) || 0;

//     /* ---------------------------------------------------------
//        6️⃣ QUALITY SUMMARY (PASS % / FAIL %)
//     ---------------------------------------------------------- */
//     const passFail = await runQuery(
//       `SELECT
//           SUM(CASE WHEN productstatus = 'PASS' THEN 1 ELSE 0 END)::int AS pass,
//           SUM(CASE WHEN productstatus = 'FAIL' THEN 1 ELSE 0 END)::int AS fail
//        FROM productionlifecycle
//        WHERE uid = $1`,
//       [uid]
//     );

//     const pass_count = passFail[0].pass;
//     const fail_count = passFail[0].fail;
//     const total_pf = pass_count + fail_count;

//     const pass_percent = total_pf > 0 ? Number(((pass_count / total_pf) * 100).toFixed(2)) : 0;
//     const fail_percent = total_pf > 0 ? Number(((fail_count / total_pf) * 100).toFixed(2)) : 0;

//     /* ---------------------------------------------------------
//        7️⃣ PRODUCTION FLOW LIST
//        (Station name + PASS/FAIL/REWORK)
//     ---------------------------------------------------------- */
//     // const station_flow = stationTests.map(row => ({
//     //   // station_name: row.equipmentname,
//     //   station_name: row.equipmentname || row.equipmentid,
//     //   status: row.productstatus
//     // }));

//         /* ---------------------------------------------------------
//       7️⃣ PRODUCTION FLOW LIST (in chronological order)
//     ---------------------------------------------------------- */
//     const station_flow = stationTests.map(row => ({
//       station_name: row.equipmentname || row.equipmentid,
//       status: row.productstatus
//     }));

//     /* ---------------------------------------------------------
//        8️⃣ MEASUREMENT DATA
//        Only PASS stations, even if empty
//     ---------------------------------------------------------- */
//     const measurement_data = stationTests
//       .filter(row => row.productstatus === "PASS")
//       .map(row => ({
//         // station: row.equipmentname,
//         station: row.equipmentname || row.equipmentid,
//         status: "PASS",
//         measurements: [] // No measurement columns in DB
//       }));

//     /* ---------------------------------------------------------
//        FINAL RESPONSE (EXACTLY WHAT UI NEEDS)
//     ---------------------------------------------------------- */
//     const response = {
//       success: true,
//       uid,

//       product_info: {
//         product_id: product.productid,
//         model: product.productmodelname,
//         variant: product.productvariant,
//         shift: product.shift,
//         production_start: product.productionstartdate,
//         production_end: product.productionenddate,
//         status: product.productstatus,
//         remarks: product.productionremarks
//       },

//       cycle_time_minutes,
//       number_of_cycles,
//       number_of_equipments,

//       quality_summary: {
//         pass_percent,
//         fail_percent,
//         pass_count,
//         fail_count
//       },

//       station_flow,
//       measurement_data
//     };

//     console.log("[ANALYSIS] Completed:", uid);
//     return res.status(200).json(response);

//   } catch (err) {
//     console.error("[ANALYSIS ERROR]:", err.message);
//     return res.status(500).json({
//       success: false,
//       message: "Server error in analysis",
//       error: err.message
//     });
//   }
// });

// /* -----------------------------------------
//    TESTING ENDPOINT (OPTIONAL)
// ------------------------------------------ */
// router.get("/find-uids", async (req, res) => {
//   try {
//     const uids = await runQuery(
//       `SELECT uid, productid, productmodelname
//        FROM public.productionlifecycle
//        ORDER BY productionstartdate DESC
//        LIMIT 20`
//     );
//     res.json({ success: true, production_uids: uids });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// module.exports = router;



/**
 * analysis.js - FINAL CLEAN VERSION
 * Matches Analytics 4.0 UI EXACTLY as per requirement
 * No Industry 4.0 heavy calculations
 * No recommendations
 * No predictive maintenance
 * No insights
 * Only the fields your UI needs
 */

const express = require("express");
const { Pool } = require("pg");

const router = express.Router();

/* -----------------------------------------
   DATABASE CONNECTION
------------------------------------------ */
const pool = new Pool({
  host: process.env.PG_HOST || "localhost",
  port: process.env.PG_PORT || 5432,
  user: process.env.PG_USER || "your_username",
  password: process.env.PG_PASSWORD || "your_password",
  database: process.env.PG_DATABASE || "your_database",
});

async function runQuery(sql, params = []) {
  try {
    const result = await pool.query(sql, params);
    return result.rows;
  } catch (err) {
    console.error("DB Error:", err.message);
    throw err;
  }
}

/* -----------------------------------------
   MAIN ANALYSIS ENDPOINT
------------------------------------------ */

router.get("/analysis", async (req, res) => {
  const { uid } = req.query;

  if (!uid) {
    return res
      .status(400)
      .json({ success: false, message: "UID parameter missing" });
  }

  try {
    console.log("[ANALYSIS] Start:", uid);

    /* ---------------------------------------------------------
       1️⃣ BASIC PRODUCT INFO (MODEL, VARIANT)
    ---------------------------------------------------------- */
    const productRow = await runQuery(
      `SELECT productid, productmodelname, productvariant, shift,
              productionstartdate, productionenddate, productstatus, productionremarks
       FROM productionlifecycle
       WHERE uid = $1
       ORDER BY productionstartdate ASC
       LIMIT 1`,
      [uid]
    );

    if (productRow.length === 0) {
      return res.status(404).json({ success: false, message: "UID not found" });
    }

    const product = productRow[0];

    /* ---------------------------------------------------------
       2️⃣ STATION TESTS - ALL VISITS IN CHRONOLOGICAL ORDER
    ---------------------------------------------------------- */
    const stationTests = await runQuery(
      `SELECT DISTINCT ON (equipmentid, productstatus, productionstartdate, productionenddate)
          pl.equipmentid,
          eq.equipmentname,
          pl.productstatus,
          pl.productionstartdate,
          pl.productionenddate
      FROM productionlifecycle pl
      LEFT JOIN equipments eq ON pl.equipmentid = eq.equipmentid
      WHERE pl.uid = $1
      ORDER BY pl.productionenddate ASC`,
      [uid]
    );

    /* ---------------------------------------------------------
       2.1️⃣ MEASUREMENT DATA FOR STATIONS
    ---------------------------------------------------------- */
    const measurementData = await runQuery(
      `SELECT 
          equipmentid,
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'testid', testid,
              'lsl', lsl,
              'hsl', hsl,
              'value', value,
              'unit', unit,
              'teststatus', teststatus
            ) ORDER BY testid
          ) as measurements
       FROM producteolresults 
       WHERE uid = $1
       GROUP BY equipmentid`,
      [uid]
    );

    // Create a map for easy lookup
    const measurementsMap = {};
    measurementData.forEach((row) => {
      measurementsMap[row.equipmentid] = row.measurements;
    });

    /* ---------------------------------------------------------
       3️⃣ NUMBER OF CYCLES
    ---------------------------------------------------------- */
    // const cycles = await runQuery(
    //   `SELECT COUNT(*)::int AS count
    //    FROM productionlifecycle
    //    WHERE uid = $1`,
    //   [uid]
    // );
    // const number_of_cycles = cycles[0].count;

    /* ---------------------------------------------------------
    3️⃣ NUMBER OF CYCLES (1 initial + number of FAILs)
---------------------------------------------------------- */

    const failRows = await runQuery(
      `SELECT COUNT(*) AS fail_count
   FROM productionlifecycle
   WHERE uid = $1 AND productstatus = 'FAIL'`,
      [uid]
    );

    // Prevent naming conflict with quality summary fail_count
    const fail_cycle_count =
      failRows.length > 0 ? Number(failRows[0].fail_count) : 0;

    // Cycles = 1 initial attempt + number of FAILs
    const number_of_cycles = 1 + fail_cycle_count;

    /* ---------------------------------------------------------
       4️⃣ NUMBER OF EQUIPMENTS
    ---------------------------------------------------------- */
    const stationVisits = await runQuery(
      `SELECT COUNT(*)::int AS count
      FROM productionlifecycle
      WHERE uid = $1`,
      [uid]
    );
    const number_of_equipments = stationVisits[0].count;

    /* ---------------------------------------------------------
       5️⃣ CYCLE TIME IN MINUTES (END-TO-END)
    ---------------------------------------------------------- */
    const cycleTimeQuery = await runQuery(
      `SELECT ROUND(
          EXTRACT(EPOCH FROM (MAX(productionenddate) - MIN(productionstartdate))) / 60.0,
          2
        ) AS cycle_time_minutes
       FROM productionlifecycle
       WHERE uid = $1`,
      [uid]
    );
    const cycle_time_minutes =
      Number(cycleTimeQuery[0].cycle_time_minutes) || 0;

    /* ---------------------------------------------------------
       6️⃣ QUALITY SUMMARY (PASS % / FAIL %)
    ---------------------------------------------------------- */
    const passFail = await runQuery(
      `SELECT
          SUM(CASE WHEN productstatus = 'PASS' THEN 1 ELSE 0 END)::int AS pass,
          SUM(CASE WHEN productstatus = 'FAIL' THEN 1 ELSE 0 END)::int AS fail
       FROM productionlifecycle
       WHERE uid = $1`,
      [uid]
    );

    const pass_count = passFail[0].pass;
    const fail_count = passFail[0].fail;
    const total_pf = pass_count + fail_count;

    const pass_percent =
      total_pf > 0 ? Number(((pass_count / total_pf) * 100).toFixed(2)) : 0;
    const fail_percent =
      total_pf > 0 ? Number(((fail_count / total_pf) * 100).toFixed(2)) : 0;

    /* ---------------------------------------------------------
       7️⃣ PRODUCTION FLOW LIST (in chronological order)
    ---------------------------------------------------------- */
    const station_flow = stationTests.map((row) => ({
      station_name: row.equipmentname || row.equipmentid,
      status: row.productstatus,
    }));

    /* ---------------------------------------------------------
   8️⃣ MEASUREMENT DATA - PASS + FAIL STATIONS
---------------------------------------------------------- */
    const measurement_data = stationTests.map((row) => ({
      station: row.equipmentname || row.equipmentid,
      status: row.productstatus, // PASS / FAIL / REWORK
      measurements: measurementsMap[row.equipmentid] || [],
    }));

    /* ---------------------------------------------------------
       FINAL RESPONSE (EXACTLY WHAT UI NEEDS)
    ---------------------------------------------------------- */
    const response = {
      success: true,
      uid,

      product_info: {
        product_id: product.productid,
        model: product.productmodelname,
        variant: product.productvariant,
        shift: product.shift,
        production_start: product.productionstartdate,
        production_end: product.productionenddate,
        status: product.productstatus,
        remarks: product.productionremarks,
      },

      cycle_time_minutes,
      number_of_cycles,
      number_of_equipments,

      quality_summary: {
        pass_percent,
        fail_percent,
        pass_count,
        fail_count,
      },

      station_flow,
      measurement_data,
    };

    console.log("[ANALYSIS] Completed:", uid);
    return res.status(200).json(response);
  } catch (err) {
    console.error("[ANALYSIS ERROR]:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error in analysis",
      error: err.message,
    });
  }
});

/* -----------------------------------------
   TESTING ENDPOINT (OPTIONAL)
------------------------------------------ */
router.get("/find-uids", async (req, res) => {
  try {
    const uids = await runQuery(
      `SELECT uid, productid, productmodelname
       FROM public.productionlifecycle
       ORDER BY productionstartdate DESC
       LIMIT 20`
    );
    res.json({ success: true, production_uids: uids });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
