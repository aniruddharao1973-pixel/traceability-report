// // ========================= PART 1 START =========================
// // src/components/TraceabilityReport.jsx
// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import SummaryCard from "./SummaryCard";
// import ReportControls from "./ReportControls";
// import { ReportTable } from "./ReportTable";
// import facteyes from "../public/micrologic_image.png";

// // Backend base URL
// const API_BASE = "http://localhost:4000";

// // Cache
// const reportCache = new Map();

// export default function TraceabilityReport({
//   embedded = false,
//   uidFromParent = "",
//   mode = "complete",
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
//   const [loading, setLoading] = useState(false);
//   const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [fromTime, setFromTime] = useState("00:00:00");
//   const [toTime, setToTime] = useState("23:59:59");

//   // Fetch report
//   useEffect(() => {
//     if (!uid) return;

//     const cacheKey = `${uid}-${mode}`;
//     if (reportCache.has(cacheKey)) {
//       setReportData(reportCache.get(cacheKey));
//       setLoading(false);
//       return;
//     }

//     setLoading(true);

//     if (window.history?.replaceState) {
//       window.history.replaceState({}, document.title, window.location.pathname);
//     }

//     const url = `${API_BASE}/api/trace/report?uid=${encodeURIComponent(
//       uid
//     )}&detail=1&mode=${encodeURIComponent(mode)}`;
//     fetch(url)
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         return res.json();
//       })
//       .then((data) => {
//         const arr = Array.isArray(data) ? data : [];
//         reportCache.set(cacheKey, arr);
//         setReportData(arr);
//       })
//       .catch(() => setReportData([]))
//       .finally(() => {
//         setLoading(false);
//         setHasFetchedOnce(true);
//       });
//   }, [uid, mode]);

//   // Keep UID synced
//   useEffect(() => {
//     const latestUid = uidFromParent || uidFromUrl || "";
//     if (latestUid && latestUid !== uid) setUid(latestUid);
//   }, [uidFromParent, uidFromUrl]);

//   // Helpers
//   const extractTimeFromDate = (str) => {
//     if (!str) return "00:00:00";
//     const d = new Date(str);
//     if (isNaN(d.getTime())) return "00:00:00";
//     return `${String(d.getHours()).padStart(2, "0")}:${String(
//       d.getMinutes()
//     ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
//   };

//   const calculateProductionDates = (data) => {
//     if (!data?.length)
//       return {
//         startDate: null,
//         endDate: null,
//         startTime: "00:00:00",
//         endTime: "00:00:00",
//       };

//     let earliest = null;
//     let latest = null;
//     let est = "00:00:00";
//     let elt = "00:00:00";

//     data.forEach((row) => {
//       if (row.productionstartdate) {
//         const d = new Date(row.productionstartdate);
//         if (!earliest || d < earliest) {
//           earliest = d;
//           est = extractTimeFromDate(row.productionstartdate);
//         }
//       }
//       if (row.productionenddate) {
//         const d = new Date(row.productionenddate);
//         if (!latest || d > latest) {
//           latest = d;
//           elt = extractTimeFromDate(row.productionenddate);
//         }
//       }
//     });

//     return {
//       startDate: earliest,
//       endDate: latest,
//       startTime: est,
//       endTime: elt,
//     };
//   };

//   const formatDateTime = (value) => {
//     if (!value) return "—";
//     const d = value instanceof Date ? value : new Date(value);
//     if (isNaN(d.getTime())) return "—";
//     return `${String(d.getDate()).padStart(2, "0")}-${String(
//       d.getMonth() + 1
//     ).padStart(2, "0")}-${d.getFullYear()}`;
//   };

//   const calculateResultStatus = (data) =>
//     !data?.length ? "—" : data[data.length - 1]?.productstatus || "—";

//   const productionDates = calculateProductionDates(reportData);

//   const getDisplayDates = () => {
//     const urlInc = searchParams.get("includeDateInReport");
//     const f = searchParams.get("userSelectedFromDate");
//     const t = searchParams.get("userSelectedToDate");
//     const ft = searchParams.get("userSelectedFromTime") || "00:00:00";
//     const tt = searchParams.get("userSelectedToTime") || "23:59:59";

//     const useUser = urlInc === "true" && f && t;

//     return useUser
//       ? { displayFrom: f, displayTo: t, displayFromTime: ft, displayToTime: tt }
//       : {
//           displayFrom: productionDates.startDate,
//           displayTo: productionDates.endDate,
//           displayFromTime: productionDates.startTime,
//           displayToTime: productionDates.endTime,
//         };
//   };

//   const checkUserDatesInRange = (uf, ut, ps, pe) => {
//     if (!uf || !ut || !ps || !pe) return false;
//     try {
//       const a = new Date(uf);
//       const b = new Date(ut);
//       const c = new Date(ps);
//       const d = new Date(pe);
//       return a <= d && b >= c;
//     } catch {
//       return false;
//     }
//   };

//   const hasData = reportData.length > 0;
//   const displayDates = getDisplayDates();

//   return (
//     <div
//       className={`
//         traceability-report-container
//         ${
//           embedded
//             ? "bg-white text-gray-900 p-4"
//             : "min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-10"
//         }
//       `}
//     >
//       {/* ---------------- HEADER (Responsive) ---------------- */}
//       {embedded ? (
//         <header className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 gap-4">
//           <div className="flex items-center min-w-40 sm:min-w-56 justify-center sm:justify-start">
//             <img
//               src={facteyes}
//               alt="Micrologic"
//               className="h-12 w-auto sm:h-[55px]"
//             />
//           </div>

//           <div className="text-center flex-1 px-2">
//             <h1 className="text-xl sm:text-2xl font-bold text-purple-600 uppercase tracking-wide">
//               Traceability Report
//             </h1>
//             {uid && (
//               <div className="mt-2 flex items-center justify-center space-x-2">
//                 <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
//                   UID:
//                 </span>
//                 <span className="text-xs sm:text-sm font-semibold bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600">
//                   {uid}
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="min-w-40 sm:min-w-56"></div>
//         </header>
//       ) : (
//         <header className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 gap-4">
//           <div className="flex items-center min-w-40 sm:min-w-56 justify-center sm:justify-start">
//             <img
//               src="/Facteyes_image.png"
//               alt="FactEyes"
//               className="h-10 sm:h-12"
//             />
//           </div>

//           <div className="text-center flex-1 px-2">
//             <h1 className="text-xl sm:text-2xl font-bold text-purple-600 uppercase tracking-wide">
//               Traceability Report
//             </h1>
//             {uid && (
//               <div className="mt-2 flex items-center justify-center space-x-2">
//                 <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
//                   UID:
//                 </span>
//                 <span className="text-xs sm:text-sm font-semibold bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600">
//                   {uid}
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="min-w-40 sm:min-w-56"></div>
//         </header>
//       )}

//       {/* ---------------- LOADER (Responsive Wrapper Only) ---------------- */}

//       {/* ======================== MAIN CONTENT ======================== */}
//       {hasFetchedOnce && hasData ? (
//         <div className="space-y-10 sm:space-y-12 lg:space-y-16">
//           {/* ========== Scenario Check Wrapper (Responsive) ========== */}
//           {(() => {
//             const productionDates = calculateProductionDates(reportData);
//             const urlInc = searchParams.get("includeDateInReport");
//             const f = searchParams.get("userSelectedFromDate");
//             const t = searchParams.get("userSelectedToDate");

//             const isScenario1 = urlInc === "true" && f && t;
//             const matchRange = isScenario1
//               ? checkUserDatesInRange(
//                   f,
//                   t,
//                   productionDates.startDate,
//                   productionDates.endDate
//                 )
//               : true;

//             if (isScenario1 && !matchRange) {
//               return (
//                 <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-gray-500 px-2">
//                   <p className="text-sm sm:text-lg font-medium text-red-600 mb-2">
//                     No reports found for the selected date.
//                   </p>
//                   <p className="text-xs sm:text-sm text-gray-600">
//                     Selected: {formatDateTime(f)} to {formatDateTime(t)}
//                   </p>
//                 </div>
//               );
//             }

//             return (
//               <>
//                 {/* ================= SummaryCard ================= */}
//                 <SummaryCard
//                   pageMaxWidth="1200px"
//                   uid={uid}
//                   uidCount={reportData.length}
//                   modelName={reportData[0]?.productmodelname}
//                   variant={reportData[0]?.productvariant}
//                   eoluid={reportData[0]?.endoflineuid}
//                   displayFromRaw={displayDates.displayFrom}
//                   displayToRaw={displayDates.displayTo}
//                   fromTime={displayDates.displayFromTime}
//                   toTime={displayDates.displayToTime}
//                   resultStatus={calculateResultStatus(reportData)}
//                   formatDateTime={formatDateTime}
//                 />

//                 {/* ================= Table Section ================= */}
//                 <div
//                   className="mt-10 sm:mt-12 px-1 sm:px-4 lg:px-6"
//                   id="report-area"
//                 >
//                   <ReportTable reportData={reportData} />
//                 </div>

//                 {/* ================= Controls Section ================= */}
//                 <div className="mt-8 sm:mt-10 flex justify-center px-2">
//                   <ReportControls uid={uid} />
//                 </div>
//               </>
//             );
//           })()}
//         </div>
//       ) : null}

//       {/* ======================== EMPTY DATA ======================== */}
//       {hasFetchedOnce && !hasData && (
//         <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-gray-500 px-2">
//           <p className="text-sm sm:text-lg font-medium">
//             No data found for UID:
//           </p>
//           <p className="text-purple-600 font-semibold mt-1 text-base sm:text-lg">
//             {uid}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
// // ========================= PART 2 END =========================

// ========================= PART 1 START =========================
// src/components/TraceabilityReport.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SummaryCard from "./SummaryCard";
import ReportControls from "./ReportControls";
import { ReportTable } from "./ReportTable";
import facteyes from "../public/micrologic_image.png";

// Backend base URL
const API_BASE = "http://localhost:4000";

// Cache
const reportCache = new Map();

export default function TraceabilityReport({
  embedded = false,
  uidFromParent = "",
  mode = "complete",
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
  const [loading, setLoading] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromTime, setFromTime] = useState("00:00:00");
  const [toTime, setToTime] = useState("23:59:59");

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

    const url = `${API_BASE}/api/trace/report?uid=${encodeURIComponent(
      uid
    )}&detail=1&mode=${encodeURIComponent(mode)}`;
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
      .finally(() => {
        setLoading(false);
        setHasFetchedOnce(true);
      });
  }, [uid, mode]);

  // Keep UID synced
  useEffect(() => {
    const latestUid = uidFromParent || uidFromUrl || "";
    if (latestUid && latestUid !== uid) setUid(latestUid);
  }, [uidFromParent, uidFromUrl]);

  // Helpers
  const extractTimeFromDate = (str) => {
    if (!str) return "00:00:00";
    const d = new Date(str);
    if (isNaN(d.getTime())) return "00:00:00";
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
  };

  const calculateProductionDates = (data) => {
    if (!data?.length)
      return {
        startDate: null,
        endDate: null,
        startTime: "00:00:00",
        endTime: "00:00:00",
      };

    let earliest = null;
    let latest = null;
    let est = "00:00:00";
    let elt = "00:00:00";

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

    return {
      startDate: earliest,
      endDate: latest,
      startTime: est,
      endTime: elt,
    };
  };

  const formatDateTime = (value) => {
    if (!value) return "—";
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return "—";
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const calculateResultStatus = (data) =>
    !data?.length ? "—" : data[data.length - 1]?.productstatus || "—";

  const productionDates = calculateProductionDates(reportData);

  const getDisplayDates = () => {
    const urlInc = searchParams.get("includeDateInReport");
    const f = searchParams.get("userSelectedFromDate");
    const t = searchParams.get("userSelectedToDate");
    const ft = searchParams.get("userSelectedFromTime") || "00:00:00";
    const tt = searchParams.get("userSelectedToTime") || "23:59:59";

    const useUser = urlInc === "true" && f && t;

    return useUser
      ? { displayFrom: f, displayTo: t, displayFromTime: ft, displayToTime: tt }
      : {
          displayFrom: productionDates.startDate,
          displayTo: productionDates.endDate,
          displayFromTime: productionDates.startTime,
          displayToTime: productionDates.endTime,
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
        w-full
        ${
          embedded
            ? "bg-white text-gray-900 p-2 sm:p-3 md:p-4"
            : "min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10"
        }
      `}
    >
      {/* ---------------- HEADER (Responsive) ---------------- */}
      {embedded ? (
        <header className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 md:mb-8 border-b border-gray-200 dark:border-gray-700 pb-3 md:pb-4 gap-2 sm:gap-3 md:gap-4">
          <div className="flex items-center w-32 sm:w-40 md:w-48 lg:w-56 justify-center sm:justify-start order-1 sm:order-1">
            <img
              src={facteyes}
              alt="Micrologic"
              className="h-8 sm:h-10 md:h-12 lg:h-[55px] w-auto object-contain"
            />
          </div>

          <div className="text-center flex-1 px-2 sm:px-3 md:px-4 order-2 sm:order-2">
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-purple-600 uppercase tracking-wide">
              Traceability Report
            </h1>
            {uid && (
              <div className="mt-1 sm:mt-2 flex flex-col sm:flex-row items-center justify-center sm:space-x-2">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  UID:
                </span>
                <span className="text-xs sm:text-sm font-semibold bg-gray-100 dark:bg-gray-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md border border-gray-300 dark:border-gray-600 mt-1 sm:mt-0">
                  {uid}
                </span>
              </div>
            )}
          </div>

          <div className="hidden sm:block w-32 sm:w-40 md:w-48 lg:w-56 order-3"></div>
        </header>
      ) : (
        <header className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 md:mb-8 border-b border-gray-200 dark:border-gray-700 pb-3 md:pb-4 gap-2 sm:gap-3 md:gap-4">
          <div className="flex items-center w-32 sm:w-40 md:w-48 lg:w-56 justify-center sm:justify-start order-1 sm:order-1">
            <img
              src="/Facteyes_image.png"
              alt="FactEyes"
              className="h-8 sm:h-10 md:h-12 w-auto object-contain"
            />
          </div>

          <div className="text-center flex-1 px-2 sm:px-3 md:px-4 order-2 sm:order-2">
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-purple-600 uppercase tracking-wide">
              Traceability Report
            </h1>
            {uid && (
              <div className="mt-1 sm:mt-2 flex flex-col sm:flex-row items-center justify-center sm:space-x-2">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  UID:
                </span>
                <span className="text-xs sm:text-sm font-semibold bg-gray-100 dark:bg-gray-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md border border-gray-300 dark:border-gray-600 mt-1 sm:mt-0 break-all max-w-xs sm:max-w-none">
                  {uid}
                </span>
              </div>
            )}
          </div>

          <div className="hidden sm:block w-32 sm:w-40 md:w-48 lg:w-56 order-3"></div>
        </header>
      )}

      {/* ---------------- LOADER (Responsive Wrapper Only) ---------------- */}

      {/* ======================== MAIN CONTENT ======================== */}
      {hasFetchedOnce && hasData ? (
        <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 xl:space-y-16">
          {/* ========== Scenario Check Wrapper (Responsive) ========== */}
          {(() => {
            const productionDates = calculateProductionDates(reportData);
            const urlInc = searchParams.get("includeDateInReport");
            const f = searchParams.get("userSelectedFromDate");
            const t = searchParams.get("userSelectedToDate");

            const isScenario1 = urlInc === "true" && f && t;
            const matchRange = isScenario1
              ? checkUserDatesInRange(
                  f,
                  t,
                  productionDates.startDate,
                  productionDates.endDate
                )
              : true;

            if (isScenario1 && !matchRange) {
              return (
                <div className="flex flex-col items-center justify-center h-32 sm:h-48 md:h-56 lg:h-64 text-gray-500 px-2 sm:px-4">
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-red-600 mb-1 sm:mb-2 text-center">
                    No reports found for the selected date.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 text-center">
                    Selected: {formatDateTime(f)} to {formatDateTime(t)}
                  </p>
                </div>
              );
            }

            return (
              <>
                {/* ================= SummaryCard ================= */}
                <div className="w-full overflow-x-auto">
                  <SummaryCard
                    pageMaxWidth="100%"
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
                </div>

                {/* ================= Table Section ================= */}
                <div
                  className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 px-0 sm:px-2 md:px-4 lg:px-6 overflow-x-auto"
                  id="report-area"
                >
                  <div className="min-w-full inline-block align-middle">
                    <div className="overflow-hidden">
                      <ReportTable reportData={reportData} />
                    </div>
                  </div>
                </div>

                {/* ================= Controls Section ================= */}
                <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10 flex justify-center px-2 pb-2 sm:pb-4">
                  <ReportControls uid={uid} />
                </div>
              </>
            );
          })()}
        </div>
      ) : null}

      {/* ======================== EMPTY DATA ======================== */}
      {hasFetchedOnce && !hasData && (
        <div className="flex flex-col items-center justify-center h-32 sm:h-48 md:h-56 lg:h-64 text-gray-500 px-2 sm:px-4">
          <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-center">
            No data found for UID:
          </p>
          <p className="text-purple-600 font-semibold mt-1 text-sm sm:text-base lg:text-lg break-all text-center max-w-xs sm:max-w-sm md:max-w-md">
            {uid}
          </p>
        </div>
      )}
    </div>
  );
}
// ========================= PART 2 END =========================
