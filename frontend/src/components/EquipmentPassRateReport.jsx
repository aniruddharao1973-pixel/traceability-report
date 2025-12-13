// // src/components/EquipmentPassRateReport.jsx
// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import SummaryCardEquipment from "./SummaryCardEquipment";
// import { EquipmentTable } from "./EquipmentTable";
// import facteyes from '../public/micrologic_image.png';

// const API_BASE = "http://localhost:4000";

// export default function EquipmentPassRateReport({
//   embedded = false,
//   uidFromParent = "",
//   includeDateInReport = false,
//   userSelectedFromDate = '',
//   userSelectedToDate = '',
//   userSelectedFromTime = '00:00:00',
//   userSelectedToTime = '23:59:59'
// }) {
//   const [searchParams] = useSearchParams();
//   const uidFromUrl = searchParams.get("uid");
//   const [uid, setUid] = useState(uidFromParent || uidFromUrl || "");
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // ✅ Debug date parameters
//   useEffect(() => {
//     console.log('📅 Equipment Date Parameters Received:', {
//       includeDateInReport,
//       userSelectedFromDate,
//       userSelectedToDate,
//       userSelectedFromTime,
//       userSelectedToTime
//     });
//   }, [includeDateInReport, userSelectedFromDate, userSelectedToDate, userSelectedFromTime, userSelectedToTime]);

//   // 🔁 Update UID when parent or URL param changes
//   useEffect(() => {
//     const latestUid = uidFromParent || uidFromUrl || "";
//     if (latestUid && latestUid !== uid) setUid(latestUid);
//   }, [uidFromParent, uidFromUrl]);

//   // ✅ Determine which dates to display for equipment report
//   const getDisplayDates = () => {
//     // ✅ READ FROM URL PARAMETERS DIRECTLY
//     const urlIncludeDate = searchParams.get('includeDateInReport');
//     const urlFromDate = searchParams.get('userSelectedFromDate');
//     const urlToDate = searchParams.get('userSelectedToDate');
//     const urlFromTime = searchParams.get('userSelectedFromTime') || '00:00:00';
//     const urlToTime = searchParams.get('userSelectedToTime') || '23:59:59';
    
//     const shouldUseUserDates = urlIncludeDate === 'true' && urlFromDate && urlToDate;
    
//     console.log('🔍📋 EQUIPMENT DATE SCENARIO CHECK:', {
//       urlIncludeDate,
//       urlFromDate,
//       urlToDate, 
//       urlFromTime,
//       urlToTime,
//       shouldUseUserDates
//     });
    
//     // Scenario 1: User clicked "Include Date in Report" AND selected dates (from URL)
//     if (shouldUseUserDates) {
//       console.log('🎯📅 EQUIPMENT: USING SCENARIO 1: USER-SELECTED dates and times FROM URL');
//       return {
//         displayFrom: urlFromDate,
//         displayTo: urlToDate,
//         displayFromTime: urlFromTime,
//         displayToTime: urlToTime
//       };
//     } 
//     // Scenario 2: No date filter (get all data)
//     else {
//       console.log('🎯📅 EQUIPMENT: USING SCENARIO 2: NO DATE FILTER (All Data)');
//       return {
//         displayFrom: null, // No date filtering
//         displayTo: null,
//         displayFromTime: '00:00:00',
//         displayToTime: '23:59:59'
//       };
//     }
//   };

//   // ✅ Fetch equipment pass rate data
//   useEffect(() => {
//     if (!uid) return;
//     setLoading(true);

//     // 🧩 Hide UID query from browser address bar
//     if (window.history && window.history.replaceState) {
//       window.history.replaceState({}, document.title, window.location.pathname);
//     }

//     // Build API URL based on date scenario
//     const displayDates = getDisplayDates();
//     let url = `${API_BASE}/api/trace/equipment-pass-rate/equipment-pass-rate?uid=${encodeURIComponent(uid)}`;

//     // Scene A: With date/time filter
//     if (displayDates.displayFrom && displayDates.displayTo) {
//       url += `&fromDate=${displayDates.displayFrom}&toDate=${displayDates.displayTo}&fromTime=${displayDates.displayFromTime}&toTime=${displayDates.displayToTime}`;
//       console.log('🎯 EQUIPMENT: Scene A - With Date Filter');
//     } 
//     // Scene B: Without date/time filter
//     else {
//       console.log('🎯 EQUIPMENT: Scene B - No Date Filter (All Data)');
//     }

//     console.log("[EquipmentPassRateReport] Fetching:", url);

//     fetch(url)
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         return res.json();
//       })
//       .then((data) => {
//         console.log("[EquipmentPassRateReport] fetched data:", data);
//         setReportData(Array.isArray(data) ? data : []);
//       })
//       .catch((err) => {
//         console.error("❌ Failed to load equipment pass rate report:", err);
//         setReportData([]);
//       })
//       .finally(() => setLoading(false));
//   }, [uid]);

//   // ✅ Date formatting function
//   const formatDateTime = (dateString) => {
//     if (!dateString) return "—";
//     try {
//       const date = dateString instanceof Date ? dateString : new Date(dateString);
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const year = date.getFullYear();
      
//       if (isNaN(date.getTime())) {
//         return "—";
//       }
      
//       return `${day}-${month}-${year}`;
//     } catch (error) {
//       return "—";
//     }
//   };

//   // ✅ Calculate result status for equipment report
//   const calculateResultStatus = (data) => {
//     if (!data || data.length === 0) return "—";
    
//     // For equipment report, we can consider it "PASS" if we have data
//     // You can add more sophisticated logic based on equipment counts if needed
//     const totalCount = data.reduce((sum, item) => sum + (item.equipment_count || 0), 0);
    
//     if (totalCount === 0) return "NO DATA";
//     return "PASS"; // Equipment report typically shows pass rates, so default to PASS
//   };

//   // ✅ Calculate equipment statistics
//   const calculateEquipmentStats = (data) => {
//     if (!data || data.length === 0) return { totalEquipment: 0, totalRecords: 0 };
    
//     const totalEquipment = data.length;
//     const totalRecords = data.reduce((sum, item) => sum + (item.equipment_count || 0), 0);
    
//     return { totalEquipment, totalRecords };
//   };

//   const hasData = reportData && reportData.length > 0;
//   const displayDates = getDisplayDates();
//   const equipmentStats = calculateEquipmentStats(reportData);

//   return (
//     <div className="equipment-report-container min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">

//       {/* ✅ WRAP EVERYTHING INSIDE THIS CONTAINER */}
//       <div id="full-report-page" className="mx-auto max-w-[1200px]">

//         {/* ✅ HEADER (Logo + UID + Title) */}
//         {embedded ? (
//           <header className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
//             <div className="flex items-center min-w-56 pl-8">
//               <img
//                 src={facteyes}
//                 alt="Micrologic"
//                 className="h-[55px] w-auto scale-[1.15] object-contain"
//                 onError={(e) => {
//                   e.target.src = '/images/micrologic_image.png';
//                   e.target.onerror = null;
//                 }}
//               />
//             </div>

//             <div className="text-center flex-1">
//               <h1 className="text-2xl font-bold text-purple-600 uppercase tracking-wide">
//                 Equipment Pass Rate Report
//               </h1>
//               {uid && (
//                 <div className="mt-3 flex items-center justify-center space-x-2">
//                   <span className="text-sm font-medium text-gray-600 dark:text-gray-400">UID:</span>
//                   <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600">
//                     {uid}
//                   </span>
//                 </div>
//               )}
//             </div>
//             <div className="min-w-56"></div>
//           </header>
//         ) : (
//           <header className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
//             <div className="flex items-center min-w-56 pl-8">
//               <img
//                 src="/Facteyes_image.png"
//                 alt="FactEyes"
//                 className="h-12 w-auto"
//                 onError={(e) => {
//                   e.target.src = '/images/Facteyes_image.png';
//                   e.target.onerror = null;
//                 }}
//               />
//             </div>

//             <div className="text-center flex-1">
//               <h1 className="text-2xl font-bold text-purple-600 uppercase tracking-wide">
//                 Equipment Pass Rate Report
//               </h1>
//               {uid && (
//                 <div className="mt-3 flex items-center justify-center space-x-2">
//                   <span className="text-sm font-medium text-gray-600 dark:text-gray-400">UID:</span>
//                   <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600">
//                     {uid}
//                   </span>
//                 </div>
//               )}
//             </div>
//             <div className="min-w-56"></div>
//           </header>
//         )}

//         {/* ✅ MAIN CONTENT */}
//         {loading ? (
//           <div className="flex flex-col items-center justify-center h-96 bg-gray-50 dark:bg-gray-900">
//             {/* loading animation */}
//             <div className="relative w-48 h-32">
//               <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-3 bg-gradient-to-r from-slate-400 via-slate-500 to-slate-400 rounded-full shadow-inner">
//                 <div className="absolute inset-0 flex items-center justify-around">
//                   {[0, 1, 2, 3, 4].map((i) => (
//                     <div
//                       key={i}
//                       className="w-1 h-full bg-slate-300"
//                       style={{
//                         animation: 'pulseSegment 1.5s ease-in-out infinite',
//                         animationDelay: `${i * 0.3}s`,
//                       }}
//                     ></div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <div className="mt-20 text-center">
//               <p className="text-lg font-semibold text-gray-700 mb-2">
//                 Loading Equipment Data
//               </p>
//               <p className="text-sm text-gray-500">
//                 Please wait while we fetch the equipment pass rate information...
//               </p>
//             </div>
//           </div>
//         ) : hasData ? (
//           <div className="space-y-8">
//             <SummaryCardEquipment
//               pageMaxWidth="1200px"
//               modelName={reportData[0]?.productmodelname}
//               variant={reportData[0]?.productvariant}
//               displayFromRaw={displayDates.displayFrom}
//               displayToRaw={displayDates.displayTo}
//               fromTime={displayDates.displayFromTime}
//               toTime={displayDates.displayToTime}
//               resultStatus={calculateResultStatus(reportData)}
//               formatDateTime={formatDateTime}
//               totalEquipment={equipmentStats.totalEquipment}
//               totalRecords={equipmentStats.totalRecords}
//             />

//             {/* 📊 Table section */}
//             <div className="mt-12">
//               <EquipmentTable reportData={reportData} />
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center h-64 text-gray-500">
//             <p className="text-lg font-medium">No equipment data found for UID:</p>
//             <p className="text-purple-600 font-semibold mt-1">{uid}</p>
//           </div>
//         )}

//       </div> {/* ✅ end of full-report-page */}

//     </div>
//   );

// }



// // src/components/EquipmentPassRateReport.jsx
// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import SummaryCardEquipment from "./SummaryCardEquipment";
// import { EquipmentTable } from "./EquipmentTable";
// import facteyes from '../public/micrologic_image.png';

// const API_BASE = "http://localhost:4000";

// // ✅ ADD: Cache declaration at the top
// const equipmentReportCache = new Map();

// export default function EquipmentPassRateReport({
//   embedded = false,
//   uidFromParent = "",
//   includeDateInReport = false,
//   userSelectedFromDate = '',
//   userSelectedToDate = '',
//   userSelectedFromTime = '00:00:00',
//   userSelectedToTime = '23:59:59'
// }) {
//   const [searchParams] = useSearchParams();
//   const uidFromUrl = searchParams.get("uid");
//   const [uid, setUid] = useState(uidFromParent || uidFromUrl || "");
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // ✅ Debug date parameters
//   useEffect(() => {
//     console.log('📅 Equipment Date Parameters Received:', {
//       includeDateInReport,
//       userSelectedFromDate,
//       userSelectedToDate,
//       userSelectedFromTime,
//       userSelectedToTime
//     });
//   }, [includeDateInReport, userSelectedFromDate, userSelectedToDate, userSelectedFromTime, userSelectedToTime]);

//   // 🔁 Update UID when parent or URL param changes
//   useEffect(() => {
//     const latestUid = uidFromParent || uidFromUrl || "";
//     if (latestUid && latestUid !== uid) setUid(latestUid);
//   }, [uidFromParent, uidFromUrl]);

//   // ✅ Determine which dates to display for equipment report
//   const getDisplayDates = () => {
//     // ✅ READ FROM URL PARAMETERS DIRECTLY
//     const urlIncludeDate = searchParams.get('includeDateInReport');
//     const urlFromDate = searchParams.get('userSelectedFromDate');
//     const urlToDate = searchParams.get('userSelectedToDate');
//     const urlFromTime = searchParams.get('userSelectedFromTime') || '00:00:00';
//     const urlToTime = searchParams.get('userSelectedToTime') || '23:59:59';
    
//     const shouldUseUserDates = urlIncludeDate === 'true' && urlFromDate && urlToDate;
    
//     console.log('🔍📋 EQUIPMENT DATE SCENARIO CHECK:', {
//       urlIncludeDate,
//       urlFromDate,
//       urlToDate, 
//       urlFromTime,
//       urlToTime,
//       shouldUseUserDates
//     });
    
//     // Scenario 1: User clicked "Include Date in Report" AND selected dates (from URL)
//     if (shouldUseUserDates) {
//       console.log('🎯📅 EQUIPMENT: USING SCENARIO 1: USER-SELECTED dates and times FROM URL');
//       return {
//         displayFrom: urlFromDate,
//         displayTo: urlToDate,
//         displayFromTime: urlFromTime,
//         displayToTime: urlToTime
//       };
//     } 
//     // Scenario 2: No date filter (get all data)
//     else {
//       console.log('🎯📅 EQUIPMENT: USING SCENARIO 2: NO DATE FILTER (All Data)');
//       return {
//         displayFrom: null, // No date filtering
//         displayTo: null,
//         displayFromTime: '00:00:00',
//         displayToTime: '23:59:59'
//       };
//     }
//   };

// // Add this state
// const [progress, setProgress] = useState(0);
// const [estimatedTime, setEstimatedTime] = useState(15); // Default 15 seconds

// // // ✅ OPTIMIZED: Fetch equipment pass rate data with cache
// // useEffect(() => {
// //   if (!uid) return;
  
// //   // Get display dates for cache key
// //   const displayDates = getDisplayDates();
// //   const cacheKey = `${uid}-${displayDates.displayFrom || 'no-date'}-${displayDates.displayTo || 'no-date'}`;
  
// //   // Check cache first
// //   if (equipmentReportCache.has(cacheKey)) {
// //     console.log("[EquipmentPassRateReport] Using cached data for:", cacheKey);
// //     setReportData(equipmentReportCache.get(cacheKey));
// //     setLoading(false);
// //     return;
// //   }

// //   setLoading(true);
// //   setProgress(10); // Start at 10%
// //   setEstimatedTime(15); // Reset estimated time

// //   // 🧩 Hide UID query from browser address bar
// //   if (window.history?.replaceState) {
// //     window.history.replaceState({}, document.title, window.location.pathname);
// //   }

// //   // Build API URL based on date scenario
// //   let url = `${API_BASE}/api/trace/equipment-pass-rate/equipment-pass-rate?uid=${encodeURIComponent(uid)}`;

// //   // Scene A: With date/time filter
// //   if (displayDates.displayFrom && displayDates.displayTo) {
// //     url += `&fromDate=${displayDates.displayFrom}&toDate=${displayDates.displayTo}&fromTime=${displayDates.displayFromTime}&toTime=${displayDates.displayToTime}`;
// //     console.log('🎯 EQUIPMENT: Scene A - With Date Filter');
// //     setEstimatedTime(20); // Longer for date filters
// //   } 
// //   // Scene B: Without date/time filter
// //   else {
// //     console.log('🎯 EQUIPMENT: Scene B - No Date Filter (All Data)');
// //     setEstimatedTime(15);
// //   }

// //   console.log("[EquipmentPassRateReport] Fetching:", url);

// //   // Progress simulation for better UX
// //   const progressInterval = setInterval(() => {
// //     setProgress(prev => {
// //       if (prev >= 90) {
// //         clearInterval(progressInterval);
// //         return 90; // Cap at 90% until response
// //       }
// //       return prev + 5; // Increment by 5% every second
// //     });
// //   }, 1000);

// //   fetch(url)
// //     .then((res) => {
// //       setProgress(70); // Jump to 70% when response received
// //       if (!res.ok) throw new Error(`HTTP ${res.status}`);
// //       return res.json();
// //     })
// //     .then((data) => {
// //       const processedData = Array.isArray(data) ? data : [];
// //       console.log("[EquipmentPassRateReport] fetched data:", processedData);
      
// //       // ✅ CACHE THE DATA
// //       equipmentReportCache.set(cacheKey, processedData);
// //       setReportData(processedData);
// //       setProgress(100); // Complete
// //     })
// //     .catch((err) => {
// //       console.error("❌ Failed to load equipment pass rate report:", err);
// //       setReportData([]);
// //       setProgress(100);
// //     })
// //     .finally(() => {
// //       clearInterval(progressInterval);
// //       setLoading(false);
// //       // Reset progress after a delay
// //       setTimeout(() => setProgress(0), 1000);
// //     });
// // }, [uid]);

//   // ✅ OPTIMIZED: Fetch equipment pass rate data with cache
//   useEffect(() => {
//     if (!uid) return;
    
//     const displayDates = getDisplayDates();
//     const cacheKey = `${uid}-${displayDates.displayFrom || 'no-date'}-${displayDates.displayTo || 'no-date'}`;
    
//     // Check cache first
//     if (equipmentReportCache.has(cacheKey)) {
//       console.log("[EquipmentPassRateReport] Using cached data for:", cacheKey);
//       setReportData(equipmentReportCache.get(cacheKey));
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setProgress(5); // Start lower for Azure
//     setEstimatedTime(25); // Azure is slower

//     const startTime = Date.now();

//     if (window.history?.replaceState) {
//       window.history.replaceState({}, document.title, window.location.pathname);
//     }

//     let url = `${API_BASE}/api/trace/equipment-pass-rate/equipment-pass-rate?uid=${encodeURIComponent(uid)}`;

//     if (displayDates.displayFrom && displayDates.displayTo) {
//       url += `&fromDate=${displayDates.displayFrom}&toDate=${displayDates.displayTo}&fromTime=${displayDates.displayFromTime}&toTime=${displayDates.displayToTime}`;
//     }

//     console.log("[EquipmentPassRateReport] Fetching from Azure Table:", url);

//     // Slower progress for Azure - more realistic
//     const progressInterval = setInterval(() => {
//       setProgress(prev => {
//         const elapsed = (Date.now() - startTime) / 1000;
//         const newProgress = Math.min(5 + (elapsed / 30) * 85, 90);
//         return Math.floor(newProgress);
//       });
//     }, 1000); // Update every second for Azure

//     fetch(url)
//       .then((res) => {
//         setProgress(80); // Azure responses take longer to process
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         return res.json();
//       })
//       .then((data) => {
//         const processedData = Array.isArray(data) ? data : [];
//         const loadTime = ((Date.now() - startTime) / 1000).toFixed(1);
//         console.log(`[EquipmentPassRateReport] Azure query completed in ${loadTime} seconds`);
        
//         equipmentReportCache.set(cacheKey, processedData);
//         setReportData(processedData);
//         setProgress(100);
//       })
//       .catch((err) => {
//         console.error("❌ Failed to load from Azure Table:", err);
//         setReportData([]);
//         setProgress(100);
//       })
//       .finally(() => {
//         clearInterval(progressInterval);
//         setLoading(false);
//         setTimeout(() => setProgress(0), 1000);
//       });
//   }, [uid]);

//   // ✅ Date formatting function
//   const formatDateTime = (dateString) => {
//     if (!dateString) return "—";
//     try {
//       const date = dateString instanceof Date ? dateString : new Date(dateString);
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const year = date.getFullYear();
      
//       if (isNaN(date.getTime())) {
//         return "—";
//       }
      
//       return `${day}-${month}-${year}`;
//     } catch (error) {
//       return "—";
//     }
//   };

//   // ✅ Calculate result status for equipment report
//   const calculateResultStatus = (data) => {
//     if (!data || data.length === 0) return "—";
    
//     // For equipment report, we can consider it "PASS" if we have data
//     // You can add more sophisticated logic based on equipment counts if needed
//     const totalCount = data.reduce((sum, item) => sum + (item.equipment_count || 0), 0);
    
//     if (totalCount === 0) return "NO DATA";
//     return "PASS"; // Equipment report typically shows pass rates, so default to PASS
//   };

//   // ✅ Calculate equipment statistics
//   const calculateEquipmentStats = (data) => {
//     if (!data || data.length === 0) return { totalEquipment: 0, totalRecords: 0 };
    
//     const totalEquipment = data.length;
//     const totalRecords = data.reduce((sum, item) => sum + (item.equipment_count || 0), 0);
    
//     return { totalEquipment, totalRecords };
//   };

//   const hasData = reportData && reportData.length > 0;
//   const displayDates = getDisplayDates();
//   const equipmentStats = calculateEquipmentStats(reportData);

//   // // ✅ ADD: Calculate actual production dates from equipment data (IMPROVED)
//   // const calculateProductionDates = (data) => {
//   //   if (!data || data.length === 0) return { 
//   //     startDate: null, 
//   //     endDate: null
//   //   };
    
//   //   console.log('🔍 EQUIPMENT DATA FOR DATE CALCULATION:', {
//   //     dataLength: data.length,
//   //     sampleItem: data[0],
//   //     availableDateFields: Object.keys(data[0] || {}).filter(key => 
//   //       key.toLowerCase().includes('date') || 
//   //       key.toLowerCase().includes('time') ||
//   //       key.toLowerCase().includes('created') ||
//   //       key.toLowerCase().includes('timestamp')
//   //     )
//   //   });
    
//   //   let earliestDate = null;
//   //   let latestDate = null;
    
//   //   data.forEach(item => {
//   //     // Try multiple possible date fields that equipment data might have
//   //     const dateField = item.production_date || item.productionstartdate || item.productionenddate || 
//   //                     item.created_date || item.timestamp || item.date;
      
//   //     if (dateField) {
//   //       try {
//   //         const productionDate = new Date(dateField);
//   //         if (!isNaN(productionDate.getTime())) { // Check if valid date
//   //           if (!earliestDate || productionDate < earliestDate) {
//   //             earliestDate = productionDate;
//   //           }
//   //           if (!latestDate || productionDate > latestDate) {
//   //             latestDate = productionDate;
//   //           }
//   //         }
//   //       } catch (error) {
//   //         console.log('⚠️ Invalid date field:', dateField, error);
//   //       }
//   //     }
//   //   });
    
//   //   console.log('📅 EQUIPMENT PRODUCTION DATE RANGE:', {
//   //     earliestDate,
//   //     latestDate,
//   //     hasDates: !!(earliestDate && latestDate)
//   //   });
    
//   //   return {
//   //     startDate: earliestDate,
//   //     endDate: latestDate
//   //   };
//   // };

//   // // ✅ ADD: Check if user dates are within production range (IMPROVED)
//   // const checkUserDatesInRange = (userFromDate, userToDate, productionStart, productionEnd) => {
//   //   if (!userFromDate || !userToDate) return false;
    
//   //   // If no production dates available, we can't validate - assume data exists
//   //   if (!productionStart || !productionEnd) {
//   //     console.log('⚠️ No production dates available - skipping date validation');
//   //     return true;
//   //   }
    
//   //   try {
//   //     const userFrom = new Date(userFromDate);
//   //     const userTo = new Date(userToDate);
//   //     const prodStart = new Date(productionStart);
//   //     const prodEnd = new Date(productionEnd);
      
//   //     // Check if user dates overlap with production dates
//   //     const hasOverlap = userFrom <= prodEnd && userTo >= prodStart;
      
//   //     console.log('🔍 DATE RANGE VALIDATION:', {
//   //       userFrom: userFrom.toISOString(),
//   //       userTo: userTo.toISOString(),
//   //       prodStart: prodStart.toISOString(),
//   //       prodEnd: prodEnd.toISOString(),
//   //       hasOverlap
//   //     });
      
//   //     return hasOverlap;
//   //   } catch (error) {
//   //     console.error('Error comparing dates:', error);
//   //     return true; // If date comparison fails, show the data anyway
//   //   }
//   // };

//     // ✅ ADD: Check if we should show "No reports found" message
//   const shouldShowNoReportsMessage = () => {
//     const urlIncludeDate = searchParams.get('includeDateInReport');
//     const urlFromDate = searchParams.get('userSelectedFromDate');
//     const urlToDate = searchParams.get('userSelectedToDate');
    
//     const isScenario1 = urlIncludeDate === 'true' && urlFromDate && urlToDate;
//     const hasNoData = !hasData;
    
//     console.log('🔍 SHOULD SHOW NO REPORTS MESSAGE:', {
//       isScenario1,
//       hasNoData,
//       userFromDate: urlFromDate,
//       userToDate: urlToDate
//     });
    
//     return isScenario1 && hasNoData;
//   };
//   return (
//     <div className="equipment-report-container min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">

//       {/* ✅ WRAP EVERYTHING INSIDE THIS CONTAINER */}
//       <div id="full-report-page" className="mx-auto max-w-[1200px]">

//         {/* ✅ HEADER (Logo + UID + Title) */}
//         {embedded ? (
//           <header className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
//             <div className="flex items-center min-w-56 pl-8">
//               <img
//                 src={facteyes}
//                 alt="Micrologic"
//                 className="h-[55px] w-auto scale-[1.15] object-contain"
//                 onError={(e) => {
//                   e.target.src = '/images/micrologic_image.png';
//                   e.target.onerror = null;
//                 }}
//               />
//             </div>

//             <div className="text-center flex-1">
//               <h1 className="text-2xl font-bold text-purple-600 uppercase tracking-wide">
//                 Equipment Pass Rate Report
//               </h1>
//               {uid && (
//                 <div className="mt-3 flex items-center justify-center space-x-2">
//                   <span className="text-sm font-medium text-gray-600 dark:text-gray-400">UID:</span>
//                   <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600">
//                     {uid}
//                   </span>
//                 </div>
//               )}
//             </div>
//             <div className="min-w-56"></div>
//           </header>
//         ) : (
//           <header className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
//             <div className="flex items-center min-w-56 pl-8">
//               <img
//                 src="/Facteyes_image.png"
//                 alt="FactEyes"
//                 className="h-12 w-auto"
//                 onError={(e) => {
//                   e.target.src = '/images/Facteyes_image.png';
//                   e.target.onerror = null;
//                 }}
//               />
//             </div>

//             <div className="text-center flex-1">
//               <h1 className="text-2xl font-bold text-purple-600 uppercase tracking-wide">
//                 Equipment Pass Rate Report
//               </h1>
//               {uid && (
//                 <div className="mt-3 flex items-center justify-center space-x-2">
//                   <span className="text-sm font-medium text-gray-600 dark:text-gray-400">UID:</span>
//                   <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600">
//                     {uid}
//                   </span>
//                 </div>
//               )}
//             </div>
//             <div className="min-w-56"></div>
//           </header>
//         )}

// {/* ✅ Conditional rendering */}
// {loading ? (
//   <div className="flex flex-col items-center justify-center h-96 bg-gray-50 dark:bg-gray-900">
//     {/* Data Pipeline & Inspection Station Spinner */}
//     <div className="relative w-48 h-32">
//       {/* Main data pipeline */}
//       <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-3 bg-gradient-to-r from-slate-400 via-slate-500 to-slate-400 dark:from-slate-600 dark:via-slate-500 dark:to-slate-600 rounded-full shadow-inner">
//         {/* Pipeline segments indicator */}
//         <div className="absolute inset-0 flex items-center justify-around">
//           {[0, 1, 2, 3, 4].map((i) => (
//             <div
//               key={i}
//               className="w-1 h-full bg-slate-300 dark:bg-slate-700"
//               style={{
//                 animation: 'pulseSegment 1.5s ease-in-out infinite',
//                 animationDelay: `${i * 0.3}s`,
//               }}
//             ></div>
//           ))}
//         </div>
//       </div>

//       {/* Data packets flowing through pipeline */}
//       <div className="absolute inset-0 flex items-center">
//         {[0, 1, 2, 3].map((i) => (
//           <div
//             key={i}
//             className="absolute"
//             style={{
//               animation: 'flowData 4s linear infinite',
//               animationDelay: `${i * 1}s`,
//               left: '-8%',
//             }}
//           >
//             {/* Data packet */}
//             <div className="relative">
//               <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg shadow-lg transform rotate-45">
//                 <div className="absolute inset-1 border-2 border-cyan-200 rounded-lg"></div>
//               </div>
//               {/* Data trail */}
//               <div className="absolute top-1/2 right-full w-8 h-0.5 bg-gradient-to-l from-cyan-400 to-transparent"></div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Inspection scanner gates */}
//       <div className="absolute top-0 left-1/4 -translate-x-1/2 flex flex-col items-center">
//         <div className="w-8 h-16 bg-gradient-to-b from-purple-500 to-purple-600 rounded-t-lg shadow-lg relative">
//           {/* Vertical scanning beam */}
//           <div
//             className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-purple-300"
//             style={{
//               animation: 'verticalScan 2s ease-in-out infinite',
//               boxShadow: '0 0 8px rgba(168, 85, 247, 0.8)',
//             }}
//           ></div>
//           {/* Scanner lens */}
//           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-purple-300 rounded-full animate-pulse"></div>
//         </div>
//       </div>

//       <div className="absolute top-0 right-1/4 -translate-x-1/2 flex flex-col items-center">
//         <div className="w-8 h-16 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-t-lg shadow-lg relative">
//           {/* Horizontal scanning beam */}
//           <div
//             className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-300"
//             style={{
//               animation: 'horizontalScan 1.8s ease-in-out infinite',
//               boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)',
//             }}
//           ></div>
//           {/* Scanner lens */}
//           <div
//             className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-emerald-300 rounded-full animate-pulse"
//             style={{ animationDelay: '0.3s' }}
//           ></div>
//         </div>
//       </div>

//       {/* Analytics dashboard indicators */}
//       <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
//         <div className="flex flex-col items-center gap-1">
//           <div
//             className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500"
//             style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
//           ></div>
//           <span className="text-xs text-gray-600 dark:text-gray-400">Quality OK</span>
//         </div>
//       </div>
//     </div>

//       {/* Loading text */}
//       <div className="mt-20 text-center">
//         <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
//           Loading Report Data
//         </p>
//         <p className="text-sm text-gray-500 dark:text-gray-400">
//           Please wait while we fetch the traceability information...
//         </p>
//       </div>
//       </div>

//         ) : hasData ? (
//           <div className="space-y-8">
//             {/* ✅ EQUIPMENT REPORTS: Skip date validation - always show data when API returns it */}
//             <SummaryCardEquipment
//               pageMaxWidth="1200px"
//               modelName={reportData[0]?.productmodelname}
//               variant={reportData[0]?.productvariant}
//               displayFromRaw={displayDates.displayFrom}
//               displayToRaw={displayDates.displayTo}
//               fromTime={displayDates.displayFromTime}
//               toTime={displayDates.displayToTime}
//               resultStatus={calculateResultStatus(reportData)}
//               formatDateTime={formatDateTime}
//               totalEquipment={equipmentStats.totalEquipment}
//               totalRecords={equipmentStats.totalRecords}
//             />

//             {/* 📊 Table section */}
//             <div className="mt-12">
//               <EquipmentTable reportData={reportData} />
//             </div>
//           </div>
//         ) : shouldShowNoReportsMessage() ? (
//           <div className="flex flex-col items-center justify-center h-64 text-gray-500">
//             <div className="text-center">
//               <p className="text-lg font-medium text-red-600 mb-2">
//                 No reports found for the selected date.
//               </p>
//               <p className="text-sm text-gray-600">
//                 Selected: {formatDateTime(searchParams.get('userSelectedFromDate'))} to {formatDateTime(searchParams.get('userSelectedToDate'))}
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center h-64 text-gray-500">
//             <p className="text-lg font-medium">No equipment data found for UID:</p>
//             <p className="text-purple-600 font-semibold mt-1">{uid}</p>
//             <p className="text-sm text-gray-600 mt-2">
//               The equipment API returned no data for this UID with the current filters.
//             </p>
//           </div>
//         )}

//       </div> {/* ✅ end of full-report-page */}

//     </div>
//   );
// }



// src/components/EquipmentPassRateReport.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SummaryCardEquipment from "./SummaryCardEquipment";
import { EquipmentTable } from "./EquipmentTable";
import facteyes from '../public/micrologic_image.png';

const API_BASE = "http://localhost:4000";

// Cache
const equipmentReportCache = new Map();

export default function EquipmentPassRateReport({
  embedded = false,
  uidFromParent = "",
  includeDateInReport = false,
  userSelectedFromDate = '',
  userSelectedToDate = '',
  userSelectedFromTime = '00:00:00',
  userSelectedToTime = '23:59:59'
}) {

  const [searchParams] = useSearchParams();
  const uidFromUrl = searchParams.get("uid");

  const [uid, setUid] = useState(uidFromParent || uidFromUrl || "");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  /** RESPONSIVE NEW STATES */
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(15);

  useEffect(() => {
    const latestUid = uidFromParent || uidFromUrl || "";
    if (latestUid && latestUid !== uid) setUid(latestUid);
  }, [uidFromParent, uidFromUrl]);

  const getDisplayDates = () => {
    const urlIncludeDate = searchParams.get('includeDateInReport');
    const urlFromDate = searchParams.get('userSelectedFromDate');
    const urlToDate = searchParams.get('userSelectedToDate');
    const urlFromTime = searchParams.get('userSelectedFromTime') || '00:00:00';
    const urlToTime = searchParams.get('userSelectedToTime') || '23:59:59';

    const shouldUseUserDates = urlIncludeDate === 'true' && urlFromDate && urlToDate;

    if (shouldUseUserDates) {
      return {
        displayFrom: urlFromDate,
        displayTo: urlToDate,
        displayFromTime: urlFromTime,
        displayToTime: urlToTime
      };
    }

    return {
      displayFrom: null,
      displayTo: null,
      displayFromTime: '00:00:00',
      displayToTime: '23:59:59'
    };
  };

  /** FETCH */
  useEffect(() => {
    if (!uid) return;

    const displayDates = getDisplayDates();
    const cacheKey = `${uid}-${displayDates.displayFrom || 'no-date'}-${displayDates.displayTo || 'no-date'}`;

    if (equipmentReportCache.has(cacheKey)) {
      setReportData(equipmentReportCache.get(cacheKey));
      setLoading(false);
      return;
    }

    setLoading(true);
    setProgress(5);

    const startTime = Date.now();

    let url = `${API_BASE}/api/trace/equipment-pass-rate/equipment-pass-rate?uid=${encodeURIComponent(uid)}`;

    if (displayDates.displayFrom && displayDates.displayTo) {
      url += `&fromDate=${displayDates.displayFrom}&toDate=${displayDates.displayTo}&fromTime=${displayDates.displayFromTime}&toTime=${displayDates.displayToTime}`;
    }

    const progressInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const newProgress = Math.min(5 + (elapsed / 30) * 85, 90);
      setProgress(Math.floor(newProgress));
    }, 800);

    fetch(url)
      .then((res) => {
        setProgress(80);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const processedData = Array.isArray(data) ? data : [];
        equipmentReportCache.set(cacheKey, processedData);
        setReportData(processedData);
        setProgress(100);
      })
      .catch(() => {
        setReportData([]);
        setProgress(100);
      })
      .finally(() => {
        clearInterval(progressInterval);
        setLoading(false);
        setTimeout(() => setProgress(0), 800);
      });

  }, [uid]);


  /** Format date */
  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "—";
      const d = String(date.getDate()).padStart(2, "0");
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const y = date.getFullYear();
      return `${d}-${m}-${y}`;
    } catch {
      return "—";
    }
  };

  const calculateResultStatus = (data) => {
    if (!data || data.length === 0) return "—";
    const totalCount = data.reduce((sum, item) => sum + (item.equipment_count || 0), 0);
    if (totalCount === 0) return "NO DATA";
    return "PASS";
  };

  const calculateEquipmentStats = (data) => {
    if (!data || data.length === 0) return { totalEquipment: 0, totalRecords: 0 };
    const totalEquipment = data.length;
    const totalRecords = data.reduce((sum, item) => sum + (item.equipment_count || 0), 0);
    return { totalEquipment, totalRecords };
  };

  const hasData = reportData && reportData.length > 0;
  const displayDates = getDisplayDates();

  const shouldShowNoReportsMessage = () => {
    const urlIncludeDate = searchParams.get('includeDateInReport');
    const urlFromDate = searchParams.get('userSelectedFromDate');
    const urlToDate = searchParams.get('userSelectedToDate');
    const isScenario1 = urlIncludeDate === 'true' && urlFromDate && urlToDate;
    const noData = !hasData;
    return isScenario1 && noData;
  };

  const equipmentStats = calculateEquipmentStats(reportData);

  return (
    <div
      className="
        equipment-report-container 
        min-h-screen 
        bg-gray-100 dark:bg-gray-900 
        text-gray-900 dark:text-gray-100 
        
        px-3 sm:px-6 lg:px-12 
        py-4 sm:py-6 lg:py-10
      "
    >
      <div
        id="full-report-page"
        className="
          mx-auto 
          w-full 
          max-w-[95%] sm:max-w-[1100px] lg:max-w-[1400px]

          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-4 sm:gap-6 lg:gap-10
        "
      >
        {/* ============================ */}
        {/* RESPONSIVE HEADER */}
        {/* ============================ */}

        <header
          className="
            col-span-1 sm:col-span-2 lg:col-span-3
            flex flex-col sm:flex-row 
            items-center justify-between 
            gap-4 sm:gap-6 lg:gap-12
            pb-4 sm:pb-6 lg:pb-8 
            border-b border-gray-300 dark:border-gray-700
          "
        >
          {/* LEFT LOGO */}
          <div className="flex justify-center sm:justify-start w-full sm:w-1/3">
            <img
              src={embedded ? facteyes : "/Facteyes_image.png"}
              alt="Logo"
              className="
                h-10 sm:h-12 lg:h-14 
                w-auto object-contain
              "
              onError={(e) => {
                e.target.src = '/images/micrologic_image.png';
                e.target.onerror = null;
              }}
            />
          </div>

          {/* MIDDLE TITLE */}
          <div className="flex flex-col items-center w-full sm:w-1/3 text-center">
            <h1
              className="
                text-xl sm:text-2xl lg:text-3xl 
                font-bold text-purple-600 
                uppercase tracking-wide
              "
            >
              Equipment Pass Rate Report
            </h1>

            {uid && (
              <div className="mt-2 sm:mt-3 flex items-center justify-center space-x-2">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  UID:
                </span>
                <span
                  className="
                    text-xs sm:text-sm lg:text-base 
                    font-semibold 
                    bg-gray-100 dark:bg-gray-800 
                    px-2 sm:px-3 py-1 
                    rounded-md 
                    border border-gray-300 dark:border-gray-600
                  "
                >
                  {uid}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT EMPTY SPACE FOR ALIGNMENT */}
          <div className="w-full sm:w-1/3"></div>
        </header>
{/* ===================================== */}
{/* LOADING BLOCK (FULL WIDTH) */}
{/* ===================================== */}
{loading && (
  <div
    className="
      col-span-1 sm:col-span-2 lg:col-span-3
      flex flex-col items-center justify-center 
      py-10 sm:py-16 lg:py-24
    "
  >

    {/* ====================================================== */}
    {/* YOUR FULL ORIGINAL ANIMATION (UNCHANGED & PRESERVED)   */}
    {/* ====================================================== */}
    <div className="relative w-48 h-32">
      {/* Main data pipeline */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-3 bg-gradient-to-r from-slate-400 via-slate-500 to-slate-400 dark:from-slate-600 dark:via-slate-500 dark:to-slate-600 rounded-full shadow-inner">
        <div className="absolute inset-0 flex items-center justify-around">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1 h-full bg-slate-300 dark:bg-slate-700"
              style={{
                animation: 'pulseSegment 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.3}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Data packets flowing through pipeline */}
      <div className="absolute inset-0 flex items-center">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute"
            style={{
              animation: 'flowData 4s linear infinite',
              animationDelay: `${i * 1}s`,
              left: '-8%',
            }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg shadow-lg transform rotate-45">
                <div className="absolute inset-1 border-2 border-cyan-200 rounded-lg"></div>
              </div>

              <div className="absolute top-1/2 right-full w-8 h-0.5 bg-gradient-to-l from-cyan-400 to-transparent"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Inspection scanner gates */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 flex flex-col items-center">
        <div className="w-8 h-16 bg-gradient-to-b from-purple-500 to-purple-600 rounded-t-lg shadow-lg relative">

          <div
            className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-purple-300"
            style={{
              animation: 'verticalScan 2s ease-in-out infinite',
              boxShadow: '0 0 8px rgba(168, 85, 247, 0.8)',
            }}
          ></div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-purple-300 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="absolute top-0 right-1/4 -translate-x-1/2 flex flex-col items-center">
        <div className="w-8 h-16 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-t-lg shadow-lg relative">

          <div
            className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-300"
            style={{
              animation: 'horizontalScan 1.8s ease-in-out infinite',
              boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)',
            }}
          ></div>

          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-emerald-300 rounded-full animate-pulse"
            style={{ animationDelay: '0.3s' }}
          ></div>

        </div>
      </div>

      {/* Analytics dashboard indicators */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <div
            className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500"
            style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
          ></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Quality OK
          </span>
        </div>
      </div>
    </div>

    {/* ====================================================== */}
    {/* TEXT BELOW LOADER (UNCHANGED)                         */}
    {/* ====================================================== */}
    <div className="mt-20 text-center">
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Loading Report Data
      </p>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Please wait while we fetch the traceability information...
      </p>
    </div>

  </div>
)}

        {/* ===================================== */}
        {/* MAIN REPORT CONTENT (WHEN DATA EXISTS) */}
        {/* ===================================== */}
        {!loading && hasData && (
          <>
            {/* SUMMARY CARD - FULL WIDTH */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <SummaryCardEquipment
                pageMaxWidth="1200px"
                modelName={reportData[0]?.productmodelname}
                variant={reportData[0]?.productvariant}
                displayFromRaw={displayDates.displayFrom}
                displayToRaw={displayDates.displayTo}
                fromTime={displayDates.displayFromTime}
                toTime={displayDates.displayToTime}
                resultStatus={calculateResultStatus(reportData)}
                formatDateTime={formatDateTime}
                totalEquipment={equipmentStats.totalEquipment}
                totalRecords={equipmentStats.totalRecords}
              />
            </div>

            {/* TABLE SECTION - FULL WIDTH */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
              <EquipmentTable reportData={reportData} />
            </div>
          </>
        )}

        {/* ===================================== */}
        {/* NO REPORTS (WHEN FILTER APPLIED) */}
        {/* ===================================== */}
        {!loading && !hasData && shouldShowNoReportsMessage() && (
          <div
            className="
              col-span-1 sm:col-span-2 lg:col-span-3 
              flex flex-col items-center justify-center 
              py-10
              text-center text-gray-600 dark:text-gray-400
            "
          >
            <p className="text-base sm:text-lg font-medium text-red-600 mb-2">
              No reports found for the selected date.
            </p>

            <p className="text-xs sm:text-sm">
              Selected: {formatDateTime(searchParams.get("userSelectedFromDate"))} to{" "}
              {formatDateTime(searchParams.get("userSelectedToDate"))}
            </p>
          </div>
        )}

        {/* ===================================== */}
        {/* NO DATA CASE (NO FILTER) */}
        {/* ===================================== */}
        {!loading && !hasData && !shouldShowNoReportsMessage() && (
          <div
            className="
              col-span-1 sm:col-span-2 lg:col-span-3 
              flex flex-col items-center justify-center 
              py-10 text-center
            "
          >
            <p className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300">
              No equipment data found for UID:
            </p>

            <p className="text-purple-600 font-semibold mt-1 text-sm sm:text-base">
              {uid}
            </p>

            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              The equipment API returned no data for this UID with the current filters.
            </p>
          </div>
        )}

      </div> {/* end full-page grid */}
    </div>
  );
}


