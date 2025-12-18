// // src/components/EquipmentPassRateReport.jsx
// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import SummaryCardEquipment from "./SummaryCardEquipment";
// import { EquipmentTable } from "./EquipmentTable";
// import facteyes from "../public/micrologic_image.png";

// const API_BASE = "http://localhost:4000";

// // Cache
// const equipmentReportCache = new Map();

// export default function EquipmentPassRateReport({
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
//   const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

//   useEffect(() => {
//     const latestUid = uidFromParent || uidFromUrl || "";
//     if (latestUid && latestUid !== uid) setUid(latestUid);
//   }, [uidFromParent, uidFromUrl]);

//   const getDisplayDates = () => {
//     const urlIncludeDate = searchParams.get("includeDateInReport");
//     const urlFromDate = searchParams.get("userSelectedFromDate");
//     const urlToDate = searchParams.get("userSelectedToDate");
//     const urlFromTime = searchParams.get("userSelectedFromTime") || "00:00:00";
//     const urlToTime = searchParams.get("userSelectedToTime") || "23:59:59";

//     const shouldUseUserDates =
//       urlIncludeDate === "true" && urlFromDate && urlToDate;

//     if (shouldUseUserDates) {
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

//   /** FETCH (loader removed) */
//   useEffect(() => {
//     if (!uid) return;

//     const displayDates = getDisplayDates();
//     const cacheKey = `${uid}-${displayDates.displayFrom || "no-date"}-${
//       displayDates.displayTo || "no-date"
//     }`;

//     if (equipmentReportCache.has(cacheKey)) {
//       setReportData(equipmentReportCache.get(cacheKey));
//       setHasFetchedOnce(true); // ✅ add this

//       return;
//     }

//     let url = `${API_BASE}/api/trace/equipment-pass-rate/equipment-pass-rate?uid=${encodeURIComponent(
//       uid
//     )}`;

//     if (displayDates.displayFrom && displayDates.displayTo) {
//       url += `&fromDate=${displayDates.displayFrom}&toDate=${displayDates.displayTo}&fromTime=${displayDates.displayFromTime}&toTime=${displayDates.displayToTime}`;
//     }

//     fetch(url)
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         return res.json();
//       })
//       .then((data) => {
//         const processedData = Array.isArray(data) ? data : [];
//         equipmentReportCache.set(cacheKey, processedData);
//         setReportData(processedData);
//       })
//       .catch(() => {
//         setReportData([]);
//       })
//       .finally(() => {
//         setHasFetchedOnce(true);
//       });
//   }, [uid]);

//   /** Format date */
//   const formatDateTime = (dateString) => {
//     if (!dateString) return "—";
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return "—";
//       const d = String(date.getDate()).padStart(2, "0");
//       const m = String(date.getMonth() + 1).padStart(2, "0");
//       const y = date.getFullYear();
//       return `${d}-${m}-${y}`;
//     } catch {
//       return "—";
//     }
//   };

//   const calculateResultStatus = (data) => {
//     if (!data || data.length === 0) return "—";
//     const totalCount = data.reduce(
//       (sum, item) => sum + (item.equipment_count || 0),
//       0
//     );
//     if (totalCount === 0) return "NO DATA";
//     return "PASS";
//   };

//   const calculateEquipmentStats = (data) => {
//     if (!data || data.length === 0)
//       return { totalEquipment: 0, totalRecords: 0 };
//     const totalEquipment = data.length;
//     const totalRecords = data.reduce(
//       (sum, item) => sum + (item.equipment_count || 0),
//       0
//     );
//     return { totalEquipment, totalRecords };
//   };

//   const hasData = reportData && reportData.length > 0;
//   const displayDates = getDisplayDates();

//   const shouldShowNoReportsMessage = () => {
//     const urlIncludeDate = searchParams.get("includeDateInReport");
//     const urlFromDate = searchParams.get("userSelectedFromDate");
//     const urlToDate = searchParams.get("userSelectedToDate");
//     const isScenario1 = urlIncludeDate === "true" && urlFromDate && urlToDate;
//     const noData = !hasData;
//     return isScenario1 && noData;
//   };

//   const equipmentStats = calculateEquipmentStats(reportData);

//   return (
//     <div className="equipment-report-container min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 sm:px-6 lg:px-12 py-4 sm:py-6 lg:py-10">
//       <div
//         id="full-report-page"
//         className="mx-auto w-full max-w-[95%] sm:max-w-[1100px] lg:max-w-[1400px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10"
//       >
//         {/* HEADER */}
//         <header className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b">
//           <div className="w-full sm:w-1/3 flex justify-center sm:justify-start">
//             <img
//               src={embedded ? facteyes : "/Facteyes_image.png"}
//               alt="Logo"
//               className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
//             />
//           </div>

//           <div className="w-full sm:w-1/3 text-center">
//             <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 uppercase">
//               Equipment Pass Rate Report
//             </h1>
//             {uid && (
//               <div className="mt-2 text-sm">
//                 UID: <span className="font-semibold">{uid}</span>
//               </div>
//             )}
//           </div>

//           <div className="w-full sm:w-1/3" />
//         </header>

//         {/* MAIN REPORT */}
//         {hasData && (
//           <>
//             <div className="col-span-1 sm:col-span-2 lg:col-span-3">
//               <SummaryCardEquipment
//                 pageMaxWidth="1200px"
//                 modelName={reportData[0]?.productmodelname}
//                 variant={reportData[0]?.productvariant}
//                 displayFromRaw={displayDates.displayFrom}
//                 displayToRaw={displayDates.displayTo}
//                 fromTime={displayDates.displayFromTime}
//                 toTime={displayDates.displayToTime}
//                 resultStatus={calculateResultStatus(reportData)}
//                 formatDateTime={formatDateTime}
//                 totalEquipment={equipmentStats.totalEquipment}
//                 totalRecords={equipmentStats.totalRecords}
//               />
//             </div>

//             <div className="col-span-1 sm:col-span-2 lg:col-span-3">
//               <EquipmentTable reportData={reportData} />
//             </div>
//           </>
//         )}

//         {hasFetchedOnce && !hasData && shouldShowNoReportsMessage() && (
//           <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-red-600">
//             No reports found for the selected date.
//           </div>
//         )}

//         {hasFetchedOnce && !hasData && !shouldShowNoReportsMessage() && (
//           <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-gray-500">
//             No equipment data found for UID: {uid}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// src/components/EquipmentPassRateReport.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SummaryCardEquipment from "./SummaryCardEquipment";
import { EquipmentTable } from "./EquipmentTable";
import facteyes from "../public/micrologic_image.png";

const API_BASE = "http://localhost:4000";

// Cache
const equipmentReportCache = new Map();

export default function EquipmentPassRateReport({
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
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  useEffect(() => {
    const latestUid = uidFromParent || uidFromUrl || "";
    if (latestUid && latestUid !== uid) setUid(latestUid);
  }, [uidFromParent, uidFromUrl]);

  const getDisplayDates = () => {
    const urlIncludeDate = searchParams.get("includeDateInReport");
    const urlFromDate = searchParams.get("userSelectedFromDate");
    const urlToDate = searchParams.get("userSelectedToDate");
    const urlFromTime = searchParams.get("userSelectedFromTime") || "00:00:00";
    const urlToTime = searchParams.get("userSelectedToTime") || "23:59:59";

    const shouldUseUserDates =
      urlIncludeDate === "true" && urlFromDate && urlToDate;

    if (shouldUseUserDates) {
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

  /** FETCH (loader removed) */
  useEffect(() => {
    if (!uid) return;

    const displayDates = getDisplayDates();
    const cacheKey = `${uid}-${displayDates.displayFrom || "no-date"}-${
      displayDates.displayTo || "no-date"
    }`;

    if (equipmentReportCache.has(cacheKey)) {
      setReportData(equipmentReportCache.get(cacheKey));
      setHasFetchedOnce(true); // ✅ add this

      return;
    }

    let url = `${API_BASE}/api/trace/equipment-pass-rate/equipment-pass-rate?uid=${encodeURIComponent(
      uid
    )}`;

    if (displayDates.displayFrom && displayDates.displayTo) {
      url += `&fromDate=${displayDates.displayFrom}&toDate=${displayDates.displayTo}&fromTime=${displayDates.displayFromTime}&toTime=${displayDates.displayToTime}`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const processedData = Array.isArray(data) ? data : [];
        equipmentReportCache.set(cacheKey, processedData);
        setReportData(processedData);
      })
      .catch(() => {
        setReportData([]);
      })
      .finally(() => {
        setHasFetchedOnce(true);
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
    const totalCount = data.reduce(
      (sum, item) => sum + (item.equipment_count || 0),
      0
    );
    if (totalCount === 0) return "NO DATA";
    return "PASS";
  };

  const calculateEquipmentStats = (data) => {
    if (!data || data.length === 0)
      return { totalEquipment: 0, totalRecords: 0 };
    const totalEquipment = data.length;
    const totalRecords = data.reduce(
      (sum, item) => sum + (item.equipment_count || 0),
      0
    );
    return { totalEquipment, totalRecords };
  };

  const hasData = reportData && reportData.length > 0;
  const displayDates = getDisplayDates();

  const shouldShowNoReportsMessage = () => {
    const urlIncludeDate = searchParams.get("includeDateInReport");
    const urlFromDate = searchParams.get("userSelectedFromDate");
    const urlToDate = searchParams.get("userSelectedToDate");
    const isScenario1 = urlIncludeDate === "true" && urlFromDate && urlToDate;
    const noData = !hasData;
    return isScenario1 && noData;
  };

  const equipmentStats = calculateEquipmentStats(reportData);

  return (
    <div className="equipment-report-container min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-3 sm:py-4 md:py-6 lg:py-8 xl:py-10">
      <div
        id="full-report-page"
        className="mx-auto w-full max-w-full sm:max-w-[95%] md:max-w-[1100px] lg:max-w-[1200px] xl:max-w-[1400px] grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10"
      >
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 md:pb-5 lg:pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-full sm:w-auto sm:flex-1 lg:flex-initial lg:min-w-[200px] xl:min-w-[250px] flex justify-center sm:justify-start order-1 sm:order-1">
            <img
              src={embedded ? facteyes : "/Facteyes_image.png"}
              alt="Logo"
              className="h-8 sm:h-10 md:h-11 lg:h-12 xl:h-14 w-auto object-contain"
            />
          </div>

          <div className="w-full sm:flex-1 text-center px-2 sm:px-3 md:px-4 order-2 sm:order-2">
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-purple-600 uppercase tracking-tight sm:tracking-normal">
              Equipment Pass Rate Report
            </h1>
            {uid && (
              <div className="mt-1 sm:mt-2 flex flex-col sm:flex-row items-center justify-center sm:space-x-2">
                <span className="text-xs sm:text-sm md:text-sm lg:text-base text-gray-600 dark:text-gray-400">
                  UID:
                </span>
                <span className="font-semibold text-xs sm:text-sm md:text-sm lg:text-base bg-gray-100 dark:bg-gray-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md border border-gray-300 dark:border-gray-600 mt-1 sm:mt-0 break-all max-w-[200px] sm:max-w-xs md:max-w-sm lg:max-w-none">
                  {uid}
                </span>
              </div>
            )}
          </div>

          <div className="hidden sm:block sm:flex-1 lg:flex-initial lg:min-w-[200px] xl:min-w-[250px] order-3" />
        </header>

        {/* MAIN REPORT */}
        {hasData && (
          <>
            <div className="w-full overflow-x-auto">
              <div className="min-w-[320px]">
                <SummaryCardEquipment
                  pageMaxWidth="100%"
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
            </div>

            <div className="w-full overflow-x-auto -mx-2 sm:-mx-0 px-2 sm:px-0">
              <div className="min-w-[320px] sm:min-w-full">
                <EquipmentTable reportData={reportData} />
              </div>
            </div>
          </>
        )}

        {hasFetchedOnce && !hasData && shouldShowNoReportsMessage() && (
          <div className="flex items-center justify-center min-h-[150px] sm:min-h-[200px] md:min-h-[250px] lg:min-h-[300px]">
            <div className="text-center text-red-600 px-4">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium">
                No reports found for the selected date.
              </p>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
                From: {formatDateTime(displayDates.displayFrom)}
              </p>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
                To: {formatDateTime(displayDates.displayTo)}
              </p>
            </div>
          </div>
        )}

        {hasFetchedOnce && !hasData && !shouldShowNoReportsMessage() && (
          <div className="flex items-center justify-center min-h-[150px] sm:min-h-[200px] md:min-h-[250px] lg:min-h-[300px]">
            <div className="text-center text-gray-500 px-4">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl">
                No equipment data found for UID:
              </p>
              <p className="text-purple-600 font-semibold mt-2 text-sm sm:text-base md:text-lg lg:text-xl break-all max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
                {uid}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
