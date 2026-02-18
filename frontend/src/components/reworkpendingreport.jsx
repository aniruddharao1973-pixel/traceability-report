// src/components/ReworkPendingReport.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SummaryCard from "./SummaryCardRework";
import { ReportTable } from "./reworkpendingtable";
import ReportControls from "./ReportControls";
import facteyes from "../public/micrologic_image.png";

// const API_BASE = "http://localhost:4000";
const API_BASE = import.meta.env.VITE_API_BASE;

const reworkPendingCountCache = new Map();

export default function ReworkPendingReport({
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
  const [reportData, setReportData] = useState(null);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

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

    const shouldUse = urlIncludeDate === "true" && urlFromDate && urlToDate;

    if (shouldUse) {
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

  // FETCH (cached)
  useEffect(() => {
    if (!uid) return;

    const displayDates = getDisplayDates();
    const cacheKey = `${uid}-${displayDates.displayFrom || "no-date"}-${
      displayDates.displayTo || "no-date"
    }`;

    if (reworkPendingCountCache.has(cacheKey)) {
      setReportData(reworkPendingCountCache.get(cacheKey));
      setHasFetchedOnce(true);
      return;
    }

    if (window.history?.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    let url = `${API_BASE}/api/trace/rework-pending-count/uid/${encodeURIComponent(
      uid,
    )}`;

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
      .finally(() => {
        setHasFetchedOnce(true);
      });
  }, [uid]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "—";
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
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
      case "PENDING":
        return "#e67e22";
      case "NO PENDING":
        return "#2fa84f";
      default:
        return "#ccc";
    }
  };

  const hasData = reportData && reportData.success && reportData.data;
  const displayDates = getDisplayDates();
  const resultStatus = calculateResultStatus(reportData);
  const badgeColor = getBadgeColor(resultStatus);

  const exportRows =
    reportData?.data?.tableData && Array.isArray(reportData.data.tableData)
      ? reportData.data.tableData
      : [];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6">
      <div id="full-report-page" className="mx-auto w-full max-w-[1400px]">
        {/* HEADER */}
        {/* ================= PDF HEADER BLOCK ================= */}
        <div className="pdf-header-block">
          <header
            className="
      flex flex-col sm:flex-row
      items-center justify-between
      gap-2 sm:gap-4
      mb-4 sm:mb-6
      pb-3 sm:pb-4
      border-b border-gray-200 dark:border-gray-700
    "
          >
            {/* LOGO */}
            <div className="flex justify-center sm:justify-start w-full sm:w-auto">
              <img
                src={facteyes}
                alt="Micrologic"
                className="h-8 sm:h-10 md:h-11 lg:h-12 w-auto object-contain"
              />
            </div>

            {/* TITLE + UID */}
            <div className="text-center flex-1 px-2 sm:px-4">
              <h1 className="text-base sm:text-xl md:text-2xl lg:text-2xl font-bold text-purple-600 uppercase">
                Rework Pending Report
              </h1>

              {uid && (
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className="text-xs text-gray-600">UID:</span>
                  <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded border">
                    {uid}
                  </span>
                </div>
              )}
            </div>

            <div className="hidden sm:block sm:w-20 md:w-24"></div>
          </header>

          {/* ✅ SUMMARY MUST BE INSIDE PDF HEADER BLOCK */}
          {hasData && (
            <SummaryCard
              pageMaxWidth="100%"
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
          )}
        </div>

        {/* LOADER */}

        {/* DATA LOADED */}
        {hasData && (
          <div className="space-y-4 xs:space-y-6 sm:space-y-8">
            {/* SUMMARY CARD */}

            {/* TABLE */}
            <div
              className="
                mt-4 xs:mt-6 sm:mt-8 md:mt-10
                overflow-hidden
                bg-white dark:bg-gray-800
                rounded-lg xs:rounded-lg sm:rounded-xl
                shadow-sm xs:shadow sm:shadow-md lg:shadow-lg
                p-2 xs:p-2.5 sm:p-3 md:p-4 lg:p-5
              "
            >
              <div className="w-full overflow-x-auto overflow-y-hidden">
                <div className="min-w-[320px] xs:min-w-[360px] sm:min-w-full">
                  <ReportTable reportData={reportData.data.tableData} />
                </div>
              </div>
            </div>

            {/* EXPORT BUTTONS */}
            {exportRows.length > 0 && (
              <div className="flex justify-center mt-4 xs:mt-6 sm:mt-8 px-2 sm:px-0">
                <div className="w-full sm:w-auto">
                  <ReportControls
                    uid={uid}
                    reportData={exportRows}
                    reportType="reworkpendingtable"
                    keepThemeForExport={false}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* EMPTY STATE */}
        {hasFetchedOnce && !hasData && (
          <div className="flex flex-col items-center justify-center h-40 xs:h-48 sm:h-56 md:h-64 text-center text-gray-500 px-4">
            <p className="text-xs xs:text-sm sm:text-base md:text-lg font-medium">
              {reportData && !reportData.success
                ? reportData.message || "No rework pending data found"
                : "No rework pending data found for UID:"}
            </p>

            <p className="text-purple-600 font-semibold mt-1 xs:mt-1.5 sm:mt-2 text-[10px] xs:text-xs sm:text-sm">
              {uid}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
