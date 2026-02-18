// // src\components\SearchReport.jsx
// import React, { useState, useRef, useEffect } from 'react'
// import { Calendar, Clock, FileText, Package, Zap, BarChart3 } from 'lucide-react'
// import { createPortal } from 'react-dom'

// // const API_BASE = import.meta.env?.VITE_API_BASE || 'http://localhost:4000'
// const API_BASE = import.meta.env.VITE_API_BASE;

// export function SearchReport({ onSearchResults, onSearchError }) {
//   const [isSearchOpen, setIsSearchOpen] = useState(false)
//   const [isReportsOpen, setIsReportsOpen] = useState(false)

//   const [searchType, setSearchType] = useState('uid')
//   const [searchValue, setSearchValue] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [searchWarning, setSearchWarning] = useState('')

//   const [fromDate, setFromDate] = useState('')
//   const [toDate, setToDate] = useState('')
//   const [fromTime, setFromTime] = useState('')
//   const [toTime, setToTime] = useState('')
//   const [includeDate, setIncludeDate] = useState(false)
//   const [reportType, setReportType] = useState('')
//   const [isLoading, setIsLoading] = useState(false)

//   const searchRef = useRef(null)
//   const reportsRef = useRef(null)
//   const searchBtnRef = useRef(null)
//   const reportsBtnRef = useRef(null)

//   const closeAll = () => {
//     setIsSearchOpen(false)
//     setIsReportsOpen(false)
//   }

//   const toggleSearchDropdown = () => {
//     setIsSearchOpen((prev) => !prev)
//     setIsReportsOpen(false)
//   }

//   const toggleReportsDropdown = () => {
//     setIsReportsOpen((prev) => !prev)
//     setIsSearchOpen(false)
//   }

//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (
//         searchRef.current?.contains(e.target) ||
//         reportsRef.current?.contains(e.target) ||
//         searchBtnRef.current?.contains(e.target) ||
//         reportsBtnRef.current?.contains(e.target)
//       ) return
//       closeAll()
//     }
//     document.addEventListener('click', handleClickOutside)
//     return () => document.removeEventListener('click', handleClickOutside)
//   }, [])

//   const emitError = (msg) => {
//     setSearchWarning(msg)
//     if (onSearchError) onSearchError(msg)
//     console.error(msg)
//   }

//   async function fetchJson(url) {
//     const res = await fetch(url)
//     if (!res.ok) throw new Error(`HTTP ${res.status}`)
//     return res.json()
//   }

//   const handleSearch = async () => {
//     setSearchWarning('')
//     const value = searchValue.trim()
//     if (!value) return
//     setLoading(true)
//     try {
//       const url = `${API_BASE}/api/trace?${encodeURIComponent(searchType)}=${encodeURIComponent(value)}`
//       const data = await fetchJson(url)
//       if (onSearchResults) onSearchResults(data?.data ?? data)
//       setIsSearchOpen(false)
//     } catch (err) {
//       emitError('Search error: ' + err.message)
//       if (onSearchResults) onSearchResults([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleReset = () => {
//     setSearchValue('')
//     setSearchWarning('')
//     if (onSearchResults) onSearchResults([])
//   }

//   const handleQuickSelect = (days) => {
//     const now = new Date()
//     const past = new Date(now)
//     past.setDate(now.getDate() - days)
//     setFromDate(past.toISOString().slice(0, 10))
//     setToDate(now.toISOString().slice(0, 10))
//   }

//   const handleApply = () => {
//     setIsLoading(true)
//     setTimeout(() => {
//       console.log('Report generated:', {
//         fromDate, toDate, fromTime, toTime, includeDate, reportType,
//       })
//       setIsLoading(false)
//       setIsReportsOpen(false)
//     }, 1500)
//   }

//     // 🧩 FINAL RETURN — render inside header via React Portal
//   return createPortal(
//     <div className="flex items-center space-x-4 relative z-[60]">
//       {/* Report Details Button */}
//       <div className="relative" ref={reportsRef}>
//         <button
//           ref={reportsBtnRef}
//           onClick={toggleReportsDropdown}
//           className="text-white hover:text-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white rounded"
//           title="Report Details"
//         >
//           <BarChart3 className="h-6 w-6" />
//         </button>

//         {isReportsOpen && (
//           <div className="absolute right-0 mt-3 w-[36rem] bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 border border-purple-400/40 z-[80]">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="p-3 bg-gradient-to-br from-sky-400 to-purple-600 rounded-xl shadow-lg">
//                 <BarChart3 className="w-6 h-6 text-white" />
//               </div>
//               <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
//                 Report Details
//               </h2>
//             </div>

//             <div className="flex flex-wrap gap-2 mb-4">
//               {[{ label: 'Today', days: 0, icon: Calendar }, { label: 'Yesterday', days: 1, icon: Clock },
//                 { label: 'Last 7 days', days: 7, icon: FileText }, { label: 'Last 30 days', days: 30, icon: Package }].map(({ label, days, icon: Icon }) => (
//                   <button key={label} onClick={() => handleQuickSelect(days)}
//                     className="group px-5 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-sky-400 to-purple-500 text-white shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300">
//                     <span className="flex items-center gap-2"><Icon className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />{label}</span>
//                   </button>
//                 ))}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
//               <div>
//                 <label className="block text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">From Date</label>
//                 <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
//                   className="w-full rounded-lg border border-purple-300 px-3 py-2 dark:bg-gray-800 dark:text-white" />
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">From Time</label>
//                 <input type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)}
//                   className="w-full rounded-lg border border-purple-300 px-3 py-2 dark:bg-gray-800 dark:text-white" />
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">To Date</label>
//                 <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
//                   className="w-full rounded-lg border border-purple-300 px-3 py-2 dark:bg-gray-800 dark:text-white" />
//               </div>
//               <div>
//                 <label className="block text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">To Time</label>
//                 <input type="time" value={toTime} onChange={(e) => setToTime(e.target.value)}
//                   className="w-full rounded-lg border border-purple-300 px-3 py-2 dark:bg-gray-800 dark:text-white" />
//               </div>
//             </div>

//             <div className="flex items-center gap-3 mb-4">
//               <input type="checkbox" id="includeDate" checked={includeDate} onChange={(e) => setIncludeDate(e.target.checked)}
//                 className="h-5 w-5 text-purple-600 border-purple-400 rounded" />
//               <label htmlFor="includeDate" className="text-sm font-semibold text-sky-800 dark:text-sky-200">
//                 Include Date in Report
//               </label>
//             </div>

//             <div className="mb-4">
//               <label className="block text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">Report Type</label>
//               <select value={reportType} onChange={(e) => setReportType(e.target.value)}
//                 className="w-full rounded-lg border border-purple-300 px-3 py-2 dark:bg-gray-800 dark:text-white">
//                 <option value="">Select report type</option>
//                 <option value="daily">Traceability Report Complete</option>
//               </select>
//             </div>

//             <button onClick={handleApply} disabled={isLoading}
//               className="w-full flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 via-purple-500 to-sky-600 hover:scale-[1.02] transition-all duration-300 disabled:opacity-70">
//               {isLoading ? (
//                 <>
//                   <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                   </svg>
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <Zap className="w-5 h-5 mr-2" /> Generate Report
//                 </>
//               )}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Search Button */}
//       <div className="relative" ref={searchRef}>
//         <button
//           ref={searchBtnRef}
//           onClick={toggleSearchDropdown}
//           className="text-white hover:text-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white rounded"
//           title="Search"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//           </svg>
//         </button>

//         {isSearchOpen && (
//           <div className="absolute right-0 mt-3 w-96 bg-gradient-to-r from-sky-400 to-purple-500 dark:from-purple-900 dark:to-indigo-900 rounded-lg shadow-xl py-4 px-5 border dark:border-gray-700 transition-all duration-200 ease-in-out z-[80]">
//             <h3 className="text-lg font-semibold text-white mb-4">Search</h3>

//             {searchWarning && (
//               <div className="mb-3 text-sm text-yellow-700 bg-yellow-100 border border-yellow-300 rounded px-3 py-2">
//                 {searchWarning}
//               </div>
//             )}

//             <div className="space-y-3">
//               <div>
//                 <label htmlFor="searchInput" className="block text-sm font-medium text-white mb-1">
//                   Find
//                 </label>
//                 <input
//                   type="text"
//                   id="searchInput"
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-white focus:border-white sm:text-sm bg-white/90 dark:bg-gray-800/90 dark:text-white dark:border-gray-600 px-3 py-2"
//                   placeholder="Enter value"
//                   value={searchValue}
//                   onChange={(e) => setSearchValue(e.target.value)}
//                   onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//                   disabled={loading}
//                 />
//               </div>

//               <div>
//                 <label htmlFor="searchTypeSelect" className="block text-sm font-medium text-white mb-1">
//                   Search by
//                 </label>
//                 <select
//                   id="searchTypeSelect"
//                   className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-white focus:border-white sm:text-sm bg-white/90 dark:bg-gray-800/90 dark:text-white dark:border-gray-600 px-3 py-2"
//                   value={searchType}
//                   onChange={(e) => setSearchType(e.target.value)}
//                 >
//                   <option value="uid">UID</option>
//                   <option value="productid">Product ID</option>
//                   <option value="productmodelname">Product Model</option>
//                   <option value="productvariant">Product Variant</option>
//                   <option value="productionstartdate">Production Start Date</option>
//                   <option value="productionenddate">Production End Date</option>
//                   <option value="status">Status</option>
//                   <option value="endoflineuid">End of line UID</option>
//                 </select>
//               </div>

//               <div className="flex gap-2 pt-2">
//                 <button
//                   type="button"
//                   onClick={handleSearch}
//                   disabled={loading}
//                   className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
//                 >
//                   {loading ? 'Searching...' : 'Find'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleReset}
//                   className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-600"
//                 >
//                   Reset
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>,
//     document.getElementById('header-controls') // 🎯 renders inside Header
//   )
// }

// src\components\SearchReport.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Clock,
  FileText,
  Package,
  Zap,
  BarChart3,
} from "lucide-react";
import { createPortal } from "react-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

export function SearchReport({ onSearchResults, onSearchError }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const [searchType, setSearchType] = useState("uid");
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchWarning, setSearchWarning] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [includeDate, setIncludeDate] = useState(false);
  const [reportType, setReportType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const searchRef = useRef(null);
  const reportsRef = useRef(null);
  const searchBtnRef = useRef(null);
  const reportsBtnRef = useRef(null);

  const closeAll = () => {
    setIsSearchOpen(false);
    setIsReportsOpen(false);
  };

  const toggleSearchDropdown = () => {
    setIsSearchOpen((prev) => !prev);
    setIsReportsOpen(false);
  };

  const toggleReportsDropdown = () => {
    setIsReportsOpen((prev) => !prev);
    setIsSearchOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        searchRef.current?.contains(e.target) ||
        reportsRef.current?.contains(e.target) ||
        searchBtnRef.current?.contains(e.target) ||
        reportsBtnRef.current?.contains(e.target)
      )
        return;
      closeAll();
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const emitError = (msg) => {
    setSearchWarning(msg);
    if (onSearchError) onSearchError(msg);
    console.error(msg);
  };

  async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  const handleSearch = async () => {
    setSearchWarning("");
    const value = searchValue.trim();
    if (!value) return;
    setLoading(true);
    try {
      const url = `${API_BASE}/api/trace?${encodeURIComponent(searchType)}=${encodeURIComponent(value)}`;
      const data = await fetchJson(url);
      if (onSearchResults) onSearchResults(data?.data ?? data);
      setIsSearchOpen(false);
    } catch (err) {
      emitError("Search error: " + err.message);
      if (onSearchResults) onSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchValue("");
    setSearchWarning("");
    if (onSearchResults) onSearchResults([]);
  };

  const handleQuickSelect = (days) => {
    const now = new Date();
    const past = new Date(now);
    past.setDate(now.getDate() - days);
    setFromDate(past.toISOString().slice(0, 10));
    setToDate(now.toISOString().slice(0, 10));
  };

  const handleApply = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log("Report generated:", {
        fromDate,
        toDate,
        fromTime,
        toTime,
        includeDate,
        reportType,
      });
      setIsLoading(false);
      setIsReportsOpen(false);
    }, 1500);
  };

  // Check if mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return createPortal(
    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 relative z-[60]">
      {/* Report Details Button */}
      <div className="relative" ref={reportsRef}>
        <button
          ref={reportsBtnRef}
          onClick={toggleReportsDropdown}
          className="text-white hover:text-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white rounded p-1.5 sm:p-2"
          title="Report Details"
        >
          <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {isReportsOpen && (
          <>
            {/* Mobile Overlay */}
            {isMobile && (
              <div
                className="fixed inset-0 bg-black/50 z-[70] md:hidden"
                onClick={() => setIsReportsOpen(false)}
              />
            )}

            {/* Reports Panel */}
            <div
              className={`
              ${
                isMobile
                  ? "fixed inset-x-2 top-20 max-h-[80vh] z-[75]"
                  : "absolute right-0 mt-3 w-[28rem] lg:w-[32rem] xl:w-[36rem]"
              }
              bg-white dark:bg-gray-900 
              rounded-lg sm:rounded-xl 
              shadow-xl sm:shadow-2xl 
              p-3 sm:p-4 md:p-6 
              border border-purple-400/40 
              z-[80]
              overflow-y-auto
            `}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-sky-400 to-purple-600 rounded-lg sm:rounded-xl shadow-lg">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
                  Report Details
                </h2>
              </div>

              {/* Quick Select Buttons */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                {[
                  { label: "Today", days: 0, icon: Calendar },
                  { label: "Yesterday", days: 1, icon: Clock },
                  { label: "Last 7 days", days: 7, icon: FileText },
                  { label: "Last 30 days", days: 30, icon: Package },
                ].map(({ label, days, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => handleQuickSelect(days)}
                    className="group px-2 sm:px-3 md:px-5 py-1.5 sm:py-2 md:py-2.5 text-[10px] sm:text-xs md:text-sm font-semibold rounded-full bg-gradient-to-r from-sky-400 to-purple-500 text-white shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <span className="flex items-center gap-1 sm:gap-2">
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="hidden min-[400px]:inline">{label}</span>
                      <span className="min-[400px]:hidden">
                        {days === 0 ? "Today" : `${days}d`}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              {/* Date/Time Inputs Grid */}
              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full rounded-md sm:rounded-lg border border-purple-300 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">
                    From Time
                  </label>
                  <input
                    type="time"
                    value={fromTime}
                    onChange={(e) => setFromTime(e.target.value)}
                    className="w-full rounded-md sm:rounded-lg border border-purple-300 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full rounded-md sm:rounded-lg border border-purple-300 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">
                    To Time
                  </label>
                  <input
                    type="time"
                    value={toTime}
                    onChange={(e) => setToTime(e.target.value)}
                    className="w-full rounded-md sm:rounded-lg border border-purple-300 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Include Date Checkbox */}
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <input
                  type="checkbox"
                  id="includeDate"
                  checked={includeDate}
                  onChange={(e) => setIncludeDate(e.target.checked)}
                  className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 border-purple-400 rounded"
                />
                <label
                  htmlFor="includeDate"
                  className="text-xs sm:text-sm font-semibold text-sky-800 dark:text-sky-200"
                >
                  Include Date in Report
                </label>
              </div>

              {/* Report Type Select */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-[10px] sm:text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full rounded-md sm:rounded-lg border border-purple-300 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Select report type</option>
                  <option value="daily">Traceability Report Complete</option>
                </select>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleApply}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm md:text-base text-white bg-gradient-to-r from-sky-500 via-purple-500 to-sky-600 hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1.5 sm:mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-xs sm:text-sm">Processing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1.5 sm:mr-2" />
                    <span className="text-xs sm:text-sm md:text-base">
                      Generate Report
                    </span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Search Button */}
      <div className="relative" ref={searchRef}>
        <button
          ref={searchBtnRef}
          onClick={toggleSearchDropdown}
          className="text-white hover:text-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white rounded p-1.5 sm:p-2"
          title="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {isSearchOpen && (
          <>
            {/* Mobile Overlay */}
            {isMobile && (
              <div
                className="fixed inset-0 bg-black/50 z-[70] md:hidden"
                onClick={() => setIsSearchOpen(false)}
              />
            )}

            {/* Search Panel */}
            <div
              className={`
              ${
                isMobile
                  ? "fixed inset-x-2 top-20 max-h-[70vh] z-[75]"
                  : "absolute right-0 mt-3 w-72 sm:w-80 md:w-96"
              }
              bg-gradient-to-r from-sky-400 to-purple-500 dark:from-purple-900 dark:to-indigo-900 
              rounded-lg shadow-xl 
              py-3 sm:py-4 px-3 sm:px-4 md:px-5 
              border dark:border-gray-700 
              transition-all duration-200 ease-in-out 
              z-[80]
              overflow-y-auto
            `}
            >
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-3 sm:mb-4">
                Search
              </h3>

              {searchWarning && (
                <div className="mb-2 sm:mb-3 text-[10px] sm:text-xs md:text-sm text-yellow-700 bg-yellow-100 border border-yellow-300 rounded px-2 sm:px-3 py-1.5 sm:py-2">
                  {searchWarning}
                </div>
              )}

              <div className="space-y-2 sm:space-y-3">
                {/* Search Input */}
                <div>
                  <label
                    htmlFor="searchInput"
                    className="block text-[11px] sm:text-xs md:text-sm font-medium text-white mb-1"
                  >
                    Find
                  </label>
                  <input
                    type="text"
                    id="searchInput"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-white focus:border-white text-xs sm:text-sm bg-white/90 dark:bg-gray-800/90 dark:text-white dark:border-gray-600 px-2 sm:px-3 py-1.5 sm:py-2"
                    placeholder="Enter value"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    disabled={loading}
                  />
                </div>

                {/* Search Type Select */}
                <div>
                  <label
                    htmlFor="searchTypeSelect"
                    className="block text-[11px] sm:text-xs md:text-sm font-medium text-white mb-1"
                  >
                    Search by
                  </label>
                  <select
                    id="searchTypeSelect"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-white focus:border-white text-xs sm:text-sm bg-white/90 dark:bg-gray-800/90 dark:text-white dark:border-gray-600 px-2 sm:px-3 py-1.5 sm:py-2"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                  >
                    <option value="uid">UID</option>
                    <option value="productid">Product ID</option>
                    <option value="productmodelname">Product Model</option>
                    <option value="productvariant">Product Variant</option>
                    <option value="productionstartdate">
                      Production Start Date
                    </option>
                    <option value="productionenddate">
                      Production End Date
                    </option>
                    <option value="status">Status</option>
                    <option value="endoflineuid">End of line UID</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-1 sm:pt-2">
                  <button
                    type="button"
                    onClick={handleSearch}
                    disabled={loading}
                    className="flex-1 inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-[11px] sm:text-xs md:text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {loading ? "Searching..." : "Find"}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 text-[11px] sm:text-xs md:text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-600"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.getElementById("header-controls"),
  );
}
