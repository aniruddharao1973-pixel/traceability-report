// // src\components\Header.jsx
// import React, { useState, useRef, useEffect } from "react";
// import { useTheme } from "../contexts/ThemeContext";
// import {
//   Calendar,
//   Clock,
//   FileText,
//   Package,
//   Zap,
//   BarChart3,
//   X,
//   Info,
//   Factory,
//   ExternalLink,
// } from "lucide-react";
// // import { useNavigate } from 'react-router-dom';
// import AnalysisDashboard from "./AnalysisDashboard";
// import ReworkSelectorModal from "./ReworkSelectorModal";

// const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:4000";

// export function Header({
//   onSearchResults,
//   onSearchError,
//   selectedOrder,
//   onReset,
//   onSearchStart,
// }) {
//   const { theme, toggleTheme } = useTheme();
//   // const navigate = useNavigate();
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isReportsOpen, setIsReportsOpen] = useState(false);
//   const [isReworkReportsOpen, setIsReworkReportsOpen] = useState(false);
//   const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
//   const [isReportModalOpen, setIsReportModalOpen] = useState(false);
//   const [reportUrl, setReportUrl] = useState("");
//   const [iframeLoaded, setIframeLoaded] = useState(false);
//   const [reportLoading, setReportLoading] = useState(false);

//   // Search states
//   const [searchType, setSearchType] = useState("uid");
//   const [searchValue, setSearchValue] = useState("");
//   // const [loading, setLoading] = useState(false)
//   const [searchWarning, setSearchWarning] = useState("");
//   const [showUidToast, setShowUidToast] = useState(false);
//   const [dialogContext, setDialogContext] = useState(""); // 'search' or 'report'

//   // Reports states
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [fromTime, setFromTime] = useState("");
//   const [toTime, setToTime] = useState("");
//   const [includeDate, setIncludeDate] = useState(false);
//   const [reportType, setReportType] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // refs for outside click
//   const profileRef = useRef(null);
//   const searchRef = useRef(null);
//   const reportsRef = useRef(null);
//   const profileBtnRef = useRef(null);
//   const searchBtnRef = useRef(null);
//   const reportsBtnRef = useRef(null);
//   const reworkBtnRef = useRef(null); // ← ADD THIS LINE
//   const reworkRef = useRef(null); // ← ADD THIS LINE for the rework panel container

//   const closeAll = () => {
//     setIsProfileOpen(false);
//     setIsSearchOpen(false);
//     setIsReportsOpen(false);
//     setIsReworkReportsOpen(false);
//   };

//   const toggleProfileDropdown = () => {
//     setIsProfileOpen((prev) => !prev);
//     setIsSearchOpen(false);
//     setIsReportsOpen(false);
//   };

//   const toggleSearchDropdown = () => {
//     setIsSearchOpen((prev) => !prev);
//     setIsProfileOpen(false);
//     setIsReportsOpen(false);
//   };

//   const toggleReportsDropdown = () => {
//     setIsReportsOpen((prev) => !prev);
//     setIsProfileOpen(false);
//     setIsSearchOpen(false);
//   };

//   useEffect(() => {
//     console.log("[Header] selectedOrder prop:", selectedOrder);
//   }, [selectedOrder]);

//   // Outside click close
//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (
//         profileRef.current?.contains(e.target) ||
//         searchRef.current?.contains(e.target) ||
//         reportsRef.current?.contains(e.target) ||
//         reworkRef.current?.contains(e.target) || // ← ADD THIS LINE
//         profileBtnRef.current?.contains(e.target) ||
//         searchBtnRef.current?.contains(e.target) ||
//         reportsBtnRef.current?.contains(e.target) ||
//         reworkBtnRef.current?.contains(e.target) // ← ADD THIS LINE
//       )
//         return;
//       closeAll();
//     }
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   // ESC key close
//   useEffect(() => {
//     function handleEsc(e) {
//       if (e.key === "Escape") closeAll();
//     }
//     document.addEventListener("keydown", handleEsc);
//     return () => document.removeEventListener("keydown", handleEsc);
//   }, []);

//   // ----- SEARCH LOGIC -----
//   const emitError = (msg) => {
//     setSearchWarning(msg);
//     if (onSearchError) onSearchError(msg);
//     console.error(msg);
//   };

//   async function fetchJson(url) {
//     const res = await fetch(url, { redirect: "follow" });
//     if (!res.ok) throw new Error(`HTTP ${res.status}`);
//     return res.json();
//   }

//   async function fetchAllPages({ term, limit = 2000, first }) {
//     const total = Number(first.total || 0);
//     const totalPages = Math.max(1, Math.ceil(total / limit));
//     let all = Array.isArray(first.data) ? first.data : [];
//     if (totalPages === 1) return all;

//     const pages = [];
//     for (let p = 2; p <= totalPages; p++) pages.push(p);
//     const concurrency = 8;
//     let i = 0;
//     const results = [];

//     async function worker() {
//       while (i < pages.length) {
//         const page = pages[i++];
//         const url = `${API_BASE}/api/trace/uid-contains?term=${encodeURIComponent(
//           term
//         )}&page=${page}&limit=${limit}`;
//         const json = await fetchJson(url);
//         if (Array.isArray(json.data) && json.data.length)
//           results.push(json.data);
//       }
//     }
//     await Promise.all(
//       Array.from({ length: Math.min(concurrency, pages.length) }, () =>
//         worker()
//       )
//     );
//     return all.concat(...results);
//   }

//   function uniqueLatestByUid(rows) {
//     const byUid = new Map();
//     for (const r of rows || []) {
//       const uid = (r.uid || r.UID || r._uid || "").trim();
//       if (!uid) continue;
//       const curr = byUid.get(uid);
//       const currStart = curr?.productionstartdate || curr?._startDate || "";
//       const nextStart = r.productionstartdate || r._startDate || "";
//       if (!curr || String(nextStart) > String(currStart)) {
//         byUid.set(uid, r);
//       }
//     }
//     return Array.from(byUid.values());
//   }

//   const handleSearch = async () => {
//     setSearchWarning("");
//     const value = searchValue.trim();

//     // ✅ Show dialog if no value entered
//     if (!value) {
//       setDialogContext("search");
//       setShowUidToast(true);
//       setTimeout(() => setShowUidToast(false), 3000);
//       return;
//     }

//     if (onSearchStart) onSearchStart(); // This triggers the full-screen loader

//     try {
//       let payload = [];

//       // ✅ SIMPLIFIED: Use the main search endpoint for ALL search types
//       const url = `${API_BASE}/api/trace?${searchType}=${encodeURIComponent(
//         value
//       )}`;
//       console.log("🔍 Searching with URL:", url);

//       const data = await fetchJson(url);
//       payload = Array.isArray(data?.data)
//         ? data.data
//         : Array.isArray(data)
//         ? data
//         : [];

//       // If no results for UID, try partial search
//       if (searchType === "uid" && payload.length === 0) {
//         console.log("🔍 No exact UID match, trying partial search");
//         const limit = 2000;
//         const firstUrl = `${API_BASE}/api/trace/uid-contains?term=${encodeURIComponent(
//           value
//         )}&page=1&limit=${limit}`;
//         const first = await fetchJson(firstUrl);
//         payload = await fetchAllPages({ term: value, limit, first });
//       }

//       payload = uniqueLatestByUid(payload);

//       if (onSearchResults) onSearchResults(payload);
//       setIsSearchOpen(false);
//     } catch (err) {
//       console.error("🔍 Search failed:", err);

//       // More specific error messages
//       if (err.message.includes("HTTP 400")) {
//         emitError("Invalid search request. Please check your input.");
//       } else if (err.message.includes("HTTP 404")) {
//         emitError("No results found. Please try a different search term.");
//       } else if (err.message.includes("HTTP 500")) {
//         emitError("Server error. Please try again later.");
//       } else {
//         emitError("Search failed: " + err.message);
//       }

//       if (onSearchResults) onSearchResults([]);
//     }
//     // No finally block needed since we removed loading state
//   };

//   const handleReset = () => {
//     setSearchValue("");
//     setSearchWarning("");
//     // DON'T call onSearchResults here - let parent handle it
//   };

//   // ----- REPORTS PANEL LOGIC -----
//   const handleQuickSelect = (days) => {
//     const now = new Date();
//     const past = new Date(now);
//     past.setDate(now.getDate() - days);
//     setFromDate(past.toISOString().slice(0, 10));
//     setToDate(now.toISOString().slice(0, 10));
//   };

//   // ✅ NEW: Called by ReworkSelectorModal
//   const handleReworkGenerate = ({ uid, reportType }) => {
//     if (!uid || !reportType) {
//       alert("Please select a UID");
//       return;
//     }

//     const params = new URLSearchParams({
//       uid,
//       includeDateInReport: "false",
//       userSelectedFromDate: "",
//       userSelectedToDate: "",
//       userSelectedFromTime: "00:00:00",
//       userSelectedToTime: "23:59:59",
//     });

//     let iframeSrc = "";

//     if (reportType === "rework-approved") {
//       iframeSrc = `/#/rework-approved-window?${params.toString()}`;
//     } else if (reportType === "rework-approved-pending-from-production") {
//       iframeSrc = `/#/rework-pending-from-prod-window?${params.toString()}`;
//     } else if (reportType === "rework-pending") {
//       iframeSrc = `/#/rework-pending-window?${params.toString()}`;
//     }

//     setReportType(reportType);
//     setReportUrl(iframeSrc);
//     setIsReportModalOpen(true);
//     setIsReworkReportsOpen(false);
//   };

//   const handleApply = () => {
//     // Analytics shortcut (unchanged)
//     if (reportType === "analytics") {
//       setIsAnalyticsOpen(true);
//       setIsReportsOpen(false);
//       setIsLoading(false);
//       return;
//     }

//     // ✅ IMMEDIATELY set loading state
//     setIsLoading(true);

//     // ✅ FIX #1 — UID GUARD (ADD HERE)
//     if (!selectedOrder?.uid) {
//       setIsLoading(false);
//       setDialogContext("report");
//       setShowUidToast(true);
//       setTimeout(() => setShowUidToast(false), 2000);
//       return;
//     }

//     const uid = selectedOrder.uid;

//     // ✅ Build URL params IMMEDIATELY
//     const params = new URLSearchParams({
//       uid: encodeURIComponent(uid),
//       includeDateInReport: includeDate.toString(),
//       userSelectedFromDate: fromDate || "",
//       userSelectedToDate: toDate || "",
//       userSelectedFromTime: fromTime || "00:00:00",
//       userSelectedToTime: toTime || "23:59:59",
//     });

//     let iframeSrc = "";

//     if (reportType === "equipment") {
//       iframeSrc = `/#/equipment-pass-rate-window?${params.toString()}`;
//     } else {
//       iframeSrc = `/#/traceability-window?${params.toString()}`;
//     }

//     // ✅ REMOVE THE DELAY - set everything immediately
//     setReportUrl(iframeSrc);
//     setIsReportModalOpen(true);
//     setIsReportsOpen(false);

//     // ✅ Reset loading state immediately - the iframe will show its own loader
//     setIsLoading(false);
//   };

//   return (
//     <header className="bg-gradient-to-r from-sky-400 to-purple-500 dark:from-purple-900 dark:to-indigo-900 shadow-lg transition-all duration-200">
//       <div className="container mx-auto px-4 py-2 flex items-center justify-between relative">
//         <div className="flex items-center ml-6">
//           <h1 className="text-xl font-bold text-white">
//             Micrologic<sup className="text-xs">®</sup>
//           </h1>

//           {/* Analytics 4.0 Launch Button - MOVED INSIDE THE SAME FLEX CONTAINER */}
//           <button
//             onClick={() => {
//               if (!selectedOrder?.uid) {
//                 setDialogContext("analytics");
//                 setShowUidToast(true);
//                 setTimeout(() => setShowUidToast(false), 2000);
//                 return;
//               }
//               setIsAnalyticsOpen(true);
//             }}
//             className="ml-20 mr-8 group flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
//             title="Open Industry 4.0 Analytics Dashboard"
//           >
//             <BarChart3 className="h-5 w-5 text-white group-hover:rotate-12 transition-transform duration-300" />
//             <span className="text-sm font-semibold text-white whitespace-nowrap">
//               Analytics 4.0
//             </span>
//           </button>
//         </div>

//         {/* Reports Dashboard Label */}
//         <div className="absolute left-1/2 transform -translate-x-[75%] flex items-center gap-3">
//           <div className="p-2.5 bg-white/25 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
//             <FileText className="w-5 h-5 text-white" />
//           </div>
//           <h2 className="text-lg font-bold text-white tracking-wide">
//             Reports Dashboard
//           </h2>
//         </div>

//         {/* Right Side Controls */}

//         <div className="flex items-center space-x-4 mr-8 relative z-[60]">
//           {/* Traceability & Pass Rate Report Button */}
//           <div className="relative" ref={reportsRef}>
//             <button
//               ref={reportsBtnRef}
//               onClick={toggleReportsDropdown}
//               className="group flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
//               aria-haspopup="true"
//               aria-expanded={isReportsOpen}
//               title="Traceability & Pass Rate Report"
//             >
//               <BarChart3 className="h-5 w-5 text-white group-hover:rotate-12 transition-transform duration-300" />
//               <span className="text-sm font-semibold text-white whitespace-nowrap">
//                 Traceability & Pass Rate Report
//               </span>
//             </button>

//             {/* Main Reports Panel */}
//             {isReportsOpen && (
//               <div className="absolute right-0 mt-2 w-[26rem] bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 z-[50] border border-purple-400/40">
//                 {/* Header */}
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="p-3 bg-gradient-to-br from-sky-400 to-purple-600 rounded-xl shadow-lg">
//                     <BarChart3 className="w-6 h-6 text-white" />
//                   </div>
//                   <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
//                     Reports Panel
//                   </h2>
//                 </div>

//                 {/* Quick selectors */}
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {[
//                     // { label: 'Today', days: 0, icon: Calendar },
//                     // { label: 'Yesterday', days: 1, icon: Clock },
//                     // { label: 'Last 7 days', days: 7, icon: FileText },
//                     // { label: 'Last 30 days', days: 30, icon: Package },
//                   ].map(({ label, days, icon: Icon }) => (
//                     <button
//                       key={label}
//                       onClick={() => handleQuickSelect(days)}
//                       className="group px-5 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-sky-400 to-purple-500 text-white shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300"
//                     >
//                       <span className="flex items-center gap-2">
//                         <Icon className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
//                         {label}
//                       </span>
//                     </button>
//                   ))}
//                 </div>

//                 {/* Date/time pickers */}
//                 {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
//           <div>
//             <label className="block text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">From Date</label>
//             <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
//               className="w-full rounded-lg border border-purple-300 px-3 py-2 dark:bg-gray-800 dark:text-white" />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">To Date</label>
//             <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
//               className="w-full rounded-lg border border-purple-300 px-3 py-2 dark:bg-gray-800 dark:text-white" />
//           </div>
//         </div> */}

//                 {/* Include Date */}
//                 {/* <div className="flex items-center gap-3 mb-4">
//           <input type="checkbox" id="includeDate" checked={includeDate} onChange={(e) => setIncludeDate(e.target.checked)}
//             className="h-5 w-5 text-purple-600 border-purple-400 rounded" />
//           <label htmlFor="includeDate" className="text-sm font-semibold text-sky-800 dark:text-sky-200">
//             Include Date in Report
//           </label>
//         </div> */}

//                 {/* Report Type */}
//                 <div className="mb-4">
//                   <label className="block text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">
//                     Report Type
//                   </label>
//                   <select
//                     value={reportType}
//                     onChange={(e) => setReportType(e.target.value)}
//                     className="w-full rounded-lg border border-purple-300 px-3 py-2 dark:bg-gray-800 dark:text-white"
//                   >
//                     <option value="">Select report type</option>
//                     <option value="traceability">
//                       Traceability Report Complete
//                     </option>
//                     <option value="equipment">
//                       Equipment Pass Rate Report
//                     </option>
//                   </select>
//                 </div>

//                 {/* Generate Button */}
//                 {/* Generate Button */}
//                 <button
//                   onClick={handleApply}
//                   disabled={isLoading}
//                   className="w-full flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 via-purple-500 to-sky-600 hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? (
//                     <>
//                       {/* SIMPLE SPINNER THAT MATCHES FRONTEND THEME */}
//                       <div className="flex items-center">
//                         <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
//                         <span>Generating Report...</span>
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       <Zap className="w-5 h-5 mr-2" /> Generate Report
//                     </>
//                   )}
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Rework Reports Button */}
//           <div className="relative" ref={reworkRef}>
//             <button
//               ref={reworkBtnRef}
//               onClick={() => {
//                 setIsReworkReportsOpen((prev) => !prev);
//                 setIsReportsOpen(false);
//                 setIsProfileOpen(false);
//                 setIsSearchOpen(false);
//               }}
//               className="group px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
//               aria-haspopup="true"
//               aria-expanded={isReworkReportsOpen}
//               title="Rework Reports"
//             >
//               <span className="text-sm font-semibold text-white">Rework</span>
//             </button>

//             {isReworkReportsOpen && (
//               <ReworkSelectorModal
//                 onClose={() => setIsReworkReportsOpen(false)}
//                 onGenerate={handleReworkGenerate}
//               />
//             )}
//           </div>

//           {/* Search Button */}
//           <div className="relative" ref={searchRef}>
//             <button
//               ref={searchBtnRef}
//               onClick={toggleSearchDropdown}
//               className="glow-button group relative w-14 h-14 glass-effect hover:bg-white/30 rounded-2xl border border-white/40 hover:border-white/60 transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/40 flex items-center justify-center overflow-hidden animate-glow-pulse"
//               title="Search"
//             >
//               <div className="shimmer-effect absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6 text-white group-hover:rotate-90 group-hover:scale-110 transition-all duration-500 relative z-10"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2.5}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//             </button>

//             {isSearchOpen && (
//               <div
//                 className="dropdown-enter absolute right-0 mt-4 w-[440px] glass-effect-strong dark:bg-gray-900/95 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/50 transition-all duration-300 ease-out transform origin-top-right z-[80] overflow-hidden"
//                 role="dialog"
//                 aria-label="Search dialog"
//                 style={{
//                   boxShadow:
//                     "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 60px rgba(139, 92, 246, 0.3)",
//                 }}
//               >
//                 {/* Header with enhanced gradient */}
//                 <div className="relative bg-gradient-to-r from-sky-400 via-purple-500 to-indigo-600 dark:from-purple-900 dark:to-indigo-900 px-6 py-4 border-b border-white/20 overflow-hidden">
//                   <div className="shimmer-effect absolute inset-0 opacity-50"></div>
//                   <div className="flex items-center gap-3 relative z-10">
//                     <div className="w-10 h-10 glass-effect backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg animate-float">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 text-white"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={2.5}
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                         />
//                       </svg>
//                     </div>
//                     <h3 className="text-xl font-bold text-white drop-shadow-lg">
//                       Search
//                     </h3>
//                   </div>
//                 </div>

//                 {/* Content */}
//                 <div className="p-5">
//                   {searchWarning && (
//                     <div className="mb-4 text-sm text-amber-700 dark:text-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-md hover-lift">
//                       <svg
//                         className="w-5 h-5 flex-shrink-0"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                       <span className="font-medium">{searchWarning}</span>
//                     </div>
//                   )}

//                   <div className="space-y-3">
//                     {/* Search input */}
//                     <div className="group">
//                       <label
//                         htmlFor="searchInput"
//                         className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"
//                       >
//                         <span className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-500 to-purple-600"></span>
//                         Find
//                       </label>
//                       <input
//                         type="text"
//                         id="searchInput"
//                         className="input-glow block w-full rounded-2xl border-2 border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl focus:ring-0 focus:border-purple-500 dark:focus:border-purple-400 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 transition-all duration-300 placeholder:text-gray-400 hover:border-purple-400 hover-lift"
//                         placeholder="Enter search value..."
//                         value={searchValue}
//                         onChange={(e) => setSearchValue(e.target.value)}
//                         onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//                       />
//                     </div>

//                     {/* Search type dropdown */}
//                     <div className="group">
//                       <label
//                         htmlFor="searchTypeSelect"
//                         className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"
//                       >
//                         <span className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-500 to-purple-600"></span>
//                         Search by
//                       </label>
//                       <div className="relative">
//                         <select
//                           id="searchTypeSelect"
//                           className="input-glow block w-full rounded-2xl border-2 border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl focus:ring-0 focus:border-purple-500 dark:focus:border-purple-400 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 pr-12 transition-all duration-300 cursor-pointer appearance-none hover:border-purple-400 hover-lift font-medium"
//                           value={searchType}
//                           onChange={(e) => setSearchType(e.target.value)}
//                         >
//                           <option value="uid">UID</option>
//                           <option value="productid">Product ID</option>
//                           <option value="productmodelname">
//                             Product Model
//                           </option>
//                           <option value="productvariant">
//                             Product Variant
//                           </option>
//                           <option value="productionstartdate">
//                             {" "}
//                             Production Start Date
//                           </option>
//                           <option value="productionenddate">
//                             {" "}
//                             Production End Date
//                           </option>
//                           <option value="status"> Status</option>
//                           <option value="endoflineuid"> End of line UID</option>
//                         </select>
//                         <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
//                           <svg
//                             className="w-5 h-5 text-purple-500 group-hover:text-purple-600 transition-colors"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2.5}
//                               d="M19 9l-7 7-7-7"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Buttons */}
//                     <div className="flex gap-3 pt-2">
//                       <button
//                         type="button"
//                         onClick={handleSearch}
//                         className="glow-button flex-1 relative inline-flex items-center justify-center px-5 py-3 text-base font-bold rounded-2xl text-white bg-gradient-to-r from-sky-500 via-purple-600 to-indigo-600 hover:from-sky-600 hover:via-purple-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden group"
//                         style={{
//                           boxShadow: "0 10px 30px rgba(139, 92, 246, 0.4)",
//                         }}
//                       >
//                         <div className="shimmer-effect absolute inset-0"></div>
//                         <svg
//                           className="w-5 h-5 mr-2 relative z-10 group-hover:rotate-12 transition-transform"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                           strokeWidth={2.5}
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                           />
//                         </svg>
//                         <span className="relative z-10">Find</span>
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() => {
//                           console.log("Reset button clicked");
//                           handleReset();
//                           if (onReset) {
//                             onReset();
//                           }
//                         }}
//                         className="inline-flex items-center px-5 py-3 text-base font-bold rounded-2xl text-gray-700 dark:text-gray-200 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 border-2 border-gray-300 dark:border-gray-500 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
//                       >
//                         <svg
//                           className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                           strokeWidth={2.5}
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                           />
//                         </svg>
//                         Reset
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Theme Toggle */}
//           <button
//             onClick={toggleTheme}
//             className="text-white hover:text-gray-100"
//           >
//             {theme === "dark" ? (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
//                 />
//               </svg>
//             )}
//           </button>

//           {/* Profile */}
//           <div className="relative" ref={profileRef}>
//             <button
//               ref={profileBtnRef}
//               onClick={toggleProfileDropdown}
//               className="h-8 w-8 rounded-full bg-white text-purple-600 flex items-center justify-center font-semibold"
//             >
//               <span>A</span>
//             </button>
//             {isProfileOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border dark:border-gray-700 z-[9999]">
//                 <a
//                   href="#"
//                   className="block px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
//                 >
//                   Your Profile
//                 </a>
//                 <a
//                   href="#"
//                   className="block px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
//                 >
//                   Settings
//                 </a>
//                 <a
//                   href="#"
//                   className="block px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border-t dark:border-gray-700"
//                 >
//                   Sign out
//                 </a>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ---------- Report Modal (child window) ---------- */}
//         {isReportModalOpen && (
//           <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center backdrop-blur-sm">
//             <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[90%] h-[90%] overflow-hidden relative border border-purple-300 flex flex-col">
//               {/* Top toolbar */}
//               <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60">
//                 <div className="flex items-center gap-3">
//                   <strong className="text-sm text-gray-700 dark:text-gray-200">
//                     {reportType === "equipment"
//                       ? "Equipment Pass Rate Report"
//                       : reportType === "rework-approved"
//                       ? "Rework Approved Report"
//                       : reportType === "rework-approved-pending-from-production"
//                       ? "Rework Approved Pending From Production Report"
//                       : reportType === "rework-pending"
//                       ? "Rework Pending Report"
//                       : "Traceability Report"}
//                   </strong>
//                   <span className="text-xs text-gray-500 dark:text-gray-400">
//                     •
//                   </span>
//                   <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
//                     {reportUrl}
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <button
//                     title="Open in new tab"
//                     onClick={() => {
//                       // open the traceability window in a new tab for debugging / full-screen view
//                       const w = window.open(reportUrl, "_blank");
//                       if (w) w.focus();
//                     }}
//                     className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
//                   >
//                     Open in tab
//                   </button>

//                   <button
//                     title="Refresh iframe"
//                     onClick={() => {
//                       // reload iframe by toggling src (a quick way)
//                       setIframeLoaded(false);
//                       const tmp = reportUrl;
//                       setReportUrl("about:blank");
//                       setTimeout(() => setReportUrl(tmp), 50);
//                     }}
//                     className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
//                   >
//                     Refresh
//                   </button>

//                   <button
//                     onClick={() => {
//                       if (reportLoading) return; // Don't close while loading
//                       setIsReportModalOpen(false);
//                       setIframeLoaded(false);
//                     }}
//                     className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
//                     title="Close"
//                   >
//                     <X className="w-4 h-4 text-gray-700 dark:text-gray-300" />
//                   </button>
//                 </div>
//               </div>

//               {/* Content area */}
//               {/* Content area */}
//               {/* Content area */}
//               {/* Content area */}
//               <div className="flex-1 relative bg-gray-100 dark:bg-black overflow-hidden">
//                 {/* SIMPLE LOADER INSIDE MODAL */}
//                 {!iframeLoaded && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10">
//                     <div className="flex flex-col items-center justify-center h-72 sm:h-80 lg:h-96 bg-gray-50 dark:bg-gray-900 mt-6">
//                       {/* FULL original loader kept exactly same */}
//                       <div className="relative w-36 h-24 sm:w-48 sm:h-32">
//                         {/* Pipeline */}
//                         <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-2.5 sm:h-3 bg-gradient-to-r from-slate-400 via-slate-500 to-slate-400 dark:from-slate-600 dark:via-slate-500 dark:to-slate-600 rounded-full shadow-inner">
//                           <div className="absolute inset-0 flex items-center justify-around">
//                             {[0, 1, 2, 3, 4].map((i) => (
//                               <div
//                                 key={i}
//                                 className="w-1 h-full bg-slate-300 dark:bg-slate-700"
//                                 style={{
//                                   animation:
//                                     "pulseSegment 1.5s ease-in-out infinite",
//                                   animationDelay: `${i * 0.3}s`,
//                                 }}
//                               ></div>
//                             ))}
//                           </div>
//                         </div>

//                         {/* Packets */}
//                         <div className="absolute inset-0 flex items-center">
//                           {[0, 1, 2, 3].map((i) => (
//                             <div
//                               key={i}
//                               className="absolute"
//                               style={{
//                                 animation: "flowData 4s linear infinite",
//                                 animationDelay: `${i * 1}s`,
//                                 left: "-8%",
//                               }}
//                             >
//                               <div className="relative">
//                                 <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg shadow-lg rotate-45">
//                                   <div className="absolute inset-1 border-2 border-cyan-200 rounded-lg"></div>
//                                 </div>
//                                 <div className="absolute top-1/2 right-full w-6 sm:w-8 h-0.5 bg-gradient-to-l from-cyan-400 to-transparent"></div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>

//                         {/* Scanner Gates unchanged */}
//                         {/* LEFT */}
//                         <div className="absolute top-0 left-1/4 -translate-x-1/2 flex flex-col items-center">
//                           <div className="w-6 sm:w-8 h-12 sm:h-16 bg-gradient-to-b from-purple-500 to-purple-600 rounded-t-lg shadow-lg relative">
//                             <div
//                               className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-purple-300"
//                               style={{
//                                 animation:
//                                   "verticalScan 2s ease-in-out infinite",
//                                 boxShadow: "0 0 8px rgba(168,85,247,0.8)",
//                               }}
//                             ></div>
//                             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 sm:w-4 h-1 bg-purple-300 rounded-full animate-pulse"></div>
//                           </div>
//                         </div>

//                         {/* RIGHT */}
//                         <div className="absolute top-0 right-1/4 translate-x-1/2 flex flex-col items-center">
//                           <div className="w-6 sm:w-8 h-12 sm:h-16 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-t-lg shadow-lg relative">
//                             <div
//                               className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-300"
//                               style={{
//                                 animation:
//                                   "horizontalScan 1.8s ease-in-out infinite",
//                                 boxShadow: "0 0 8px rgba(16,185,129,0.8)",
//                               }}
//                             ></div>
//                             <div
//                               className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 sm:w-4 h-1 bg-emerald-300 rounded-full animate-pulse"
//                               style={{ animationDelay: "0.3s" }}
//                             ></div>
//                           </div>
//                         </div>

//                         {/* Indicator */}
//                         <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4">
//                           <div className="flex flex-col items-center gap-1">
//                             <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full shadow-md shadow-emerald-500 animate-pulse"></div>
//                             <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
//                               Quality OK
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Loading Text */}
//                       <div className="mt-10 text-center">
//                         <p className="text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
//                           Loading Report Data
//                         </p>
//                         <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
//                           Please wait while we fetch the traceability
//                           information...
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 <iframe
//                   src={reportUrl}
//                   title="Traceability Report"
//                   className="w-full h-full border-none rounded-b-2xl"
//                   allowFullScreen
//                   onLoad={() => setIframeLoaded(true)}
//                   onError={() => {
//                     setIframeLoaded(true);
//                     console.error("Failed to load report iframe");
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//         {/* ---------- Analytics 4.0 Child Window ---------- */}
//         {isAnalyticsOpen && (
//           <div
//             className="fixed inset-0 z-[9999] flex items-center justify-center
//                         bg-white/60 backdrop-blur-md"
//           >
//             <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl w-[95%] h-[90%] overflow-hidden relative border border-blue-400/40 flex flex-col">
//               {/* Modal Header */}
//               <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-blue-50/90 via-purple-50/90 to-blue-50/90 backdrop-blur-xl border-b border-gray-200">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 rounded-lg bg-blue-100">
//                     <Factory className="w-5 h-5 text-blue-600" />
//                   </div>
//                   <div>
//                     <h2 className="text-gray-900 font-bold text-lg">
//                       Industry 4.0 Analytics Dashboard
//                     </h2>
//                     <p className="text-gray-600 text-sm">
//                       UID: {selectedOrder?.uid}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button
//                     title="Open in new tab"
//                     onClick={() =>
//                       window.open(
//                         `/#/analytics-window?uid=${selectedOrder?.uid}`,
//                         "_blank"
//                       )
//                     }
//                     className="px-4 py-2 text-sm rounded-xl bg-white/90 hover:bg-white text-gray-900 border border-gray-200/80 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold"
//                   >
//                     <ExternalLink className="w-4 h-4" />
//                     <span>Open in Tab</span>
//                   </button>
//                   <button
//                     onClick={() => setIsAnalyticsOpen(false)}
//                     className="p-2 rounded-xl hover:bg-gray-200 transition-colors duration-200"
//                     title="Close"
//                   >
//                     <X className="w-5 h-5 text-gray-600 hover:text-gray-900" />
//                   </button>
//                 </div>
//               </div>

//               {/* Modal Content */}
//               <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
//                 <AnalysisDashboard uid={selectedOrder?.uid} />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       {showUidToast && (
//         <>
//           <div
//             className="fixed inset-0 bg-brown/80 backdrop-blur-sm z-[99998] animate-dialog-fade"
//             onClick={() => setShowUidToast(false)}
//           />
//           <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
//             <div className="bg-gradient-to-br from-orange-600/90 to-orange-400/90 backdrop-blur-lg border border-orange-500/60 rounded-3xl shadow-2xl shadow-orange-700/30 w-full max-w-md animate-dialog-scale">
//               <div className="flex items-center justify-between p-6 border-b border-white/10">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
//                     <Info className="w-5 h-5 text-white" />
//                   </div>
//                   <h3 className="text-xl font-semibold text-white">
//                     {dialogContext === "search"
//                       ? "Input Required"
//                       : "UID Selection Required"}
//                   </h3>
//                 </div>
//                 <button
//                   onClick={() => setShowUidToast(false)}
//                   className="w-8 h-8 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
//                 >
//                   {/* <X className="w-5 h-5 text-slate-400 hover:text-white" /> */}
//                 </button>
//               </div>

//               <div className="p-6">
//                 <p className="text-white text-sm leading-relaxed font-medium">
//                   {dialogContext === "search"
//                     ? "Please enter a traceability value to proceed with the search."
//                     : "Please select a valid UID from the list to proceed with the operation."}
//                 </p>
//               </div>

//               <div className="p-6 pt-0">
//                 <button
//                   onClick={() => setShowUidToast(false)}
//                   className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25"
//                 >
//                   Understood
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </header>
//   );
// }

// export default Header;

// src\components\Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import {
  Calendar,
  Clock,
  FileText,
  Package,
  Zap,
  BarChart3,
  X,
  Info,
  Factory,
  ExternalLink,
} from "lucide-react";
// import { useNavigate } from 'react-router-dom';
import AnalysisDashboard from "./AnalysisDashboard";
import ReworkSelectorModal from "./ReworkSelectorModal";

const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:4000";

export function Header({
  onSearchResults,
  onSearchError,
  selectedOrder,
  onReset,
  onSearchStart,
}) {
  const { theme, toggleTheme } = useTheme();
  // const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isReworkReportsOpen, setIsReworkReportsOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportUrl, setReportUrl] = useState("");
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  // Search states
  const [searchType, setSearchType] = useState("uid");
  const [searchValue, setSearchValue] = useState("");
  // const [loading, setLoading] = useState(false)
  const [searchWarning, setSearchWarning] = useState("");
  const [showUidToast, setShowUidToast] = useState(false);
  const [dialogContext, setDialogContext] = useState(""); // 'search' or 'report'

  // Reports states
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [includeDate, setIncludeDate] = useState(false);
  const [reportType, setReportType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // refs for outside click
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const reportsRef = useRef(null);
  const profileBtnRef = useRef(null);
  const searchBtnRef = useRef(null);
  const reportsBtnRef = useRef(null);
  const reworkBtnRef = useRef(null); // ← ADD THIS LINE
  const reworkRef = useRef(null); // ← ADD THIS LINE for the rework panel container

  const closeAll = () => {
    setIsProfileOpen(false);
    setIsSearchOpen(false);
    setIsReportsOpen(false);
    setIsReworkReportsOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen((prev) => !prev);
    setIsSearchOpen(false);
    setIsReportsOpen(false);
  };

  const toggleSearchDropdown = () => {
    setIsSearchOpen((prev) => !prev);
    setIsProfileOpen(false);
    setIsReportsOpen(false);
  };

  const toggleReportsDropdown = () => {
    setIsReportsOpen((prev) => !prev);
    setIsProfileOpen(false);
    setIsSearchOpen(false);
  };

  useEffect(() => {
    console.log("[Header] selectedOrder prop:", selectedOrder);
  }, [selectedOrder]);

  // Outside click close
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        profileRef.current?.contains(e.target) ||
        searchRef.current?.contains(e.target) ||
        reportsRef.current?.contains(e.target) ||
        reworkRef.current?.contains(e.target) || // ← ADD THIS LINE
        profileBtnRef.current?.contains(e.target) ||
        searchBtnRef.current?.contains(e.target) ||
        reportsBtnRef.current?.contains(e.target) ||
        reworkBtnRef.current?.contains(e.target) // ← ADD THIS LINE
      )
        return;
      closeAll();
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ESC key close
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") closeAll();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // ----- SEARCH LOGIC -----
  const emitError = (msg) => {
    setSearchWarning(msg);
    if (onSearchError) onSearchError(msg);
    console.error(msg);
  };

  async function fetchJson(url) {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async function fetchAllPages({ term, limit = 2000, first }) {
    const total = Number(first.total || 0);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    let all = Array.isArray(first.data) ? first.data : [];
    if (totalPages === 1) return all;

    const pages = [];
    for (let p = 2; p <= totalPages; p++) pages.push(p);
    const concurrency = 8;
    let i = 0;
    const results = [];

    async function worker() {
      while (i < pages.length) {
        const page = pages[i++];
        const url = `${API_BASE}/api/trace/uid-contains?term=${encodeURIComponent(
          term
        )}&page=${page}&limit=${limit}`;
        const json = await fetchJson(url);
        if (Array.isArray(json.data) && json.data.length)
          results.push(json.data);
      }
    }
    await Promise.all(
      Array.from({ length: Math.min(concurrency, pages.length) }, () =>
        worker()
      )
    );
    return all.concat(...results);
  }

  function uniqueLatestByUid(rows) {
    const byUid = new Map();
    for (const r of rows || []) {
      const uid = (r.uid || r.UID || r._uid || "").trim();
      if (!uid) continue;
      const curr = byUid.get(uid);
      const currStart = curr?.productionstartdate || curr?._startDate || "";
      const nextStart = r.productionstartdate || r._startDate || "";
      if (!curr || String(nextStart) > String(currStart)) {
        byUid.set(uid, r);
      }
    }
    return Array.from(byUid.values());
  }

  const handleSearch = async () => {
    setSearchWarning("");
    const value = searchValue.trim();

    // ✅ Show dialog if no value entered
    if (!value) {
      setDialogContext("search");
      setShowUidToast(true);
      setTimeout(() => setShowUidToast(false), 3000);
      return;
    }

    if (onSearchStart) onSearchStart(); // This triggers the full-screen loader

    try {
      let payload = [];

      // ✅ SIMPLIFIED: Use the main search endpoint for ALL search types
      const url = `${API_BASE}/api/trace?${searchType}=${encodeURIComponent(
        value
      )}`;
      console.log("🔍 Searching with URL:", url);

      const data = await fetchJson(url);
      payload = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

      // If no results for UID, try partial search
      if (searchType === "uid" && payload.length === 0) {
        console.log("🔍 No exact UID match, trying partial search");
        const limit = 2000;
        const firstUrl = `${API_BASE}/api/trace/uid-contains?term=${encodeURIComponent(
          value
        )}&page=1&limit=${limit}`;
        const first = await fetchJson(firstUrl);
        payload = await fetchAllPages({ term: value, limit, first });
      }

      payload = uniqueLatestByUid(payload);

      if (onSearchResults) onSearchResults(payload);
      setIsSearchOpen(false);
    } catch (err) {
      console.error("🔍 Search failed:", err);

      // More specific error messages
      if (err.message.includes("HTTP 400")) {
        emitError("Invalid search request. Please check your input.");
      } else if (err.message.includes("HTTP 404")) {
        emitError("No results found. Please try a different search term.");
      } else if (err.message.includes("HTTP 500")) {
        emitError("Server error. Please try again later.");
      } else {
        emitError("Search failed: " + err.message);
      }

      if (onSearchResults) onSearchResults([]);
    }
    // No finally block needed since we removed loading state
  };

  const handleReset = () => {
    setSearchValue("");
    setSearchWarning("");
    // DON'T call onSearchResults here - let parent handle it
  };

  // ----- REPORTS PANEL LOGIC -----
  const handleQuickSelect = (days) => {
    const now = new Date();
    const past = new Date(now);
    past.setDate(now.getDate() - days);
    setFromDate(past.toISOString().slice(0, 10));
    setToDate(now.toISOString().slice(0, 10));
  };

  // ✅ NEW: Called by ReworkSelectorModal
  const handleReworkGenerate = ({ uid, reportType }) => {
    if (!uid || !reportType) {
      alert("Please select a UID");
      return;
    }

    const params = new URLSearchParams({
      uid,
      includeDateInReport: "false",
      userSelectedFromDate: "",
      userSelectedToDate: "",
      userSelectedFromTime: "00:00:00",
      userSelectedToTime: "23:59:59",
    });

    let iframeSrc = "";

    if (reportType === "rework-approved") {
      iframeSrc = `/#/rework-approved-window?${params.toString()}`;
    } else if (reportType === "rework-approved-pending-from-production") {
      iframeSrc = `/#/rework-pending-from-prod-window?${params.toString()}`;
    } else if (reportType === "rework-pending") {
      iframeSrc = `/#/rework-pending-window?${params.toString()}`;
    }

    setReportType(reportType);
    setReportUrl(iframeSrc);
    setIsReportModalOpen(true);
    setIsReworkReportsOpen(false);
  };

  const handleApply = () => {
    // Analytics shortcut (unchanged)
    if (reportType === "analytics") {
      setIsAnalyticsOpen(true);
      setIsReportsOpen(false);
      setIsLoading(false);
      return;
    }

    // ✅ IMMEDIATELY set loading state
    setIsLoading(true);

    // ✅ FIX #1 — UID GUARD (ADD HERE)
    if (!selectedOrder?.uid) {
      setIsLoading(false);
      setDialogContext("report");
      setShowUidToast(true);
      setTimeout(() => setShowUidToast(false), 2000);
      return;
    }

    const uid = selectedOrder.uid;

    // ✅ Build URL params IMMEDIATELY
    const params = new URLSearchParams({
      uid: encodeURIComponent(uid),
      includeDateInReport: includeDate.toString(),
      userSelectedFromDate: fromDate || "",
      userSelectedToDate: toDate || "",
      userSelectedFromTime: fromTime || "00:00:00",
      userSelectedToTime: toTime || "23:59:59",
    });

    let iframeSrc = "";

    if (reportType === "equipment") {
      iframeSrc = `/#/equipment-pass-rate-window?${params.toString()}`;
    } else {
      iframeSrc = `/#/traceability-window?${params.toString()}`;
    }

    // ✅ REMOVE THE DELAY - set everything immediately
    setReportUrl(iframeSrc);
    setIsReportModalOpen(true);
    setIsReportsOpen(false);

    // ✅ Reset loading state immediately - the iframe will show its own loader
    setIsLoading(false);
  };

  return (
    <header className="bg-gradient-to-r from-sky-400 to-purple-500 dark:from-purple-900 dark:to-indigo-900 shadow-lg transition-all duration-200">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-2 relative">
        {/* Mobile/Tablet Layout */}
        <div className="flex flex-col lg:hidden">
          {/* Top Row - Logo and Theme */}
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg sm:text-xl font-bold text-white">
              Micrologic<sup className="text-xs">®</sup>
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="text-white hover:text-gray-100 p-2"
              >
                {theme === "dark" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
              <div className="relative" ref={profileRef}>
                <button
                  ref={profileBtnRef}
                  onClick={toggleProfileDropdown}
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white text-purple-600 flex items-center justify-center font-semibold text-sm"
                >
                  <span>A</span>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border dark:border-gray-700 z-[9999]">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Your Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Settings
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border-t dark:border-gray-700"
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Row - Actions */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <button
              onClick={() => {
                if (!selectedOrder?.uid) {
                  setDialogContext("analytics");
                  setShowUidToast(true);
                  setTimeout(() => setShowUidToast(false), 2000);
                  return;
                }
                setIsAnalyticsOpen(true);
              }}
              className="flex-1 sm:flex-initial px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg border border-white/30 text-xs font-semibold text-white"
            >
              Analytics
            </button>

            <div className="flex gap-2">
              {/* Traceability Button */}
              <button
                ref={reportsBtnRef}
                onClick={toggleReportsDropdown}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg border border-white/30 text-xs font-semibold text-white"
              >
                Reports
              </button>

              {/* Rework Button */}
              <button
                ref={reworkBtnRef}
                onClick={() => {
                  setIsReworkReportsOpen((prev) => !prev);
                  setIsReportsOpen(false);
                  setIsProfileOpen(false);
                  setIsSearchOpen(false);
                }}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg border border-white/30 text-xs font-semibold text-white"
              >
                Rework
              </button>

              {/* Search Button */}
              <button
                ref={searchBtnRef}
                onClick={toggleSearchDropdown}
                className="w-10 h-10 glass-effect hover:bg-white/30 rounded-xl border border-white/40 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout (hidden on mobile/tablet) */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex items-center ml-2 xl:ml-6">
            <h1 className="text-lg xl:text-xl font-bold text-white">
              Micrologic<sup className="text-xs">®</sup>
            </h1>

            {/* Analytics 4.0 Launch Button */}
            <button
              onClick={() => {
                if (!selectedOrder?.uid) {
                  setDialogContext("analytics");
                  setShowUidToast(true);
                  setTimeout(() => setShowUidToast(false), 2000);
                  return;
                }
                setIsAnalyticsOpen(true);
              }}
              className="ml-8 xl:ml-20 mr-4 xl:mr-8 group flex items-center gap-2 px-3 xl:px-5 py-2 xl:py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              title="Open Industry 4.0 Analytics Dashboard"
            >
              <BarChart3 className="h-4 xl:h-5 w-4 xl:w-5 text-white group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-xs xl:text-sm font-semibold text-white whitespace-nowrap">
                Analytics 4.0
              </span>
            </button>
          </div>

          {/* Reports Dashboard Label - Desktop only */}
          <div className="absolute left-1/2 transform -translate-x-[75%] hidden xl:flex items-center gap-3">
            <div className="p-2.5 bg-white/25 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Reports Dashboard
            </h2>
          </div>

          {/* Right Side Controls - Desktop */}
          <div className="flex items-center space-x-2 xl:space-x-4 mr-2 xl:mr-8 relative z-[60]">
            {/* Traceability & Pass Rate Report Button */}
            <div className="relative" ref={reportsRef}>
              <button
                ref={reportsBtnRef}
                onClick={toggleReportsDropdown}
                className="group flex items-center gap-2 px-3 xl:px-5 py-2 xl:py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-haspopup="true"
                aria-expanded={isReportsOpen}
                title="Traceability & Pass Rate Report"
              >
                <BarChart3 className="h-4 xl:h-5 w-4 xl:w-5 text-white group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-xs xl:text-sm font-semibold text-white whitespace-nowrap hidden xl:inline">
                  Traceability & Pass Rate Report
                </span>
                <span className="text-xs xl:text-sm font-semibold text-white whitespace-nowrap xl:hidden">
                  Reports
                </span>
              </button>

              {/* Main Reports Panel */}
              {isReportsOpen && (
                <div className="absolute right-0 mt-2 w-[90vw] sm:w-[24rem] xl:w-[26rem] bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-4 sm:p-6 z-[50] border border-purple-400/40 max-h-[80vh] overflow-y-auto">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-sky-400 to-purple-600 rounded-xl shadow-lg">
                      <BarChart3 className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
                      Reports Panel
                    </h2>
                  </div>

                  {/* Report Type */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">
                      Report Type
                    </label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full rounded-lg border border-purple-300 px-3 py-2 text-sm dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">Select report type</option>
                      <option value="traceability">
                        Traceability Report Complete
                      </option>
                      <option value="equipment">
                        Equipment Pass Rate Report
                      </option>
                    </select>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleApply}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-sky-500 via-purple-500 to-sky-600 hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 sm:h-5 w-4 sm:w-5 border-2 border-white border-t-transparent mr-2"></div>
                          <span className="text-sm">Generating Report...</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                        <span className="text-sm sm:text-base">
                          Generate Report
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Rework Reports Button */}
            <div className="relative" ref={reworkRef}>
              <button
                ref={reworkBtnRef}
                onClick={() => {
                  setIsReworkReportsOpen((prev) => !prev);
                  setIsReportsOpen(false);
                  setIsProfileOpen(false);
                  setIsSearchOpen(false);
                }}
                className="group px-3 xl:px-5 py-2 xl:py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-haspopup="true"
                aria-expanded={isReworkReportsOpen}
                title="Rework Reports"
              >
                <span className="text-xs xl:text-sm font-semibold text-white">
                  Rework
                </span>
              </button>

              {isReworkReportsOpen && (
                <ReworkSelectorModal
                  onClose={() => setIsReworkReportsOpen(false)}
                  onGenerate={handleReworkGenerate}
                />
              )}
            </div>

            {/* Search Button */}
            <div className="relative" ref={searchRef}>
              <button
                ref={searchBtnRef}
                onClick={toggleSearchDropdown}
                className="glow-button group relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-14 2xl:h-14 glass-effect hover:bg-white/30 rounded-xl sm:rounded-2xl border border-white/40 hover:border-white/60 transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-white/40 flex items-center justify-center overflow-hidden animate-glow-pulse"
                title="Search"
              >
                <div className="shimmer-effect absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 md:h-5 md:w-5 lg:h-5 lg:w-5 xl:h-6 xl:w-6 text-white group-hover:rotate-90 group-hover:scale-110 transition-all duration-500 relative z-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {isSearchOpen && (
                <div
                  className="dropdown-enter absolute right-0 md:right-0 lg:right-0 mt-3 sm:mt-4 w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)] md:w-[400px] lg:w-[420px] xl:w-[440px] 2xl:w-[460px] max-w-[95vw] sm:max-w-[440px] glass-effect-strong dark:bg-gray-900/95 backdrop-blur-3xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/50 transition-all duration-300 ease-out transform origin-top-right z-[80] overflow-hidden"
                  role="dialog"
                  aria-label="Search dialog"
                  style={{
                    boxShadow:
                      "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 60px rgba(139, 92, 246, 0.3)",
                    // Position adjustment for mobile
                    ...(window.innerWidth < 768
                      ? { left: "50%", transform: "translateX(-50%)" }
                      : {}),
                  }}
                >
                  {/* Header with enhanced gradient */}
                  <div className="relative bg-gradient-to-r from-sky-400 via-purple-500 to-indigo-600 dark:from-purple-900 dark:to-indigo-900 px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5 lg:px-6 lg:py-4 border-b border-white/20 overflow-hidden">
                    <div className="shimmer-effect absolute inset-0 opacity-50"></div>
                    <div className="flex items-center gap-2 sm:gap-3 relative z-10">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 glass-effect backdrop-blur-xl rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg animate-float">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5 lg:h-5 lg:w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-base sm:text-lg md:text-lg lg:text-xl font-bold text-white drop-shadow-lg">
                        Search
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 md:p-4.5 lg:p-5 max-h-[60vh] sm:max-h-[70vh] md:max-h-none overflow-y-auto">
                    {searchWarning && (
                      <div className="mb-3 sm:mb-4 text-[11px] sm:text-xs md:text-sm text-amber-700 dark:text-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border sm:border-2 border-amber-300 dark:border-amber-700 rounded-xl sm:rounded-2xl px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 flex items-center gap-2 sm:gap-3 shadow-md hover-lift">
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium text-[11px] sm:text-xs md:text-sm">
                          {searchWarning}
                        </span>
                      </div>
                    )}

                    <div className="space-y-2.5 sm:space-y-3">
                      {/* Search input */}
                      <div className="group">
                        <label
                          htmlFor="searchInput"
                          className="block text-[11px] sm:text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2"
                        >
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-sky-500 to-purple-600"></span>
                          Find
                        </label>
                        <input
                          type="text"
                          id="searchInput"
                          className="input-glow block w-full rounded-xl sm:rounded-2xl border sm:border-2 border-gray-300 dark:border-gray-600 shadow-md sm:shadow-lg hover:shadow-xl focus:ring-0 focus:border-purple-500 dark:focus:border-purple-400 text-[13px] sm:text-sm md:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 transition-all duration-300 placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-sm hover:border-purple-400 hover-lift"
                          placeholder="Enter search value..."
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                      </div>

                      {/* Search type dropdown */}
                      <div className="group">
                        <label
                          htmlFor="searchTypeSelect"
                          className="block text-[11px] sm:text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2"
                        >
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-sky-500 to-purple-600"></span>
                          Search by
                        </label>
                        <div className="relative">
                          <select
                            id="searchTypeSelect"
                            className="input-glow block w-full rounded-xl sm:rounded-2xl border sm:border-2 border-gray-300 dark:border-gray-600 shadow-md sm:shadow-lg hover:shadow-xl focus:ring-0 focus:border-purple-500 dark:focus:border-purple-400 text-[13px] sm:text-sm md:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 pr-8 sm:pr-10 md:pr-12 transition-all duration-300 cursor-pointer appearance-none hover:border-purple-400 hover-lift font-medium"
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                          >
                            <option value="uid">UID</option>
                            <option value="productid">Product ID</option>
                            <option value="productmodelname">
                              Product Model
                            </option>
                            <option value="productvariant">
                              Product Variant
                            </option>
                            <option value="productionstartdate">
                              Production Start Date
                            </option>
                            <option value="productionenddate">
                              Production End Date
                            </option>
                            <option value="status">Status</option>
                            <option value="endoflineuid">
                              End of line UID
                            </option>
                          </select>
                          <div className="absolute right-2.5 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-purple-500 group-hover:text-purple-600 transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
                        <button
                          type="button"
                          onClick={handleSearch}
                          className="glow-button flex-1 relative inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 text-[13px] sm:text-sm md:text-base font-bold rounded-xl sm:rounded-2xl text-white bg-gradient-to-r from-sky-500 via-purple-600 to-indigo-600 hover:from-sky-600 hover:via-purple-700 hover:to-indigo-700 shadow-lg sm:shadow-xl hover:shadow-2xl hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 overflow-hidden group"
                          style={{
                            boxShadow: "0 10px 30px rgba(139, 92, 246, 0.4)",
                          }}
                        >
                          <div className="shimmer-effect absolute inset-0"></div>
                          <svg
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1.5 sm:mr-2 relative z-10 group-hover:rotate-12 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                          <span className="relative z-10">Find</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            console.log("Reset button clicked");
                            handleReset();
                            if (onReset) {
                              onReset();
                            }
                          }}
                          className="inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 text-[13px] sm:text-sm md:text-base font-bold rounded-xl sm:rounded-2xl text-gray-700 dark:text-gray-200 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 border sm:border-2 border-gray-300 dark:border-gray-500 shadow-lg hover:shadow-xl hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 group"
                        >
                          <svg
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1.5 sm:mr-2 group-hover:rotate-180 transition-transform duration-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          <span className="sm:inline">Reset</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="text-white hover:text-gray-100"
            >
              {theme === "dark" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 xl:h-6 w-5 xl:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 xl:h-6 w-5 xl:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                ref={profileBtnRef}
                onClick={toggleProfileDropdown}
                className="h-7 xl:h-8 w-7 xl:w-8 rounded-full bg-white text-purple-600 flex items-center justify-center font-semibold text-sm"
              >
                <span>A</span>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border dark:border-gray-700 z-[9999]">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Settings
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border-t dark:border-gray-700"
                  >
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---------- Report Modal (child window) ---------- */}
        {isReportModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center backdrop-blur-sm p-2 sm:p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full h-full sm:w-[95%] sm:h-[95%] lg:w-[90%] lg:h-[90%] overflow-hidden relative border border-purple-300 flex flex-col">
              {/* Top toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <strong className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                    {reportType === "equipment"
                      ? "Equipment Pass Rate Report"
                      : reportType === "rework-approved"
                      ? "Rework Approved Report"
                      : reportType === "rework-approved-pending-from-production"
                      ? "Rework Approved Pending From Production Report"
                      : reportType === "rework-pending"
                      ? "Rework Pending Report"
                      : "Traceability Report"}
                  </strong>
                  <span className="hidden sm:inline text-xs text-gray-500 dark:text-gray-400">
                    •
                  </span>
                  <span className="hidden lg:inline text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                    {reportUrl}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    title="Open in new tab"
                    onClick={() => {
                      const w = window.open(reportUrl, "_blank");
                      if (w) w.focus();
                    }}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <span className="hidden sm:inline">Open in tab</span>
                    <ExternalLink className="w-3 h-3 sm:hidden" />
                  </button>

                  <button
                    title="Refresh iframe"
                    onClick={() => {
                      setIframeLoaded(false);
                      const tmp = reportUrl;
                      setReportUrl("about:blank");
                      setTimeout(() => setReportUrl(tmp), 50);
                    }}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    Refresh
                  </button>

                  <button
                    onClick={() => {
                      if (reportLoading) return;
                      setIsReportModalOpen(false);
                      setIframeLoaded(false);
                    }}
                    className="p-1.5 sm:p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                    title="Close"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>
              </div>

              {/* Content area */}
              <div className="flex-1 relative bg-gray-100 dark:bg-black overflow-hidden">
                {/* SIMPLE LOADER INSIDE MODAL */}
                {!iframeLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10">
                    <div className="flex flex-col items-center justify-center h-60 sm:h-72 lg:h-96 bg-gray-50 dark:bg-gray-900 px-4">
                      {/* FULL original loader kept exactly same */}
                      <div className="relative w-28 sm:w-36 lg:w-48 h-20 sm:h-24 lg:h-32">
                        {/* Pipeline */}
                        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-2 sm:h-2.5 lg:h-3 bg-gradient-to-r from-slate-400 via-slate-500 to-slate-400 dark:from-slate-600 dark:via-slate-500 dark:to-slate-600 rounded-full shadow-inner">
                          <div className="absolute inset-0 flex items-center justify-around">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className="w-1 h-full bg-slate-300 dark:bg-slate-700"
                                style={{
                                  animation:
                                    "pulseSegment 1.5s ease-in-out infinite",
                                  animationDelay: `${i * 0.3}s`,
                                }}
                              ></div>
                            ))}
                          </div>
                        </div>

                        {/* Packets */}
                        <div className="absolute inset-0 flex items-center">
                          {[0, 1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="absolute"
                              style={{
                                animation: "flowData 4s linear infinite",
                                animationDelay: `${i * 1}s`,
                                left: "-8%",
                              }}
                            >
                              <div className="relative">
                                <div className="w-6 sm:w-8 lg:w-10 h-6 sm:h-8 lg:h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg shadow-lg rotate-45">
                                  <div className="absolute inset-1 border-2 border-cyan-200 rounded-lg"></div>
                                </div>
                                <div className="absolute top-1/2 right-full w-4 sm:w-6 lg:w-8 h-0.5 bg-gradient-to-l from-cyan-400 to-transparent"></div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Scanner Gates unchanged */}
                        {/* LEFT */}
                        <div className="absolute top-0 left-1/4 -translate-x-1/2 flex flex-col items-center">
                          <div className="w-5 sm:w-6 lg:w-8 h-10 sm:h-12 lg:h-16 bg-gradient-to-b from-purple-500 to-purple-600 rounded-t-lg shadow-lg relative">
                            <div
                              className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-purple-300"
                              style={{
                                animation:
                                  "verticalScan 2s ease-in-out infinite",
                                boxShadow: "0 0 8px rgba(168,85,247,0.8)",
                              }}
                            ></div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 sm:w-3 lg:w-4 h-1 bg-purple-300 rounded-full animate-pulse"></div>
                          </div>
                        </div>

                        {/* RIGHT */}
                        <div className="absolute top-0 right-1/4 translate-x-1/2 flex flex-col items-center">
                          <div className="w-5 sm:w-6 lg:w-8 h-10 sm:h-12 lg:h-16 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-t-lg shadow-lg relative">
                            <div
                              className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-300"
                              style={{
                                animation:
                                  "horizontalScan 1.8s ease-in-out infinite",
                                boxShadow: "0 0 8px rgba(16,185,129,0.8)",
                              }}
                            ></div>
                            <div
                              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 sm:w-3 lg:w-4 h-1 bg-emerald-300 rounded-full animate-pulse"
                              style={{ animationDelay: "0.3s" }}
                            ></div>
                          </div>
                        </div>

                        {/* Indicator */}
                        <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 lg:gap-4">
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-2 sm:w-2.5 lg:w-3 h-2 sm:h-2.5 lg:h-3 bg-emerald-500 rounded-full shadow-md shadow-emerald-500 animate-pulse"></div>
                            <span className="text-[9px] sm:text-[10px] lg:text-xs text-gray-600 dark:text-gray-400">
                              Quality OK
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Loading Text */}
                      <div className="mt-8 sm:mt-10 text-center">
                        <p className="text-xs sm:text-sm lg:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Loading Report Data
                        </p>
                        <p className="text-[10px] sm:text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                          Please wait while we fetch the traceability
                          information...
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <iframe
                  src={reportUrl}
                  title="Traceability Report"
                  className="w-full h-full border-none rounded-b-2xl"
                  allowFullScreen
                  onLoad={() => setIframeLoaded(true)}
                  onError={() => {
                    setIframeLoaded(true);
                    console.error("Failed to load report iframe");
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ---------- Analytics 4.0 Child Window ---------- */}
        {isAnalyticsOpen && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center 
                        bg-white/60 backdrop-blur-md p-2 sm:p-0"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full h-full sm:w-[98%] sm:h-[95%] lg:w-[95%] lg:h-[90%] overflow-hidden relative border border-blue-400/40 flex flex-col">
              {/* Modal Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-5 py-2 sm:py-3 bg-gradient-to-r from-blue-50/90 via-purple-50/90 to-blue-50/90 backdrop-blur-xl border-b border-gray-200 gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100">
                    <Factory className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-gray-900 font-bold text-sm sm:text-base lg:text-lg">
                      Industry 4.0 Analytics Dashboard
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      UID: {selectedOrder?.uid}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    title="Open in new tab"
                    onClick={() =>
                      window.open(
                        `/#/analytics-window?uid=${selectedOrder?.uid}`,
                        "_blank"
                      )
                    }
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-xl bg-white/90 hover:bg-white text-gray-900 border border-gray-200/80 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold"
                  >
                    <ExternalLink className="w-3 sm:w-4 h-3 sm:h-4" />
                    <span className="hidden sm:inline">Open in Tab</span>
                  </button>
                  <button
                    onClick={() => setIsAnalyticsOpen(false)}
                    className="p-1.5 sm:p-2 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                    title="Close"
                  >
                    <X className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 hover:text-gray-900" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
                <AnalysisDashboard uid={selectedOrder?.uid} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* UID Toast Dialog */}
      {showUidToast && (
        <>
          <div
            className="fixed inset-0 bg-brown/80 backdrop-blur-sm z-[99998] animate-dialog-fade"
            onClick={() => setShowUidToast(false)}
          />
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-orange-600/90 to-orange-400/90 backdrop-blur-lg border border-orange-500/60 rounded-2xl sm:rounded-3xl shadow-2xl shadow-orange-700/30 w-full max-w-sm sm:max-w-md animate-dialog-scale">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Info className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    {dialogContext === "search"
                      ? "Input Required"
                      : "UID Selection Required"}
                  </h3>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <p className="text-white text-xs sm:text-sm leading-relaxed font-medium">
                  {dialogContext === "search"
                    ? "Please enter a traceability value to proceed with the search."
                    : "Please select a valid UID from the list to proceed with the operation."}
                </p>
              </div>

              <div className="p-4 sm:p-6 pt-0">
                <button
                  onClick={() => setShowUidToast(false)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5 sm:py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 text-sm sm:text-base"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
