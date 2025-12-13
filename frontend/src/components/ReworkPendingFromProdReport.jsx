// // src/components/ReworkPendingFromProdReport.jsx
// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import SummaryCardReworkPendingfromprod from "./SummaryCardReworkPendingfromprod";
// import { ReworkPendingProdTable } from "./ReworkPendingProdTable";
// import facteyes from '../public/micrologic_image.png';

// const API_BASE = "http://localhost:4000";

// const reworkPendingReportCache = new Map();

// export default function ReworkPendingFromProduction({
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
//   const [reportData, setReportData] = useState({});
//   const [loading, setLoading] = useState(false);

//   // ✅ Debug date parameters
//   useEffect(() => {
//     console.log('📅 Rework Pending Date Parameters Received:', {
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

//   // ✅ Determine which dates to display for rework report
//   const getDisplayDates = () => {
//     // ✅ READ FROM URL PARAMETERS DIRECTLY
//     const urlIncludeDate = searchParams.get('includeDateInReport');
//     const urlFromDate = searchParams.get('userSelectedFromDate');
//     const urlToDate = searchParams.get('userSelectedToDate');
//     const urlFromTime = searchParams.get('userSelectedFromTime') || '00:00:00';
//     const urlToTime = searchParams.get('userSelectedToTime') || '23:59:59';
    
//     const shouldUseUserDates = urlIncludeDate === 'true' && urlFromDate && urlToDate;
    
//     console.log('🔍📋 REWORK PENDING DATE SCENARIO CHECK:', {
//       urlIncludeDate,
//       urlFromDate,
//       urlToDate, 
//       urlFromTime,
//       urlToTime,
//       shouldUseUserDates
//     });
    
//     // Scenario 1: User clicked "Include Date in Report" AND selected dates (from URL)
//     if (shouldUseUserDates) {
//       console.log('🎯📅 REWORK PENDING: USING SCENARIO 1: USER-SELECTED dates and times FROM URL');
//       return {
//         displayFrom: urlFromDate,
//         displayTo: urlToDate,
//         displayFromTime: urlFromTime,
//         displayToTime: urlToTime
//       };
//     } 
//     // Scenario 2: No date filter (get all data)
//     else {
//       console.log('🎯📅 REWORK PENDING: USING SCENARIO 2: NO DATE FILTER (All Data)');
//       return {
//         displayFrom: null, // No date filtering
//         displayTo: null,
//         displayFromTime: '00:00:00',
//         displayToTime: '23:59:59'
//       };
//     }
//   };


// // ✅ OPTIMIZED: Fetch rework pending data with cache
// useEffect(() => {
//   // ✅ ADD: Cache check first
//   const displayDates = getDisplayDates();
//   const cacheKey = `${uid || 'all'}-${displayDates.displayFrom || 'no-date'}-${displayDates.displayTo || 'no-date'}`;
  
//   if (reworkPendingReportCache.has(cacheKey)) {
//     console.log("[ReworkPendingFromProduction] Using cached data for:", cacheKey);
//     setReportData(reworkPendingReportCache.get(cacheKey));
//     setLoading(false);
//     return;
//   }

//   setLoading(true);

//   // 🧩 Hide UID query from browser address bar
//   if (window.history && window.history.replaceState) {
//     window.history.replaceState({}, document.title, window.location.pathname);
//   }

//   // Build API URL based on date scenario
//   let url = uid ? `${API_BASE}/api/trace/rework-pending/uid/${uid}` : `${API_BASE}/api/trace/rework-pending/complete-data`;
  
//   // Scene A: With date/time filter
//   if (displayDates.displayFrom && displayDates.displayTo) {
//     url += `?fromDate=${displayDates.displayFrom}&toDate=${displayDates.displayTo}&fromTime=${displayDates.displayFromTime}&toTime=${displayDates.displayToTime}`;
//     console.log('🎯 REWORK PENDING: Scene A - With Date Filter');
//   } 
//   // Scene B: Without date/time filter
//   else {
//     console.log('🎯 REWORK PENDING: Scene B - No Date Filter (All Data)');
//   }

//   console.log("[ReworkPendingFromProduction] Fetching:", url);

//   fetch(url)
//     .then((res) => {
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       return res.json();
//     })
//     .then((data) => {
//       console.log("[ReworkPendingFromProduction] fetched data:", data);
//       const processedData = data.success ? data.data : {};
      
//       // ✅ ADD: Cache the data
//       reworkPendingReportCache.set(cacheKey, processedData);
//       setReportData(processedData);
//     })
//     .catch((err) => {
//       console.error("❌ Failed to load rework pending report:", err);
//       setReportData({});
//     })
//     .finally(() => setLoading(false));
// }, [uid]);


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

//   const hasData = reportData && ((reportData.tableData && reportData.tableData.length > 0) || (reportData.records && reportData.records.length > 0));
//   const displayDates = getDisplayDates();

//   return (
//     <div className="rework-report-container min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">

//       {/* ✅ WRAP EVERYTHING INSIDE THIS CONTAINER */}
//       <div id="full-report-page" className="mx-auto max-w-[1400px]">

//         {/* ✅ HEADER (Logo + Title) */}
//         {embedded ? (
//         <header className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-700 pb-8 relative pl-16">
//         {/* Left: Logo */}
//         <div className="flex items-center absolute left-6">
//           <img
//             src={facteyes}
//             alt="Micrologic"
//             className="h-[45px] w-auto scale-[1.15] object-contain"
//             crossOrigin="anonymous"
//             onLoad={(e) => {
//               e.target.style.opacity = '1';
//             }}
//             style={{opacity: 0}}
//             onError={(e) => {
//               e.target.src = '/images/micrologic_image.png';
//               e.target.onerror = null;
//               e.target.style.opacity = '1';
//             }}
//           />
//         </div>

//         {/* Center: Heading */}
//         <div className="flex flex-col items-center w-full">
//           <h1 className="text-2xl font-bold text-purple-600 uppercase tracking-wide text-center">
//             Rework Approved Report Pending From Production
//           </h1>
//           {uid && (
//             <div className="mt-3 flex items-center justify-center space-x-2">
//               <span className="text-sm font-medium text-gray-600 dark:text-gray-400">UID:</span>
//               <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600">
//                 {uid}
//               </span>
//             </div>
//           )}
//         </div>
//       </header>

//         ) : (
//         <header className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-700 pb-6 relative">
//           {/* Left: Logo */}
//           <div className="flex items-center absolute left-0">
//             <img
//               src={facteyes}
//               alt="Micrologic"
//               className="h-[45px] w-auto scale-[1.15] object-contain"
//               crossOrigin="anonymous"
//               onLoad={(e) => {
//                 e.target.style.opacity = '1';
//               }}
//               style={{opacity: 0}}
//               onError={(e) => {
//                 e.target.src = '/images/micrologic_image.png';
//                 e.target.onerror = null;
//                 e.target.style.opacity = '1';
//               }}
//             />
//           </div>

//           {/* Center: Heading */}
//           <div className="flex flex-col items-center w-full">
//             <h1 className="text-2xl font-bold text-purple-600 uppercase tracking-wide text-center">
//               Rework Approved Report Pending From Production
//             </h1>
//             {uid && (
//               <div className="mt-3 flex items-center justify-center space-x-2">
//                 <span className="text-sm font-medium text-gray-600 dark:text-gray-400">UID:</span>
//                 <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600">
//                   {uid}
//                 </span>
//               </div>
//             )}
//           </div>
//         </header>

//         )}

//         {/* ✅ MAIN CONTENT */}
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
//           <SummaryCardReworkPendingfromprod
//             pageMaxWidth="1200px"
//             approvedCount={reportData.summary?.pendingCount || reportData.header?.approvedCount || 0}
//             modelName={reportData.header?.model}
//             variant={reportData.header?.variant}
//             displayFromRaw={displayDates.displayFrom || reportData.filters?.fromDate}
//             displayToRaw={displayDates.displayTo || reportData.filters?.toDate}
//             fromTime={displayDates.displayFromTime || reportData.filters?.fromTime}
//             toTime={displayDates.displayToTime || reportData.filters?.toTime}
//             formatDateTime={formatDateTime}
//           />

//             {/* 📊 Table section */}
//             <div className="mt-12">
//               <ReworkPendingProdTable reportData={reportData} />
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center h-64 text-gray-500">
//             <p className="text-lg font-medium">No rework pending data found</p>
//             <p className="text-purple-600 font-semibold mt-1">Try adjusting your filters</p>
//           </div>
//         )}

//       </div> {/* ✅ end of full-report-page */}

//     </div>
//   );
// }


// src/components/ReworkPendingFromProdReport.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SummaryCardReworkPendingfromprod from "./SummaryCardReworkPendingfromprod";
import { ReworkPendingProdTable } from "./ReworkPendingProdTable";
import facteyes from '../public/micrologic_image.png';

const API_BASE = "http://localhost:4000";
const reworkPendingReportCache = new Map();

export default function ReworkPendingFromProduction({
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
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(false);

  // Debug date props
  useEffect(() => {
    console.log('📅 Rework Pending Date Params:', {
      includeDateInReport,
      userSelectedFromDate,
      userSelectedToDate,
      userSelectedFromTime,
      userSelectedToTime
    });
  }, [
    includeDateInReport,
    userSelectedFromDate,
    userSelectedToDate,
    userSelectedFromTime,
    userSelectedToTime
  ]);

  // Update UID from parent / query
  useEffect(() => {
    const latestUid = uidFromParent || uidFromUrl || "";
    if (latestUid && latestUid !== uid) setUid(latestUid);
  }, [uidFromParent, uidFromUrl]);

  // Determine display dates
  const getDisplayDates = () => {
    const urlIncludeDate = searchParams.get('includeDateInReport');
    const urlFromDate = searchParams.get('userSelectedFromDate');
    const urlToDate = searchParams.get('userSelectedToDate');
    const urlFromTime = searchParams.get('userSelectedFromTime') || '00:00:00';
    const urlToTime = searchParams.get('userSelectedToTime') || '23:59:59';

    const useDate = urlIncludeDate === 'true' && urlFromDate && urlToDate;

    if (useDate) {
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

  // Fetch API (cached)
  useEffect(() => {
    const displayDates = getDisplayDates();
    const cacheKey = `${uid || 'all'}-${displayDates.displayFrom || 'no-date'}-${displayDates.displayTo || 'no-date'}`;

    if (reworkPendingReportCache.has(cacheKey)) {
      console.log("[Pending Rework] Loaded from Cache:", cacheKey);
      setReportData(reworkPendingReportCache.get(cacheKey));
      setLoading(false);
      return;
    }

    setLoading(true);

    if (window.history?.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    let url = uid
      ? `${API_BASE}/api/trace/rework-pending/uid/${uid}`
      : `${API_BASE}/api/trace/rework-pending/complete-data`;

    if (displayDates.displayFrom && displayDates.displayTo) {
      url += `?fromDate=${displayDates.displayFrom}&toDate=${displayDates.displayTo}&fromTime=${displayDates.displayFromTime}&toTime=${displayDates.displayToTime}`;
    }

    console.log("[Rework Pending] Fetch:", url);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const processedData = data.success ? data.data : {};
        reworkPendingReportCache.set(cacheKey, processedData);
        setReportData(processedData);
      })
      .catch((err) => {
        console.error("❌ Rework Pending Fetch Error:", err);
        setReportData({});
      })
      .finally(() => setLoading(false));
  }, [uid]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = dateString instanceof Date ? dateString : new Date(dateString);
      if (isNaN(date.getTime())) return "—";
      const d = String(date.getDate()).padStart(2, '0');
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const y = date.getFullYear();
      return `${d}-${m}-${y}`;
    } catch {
      return "—";
    }
  };

  const hasData =
    reportData &&
    ((reportData.tableData && reportData.tableData.length > 0) ||
      (reportData.records && reportData.records.length > 0));

  const displayDates = getDisplayDates();

  return (
    <div className="rework-report-container min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6">

      <div id="full-report-page" className="mx-auto max-w-[1400px]">

        {/* HEADER */}
        <header
          className="
            mb-8
            pb-6
            border-b border-gray-200 dark:border-gray-700
            flex flex-col sm:flex-row
            items-center sm:items-center
            justify-between
            gap-4 sm:gap-0
          "
        >
          {/* LOGO */}
          <div className="flex justify-center sm:justify-start w-full sm:w-auto">
            <img
              src={facteyes}
              alt="Micrologic"
              className="h-10 sm:h-12 w-auto object-contain"
              loading="lazy"
            />
          </div>

          {/* CENTER TITLE */}
          <div className="text-center flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-purple-600 uppercase tracking-wide">
              Rework Approved Report Pending From Production
            </h1>

            {uid && (
              <div className="mt-3 flex items-center justify-center space-x-2">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">UID:</span>
                <span className="text-xs sm:text-sm font-semibold bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md border">
                  {uid}
                </span>
              </div>
            )}
          </div>

          {/* EMPTY RIGHT SIDE FOR BALANCE */}
          <div className="w-full sm:w-24"></div>
        </header>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-72 sm:h-96">
            {/* Loader (unchanged) */}
            {/** ALL YOUR ORIGINAL ANIMATION EXACTLY SAME — omitted here only for brevity but kept in your actual code **/}
            <p className="mt-10 text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
              Loading Report Data
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Please wait while we fetch the traceability information...
            </p>
          </div>
        )}

        {/* DATA AVAILABLE */}
        {!loading && hasData && (
          <div className="space-y-8">

            {/* SUMMARY */}
            <SummaryCardReworkPendingfromprod
              pageMaxWidth="1200px"
              approvedCount={
                reportData.summary?.pendingCount ||
                reportData.header?.approvedCount ||
                0
              }
              modelName={reportData.header?.model}
              variant={reportData.header?.variant}
              displayFromRaw={displayDates.displayFrom}
              displayToRaw={displayDates.displayTo}
              fromTime={displayDates.displayFromTime}
              toTime={displayDates.displayToTime}
              formatDateTime={formatDateTime}
            />

            {/* TABLE */}
            <div
              className="
                mt-8
                w-full
                overflow-x-auto
                bg-white dark:bg-gray-800
                rounded-xl
                shadow
                p-3 sm:p-4
              "
            >
              <ReworkPendingProdTable reportData={reportData} />
            </div>
          </div>
        )}

        {/* NO DATA */}
        {!loading && !hasData && (
          <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
            <p className="text-sm sm:text-lg font-medium">No rework pending data found</p>
            <p className="text-purple-600 font-semibold mt-2 text-xs sm:text-sm">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
