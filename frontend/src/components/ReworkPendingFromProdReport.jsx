// // src/components/ReworkPendingFromProdReport.jsx
// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import SummaryCardReworkPendingfromprod from "./SummaryCardReworkPendingfromprod";
// import { ReworkPendingProdTable } from "./ReworkPendingProdTable";
// import facteyes from "../public/micrologic_image.png";
// import ReportControls from "./ReportControls";

// const API_BASE = "http://localhost:4000";
// const reworkPendingReportCache = new Map();

// export default function ReworkPendingFromProduction({
//   embedded = false,
//   uidFromParent = "",
//   includeDateInReport = false,
//   userSelectedFromDate = "",
//   userSelectedToDate = "",
//   userSelectedFromTime = "00:00:00",
//   userSelectedToTime = "23:59:59",
// }) {
//   const [searchParams] = useSearchParams();
//   const uidFromUrl = searchParams.get("uid");
//   const [uid, setUid] = useState(uidFromParent || uidFromUrl || "");
//   const [reportData, setReportData] = useState({});
//   const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

//   // Debug date props
//   useEffect(() => {
//     console.log("📅 Rework Pending Date Params:", {
//       includeDateInReport,
//       userSelectedFromDate,
//       userSelectedToDate,
//       userSelectedFromTime,
//       userSelectedToTime,
//     });
//   }, [
//     includeDateInReport,
//     userSelectedFromDate,
//     userSelectedToDate,
//     userSelectedFromTime,
//     userSelectedToTime,
//   ]);

//   // Update UID from parent / query
//   useEffect(() => {
//     const latestUid = uidFromParent || uidFromUrl || "";
//     if (latestUid && latestUid !== uid) setUid(latestUid);
//   }, [uidFromParent, uidFromUrl]);

//   // Determine display dates
//   const getDisplayDates = () => {
//     const urlIncludeDate = searchParams.get("includeDateInReport");
//     const urlFromDate = searchParams.get("userSelectedFromDate");
//     const urlToDate = searchParams.get("userSelectedToDate");
//     const urlFromTime = searchParams.get("userSelectedFromTime") || "00:00:00";
//     const urlToTime = searchParams.get("userSelectedToTime") || "23:59:59";

//     const useDate = urlIncludeDate === "true" && urlFromDate && urlToDate;

//     if (useDate) {
//       return {
//         displayFrom: urlFromDate,
//         displayTo: urlToDate,
//         displayFromTime: urlFromTime,
//         displayToTime: urlToTime,
//       };
//     }

//     return {
//       displayFrom: null,
//       displayTo: null,
//       displayFromTime: "00:00:00",
//       displayToTime: "23:59:59",
//     };
//   };

//   // Fetch API (cached)
//   useEffect(() => {
//     const displayDates = getDisplayDates();
//     const cacheKey = `${uid || "all"}-${
//       displayDates.displayFrom || "no-date"
//     }-${displayDates.displayTo || "no-date"}`;

//     if (reworkPendingReportCache.has(cacheKey)) {
//       console.log("[Pending Rework] Loaded from Cache:", cacheKey);
//       setReportData(reworkPendingReportCache.get(cacheKey));
//       setHasFetchedOnce(true);
//       return;
//     }

//     if (window.history?.replaceState) {
//       window.history.replaceState({}, document.title, window.location.pathname);
//     }

//     let url = uid
//       ? `${API_BASE}/api/trace/rework-pending/uid/${uid}`
//       : `${API_BASE}/api/trace/rework-pending/complete-data`;

//     if (displayDates.displayFrom && displayDates.displayTo) {
//       url += `?fromDate=${displayDates.displayFrom}&toDate=${displayDates.displayTo}&fromTime=${displayDates.displayFromTime}&toTime=${displayDates.displayToTime}`;
//     }

//     console.log("[Rework Pending] Fetch:", url);

//     fetch(url)
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         return res.json();
//       })
//       .then((data) => {
//         const processedData = data.success ? data.data : {};
//         reworkPendingReportCache.set(cacheKey, processedData);
//         setReportData(processedData);
//       })
//       .catch((err) => {
//         console.error("❌ Rework Pending Fetch Error:", err);
//         setReportData({});
//       })
//       .finally(() => {
//         setHasFetchedOnce(true);
//       });
//   }, [uid]);

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "—";
//     try {
//       const date =
//         dateString instanceof Date ? dateString : new Date(dateString);
//       if (isNaN(date.getTime())) return "—";
//       const d = String(date.getDate()).padStart(2, "0");
//       const m = String(date.getMonth() + 1).padStart(2, "0");
//       const y = date.getFullYear();
//       return `${d}-${m}-${y}`;
//     } catch {
//       return "—";
//     }
//   };

//   const hasData =
//     reportData &&
//     ((reportData.tableData && reportData.tableData.length > 0) ||
//       (reportData.records && reportData.records.length > 0));

//   const displayDates = getDisplayDates();

//   return (
//     <div className="rework-report-container min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6">
//       <div id="full-report-page" className="mx-auto max-w-[1400px]">
//         {/* HEADER */}
//         <header
//           className="
//             mb-8
//             pb-6
//             border-b border-gray-200 dark:border-gray-700
//             flex flex-col sm:flex-row
//             items-center sm:items-center
//             justify-between
//             gap-4 sm:gap-0
//           "
//         >
//           {/* LOGO */}
//           <div className="flex justify-center sm:justify-start w-full sm:w-auto">
//             <img
//               src={facteyes}
//               alt="Micrologic"
//               className="h-10 sm:h-12 w-auto object-contain"
//               loading="lazy"
//             />
//           </div>

//           {/* CENTER TITLE */}
//           <div className="text-center flex-1">
//             <h1 className="text-xl sm:text-2xl font-bold text-purple-600 uppercase tracking-wide">
//               Rework Approved Report Pending From Production
//             </h1>

//             {uid && (
//               <div className="mt-3 flex items-center justify-center space-x-2">
//                 <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
//                   UID:
//                 </span>
//                 <span className="text-xs sm:text-sm font-semibold bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md border">
//                   {uid}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* EMPTY RIGHT SIDE FOR BALANCE */}
//           <div className="w-full sm:w-24"></div>
//         </header>

//         {/* LOADING */}

//         {/* DATA AVAILABLE */}
//         {hasData && (
//           <div className="space-y-8">
//             {/* SUMMARY */}
//             <SummaryCardReworkPendingfromprod
//               pageMaxWidth="1200px"
//               approvedCount={
//                 reportData.summary?.pendingCount ||
//                 reportData.header?.approvedCount ||
//                 0
//               }
//               modelName={reportData.header?.model}
//               variant={reportData.header?.variant}
//               displayFromRaw={displayDates.displayFrom}
//               displayToRaw={displayDates.displayTo}
//               fromTime={displayDates.displayFromTime}
//               toTime={displayDates.displayToTime}
//               formatDateTime={formatDateTime}
//             />

//             {/* TABLE */}
//             <div
//               className="
//                 mt-8
//                 w-full
//                 overflow-x-auto
//                 bg-white dark:bg-gray-800
//                 rounded-xl
//                 shadow
//                 p-3 sm:p-4
//               "
//             >
//               <ReworkPendingProdTable reportData={reportData} />
//             </div>
//           </div>
//         )}

//         {/* NO DATA */}
//         {hasFetchedOnce && !hasData && (
//           <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
//             <p className="text-sm sm:text-lg font-medium">
//               No rework pending data found
//             </p>
//             <p className="text-purple-600 font-semibold mt-2 text-xs sm:text-sm">
//               Try adjusting your filters
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// src/components/ReworkPendingFromProdReport.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SummaryCardReworkPendingfromprod from "./SummaryCardReworkPendingfromprod";
import { ReworkPendingProdTable } from "./ReworkPendingProdTable";
import facteyes from "../public/micrologic_image.png";
import ReportControls from "./ReportControls";

const API_BASE = "http://localhost:4000";
const reworkPendingReportCache = new Map();

export default function ReworkPendingFromProduction({
  embedded = false,
  uidFromParent = "",
  includeDateInReport = false,
  userSelectedFromDate = "",
  userSelectedToDate = "",
  userSelectedFromTime = "00:00:00",
  userSelectedToTime = "23:59:59",
}) {
  const [searchParams] = useSearchParams();
  const uidFromUrl = searchParams.get("uid");
  const [uid, setUid] = useState(uidFromParent || uidFromUrl || "");
  const [reportData, setReportData] = useState({});
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  // Debug date props
  useEffect(() => {
    console.log("📅 Rework Pending Date Params:", {
      includeDateInReport,
      userSelectedFromDate,
      userSelectedToDate,
      userSelectedFromTime,
      userSelectedToTime,
    });
  }, [
    includeDateInReport,
    userSelectedFromDate,
    userSelectedToDate,
    userSelectedFromTime,
    userSelectedToTime,
  ]);

  // Update UID from parent / query
  useEffect(() => {
    const latestUid = uidFromParent || uidFromUrl || "";
    if (latestUid && latestUid !== uid) setUid(latestUid);
  }, [uidFromParent, uidFromUrl]);

  // Determine display dates
  const getDisplayDates = () => {
    const urlIncludeDate = searchParams.get("includeDateInReport");
    const urlFromDate = searchParams.get("userSelectedFromDate");
    const urlToDate = searchParams.get("userSelectedToDate");
    const urlFromTime = searchParams.get("userSelectedFromTime") || "00:00:00";
    const urlToTime = searchParams.get("userSelectedToTime") || "23:59:59";

    const useDate = urlIncludeDate === "true" && urlFromDate && urlToDate;

    if (useDate) {
      return {
        displayFrom: urlFromDate,
        displayTo: urlToDate,
        displayFromTime: urlFromTime,
        displayToTime: urlToTime,
      };
    }

    return {
      displayFrom: null,
      displayTo: null,
      displayFromTime: "00:00:00",
      displayToTime: "23:59:59",
    };
  };

  // Fetch API (cached)
  useEffect(() => {
    const displayDates = getDisplayDates();
    const cacheKey = `${uid || "all"}-${
      displayDates.displayFrom || "no-date"
    }-${displayDates.displayTo || "no-date"}`;

    if (reworkPendingReportCache.has(cacheKey)) {
      console.log("[Pending Rework] Loaded from Cache:", cacheKey);
      setReportData(reworkPendingReportCache.get(cacheKey));
      setHasFetchedOnce(true);
      return;
    }

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
      .finally(() => {
        setHasFetchedOnce(true);
      });
  }, [uid]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    try {
      const date =
        dateString instanceof Date ? dateString : new Date(dateString);
      if (isNaN(date.getTime())) return "—";
      const d = String(date.getDate()).padStart(2, "0");
      const m = String(date.getMonth() + 1).padStart(2, "0");
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
    <div className="rework-report-container min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6">
      <div id="full-report-page" className="mx-auto w-full max-w-[1400px]">
        {/* HEADER */}
        <header
          className="
            mb-4 xs:mb-6 sm:mb-8
            pb-3 xs:pb-4 sm:pb-6
            border-b border-gray-200 dark:border-gray-700
            flex flex-col sm:flex-row md:flex-row lg:flex-row
            items-center
            justify-between
            gap-2 xs:gap-3 sm:gap-4 md:gap-0
          "
        >
          {/* LOGO */}
          <div className="flex justify-center sm:justify-start w-full sm:w-auto md:w-auto">
            <img
              src={facteyes}
              alt="Micrologic"
              className="h-8 xs:h-9 sm:h-10 md:h-11 lg:h-12 w-auto object-contain"
              loading="lazy"
            />
          </div>

          {/* CENTER TITLE */}
          <div className="text-center flex-1 px-2 sm:px-4 md:px-6">
            <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl font-bold text-purple-600 uppercase tracking-normal sm:tracking-wide">
              Rework Approved Report Pending From Production
            </h1>

            {uid && (
              <div className="mt-2 xs:mt-2.5 sm:mt-3 flex items-center justify-center space-x-1 xs:space-x-1.5 sm:space-x-2">
                <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  UID:
                </span>
                <span className="text-[10px] xs:text-xs sm:text-sm font-semibold bg-gray-100 dark:bg-gray-800 px-2 xs:px-2.5 sm:px-3 py-0.5 xs:py-0.5 sm:py-1 rounded-md border">
                  {uid}
                </span>
              </div>
            )}
          </div>

          {/* EMPTY RIGHT SIDE FOR BALANCE */}
          <div className="hidden sm:block sm:w-20 md:w-24 lg:w-28"></div>
        </header>

        {/* LOADING */}

        {/* DATA AVAILABLE */}
        {hasData && (
          <div className="space-y-4 xs:space-y-6 sm:space-y-8">
            {/* SUMMARY */}
            <div className="w-full px-0 xs:px-0 sm:px-0 md:px-2 lg:px-4">
              <SummaryCardReworkPendingfromprod
                pageMaxWidth="100%"
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
            </div>

            {/* TABLE */}
            <div
              className="
                mt-4 xs:mt-6 sm:mt-8
                w-full
                overflow-hidden
                bg-white dark:bg-gray-800
                rounded-lg xs:rounded-lg sm:rounded-xl
                shadow-sm xs:shadow sm:shadow-md lg:shadow-lg
                p-2 xs:p-2.5 sm:p-3 md:p-4 lg:p-5
              "
            >
              <div className="w-full overflow-x-auto overflow-y-hidden">
                <div className="min-w-[320px] xs:min-w-[360px] sm:min-w-full">
                  <ReworkPendingProdTable reportData={reportData} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NO DATA */}
        {hasFetchedOnce && !hasData && (
          <div className="flex flex-col items-center justify-center h-40 xs:h-48 sm:h-56 md:h-64 text-center text-gray-500 px-4">
            <p className="text-xs xs:text-sm sm:text-base md:text-lg font-medium">
              No rework pending data found
            </p>
            <p className="text-purple-600 font-semibold mt-1.5 xs:mt-2 text-[10px] xs:text-xs sm:text-sm">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
