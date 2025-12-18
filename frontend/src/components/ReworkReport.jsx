// // ===========================
// // ReworkReport.jsx — PART 1
// // ===========================
// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import SummaryCardRework from "./SummaryCardRework";
// import ReportControls from "./ReportControls";
// import { ReworkApprovedTable } from "./ReworkApprovedtable";
// import facteyes from "../public/micrologic_image.png";

// const API_BASE = "http://localhost:4000";
// const reworkReportCache = new Map();

// export default function ReworkReport({
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
//   const [reportData, setReportData] = useState([]);
//   const [headerInfo, setHeaderInfo] = useState({});
//   const [summary, setSummary] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

//   // ----------------------------
//   // Responsive Helpers
//   // ----------------------------
//   const containerClasses =
//     "rework-report-container " +
//     (embedded
//       ? "bg-white text-gray-900 p-4"
//       : "min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6");

//   const headerBase =
//     "flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8 " +
//     "border-b border-gray-200 dark:border-gray-700 pb-4";

//   const headerLogoSize = "h-10 sm:h-12 md:h-[55px] w-auto";

//   // ----------------------------
//   // UID Update Logic
//   // ----------------------------
//   useEffect(() => {
//     const latestUid = uidFromParent || uidFromUrl || "";
//     if (latestUid && latestUid !== uid) setUid(latestUid);
//   }, [uidFromParent, uidFromUrl]);

//   // ----------------------------
//   // Extract Time
//   // ----------------------------
//   const extractTimeFromDate = (dateString) => {
//     if (!dateString) return "00:00:00";
//     try {
//       const date = new Date(dateString);
//       const hours = String(date.getHours()).padStart(2, "0");
//       const minutes = String(date.getMinutes()).padStart(2, "0");
//       const seconds = String(date.getSeconds()).padStart(2, "0");
//       return `${hours}:${minutes}:${seconds}`;
//     } catch {
//       return "00:00:00";
//     }
//   };

//   // ----------------------------
//   // Debug Date Logging
//   // ----------------------------
//   useEffect(() => {
//     console.log("📅 Rework Date Parameters Received:", {
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

//   // ----------------------------
//   // Calculate Production Dates
//   // ----------------------------
//   const calculateProductionDates = (data) => {
//     if (!data || data.length === 0)
//       return {
//         startDate: null,
//         endDate: null,
//         startTime: "00:00:00",
//         endTime: "00:00:00",
//       };

//     let earliest = null,
//       latest = null;
//     let earlyTime = "00:00:00",
//       lateTime = "00:00:00";

//     data.forEach((item) => {
//       if (item.ProductionStartDate) {
//         const d = new Date(item.ProductionStartDate);
//         if (!earliest || d < earliest) {
//           earliest = d;
//           earlyTime = extractTimeFromDate(item.ProductionStartDate);
//         }
//       }
//       if (item.ProductionEndDate) {
//         const d = new Date(item.ProductionEndDate);
//         if (!latest || d > latest) {
//           latest = d;
//           lateTime = extractTimeFromDate(item.ProductionEndDate);
//         }
//       }
//     });

//     return {
//       startDate: earliest,
//       endDate: latest,
//       startTime: earlyTime,
//       endTime: lateTime,
//     };
//   };

//   // ----------------------------
//   // Get Display Dates
//   // ----------------------------
//   const getDisplayDates = () => {
//     const prod = calculateProductionDates(reportData);

//     const inc = searchParams.get("includeDateInReport");
//     const from = searchParams.get("userSelectedFromDate");
//     const to = searchParams.get("userSelectedToDate");
//     const fTime = searchParams.get("userSelectedFromTime") || "00:00:00";
//     const tTime = searchParams.get("userSelectedToTime") || "23:59:59";

//     const userPicked = inc === "true" && from && to;

//     if (userPicked)
//       return {
//         displayFrom: from,
//         displayTo: to,
//         displayFromTime: fTime,
//         displayToTime: tTime,
//       };

//     return {
//       displayFrom: prod.startDate,
//       displayTo: prod.endDate,
//       displayFromTime: prod.startTime,
//       displayToTime: prod.endTime,
//     };
//   };

//   // ----------------------------
//   // Fetch Rework Data (with Cache)
//   // ----------------------------
//   useEffect(() => {
//     if (!uid) return;

//     const cacheKey = `${uid}-rework`;
//     if (reworkReportCache.has(cacheKey)) {
//       const cachedData = reworkReportCache.get(cacheKey);
//       setReportData(cachedData.tableData);
//       setHeaderInfo(cachedData.header);
//       setSummary(cachedData.summary);
//       return setLoading(false);
//     }

//     setLoading(true);

//     if (window.history?.replaceState) {
//       window.history.replaceState({}, document.title, window.location.pathname);
//     }

//     const url = `${API_BASE}/api/trace/rework-approved/uid/${encodeURIComponent(
//       uid
//     )}`;

//     fetch(url)
//       .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
//       .then((data) => {
//         if (data.success) {
//           const processed = {
//             tableData: data.data.tableData || [],
//             header: data.data.header || {},
//             summary: data.data.summary || {},
//           };

//           reworkReportCache.set(cacheKey, processed);

//           setReportData(processed.tableData);
//           setHeaderInfo(processed.header);
//           setSummary(processed.summary);
//         }
//       })
//       .catch((err) => {
//         console.error("❌ Rework fetch error:", err);
//         setReportData([]);
//         setHeaderInfo({});
//         setSummary({});
//       })
//       .finally(() => {
//         setLoading(false);
//         setHasFetchedOnce(true);
//       });
//   }, [uid]);

//   // ----------------------------
//   // Date Formatting
//   // ----------------------------
//   const formatDateTime = (d) => {
//     if (!d) return "—";
//     try {
//       const date = d instanceof Date ? d : new Date(d);
//       if (isNaN(date.getTime())) return "—";
//       const DD = String(date.getUTCDate()).padStart(2, "0");
//       const MM = String(date.getUTCMonth() + 1).padStart(2, "0");
//       const YY = date.getUTCFullYear();
//       return `${DD}-${MM}-${YY}`;
//     } catch {
//       return "—";
//     }
//   };

//   // ----------------------------
//   // Table Date Formatting
//   // ----------------------------
//   const formatDateTimeForTable = (d) => {
//     if (!d) return "—";
//     try {
//       const date = new Date(d);
//       if (isNaN(date.getTime())) return "—";
//       const DD = String(date.getUTCDate()).padStart(2, "0");
//       const MM = String(date.getUTCMonth() + 1).padStart(2, "0");
//       const YY = date.getUTCFullYear();
//       const HH = String(date.getUTCHours()).padStart(2, "0");
//       const MI = String(date.getUTCMinutes()).padStart(2, "0");
//       const SS = String(date.getUTCSeconds()).padStart(2, "0");
//       return `${DD}-${MM}-${YY} ${HH}:${MI}:${SS}`;
//     } catch {
//       return "—";
//     }
//   };

//   // ----------------------------
//   // Status Badge
//   // ----------------------------
//   const calculateResultStatus = (summary) => {
//     if (!summary || summary.totalProcesses === 0) return "—";
//     const pct = (summary.approvedProcesses / summary.totalProcesses) * 100;
//     if (pct >= 90) return "EXCELLENT";
//     if (pct >= 75) return "GOOD";
//     if (pct >= 50) return "FAIR";
//     return "NEEDS ATTENTION";
//   };

//   const getBadgeColor = (status) => {
//     switch (status) {
//       case "EXCELLENT":
//         return "#10b981";
//       case "GOOD":
//         return "#3b82f6";
//       case "FAIR":
//         return "#f59e0b";
//       case "NEEDS ATTENTION":
//         return "#ef4444";
//       default:
//         return "#6b7280";
//     }
//   };

//   // ----------------------------
//   // Filtering Logic
//   // ----------------------------
//   const getFilteredReworkData = () => {
//     const inc = searchParams.get("includeDateInReport");
//     const from = searchParams.get("userSelectedFromDate");
//     const to = searchParams.get("userSelectedToDate");

//     const isScenario1 = inc === "true" && from && to;

//     if (!isScenario1 || !reportData.length) return reportData;

//     const result = reportData.filter((item) => {
//       if (!item.ProductionStartDate) return false;
//       const itemDate = new Date(item.ProductionStartDate);
//       const f = new Date(from);
//       f.setHours(0, 0, 0, 0);
//       const t = new Date(to);
//       t.setHours(23, 59, 59, 999);
//       itemDate.setHours(12, 0, 0, 0);
//       return itemDate >= f && itemDate <= t;
//     });

//     return result;
//   };

//   const filteredData = getFilteredReworkData();
//   const hasData = filteredData.length > 0;
//   const displayDates = getDisplayDates();

//   const shouldShowNoReportsMessage = () => {
//     const inc = searchParams.get("includeDateInReport");
//     const from = searchParams.get("userSelectedFromDate");
//     const to = searchParams.get("userSelectedToDate");
//     return inc === "true" && from && to && !hasData;
//   };

//   // ===========================
//   // START RENDER — HEADER + LOADER
//   // ===========================
//   return (
//     <div className={containerClasses} id="full-report-page">
//       {/* =======================
//           RESPONSIVE HEADER
//       ======================= */}
//       {embedded ? (
//         <header className={headerBase}>
//           <img
//             src={facteyes}
//             alt="Micrologic"
//             className={`${headerLogoSize} object-contain`}
//             onError={(e) => {
//               e.target.src = "/images/micrologic_image.png";
//             }}
//           />

//           <div className="flex-1 text-center space-y-2">
//             <h1 className="text-xl sm:text-2xl font-bold text-purple-600 uppercase tracking-wide">
//               Rework Approved Report
//             </h1>

//             {uid && (
//               <div className="flex justify-center gap-2">
//                 <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
//                   UID:
//                 </span>
//                 <span className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
//                   {uid}
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="hidden sm:block w-[120px]"></div>
//         </header>
//       ) : (
//         <header className={headerBase}>
//           <img
//             src="/Facteyes_image.png"
//             alt="FactEyes"
//             className={`${headerLogoSize} object-contain`}
//             onError={(e) => {
//               e.target.src = "/images/Facteyes_image.png";
//             }}
//           />

//           <div className="flex-1 text-center space-y-2">
//             <h1 className="text-xl sm:text-2xl font-bold text-purple-600 uppercase tracking-wide">
//               Rework Approved Report
//             </h1>

//             {uid && (
//               <div className="flex justify-center gap-2">
//                 <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
//                   UID:
//                 </span>
//                 <span className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
//                   {uid}
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="hidden sm:block w-[120px]"></div>
//         </header>
//       )}

//       {/* =======================
//           LOADER — UNTOUCHED, ONLY WRAPPED
//       ======================= */}

//       {/* ================================
//           MAIN CONTENT (DATA PRESENT)
//       ================================= */}
//       {!loading && hasData && (
//         <div className="space-y-8 mt-6">
//           {/* ================================
//               SUMMARY CARD (Responsive)
//           ================================= */}
//           <SummaryCardRework
//             className="summary-card-container"
//             pageMaxWidth="1200px"
//             uid={headerInfo.uid || uid}
//             modelName={headerInfo.model}
//             variant={headerInfo.variant}
//             totalProcesses={summary.totalProcesses || 0}
//             reworkProcesses={summary.reworkProcesses || 0}
//             approvedProcesses={summary.approvedProcesses || 0}
//             displayFromRaw={displayDates.displayFrom}
//             displayToRaw={displayDates.displayTo}
//             fromTime={displayDates.displayFromTime}
//             toTime={displayDates.displayToTime}
//             formatDateTime={formatDateTime}
//           />

//           {/* ================================
//               TABLE SECTION (Responsive)
//           ================================= */}
//           <div
//             className="
//               mt-10
//               overflow-x-auto
//               w-full
//               bg-white dark:bg-gray-800
//               rounded-xl
//               shadow-md
//               p-3 sm:p-4
//             "
//             id="rework-report-area"
//           >
//             <ReworkApprovedTable reportData={filteredData} />
//           </div>

//           {/* ================================
//               CONTROLS SECTION — Export PDF
//           ================================= */}
//           <div
//             className="
//               mt-6
//               flex
//               justify-center sm:justify-end
//               w-full
//             "
//           >
//             <ReportControls uid={uid} reportType="rework" />
//           </div>
//         </div>
//       )}

//       {/* ================================
//           NO DATA — USER SELECTED DATE RANGE
//       ================================= */}
//       {hasFetchedOnce && !hasData && shouldShowNoReportsMessage() && (
//         <div
//           className="
//             flex flex-col
//             items-center justify-center
//             h-48 sm:h-64
//             text-gray-500
//             text-center
//             px-4
//           "
//         >
//           <p className="text-sm sm:text-lg font-medium text-red-600 mb-2">
//             No reports found for the selected date.
//           </p>

//           <p className="text-xs sm:text-sm text-gray-600">
//             Selected: {formatDateTime(searchParams.get("userSelectedFromDate"))}{" "}
//             to {formatDateTime(searchParams.get("userSelectedToDate"))}
//           </p>
//         </div>
//       )}

//       {/* ================================
//           NO DATA — GENERAL
//       ================================= */}
//       {hasFetchedOnce && !hasData && !shouldShowNoReportsMessage() && (
//         <div
//           className="
//             flex flex-col items-center justify-center
//             h-48 sm:h-64
//             text-gray-500 text-center
//           "
//         >
//           <p className="text-sm sm:text-lg font-medium">
//             No rework data found for UID:
//           </p>

//           <p className="text-purple-600 font-semibold mt-1 text-xs sm:text-sm">
//             {uid}
//           </p>

//           <p className="text-xs sm:text-sm text-gray-600 mt-2">
//             The rework API returned no data for this UID with the current
//             filters.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }


// ===========================
// ReworkReport.jsx — RESPONSIVE VERSION
// ===========================
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SummaryCardRework from "./SummaryCardRework";
import ReportControls from "./ReportControls";
import { ReworkApprovedTable } from "./ReworkApprovedtable";
import facteyes from "../public/micrologic_image.png";

const API_BASE = "http://localhost:4000";
const reworkReportCache = new Map();

export default function ReworkReport({
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
  const [reportData, setReportData] = useState([]);
  const [headerInfo, setHeaderInfo] = useState({});
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  // ----------------------------
  // Responsive Helpers
  // ----------------------------
  const containerClasses =
    "rework-report-container " +
    (embedded
      ? "bg-white text-gray-900 p-2 sm:p-4 md:p-6"
      : "min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-3 sm:p-6 md:p-8 lg:p-10");

  const headerBase =
    "flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 " +
    "border-b border-gray-200 dark:border-gray-700 pb-3 sm:pb-4 md:pb-5";

  const headerLogoSize = "h-8 sm:h-10 md:h-12 lg:h-[55px] w-auto";

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
    if (!dateString) return "00:00:00";
    try {
      const date = new Date(dateString);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    } catch {
      return "00:00:00";
    }
  };

  // ----------------------------
  // Debug Date Logging
  // ----------------------------
  useEffect(() => {
    console.log("📅 Rework Date Parameters Received:", {
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

  // ----------------------------
  // Calculate Production Dates
  // ----------------------------
  const calculateProductionDates = (data) => {
    if (!data || data.length === 0)
      return {
        startDate: null,
        endDate: null,
        startTime: "00:00:00",
        endTime: "00:00:00",
      };

    let earliest = null,
      latest = null;
    let earlyTime = "00:00:00",
      lateTime = "00:00:00";

    data.forEach((item) => {
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

    return {
      startDate: earliest,
      endDate: latest,
      startTime: earlyTime,
      endTime: lateTime,
    };
  };

  // ----------------------------
  // Get Display Dates
  // ----------------------------
  const getDisplayDates = () => {
    const prod = calculateProductionDates(reportData);

    const inc = searchParams.get("includeDateInReport");
    const from = searchParams.get("userSelectedFromDate");
    const to = searchParams.get("userSelectedToDate");
    const fTime = searchParams.get("userSelectedFromTime") || "00:00:00";
    const tTime = searchParams.get("userSelectedToTime") || "23:59:59";

    const userPicked = inc === "true" && from && to;

    if (userPicked)
      return {
        displayFrom: from,
        displayTo: to,
        displayFromTime: fTime,
        displayToTime: tTime,
      };

    return {
      displayFrom: prod.startDate,
      displayTo: prod.endDate,
      displayFromTime: prod.startTime,
      displayToTime: prod.endTime,
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

    const url = `${API_BASE}/api/trace/rework-approved/uid/${encodeURIComponent(
      uid
    )}`;

    fetch(url)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (data.success) {
          const processed = {
            tableData: data.data.tableData || [],
            header: data.data.header || {},
            summary: data.data.summary || {},
          };

          reworkReportCache.set(cacheKey, processed);

          setReportData(processed.tableData);
          setHeaderInfo(processed.header);
          setSummary(processed.summary);
        }
      })
      .catch((err) => {
        console.error("❌ Rework fetch error:", err);
        setReportData([]);
        setHeaderInfo({});
        setSummary({});
      })
      .finally(() => {
        setLoading(false);
        setHasFetchedOnce(true);
      });
  }, [uid]);

  // ----------------------------
  // Date Formatting
  // ----------------------------
  const formatDateTime = (d) => {
    if (!d) return "—";
    try {
      const date = d instanceof Date ? d : new Date(d);
      if (isNaN(date.getTime())) return "—";
      const DD = String(date.getUTCDate()).padStart(2, "0");
      const MM = String(date.getUTCMonth() + 1).padStart(2, "0");
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
      const DD = String(date.getUTCDate()).padStart(2, "0");
      const MM = String(date.getUTCMonth() + 1).padStart(2, "0");
      const YY = date.getUTCFullYear();
      const HH = String(date.getUTCHours()).padStart(2, "0");
      const MI = String(date.getUTCMinutes()).padStart(2, "0");
      const SS = String(date.getSeconds()).padStart(2, "0");
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
      case "EXCELLENT":
        return "#10b981";
      case "GOOD":
        return "#3b82f6";
      case "FAIR":
        return "#f59e0b";
      case "NEEDS ATTENTION":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  // ----------------------------
  // Filtering Logic
  // ----------------------------
  const getFilteredReworkData = () => {
    const inc = searchParams.get("includeDateInReport");
    const from = searchParams.get("userSelectedFromDate");
    const to = searchParams.get("userSelectedToDate");

    const isScenario1 = inc === "true" && from && to;

    if (!isScenario1 || !reportData.length) return reportData;

    const result = reportData.filter((item) => {
      if (!item.ProductionStartDate) return false;
      const itemDate = new Date(item.ProductionStartDate);
      const f = new Date(from);
      f.setHours(0, 0, 0, 0);
      const t = new Date(to);
      t.setHours(23, 59, 59, 999);
      itemDate.setHours(12, 0, 0, 0);
      return itemDate >= f && itemDate <= t;
    });

    return result;
  };

  const filteredData = getFilteredReworkData();
  const hasData = filteredData.length > 0;
  const displayDates = getDisplayDates();

  const shouldShowNoReportsMessage = () => {
    const inc = searchParams.get("includeDateInReport");
    const from = searchParams.get("userSelectedFromDate");
    const to = searchParams.get("userSelectedToDate");
    return inc === "true" && from && to && !hasData;
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
              e.target.src = "/images/micrologic_image.png";
            }}
          />

          <div className="flex-1 text-center space-y-1 sm:space-y-2 px-2 sm:px-4">
            <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-600 uppercase tracking-wide">
              Rework Approved Report
            </h1>

            {uid && (
              <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2">
                <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                  UID:
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 break-all max-w-[150px] sm:max-w-[200px] md:max-w-none">
                  {uid}
                </span>
              </div>
            )}
          </div>

          <div className="hidden md:block w-[80px] lg:w-[120px]"></div>
        </header>
      ) : (
        <header className={headerBase}>
          <img
            src="/Facteyes_image.png"
            alt="FactEyes"
            className={`${headerLogoSize} object-contain`}
            onError={(e) => {
              e.target.src = "/images/Facteyes_image.png";
            }}
          />

          <div className="flex-1 text-center space-y-1 sm:space-y-2 px-2 sm:px-4">
            <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-600 uppercase tracking-wide">
              Rework Approved Report
            </h1>

            {uid && (
              <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2">
                <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                  UID:
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 break-all max-w-[150px] sm:max-w-[200px] md:max-w-none">
                  {uid}
                </span>
              </div>
            )}
          </div>

          <div className="hidden md:block w-[80px] lg:w-[120px]"></div>
        </header>
      )}

      {/* =======================
          LOADER — RESPONSIVE
      ======================= */}
      {loading && (
        <div className="flex items-center justify-center h-32 sm:h-48 md:h-64">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* ================================
          MAIN CONTENT (DATA PRESENT)
      ================================= */}
      {!loading && hasData && (
        <div className="space-y-4 sm:space-y-6 md:space-y-8 mt-4 sm:mt-6">
          {/* ================================
              SUMMARY CARD (Responsive)
          ================================= */}
          <SummaryCardRework
            className="summary-card-container"
            pageMaxWidth="100%"
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
              mt-6 sm:mt-8 md:mt-10
              overflow-x-auto
              w-full
              bg-white dark:bg-gray-800
              rounded-lg sm:rounded-xl
              shadow-sm sm:shadow-md
              p-2 sm:p-3 md:p-4 lg:p-5
              -mx-2 sm:mx-0
            "
            id="rework-report-area"
          >
            {/* Wrapper for horizontal scroll on mobile */}
            <div className="min-w-[320px] overflow-x-auto">
              <ReworkApprovedTable reportData={filteredData} />
            </div>
          </div>

          {/* ================================
              CONTROLS SECTION — Export PDF
          ================================= */}
          <div
            className="
              mt-4 sm:mt-6
              flex
              justify-center sm:justify-end
              w-full
              px-2 sm:px-0
            "
          >
            <ReportControls uid={uid} reportType="rework" />
          </div>
        </div>
      )}

      {/* ================================
          NO DATA — USER SELECTED DATE RANGE
      ================================= */}
      {hasFetchedOnce && !hasData && shouldShowNoReportsMessage() && (
        <div
          className="
            flex flex-col
            items-center justify-center
            h-40 sm:h-48 md:h-64
            text-gray-500
            text-center
            px-4 sm:px-6 md:px-8
          "
        >
          <p className="text-xs sm:text-base md:text-lg font-medium text-red-600 mb-2">
            No reports found for the selected date.
          </p>

          <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">
            <span className="block sm:inline">
              Selected: {formatDateTime(searchParams.get("userSelectedFromDate"))}
            </span>
            <span className="block sm:inline sm:ml-1">
              to {formatDateTime(searchParams.get("userSelectedToDate"))}
            </span>
          </p>
        </div>
      )}

      {/* ================================
          NO DATA — GENERAL
      ================================= */}
      {hasFetchedOnce && !hasData && !shouldShowNoReportsMessage() && (
        <div
          className="
            flex flex-col items-center justify-center
            h-40 sm:h-48 md:h-64
            text-gray-500 text-center
            px-4 sm:px-6 md:px-8
          "
        >
          <p className="text-xs sm:text-base md:text-lg font-medium">
            No rework data found for UID:
          </p>

          <p className="text-purple-600 font-semibold mt-1 text-[11px] sm:text-xs md:text-sm break-all max-w-[250px] sm:max-w-[350px] md:max-w-none">
            {uid}
          </p>

          <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-2 px-2 sm:px-0">
            The rework API returned no data for this UID with the current
            filters.
          </p>
        </div>
      )}
    </div>
  );
}
