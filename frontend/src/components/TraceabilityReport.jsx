// src/components/TraceabilityReport.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SummaryCard from "./SummaryCard";
import ReportControls from "./ReportControls";
import { ReportTable } from "./ReportTable";
import facteyes from "../public/micrologic_image.png";

// Backend base URL
const API_BASE = import.meta.env.VITE_API_BASE;

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
      uid,
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
      d.getMinutes(),
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
      d.getMonth() + 1,
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
            : "min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10"
        }
      `}
    >
      {/* ---------------- HEADER (Responsive) ---------------- */}
      {/* {embedded ? (
        <header className="flex flex-col sm:flex-row items-center justify-between mb-3 sm:mb-4 md:mb-6 lg:mb-8 border-b border-gray-200 dark:border-gray-700 pb-2 sm:pb-3 md:pb-4 gap-2 sm:gap-3 md:gap-4">
          <div className="flex items-center justify-center sm:justify-start w-full sm:w-auto">
            <img
              src={facteyes}
              alt="Micrologic"
              className="h-6 sm:h-8 md:h-10 lg:h-12 xl:h-[55px] w-auto object-contain"
            />
          </div>

          <div className="text-center flex-1 px-2 sm:px-3 md:px-4">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-purple-600 uppercase tracking-tight sm:tracking-normal md:tracking-wide">
              Traceability Report
            </h1>
            {uid && (
              <div className="mt-1 sm:mt-2 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                <span className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  UID:
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm font-semibold bg-gray-100 dark:bg-gray-800 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-md border border-gray-300 dark:border-gray-600 break-all max-w-[150px] sm:max-w-[250px] md:max-w-none">
                  {uid}
                </span>
              </div>
            )}
          </div>

          <div className="hidden sm:block w-6 sm:w-8 md:w-10 lg:w-12"></div>
        </header>
      ) : (
        <header className="flex flex-col sm:flex-row items-center justify-between mb-3 sm:mb-4 md:mb-6 lg:mb-8 border-b border-gray-200 dark:border-gray-700 pb-2 sm:pb-3 md:pb-4 gap-2 sm:gap-3 md:gap-4">
          <div className="flex items-center justify-center sm:justify-start w-full sm:w-auto">
            <img
              src="/Facteyes_image.png"
              alt="FactEyes"
              className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto object-contain"
            />
          </div>

          <div className="text-center flex-1 px-2 sm:px-3 md:px-4">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-purple-600 uppercase tracking-tight sm:tracking-normal md:tracking-wide">
              Traceability Report
            </h1>
            {uid && (
              <div className="mt-1 sm:mt-2 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                <span className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  UID:
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm font-semibold bg-gray-100 dark:bg-gray-800 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-md border border-gray-300 dark:border-gray-600 break-all max-w-[150px] sm:max-w-[250px] md:max-w-none">
                  {uid}
                </span>
              </div>
            )}
          </div>

          <div className="hidden sm:block w-6 sm:w-8 md:w-10 lg:w-12"></div>
        </header>
      )} */}

      {hasFetchedOnce && hasData && (
        <div className="pdf-header-block">
          {/* -------- HEADER -------- */}
          {embedded ? (
            <header className="flex flex-col sm:flex-row items-center justify-between mb-3 border-b pb-2 gap-2">
              <img src={facteyes} alt="Micrologic" className="h-10" />
              <div className="text-center flex-1">
                <h1 className="text-lg font-bold text-purple-600 uppercase">
                  Traceability Report
                </h1>
                <div className="text-xs mt-1">
                  UID: <strong>{uid}</strong>
                </div>
              </div>
            </header>
          ) : (
            <header className="flex flex-col sm:flex-row items-center justify-between mb-3 border-b pb-2 gap-2">
              <img src="/Facteyes_image.png" alt="FactEyes" className="h-10" />
              <div className="text-center flex-1">
                <h1 className="text-lg font-bold text-purple-600 uppercase">
                  Traceability Report
                </h1>
                <div className="text-xs mt-1">
                  UID: <strong>{uid}</strong>
                </div>
              </div>
            </header>
          )}

          {/* -------- SUMMARY CARD (MOVED HERE) -------- */}
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
      )}

      {/* ======================== MAIN CONTENT ======================== */}
      {hasFetchedOnce && hasData ? (
        <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12">
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
                  productionDates.endDate,
                )
              : true;

            if (isScenario1 && !matchRange) {
              return (
                <div className="flex flex-col items-center justify-center h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 text-gray-500 px-2 sm:px-4">
                  <p className="text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-medium text-red-600 mb-1 sm:mb-2 text-center">
                    No reports found for the selected date.
                  </p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 text-center">
                    Selected: {formatDateTime(f)} to {formatDateTime(t)}
                  </p>
                </div>
              );
            }

            return (
              <>
                {/* ================= SummaryCard ================= */}
                {/* <div className="w-full">
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
                </div> */}

                {/* ================= Table Section ================= */}
                <div
                  className="mt-4 sm:mt-6 md:mt-8 lg:mt-10 xl:mt-12 w-full overflow-x-auto"
                  id="report-area"
                >
                  <ReportTable reportData={reportData} />
                </div>

                {/* ================= Controls Section ================= */}
                <div className="mt-3 sm:mt-4 md:mt-6 lg:mt-8 xl:mt-10 flex justify-center pb-2 sm:pb-4">
                  <ReportControls
                    uid={uid}
                    reportData={reportData}
                    reportType="traceability"
                  />
                </div>
              </>
            );
          })()}
        </div>
      ) : null}

      {/* ======================== EMPTY DATA ======================== */}
      {hasFetchedOnce && !hasData && (
        <div className="flex flex-col items-center justify-center h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 text-gray-500 px-2 sm:px-4">
          <p className="text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-medium text-center">
            No data found for UID:
          </p>
          <p className="text-purple-600 font-semibold mt-1 text-xs sm:text-sm md:text-base lg:text-lg break-all text-center max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
            {uid}
          </p>
        </div>
      )}
    </div>
  );
}
