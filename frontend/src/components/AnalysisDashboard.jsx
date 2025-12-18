// src/components/AnalysisDashboard.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import ReportControls from "./ReportControls";

// lucide icons (only the ones you use)
import {
  Package,
  Repeat,
  Layers,
  Server,
  Timer,
  PieChart,
  Factory,
  AlertTriangle,
  CheckCircle,
  BarChart3,
} from "lucide-react";

// Add custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, rgba(139, 92, 246, 0.6), rgba(59, 130, 246, 0.6));
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.8));
  }
`;

// Animated Background Component - unchanged
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-blue-500" />
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-0 -left-48 w-72 sm:w-80 md:w-96 h-72 sm:h-80 md:h-96 bg-blue-300/40 rounded-full blur-3xl"
    />
    <motion.div
      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2,
      }}
      className="absolute bottom-0 -right-48 w-72 sm:w-80 md:w-96 h-72 sm:h-80 md:h-96 bg-purple-300/30 rounded-full blur-3xl"
    />
    <motion.div
      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 4,
      }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-80 md:w-96 h-72 sm:h-80 md:h-96 bg-indigo-300/30 rounded-full blur-3xl"
    />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[size:64px_64px]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent)]" />
  </div>
);

// Inline barcode SVG (small, crisp)
const BarcodeIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <path d="M4 7v10M7 7v10M10 7v10M13 7v10M16 7v10M19 7v10" />
  </svg>
);

const AnalysisDashboard = ({ uid: externalUid }) => {
  const [uid, setUid] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();

  // Fetch analysis from backend (unchanged)
  const fetchAnalysis = async (productUid) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(
        `http://localhost:4000/api/trace/analysis?uid=${productUid}`
      );
      const data = await resp.json();
      if (data.success) setAnalysisData(data);
      else setError(data.message || "Failed to fetch analysis");
    } catch (err) {
      setError("Connection error: " + err.message);
    }
    setLoading(false);
    setHasFetchedOnce(true);
  };

  useEffect(() => {
    if (externalUid) {
      setLoading(true);
      setAnalysisData(null);
      setUid(externalUid);
      fetchAnalysis(externalUid);
    }
  }, [externalUid]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const routeUid = params.get("uid");
    if (routeUid) {
      setUid(routeUid);
      fetchAnalysis(routeUid);
    }
  }, [location.search]);

  // UI helpers - unchanged
  const statusPill = (status) => {
    if (!status) return null;
    const s = String(status).toUpperCase();
    const map = {
      PASS: "bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg",
      FAIL: "bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg",
      REWORK:
        "bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg",
      "REWORK DONE":
        "bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg",
    };
    return (
      <span
        className={
          map[s] ||
          "bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
        }
      >
        {s}
      </span>
    );
  };

  const getCardClassByStatus = (status) => {
    const s = String(status || "").toUpperCase();
    if (s === "PASS")
      return "bg-gradient-to-br from-emerald-100/80 via-emerald-50/60 to-white/40 border-emerald-400/50 text-gray-900";
    if (s === "FAIL")
      return "bg-gradient-to-br from-rose-100/80 via-rose-50/60 to-white/40 border-rose-400/50 text-gray-900";
    if (s === "REWORK DONE")
      return "bg-gradient-to-br from-orange-100/80 via-orange-50/60 to-white/40 border-orange-400/50 text-gray-900";
    if (s === "REWORK")
      return "bg-gradient-to-br from-amber-100/80 via-amber-50/60 to-white/40 border-amber-400/50 text-gray-900";
    return "bg-white/80 border-gray-300 text-gray-900";
  };

  // StatCard - preserved logic, added responsive typography & paddings
  const StatCard = ({
    icon,
    title,
    value,
    subtitle,
    color = "blue",
    glow = false,
  }) => {
    const colorMap = {
      blue: "from-blue-100/60 via-blue-50/40 to-white/30 border-blue-400/40 shadow-blue-400/20",
      emerald:
        "from-emerald-100/60 via-emerald-50/40 to-white/30 border-emerald-400/40 shadow-emerald-400/20",
      amber:
        "from-amber-100/60 via-amber-50/40 to-white/30 border-amber-400/40 shadow-amber-400/20",
      cyan: "from-cyan-100/60 via-cyan-50/40 to-white/30 border-cyan-400/40 shadow-cyan-400/20",
      purple:
        "from-purple-100/60 via-purple-50/40 to-white/30 border-purple-400/40 shadow-purple-400/20",
    };
    const iconBgMap = {
      blue: "bg-gradient-to-br from-blue-200/80 to-blue-100/60 text-blue-700 shadow-lg shadow-blue-400/30",
      emerald:
        "bg-gradient-to-br from-emerald-200/80 to-emerald-100/60 text-emerald-700 shadow-lg shadow-emerald-400/30",
      amber:
        "bg-gradient-to-br from-amber-200/80 to-amber-100/60 text-amber-700 shadow-lg shadow-amber-400/30",
      cyan: "bg-gradient-to-br from-cyan-200/80 to-cyan-100/60 text-cyan-700 shadow-lg shadow-cyan-400/30",
      purple:
        "bg-gradient-to-br from-purple-200/80 to-purple-100/60 text-purple-700 shadow-lg shadow-purple-400/30",
    };
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03, y: -6 }}
        className={`relative p-4 sm:p-5 lg:p-6 rounded-2xl lg:rounded-3xl bg-gradient-to-br ${
          colorMap[color]
        } backdrop-blur-2xl border-2 ${
          glow ? "shadow-2xl" : "shadow-xl"
        } hover:shadow-2xl transition-all duration-500`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 pr-3">
            <p className="text-indigo-900 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider mb-1 sm:mb-2">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-0">
              {value}
            </p>
            {subtitle && (
              <p className="text-gray-600 text-xs sm:text-sm">{subtitle}</p>
            )}
          </div>
          <div
            className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${iconBgMap[color]} backdrop-blur-sm`}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7">{icon}</div>
          </div>
        </div>
      </motion.div>
    );
  };

  // StationNode - keep look & animation, adjust min width for responsive
  const StationNode = ({ station, isLast }) => {
    const cardClass = getCardClassByStatus(station.status);
    return (
      <div className="flex items-center shrink-0">
        <motion.div
          whileHover={{ scale: 1.03, y: -4 }}
          className={`relative p-3 sm:p-5 rounded-2xl backdrop-blur-2xl border-2 transition-all duration-300 min-w-[150px] sm:min-w-[180px] shadow-lg ${cardClass}`}
        >
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm">
              {station.station_name}
            </h4>
            {statusPill(station.status)}
          </div>
        </motion.div>

        {!isLast && (
          <div className="mx-2 sm:mx-3">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.45 }}
              className="w-10 sm:w-12 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 rounded-full shadow-lg"
            />
          </div>
        )}
      </div>
    );
  };

  // Loading / error / empty states - preserved
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <AnimatedBackground />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <AnimatedBackground />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center p-4 sm:p-8"
        >
          <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-rose-500 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            Error
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (hasFetchedOnce && !analysisData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <AnimatedBackground />
        <div className="text-center">
          <Factory className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            No Data
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            No analysis data available for this UID
          </p>
        </div>
      </div>
    );
  }

  // destructure analysisData (unchanged)
  const {
    product_info = {},
    cycle_time_minutes = 0,
    number_of_cycles = 0,
    number_of_equipments = 0,
    quality_summary = {},
    station_flow = [],
    measurement_data = [],
  } = analysisData || {};

  const passPercent = quality_summary.pass_percent ?? 0;
  const failPercent = quality_summary.fail_percent ?? 0;

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="p-4 sm:p-6 lg:p-12 relative">
        <AnimatedBackground />

        <div
          id="full-report-page"
          className="max-w-7xl mx-auto space-y-6 sm:space-y-8 relative z-10"
        >
          {/* UID - responsive sizes */}
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="
                inline-flex items-center gap-3 sm:gap-4 
                px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-3.5
                rounded-full 
                bg-white/20 
                border border-white/40 
                backdrop-blur-2xl 
                shadow-lg
              "
              style={{ boxShadow: "0 8px 25px rgba(0,0,0,0.12)" }}
            >
              <BarcodeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-900 drop-shadow-sm" />
              <span className="text-indigo-800 text-sm sm:text-lg lg:text-xl font-extrabold tracking-wide">
                UID: {uid}
              </span>
            </motion.div>
          </div>

          {/* TOP ROW - responsive: mobile 1 col, tablet 2, desktop 3 */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
          >
            <StatCard
              icon={<Timer className="w-5 h-5" />}
              title="Cycle Time (min)"
              value={cycle_time_minutes ?? "0.00"}
              subtitle=""
              color="purple"
            />
            <StatCard
              icon={<Server className="w-5 h-5" />}
              title="No. of Equipments"
              value={number_of_equipments ?? 0}
              subtitle=""
              color="blue"
            />
            <StatCard
              icon={<Layers className="w-5 h-5" />}
              title="Variant"
              value={product_info.variant || "N/A"}
              subtitle=""
              color="blue"
            />
          </motion.div>

          {/* SECOND ROW */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
          >
            <StatCard
              icon={<Repeat className="w-5 h-5" />}
              title="Number of Cycles"
              value={number_of_cycles ?? 0}
              subtitle=""
              color="emerald"
              glow
            />
            <StatCard
              icon={<Package className="w-5 h-5" />}
              title="Model"
              value={product_info.model || "N/A"}
              subtitle=""
              color="cyan"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -6 }}
              className="relative p-4 sm:p-6 rounded-2xl lg:rounded-3xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-2xl border-2 border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-blue-900 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider mb-2">
                    Quality Summary
                  </p>
                  <div className="flex items-baseline space-x-4 sm:space-x-6">
                    <div>
                      <p className="text-2xl sm:text-4xl font-black text-emerald-600">
                        {passPercent}%
                      </p>
                      <p className="text-gray-900 text-xs sm:text-sm font-extrabold">
                        PASS
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl sm:text-4xl font-black text-rose-600">
                        {failPercent}%
                      </p>
                      <p className="text-gray-900 text-xs sm:text-sm font-extrabold">
                        FAIL
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-200/80 to-blue-100/60 shadow-lg shadow-blue-400/30">
                  <PieChart className="w-4 h-4 sm:w-6 sm:h-6 text-blue-700" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Production Flow section */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/70 rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 backdrop-blur-2xl border-2 border-white/50 shadow-2xl"
          >
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-blue-200/80 to-blue-100/60 shadow-lg">
                <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-blue-700" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                Production Flow
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 via-cyan-500/30 to-transparent ml-3"></div>
            </div>

            <div
              className="flex overflow-x-auto overflow-y-hidden pb-3 sm:pb-4 space-x-3 sm:space-x-4 custom-scrollbar scroll-smooth"
              style={{
                WebkitOverflowScrolling: "touch",
                scrollBehavior: "smooth",
                overscrollBehavior: "contain",
              }}
            >
              {station_flow.map((st, i) => (
                <StationNode
                  key={`${st.station_name}-${i}`}
                  station={st}
                  isLast={i === station_flow.length - 1}
                />
              ))}
            </div>
          </motion.section>

          {/* Measurement Data */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 backdrop-blur-2xl border-2 border-white/50 shadow-2xl"
          >
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-emerald-200/80 to-emerald-100/60 shadow-lg">
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-700" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                Measurement Data (PASS / FAIL stations)
              </h2>
            </div>

            {/* vertical list; responsive max heights */}
            <div className="max-h-[420px] sm:max-h-[520px] lg:max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-4 sm:space-y-6">
                {measurement_data.every(
                  (m) => !m.measurements || m.measurements.length === 0
                ) && (
                  <div className="p-3 sm:p-4 rounded-xl bg-white/60 border border-gray-200 text-gray-700 text-sm sm:text-base text-center">
                    No measurement data recorded for PASS or FAIL stations
                  </div>
                )}

                {measurement_data
                  .filter((m) =>
                    ["PASS", "FAIL"].includes(String(m.status).toUpperCase())
                  )
                  .map((m, idx) => (
                    <motion.div
                      key={`${m.station || m.station_name}-${idx}`}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.04 }}
                      whileHover={{ scale: 1.01, y: -2 }}
                      className="p-3 sm:p-6 rounded-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 border-2 border-white/50 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-bold text-gray-900 text-base sm:text-lg">
                          {m.station || m.station_name}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-md ${
                            String(m.status).toUpperCase() === "PASS"
                              ? "bg-emerald-700 text-white"
                              : "bg-rose-600 text-white"
                          }`}
                        >
                          {String(m.status).toUpperCase()}
                        </span>
                      </div>

                      {m.measurements &&
                      Array.isArray(m.measurements) &&
                      m.measurements.length > 0 ? (
                        <div className="space-y-3">
                          {m.measurements.map((meas, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.06 + i * 0.03 }}
                              className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-blue-50/60 to-purple-50/40 border border-blue-200/40 backdrop-blur-sm"
                            >
                              <div className="flex justify-between items-start gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-gray-800 text-sm sm:text-base mb-1">
                                    {meas.testid || "Measurement"}
                                  </div>
                                  {meas.lsl && meas.hsl && (
                                    <div className="text-sm text-gray-900 font-medium space-x-2">
                                      <span className="inline-block px-2 py-0.5 text-xs sm:text-sm rounded bg-blue-50/90">
                                        LSL: {meas.lsl}
                                      </span>
                                      <span className="inline-block px-2 py-0.5 text-xs sm:text-sm rounded bg-purple-50/80">
                                        HSL: {meas.hsl}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <div className="font-bold text-lg sm:text-xl text-gray-900">
                                      {meas.value}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 font-medium">
                                      {meas.unit || ""}
                                    </div>
                                  </div>
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md ${
                                      String(meas.teststatus).toUpperCase() ===
                                      "PASS"
                                        ? "bg-emerald-600 text-white"
                                        : "bg-rose-600 text-white"
                                    }`}
                                  >
                                    {String(meas.teststatus).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600 italic p-3 sm:p-4 bg-gray-50/40 rounded-lg text-center">
                          No measurement data recorded for this station
                        </div>
                      )}
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.section>

          {/* EXPORT PDF */}
          {/* <div className="mt-10 flex justify-center">
            <ReportControls uid={uid} reportType="analysis" />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default AnalysisDashboard;
