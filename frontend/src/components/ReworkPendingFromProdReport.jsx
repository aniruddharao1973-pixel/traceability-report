// src/components/ReworkPendingFromProdReport.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SummaryCardReworkPendingfromprod from "./SummaryCardReworkPendingfromprod";
import { ReworkPendingProdTable } from "./ReworkPendingProdTable";
import facteyes from "../public/micrologic_image.png";
import ReportControls from "./ReportControls";

const API_BASE = import.meta.env.VITE_API_BASE;
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

  const exportRows =
    reportData?.tableData && Array.isArray(reportData.tableData)
      ? reportData.tableData
      : reportData?.records && Array.isArray(reportData.records)
        ? reportData.records
        : [];

  return (
    <div className="rework-report-container min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10">
      <div id="full-report-page" className="mx-auto w-full max-w-[1400px]">
        {/* RESPONSIVE HEADER */}
        {/* ================= PDF HEADER BLOCK ================= */}
        <div className="pdf-header-block">
          <header className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* LOGO */}
            <div className="flex justify-center sm:justify-start w-full sm:w-auto">
              <img
                src={facteyes}
                alt="Micrologic"
                className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain"
              />
            </div>

            {/* TITLE + UID */}
            <div className="text-center flex-1 px-2">
              <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-purple-600 uppercase">
                Rework Approved Report Pending From Production
              </h1>

              {uid && (
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className="text-xs text-gray-600">UID:</span>
                  <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded border">
                    {uid}
                  </span>
                </div>
              )}
            </div>

            <div className="hidden sm:block sm:w-20" />
          </header>

          {/* ✅ SUMMARY MUST BE INSIDE PDF HEADER BLOCK */}
          {hasData && (
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
          )}
        </div>

        {/* DATA AVAILABLE */}
        {hasData && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* TABLE - Responsive wrapper */}
            <div className="mt-4 sm:mt-6 md:mt-8 w-full overflow-hidden bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm sm:shadow-md lg:shadow-lg p-2 sm:p-3 md:p-4 lg:p-5">
              <div className="w-full overflow-x-auto overflow-y-hidden -mx-2 sm:mx-0 px-2 sm:px-0">
                <ReworkPendingProdTable reportData={reportData} />
              </div>
            </div>

            {/* CONTROLS SECTION — Export PDF / Excel */}
            <div className="mt-4 sm:mt-6 flex justify-center sm:justify-end w-full px-2 sm:px-0">
              <ReportControls
                uid={uid}
                reportData={exportRows}
                reportType="rework-pending-prod"
              />
            </div>
          </div>
        )}

        {/* NO DATA - Responsive text sizes */}
        {hasFetchedOnce && !hasData && (
          <div className="flex flex-col items-center justify-center h-32 sm:h-48 md:h-64 text-center text-gray-500 px-4">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium">
              No rework pending data found
            </p>
            <p className="text-purple-600 font-semibold mt-1.5 sm:mt-2 text-[10px] sm:text-xs md:text-sm">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
