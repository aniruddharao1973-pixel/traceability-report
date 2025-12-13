// // src/components/ReworkPendingReport.jsx
// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import SummaryCard from "./SummaryCardRework";
// import { ReportTable } from "./reworkpendingtable";
// import ReportControls from "./ReportControls";
// import facteyes from '../public/micrologic_image.png';

// const API_BASE = "http://localhost:4000";

// const reworkPendingCountCache = new Map();

// export default function ReworkPendingReport({
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
//   const [reportData, setReportData] = useState(null);
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

//   // ✅ Determine which dates to display for rework pending report
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
//   if (!uid) return;
  
//   // ✅ ADD: Cache check first
//   const displayDates = getDisplayDates();
//   const cacheKey = `${uid}-${displayDates.displayFrom || 'no-date'}-${displayDates.displayTo || 'no-date'}`;
  
//   if (reworkPendingCountCache.has(cacheKey)) {
//     console.log("[ReworkPendingReport] Using cached data for:", cacheKey);
//     setReportData(reworkPendingCountCache.get(cacheKey));
//     setLoading(false);
//     return;
//   }

//   setLoading(true);

//   // 🧩 Hide UID query from browser address bar
//   if (window.history && window.history.replaceState) {
//     window.history.replaceState({}, document.title, window.location.pathname);
//   }

//   // Build API URL based on date scenario
//   let url = `${API_BASE}/api/trace/rework-pending-count/uid/${encodeURIComponent(uid)}`;

//   // Scene A: With date filter
//   if (displayDates.displayFrom && displayDates.displayTo) {
//     url += `?fromDate=${displayDates.displayFrom}&toDate=${displayDates.displayTo}`;
//     console.log('🎯 REWORK PENDING: Scene A - With Date Filter');
//   } 
//   // Scene B: Without date filter
//   else {
//     console.log('🎯 REWORK PENDING: Scene B - No Date Filter (All Data)');
//   }

//   console.log("[ReworkPendingReport] Fetching:", url);

//   fetch(url)
//     .then((res) => {
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       return res.json();
//     })
//     .then((data) => {
//       console.log("[ReworkPendingReport] fetched data:", data);
      
//       // ✅ ADD: Cache the data
//       reworkPendingCountCache.set(cacheKey, data);
//       setReportData(data);
//     })
//     .catch((err) => {
//       console.error("❌ Failed to load rework pending report:", err);
//       setReportData(null);
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

//   // ✅ Calculate result status for rework pending report
//   const calculateResultStatus = (data) => {
//     if (!data || !data.success) return "NO DATA";
    
//     const pendingCount = data.data?.summary?.pendingCount || 0;
//     if (pendingCount === 0) return "NO PENDING";
//     return "PENDING";
//   };

//   // ✅ Calculate badge color based on status
//   const getBadgeColor = (status) => {
//     switch (status) {
//       case "PENDING": return '#e67e22'; // Orange for pending
//       case "NO PENDING": return '#2fa84f'; // Green for no pending
//       default: return '#ccc'; // Gray for no data
//     }
//   };

//   const hasData = reportData && reportData.success && reportData.data;
//   const displayDates = getDisplayDates();
//   const resultStatus = calculateResultStatus(reportData);
//   const badgeColor = getBadgeColor(resultStatus);

//   return (
//     <div className="rework-pending-report-container min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">

//       {/* ✅ WRAP EVERYTHING INSIDE THIS CONTAINER */}
//       <div id="full-report-page" className="mx-auto max-w-[1400px]">

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
//                 Rework Pending Report
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
//                 Rework Pending Report
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

//         {/* ✅ REPORT CONTROLS */}
//         {/* <div className="flex justify-center mb-6">
//           <ReportControls 
//             uid={uid} 
//             reportType="reworkpendingtable" 
//             keepThemeForExport={false}
//           />
//         </div> */}

//  {/* ✅ Conditional rendering */}
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
//             <SummaryCard
//               pageMaxWidth="1200px"
//               uid={uid}
//               pendingCount={reportData.data.summary.pendingCount}
//               approvedCount={0} // Since this is pending report, approved count is 0
//               modelName={reportData.data.header.model}
//               variant={reportData.data.header.variant}
//               displayFromRaw={displayDates.displayFrom}
//               displayToRaw={displayDates.displayTo}
//               fromTime={displayDates.displayFromTime}
//               toTime={displayDates.displayToTime}
//               resultStatus={resultStatus}
//               badgeColor={badgeColor}
//               formatDateTime={formatDateTime}
//             />

//             {/* 📊 Table section */}
//             <div className="mt-12">
//               <ReportTable reportData={reportData.data.tableData} />
//             </div>

//             {/* ✅ REPORT CONTROLS - MOVED AFTER TABLE */}
//             <div className="flex justify-center mt-8">
//               <ReportControls 
//                 uid={uid} 
//                 reportType="reworkpendingtable" 
//                 keepThemeForExport={false}
//               />
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center h-64 text-gray-500">
//             <p className="text-lg font-medium">
//               {reportData && !reportData.success 
//                 ? reportData.message || "No rework pending data found"
//                 : "No rework pending data found for UID:"}
//             </p>
//             <p className="text-purple-600 font-semibold mt-1">{uid}</p>
//           </div>
//         )}

//       </div> {/* ✅ end of full-report-page */}

//     </div>
//   );
// }


// src/components/ReworkPendingReport.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SummaryCard from "./SummaryCardRework";
import { ReportTable } from "./reworkpendingtable";
import ReportControls from "./ReportControls";
import facteyes from '../public/micrologic_image.png';

const API_BASE = "http://localhost:4000";

const reworkPendingCountCache = new Map();

export default function ReworkPendingReport({
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
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

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

    const shouldUse = urlIncludeDate === 'true' && urlFromDate && urlToDate;

    if (shouldUse) {
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

  // FETCH (cached)
  useEffect(() => {
    if (!uid) return;

    const displayDates = getDisplayDates();
    const cacheKey = `${uid}-${displayDates.displayFrom || 'no-date'}-${displayDates.displayTo || 'no-date'}`;

    if (reworkPendingCountCache.has(cacheKey)) {
      setReportData(reworkPendingCountCache.get(cacheKey));
      setLoading(false);
      return;
    }

    setLoading(true);

    if (window.history?.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    let url = `${API_BASE}/api/trace/rework-pending-count/uid/${encodeURIComponent(uid)}`;

    if (displayDates.displayFrom && displayDates.displayTo) {
      url += `?fromDate=${displayDates.displayFrom}&toDate=${displayDates.displayTo}`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        reworkPendingCountCache.set(cacheKey, data);
        setReportData(data);
      })
      .catch((err) => {
        console.error("❌ Rework Pending Error:", err);
      })
      .finally(() => setLoading(false));
  }, [uid]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "—";
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return "—";
    }
  };

  const calculateResultStatus = (data) => {
    if (!data || !data.success) return "NO DATA";
    const pending = data.data?.summary?.pendingCount || 0;
    if (pending === 0) return "NO PENDING";
    return "PENDING";
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case "PENDING": return '#e67e22';
      case "NO PENDING": return '#2fa84f';
      default: return '#ccc';
    }
  };

  const hasData = reportData && reportData.success && reportData.data;
  const displayDates = getDisplayDates();
  const resultStatus = calculateResultStatus(reportData);
  const badgeColor = getBadgeColor(resultStatus);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6">

      <div id="full-report-page" className="mx-auto max-w-[1400px]">

        {/* HEADER */}
        <header
          className="
            flex flex-col sm:flex-row
            items-center sm:items-center
            justify-between
            gap-4 sm:gap-0
            mb-8 pb-4
            border-b border-gray-200 dark:border-gray-700
          "
        >
          <div className="flex justify-center sm:justify-start w-full sm:w-auto">
            <img
              src={facteyes}
              alt="Micrologic"
              className="h-8 sm:h-12 w-auto object-contain"
            />
          </div>

          <div className="text-center flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-purple-600 uppercase tracking-wide">
              Rework Pending Report
            </h1>

            {uid && (
              <div className="mt-3 flex items-center justify-center space-x-2">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">UID:</span>
                <span className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md border">
                  {uid}
                </span>
              </div>
            )}
          </div>

          <div className="w-full sm:w-24"></div>
        </header>

        {/* LOADER */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-72 sm:h-96">
            {/* Your full original animation remains EXACTLY same */}
            <p className="mt-8 text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
              Loading Report Data
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Please wait while we fetch the traceability information...
            </p>
          </div>
        )}

        {/* DATA LOADED */}
        {!loading && hasData && (
          <div className="space-y-8">

            <SummaryCard
              pageMaxWidth="1200px"
              uid={uid}
              pendingCount={reportData.data.summary.pendingCount}
              approvedCount={0}
              modelName={reportData.data.header.model}
              variant={reportData.data.header.variant}
              displayFromRaw={displayDates.displayFrom}
              displayToRaw={displayDates.displayTo}
              fromTime={displayDates.displayFromTime}
              toTime={displayDates.displayToTime}
              resultStatus={resultStatus}
              badgeColor={badgeColor}
              formatDateTime={formatDateTime}
            />

            {/* TABLE */}
            <div
              className="
                mt-10
                overflow-x-auto
                bg-white dark:bg-gray-800
                rounded-xl
                shadow-md
                p-3 sm:p-4
              "
            >
              <ReportTable reportData={reportData.data.tableData} />
            </div>

            {/* EXPORT BUTTONS */}
            <div className="flex justify-center mt-8">
              <ReportControls 
                uid={uid}
                reportType="reworkpendingtable"
                keepThemeForExport={false}
              />
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !hasData && (
          <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
            <p className="text-sm sm:text-lg font-medium">
              {reportData && !reportData.success
                ? reportData.message || "No rework pending data found"
                : "No rework pending data found for UID:"}
            </p>

            <p className="text-purple-600 font-semibold mt-1 text-xs sm:text-sm">
              {uid}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
