// src/components/EquipmentPassRateReport.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SummaryCardEquipment from "./SummaryCardEquipment";
import { EquipmentTable } from "./EquipmentTable";
import facteyes from "../public/micrologic_image.png";
import ReportControls from "./ReportControls";

const API_BASE = import.meta.env.VITE_API_BASE;

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
      uid,
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
      0,
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
      0,
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
    <div className="equipment-report-container min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10">
      <div
        id="full-report-page"
        className="mx-auto w-full max-w-full lg:max-w-[1200px] xl:max-w-[1400px]"
      >
        {/* HEADER - Responsive */}
        {/* ================= PDF HEADER BLOCK ================= */}
        <div className="pdf-header-block">
          <header className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 md:pb-5 border-b border-gray-200 dark:border-gray-700 mb-4 sm:mb-6">
            <div className="flex justify-center sm:justify-start w-full sm:w-auto">
              <img
                src={embedded ? facteyes : "/Facteyes_image.png"}
                alt="Logo"
                className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain"
              />
            </div>

            <div className="flex-1 text-center px-2 sm:px-4">
              <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-purple-600 uppercase">
                Equipment Pass Rate Report
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

            <div className="hidden sm:block w-8 sm:w-10 md:w-12 lg:w-14" />
          </header>

          <div className="w-full">
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

        {/* MAIN REPORT */}
        {hasData && (
          <div className="space-y-4 sm:space-y-6">
            <div className="w-full overflow-x-auto">
              <EquipmentTable reportData={reportData} />
            </div>
            <div className="mt-4 sm:mt-6 flex justify-center">
              <ReportControls
                uid={uid}
                reportData={reportData}
                reportType="equipment"
              />
            </div>
          </div>
        )}

        {hasFetchedOnce && !hasData && shouldShowNoReportsMessage() && (
          <div className="flex items-center justify-center min-h-[200px] sm:min-h-[300px]">
            <div className="text-center text-red-600 px-4">
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium">
                No reports found for the selected date.
              </p>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-2">
                From: {formatDateTime(displayDates.displayFrom)}
              </p>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400">
                To: {formatDateTime(displayDates.displayTo)}
              </p>
            </div>
          </div>
        )}

        {hasFetchedOnce && !hasData && !shouldShowNoReportsMessage() && (
          <div className="flex items-center justify-center min-h-[200px] sm:min-h-[300px]">
            <div className="text-center text-gray-500 px-4">
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                No equipment data found for UID:
              </p>
              <p className="text-purple-600 font-semibold mt-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl break-all max-w-[200px] sm:max-w-[350px] md:max-w-none mx-auto">
                {uid}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
