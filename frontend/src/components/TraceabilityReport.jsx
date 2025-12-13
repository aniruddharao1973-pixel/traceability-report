// // // src/components/TraceabilityReport.jsx
// // import React, { useEffect, useState } from "react";
// // import { useSearchParams } from "react-router-dom";
// // import SummaryCard from "./SummaryCard";
// // import ReportControls from "./ReportControls";
// // import { ReportTable } from "./ReportTable";
// // import facteyes from '../public/micrologic_image.png';
// // // ✅ CHANGE #1: Ensure backend base URL is consistent
// // const API_BASE = "http://localhost:4000";

// // export default function TraceabilityReport({
// //   embedded = false,
// //   uidFromParent = "",
// //   mode = "complete",
// //   // ✅ ADD: Props from Header for date handling
// //   includeDateInReport = false,
// //   userSelectedFromDate = '',
// //   userSelectedToDate = '',
// //   userSelectedFromTime = '00:00:00',
// //   userSelectedToTime = '23:59:59'
// // }) {
// //   const [searchParams] = useSearchParams();
// //   const uidFromUrl = searchParams.get("uid");
// //   const [uid, setUid] = useState(uidFromParent || uidFromUrl || "");
// //   const [reportData, setReportData] = useState([]);
// //   const [loading, setLoading] = useState(false);
  
// //   // ✅ ADD: Date and time filter states (for internal use)
// //   const [fromDate, setFromDate] = useState('');
// //   const [toDate, setToDate] = useState('');
// //   const [fromTime, setFromTime] = useState('00:00:00');
// //   const [toTime, setToTime] = useState('23:59:59');



// //   // // ✅ ADD: Debug date parameters
// //   // useEffect(() => {
// //   //   console.log('📅 Date Parameters Received:', {
// //   //     includeDateInReport,
// //   //     userSelectedFromDate,
// //   //     userSelectedToDate,
// //   //     userSelectedFromTime,
// //   //     userSelectedToTime
// //   //   });
// //   // }, [includeDateInReport, userSelectedFromDate, userSelectedToDate, userSelectedFromTime, userSelectedToTime]);

// //   // // ✅ ADD: Calculate actual production dates from report data
// //   // const calculateProductionDates = (data) => {
// //   //   if (!data || data.length === 0) return { startDate: null, endDate: null };
    
// //   //   let earliestDate = null;
// //   //   let latestDate = null;
    
// //   //   data.forEach(item => {
// //   //     if (item.productionstartdate) {
// //   //       const startDate = new Date(item.productionstartdate);
// //   //       if (!earliestDate || startDate < earliestDate) {
// //   //         earliestDate = startDate;
// //   //       }
// //   //     }
      
// //   //     if (item.productionenddate) {
// //   //       const endDate = new Date(item.productionenddate);
// //   //       if (!latestDate || endDate > latestDate) {
// //   //         latestDate = endDate;
// //   //       }
// //   //     }
// //   //   });
    
// //   //   return {
// //   //     startDate: earliestDate,
// //   //     endDate: latestDate
// //   //   };
// //   // };

// //   // // ✅ ADD: Determine which dates to display
// //   // const getDisplayDates = () => {
// //   //   const productionDates = calculateProductionDates(reportData);
    
// //   //   console.log('🔍 Date Debug:', {
// //   //     includeDateInReport,
// //   //     userSelectedFromDate,
// //   //     userSelectedToDate,
// //   //     productionStart: productionDates.startDate,
// //   //     productionEnd: productionDates.endDate
// //   //   });
    
// //   //   if (includeDateInReport && userSelectedFromDate && userSelectedToDate) {
// //   //     // Scenario 1: Use user-selected dates from Reports Panel
// //   //     return {
// //   //       displayFrom: userSelectedFromDate,
// //   //       displayTo: userSelectedToDate,
// //   //       displayFromTime: userSelectedFromTime,
// //   //       displayToTime: userSelectedToTime
// //   //     };
// //   //   } else {
// //   //     // Scenario 2: Use actual production dates from data
// //   //     return {
// //   //       displayFrom: productionDates.startDate,
// //   //       displayTo: productionDates.endDate,
// //   //       displayFromTime: '00:00:00', // Default times for production dates
// //   //       displayToTime: '23:59:59'
// //   //     };
// //   //   }
// //   // };

  
// //     // 🔁 Update UID when parent or URL param changes
// //   useEffect(() => {
// //     const latestUid = uidFromParent || uidFromUrl || "";
// //     if (latestUid && latestUid !== uid) setUid(latestUid);
// //   }, [uidFromParent, uidFromUrl]);

// //     // ✅ ADD: Extract time from date string
// //   const extractTimeFromDate = (dateString) => {
// //     if (!dateString) return '00:00:00';
// //     try {
// //       const date = new Date(dateString);
// //       const hours = String(date.getHours()).padStart(2, '0');
// //       const minutes = String(date.getMinutes()).padStart(2, '0');
// //       const seconds = String(date.getSeconds()).padStart(2, '0');
// //       return `${hours}:${minutes}:${seconds}`;
// //     } catch (error) {
// //       return '00:00:00';
// //     }
// //   };


// //   // ✅ ADD: Debug date parameters
// //   useEffect(() => {
// //     console.log('📅 Date Parameters Received:', {
// //       includeDateInReport,
// //       userSelectedFromDate,
// //       userSelectedToDate,
// //       userSelectedFromTime,
// //       userSelectedToTime
// //     });
// //   }, [includeDateInReport, userSelectedFromDate, userSelectedToDate, userSelectedFromTime, userSelectedToTime]);

// //   // ✅ ADD: Calculate actual production dates WITH TIMES from report data
// //   const calculateProductionDates = (data) => {
// //     if (!data || data.length === 0) return { 
// //       startDate: null, 
// //       endDate: null,
// //       startTime: '00:00:00',
// //       endTime: '00:00:00'
// //     };
    
// //     let earliestDate = null;
// //     let latestDate = null;
// //     let earliestTime = '00:00:00';
// //     let latestTime = '00:00:00';
    
// //     data.forEach(item => {
// //       if (item.productionstartdate) {
// //         const startDate = new Date(item.productionstartdate);
// //         if (!earliestDate || startDate < earliestDate) {
// //           earliestDate = startDate;
// //           earliestTime = extractTimeFromDate(item.productionstartdate);
// //         }
// //       }
      
// //       if (item.productionenddate) {
// //         const endDate = new Date(item.productionenddate);
// //         if (!latestDate || endDate > latestDate) {
// //           latestDate = endDate;
// //           latestTime = extractTimeFromDate(item.productionenddate);
// //         }
// //       }
// //     });
    
// //     return {
// //       startDate: earliestDate,
// //       endDate: latestDate,
// //       startTime: earliestTime,
// //       endTime: latestTime
// //     };
// //   };

// //   // ✅ ADD: Determine which dates to display
// //   const getDisplayDates = () => {
// //     const productionDates = calculateProductionDates(reportData);
    
// //     // ✅ READ FROM URL PARAMETERS DIRECTLY
// //     const urlIncludeDate = searchParams.get('includeDateInReport');
// //     const urlFromDate = searchParams.get('userSelectedFromDate');
// //     const urlToDate = searchParams.get('userSelectedToDate');
// //     const urlFromTime = searchParams.get('userSelectedFromTime') || '00:00:00';
// //     const urlToTime = searchParams.get('userSelectedToTime') || '23:59:59';
    
// //     const shouldUseUserDates = urlIncludeDate === 'true' && urlFromDate && urlToDate;
    
// //     console.log('🔍📋 DATE SCENARIO CHECK:', {
// //       urlIncludeDate,
// //       urlFromDate,
// //       urlToDate, 
// //       urlFromTime,
// //       urlToTime,
// //       shouldUseUserDates,
// //       productionStart: productionDates.startDate,
// //       productionEnd: productionDates.endDate
// //     });
    
// //     // Scenario 1: User clicked "Include Date in Report" AND selected dates (from URL)
// //     if (shouldUseUserDates) {
// //       console.log('🎯📅 USING SCENARIO 1: USER-SELECTED dates and times FROM URL');
// //       return {
// //         displayFrom: urlFromDate,
// //         displayTo: urlToDate,
// //         displayFromTime: urlFromTime,
// //         displayToTime: urlToTime
// //       };
// //     } 
// //     // Scenario 2: Use actual production dates and times from data
// //     else {
// //       console.log('🎯📅 USING SCENARIO 2: PRODUCTION dates and times from data');
// //       return {
// //         displayFrom: productionDates.startDate,
// //         displayTo: productionDates.endDate,
// //         displayFromTime: productionDates.startTime,
// //         displayToTime: productionDates.endTime
// //       };
// //     }
// //   };


// //   // ✅ CHANGE #2: Automatically fetch data when UID changes
// //   useEffect(() => {
// //     if (!uid) return;
// //     setLoading(true);

// //     // 🧩 Hide UID query from browser address bar
// //     if (window.history && window.history.replaceState) {
// //       window.history.replaceState({}, document.title, window.location.pathname);
// //     }

// //     // ✅ CHANGE #3: Ensure URL hits the correct backend route
// //     const url = `${API_BASE}/api/trace/report?uid=${encodeURIComponent(uid)}&detail=1&mode=${encodeURIComponent(mode)}`;
// //     console.log("[TraceabilityReport] Fetching:", url);

// //     fetch(url)
// //       .then((res) => {
// //         if (!res.ok) throw new Error(`HTTP ${res.status}`);
// //         return res.json();
// //       })
// //       .then((data) => {
// //         console.log("[TraceabilityReport] fetched data:", data);
// //         setReportData(Array.isArray(data) ? data : []);
// //       })
// //       .catch((err) => {
// //         console.error("❌ Failed to load traceability report:", err);
// //         setReportData([]);
// //       })
// //       .finally(() => setLoading(false));
// //   }, [uid, mode]);

// //   // ✅ ADD: Date formatting function
// //   const formatDateTime = (dateString) => {
// //     if (!dateString) return "—";
// //     try {
// //       // Handle both Date objects and string dates
// //       const date = dateString instanceof Date ? dateString : new Date(dateString);
// //       const day = String(date.getDate()).padStart(2, '0');
// //       const month = String(date.getMonth() + 1).padStart(2, '0');
// //       const year = date.getFullYear();
      
// //       // ✅ ADD: Check if it's a valid date (not NaN)
// //       if (isNaN(date.getTime())) {
// //         return "—";
// //       }
      
// //       return `${day}-${month}-${year}`;
// //     } catch (error) {
// //       return "—";
// //     }
// //   };



// // src/components/TraceabilityReport.jsx
// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import SummaryCard from "./SummaryCard";
// import ReportControls from "./ReportControls";
// import { ReportTable } from "./ReportTable";
// import facteyes from '../public/micrologic_image.png';
// // ✅ CHANGE #1: Ensure backend base URL is consistent
// const API_BASE = "http://localhost:4000";

// // ✅ ADD: Cache declaration at the top
// const reportCache = new Map();

// export default function TraceabilityReport({
//   embedded = false,
//   uidFromParent = "",
//   mode = "complete",
//   // ✅ ADD: Props from Header for date handling
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
  
//   // ✅ ADD: Date and time filter states (for internal use)
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [fromTime, setFromTime] = useState('00:00:00');
//   const [toTime, setToTime] = useState('23:59:59');

//   // ✅ OPTIMIZED: Data fetching with cache (ONLY ONE useEffect for data fetching)
//   useEffect(() => {
//     if (!uid) return;
    
//     // Check cache first
//     const cacheKey = `${uid}-${mode}`;
//     // const cacheKey = uid;
//     if (reportCache.has(cacheKey)) {
//       console.log("[TraceabilityReport] Using cached data for:", cacheKey);
//       setReportData(reportCache.get(cacheKey));
//       setLoading(false);
//       return;
//     }

//     setLoading(true);

//     // Hide UID from URL
//     if (window.history?.replaceState) {
//       window.history.replaceState({}, document.title, window.location.pathname);
//     }

//     // const url = `${API_BASE}/api/trace?uid=${encodeURIComponent(uid)}&detail=1`;
//     const url = `${API_BASE}/api/trace/report?uid=${encodeURIComponent(uid)}&detail=1&mode=${encodeURIComponent(mode)}`;
//     // const url = `${API_BASE}/api/trace?uid=${encodeURIComponent(uid)}&detail=1&mode=${encodeURIComponent(mode)}`;

// //     const params = new URLSearchParams({
// //   uid,
// //   detail: 1,
// //   mode,
// // });

// // // ✅ Add date/time params if user selected "Include Date in Report"
// // if (includeDateInReport && userSelectedFromDate && userSelectedToDate) {
// //   params.set("fromDate", userSelectedFromDate);
// //   params.set("toDate", userSelectedToDate);
// //   params.set("fromTime", userSelectedFromTime || '00:00:00');
// //   params.set("toTime", userSelectedToTime || '23:59:59');
// // }

// // const url = `${API_BASE}/api/trace?${params.toString()}`;


//     console.log("[TraceabilityReport] Fetching:", url);

//     fetch(url)
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         return res.json();
//       })
//       .then((data) => {
//         const processedData = Array.isArray(data) ? data : [];
//         console.log("[TraceabilityReport] fetched data:", processedData);
        
//         // Cache the data
//         reportCache.set(cacheKey, processedData);
//         setReportData(processedData);
//       })
//       .catch((err) => {
//         console.error("❌ Failed to load traceability report:", err);
//         setReportData([]);
//       })
//       .finally(() => setLoading(false));
//   }, [uid, mode]);
  
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
//     console.log('📅 Date Parameters Received:', {
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
//       if (item.productionstartdate) {
//         const startDate = new Date(item.productionstartdate);
//         if (!earliestDate || startDate < earliestDate) {
//           earliestDate = startDate;
//           earliestTime = extractTimeFromDate(item.productionstartdate);
//         }
//       }
      
//       if (item.productionenddate) {
//         const endDate = new Date(item.productionenddate);
//         if (!latestDate || endDate > latestDate) {
//           latestDate = endDate;
//           latestTime = extractTimeFromDate(item.productionenddate);
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
    
//     console.log('🔍📋 DATE SCENARIO CHECK:', {
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
//       console.log('🎯📅 USING SCENARIO 1: USER-SELECTED dates and times FROM URL');
//       return {
//         displayFrom: urlFromDate,
//         displayTo: urlToDate,
//         displayFromTime: urlFromTime,
//         displayToTime: urlToTime
//       };
//     } 
//     // Scenario 2: Use actual production dates and times from data
//     else {
//       console.log('🎯📅 USING SCENARIO 2: PRODUCTION dates and times from data');
//       return {
//         displayFrom: productionDates.startDate,
//         displayTo: productionDates.endDate,
//         displayFromTime: productionDates.startTime,
//         displayToTime: productionDates.endTime
//       };
//     }
//   };

//   // ✅ ADD: Date formatting function
//   const formatDateTime = (dateString) => {
//     if (!dateString) return "—";
//     try {
//       // Handle both Date objects and string dates
//       const date = dateString instanceof Date ? dateString : new Date(dateString);
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const year = date.getFullYear();
      
//       // ✅ ADD: Check if it's a valid date (not NaN)
//       if (isNaN(date.getTime())) {
//         return "—";
//       }
      
//       return `${day}-${month}-${year}`;
//     } catch (error) {
//       return "—";
//     }
//   };

//   // ✅ ADD: Calculate result status
//   // const calculateResultStatus = (data) => {
//   //   if (!data || data.length === 0) return "—";
//   //   const hasFail = data.some(item => item.productstatus === "FAIL");
//   //   return hasFail ? "FAIL" : "PASS";
//   // };

//       const calculateResultStatus = (data) => {
//       if (!data || data.length === 0) return "—";
      
//       // Get the last row's productstatus
//       const lastRow = data[data.length - 1];
//       return lastRow?.productstatus || "—";
//     };

//   // ✅ CHANGE #4: Added graceful empty data handling
//   const hasData = reportData && reportData.length > 0;

//   // ✅ ADD: Get the correct dates to display
//   const displayDates = getDisplayDates();
//   // ✅ ADD: Check if user dates are within production range
// const checkUserDatesInRange = (userFromDate, userToDate, productionStart, productionEnd) => {
//   if (!userFromDate || !userToDate || !productionStart || !productionEnd) return false;
  
//   try {
//     const userFrom = new Date(userFromDate);
//     const userTo = new Date(userToDate);
//     const prodStart = new Date(productionStart);
//     const prodEnd = new Date(productionEnd);
    
//     // Check if user dates overlap with production dates
//     return userFrom <= prodEnd && userTo >= prodStart;
//   } catch (error) {
//     console.error('Error comparing dates:', error);
//     return false;
//   }
// };

//   return (
//     <div
//       className={`traceability-report-container ${
//         embedded
//           ? "bg-white text-gray-900 p-4"
//           : "min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6"
//       }`}
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
//               Traceability Report 
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
//               Traceability Report
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

//       {/* <style jsx>{`
//         @keyframes flowData {
//           0% {
//             left: -8%;
//             opacity: 0;
//             transform: scale(0.8);
//           }
//           5% {
//             opacity: 1;
//             transform: scale(1);
//           }
//           95% {
//             opacity: 1;
//             transform: scale(1);
//           }
//           100% {
//             left: 108%;
//             opacity: 0;
//             transform: scale(0.8);
//           }
//         }

//         @keyframes verticalScan {
//           0%, 100% {
//             top: 0;
//             opacity: 0.3;
//           }
//           50% {
//             top: 100%;
//             opacity: 1;
//           }
//         }

//         @keyframes horizontalScan {
//           0%, 100% {
//             left: 0;
//             opacity: 0.3;
//           }
//           50% {
//             left: 100%;
//             opacity: 1;
//           }
//         }

//         @keyframes pulseSegment {
//           0%, 100% {
//             opacity: 0.3;
//           }
//           50% {
//             opacity: 1;
//           }
//         }

//         @keyframes barPulse {
//           0%, 100% {
//             opacity: 0.5;
//             transform: scaleY(0.8);
//           }
//           50% {
//             opacity: 1;
//             transform: scaleY(1.2);
//           }
//         }

//         @keyframes progressRing {
//           0% {
//             strokeDashoffset: 88;
//           }
//           50% {
//             strokeDashoffset: 22;
//           }
//           100% {
//             strokeDashoffset: 88;
//           }
//         }
//       `}</style> */}
//     </div>


        
//       // ) : hasData ? (
//       //   <div className="space-y-8">
//       //     {/* ✅ FIX: Pass the correct dates based on includeDateInReport */}
//       //     <SummaryCard 
//       //       className="summary-card-container"
//       //       pageMaxWidth="1200px"
//       //       uid={uid}
//       //       uidCount={reportData.length}
//       //       modelName={reportData[0]?.productmodelname}
//       //       variant={reportData[0]?.productvariant}
//       //       eoluid={reportData[0]?.endoflineuid}
//       //       displayFromRaw={displayDates.displayFrom}
//       //       displayToRaw={displayDates.displayTo}
//       //       fromTime={displayDates.displayFromTime}
//       //       toTime={displayDates.displayToTime}
//       //       resultStatus={calculateResultStatus(reportData)}
//       //       formatDateTime={formatDateTime}
//       //     />


//         ) : hasData ? (
//           <div className="space-y-8">
//             {/* ✅ ADD: Check for Scenario 1 with no matching data */}
//             {(() => {
//               const displayDates = getDisplayDates();
//               const productionDates = calculateProductionDates(reportData);
              
//               // ✅ SCENARIO 1: User selected dates but no data in that range
//               const urlIncludeDate = searchParams.get('includeDateInReport');
//               const urlFromDate = searchParams.get('userSelectedFromDate');
//               const urlToDate = searchParams.get('userSelectedToDate');
              
//               const isScenario1 = urlIncludeDate === 'true' && urlFromDate && urlToDate;
//               const hasDataInRange = isScenario1 
//                 ? checkUserDatesInRange(urlFromDate, urlToDate, productionDates.startDate, productionDates.endDate)
//                 : true;
              
//               console.log('🔍 SCENARIO CHECK:', {
//                 isScenario1,
//                 hasDataInRange,
//                 userFromDate: urlFromDate,
//                 userToDate: urlToDate,
//                 productionStart: productionDates.startDate,
//                 productionEnd: productionDates.endDate
//               });
              
//               if (isScenario1 && !hasDataInRange) {
//                 return (
//                   <div className="flex flex-col items-center justify-center h-64 text-gray-500">
//                     <div className="text-center">
//                       <p className="text-lg font-medium text-red-600 mb-2">
//                         No reports found for the selected date.
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         Selected: {formatDateTime(urlFromDate)} to {formatDateTime(urlToDate)}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               }
              
//               // ✅ Normal data display
//               return (
//                 <>
//                   <SummaryCard 
//                     className="summary-card-container"
//                     pageMaxWidth="1200px"
//                     uid={uid}
//                     uidCount={reportData.length}
//                     modelName={reportData[0]?.productmodelname}
//                     variant={reportData[0]?.productvariant}
//                     eoluid={reportData[0]?.endoflineuid}
//                     displayFromRaw={displayDates.displayFrom}
//                     displayToRaw={displayDates.displayTo}
//                     fromTime={displayDates.displayFromTime}
//                     toTime={displayDates.displayToTime}
//                     resultStatus={calculateResultStatus(reportData)}
//                     formatDateTime={formatDateTime}
//                   />
                  
//                   {/* 📊 Table Section with increased spacing from SummaryCard */}
//                   <div className="mt-12" id="report-area">
//                     <ReportTable reportData={reportData} />
//                   </div>
                  
//                   {/* 🎛️ Controls Section: Only Export PDF button below table */}
//                   <div className="mt-6 flex justify-center">
//                     <ReportControls uid={uid} />
//                   </div>
//                 </>
//               );
//             })()}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center h-64 text-gray-500">
//             <p className="text-lg font-medium">No data found for UID:</p>
//             <p className="text-purple-600 font-semibold mt-1">{uid}</p>
//           </div>
//         )}
//       </div>
//     );
// }

// ========================= PART 1 START =========================
// src/components/TraceabilityReport.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SummaryCard from "./SummaryCard";
import ReportControls from "./ReportControls";
import { ReportTable } from "./ReportTable";
import facteyes from '../public/micrologic_image.png';

// Backend base URL
const API_BASE = "http://localhost:4000";

// Cache
const reportCache = new Map();

export default function TraceabilityReport({
  embedded = false,
  uidFromParent = "",
  mode = "complete",
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

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [fromTime, setFromTime] = useState('00:00:00');
  const [toTime, setToTime] = useState('23:59:59');

  // Fetch report
  useEffect(() => {
    if (!uid) return;

    const cacheKey = `${uid}-${mode}`;
    if (reportCache.has(cacheKey)) {
      setReportData(reportCache.get(cacheKey));
      setLoading(false);
      return;
    }

    setLoading(true);

    if (window.history?.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const url = `${API_BASE}/api/trace/report?uid=${encodeURIComponent(uid)}&detail=1&mode=${encodeURIComponent(mode)}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        reportCache.set(cacheKey, arr);
        setReportData(arr);
      })
      .catch(() => setReportData([]))
      .finally(() => setLoading(false));
  }, [uid, mode]);

  // Keep UID synced
  useEffect(() => {
    const latestUid = uidFromParent || uidFromUrl || "";
    if (latestUid && latestUid !== uid) setUid(latestUid);
  }, [uidFromParent, uidFromUrl]);

  // Helpers
  const extractTimeFromDate = (str) => {
    if (!str) return '00:00:00';
    const d = new Date(str);
    if (isNaN(d.getTime())) return '00:00:00';
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  };

  const calculateProductionDates = (data) => {
    if (!data?.length)
      return { startDate: null, endDate: null, startTime: '00:00:00', endTime: '00:00:00' };

    let earliest = null;
    let latest = null;
    let est = '00:00:00';
    let elt = '00:00:00';

    data.forEach((row) => {
      if (row.productionstartdate) {
        const d = new Date(row.productionstartdate);
        if (!earliest || d < earliest) {
          earliest = d;
          est = extractTimeFromDate(row.productionstartdate);
        }
      }
      if (row.productionenddate) {
        const d = new Date(row.productionenddate);
        if (!latest || d > latest) {
          latest = d;
          elt = extractTimeFromDate(row.productionenddate);
        }
      }
    });

    return { startDate: earliest, endDate: latest, startTime: est, endTime: elt };
  };

  const formatDateTime = (value) => {
    if (!value) return "—";
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return "—";
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  };

  const calculateResultStatus = (data) =>
    !data?.length ? "—" : data[data.length - 1]?.productstatus || "—";

  const productionDates = calculateProductionDates(reportData);

  const getDisplayDates = () => {
    const urlInc = searchParams.get('includeDateInReport');
    const f = searchParams.get('userSelectedFromDate');
    const t = searchParams.get('userSelectedToDate');
    const ft = searchParams.get('userSelectedFromTime') || '00:00:00';
    const tt = searchParams.get('userSelectedToTime') || '23:59:59';

    const useUser = urlInc === 'true' && f && t;

    return useUser
      ? { displayFrom: f, displayTo: t, displayFromTime: ft, displayToTime: tt }
      : {
          displayFrom: productionDates.startDate,
          displayTo: productionDates.endDate,
          displayFromTime: productionDates.startTime,
          displayToTime: productionDates.endTime
        };
  };

  const checkUserDatesInRange = (uf, ut, ps, pe) => {
    if (!uf || !ut || !ps || !pe) return false;
    try {
      const a = new Date(uf);
      const b = new Date(ut);
      const c = new Date(ps);
      const d = new Date(pe);
      return a <= d && b >= c;
    } catch {
      return false;
    }
  };

  const hasData = reportData.length > 0;
  const displayDates = getDisplayDates();

  return (
    <div
      className={`
        traceability-report-container 
        ${embedded
          ? "bg-white text-gray-900 p-4"
          : "min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-10"
        }
      `}
    >

      {/* ---------------- HEADER (Responsive) ---------------- */}
      {embedded ? (
        <header className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 gap-4">
          <div className="flex items-center min-w-40 sm:min-w-56 justify-center sm:justify-start">
            <img
              src={facteyes}
              alt="Micrologic"
              className="h-12 w-auto sm:h-[55px]"
            />
          </div>

          <div className="text-center flex-1 px-2">
            <h1 className="text-xl sm:text-2xl font-bold text-purple-600 uppercase tracking-wide">
              Traceability Report
            </h1>
            {uid && (
              <div className="mt-2 flex items-center justify-center space-x-2">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">UID:</span>
                <span className="text-xs sm:text-sm font-semibold bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600">
                  {uid}
                </span>
              </div>
            )}
          </div>

          <div className="min-w-40 sm:min-w-56"></div>
        </header>
      ) : (
        <header className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 gap-4">
          <div className="flex items-center min-w-40 sm:min-w-56 justify-center sm:justify-start">
            <img
              src="/Facteyes_image.png"
              alt="FactEyes"
              className="h-10 sm:h-12"
            />
          </div>

          <div className="text-center flex-1 px-2">
            <h1 className="text-xl sm:text-2xl font-bold text-purple-600 uppercase tracking-wide">
              Traceability Report
            </h1>
            {uid && (
              <div className="mt-2 flex items-center justify-center space-x-2">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">UID:</span>
                <span className="text-xs sm:text-sm font-semibold bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600">
                  {uid}
                </span>
              </div>
            )}
          </div>

          <div className="min-w-40 sm:min-w-56"></div>
        </header>
      )}

      {/* ---------------- LOADER (Responsive Wrapper Only) ---------------- */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-72 sm:h-96 bg-gray-50 dark:bg-gray-900 px-2">
          <div className="relative w-40 sm:w-48 h-24 sm:h-32">
            {/* (Your full original loader markup kept exactly same) */}

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

            {/* Data packets */}
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
                    <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg shadow-lg transform rotate-45">
                      <div className="absolute inset-1 border-2 border-cyan-200 rounded-lg"></div>
                    </div>
                    <div className="absolute top-1/2 right-full w-6 sm:w-8 h-0.5 bg-gradient-to-l from-cyan-400 to-transparent"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scanner Gate Left */}
            <div className="absolute top-0 left-1/4 -translate-x-1/2 flex flex-col items-center">
              <div className="w-6 sm:w-8 h-12 sm:h-16 bg-gradient-to-b from-purple-500 to-purple-600 rounded-t-lg shadow-lg relative">
                <div
                  className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-purple-300"
                  style={{
                    animation: 'verticalScan 2s ease-in-out infinite',
                    boxShadow: '0 0 8px rgba(168, 85, 247, 0.8)',
                  }}
                ></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 sm:w-4 h-1 bg-purple-300 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Scanner Gate Right */}
            <div className="absolute top-0 right-1/4 -translate-x-1/2 flex flex-col items-center">
              <div className="w-6 sm:w-8 h-12 sm:h-16 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-t-lg shadow-lg relative">
                <div
                  className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-300"
                  style={{
                    animation: 'horizontalScan 1.8s ease-in-out infinite',
                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)',
                  }}
                ></div>
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 sm:w-4 h-1 bg-emerald-300 rounded-full animate-pulse"
                  style={{ animationDelay: '0.3s' }}
                ></div>
              </div>
            </div>

            {/* Bottom Indicator */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500"
                  style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
                ></div>
                <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                  Quality OK
                </span>
              </div>
            </div>
          </div>

          {/* Loading text */}
          <div className="mt-16 sm:mt-20 text-center px-2">
            <p className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Loading Report Data
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Please wait while we fetch the traceability information...
            </p>
          </div>
        </div>
      )}

      {/* ======================== MAIN CONTENT ======================== */}
      {!loading && hasData ? (
        <div className="space-y-10 sm:space-y-12 lg:space-y-16">

          {/* ========== Scenario Check Wrapper (Responsive) ========== */}
          {(() => {
            const productionDates = calculateProductionDates(reportData);
            const urlInc = searchParams.get('includeDateInReport');
            const f = searchParams.get('userSelectedFromDate');
            const t = searchParams.get('userSelectedToDate');

            const isScenario1 = urlInc === 'true' && f && t;
            const matchRange = isScenario1
              ? checkUserDatesInRange(f, t, productionDates.startDate, productionDates.endDate)
              : true;

            if (isScenario1 && !matchRange) {
              return (
                <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-gray-500 px-2">
                  <p className="text-sm sm:text-lg font-medium text-red-600 mb-2">
                    No reports found for the selected date.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Selected: {formatDateTime(f)} to {formatDateTime(t)}
                  </p>
                </div>
              );
            }

            return (
              <>
                {/* ================= SummaryCard ================= */}
                <SummaryCard
                  pageMaxWidth="1200px"
                  uid={uid}
                  uidCount={reportData.length}
                  modelName={reportData[0]?.productmodelname}
                  variant={reportData[0]?.productvariant}
                  eoluid={reportData[0]?.endoflineuid}
                  displayFromRaw={displayDates.displayFrom}
                  displayToRaw={displayDates.displayTo}
                  fromTime={displayDates.displayFromTime}
                  toTime={displayDates.displayToTime}
                  resultStatus={calculateResultStatus(reportData)}
                  formatDateTime={formatDateTime}
                />

                {/* ================= Table Section ================= */}
                <div className="mt-10 sm:mt-12 px-1 sm:px-4 lg:px-6" id="report-area">
                  <ReportTable reportData={reportData} />
                </div>

                {/* ================= Controls Section ================= */}
                <div className="mt-8 sm:mt-10 flex justify-center px-2">
                  <ReportControls uid={uid} />
                </div>
              </>
            );
          })()}
        </div>
      ) : null}

      {/* ======================== EMPTY DATA ======================== */}
      {!loading && !hasData && (
        <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-gray-500 px-2">
          <p className="text-sm sm:text-lg font-medium">No data found for UID:</p>
          <p className="text-purple-600 font-semibold mt-1 text-base sm:text-lg">
            {uid}
          </p>
        </div>
      )}
    </div>
  );
}
// ========================= PART 2 END =========================

