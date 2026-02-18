// // src/components/OrderTable.jsx
// import React, { useState, useMemo, useEffect } from 'react'
// import { Calendar, Clock, FileText, Package } from 'lucide-react';

// // const XLSX = require('sheetjs');

// /**
//  * OrderTable
//  * - client-side pagination
//  * - robust normalization of status -> canonical labels
//  * - filter buttons: Completed, Scrap, In Progress, Export
//  * - Single-select row (click row or checkbox); clicking again unselects
//  * - Resolves productid -> productionlinename (Line) via /trace/productionlines
//  */
// export function OrderTable({
//   orders = [],
//   onViewDetails,
//   onVisibleChange,
//   initialPageSize = 1000,
//   onSelectionChange,
//   loading = false  // ← ADD THIS LINE
// }) {

//   const [selectedOrders, setSelectedOrders] = useState([])
//   const [sortField, setSortField] = useState('uid')
//   const [sortDirection, setSortDirection] = useState('asc')
//   const [activeFilters, setActiveFilters] = useState([])
//   const [hoveredRow, setHoveredRow] = useState(null)
//   const [dateFilter, setDateFilter] = useState('');   // '', 'today', 'yesterday', 'last7', 'last30', 'custom'
//   const [customFrom, setCustomFrom] = useState('');
//   const [customTo, setCustomTo] = useState('');
//   const [tempCustomFrom, setTempCustomFrom] = useState('');
//   const [tempCustomTo, setTempCustomTo] = useState('');
//   const [showCustomPicker, setShowCustomPicker] = useState(false);
//   const [showNoDataMessage, setShowNoDataMessage] = useState(false);
//     // const [loading, setLoading] = useState(false) // ← ADD THIS LINE

//   // Pagination
//   const [page, setPage] = useState(1)
//   const [pageSize, setPageSize] = useState(initialPageSize)

//   // --- Production line lookup (productid -> productionlinename)
//   const [lineMap, setLineMap] = useState({})

//   useEffect(() => {
//     let cancelled = false
//     const BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '')
//     ;(async () => {
//       try {
//         const r = await fetch(`${BASE}/api/trace/productionlines`)
//         if (!r.ok) {
//           // Log the status and the response text for debugging
//           const text = await r.text()
//           console.error(`Failed to load /trace/productionlines: Server returned status ${r.status}`, text)
//           setLineMap({})
//           return
//         }
//         const j = await r.json()
//         if (cancelled) return
//         const map = Object.fromEntries(
//           (j?.data || []).map(x => [String(x.productid).trim().toUpperCase(), x.productionlinename])
//         )
//         setLineMap(map)
//       } catch (e) {
//         console.error('Failed to load /trace/productionlines', e)
//         setLineMap({})
//       }
//     })()
//     return () => { cancelled = true }
//   }, [])

//   // ADD THE LOADING EFFECT RIGHT HERE - after lineMap useEffect and before CANONICAL
//   // useEffect(() => {
//   //   if (orders.length === 0) {
//   //     setLoading(true)
//   //     // Simulate loading time or wait for actual data
//   //     const timer = setTimeout(() => {
//   //       setLoading(false)
//   //     }, 1000)
//   //     return () => clearTimeout(timer)
//   //   } else {
//   //     setLoading(false)
//   //   }
//   // }, [orders])

//   // Canonical status labels used in UI + filtering
//   const CANONICAL = {
//     completed: 'Completed',
//     scrap: 'Scrap',
//     inprogress: 'In Progress',
//     failed: 'Failed',
//     unknown: 'Unknown'
//   }

//   // ✅ Stable row key (prefer id, else UID, else index)
//   const getRowKey = (order, idx) => {
//     const id = order.id ?? order.ID
//     if (id !== undefined && id !== null && String(id).trim() !== '') return String(id)
//     const uid = (order.uid || order.UID || order._uid || '').trim()
//     if (uid) return uid
//     return `row-${idx}`
//   }

//   // Normalizers
//   const normalizeProductId = (order) =>
//     order.productid ||
//     order.productId ||
//     order.PRODUCTID ||
//     (order.__raw && (order.__raw.productid || order.__raw.productId || order.__raw.PRODUCTID)) ||
//     ''

//   const normalizeStatus = (order) => {
//     const raw =
//       (order._status && String(order._status)) ||
//       (order.status && String(order.status)) ||
//       (order.productstatus && String(order.productstatus)) ||
//       (order.__raw && (order.__raw.status || order.__raw.productstatus)) ||
//       ''
//     const s = (raw || '').trim().toLowerCase()
//     if (!s) return CANONICAL.unknown
//     if (/\b(in[\s_-]*progress)\b/.test(s)) return CANONICAL.inprogress
//     if (/\b(pass|completed?|complete)\b/.test(s)) return CANONICAL.completed
//     if (/\b(scrap|scrapped)\b/.test(s)) return CANONICAL.scrap
//     if (/\b(fail|failed)\b/.test(s)) return CANONICAL.failed
//     return s.split(/[_\s-]+/).map(w => w ? w[0].toUpperCase() + w.slice(1) : w).join(' ')
//   }

//   const normalizeModel = (order) =>
//     order.productmodelname || order.model || (order.__raw && (order.__raw.productmodelname || order.__raw.model)) || ''

//   const normalizeVariant = (order) =>
//     order.productvariant || order.variant || (order.__raw && (order.__raw.productvariant || order.__raw.variant)) || ''

//   const normalizeStartDate = (order) =>
//     order.productionstartdate ||
//     order.startDate ||
//     order.start_date ||
//     (order.__raw && (order.__raw.productionstartdate || order.__raw.startDate || order.__raw.start_date)) ||
//     ''

//   const normalizeEndDate = (order) =>
//     order.productionenddate ||
//     order.endDate ||
//     order.end_date ||
//     (order.__raw && (order.__raw.productionenddate || order.__raw.endDate || order.__raw.end_date)) ||
//     ''

//   // ✅ Map productid -> productionlinename (Line)
//   const normalizeLine = (order) => {
//     const pid = (normalizeProductId(order) || '').trim().toUpperCase()
//     if (!pid) return ''
//     return lineMap[pid] || order.line || ''
//   }

//   // Deduplicate by UID (one row per UID, last wins)
//   const dedupedOrders = useMemo(() => {
//     const map = new Map()
//     for (const o of (orders || [])) {
//       const key = (o.uid || o.UID || '').trim()
//       if (!key) continue
//       map.set(key, o)
//     }
//     return Array.from(map.values())
//   }, [orders])

//   // Enrich rows
//   const enrichedOrders = useMemo(() => {
//     return (dedupedOrders || []).map((o, idx) => ({
//       ...o,
//       _productid: normalizeProductId(o),
//       _line: normalizeLine(o), // <-- used for the ReportsPanel
//       _status: normalizeStatus(o),
//       _uid: o.uid || o.UID || (o.__raw && (o.__raw.uid || o.__raw.UID)) || '',
//       _idx: idx,
//       _model: normalizeModel(o),
//       _variant: normalizeVariant(o),
//       _startDate: normalizeStartDate(o),
//       _endDate: normalizeEndDate(o),
//     }))
//   }, [dedupedOrders, lineMap])

//   // Sorting
//   const sortedOrders = useMemo(() => {
//     const arr = [...enrichedOrders]
//     arr.sort((a, b) => {
//       const aValue = (a[sortField] ?? a[`_${sortField}`] ?? '') || ''
//       const bValue = (b[sortField] ?? b[`_${sortField}`] ?? '') || ''
//       const aNum = parseFloat(aValue)
//       const bNum = parseFloat(bValue)
//       let cmp = 0
//       if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
//         cmp = aNum < bNum ? -1 : aNum > bNum ? 1 : 0
//       } else {
//         const as = String(aValue).toLowerCase()
//         const bs = String(bValue).toLowerCase()
//         cmp = as < bs ? -1 : as > bs ? 1 : 0
//       }
//       return sortDirection === 'asc' ? cmp : -cmp
//     })
//     return arr
//   }, [enrichedOrders, sortField, sortDirection])

//   const handleSort = (field) => {
//     setSortField((prevField) => {
//       if (prevField === field) {
//         setSortDirection((prevDir) => (prevDir === 'asc' ? 'desc' : 'asc'))
//         return prevField
//       } else {
//         setSortDirection('asc')
//         return field
//       }
//     })
//   }

//   // Filters
//   const toggleFilter = (filterCanonical) => {
//     setPage(1)
//     setSelectedOrders((prev) => prev)
//     setActiveFilters((prev) =>
//       prev.includes(filterCanonical) ? prev.filter((f) => f !== filterCanonical) : [...prev, filterCanonical]
//     )
//   }

//     // const filteredOrders =
//     //   activeFilters.length > 0 ? sortedOrders.filter((order) => activeFilters.includes(order._status)) : sortedOrders

//     // Helper to parse date string to Date object (YYYY-MM-DD or ISO)
//   const parseDate = (str) => {
//     if (!str) return null;
//     // Handles both 'YYYY-MM-DD' and ISO strings
//     return new Date(str.length > 10 ? str : str + 'T00:00:00');
//   };

//   // Date filter logic
//   const filterByDate = (orders) => {
//     if (!dateFilter) return orders;
//     const today = new Date();
//     let from, to;

//     if (dateFilter === 'today') {
//       from = new Date(today.getFullYear(), today.getMonth(), today.getDate());
//       to = new Date(from);
//       to.setDate(to.getDate() + 1);
//     } else if (dateFilter === 'yesterday') {
//       from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
//       to = new Date(today.getFullYear(), today.getMonth(), today.getDate());
//     } else if (dateFilter === 'last7') {
//       from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
//       to = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
//     } else if (dateFilter === 'last30') {
//       from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29);
//       to = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
//     } else if (dateFilter === 'custom' && customFrom && customTo) {
//       from = parseDate(customFrom);
//       to = parseDate(customTo);
//       if (to) to.setDate(to.getDate() + 1); // include the end date
//     } else {
//       return orders;
//     }

//     return orders.filter(order => {
//       const start = parseDate(order._startDate);
//       if (!start) return false;
//       return start >= from && start < to;
//     });
//   };

//   // const filteredOrders = useMemo(() => {
//   //   let result = sortedOrders;
//   //   if (activeFilters.length > 0) {
//   //     result = result.filter((order) => activeFilters.includes(order._status));
//   //   }
//   //   result = filterByDate(result);
//   //   return result;
//   // }, [sortedOrders, activeFilters, dateFilter, customFrom, customTo]);

//   const filteredOrders = useMemo(() => {
//     let result = sortedOrders;
//     if (activeFilters.length > 0) {
//       result = result.filter((order) => activeFilters.includes(order._status));
//     }
//     result = filterByDate(result);

//     // Show "no data" message if filtered result is empty
//     if (result.length === 0 && (dateFilter || activeFilters.length > 0)) {
//       setShowNoDataMessage(true);
//       setTimeout(() => {
//         setShowNoDataMessage(false);
//       }, 3000);
//     }

//     return result;
//   }, [sortedOrders, activeFilters, dateFilter, customFrom, customTo]);

//   // Pagination
//   const total = filteredOrders.length
//   const totalPages = Math.max(1, Math.ceil(total / pageSize))

//   useEffect(() => {
//     setPage((p) => {
//       if (p > totalPages) return totalPages
//       if (p < 1) return 1
//       return p
//     })
//   }, [totalPages])

//   const startIndex = (page - 1) * pageSize
//   const endIndex = Math.min(startIndex + pageSize, total)

//   // ✅ Memoize pagedOrders so it doesn't change identity on every render
//   const pagedOrders = useMemo(() => {
//     return filteredOrders.slice(startIndex, endIndex)
//   }, [filteredOrders, startIndex, endIndex])

//   // ✅ Only trigger on real visible data change - FIXED to prevent infinite loops
//   // useEffect(() => {
//   //   if (!pagedOrders?.length) return

//   //   // Call onVisibleChange safely (if provided)
//   //   if (typeof onVisibleChange === 'function') {
//   //     onVisibleChange(pagedOrders)
//   //   }
//   // }, [pagedOrders, onVisibleChange])

//   // ✅ Separate useEffect for selection cleanup
//   useEffect(() => {
//     if (!pagedOrders?.length) return

//     setSelectedOrders((prev) => {
//       const visibleKeys = pagedOrders.map((r, i) => getRowKey(r, r._idx ?? startIndex + i))
//       const filtered = prev.filter(k => visibleKeys.includes(k))
//       return filtered.length === prev.length ? prev : filtered
//     })
//   }, [pagedOrders]) // Remove startIndex dependency

//   // ✅ Add this new useEffect for onVisibleChange with proper memoization
//   useEffect(() => {
//     if (typeof onVisibleChange === 'function' && pagedOrders.length > 0) {
//       onVisibleChange(pagedOrders)
//     }
//   }, [pagedOrders.length]) // Only depend on length changes, not the entire array

//   // Notify parent when selection changes — send enriched object + "line"
//   useEffect(() => {
//     if (typeof onSelectionChange === 'function') {
//       const selectedDetails = selectedOrders
//         .map((key) => enrichedOrders.find((o) => getRowKey(o, o._idx ?? 0) === key))
//         .filter(Boolean)
//         .map(o => ({ ...o, line: o._line })) // ensure prop name is "line"
//       onSelectionChange(selectedDetails)
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedOrders, enrichedOrders, lineMap])

//   useEffect(() => {
//     setPage(1);
//   }, [dateFilter, customFrom, customTo]);

//   const goPrevious = () => setPage((p) => Math.max(1, p - 1))
//   const goNext = () => setPage((p) => Math.min(totalPages, p + 1))

//   // --- Single-select toggle (row or checkbox)
//   const handleRowClick = (order, idx) => {
//     const key = getRowKey(order, idx)
//     setSelectedOrders((prev) => (prev.includes(key) ? [] : [key])) // click again to unselect
//   }

//   const toggleSelectAllOnPage = () => {
//     // keep this if you want; it doesn't impact single-row behavior
//     const visibleKeys = pagedOrders.map((r, i) => getRowKey(r, r._idx ?? startIndex + i))
//     const allSelected = visibleKeys.every((k) => selectedOrders.includes(k))
//     if (allSelected) {
//       setSelectedOrders((prev) => prev.filter((k) => !visibleKeys.includes(k)))
//     } else {
//       setSelectedOrders((prev) => [...prev, ...visibleKeys.filter((k) => !prev.includes(k))])
//     }
//   }

//   const getSortIcon = (field) => {
//     if (sortField !== field) {
//       return (
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-0 group-hover:opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
//         </svg>
//       )
//     }
//     return sortDirection === 'asc' ? (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
//       </svg>
//     ) : (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//       </svg>
//     )
//   }

//   const getStatusClass = (status) => {
//     const s = (status || '').toString().toLowerCase()
//     switch (s) {
//       case 'completed':
//         return 'bg-green-600 text-white border-2 border-green-200 hover:shadow-lg hover:shadow-green-400/40 transition-all duration-300 dark:bg-green-600 dark:text-white dark:border-green-400 dark:hover:shadow-white/40'

//       case 'in progress':
//       case 'inprogress':
//         return 'bg-blue-600 text-white border-2 border-blue-200 hover:shadow-lg hover:shadow-blue-400/40 transition-all duration-300 dark:bg-blue-600 dark:text-white dark:border-blue-400 dark:hover:shadow-white/40'

//       case 'scrap':
//         return 'bg-red-600 text-white border-2 border-red-200 hover:shadow-lg hover:shadow-red-400/40 transition-all duration-300 dark:bg-red-600 dark:text-white dark:border-red-400 dark:hover:shadow-white/40'

//       case 'failed':
//         return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'

//       default:
//         return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
//     }
//   }

//   // ADD THIS FUNCTION BEFORE the return statement
//   const handleExport = () => {
//     try {
//       // Use filteredOrders (all data, not just paged) for export
//       const exportData = filteredOrders.map(order => ({
//         'UID': order._uid || order.uid || '',
//         'Product ID': order._productid || '',
//         'Model': order._model || '',
//         'Variant': order._variant || '',
//         'Start Date': order._startDate || '',
//         'End Date': order._endDate || '',
//         'Status': order._status || '',
//         'Line': order._line || ''
//       }));

//       if (exportData.length === 0) {
//         alert('No data to export');
//         return;
//       }

//       // Create worksheet and workbook
//       const ws = XLSX.utils.json_to_sheet(exportData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Production Records');

//       // Generate Excel file
//       const fileName = `production_records_${new Date().toISOString().split('T')[0]}.xlsx`;
//       XLSX.writeFile(wb, fileName);

//       console.log(`Exported ${exportData.length} records to ${fileName}`);
//     } catch (error) {
//       console.error('Export failed:', error);
//       alert('Export failed. Please try again.');
//     }
//   };

//   return (
//     <div className="bg-white shadow-xl rounded-2xl overflow-hidden dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
//  <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
//   {/* Single Row: Title + Filters (space-between for left/right split) */}
//   {/* RESPONSIVE: mobile stacked, tablet 2-col, desktop 3-col */}
//   <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-6">
//     {/* LEFT SIDE: Title + Date Filters */}
//     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-2/3 lg:w-3/4 flex-wrap">
//       {/* Production Records Title */}
//       <h2 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent whitespace-nowrap">
//         Production Records
//       </h2>

//       {/* Vertical Divider - hide on mobile */}
//       <div className="hidden sm:inline-block w-px h-6 bg-gradient-to-b from-indigo-300 to-purple-300 dark:from-gray-600 dark:to-gray-700"></div>

//       {/* Date Filter Buttons */}
//       <div className="flex flex-wrap gap-2">
//         <button
//           className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
//             dateFilter === 'today'
//               ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
//               : 'bg-white/80 text-gray-700 border border-gray-300 hover:border-indigo-400 hover:shadow-md dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600'
//           }`}
//           onClick={() => {
//             setDateFilter(dateFilter === 'today' ? '' : 'today');
//             setCustomFrom('');
//             setCustomTo('');
//           }}
//         >
//           Today
//         </button>

//         <button
//           className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
//             dateFilter === 'last7'
//               ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
//               : 'bg-white/80 text-gray-700 border border-gray-300 hover:border-indigo-400 hover:shadow-md dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600'
//           }`}
//           onClick={() => {
//             setDateFilter(dateFilter === 'last7' ? '' : 'last7');
//             setCustomFrom('');
//             setCustomTo('');
//           }}
//         >
//           Last 7 Days
//         </button>

//         <button
//           className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
//             dateFilter === 'last30'
//               ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
//               : 'bg-white/80 text-gray-700 border border-gray-300 hover:border-indigo-400 hover:shadow-md dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600'
//           }`}
//           onClick={() => {
//             setDateFilter(dateFilter === 'last30' ? '' : 'last30');
//             setCustomFrom('');
//             setCustomTo('');
//           }}
//         >
//           Last 30 Days
//         </button>

//         {/* Custom Range Button with Modern Dropdown */}
//         <div className="relative">
//           <button
//             className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1 ${
//               dateFilter === 'custom'
//                 ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
//                 : 'bg-white/80 text-gray-700 border border-gray-300 hover:border-indigo-400 hover:shadow-md dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600'
//             }`}
//             onClick={() => {
//               setShowCustomPicker(!showCustomPicker);
//               if (!showCustomPicker) {
//                 setTempCustomFrom(customFrom);
//                 setTempCustomTo(customTo);
//               }
//             }}
//           >
//             <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
//             </svg>
//             <span className="hidden sm:inline">Custom Range</span>
//             {dateFilter === 'custom' && customFrom && customTo && (
//               <span className="ml-1 text-[10px] opacity-80 hidden md:inline">({customFrom} to {customTo})</span>
//             )}
//           </button>

//           {/* Modern Custom Date Picker Dropdown */}
//           {showCustomPicker && (
//             <>
//               {/* Backdrop to close on outside click */}
//               <div
//                 className="fixed inset-0 z-40"
//                 onClick={() => setShowCustomPicker(false)}
//               />

//               <div className="absolute top-full left-0 mt-2 p-4 sm:p-5 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-indigo-200 dark:border-indigo-700 shadow-2xl z-50 min-w-[280px] sm:min-w-[420px] backdrop-blur-sm">
//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-3 pb-2 border-b border-indigo-200 dark:border-indigo-700">
//                   <h3 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
//                     <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
//                     </svg>
//                     Select Date Range
//                   </h3>
//                   <button
//                     onClick={() => setShowCustomPicker(false)}
//                     className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
//                   >
//                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
//                     </svg>
//                   </button>
//                 </div>

//                 <div className="flex flex-col gap-3" onClick={e => e.stopPropagation()}>
//                   {/* From Date */}
//                   <div>
//                     <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
//                       <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
//                       </svg>
//                       From Date
//                     </label>
//                     <input
//                       type="date"
//                       value={tempCustomFrom}
//                       onChange={e => setTempCustomFrom(e.target.value)}
//                       className="w-full px-3 py-2 text-sm border-2 border-indigo-200 dark:border-indigo-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all shadow-sm hover:shadow-md"
//                     />
//                   </div>

//                   {/* To Date */}
//                   <div>
//                     <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
//                       <svg className="w-3.5 h-3.5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
//                       </svg>
//                       To Date
//                     </label>
//                     <input
//                       type="date"
//                       value={tempCustomTo}
//                       onChange={e => setTempCustomTo(e.target.value)}
//                       className="w-full px-3 py-2 text-sm border-2 border-indigo-200 dark:border-indigo-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all shadow-sm hover:shadow-md"
//                     />
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex gap-2 pt-2">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         if (tempCustomFrom && tempCustomTo) {
//                           setCustomFrom(tempCustomFrom);
//                           setCustomTo(tempCustomTo);
//                           setDateFilter('custom');
//                           setShowCustomPicker(false);
//                         }
//                       }}
//                       disabled={!tempCustomFrom || !tempCustomTo}
//                       className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2"
//                     >
//                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
//                       </svg>
//                       Apply Filter
//                     </button>

//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setCustomFrom('');
//                         setCustomTo('');
//                         setTempCustomFrom('');
//                         setTempCustomTo('');
//                         setDateFilter('');
//                         setShowCustomPicker(false);
//                       }}
//                       className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
//                     >
//                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
//                       </svg>
//                       Clear Filter
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>

//     {/* RIGHT SIDE: Status Filter Buttons */}
//     <div className="flex items-center gap-2 flex-wrap mt-3 lg:mt-0">
//       <button
//         className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
//           activeFilters.includes(CANONICAL.completed)
//             ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 scale-105'
//             : 'bg-white/80 text-green-700 border border-green-300 hover:border-green-400 hover:shadow-md dark:bg-gray-700/50 dark:text-green-400 dark:border-green-700'
//         }`}
//         onClick={() => toggleFilter(CANONICAL.completed)}
//       >
//         ✓ Completed
//       </button>

//       <button
//         className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
//           activeFilters.includes(CANONICAL.scrap)
//             ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 scale-105'
//             : 'bg-white/80 text-red-700 border border-red-300 hover:border-red-400 hover:shadow-md dark:bg-gray-700/50 dark:text-red-400 dark:border-red-700'
//         }`}
//         onClick={() => toggleFilter(CANONICAL.scrap)}
//       >
//         ✕ Scrap
//       </button>

//       <button
//         className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
//           activeFilters.includes(CANONICAL.inprogress)
//             ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-400/30 scale-105'
//             : 'bg-white/80 text-cyan-700 border border-cyan-300 hover:border-cyan-400 hover:shadow-md dark:bg-gray-700/50 dark:text-cyan-400 dark:border-cyan-700'
//         }`}
//         onClick={() => toggleFilter(CANONICAL.inprogress)}
//       >
//         ⟳ In Progress
//       </button>
//     </div>
//   </div>
// </div>

//       {/* Table - Always show data table */}
//       <div className="overflow-x-auto h-[60vh] sm:h-[65vh] lg:h-[70vh] overflow-y-auto">
//         <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//           <thead className="bg-gradient-to-r from-sky-400 to-purple-500 dark:from-purple-900 dark:to-indigo-900 sticky top-0 z-10">
//             <tr>
//               <th className="px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
//                 {/* Checkbox removed */}
//               </th>
//               <th onClick={() => handleSort('uid')} className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200">
//                 <div className="flex items-center space-x-1"><span>UID</span>{getSortIcon('uid')}</div>
//               </th>
//               <th onClick={() => handleSort('_productid')} className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200">
//                 <div className="flex items-center space-x-1"><span>Product ID</span>{getSortIcon('_productid')}</div>
//               </th>
//               <th onClick={() => handleSort('_model')} className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200">
//                 <div className="flex items-center space-x-1"><span>Model</span>{getSortIcon('_model')}</div>
//               </th>
//               <th onClick={() => handleSort('_variant')} className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200">
//                 <div className="flex items-center space-x-1"><span>Variant</span>{getSortIcon('_variant')}</div>
//               </th>
//               <th onClick={() => handleSort('_startDate')} className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200">
//                 <div className="flex items-center space-x-1"><span>Start Date</span>{getSortIcon('_startDate')}</div>
//               </th>
//               <th onClick={() => handleSort('_endDate')} className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200">
//                 <div className="flex items-center space-x-1"><span>End Date</span>{getSortIcon('_endDate')}</div>
//               </th>
//               <th onClick={() => handleSort('_status')} className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200">
//                 <div className="flex items-center space-x-1"><span>Status</span>{getSortIcon('_status')}</div>
//               </th>
//             </tr>
//           </thead>

// <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//     {pagedOrders.length === 0 && showNoDataMessage ? (
//       <tr>
//         <td colSpan={8} className="text-center py-16">
//           <div className="flex flex-col items-center justify-center">
//             <div className="mb-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full">
//               <svg className="w-16 h-16 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
//               </svg>
//             </div>
//             <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
//               No matching records found
//             </p>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               The selected date range or filters returned no results (disappears in 3s)
//             </p>
//           </div>
//         </td>
//       </tr>
//     ) : pagedOrders.length === 0 ? (
//       <tr>
//         <td colSpan={8} className="text-center py-16">
//           <div className="flex flex-col items-center justify-center">
//             <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
//             </svg>
//             <p className="text-gray-500 dark:text-gray-400">No data available</p>
//           </div>
//         </td>
//       </tr>
//     ) : (
//       pagedOrders.map((order, idx) => {
//         const realIdx = startIndex + idx
//         const rowKey = getRowKey(order, order._idx ?? realIdx)

//         return (
//           <tr
//             key={rowKey}
//             className={`cursor-pointer transition-all duration-200 ${
//               hoveredRow === rowKey ? 'bg-gradient-to-r from-blue-100 to-purple-200 dark:from-gray-700 dark:to-gray-700 shadow-sm' : 'hover:bg-gray-50 dark:bg-gray-800'
//             } ${selectedOrders.includes(rowKey) ? 'bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900/50 dark:via-purple-900/50 dark:to-pink-900/50 shadow-md scale-[1.01] border-l-4 border-indigo-500' : ''}`}
//             onMouseEnter={() => setHoveredRow(rowKey)}
//             onMouseLeave={() => setHoveredRow(null)}
//             onClick={() => handleRowClick(order, order._idx ?? realIdx)}
//           >
//             <td className="px-3 py-2 whitespace-nowrap">
//               <input
//                 type="checkbox"
//                 className="h-4 w-4 text-indigo-600 border-gray-300 rounded dark:bg-gray-800 dark:text-gray-200"
//                 checked={selectedOrders.includes(rowKey)}
//                 onClick={(e) => e.stopPropagation()}
//                 onChange={() => handleRowClick(order, order._idx ?? realIdx)}
//               />
//             </td>

//             <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
//               <span className="text-gray-900 dark:text-gray-200">
//                 {order._uid || order.uid}
//               </span>
//             </td>

//             <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{order._productid}</td>
//             <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{order._model}</td>
//             <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{order._variant}</td>
//             <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{order._startDate}</td>
//             <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{order._endDate}</td>

//             <td className="px-3 py-2 whitespace-nowrap">
//               <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm ${getStatusClass(order._status)}`}>
//                 {order._status}
//               </span>
//             </td>
//           </tr>
//         )
//       })
//     )}
//   </tbody>
//         </table>
//       </div>

//      {/* Pagination */}
// <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:to-gray-700">
//   <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//     {/* Left side - Showing results text */}
//     <div className="text-sm text-gray-700 dark:text-gray-300">
//       Showing <span className="font-medium">{total === 0 ? 0 : startIndex + 1}</span> to <span className="font-medium">{endIndex}</span> of <span className="font-medium">{total}</span> results
//     </div>

//     {/* Center - Export Button */}
//   <button
//     onClick={handleExport}
//     className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-gray-50 via-white to-orange-50 text-gray-700 border-2 border-gray-300 hover:border-orange-300 hover:from-orange-50 hover:via-white hover:to-orange-100 shadow-md hover:shadow-lg hover:shadow-orange-200/50 hover:scale-105 transition-all duration-300 transform"
//   >
//     <span className="flex items-center gap-2">
//       <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
//         <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
//       </svg>
//       <span className="bg-gradient-to-r from-gray-700 to-orange-600 bg-clip-text text-transparent">
//         Export ({filteredOrders.length})
//       </span>
//     </span>
//   </button>

//     {/* Right side - Pagination controls */}
//     <div className="flex items-center space-x-3">
//       <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
//         <label>Rows</label>
//         <select
//           value={pageSize}
//           onChange={(e) => {
//             const val = Number(e.target.value) || initialPageSize
//             setPageSize(val)
//             setPage(1)
//           }}
//           className="rounded-lg border-2 border-indigo-200 px-3 py-1.5 font-medium focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:bg-gray-800 dark:text-gray-200 dark:border-indigo-700 transition-all duration-200"
//         >
//           <option value={10}>10</option>
//           <option value={25}>25</option>
//           <option value={50}>50</option>
//           <option value={100}>100</option>
//           <option value={1000}>1000</option>
//         </select>
//       </div>

//       <div className="flex items-center">
//         <button
//           onClick={goPrevious}
//           disabled={page <= 1}
//           className="relative inline-flex items-center px-5 py-2.5 border-2 border-indigo-300 text-sm font-semibold rounded-lg text-indigo-700 bg-white hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:bg-gray-800 dark:text-indigo-400 dark:border-indigo-700 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
//         >
//           Previous
//         </button>

//         <div className="mx-3 text-sm text-gray-700 dark:text-gray-300">
//           Page <span className="font-medium">{page}</span> / <span className="font-medium">{totalPages}</span>
//         </div>

//         <button
//           onClick={goNext}
//           disabled={page >= totalPages}
//           className="ml-0 relative inline-flex items-center px-5 py-2.5 border-2 border-indigo-300 text-sm font-semibold rounded-lg text-indigo-700 bg-white hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:bg-gray-800 dark:text-indigo-400 dark:border-indigo-700 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   </div>
// </div>
//     </div>
//   )
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // src/components/OrderTable.jsx
// import React, { useState, useMemo, useEffect } from 'react'
// import { Calendar, Clock, FileText, Package } from 'lucide-react';

// // const XLSX = require('sheetjs');

// /**
//  * OrderTable
//  * - client-side pagination
//  * - robust normalization of status -> canonical labels
//  * - filter buttons: Completed, Scrap, In Progress, Export
//  * - Single-select row (click row or checkbox); clicking again unselects
//  * - Resolves productid -> productionlinename (Line) via /trace/productionlines
//  */
// export function OrderTable({
//   orders = [],
//   onViewDetails,
//   onVisibleChange,
//   initialPageSize = 1000,
//   onSelectionChange,
//   loading = false  // ← ADD THIS LINE
// }) {

//   const [selectedOrders, setSelectedOrders] = useState([])
//   const [sortField, setSortField] = useState('uid')
//   const [sortDirection, setSortDirection] = useState('asc')
//   const [activeFilters, setActiveFilters] = useState([])
//   const [hoveredRow, setHoveredRow] = useState(null)
//   const [dateFilter, setDateFilter] = useState('');   // '', 'today', 'yesterday', 'last7', 'last30', 'custom'
//   const [customFrom, setCustomFrom] = useState('');
//   const [customTo, setCustomTo] = useState('');
//   const [tempCustomFrom, setTempCustomFrom] = useState('');
//   const [tempCustomTo, setTempCustomTo] = useState('');
//   const [showCustomPicker, setShowCustomPicker] = useState(false);
//   const [showNoDataMessage, setShowNoDataMessage] = useState(false);
//     // const [loading, setLoading] = useState(false) // ← ADD THIS LINE

//   // Pagination
//   const [page, setPage] = useState(1)
//   const [pageSize, setPageSize] = useState(initialPageSize)

//   // --- Production line lookup (productid -> productionlinename)
//   const [lineMap, setLineMap] = useState({})

//   useEffect(() => {
//     let cancelled = false
//     const BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '')
//     ;(async () => {
//       try {
//         const r = await fetch(`${BASE}/api/trace/productionlines`)
//         if (!r.ok) {
//           // Log the status and the response text for debugging
//           const text = await r.text()
//           console.error(`Failed to load /trace/productionlines: Server returned status ${r.status}`, text)
//           setLineMap({})
//           return
//         }
//         const j = await r.json()
//         if (cancelled) return
//         const map = Object.fromEntries(
//           (j?.data || []).map(x => [String(x.productid).trim().toUpperCase(), x.productionlinename])
//         )
//         setLineMap(map)
//       } catch (e) {
//         console.error('Failed to load /trace/productionlines', e)
//         setLineMap({})
//       }
//     })()
//     return () => { cancelled = true }
//   }, [])

//   // ADD THE LOADING EFFECT RIGHT HERE - after lineMap useEffect and before CANONICAL
//   // useEffect(() => {
//   //   if (orders.length === 0) {
//   //     setLoading(true)
//   //     // Simulate loading time or wait for actual data
//   //     const timer = setTimeout(() => {
//   //       setLoading(false)
//   //     }, 1000)
//   //     return () => clearTimeout(timer)
//   //   } else {
//   //     setLoading(false)
//   //   }
//   // }, [orders])

//   // Canonical status labels used in UI + filtering
//   const CANONICAL = {
//     completed: 'Completed',
//     scrap: 'Scrap',
//     inprogress: 'In Progress',
//     failed: 'Failed',
//     unknown: 'Unknown'
//   }

//   // ✅ Stable row key (prefer id, else UID, else index)
//   const getRowKey = (order, idx) => {
//     const id = order.id ?? order.ID
//     if (id !== undefined && id !== null && String(id).trim() !== '') return String(id)
//     const uid = (order.uid || order.UID || order._uid || '').trim()
//     if (uid) return uid
//     return `row-${idx}`
//   }

//   // Normalizers
//   const normalizeProductId = (order) =>
//     order.productid ||
//     order.productId ||
//     order.PRODUCTID ||
//     (order.__raw && (order.__raw.productid || order.__raw.productId || order.__raw.PRODUCTID)) ||
//     ''

//   const normalizeStatus = (order) => {
//     const raw =
//       (order._status && String(order._status)) ||
//       (order.status && String(order.status)) ||
//       (order.productstatus && String(order.productstatus)) ||
//       (order.__raw && (order.__raw.status || order.__raw.productstatus)) ||
//       ''
//     const s = (raw || '').trim().toLowerCase()
//     if (!s) return CANONICAL.unknown
//     if (/\b(in[\s_-]*progress)\b/.test(s)) return CANONICAL.inprogress
//     if (/\b(pass|completed?|complete)\b/.test(s)) return CANONICAL.completed
//     if (/\b(scrap|scrapped)\b/.test(s)) return CANONICAL.scrap
//     if (/\b(fail|failed)\b/.test(s)) return CANONICAL.failed
//     return s.split(/[_\s-]+/).map(w => w ? w[0].toUpperCase() + w.slice(1) : w).join(' ')
//   }

//   const normalizeModel = (order) =>
//     order.productmodelname || order.model || (order.__raw && (order.__raw.productmodelname || order.__raw.model)) || ''

//   const normalizeVariant = (order) =>
//     order.productvariant || order.variant || (order.__raw && (order.__raw.productvariant || order.__raw.variant)) || ''

//   const normalizeStartDate = (order) =>
//     order.productionstartdate ||
//     order.startDate ||
//     order.start_date ||
//     (order.__raw && (order.__raw.productionstartdate || order.__raw.startDate || order.__raw.start_date)) ||
//     ''

//   const normalizeEndDate = (order) =>
//     order.productionenddate ||
//     order.endDate ||
//     order.end_date ||
//     (order.__raw && (order.__raw.productionenddate || order.__raw.endDate || order.__raw.end_date)) ||
//     ''

//   // ✅ Map productid -> productionlinename (Line)
//   const normalizeLine = (order) => {
//     const pid = (normalizeProductId(order) || '').trim().toUpperCase()
//     if (!pid) return ''
//     return lineMap[pid] || order.line || ''
//   }

//   // Deduplicate by UID (one row per UID, last wins)
//   const dedupedOrders = useMemo(() => {
//     const map = new Map()
//     for (const o of (orders || [])) {
//       const key = (o.uid || o.UID || '').trim()
//       if (!key) continue
//       map.set(key, o)
//     }
//     return Array.from(map.values())
//   }, [orders])

//   // Enrich rows
//   const enrichedOrders = useMemo(() => {
//     return (dedupedOrders || []).map((o, idx) => ({
//       ...o,
//       _productid: normalizeProductId(o),
//       _line: normalizeLine(o), // <-- used for the ReportsPanel
//       _status: normalizeStatus(o),
//       _uid: o.uid || o.UID || (o.__raw && (o.__raw.uid || o.__raw.UID)) || '',
//       _idx: idx,
//       _model: normalizeModel(o),
//       _variant: normalizeVariant(o),
//       _startDate: normalizeStartDate(o),
//       _endDate: normalizeEndDate(o),
//     }))
//   }, [dedupedOrders, lineMap])

//   // Sorting
//   const sortedOrders = useMemo(() => {
//     const arr = [...enrichedOrders]
//     arr.sort((a, b) => {
//       const aValue = (a[sortField] ?? a[`_${sortField}`] ?? '') || ''
//       const bValue = (b[sortField] ?? b[`_${sortField}`] ?? '') || ''
//       const aNum = parseFloat(aValue)
//       const bNum = parseFloat(bValue)
//       let cmp = 0
//       if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
//         cmp = aNum < bNum ? -1 : aNum > bNum ? 1 : 0
//       } else {
//         const as = String(aValue).toLowerCase()
//         const bs = String(bValue).toLowerCase()
//         cmp = as < bs ? -1 : as > bs ? 1 : 0
//       }
//       return sortDirection === 'asc' ? cmp : -cmp
//     })
//     return arr
//   }, [enrichedOrders, sortField, sortDirection])

//   const handleSort = (field) => {
//     setSortField((prevField) => {
//       if (prevField === field) {
//         setSortDirection((prevDir) => (prevDir === 'asc' ? 'desc' : 'asc'))
//         return prevField
//       } else {
//         setSortDirection('asc')
//         return field
//       }
//     })
//   }

//   // Filters
//   const toggleFilter = (filterCanonical) => {
//     setPage(1)
//     setSelectedOrders((prev) => prev)
//     setActiveFilters((prev) =>
//       prev.includes(filterCanonical) ? prev.filter((f) => f !== filterCanonical) : [...prev, filterCanonical]
//     )
//   }

//     // const filteredOrders =
//     //   activeFilters.length > 0 ? sortedOrders.filter((order) => activeFilters.includes(order._status)) : sortedOrders

//     // Helper to parse date string to Date object (YYYY-MM-DD or ISO)
//   const parseDate = (str) => {
//     if (!str) return null;
//     // Handles both 'YYYY-MM-DD' and ISO strings
//     return new Date(str.length > 10 ? str : str + 'T00:00:00');
//   };

//   // Date filter logic
//   const filterByDate = (orders) => {
//     if (!dateFilter) return orders;
//     const today = new Date();
//     let from, to;

//     if (dateFilter === 'today') {
//       from = new Date(today.getFullYear(), today.getMonth(), today.getDate());
//       to = new Date(from);
//       to.setDate(to.getDate() + 1);
//     } else if (dateFilter === 'yesterday') {
//       from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
//       to = new Date(today.getFullYear(), today.getMonth(), today.getDate());
//     } else if (dateFilter === 'last7') {
//       from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
//       to = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
//     } else if (dateFilter === 'last30') {
//       from = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29);
//       to = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
//     } else if (dateFilter === 'custom' && customFrom && customTo) {
//       from = parseDate(customFrom);
//       to = parseDate(customTo);
//       if (to) to.setDate(to.getDate() + 1); // include the end date
//     } else {
//       return orders;
//     }

//     return orders.filter(order => {
//       const start = parseDate(order._startDate);
//       if (!start) return false;
//       return start >= from && start < to;
//     });
//   };

//   // const filteredOrders = useMemo(() => {
//   //   let result = sortedOrders;
//   //   if (activeFilters.length > 0) {
//   //     result = result.filter((order) => activeFilters.includes(order._status));
//   //   }
//   //   result = filterByDate(result);
//   //   return result;
//   // }, [sortedOrders, activeFilters, dateFilter, customFrom, customTo]);

//   const filteredOrders = useMemo(() => {
//     let result = sortedOrders;
//     if (activeFilters.length > 0) {
//       result = result.filter((order) => activeFilters.includes(order._status));
//     }
//     result = filterByDate(result);

//     // Show "no data" message if filtered result is empty
//     if (result.length === 0 && (dateFilter || activeFilters.length > 0)) {
//       setShowNoDataMessage(true);
//       setTimeout(() => {
//         setShowNoDataMessage(false);
//       }, 3000);
//     }

//     return result;
//   }, [sortedOrders, activeFilters, dateFilter, customFrom, customTo]);

//   // Pagination
//   const total = filteredOrders.length
//   const totalPages = Math.max(1, Math.ceil(total / pageSize))

//   useEffect(() => {
//     setPage((p) => {
//       if (p > totalPages) return totalPages
//       if (p < 1) return 1
//       return p
//     })
//   }, [totalPages])

//   const startIndex = (page - 1) * pageSize
//   const endIndex = Math.min(startIndex + pageSize, total)

//   // ✅ Memoize pagedOrders so it doesn't change identity on every render
//   const pagedOrders = useMemo(() => {
//     return filteredOrders.slice(startIndex, endIndex)
//   }, [filteredOrders, startIndex, endIndex])

//   // ✅ Only trigger on real visible data change - FIXED to prevent infinite loops
//   // useEffect(() => {
//   //   if (!pagedOrders?.length) return

//   //   // Call onVisibleChange safely (if provided)
//   //   if (typeof onVisibleChange === 'function') {
//   //     onVisibleChange(pagedOrders)
//   //   }
//   // }, [pagedOrders, onVisibleChange])

//   // ✅ Separate useEffect for selection cleanup
//   useEffect(() => {
//     if (!pagedOrders?.length) return

//     setSelectedOrders((prev) => {
//       const visibleKeys = pagedOrders.map((r, i) => getRowKey(r, r._idx ?? startIndex + i))
//       const filtered = prev.filter(k => visibleKeys.includes(k))
//       return filtered.length === prev.length ? prev : filtered
//     })
//   }, [pagedOrders]) // Remove startIndex dependency

//   // ✅ Add this new useEffect for onVisibleChange with proper memoization
//   useEffect(() => {
//     if (typeof onVisibleChange === 'function' && pagedOrders.length > 0) {
//       onVisibleChange(pagedOrders)
//     }
//   }, [pagedOrders.length]) // Only depend on length changes, not the entire array

//   // Notify parent when selection changes — send enriched object + "line"
//   useEffect(() => {
//     if (typeof onSelectionChange === 'function') {
//       const selectedDetails = selectedOrders
//         .map((key) => enrichedOrders.find((o) => getRowKey(o, o._idx ?? 0) === key))
//         .filter(Boolean)
//         .map(o => ({ ...o, line: o._line })) // ensure prop name is "line"
//       onSelectionChange(selectedDetails)
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedOrders, enrichedOrders, lineMap])

//   useEffect(() => {
//     setPage(1);
//   }, [dateFilter, customFrom, customTo]);

//   const goPrevious = () => setPage((p) => Math.max(1, p - 1))
//   const goNext = () => setPage((p) => Math.min(totalPages, p + 1))

//   // --- Single-select toggle (row or checkbox)
//   const handleRowClick = (order, idx) => {
//     const key = getRowKey(order, idx)
//     setSelectedOrders((prev) => (prev.includes(key) ? [] : [key])) // click again to unselect
//   }

//   const toggleSelectAllOnPage = () => {
//     // keep this if you want; it doesn't impact single-row behavior
//     const visibleKeys = pagedOrders.map((r, i) => getRowKey(r, r._idx ?? startIndex + i))
//     const allSelected = visibleKeys.every((k) => selectedOrders.includes(k))
//     if (allSelected) {
//       setSelectedOrders((prev) => prev.filter((k) => !visibleKeys.includes(k)))
//     } else {
//       setSelectedOrders((prev) => [...prev, ...visibleKeys.filter((k) => !prev.includes(k))])
//     }
//   }

//   const getSortIcon = (field) => {
//     if (sortField !== field) {
//       return (
//         <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 opacity-0 group-hover:opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
//         </svg>
//       )
//     }
//     return sortDirection === 'asc' ? (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
//       </svg>
//     ) : (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//       </svg>
//     )
//   }

//   const getStatusClass = (status) => {
//     const s = (status || '').toString().toLowerCase()
//     switch (s) {
//       case 'completed':
//         return 'bg-green-600 text-white border border-green-200 sm:border-2 hover:shadow-lg hover:shadow-green-400/40 transition-all duration-300 dark:bg-green-600 dark:text-white dark:border-green-400 dark:hover:shadow-white/40'

//       case 'in progress':
//       case 'inprogress':
//         return 'bg-blue-600 text-white border border-blue-200 sm:border-2 hover:shadow-lg hover:shadow-blue-400/40 transition-all duration-300 dark:bg-blue-600 dark:text-white dark:border-blue-400 dark:hover:shadow-white/40'

//       case 'scrap':
//         return 'bg-red-600 text-white border border-red-200 sm:border-2 hover:shadow-lg hover:shadow-red-400/40 transition-all duration-300 dark:bg-red-600 dark:text-white dark:border-red-400 dark:hover:shadow-white/40'

//       case 'failed':
//         return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'

//       default:
//         return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
//     }
//   }

//   // ADD THIS FUNCTION BEFORE the return statement
//   const handleExport = () => {
//     try {
//       // Use filteredOrders (all data, not just paged) for export
//       const exportData = filteredOrders.map(order => ({
//         'UID': order._uid || order.uid || '',
//         'Product ID': order._productid || '',
//         'Model': order._model || '',
//         'Variant': order._variant || '',
//         'Start Date': order._startDate || '',
//         'End Date': order._endDate || '',
//         'Status': order._status || '',
//         'Line': order._line || ''
//       }));

//       if (exportData.length === 0) {
//         alert('No data to export');
//         return;
//       }

//       // Create worksheet and workbook
//       const ws = XLSX.utils.json_to_sheet(exportData);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Production Records');

//       // Generate Excel file
//       const fileName = `production_records_${new Date().toISOString().split('T')[0]}.xlsx`;
//       XLSX.writeFile(wb, fileName);

//       console.log(`Exported ${exportData.length} records to ${fileName}`);
//     } catch (error) {
//       console.error('Export failed:', error);
//       alert('Export failed. Please try again.');
//     }
//   };

//   return (
//     <div className="bg-white shadow-xl rounded-xl sm:rounded-2xl overflow-hidden dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
//       <div className="p-3 sm:px-6 sm:py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
//         {/* Responsive Header Layout */}
//         <div className="flex flex-col space-y-3">
//           {/* Title Row */}
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//             <h2 className="text-lg sm:text-xl lg:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2 sm:mb-0">
//               Production Records
//             </h2>

//             {/* Status Filters - Desktop/Tablet */}
//             <div className="hidden sm:flex items-center gap-2 flex-wrap">
//               <button
//                 className={`px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-full transition-all duration-200 ${
//                   activeFilters.includes(CANONICAL.completed)
//                     ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 scale-105'
//                     : 'bg-white/80 text-green-700 border border-green-300 hover:border-green-400 hover:shadow-md dark:bg-gray-700/50 dark:text-green-400 dark:border-green-700'
//                 }`}
//                 onClick={() => toggleFilter(CANONICAL.completed)}
//               >
//                 ✓ Completed
//               </button>

//               <button
//                 className={`px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-full transition-all duration-200 ${
//                   activeFilters.includes(CANONICAL.scrap)
//                     ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 scale-105'
//                     : 'bg-white/80 text-red-700 border border-red-300 hover:border-red-400 hover:shadow-md dark:bg-gray-700/50 dark:text-red-400 dark:border-red-700'
//                 }`}
//                 onClick={() => toggleFilter(CANONICAL.scrap)}
//               >
//                 ✕ Scrap
//               </button>

//               <button
//                 className={`px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-full transition-all duration-200 ${
//                   activeFilters.includes(CANONICAL.inprogress)
//                     ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-400/30 scale-105'
//                     : 'bg-white/80 text-cyan-700 border border-cyan-300 hover:border-cyan-400 hover:shadow-md dark:bg-gray-700/50 dark:text-cyan-400 dark:border-cyan-700'
//                 }`}
//                 onClick={() => toggleFilter(CANONICAL.inprogress)}
//               >
//                 ⟳ In Progress
//               </button>
//             </div>
//           </div>

//           {/* Date Filters Row */}
//           <div className="flex flex-wrap gap-2 items-center">
//             <button
//               className={`px-2 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all duration-200 ${
//                 dateFilter === 'today'
//                   ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
//                   : 'bg-white/80 text-gray-700 border border-gray-300 hover:border-indigo-400 hover:shadow-md dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600'
//               }`}
//               onClick={() => {
//                 setDateFilter(dateFilter === 'today' ? '' : 'today');
//                 setCustomFrom('');
//                 setCustomTo('');
//               }}
//             >
//               Today
//             </button>

//             <button
//               className={`px-2 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all duration-200 ${
//                 dateFilter === 'last7'
//                   ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
//                   : 'bg-white/80 text-gray-700 border border-gray-300 hover:border-indigo-400 hover:shadow-md dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600'
//               }`}
//               onClick={() => {
//                 setDateFilter(dateFilter === 'last7' ? '' : 'last7');
//                 setCustomFrom('');
//                 setCustomTo('');
//               }}
//             >
//               <span className="hidden xs:inline">Last </span>7 Days
//             </button>

//             <button
//               className={`px-2 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all duration-200 ${
//                 dateFilter === 'last30'
//                   ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
//                   : 'bg-white/80 text-gray-700 border border-gray-300 hover:border-indigo-400 hover:shadow-md dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600'
//               }`}
//               onClick={() => {
//                 setDateFilter(dateFilter === 'last30' ? '' : 'last30');
//                 setCustomFrom('');
//                 setCustomTo('');
//               }}
//             >
//               <span className="hidden xs:inline">Last </span>30 Days
//             </button>

//             {/* Custom Range Button */}
//             <div className="relative">
//               <button
//                 className={`px-2 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all duration-200 flex items-center gap-1 ${
//                   dateFilter === 'custom'
//                     ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
//                     : 'bg-white/80 text-gray-700 border border-gray-300 hover:border-indigo-400 hover:shadow-md dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600'
//                 }`}
//                 onClick={() => {
//                   setShowCustomPicker(!showCustomPicker);
//                   if (!showCustomPicker) {
//                     setTempCustomFrom(customFrom);
//                     setTempCustomTo(customTo);
//                   }
//                 }}
//               >
//                 <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
//                 </svg>
//                 <span className="hidden sm:inline">Custom</span>
//                 <span className="sm:hidden">Range</span>
//               </button>

//               {/* Custom Date Picker - Responsive Modal */}
//               {showCustomPicker && (
//                 <>
//                   <div
//                     className="fixed inset-0 z-40 bg-black bg-opacity-25"
//                     onClick={() => setShowCustomPicker(false)}
//                   />

//                   <div
//   className="
//     fixed sm:absolute
//     inset-0 sm:inset-auto
//     sm:left-0 sm:top-full
//     flex sm:block
//     items-center justify-center
//     z-50
//   "
// >
//   {/* mobile background handled already by overlay */}

//   <div
//     className="
//       w-[92vw]
//       max-w-[420px]
//       mx-auto
//       sm:mx-0
//       bg-gradient-to-br from-white to-indigo-50
//       dark:from-gray-800 dark:to-gray-900
//       rounded-xl sm:rounded-2xl
//       border-2 border-indigo-200 dark:border-indigo-700
//       shadow-2xl
//       p-4
//       backdrop-blur-sm
//     "
//     onClick={(e) => e.stopPropagation()}
//   >

//                     {/* Header */}
//                     <div className="flex items-center justify-between mb-3 pb-2 border-b border-indigo-200 dark:border-indigo-700">
//                       <h3 className="text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
//                         <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
//                           <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
//                         </svg>
//                         Select Date Range
//                       </h3>
//                       <button
//                         onClick={() => setShowCustomPicker(false)}
//                         className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
//                       >
//                         <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
//                           <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
//                         </svg>
//                       </button>
//                     </div>

//                     <div className="flex flex-col gap-3" onClick={e => e.stopPropagation()}>
//                       {/* From Date */}
//                       <div>
//                         <label className="block text-[11px] sm:text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2 flex items-center gap-1">
//                           <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
//                           </svg>
//                           From Date
//                         </label>
//                         <input
//                           type="date"
//                           value={tempCustomFrom}
//                           onChange={e => setTempCustomFrom(e.target.value)}
//                           className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border-2 border-indigo-200 dark:border-indigo-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all shadow-sm hover:shadow-md"
//                         />
//                       </div>

//                       {/* To Date */}
//                       <div>
//                         <label className="block text-[11px] sm:text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2 flex items-center gap-1">
//                           <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
//                           </svg>
//                           To Date
//                         </label>
//                         <input
//                           type="date"
//                           value={tempCustomTo}
//                           onChange={e => setTempCustomTo(e.target.value)}
//                           className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border-2 border-indigo-200 dark:border-indigo-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all shadow-sm hover:shadow-md"
//                         />
//                       </div>

//                       {/* Action Buttons */}
//                       <div className="flex gap-2 pt-2">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             if (tempCustomFrom && tempCustomTo) {
//                               setCustomFrom(tempCustomFrom);
//                               setCustomTo(tempCustomTo);
//                               setDateFilter('custom');
//                               setShowCustomPicker(false);
//                             }
//                           }}
//                           disabled={!tempCustomFrom || !tempCustomTo}
//                           className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2"
//                         >
//                           <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
//                           </svg>
//                           Apply
//                         </button>

//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setCustomFrom('');
//                             setCustomTo('');
//                             setTempCustomFrom('');
//                             setTempCustomTo('');
//                             setDateFilter('');
//                             setShowCustomPicker(false);
//                           }}
//                           className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2"
//                         >
//                           <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
//                           </svg>
//                           Clear
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Mobile Status Filters */}
//           <div className="flex sm:hidden items-center gap-2 flex-wrap">
//             <button
//               className={`px-2 py-1 text-[11px] font-semibold rounded-full transition-all duration-200 ${
//                 activeFilters.includes(CANONICAL.completed)
//                   ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 scale-105'
//                   : 'bg-white/80 text-green-700 border border-green-300 hover:border-green-400 hover:shadow-md dark:bg-gray-700/50 dark:text-green-400 dark:border-green-700'
//               }`}
//               onClick={() => toggleFilter(CANONICAL.completed)}
//             >
//               ✓ Completed
//             </button>

//             <button
//               className={`px-2 py-1 text-[11px] font-semibold rounded-full transition-all duration-200 ${
//                 activeFilters.includes(CANONICAL.scrap)
//                   ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 scale-105'
//                   : 'bg-white/80 text-red-700 border border-red-300 hover:border-red-400 hover:shadow-md dark:bg-gray-700/50 dark:text-red-400 dark:border-red-700'
//               }`}
//               onClick={() => toggleFilter(CANONICAL.scrap)}
//             >
//               ✕ Scrap
//             </button>

//             <button
//               className={`px-2 py-1 text-[11px] font-semibold rounded-full transition-all duration-200 ${
//                 activeFilters.includes(CANONICAL.inprogress)
//                   ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-400/30 scale-105'
//                   : 'bg-white/80 text-cyan-700 border border-cyan-300 hover:border-cyan-400 hover:shadow-md dark:bg-gray-700/50 dark:text-cyan-400 dark:border-cyan-700'
//               }`}
//               onClick={() => toggleFilter(CANONICAL.inprogress)}
//             >
//               ⟳ In Progress
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Table - Responsive with horizontal scroll */}
//       <div className="overflow-x-auto overflow-y-auto h-[50vh] sm:h-[60vh] md:h-[65vh] lg:h-[60vh]">
//         <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//           <thead className="bg-gradient-to-r from-sky-400 to-purple-500 dark:from-purple-900 dark:to-indigo-900 sticky top-0 z-10">
//             <tr>
//               <th className="px-2 sm:px-3 py-2 text-left">
//                 {/* Checkbox column */}
//               </th>
//               <th onClick={() => handleSort('uid')} className="px-2 sm:px-4 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200">
//                 <div className="flex items-center space-x-1"><span>UID</span>{getSortIcon('uid')}</div>
//               </th>
//               <th onClick={() => handleSort('_productid')} className="px-2 sm:px-4 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200">
//                 <div className="flex items-center space-x-1"><span className="hidden sm:inline">Product ID</span><span className="sm:hidden">Prod ID</span>{getSortIcon('_productid')}</div>
//               </th>
//               <th onClick={() => handleSort('_model')} className="px-2 sm:px-4 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200">
//                 <div className="flex items-center space-x-1"><span>Model</span>{getSortIcon('_model')}</div>
//               </th>
//               <th onClick={() => handleSort('_variant')} className="px-2 sm:px-4 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200 hidden sm:table-cell">
//                 <div className="flex items-center space-x-1"><span>Variant</span>{getSortIcon('_variant')}</div>
//               </th>
//               <th onClick={() => handleSort('_startDate')} className="px-2 sm:px-4 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200">
//                 <div className="flex items-center space-x-1"><span className="hidden sm:inline">Start Date</span><span className="sm:hidden">Start</span>{getSortIcon('_startDate')}</div>
//               </th>
//               <th onClick={() => handleSort('_endDate')} className="px-2 sm:px-4 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200 hidden md:table-cell">
//                 <div className="flex items-center space-x-1"><span>End Date</span>{getSortIcon('_endDate')}</div>
//               </th>
//               <th onClick={() => handleSort('_status')} className="px-2 sm:px-4 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200">
//                 <div className="flex items-center space-x-1"><span>Status</span>{getSortIcon('_status')}</div>
//               </th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//             {pagedOrders.length === 0 && showNoDataMessage ? (
//               <tr>
//                 <td colSpan={8} className="text-center py-8 sm:py-16">
//                   <div className="flex flex-col items-center justify-center">
//                     <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full">
//                       <svg className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
//                       </svg>
//                     </div>
//                     <p className="text-base sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
//                       No matching records found
//                     </p>
//                     <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-4 text-center">
//                       The selected date range or filters returned no results (disappears in 3s)
//                     </p>
//                   </div>
//                 </td>
//               </tr>
//             ) : pagedOrders.length === 0 ? (
//               <tr>
//                 <td colSpan={8} className="text-center py-8 sm:py-16">
//                   <div className="flex flex-col items-center justify-center">
//                     <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-600 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
//                     </svg>
//                     <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No data available</p>
//                   </div>
//                 </td>
//               </tr>
//             ) : (
//               pagedOrders.map((order, idx) => {
//                 const realIdx = startIndex + idx
//                 const rowKey = getRowKey(order, order._idx ?? realIdx)

//                 return (
//                   <tr
//                     key={rowKey}
//                     className={`cursor-pointer transition-all duration-200 ${
//                       hoveredRow === rowKey ? 'bg-gradient-to-r from-blue-100 to-purple-200 dark:from-gray-700 dark:to-gray-700 shadow-sm' : 'hover:bg-gray-50 dark:bg-gray-800'
//                     } ${selectedOrders.includes(rowKey) ? 'bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900/50 dark:via-purple-900/50 dark:to-pink-900/50 shadow-md scale-[1.01] border-l-2 sm:border-l-4 border-indigo-500' : ''}`}
//                     onMouseEnter={() => setHoveredRow(rowKey)}
//                     onMouseLeave={() => setHoveredRow(null)}
//                     onClick={() => handleRowClick(order, order._idx ?? realIdx)}
//                   >
//                     <td className="px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap">
//                       <input
//                         type="checkbox"
//                         className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 border-gray-300 rounded dark:bg-gray-800 dark:text-gray-200"
//                         checked={selectedOrders.includes(rowKey)}
//                         onClick={(e) => e.stopPropagation()}
//                         onChange={() => handleRowClick(order, order._idx ?? realIdx)}
//                       />
//                     </td>

//                     <td className="px-2 sm:px-4 py-1.5 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-200">
//                       <span className="text-gray-900 dark:text-gray-200 text-[11px] sm:text-sm">
//                         {order._uid || order.uid}
//                       </span>
//                     </td>

//                     <td className="px-2 sm:px-4 py-1.5 sm:py-3 whitespace-nowrap text-[11px] sm:text-sm font-medium text-gray-900 dark:text-gray-200">{order._productid}</td>
//                     <td className="px-2 sm:px-4 py-1.5 sm:py-3 whitespace-nowrap text-[11px] sm:text-sm font-medium text-gray-900 dark:text-gray-200">{order._model}</td>
//                     <td className="px-2 sm:px-4 py-1.5 sm:py-3 whitespace-nowrap text-[11px] sm:text-sm font-medium text-gray-900 dark:text-gray-200 hidden sm:table-cell">{order._variant}</td>
//                     <td className="px-2 sm:px-4 py-1.5 sm:py-3 whitespace-nowrap text-[11px] sm:text-sm font-medium text-gray-900 dark:text-gray-200">{order._startDate}</td>
//                     <td className="px-2 sm:px-4 py-1.5 sm:py-3 whitespace-nowrap text-[11px] sm:text-sm font-medium text-gray-900 dark:text-gray-200 hidden md:table-cell">{order._endDate}</td>

//                     <td className="px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap">
//                       <span className={`px-2 sm:px-3 py-0.5 sm:py-1 inline-flex text-[10px] sm:text-xs leading-4 sm:leading-5 font-bold rounded-full shadow-sm ${getStatusClass(order._status)}`}>
//                         {order._status}
//                       </span>
//                     </td>
//                   </tr>
//                 )
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination - Responsive */}
//       <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:to-gray-700">
//         <div className="flex flex-col space-y-3">
//           {/* Results info and Export Button */}
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
//             <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
//               Showing <span className="font-medium">{total === 0 ? 0 : startIndex + 1}</span> to <span className="font-medium">{endIndex}</span> of <span className="font-medium">{total}</span> results
//             </div>

//             <button
//               onClick={handleExport}
//               className="px-4 sm:px-6 py-1.5 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-gray-50 via-white to-orange-50 text-gray-700 border sm:border-2 border-gray-300 hover:border-orange-300 hover:from-orange-50 hover:via-white hover:to-orange-100 shadow-md hover:shadow-lg hover:shadow-orange-200/50 hover:scale-105 transition-all duration-300 transform w-full sm:w-auto"
//             >
//               <span className="flex items-center justify-center gap-2">
//                 <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
//                 </svg>
//                 <span className="bg-gradient-to-r from-gray-700 to-orange-600 bg-clip-text text-transparent">
//                   Export ({filteredOrders.length})
//                 </span>
//               </span>
//             </button>
//           </div>

//           {/* Pagination controls */}
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
//             {/* Page size selector - hide on mobile */}
//             <div className="hidden sm:flex items-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
//               <label>Rows</label>
//               <select
//                 value={pageSize}
//                 onChange={(e) => {
//                   const val = Number(e.target.value) || initialPageSize
//                   setPageSize(val)
//                   setPage(1)
//                 }}
//                 className="rounded-lg border sm:border-2 border-indigo-200 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-base font-medium focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:bg-gray-800 dark:text-gray-200 dark:border-indigo-700 transition-all duration-200"
//               >
//                 <option value={10}>10</option>
//                 <option value={25}>25</option>
//                 <option value={50}>50</option>
//                 <option value={100}>100</option>
//                 <option value={1000}>1000</option>
//               </select>
//             </div>

//             {/* Navigation buttons */}
//             <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
//               <button
//                 onClick={goPrevious}
//                 disabled={page <= 1}
//                 className="flex-1 sm:flex-initial px-3 sm:px-5 py-1.5 sm:py-2.5 border sm:border-2 border-indigo-300 text-xs sm:text-sm font-semibold rounded-lg text-indigo-700 bg-white hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:bg-gray-800 dark:text-indigo-400 dark:border-indigo-700 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
//               >
//                 Previous
//               </button>

//               <div className="px-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
//                 Page <span className="font-medium">{page}</span> / <span className="font-medium">{totalPages}</span>
//               </div>

//               <button
//                 onClick={goNext}
//                 disabled={page >= totalPages}
//                 className="flex-1 sm:flex-initial px-3 sm:px-5 py-1.5 sm:py-2.5 border sm:border-2 border-indigo-300 text-xs sm:text-sm font-semibold rounded-lg text-indigo-700 bg-white hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:bg-gray-800 dark:text-indigo-400 dark:border-indigo-700 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// src/components/OrderTable.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Calendar, Clock, FileText, Package } from "lucide-react";

export function OrderTable({
  orders = [],
  onViewDetails,
  onVisibleChange,
  initialPageSize = 1000,
  onSelectionChange,
  loading = false,
}) {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [sortField, setSortField] = useState("uid");
  const [sortDirection, setSortDirection] = useState("asc");
  const [activeFilters, setActiveFilters] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [dateFilter, setDateFilter] = useState("");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [tempCustomFrom, setTempCustomFrom] = useState("");
  const [tempCustomTo, setTempCustomTo] = useState("");
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Production line lookup
  const [lineMap, setLineMap] = useState({});

  useEffect(() => {
    let cancelled = false;
    const BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
    (async () => {
      try {
        const r = await fetch(`${BASE}/api/trace/productionlines`);
        if (!r.ok) {
          const text = await r.text();
          console.error(
            `Failed to load /trace/productionlines: Server returned status ${r.status}`,
            text,
          );
          setLineMap({});
          return;
        }
        const j = await r.json();
        if (cancelled) return;
        const map = Object.fromEntries(
          (j?.data || []).map((x) => [
            String(x.productid).trim().toUpperCase(),
            x.productionlinename,
          ]),
        );
        setLineMap(map);
      } catch (e) {
        console.error("Failed to load /trace/productionlines", e);
        setLineMap({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Canonical status labels
  const CANONICAL = {
    completed: "Completed",
    scrap: "Scrap",
    inprogress: "In Progress",
    failed: "Failed",
    unknown: "Unknown",
  };

  // Stable row key
  const getRowKey = (order, idx) => {
    const id = order.id ?? order.ID;
    if (id !== undefined && id !== null && String(id).trim() !== "")
      return String(id);
    const uid = (order.uid || order.UID || order._uid || "").trim();
    if (uid) return uid;
    return `row-${idx}`;
  };

  // Normalizers
  const normalizeProductId = (order) =>
    order.productid ||
    order.productId ||
    order.PRODUCTID ||
    (order.__raw &&
      (order.__raw.productid ||
        order.__raw.productId ||
        order.__raw.PRODUCTID)) ||
    "";

  const normalizeStatus = (order) => {
    const raw =
      (order._status && String(order._status)) ||
      (order.status && String(order.status)) ||
      (order.productstatus && String(order.productstatus)) ||
      (order.__raw && (order.__raw.status || order.__raw.productstatus)) ||
      "";
    const s = (raw || "").trim().toLowerCase();
    if (!s) return CANONICAL.unknown;
    if (/\b(in[\s_-]*progress)\b/.test(s)) return CANONICAL.inprogress;
    if (/\b(pass|completed?|complete)\b/.test(s)) return CANONICAL.completed;
    if (/\b(scrap|scrapped)\b/.test(s)) return CANONICAL.scrap;
    if (/\b(fail|failed)\b/.test(s)) return CANONICAL.failed;
    return s
      .split(/[_\s-]+/)
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
      .join(" ");
  };

  const normalizeModel = (order) =>
    order.productmodelname ||
    order.model ||
    (order.__raw && (order.__raw.productmodelname || order.__raw.model)) ||
    "";

  const normalizeVariant = (order) =>
    order.productvariant ||
    order.variant ||
    (order.__raw && (order.__raw.productvariant || order.__raw.variant)) ||
    "";

  const normalizeStartDate = (order) =>
    order.productionstartdate ||
    order.startDate ||
    order.start_date ||
    (order.__raw &&
      (order.__raw.productionstartdate ||
        order.__raw.startDate ||
        order.__raw.start_date)) ||
    "";

  const normalizeEndDate = (order) =>
    order.productionenddate ||
    order.endDate ||
    order.end_date ||
    (order.__raw &&
      (order.__raw.productionenddate ||
        order.__raw.endDate ||
        order.__raw.end_date)) ||
    "";

  // Map productid -> productionlinename
  const normalizeLine = (order) => {
    const pid = (normalizeProductId(order) || "").trim().toUpperCase();
    if (!pid) return "";
    return lineMap[pid] || order.line || "";
  };

  // Deduplicate by UID
  const dedupedOrders = useMemo(() => {
    const map = new Map();
    for (const o of orders || []) {
      const key = (o.uid || o.UID || "").trim();
      if (!key) continue;
      map.set(key, o);
    }
    return Array.from(map.values());
  }, [orders]);

  // Enrich rows
  const enrichedOrders = useMemo(() => {
    return (dedupedOrders || []).map((o, idx) => ({
      ...o,
      _productid: normalizeProductId(o),
      _line: normalizeLine(o),
      _status: normalizeStatus(o),
      _uid: o.uid || o.UID || (o.__raw && (o.__raw.uid || o.__raw.UID)) || "",
      _idx: idx,
      _model: normalizeModel(o),
      _variant: normalizeVariant(o),
      _startDate: normalizeStartDate(o),
      _endDate: normalizeEndDate(o),
    }));
  }, [dedupedOrders, lineMap]);

  // Sorting
  const sortedOrders = useMemo(() => {
    const arr = [...enrichedOrders];
    arr.sort((a, b) => {
      const aValue = (a[sortField] ?? a[`_${sortField}`] ?? "") || "";
      const bValue = (b[sortField] ?? b[`_${sortField}`] ?? "") || "";
      const aNum = parseFloat(aValue);
      const bNum = parseFloat(bValue);
      let cmp = 0;
      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
        cmp = aNum < bNum ? -1 : aNum > bNum ? 1 : 0;
      } else {
        const as = String(aValue).toLowerCase();
        const bs = String(bValue).toLowerCase();
        cmp = as < bs ? -1 : as > bs ? 1 : 0;
      }
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [enrichedOrders, sortField, sortDirection]);

  const handleSort = (field) => {
    setSortField((prevField) => {
      if (prevField === field) {
        setSortDirection((prevDir) => (prevDir === "asc" ? "desc" : "asc"));
        return prevField;
      } else {
        setSortDirection("asc");
        return field;
      }
    });
  };

  // Filters
  const toggleFilter = (filterCanonical) => {
    setPage(1);
    setSelectedOrders((prev) => prev);
    setActiveFilters((prev) =>
      prev.includes(filterCanonical)
        ? prev.filter((f) => f !== filterCanonical)
        : [...prev, filterCanonical],
    );
  };

  // Helper to parse date string
  const parseDate = (str) => {
    if (!str) return null;
    return new Date(str.length > 10 ? str : str + "T00:00:00");
  };

  // Date filter logic
  const filterByDate = (orders) => {
    if (!dateFilter) return orders;
    const today = new Date();
    let from, to;

    if (dateFilter === "today") {
      from = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      to = new Date(from);
      to.setDate(to.getDate() + 1);
    } else if (dateFilter === "yesterday") {
      from = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 1,
      );
      to = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    } else if (dateFilter === "last7") {
      from = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 6,
      );
      to = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    } else if (dateFilter === "last30") {
      from = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 29,
      );
      to = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    } else if (dateFilter === "custom" && customFrom && customTo) {
      from = parseDate(customFrom);
      to = parseDate(customTo);
      if (to) to.setDate(to.getDate() + 1);
    } else {
      return orders;
    }

    return orders.filter((order) => {
      const start = parseDate(order._startDate);
      if (!start) return false;
      return start >= from && start < to;
    });
  };

  const filteredOrders = useMemo(() => {
    let result = sortedOrders;
    if (activeFilters.length > 0) {
      result = result.filter((order) => activeFilters.includes(order._status));
    }
    result = filterByDate(result);

    if (result.length === 0 && (dateFilter || activeFilters.length > 0)) {
      setShowNoDataMessage(true);
      setTimeout(() => {
        setShowNoDataMessage(false);
      }, 3000);
    }

    return result;
  }, [sortedOrders, activeFilters, dateFilter, customFrom, customTo]);

  // Pagination
  const total = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    setPage((p) => {
      if (p > totalPages) return totalPages;
      if (p < 1) return 1;
      return p;
    });
  }, [totalPages]);

  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  const pagedOrders = useMemo(() => {
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, startIndex, endIndex]);

  // Selection cleanup
  useEffect(() => {
    if (!pagedOrders?.length) return;

    setSelectedOrders((prev) => {
      const visibleKeys = pagedOrders.map((r, i) =>
        getRowKey(r, r._idx ?? startIndex + i),
      );
      const filtered = prev.filter((k) => visibleKeys.includes(k));
      return filtered.length === prev.length ? prev : filtered;
    });
  }, [pagedOrders]);

  // Visible change notification
  useEffect(() => {
    if (typeof onVisibleChange === "function" && pagedOrders.length > 0) {
      onVisibleChange(pagedOrders);
    }
  }, [pagedOrders.length]);

  // Notify parent when selection changes
  useEffect(() => {
    if (typeof onSelectionChange === "function") {
      const selectedDetails = selectedOrders
        .map((key) =>
          enrichedOrders.find((o) => getRowKey(o, o._idx ?? 0) === key),
        )
        .filter(Boolean)
        .map((o) => ({ ...o, line: o._line }));
      onSelectionChange(selectedDetails);
    }
  }, [selectedOrders, enrichedOrders, lineMap]);

  useEffect(() => {
    setPage(1);
  }, [dateFilter, customFrom, customTo]);

  const goPrevious = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  // Single-select toggle
  const handleRowClick = (order, idx) => {
    const key = getRowKey(order, idx);
    setSelectedOrders((prev) => (prev.includes(key) ? [] : [key]));
  };

  const toggleSelectAllOnPage = () => {
    const visibleKeys = pagedOrders.map((r, i) =>
      getRowKey(r, r._idx ?? startIndex + i),
    );
    const allSelected = visibleKeys.every((k) => selectedOrders.includes(k));
    if (allSelected) {
      setSelectedOrders((prev) => prev.filter((k) => !visibleKeys.includes(k)));
    } else {
      setSelectedOrders((prev) => [
        ...prev,
        ...visibleKeys.filter((k) => !prev.includes(k)),
      ]);
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 opacity-0 group-hover:opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }
    return sortDirection === "asc" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  const getStatusClass = (status) => {
    const s = (status || "").toString().toLowerCase();
    switch (s) {
      case "completed":
        return "bg-green-600 text-white border border-green-200 hover:shadow-md hover:shadow-green-400/40 transition-all duration-300 dark:bg-green-600 dark:text-white dark:border-green-400 dark:hover:shadow-white/40";

      case "in progress":
      case "inprogress":
        return "bg-blue-600 text-white border border-blue-200 hover:shadow-md hover:shadow-blue-400/40 transition-all duration-300 dark:bg-blue-600 dark:text-white dark:border-blue-400 dark:hover:shadow-white/40";

      case "scrap":
        return "bg-red-600 text-white border border-red-200 hover:shadow-md hover:shadow-red-400/40 transition-all duration-300 dark:bg-red-600 dark:text-white dark:border-red-400 dark:hover:shadow-white/40";

      case "failed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const handleExport = () => {
    try {
      const exportData = filteredOrders.map((order) => ({
        UID: order._uid || order.uid || "",
        "Product ID": order._productid || "",
        Model: order._model || "",
        Variant: order._variant || "",
        "Start Date": order._startDate || "",
        "End Date": order._endDate || "",
        Status: order._status || "",
        Line: order._line || "",
      }));

      if (exportData.length === 0) {
        alert("No data to export");
        return;
      }

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Production Records");

      const fileName = `production_records_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      console.log(`Exported ${exportData.length} records to ${fileName}`);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow-lg sm:shadow-xl rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 hover:shadow-xl sm:hover:shadow-2xl">
      <div className="p-2 sm:p-3 md:p-4 lg:px-6 lg:py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
        {/* Responsive Header Layout */}
        <div className="flex flex-col space-y-2 sm:space-y-3">
          {/* Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <h2 className="text-base sm:text-lg md:text-xl lg:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Production Records
            </h2>

            {/* Status Filters - Desktop/Tablet */}
            <div className="hidden sm:flex items-center gap-2 flex-wrap">
              <button
                className={`px-2 md:px-3 py-1 text-[10px] md:text-xs font-semibold rounded-full transition-all duration-200 ${
                  activeFilters.includes(CANONICAL.completed)
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/30 scale-105"
                    : "bg-white/80 text-green-700 border border-green-300 hover:border-green-400 hover:shadow-md dark:bg-gray-700/50 dark:text-green-400 dark:border-green-700"
                }`}
                onClick={() => toggleFilter(CANONICAL.completed)}
              >
                ✓ Completed
              </button>

              <button
                className={`px-2 md:px-3 py-1 text-[10px] md:text-xs font-semibold rounded-full transition-all duration-200 ${
                  activeFilters.includes(CANONICAL.scrap)
                    ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md shadow-red-500/30 scale-105"
                    : "bg-white/80 text-red-700 border border-red-300 hover:border-red-400 hover:shadow-md dark:bg-gray-700/50 dark:text-red-400 dark:border-red-700"
                }`}
                onClick={() => toggleFilter(CANONICAL.scrap)}
              >
                ✕ Scrap
              </button>

              <button
                className={`px-2 md:px-3 py-1 text-[10px] md:text-xs font-semibold rounded-full transition-all duration-200 ${
                  activeFilters.includes(CANONICAL.inprogress)
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-md shadow-cyan-400/30 scale-105"
                    : "bg-white/80 text-cyan-700 border border-cyan-300 hover:border-cyan-400 hover:shadow-md dark:bg-gray-700/50 dark:text-cyan-400 dark:border-cyan-700"
                }`}
                onClick={() => toggleFilter(CANONICAL.inprogress)}
              >
                ⟳ In Progress
              </button>
            </div>
          </div>

          {/* Date Filters Row */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
            <button
              className={`px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] md:text-xs font-semibold transition-all duration-200 ${
                dateFilter === "today"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-105"
                  : "bg-white/80 text-gray-700 border border-gray-300 hover:border-indigo-400 hover:shadow-md dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600"
              }`}
              onClick={() => {
                setDateFilter(dateFilter === "today" ? "" : "today");
                setCustomFrom("");
                setCustomTo("");
              }}
            >
              Today
            </button>

            <button
              className={`px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] md:text-xs font-semibold transition-all duration-200 ${
                dateFilter === "last7"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-105"
                  : "bg-white/80 text-gray-700 border border-gray-300 hover:border-indigo-400 hover:shadow-md dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600"
              }`}
              onClick={() => {
                setDateFilter(dateFilter === "last7" ? "" : "last7");
                setCustomFrom("");
                setCustomTo("");
              }}
            >
              <span className="hidden min-[400px]:inline">Last </span>7 Days
            </button>

            <button
              className={`px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] md:text-xs font-semibold transition-all duration-200 ${
                dateFilter === "last30"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-105"
                  : "bg-white/80 text-gray-700 border border-gray-300 hover:border-indigo-400 hover:shadow-md dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600"
              }`}
              onClick={() => {
                setDateFilter(dateFilter === "last30" ? "" : "last30");
                setCustomFrom("");
                setCustomTo("");
              }}
            >
              <span className="hidden min-[400px]:inline">Last </span>30 Days
            </button>

            {/* Custom Range Button */}
            <div className="relative">
              <button
                className={`px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] md:text-xs font-semibold transition-all duration-200 flex items-center gap-0.5 sm:gap-1 ${
                  dateFilter === "custom"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-105"
                    : "bg-white/80 text-gray-700 border border-gray-300 hover:border-indigo-400 hover:shadow-md dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600"
                }`}
                onClick={() => {
                  setShowCustomPicker(!showCustomPicker);
                  if (!showCustomPicker) {
                    setTempCustomFrom(customFrom);
                    setTempCustomTo(customTo);
                  }
                }}
              >
                <svg
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden sm:inline">Custom</span>
                <span className="sm:hidden">Range</span>
              </button>

              {/* Custom Date Picker - Responsive Modal */}
              {showCustomPicker && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-25"
                    onClick={() => setShowCustomPicker(false)}
                  />

                  <div className="fixed sm:absolute inset-0 sm:inset-auto sm:left-0 sm:top-full flex sm:block items-center justify-center z-50 p-4 sm:p-0">
                    <div
                      className="w-full max-w-[320px] sm:max-w-[420px] mx-auto sm:mx-0 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl sm:rounded-2xl border-2 border-indigo-200 dark:border-indigo-700 shadow-2xl p-3 sm:p-4 backdrop-blur-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-2 sm:mb-3 pb-2 border-b border-indigo-200 dark:border-indigo-700">
                        <h3 className="text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent flex items-center gap-1.5 sm:gap-2">
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Select Date Range
                        </h3>
                        <button
                          onClick={() => setShowCustomPicker(false)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <svg
                            className="w-3.5 h-3.5 sm:w-5 sm:h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="flex flex-col gap-2 sm:gap-3">
                        {/* From Date */}
                        <div>
                          <label className="block text-[10px] sm:text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-0.5 sm:gap-1">
                            <svg
                              className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-blue-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            From Date
                          </label>
                          <input
                            type="date"
                            value={tempCustomFrom}
                            onChange={(e) => setTempCustomFrom(e.target.value)}
                            className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border-2 border-indigo-200 dark:border-indigo-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all shadow-sm hover:shadow-md"
                          />
                        </div>

                        {/* To Date */}
                        <div>
                          <label className="block text-[10px] sm:text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-0.5 sm:gap-1">
                            <svg
                              className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-purple-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            To Date
                          </label>
                          <input
                            type="date"
                            value={tempCustomTo}
                            onChange={(e) => setTempCustomTo(e.target.value)}
                            className="w-full px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm border-2 border-indigo-200 dark:border-indigo-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all shadow-sm hover:shadow-md"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-1 sm:pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (tempCustomFrom && tempCustomTo) {
                                setCustomFrom(tempCustomFrom);
                                setCustomTo(tempCustomTo);
                                setDateFilter("custom");
                                setShowCustomPicker(false);
                              }
                            }}
                            disabled={!tempCustomFrom || !tempCustomTo}
                            className="flex-1 px-2.5 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[10px] sm:text-sm font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-1"
                          >
                            <svg
                              className="w-3 h-3 sm:w-4 sm:h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Apply
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCustomFrom("");
                              setCustomTo("");
                              setTempCustomFrom("");
                              setTempCustomTo("");
                              setDateFilter("");
                              setShowCustomPicker(false);
                            }}
                            className="flex-1 px-2.5 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 text-[10px] sm:text-sm font-bold rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-1"
                          >
                            <svg
                              className="w-3 h-3 sm:w-4 sm:h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Status Filters */}
          <div className="flex sm:hidden items-center gap-1.5 flex-wrap">
            <button
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-full transition-all duration-200 ${
                activeFilters.includes(CANONICAL.completed)
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/30 scale-105"
                  : "bg-white/80 text-green-700 border border-green-300 dark:bg-gray-700/50 dark:text-green-400 dark:border-green-700"
              }`}
              onClick={() => toggleFilter(CANONICAL.completed)}
            >
              ✓ Completed
            </button>

            <button
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-full transition-all duration-200 ${
                activeFilters.includes(CANONICAL.scrap)
                  ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md shadow-red-500/30 scale-105"
                  : "bg-white/80 text-red-700 border border-red-300 dark:bg-gray-700/50 dark:text-red-400 dark:border-red-700"
              }`}
              onClick={() => toggleFilter(CANONICAL.scrap)}
            >
              ✕ Scrap
            </button>

            <button
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-full transition-all duration-200 ${
                activeFilters.includes(CANONICAL.inprogress)
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-md shadow-cyan-400/30 scale-105"
                  : "bg-white/80 text-cyan-700 border border-cyan-300 dark:bg-gray-700/50 dark:text-cyan-400 dark:border-cyan-700"
              }`}
              onClick={() => toggleFilter(CANONICAL.inprogress)}
            >
              ⟳ Progress
            </button>
          </div>
        </div>
      </div>

      {/* Table - Responsive with horizontal scroll */}
      <div className="overflow-x-auto overflow-y-auto h-[45vh] sm:h-[55vh] md:h-[60vh] lg:h-[60vh]">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gradient-to-r from-sky-400 to-purple-500 dark:from-purple-900 dark:to-indigo-900 sticky top-0 z-10">
            <tr>
              <th className="px-1 sm:px-2 md:px-3 py-1.5 sm:py-2 text-left">
                {/* Checkbox column */}
              </th>
              <th
                onClick={() => handleSort("uid")}
                className="px-1.5 sm:px-3 md:px-4 py-1.5 sm:py-3 md:py-4 text-left text-[9px] sm:text-[10px] md:text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200"
              >
                <div className="flex items-center space-x-0.5 sm:space-x-1">
                  <span>UID</span>
                  {getSortIcon("uid")}
                </div>
              </th>
              <th
                onClick={() => handleSort("_productid")}
                className="px-1.5 sm:px-3 md:px-4 py-1.5 sm:py-3 md:py-4 text-left text-[9px] sm:text-[10px] md:text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200"
              >
                <div className="flex items-center space-x-0.5 sm:space-x-1">
                  <span className="hidden sm:inline">Product ID</span>
                  <span className="sm:hidden">PID</span>
                  {getSortIcon("_productid")}
                </div>
              </th>
              <th
                onClick={() => handleSort("_model")}
                className="px-1.5 sm:px-3 md:px-4 py-1.5 sm:py-3 md:py-4 text-left text-[9px] sm:text-[10px] md:text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200"
              >
                <div className="flex items-center space-x-0.5 sm:space-x-1">
                  <span>Model</span>
                  {getSortIcon("_model")}
                </div>
              </th>
              <th
                onClick={() => handleSort("_variant")}
                className="px-1.5 sm:px-3 md:px-4 py-1.5 sm:py-3 md:py-4 text-left text-[9px] sm:text-[10px] md:text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200 hidden min-[480px]:table-cell"
              >
                <div className="flex items-center space-x-0.5 sm:space-x-1">
                  <span>Variant</span>
                  {getSortIcon("_variant")}
                </div>
              </th>
              <th
                onClick={() => handleSort("_startDate")}
                className="px-1.5 sm:px-3 md:px-4 py-1.5 sm:py-3 md:py-4 text-left text-[9px] sm:text-[10px] md:text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200"
              >
                <div className="flex items-center space-x-0.5 sm:space-x-1">
                  <span className="hidden sm:inline">Start Date</span>
                  <span className="sm:hidden">Start</span>
                  {getSortIcon("_startDate")}
                </div>
              </th>
              <th
                onClick={() => handleSort("_endDate")}
                className="px-1.5 sm:px-3 md:px-4 py-1.5 sm:py-3 md:py-4 text-left text-[9px] sm:text-[10px] md:text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200 hidden md:table-cell"
              >
                <div className="flex items-center space-x-0.5 sm:space-x-1">
                  <span>End Date</span>
                  {getSortIcon("_endDate")}
                </div>
              </th>
              <th
                onClick={() => handleSort("_status")}
                className="px-1.5 sm:px-3 md:px-4 py-1.5 sm:py-3 md:py-4 text-left text-[9px] sm:text-[10px] md:text-xs font-semibold text-white uppercase tracking-wider cursor-pointer group hover:bg-white/10 transition-colors duration-200"
              >
                <div className="flex items-center space-x-0.5 sm:space-x-1">
                  <span>Status</span>
                  {getSortIcon("_status")}
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {pagedOrders.length === 0 && showNoDataMessage ? (
              <tr>
                <td colSpan={8} className="text-center py-6 sm:py-12 md:py-16">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-2 sm:mb-4 p-2 sm:p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full">
                      <svg
                        className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-yellow-600 dark:text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-sm sm:text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      No matching records found
                    </p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400 px-4 text-center">
                      The selected date range or filters returned no results
                      (disappears in 3s)
                    </p>
                  </div>
                </td>
              </tr>
            ) : pagedOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 sm:py-12 md:py-16">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-400 dark:text-gray-600 mb-2 sm:mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400">
                      No data available
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              pagedOrders.map((order, idx) => {
                const realIdx = startIndex + idx;
                const rowKey = getRowKey(order, order._idx ?? realIdx);

                return (
                  <tr
                    key={rowKey}
                    className={`cursor-pointer transition-all duration-200 ${
                      hoveredRow === rowKey
                        ? "bg-gradient-to-r from-blue-100 to-purple-200 dark:from-gray-700 dark:to-gray-700 shadow-sm"
                        : "hover:bg-gray-50 dark:bg-gray-800"
                    } ${selectedOrders.includes(rowKey) ? "bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900/50 dark:via-purple-900/50 dark:to-pink-900/50 shadow-md scale-[1.005] sm:scale-[1.01] border-l-2 sm:border-l-4 border-indigo-500" : ""}`}
                    onMouseEnter={() => setHoveredRow(rowKey)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => handleRowClick(order, order._idx ?? realIdx)}
                  >
                    <td className="px-1 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-indigo-600 border-gray-300 rounded dark:bg-gray-800 dark:text-gray-200"
                        checked={selectedOrders.includes(rowKey)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() =>
                          handleRowClick(order, order._idx ?? realIdx)
                        }
                      />
                    </td>

                    <td className="px-1.5 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 whitespace-nowrap text-[10px] sm:text-xs md:text-sm font-medium text-gray-900 dark:text-gray-200">
                      {order._uid || order.uid}
                    </td>

                    <td className="px-1.5 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 whitespace-nowrap text-[10px] sm:text-xs md:text-sm font-medium text-gray-900 dark:text-gray-200">
                      {order._productid}
                    </td>
                    <td className="px-1.5 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 whitespace-nowrap text-[10px] sm:text-xs md:text-sm font-medium text-gray-900 dark:text-gray-200">
                      {order._model}
                    </td>
                    <td className="px-1.5 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 whitespace-nowrap text-[10px] sm:text-xs md:text-sm font-medium text-gray-900 dark:text-gray-200 hidden min-[480px]:table-cell">
                      {order._variant}
                    </td>
                    <td className="px-1.5 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 whitespace-nowrap text-[10px] sm:text-xs md:text-sm font-medium text-gray-900 dark:text-gray-200">
                      {order._startDate}
                    </td>
                    <td className="px-1.5 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 whitespace-nowrap text-[10px] sm:text-xs md:text-sm font-medium text-gray-900 dark:text-gray-200 hidden md:table-cell">
                      {order._endDate}
                    </td>

                    <td className="px-1 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 whitespace-nowrap">
                      <span
                        className={`px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 inline-flex text-[9px] sm:text-[10px] md:text-xs leading-3 sm:leading-4 md:leading-5 font-bold rounded-full shadow-sm ${getStatusClass(order._status)}`}
                      >
                        {order._status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Responsive */}
      <div className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:to-gray-700">
        <div className="flex flex-col space-y-2 sm:space-y-3">
          {/* Results info and Export Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="text-[10px] sm:text-xs md:text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
              Showing{" "}
              <span className="font-medium">
                {total === 0 ? 0 : startIndex + 1}
              </span>{" "}
              to <span className="font-medium">{endIndex}</span> of{" "}
              <span className="font-medium">{total}</span> results
            </div>

            <button
              onClick={handleExport}
              className="px-3 sm:px-5 md:px-6 py-1 sm:py-2 md:py-2.5 text-[10px] sm:text-xs md:text-sm font-semibold rounded-lg bg-gradient-to-r from-gray-50 via-white to-orange-50 text-gray-700 border border-gray-300 hover:border-orange-300 hover:from-orange-50 hover:via-white hover:to-orange-100 shadow-md hover:shadow-lg hover:shadow-orange-200/50 hover:scale-105 transition-all duration-300 transform w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="bg-gradient-to-r from-gray-700 to-orange-600 bg-clip-text text-transparent">
                  Export ({filteredOrders.length})
                </span>
              </span>
            </button>
          </div>

          {/* Pagination controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
            {/* Page size selector - hide on mobile */}
            <div className="hidden sm:flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-300">
              <label>Rows</label>
              <select
                value={pageSize}
                onChange={(e) => {
                  const val = Number(e.target.value) || initialPageSize;
                  setPageSize(val);
                  setPage(1);
                }}
                className="rounded-md sm:rounded-lg border border-indigo-200 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 text-[10px] sm:text-xs md:text-base font-medium focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:bg-gray-800 dark:text-gray-200 dark:border-indigo-700 transition-all duration-200"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={1000}>1000</option>
              </select>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 w-full sm:w-auto">
              <button
                onClick={goPrevious}
                disabled={page <= 1}
                className="flex-1 sm:flex-initial px-2 sm:px-4 md:px-5 py-1 sm:py-2 md:py-2.5 border border-indigo-300 text-[10px] sm:text-xs md:text-sm font-semibold rounded-md sm:rounded-lg text-indigo-700 bg-white hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:bg-gray-800 dark:text-indigo-400 dark:border-indigo-700 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
              >
                Previous
              </button>

              <div className="px-1.5 sm:px-2 text-[10px] sm:text-xs md:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Page <span className="font-medium">{page}</span> /{" "}
                <span className="font-medium">{totalPages}</span>
              </div>

              <button
                onClick={goNext}
                disabled={page >= totalPages}
                className="flex-1 sm:flex-initial px-2 sm:px-4 md:px-5 py-1 sm:py-2 md:py-2.5 border border-indigo-300 text-[10px] sm:text-xs md:text-sm font-semibold rounded-md sm:rounded-lg text-indigo-700 bg-white hover:bg-indigo-50 hover:border-indigo-400 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:bg-gray-800 dark:text-indigo-400 dark:border-indigo-700 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
