// // src/components/ReworkReport.jsx
// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import SummaryCardRework from "./SummaryCardRework";
// import ReportControls from "./ReportControls";
// import { ReworkApprovedTable } from "./ReworkApprovedtable";
// import facteyes from '../public/micrologic_image.png';

// const API_BASE = "http://localhost:4000";
// const reworkReportCache = new Map();

// export default function ReworkReport({
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
//   const [headerInfo, setHeaderInfo] = useState({});
//   const [summary, setSummary] = useState({});
//   const [loading, setLoading] = useState(false);

//   // 🔁 Update UID when parent or URL param changes
//   useEffect(() => {
//     const latestUid = uidFromParent || uidFromUrl || "";
//     if (latestUid && latestUid !== uid) setUid(latestUid);
//   }, [uidFromParent, uidFromUrl]);

//   // ✅ ADD: Extract time from date string
//   const extractTimeFromDate = (dateString) => {
//     if (!dateString) return '00:00:00';
//     try {
//       const date = new Date(dateString);
//       const hours = String(date.getHours()).padStart(2, '0');
//       const minutes = String(date.getMinutes()).padStart(2, '0');
//       const seconds = String(date.getSeconds()).padStart(2, '0');
//       return `${hours}:${minutes}:${seconds}`;
//     } catch (error) {
//       return '00:00:00';
//     }
//   };

//   // ✅ ADD: Debug date parameters
//   useEffect(() => {
//     console.log('📅 Rework Date Parameters Received:', {
//       includeDateInReport,
//       userSelectedFromDate,
//       userSelectedToDate,
//       userSelectedFromTime,
//       userSelectedToTime
//     });
//   }, [includeDateInReport, userSelectedFromDate, userSelectedToDate, userSelectedFromTime, userSelectedToTime]);

//   // ✅ ADD: Calculate actual production dates WITH TIMES from report data
//   const calculateProductionDates = (data) => {
//     if (!data || data.length === 0) return { 
//       startDate: null, 
//       endDate: null,
//       startTime: '00:00:00',
//       endTime: '00:00:00'
//     };
    
//     let earliestDate = null;
//     let latestDate = null;
//     let earliestTime = '00:00:00';
//     let latestTime = '00:00:00';
    
//     data.forEach(item => {
//       if (item.ProductionStartDate) {
//         const startDate = new Date(item.ProductionStartDate);
//         if (!earliestDate || startDate < earliestDate) {
//           earliestDate = startDate;
//           earliestTime = extractTimeFromDate(item.ProductionStartDate);
//         }
//       }
      
//       if (item.ProductionEndDate) {
//         const endDate = new Date(item.ProductionEndDate);
//         if (!latestDate || endDate > latestDate) {
//           latestDate = endDate;
//           latestTime = extractTimeFromDate(item.ProductionEndDate);
//         }
//       }
//     });
    
//     return {
//       startDate: earliestDate,
//       endDate: latestDate,
//       startTime: earliestTime,
//       endTime: latestTime
//     };
//   };

//   // ✅ ADD: Determine which dates to display
//   const getDisplayDates = () => {
//     const productionDates = calculateProductionDates(reportData);
    
//     // ✅ READ FROM URL PARAMETERS DIRECTLY
//     const urlIncludeDate = searchParams.get('includeDateInReport');
//     const urlFromDate = searchParams.get('userSelectedFromDate');
//     const urlToDate = searchParams.get('userSelectedToDate');
//     const urlFromTime = searchParams.get('userSelectedFromTime') || '00:00:00';
//     const urlToTime = searchParams.get('userSelectedToTime') || '23:59:59';
    
//     const shouldUseUserDates = urlIncludeDate === 'true' && urlFromDate && urlToDate;
    
//     console.log('🔍📋 REWORK DATE SCENARIO CHECK:', {
//       urlIncludeDate,
//       urlFromDate,
//       urlToDate, 
//       urlFromTime,
//       urlToTime,
//       shouldUseUserDates,
//       productionStart: productionDates.startDate,
//       productionEnd: productionDates.endDate
//     });
    
//     // Scenario 1: User clicked "Include Date in Report" AND selected dates (from URL)
//     if (shouldUseUserDates) {
//       console.log('🎯📅 REWORK USING SCENARIO 1: USER-SELECTED dates and times FROM URL');
//       return {
//         displayFrom: urlFromDate,
//         displayTo: urlToDate,
//         displayFromTime: urlFromTime,
//         displayToTime: urlToTime
//       };
//     } 
//     // Scenario 2: Use actual production dates and times from data
//     else {
//       console.log('🎯📅 REWORK USING SCENARIO 2: PRODUCTION dates and times from data');
//       return {
//         displayFrom: productionDates.startDate,
//         displayTo: productionDates.endDate,
//         displayFromTime: productionDates.startTime,
//         displayToTime: productionDates.endTime
//       };
//     }
//   };

// // ✅ OPTIMIZED: Fetch rework data with cache
// useEffect(() => {
//   if (!uid) return;
  
//   // ✅ ADD: Cache check first
//   const cacheKey = `${uid}-rework`;
//   if (reworkReportCache.has(cacheKey)) {
//     console.log("[ReworkReport] Using cached data for:", cacheKey);
//     const cachedData = reworkReportCache.get(cacheKey);
//     setReportData(cachedData.tableData || []);
//     setHeaderInfo(cachedData.header || {});
//     setSummary(cachedData.summary || {});
//     setLoading(false);
//     return;
//   }

//   setLoading(true);

//   // 🧩 Hide UID query from browser address bar
//   if (window.history && window.history.replaceState) {
//     window.history.replaceState({}, document.title, window.location.pathname);
//   }

//   // ✅ Rework API endpoint
//   const url = `${API_BASE}/api/trace/rework-approved/uid/${encodeURIComponent(uid)}`;
//   console.log("[ReworkReport] Fetching:", url);

//   fetch(url)
//     .then((res) => {
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       return res.json();
//     })
//     .then((data) => {
//       console.log("[ReworkReport] fetched data:", data);
//       if (data.success) {
//         const processedData = {
//           tableData: data.data.tableData || [],
//           header: data.data.header || {},
//           summary: data.data.summary || {}
//         };
        
//         // ✅ ADD: Cache the data
//         reworkReportCache.set(cacheKey, processedData);
        
//         setReportData(processedData.tableData);
//         setHeaderInfo(processedData.header);
//         setSummary(processedData.summary);
//       } else {
//         setReportData([]);
//         setHeaderInfo({});
//         setSummary({});
//       }
//     })
//     .catch((err) => {
//       console.error("❌ Failed to load rework report:", err);
//       setReportData([]);
//       setHeaderInfo({});
//       setSummary({});
//     })
//     .finally(() => setLoading(false));
// }, [uid]);

// // ✅ ADD: Date formatting function - FIXED TIMEZONE ISSUE
// const formatDateTime = (dateString) => {
//   if (!dateString) return "—";
//   try {
//     // Handle both Date objects and string dates
//     const date = dateString instanceof Date ? dateString : new Date(dateString);
    
//     // ✅ FIX: Check if it's a valid date (not NaN)
//     if (isNaN(date.getTime())) {
//       return "—";
//     }
    
//     // ✅ FIX: Use UTC methods to avoid timezone conversion
//     const day = String(date.getUTCDate()).padStart(2, '0');
//     const month = String(date.getUTCMonth() + 1).padStart(2, '0');
//     const year = date.getUTCFullYear();
    
//     return `${day}-${month}-${year}`;
//   } catch (error) {
//     return "—";
//   }
// };

//   // ✅ ADD: NEW function for table dates with time
//   const formatDateTimeForTable = (dateString) => {
//     if (!dateString) return "—";
//     try {
//       const date = new Date(dateString);
      
//       // ✅ FIX: Check if it's a valid date
//       if (isNaN(date.getTime())) {
//         return "—";
//       }
      
//       // ✅ FIX: Use UTC methods to avoid timezone conversion
//       const day = String(date.getUTCDate()).padStart(2, '0');
//       const month = String(date.getUTCMonth() + 1).padStart(2, '0');
//       const year = date.getUTCFullYear();
//       const hours = String(date.getUTCHours()).padStart(2, '0');
//       const minutes = String(date.getUTCMinutes()).padStart(2, '0');
//       const seconds = String(date.getUTCSeconds()).padStart(2, '0');
      
//       return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
//     } catch (error) {
//       return "—";
//     }
//   };

//   // ✅ ADD: Calculate result status for rework
//   const calculateResultStatus = (summary) => {
//     if (!summary || summary.totalProcesses === 0) return "—";
//     const approvedRate = (summary.approvedProcesses / summary.totalProcesses) * 100;
    
//     if (approvedRate >= 90) return "EXCELLENT";
//     if (approvedRate >= 75) return "GOOD";
//     if (approvedRate >= 50) return "FAIR";
//     return "NEEDS ATTENTION";
//   };

//   // ✅ ADD: Check if we should show "No reports found" message
// const shouldShowNoReportsMessage = () => {
//   const urlIncludeDate = searchParams.get('includeDateInReport');
//   const urlFromDate = searchParams.get('userSelectedFromDate');
//   const urlToDate = searchParams.get('userSelectedToDate');
  
//   const isScenario1 = urlIncludeDate === 'true' && urlFromDate && urlToDate;
//   const hasNoData = !hasData;
  
//   console.log('🔍 REWORK SHOULD SHOW NO REPORTS MESSAGE:', {
//     isScenario1,
//     hasNoData,
//     userFromDate: urlFromDate,
//     userToDate: urlToDate
//   });
  
//   return isScenario1 && hasNoData;
// };


// // ✅ ADD: Filter rework data by selected dates on frontend
// const getFilteredReworkData = () => {
//   const urlIncludeDate = searchParams.get('includeDateInReport');
//   const urlFromDate = searchParams.get('userSelectedFromDate');
//   const urlToDate = searchParams.get('userSelectedToDate');
  
//   const isScenario1 = urlIncludeDate === 'true' && urlFromDate && urlToDate;
  
//   if (!isScenario1 || !reportData.length) {
//     return reportData; // Return all data if no date filtering
//   }
  
//   console.log('🔍 FILTERING REWORK DATA BY DATES:', {
//     fromDate: urlFromDate,
//     toDate: urlToDate,
//     totalRecords: reportData.length
//   });
  
//   const filteredData = reportData.filter(item => {
//     if (!item.ProductionStartDate) return false;
    
//     const itemDate = new Date(item.ProductionStartDate);
//     const fromDate = new Date(urlFromDate);
//     const toDate = new Date(urlToDate);
    
//     // Set time to start/end of day for proper comparison
//     fromDate.setHours(0, 0, 0, 0);
//     toDate.setHours(23, 59, 59, 999);
//     itemDate.setHours(12, 0, 0, 0); // Neutral time for date comparison
    
//     return itemDate >= fromDate && itemDate <= toDate;
//   });
  
//   console.log('🔍 FILTERED REWORK DATA RESULT:', {
//     originalCount: reportData.length,
//     filteredCount: filteredData.length,
//     hasFilteredData: filteredData.length > 0
//   });
  
//   return filteredData;
// };

//   // ✅ ADD: Get badge color based on status
//   const getBadgeColor = (status) => {
//     switch (status) {
//       case 'EXCELLENT': return '#10b981';
//       case 'GOOD': return '#3b82f6';
//       case 'FAIR': return '#f59e0b';
//       case 'NEEDS ATTENTION': return '#ef4444';
//       default: return '#6b7280';
//     }
//   };
  
//   // ✅ UPDATE: Use filtered data for hasData check
//   const filteredData = getFilteredReworkData();
//   const hasData = filteredData && filteredData.length > 0;

//   // ✅ ADD: Get the correct dates to display
//   const displayDates = getDisplayDates();

//   return (
//     <div
//       className={`rework-report-container ${
//         embedded
//           ? "bg-white text-gray-900 p-4"
//           : "min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6"
//       }`}
//       id="full-report-page" // ✅ ADD THIS for full page capture
//     >
//       {/* ✅ NEW HEADER: Always show this header in embedded mode */}
//       {embedded && (
//         <header className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
//           {/* LOGO ON LEFT */}
//           <div className="flex items-center min-w-56 pl-8">
//             <img 
//               src={facteyes}
//               alt="Micrologic" 
//               className="h-[55px] w-auto scale-[1.15] object-contain"
//               onError={(e) => {
//                 console.log('Logo failed to load, trying alternative path');
//                 e.target.src = '/images/micrologic_image.png';
//                 e.target.onerror = null;
//               }} 
//             />
//           </div>
//           {/* HEADER CONTENT CENTERED */}
//           <div className="text-center flex-1">
//             <h1 className="text-2xl font-bold text-purple-600 uppercase tracking-wide">
//               Rework Approved Report 
//             </h1>
//             {uid && (
//               <div className="mt-3 flex items-center justify-center space-x-2">
//                 <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                   UID:
//                 </span>
//                 <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600">
//                   {uid}
//                 </span>
//               </div>
//             )}
//           </div>
//           {/* EMPTY DIV FOR BALANCE */}
//           <div className="min-w-56"></div>
//         </header>
//       )}

//       {/* ✅ Original header for full-page mode */}
//       {!embedded && (
//         <header className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
//           {/* LOGO ON LEFT */}
//           <div className="flex items-center min-w-56 pl-8">
//             <img 
//               src="/Facteyes_image.png" 
//               alt="FactEyes" 
//               className="h-12 w-auto" 
//               onError={(e) => {
//                 console.log('Logo failed to load, trying alternative path');
//                 e.target.src = '/images/Facteyes_image.png';
//                 e.target.onerror = null;
//               }} 
//             />
//           </div>
//           {/* HEADER CONTENT CENTERED */}
//           <div className="text-center flex-1">
//             <h1 className="text-2xl font-bold text-purple-600 uppercase tracking-wide">
//               Rework Approved Report
//             </h1>
//             {uid && (
//               <div className="mt-3 flex items-center justify-center space-x-2">
//                 <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
//                   UID:
//                 </span>
//                 <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600">
//                   {uid}
//                 </span>
//               </div>
//             )}
//           </div>
//           {/* EMPTY DIV FOR BALANCE */}
//           <div className="min-w-56"></div>
//         </header>
//       )}

//       {/* ✅ Conditional rendering */}
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
//             {/* ✅ Rework Summary Card */}
//             <SummaryCardRework 
//               className="summary-card-container"
//               pageMaxWidth="1200px"
//               uid={headerInfo.uid || uid}
//               modelName={headerInfo.model}
//               variant={headerInfo.variant}
//               // ✅ Rework specific summary data
//               totalProcesses={summary.totalProcesses || 0}
//               reworkProcesses={summary.reworkProcesses || 0}
//               approvedProcesses={summary.approvedProcesses || 0}
//               // ✅ Date parameters
//               displayFromRaw={displayDates.displayFrom}
//               displayToRaw={displayDates.displayTo}
//               fromTime={displayDates.displayFromTime}
//               toTime={displayDates.displayToTime}
//               // resultStatus={calculateResultStatus(summary)}
//               // badgeColor={getBadgeColor(calculateResultStatus(summary))}
//               formatDateTime={formatDateTime}
//             />

//             {/* 📊 Rework Table Section with increased spacing from SummaryCard */}
//             <div className="mt-12" id="rework-report-area">
//               <ReworkApprovedTable reportData={filteredData} />
//             </div>
            
//             {/* 🎛️ Controls Section: Only Export PDF button below table */}
//             <div className="mt-6 flex justify-center">
//               <ReportControls uid={uid} reportType="rework" />
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
//             <p className="text-lg font-medium">No rework data found for UID:</p>
//             <p className="text-purple-600 font-semibold mt-1">{uid}</p>
//             <p className="text-sm text-gray-600 mt-2">
//               The rework API returned no data for this UID with the current filters.
//             </p>
//           </div>
//         )}
//     </div>
//   );
// }



// ===========================
// ReworkReport.jsx — PART 1
// ===========================
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SummaryCardRework from "./SummaryCardRework";
import ReportControls from "./ReportControls";
import { ReworkApprovedTable } from "./ReworkApprovedtable";
import facteyes from '../public/micrologic_image.png';

const API_BASE = "http://localhost:4000";
const reworkReportCache = new Map();

export default function ReworkReport({
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
  const [headerInfo, setHeaderInfo] = useState({});
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);

  // ----------------------------
  // Responsive Helpers
  // ----------------------------
  const containerClasses =
    "rework-report-container " +
    (embedded
      ? "bg-white text-gray-900 p-4"
      : "min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6");

  const headerBase =
    "flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8 " +
    "border-b border-gray-200 dark:border-gray-700 pb-4";

  const headerLogoSize = "h-10 sm:h-12 md:h-[55px] w-auto";

  // ----------------------------
  // UID Update Logic
  // ----------------------------
  useEffect(() => {
    const latestUid = uidFromParent || uidFromUrl || "";
    if (latestUid && latestUid !== uid) setUid(latestUid);
  }, [uidFromParent, uidFromUrl]);

  // ----------------------------
  // Extract Time
  // ----------------------------
  const extractTimeFromDate = (dateString) => {
    if (!dateString) return '00:00:00';
    try {
      const date = new Date(dateString);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    } catch {
      return '00:00:00';
    }
  };

  // ----------------------------
  // Debug Date Logging
  // ----------------------------
  useEffect(() => {
    console.log('📅 Rework Date Parameters Received:', {
      includeDateInReport,
      userSelectedFromDate,
      userSelectedToDate,
      userSelectedFromTime,
      userSelectedToTime
    });
  }, [includeDateInReport, userSelectedFromDate, userSelectedToDate, userSelectedFromTime, userSelectedToTime]);

  // ----------------------------
  // Calculate Production Dates
  // ----------------------------
  const calculateProductionDates = (data) => {
    if (!data || data.length === 0)
      return { startDate: null, endDate: null, startTime: '00:00:00', endTime: '00:00:00' };

    let earliest = null, latest = null;
    let earlyTime = '00:00:00', lateTime = '00:00:00';

    data.forEach(item => {
      if (item.ProductionStartDate) {
        const d = new Date(item.ProductionStartDate);
        if (!earliest || d < earliest) {
          earliest = d;
          earlyTime = extractTimeFromDate(item.ProductionStartDate);
        }
      }
      if (item.ProductionEndDate) {
        const d = new Date(item.ProductionEndDate);
        if (!latest || d > latest) {
          latest = d;
          lateTime = extractTimeFromDate(item.ProductionEndDate);
        }
      }
    });

    return { startDate: earliest, endDate: latest, startTime: earlyTime, endTime: lateTime };
  };

  // ----------------------------
  // Get Display Dates
  // ----------------------------
  const getDisplayDates = () => {
    const prod = calculateProductionDates(reportData);

    const inc = searchParams.get('includeDateInReport');
    const from = searchParams.get('userSelectedFromDate');
    const to = searchParams.get('userSelectedToDate');
    const fTime = searchParams.get('userSelectedFromTime') || '00:00:00';
    const tTime = searchParams.get('userSelectedToTime') || '23:59:59';

    const userPicked = inc === 'true' && from && to;

    if (userPicked)
      return { displayFrom: from, displayTo: to, displayFromTime: fTime, displayToTime: tTime };

    return {
      displayFrom: prod.startDate,
      displayTo: prod.endDate,
      displayFromTime: prod.startTime,
      displayToTime: prod.endTime
    };
  };

  // ----------------------------
  // Fetch Rework Data (with Cache)
  // ----------------------------
  useEffect(() => {
    if (!uid) return;

    const cacheKey = `${uid}-rework`;
    if (reworkReportCache.has(cacheKey)) {
      const cachedData = reworkReportCache.get(cacheKey);
      setReportData(cachedData.tableData);
      setHeaderInfo(cachedData.header);
      setSummary(cachedData.summary);
      return setLoading(false);
    }

    setLoading(true);

    if (window.history?.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const url = `${API_BASE}/api/trace/rework-approved/uid/${encodeURIComponent(uid)}`;

    fetch(url)
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(data => {
        if (data.success) {
          const processed = {
            tableData: data.data.tableData || [],
            header: data.data.header || {},
            summary: data.data.summary || {}
          };

          reworkReportCache.set(cacheKey, processed);

          setReportData(processed.tableData);
          setHeaderInfo(processed.header);
          setSummary(processed.summary);
        }
      })
      .catch(err => {
        console.error("❌ Rework fetch error:", err);
        setReportData([]);
        setHeaderInfo({});
        setSummary({});
      })
      .finally(() => setLoading(false));
  }, [uid]);

  // ----------------------------
  // Date Formatting
  // ----------------------------
  const formatDateTime = (d) => {
    if (!d) return "—";
    try {
      const date = d instanceof Date ? d : new Date(d);
      if (isNaN(date.getTime())) return "—";
      const DD = String(date.getUTCDate()).padStart(2, '0');
      const MM = String(date.getUTCMonth() + 1).padStart(2, '0');
      const YY = date.getUTCFullYear();
      return `${DD}-${MM}-${YY}`;
    } catch {
      return "—";
    }
  };

  // ----------------------------
  // Table Date Formatting
  // ----------------------------
  const formatDateTimeForTable = (d) => {
    if (!d) return "—";
    try {
      const date = new Date(d);
      if (isNaN(date.getTime())) return "—";
      const DD = String(date.getUTCDate()).padStart(2, '0');
      const MM = String(date.getUTCMonth() + 1).padStart(2, '0');
      const YY = date.getUTCFullYear();
      const HH = String(date.getUTCHours()).padStart(2, '0');
      const MI = String(date.getUTCMinutes()).padStart(2, '0');
      const SS = String(date.getUTCSeconds()).padStart(2, '0');
      return `${DD}-${MM}-${YY} ${HH}:${MI}:${SS}`;
    } catch {
      return "—";
    }
  };

  // ----------------------------
  // Status Badge
  // ----------------------------
  const calculateResultStatus = (summary) => {
    if (!summary || summary.totalProcesses === 0) return "—";
    const pct = (summary.approvedProcesses / summary.totalProcesses) * 100;
    if (pct >= 90) return "EXCELLENT";
    if (pct >= 75) return "GOOD";
    if (pct >= 50) return "FAIR";
    return "NEEDS ATTENTION";
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case 'EXCELLENT': return '#10b981';
      case 'GOOD': return '#3b82f6';
      case 'FAIR': return '#f59e0b';
      case 'NEEDS ATTENTION': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // ----------------------------
  // Filtering Logic
  // ----------------------------
  const getFilteredReworkData = () => {
    const inc = searchParams.get('includeDateInReport');
    const from = searchParams.get('userSelectedFromDate');
    const to = searchParams.get('userSelectedToDate');

    const isScenario1 = inc === 'true' && from && to;

    if (!isScenario1 || !reportData.length) return reportData;

    const result = reportData.filter(item => {
      if (!item.ProductionStartDate) return false;
      const itemDate = new Date(item.ProductionStartDate);
      const f = new Date(from); f.setHours(0, 0, 0, 0);
      const t = new Date(to);   t.setHours(23, 59, 59, 999);
      itemDate.setHours(12, 0, 0, 0);
      return itemDate >= f && itemDate <= t;
    });

    return result;
  };

  const filteredData = getFilteredReworkData();
  const hasData = filteredData.length > 0;
  const displayDates = getDisplayDates();

  const shouldShowNoReportsMessage = () => {
    const inc = searchParams.get('includeDateInReport');
    const from = searchParams.get('userSelectedFromDate');
    const to = searchParams.get('userSelectedToDate');
    return inc === 'true' && from && to && !hasData;
  };

  // ===========================
  // START RENDER — HEADER + LOADER
  // ===========================
  return (
    <div className={containerClasses} id="full-report-page">

      {/* =======================
          RESPONSIVE HEADER
      ======================= */}
      {embedded ? (
        <header className={headerBase}>
          <img
            src={facteyes}
            alt="Micrologic"
            className={`${headerLogoSize} object-contain`}
            onError={(e) => {
              e.target.src = '/images/micrologic_image.png';
            }}
          />

          <div className="flex-1 text-center space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-purple-600 uppercase tracking-wide">
              Rework Approved Report
            </h1>

            {uid && (
              <div className="flex justify-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">UID:</span>
                <span className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                  {uid}
                </span>
              </div>
            )}
          </div>

          <div className="hidden sm:block w-[120px]"></div>
        </header>
      ) : (
        <header className={headerBase}>
          <img
            src="/Facteyes_image.png"
            alt="FactEyes"
            className={`${headerLogoSize} object-contain`}
            onError={(e) => {
              e.target.src = '/images/Facteyes_image.png';
            }}
          />

          <div className="flex-1 text-center space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold text-purple-600 uppercase tracking-wide">
              Rework Approved Report
            </h1>

            {uid && (
              <div className="flex justify-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">UID:</span>
                <span className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                  {uid}
                </span>
              </div>
            )}
          </div>

          <div className="hidden sm:block w-[120px]"></div>
        </header>
      )}

      {/* =======================
          LOADER — UNTOUCHED, ONLY WRAPPED
      ======================= */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-72 sm:h-80 lg:h-96 bg-gray-50 dark:bg-gray-900 mt-6">

          {/* FULL original loader kept exactly same */}
          <div className="relative w-36 h-24 sm:w-48 sm:h-32">
            {/* Pipeline */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-2.5 sm:h-3 bg-gradient-to-r from-slate-400 via-slate-500 to-slate-400 dark:from-slate-600 dark:via-slate-500 dark:to-slate-600 rounded-full shadow-inner">
              <div className="absolute inset-0 flex items-center justify-around">
                {[0,1,2,3,4].map(i => (
                  <div key={i} className="w-1 h-full bg-slate-300 dark:bg-slate-700"
                       style={{animation: 'pulseSegment 1.5s ease-in-out infinite', animationDelay: `${i*0.3}s`}}></div>
                ))}
              </div>
            </div>

            {/* Packets */}
            <div className="absolute inset-0 flex items-center">
              {[0,1,2,3].map(i => (
                <div key={i} className="absolute" style={{
                  animation: 'flowData 4s linear infinite',
                  animationDelay: `${i*1}s`,
                  left: '-8%'
                }}>
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg shadow-lg rotate-45">
                      <div className="absolute inset-1 border-2 border-cyan-200 rounded-lg"></div>
                    </div>
                    <div className="absolute top-1/2 right-full w-6 sm:w-8 h-0.5 bg-gradient-to-l from-cyan-400 to-transparent"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scanner Gates unchanged */}
            {/* LEFT */}
            <div className="absolute top-0 left-1/4 -translate-x-1/2 flex flex-col items-center">
              <div className="w-6 sm:w-8 h-12 sm:h-16 bg-gradient-to-b from-purple-500 to-purple-600 rounded-t-lg shadow-lg relative">
                <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-purple-300"
                     style={{animation: 'verticalScan 2s ease-in-out infinite', boxShadow: '0 0 8px rgba(168,85,247,0.8)'}}></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 sm:w-4 h-1 bg-purple-300 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="absolute top-0 right-1/4 translate-x-1/2 flex flex-col items-center">
              <div className="w-6 sm:w-8 h-12 sm:h-16 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-t-lg shadow-lg relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-300"
                     style={{animation: 'horizontalScan 1.8s ease-in-out infinite', boxShadow: '0 0 8px rgba(16,185,129,0.8)'}}></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 sm:w-4 h-1 bg-emerald-300 rounded-full animate-pulse"
                     style={{animationDelay: '0.3s'}}></div>
              </div>
            </div>

            {/* Indicator */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full shadow-md shadow-emerald-500 animate-pulse"></div>
                <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">Quality OK</span>
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="mt-10 text-center">
            <p className="text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Loading Report Data
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Please wait while we fetch the traceability information...
            </p>
          </div>
        </div>
      )}

      {/* ================================
          MAIN CONTENT (DATA PRESENT)
      ================================= */}
      {!loading && hasData && (
        <div className="space-y-8 mt-6">

          {/* ================================
              SUMMARY CARD (Responsive)
          ================================= */}
          <SummaryCardRework
            className="summary-card-container"
            pageMaxWidth="1200px"
            uid={headerInfo.uid || uid}
            modelName={headerInfo.model}
            variant={headerInfo.variant}

            totalProcesses={summary.totalProcesses || 0}
            reworkProcesses={summary.reworkProcesses || 0}
            approvedProcesses={summary.approvedProcesses || 0}

            displayFromRaw={displayDates.displayFrom}
            displayToRaw={displayDates.displayTo}
            fromTime={displayDates.displayFromTime}
            toTime={displayDates.displayToTime}

            formatDateTime={formatDateTime}
          />

          {/* ================================
              TABLE SECTION (Responsive)
          ================================= */}
          <div
            className="
              mt-10
              overflow-x-auto
              w-full
              bg-white dark:bg-gray-800
              rounded-xl
              shadow-md
              p-3 sm:p-4
            "
            id="rework-report-area"
          >
            <ReworkApprovedTable reportData={filteredData} />
          </div>

          {/* ================================
              CONTROLS SECTION — Export PDF
          ================================= */}
          <div
            className="
              mt-6
              flex
              justify-center sm:justify-end
              w-full
            "
          >
            <ReportControls uid={uid} reportType="rework" />
          </div>
        </div>
      )}

      {/* ================================
          NO DATA — USER SELECTED DATE RANGE
      ================================= */}
      {!loading && !hasData && shouldShowNoReportsMessage() && (
        <div
          className="
            flex flex-col
            items-center justify-center
            h-48 sm:h-64
            text-gray-500
            text-center
            px-4
          "
        >
          <p className="text-sm sm:text-lg font-medium text-red-600 mb-2">
            No reports found for the selected date.
          </p>

          <p className="text-xs sm:text-sm text-gray-600">
            Selected:
            {' '}
            {formatDateTime(searchParams.get('userSelectedFromDate'))}
            {' '}to{' '}
            {formatDateTime(searchParams.get('userSelectedToDate'))}
          </p>
        </div>
      )}

      {/* ================================
          NO DATA — GENERAL
      ================================= */}
      {!loading && !hasData && !shouldShowNoReportsMessage() && (
        <div
          className="
            flex flex-col items-center justify-center
            h-48 sm:h-64
            text-gray-500 text-center
          "
        >
          <p className="text-sm sm:text-lg font-medium">
            No rework data found for UID:
          </p>

          <p className="text-purple-600 font-semibold mt-1 text-xs sm:text-sm">
            {uid}
          </p>

          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            The rework API returned no data for this UID with the current filters.
          </p>
        </div>
      )}

    </div>  
  );
}
