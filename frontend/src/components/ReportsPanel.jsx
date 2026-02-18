// // src/components/ReportsPanel.jsx
// import React, { useState, useEffect } from 'react'
// import { BarChart3, Calendar, Clock, FileText, Zap, Package, CheckCircle, AlertCircle } from 'lucide-react'

// export function ReportsPanel({ selectedOrder, apiBase = '', clearSelectedOrder = () => {} }) {
//   const [fromDate, setFromDate] = useState('2023-09-19')
//   const [fromTime, setFromTime] = useState('00:00:00')
//   const [toDate, setToDate] = useState('2023-09-19')
//   const [toTime, setToTime] = useState('23:59:59')
//   const [includeDate, setIncludeDate] = useState(true)
//   const [reportType, setReportType] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [eolData, setEolData] = useState({})

//   const [eolUid, setEolUid] = useState('')
//   const [eolLoading, setEolLoading] = useState(false)
//   const [eolError, setEolError] = useState('')

//   const handleApply = () => {
//     setIsLoading(true)
//     setTimeout(() => setIsLoading(false), 1500)
//   }

//   const handleClear = () => {
//     setFromDate('2023-09-19')
//     setFromTime('00:00:00')
//     setToDate('2023-09-19')
//     setToTime('23:59:59')
//     setIncludeDate(true)
//     setReportType('')
//     setEolUid('')
//     setEolError('')
//     setEolData({})
//     clearSelectedOrder()
//   }

//   const handleQuickSelect = (days) => {
//     const today = new Date()
//     const pastDate = new Date()
//     pastDate.setDate(today.getDate() - days)
//     const formatDate = (d) => d.toISOString().split('T')[0]
//     setFromDate(formatDate(pastDate))
//     setToDate(formatDate(today))
//   }

//   // ✅ Robustly fetch End of Line UID using /trace/endoflineuid/:uid
//   useEffect(() => {
//     const uid = selectedOrder?._uid || selectedOrder?.uid || ''
//     if (!uid) {
//       setEolUid('')
//       setEolError('')
//       setEolData({})
//       return
//     }

//     const fromOrder =
//       selectedOrder?.endoflineuid ||
//       selectedOrder?.endOfLineUid ||
//       selectedOrder?.eoluid || ''

//     if (fromOrder) {
//       setEolUid(fromOrder)
//       setEolData({})
//       setEolError('')
//       return
//     }

//     const controller = new AbortController()
//     const signal = controller.signal
//     const base = (apiBase || '').replace(/\/$/, '')
//     const url = `${base}/api/trace/endoflineuid/${encodeURIComponent(uid)}`

//     setEolLoading(true)
//     setEolError('')
//     setEolData({})

//     fetch(url, { signal })
//       .then(async (res) => {
//         if (!res.ok) throw new Error(`HTTP ${res.status}`)
//         const data = await res.json()
//         const row = data?.data || {}
//         setEolUid(row?.endoflineuid || '')
//         setEolData(row)
//       })
//       .catch((err) => {
//         if (err.name === 'AbortError') {
//           console.warn('EOL UID fetch aborted')
//           return
//         }

//         console.error('EOL UID fetch error:', err)
//         setEolUid('')
//         setEolError(err.message || 'Failed to fetch EOL UID')
//       })
//       .finally(() => setEolLoading(false))

//     return () => controller.abort()
//   // }, [
//   //   apiBase,
//   //   selectedOrder?._uid,
//   //   selectedOrder?.uid,
//   //   selectedOrder?.endoflineuid,
//   // ])

//   }, [apiBase, selectedOrder])

//   const getStatusColor = (status) => {
//     const s = (status || '').toLowerCase()
//     if (s.includes('pass') || s.includes('success') || s.includes('complete')) {
//       return 'from-green-400 to-emerald-600'
//     }
//     if (s.includes('pending') || s.includes('progress')) {
//       return 'from-yellow-400 to-orange-600'
//     }
//     if (s.includes('fail') || s.includes('error')) {
//       return 'from-red-400 to-rose-600'
//     }
//     return 'from-gray-400 to-gray-600'
//   }

//   return (
//     <div className="relative bg-gradient-to-br from-sky-50 via-purple-50 to-sky-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 shadow-2xl rounded-2xl p-4 border border-sky-200/50 dark:border-purple-500/20 overflow-hidden transition-colors duration-200">
//       {/* Decorative background blobs */}
//       <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
//       <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-300/20 dark:bg-sky-500/10 rounded-full blur-3xl -z-10"></div>
//       <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-300/10 dark:bg-pink-500/5 rounded-full blur-3xl -z-10"></div>

//       {/* Header */}
//       {/* <div className="flex items-center gap-3 mb-4">
//         <div className="p-3 bg-gradient-to-br from-sky-400 to-purple-600 rounded-xl shadow-lg">
//           <BarChart3 className="w-6 h-6 text-white" />
//         </div>
//         <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
//           Reports Panel
//         </h2>
//       </div> */}

//       {/* Quick date selectors */}
//       {/* <div className="flex flex-wrap gap-2 mb-4">
//         {[
//           { label: 'Today', days: 0, icon: Calendar },
//           { label: 'Yesterday', days: 1, icon: Clock },
//           { label: 'Last 7 days', days: 7, icon: FileText },
//           { label: 'Last 30 days', days: 30, icon: Package }
//         ].map(({ label, days, icon: Icon }) => (
//           <button
//             key={label}
//             onClick={() => handleQuickSelect(days)}
//             className="group px-5 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-sky-400 to-purple-500 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105 transform transition-all duration-300 hover:from-sky-500 hover:to-purple-600"
//           >
//             <span className="flex items-center gap-2">
//               <Icon className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
//               {label}
//             </span>
//           </button>
//         ))}
//       </div> */}

//       {/* Date/time pickers */}
//       {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4"> */}
//         {/* From Date */}
//         {/* <div className="relative group">
//           <label className="block text-xs font-semibold text-sky-700 dark:text-sky-300 mb-2 ml-1">
//             From Date
//           </label>
//           <div className="relative">
//             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none">
//               <Calendar className="w-5 h-5" />
//             </div>
//             <input
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               className="block w-full pl-11 pr-4 py-3 rounded-xl border-2 border-sky-200 bg-white/80 backdrop-blur-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 dark:bg-gray-800/50 dark:border-purple-500/30 dark:text-white shadow-sm hover:shadow-md"
//             />
//           </div>
//         </div> */}

//         {/* From Time */}
//         {/* <div className="relative group">
//           <label className="block text-xs font-semibold text-sky-700 dark:text-sky-300 mb-2 ml-1">
//             From Time
//           </label>
//           <div className="relative">
//             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none">
//               <Clock className="w-5 h-5" />
//             </div>
//             <input
//               type="time"
//               value={fromTime}
//               onChange={(e) => setFromTime(e.target.value)}
//               className="block w-full pl-11 pr-4 py-3 rounded-xl border-2 border-sky-200 bg-white/80 backdrop-blur-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 dark:bg-gray-800/50 dark:border-purple-500/30 dark:text-white shadow-sm hover:shadow-md"
//             />
//           </div>
//         </div> */}

//         {/* To Date */}
//         {/* <div className="relative group">
//           <label className="block text-xs font-semibold text-sky-700 dark:text-sky-300 mb-2 ml-1">
//             To Date
//           </label>
//           <div className="relative">
//             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none">
//               <Calendar className="w-5 h-5" />
//             </div>
//             <input
//               type="date"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               className="block w-full pl-11 pr-4 py-3 rounded-xl border-2 border-sky-200 bg-white/80 backdrop-blur-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 dark:bg-gray-800/50 dark:border-purple-500/30 dark:text-white shadow-sm hover:shadow-md"
//             />
//           </div>
//         </div> */}

//         {/* To Time */}
//         {/* <div className="relative group">
//           <label className="block text-xs font-semibold text-sky-700 dark:text-sky-300 mb-2 ml-1">
//             To Time
//           </label>
//           <div className="relative">
//             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none">
//               <Clock className="w-5 h-5" />
//             </div>
//             <input
//               type="time"
//               value={toTime}
//               onChange={(e) => setToTime(e.target.value)}
//               className="block w-full pl-11 pr-4 py-3 rounded-xl border-2 border-sky-200 bg-white/80 backdrop-blur-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 dark:bg-gray-800/50 dark:border-purple-500/30 dark:text-white shadow-sm hover:shadow-md"
//             />
//           </div>
//         </div>
//       </div> */}

//       {/* Include Date Checkbox */}
//       {/* <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-sky-100 to-purple-100 dark:from-sky-900/20 dark:to-purple-900/20 border border-sky-300/50 dark:border-purple-500/30 mb-4 hover:shadow-md transition-all duration-300">
//         <input
//           type="checkbox"
//           id="includeDate"
//           checked={includeDate}
//           onChange={(e) => setIncludeDate(e.target.checked)}
//           className="h-5 w-5 text-purple-600 border-sky-400 rounded focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
//         />
//         <label htmlFor="includeDate" className="text-sm font-semibold text-sky-800 dark:text-sky-200 cursor-pointer">
//           Include Date in Report
//         </label>
//       </div> */}

//       {/* Report Type Select */}
//       {/* <div className="relative group mb-4">
//         <label className="block text-xs font-semibold text-sky-700 dark:text-sky-300 mb-2 ml-1">
//           Report Type
//         </label>
//         <div className="relative">
//           <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none">
//             <FileText className="w-5 h-5" />
//           </div>
//           <select
//             value={reportType}
//             onChange={(e) => setReportType(e.target.value)}
//             className="block w-full pl-11 pr-10 py-3 rounded-xl border-2 border-sky-200 bg-white/80 backdrop-blur-sm appearance-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 dark:bg-gray-800/50 dark:border-purple-500/30 dark:text-white shadow-sm hover:shadow-md cursor-pointer"
//           >
//             <option value="">Select report type</option>
//             <option value="daily">Traceability Report Complete</option>
//           </select>
//           <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-purple-500">
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//             </svg>
//           </div>
//         </div>
//       </div> */}

//       {/* Apply Button */}
//       {/* <button
//         onClick={handleApply}
//         disabled={isLoading}
//         className="relative w-full group overflow-hidden px-6 py-3 text-base font-bold rounded-xl shadow-xl bg-gradient-to-r from-sky-500 via-purple-500 to-sky-600 text-white hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed mb-4"
//       > */}
//         {/* Shimmer effect */}
//         {/* <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div> */}

//         {/* <span className="relative flex items-center justify-center gap-2">
//           {isLoading ? (
//             <>
//               <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Processing Report...
//             </>
//           ) : (
//             <>
//               <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
//               Generate Report
//             </>
//           )}
//         </span>
//       </button> */}

//       {/* Info panel - Card Grid */}
//       <div className="border-t-2 border-sky-200/50 dark:border-purple-500/30 pt-6">
//         <h3 className="text-lg font-bold text-sky-700 dark:text-sky-300 mb-3">Production Details</h3>

//         {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3"> */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           {/* UID Card */}
//           <div className="group p-5 rounded-xl bg-gradient-to-br from-white to-sky-100 dark:from-gray-800 dark:to-purple-900/20 border border-sky-300/50 dark:border-purple-500/30 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
//             <div className="flex items-start gap-3">
//               <div className="p-2 bg-gradient-to-br from-sky-400 to-purple-500 rounded-lg shrink-0">
//                 <Package className="w-5 h-5 text-white" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">UID</p>
//                 {/* <p className="text-sm font-bold text-gray-900 dark:text-white break-all"> */}
//                 <p className="text-sm font-bold text-gray-900 dark:text-white break-words">
//                   {selectedOrder?._uid || selectedOrder?.uid || '-'}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Line Card */}
//           <div className="group p-5 rounded-xl bg-gradient-to-br from-white to-purple-200 dark:from-gray-800 dark:to-purple-900/20 border border-purple-300/50 dark:border-purple-500/30 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
//             <div className="flex items-start gap-3">
//               <div className="p-2 bg-gradient-to-br from-purple-400 to-sky-500 rounded-lg shrink-0">
//                 <BarChart3 className="w-5 h-5 text-white" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Line</p>
//                 {eolLoading ? (
//                   <div className="animate-pulse">
//                     <div className="h-4 bg-gradient-to-r from-sky-200 to-purple-200 rounded w-3/4"></div>
//                   </div>
//                 ) : (
//                   <p className="text-sm font-bold text-gray-900 dark:text-white">
//                     {/* {eolData.productline ||
//                       selectedOrder?.line ||
//                       selectedOrder?.model ||
//                       selectedOrder?.productionline ||
//                       selectedOrder?.productionlinename ||
//                       selectedOrder?._line ||
//                       'N/A'} */}
//                     {eolData.productline ||
//                     selectedOrder?._line ||
//                     selectedOrder?.line ||
//                     'N/A'}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Date Card */}
//           <div className="group p-5 rounded-xl bg-gradient-to-br from-white to-sky-100 dark:from-gray-800 dark:to-sky-900/20 border border-sky-300/50 dark:border-sky-500/30 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
//             <div className="flex items-start gap-3">
//               <div className="p-2 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg shrink-0">
//                 <Calendar className="w-5 h-5 text-white" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">Date</p>
//                 <p className="text-sm font-bold text-gray-900 dark:text-white">
//                   {selectedOrder?._endDate || selectedOrder?.productionenddate || '-'}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Status Card */}
//           <div className="group p-5 rounded-xl bg-gradient-to-br from-white to-purple-200 dark:from-gray-800 dark:to-purple-900/20 border border-purple-300/50 dark:border-purple-500/30 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
//             <div className="flex items-start gap-3">
//               <div className="p-2 bg-gradient-to-br from-purple-400 to-sky-400 rounded-lg shrink-0">
//                 <CheckCircle className="w-5 h-5 text-white" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Status</p>
//                 <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getStatusColor(selectedOrder?._status || selectedOrder?.status)} text-white shadow-md`}>
//                   {selectedOrder?._status || selectedOrder?.status || '-'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* End of Line UID Card - Full Width */}
//           {/* <div className="md:col-span-2 group p-5 rounded-xl bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20 border border-indigo-300/50 dark:border-indigo-500/30 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300"> */}
//           <div className="col-span-1 sm:col-span-2 group p-5 rounded-xl bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20 border border-indigo-300/50 dark:border-indigo-500/30 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
//             <div className="flex items-start gap-3">
//               <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg shrink-0">
//                 <AlertCircle className="w-5 h-5 text-white" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">End of Line UID</p>
//                 {eolLoading ? (
//                   <div className="animate-pulse flex gap-2">
//                     <div className="h-4 bg-gradient-to-r from-indigo-200 to-purple-200 rounded w-1/2"></div>
//                     <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded w-1/4"></div>
//                   </div>
//                 ) : (
//                   <>
//                     {/* <p className="text-sm font-bold text-gray-900 dark:text-white break-all"> */}
//                     <p className="text-sm font-bold text-gray-900 dark:text-white break-words">
//                       {eolData.endoflineuid || 'N/A'}
//                     </p>
//                     {eolError && (
//                       <span className="mt-1 inline-flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
//                         <AlertCircle className="w-3 h-3" />
//                         {eolError}
//                       </span>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

//////////////////////////////////////////////////////////////////////////////////////////////
// // src/components/ReportsPanel.jsx
// import React, { useState, useEffect } from 'react'
// import { BarChart3, Calendar, Clock, FileText, Zap, Package, CheckCircle, AlertCircle } from 'lucide-react'

// export function ReportsPanel({ selectedOrder, apiBase = '', clearSelectedOrder = () => {} }) {
//   const [fromDate, setFromDate] = useState('2023-09-19')
//   const [fromTime, setFromTime] = useState('00:00:00')
//   const [toDate, setToDate] = useState('2023-09-19')
//   const [toTime, setToTime] = useState('23:59:59')
//   const [includeDate, setIncludeDate] = useState(true)
//   const [reportType, setReportType] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [eolData, setEolData] = useState({})

//   const [eolUid, setEolUid] = useState('')
//   const [eolLoading, setEolLoading] = useState(false)
//   const [eolError, setEolError] = useState('')

//   const handleApply = () => {
//     setIsLoading(true)
//     setTimeout(() => setIsLoading(false), 1500)
//   }

//   const handleClear = () => {
//     setFromDate('2023-09-19')
//     setFromTime('00:00:00')
//     setToDate('2023-09-19')
//     setToTime('23:59:59')
//     setIncludeDate(true)
//     setReportType('')
//     setEolUid('')
//     setEolError('')
//     setEolData({})
//     clearSelectedOrder()
//   }

//   const handleQuickSelect = (days) => {
//     const today = new Date()
//     const pastDate = new Date()
//     pastDate.setDate(today.getDate() - days)
//     const formatDate = (d) => d.toISOString().split('T')[0]
//     setFromDate(formatDate(pastDate))
//     setToDate(formatDate(today))
//   }

//   // 🔥 End of Line UID Logic (unchanged)
//   useEffect(() => {
//     const uid = selectedOrder?._uid || selectedOrder?.uid || ''
//     if (!uid) {
//       setEolUid('')
//       setEolError('')
//       setEolData({})
//       return
//     }

//     const fromOrder =
//       selectedOrder?.endoflineuid ||
//       selectedOrder?.endOfLineUid ||
//       selectedOrder?.eoluid || ''

//     if (fromOrder) {
//       setEolUid(fromOrder)
//       setEolData({})
//       setEolError('')
//       return
//     }

//     const controller = new AbortController()
//     const signal = controller.signal
//     const base = (apiBase || '').replace(/\/$/, '')
//     const url = `${base}/api/trace/endoflineuid/${encodeURIComponent(uid)}`

//     setEolLoading(true)
//     setEolError('')
//     setEolData({})

//     fetch(url, { signal })
//       .then(async (res) => {
//         if (!res.ok) throw new Error(`HTTP ${res.status}`)
//         const data = await res.json()
//         const row = data?.data || {}
//         setEolUid(row?.endoflineuid || '')
//         setEolData(row)
//       })
//       .catch((err) => {
//         if (err.name === 'AbortError') return
//         setEolUid('')
//         setEolError(err.message || 'Failed to fetch EOL UID')
//       })
//       .finally(() => setEolLoading(false))

//     return () => controller.abort()
//   }, [apiBase, selectedOrder])

//   const getStatusColor = (status) => {
//     const s = (status || '').toLowerCase()
//     if (s.includes('pass') || s.includes('success') || s.includes('complete')) {
//       return 'from-green-400 to-emerald-600'
//     }
//     if (s.includes('pending') || s.includes('progress')) {
//       return 'from-yellow-400 to-orange-600'
//     }
//     if (s.includes('fail') || s.includes('error')) {
//       return 'from-red-400 to-rose-600'
//     }
//     return 'from-gray-400 to-gray-600'
//   }

//   return (
//     <div
//       className="
//         relative bg-gradient-to-br from-sky-50 via-purple-50 to-sky-100
//         dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900
//         shadow-2xl rounded-2xl p-4
//         border border-sky-200/50 dark:border-purple-500/20
//         overflow-hidden transition-colors duration-200

//         /* RESPONSIVE ADDED ONLY */
//         sm:p-5
//         md:p-6
//         lg:p-7
//       "
//     >
//       {/* Decorative blobs (unchanged) */}
//       <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
//       <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-300/20 dark:bg-sky-500/10 rounded-full blur-3xl -z-10"></div>
//       <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-300/10 dark:bg-pink-500/5 rounded-full blur-3xl -z-10"></div>

//       {/* ============================== */}
//       {/* PRODUCTION DETAILS SECTION    */}
//       {/* ============================== */}

//       <div className="border-t-2 border-sky-200/50 dark:border-purple-500/30 pt-6">

//         <h3
//           className="
//             text-lg font-bold text-sky-700 dark:text-sky-300 mb-3
//             /* Responsive */
//             sm:text-xl
//             md:text-2xl
//           "
//         >
//           Production Details
//         </h3>

//         {/* RESPONSIVE GRID ONLY ADDED */}
//         <div
//           className="
//             grid grid-cols-1
//             sm:grid-cols-2
//             lg:grid-cols-2
//             gap-3
//             sm:gap-4
//             md:gap-5
//           "
//         >
//           {/* UID CARD */}
//           <div className="
//             group p-5 rounded-xl
//             bg-gradient-to-br from-white to-sky-100
//             dark:from-gray-800 dark:to-purple-900/20
//             border border-sky-300/50 dark:border-purple-500/30
//             shadow-lg hover:shadow-xl hover:scale-[1.02]
//             transition-all duration-300

//             /* Responsive spacing */
//             sm:p-5
//             md:p-6
//           ">
//             <div className="flex items-start gap-3">
//               <div className="p-2 bg-gradient-to-br from-sky-400 to-purple-500 rounded-lg shrink-0">
//                 <Package className="w-5 h-5 text-white" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">
//                   UID
//                 </p>
//                 <p className="text-sm font-bold text-gray-900 dark:text-white break-words">
//                   {selectedOrder?._uid || selectedOrder?.uid || '-'}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* LINE CARD */}
//           <div className="
//             group p-5 rounded-xl
//             bg-gradient-to-br from-white to-purple-200
//             dark:from-gray-800 dark:to-purple-900/20
//             border border-purple-300/50 dark:border-purple-500/30
//             shadow-lg hover:shadow-xl hover:scale-[1.02]
//             transition-all duration-300

//             sm:p-5
//             md:p-6
//           ">
//             <div className="flex items-start gap-3">
//               <div className="p-2 bg-gradient-to-br from-purple-400 to-sky-500 rounded-lg shrink-0">
//                 <BarChart3 className="w-5 h-5 text-white" />
//               </div>

//               <div className="flex-1 min-w-0">
//                 <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
//                   Line
//                 </p>

//                 {eolLoading ? (
//                   <div className="animate-pulse">
//                     <div className="h-4 bg-gradient-to-r from-sky-200 to-purple-200 rounded w-3/4"></div>
//                   </div>
//                 ) : (
//                   <p className="text-sm font-bold text-gray-900 dark:text-white">
//                     {eolData.productline ||
//                       selectedOrder?._line ||
//                       selectedOrder?.line ||
//                       'N/A'}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* DATE CARD */}
//           <div className="
//             group p-5 rounded-xl
//             bg-gradient-to-br from-white to-sky-100
//             dark:from-gray-800 dark:to-sky-900/20
//             border border-sky-300/50 dark:border-sky-500/30
//             shadow-lg hover:shadow-xl hover:scale-[1.02]
//             transition-all duration-300

//             sm:p-5
//             md:p-6
//           ">
//             <div className="flex items-start gap-3">
//               <div className="p-2 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg shrink-0">
//                 <Calendar className="w-5 h-5 text-white" />
//               </div>

//               <div className="flex-1 min-w-0">
//                 <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">
//                   Date
//                 </p>
//                 <p className="text-sm font-bold text-gray-900 dark:text-white break-words">
//                   {selectedOrder?._endDate ||
//                     selectedOrder?.productionenddate ||
//                     '-'}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* STATUS CARD */}
//           <div className="
//             group p-5 rounded-xl
//             bg-gradient-to-br from-white to-purple-200
//             dark:from-gray-800 dark:to-purple-900/20
//             border border-purple-300/50 dark:border-purple-500/30
//             shadow-lg hover:shadow-xl hover:scale-[1.02]
//             transition-all duration-300

//             sm:p-5
//             md:p-6
//           ">
//             <div className="flex items-start gap-3">
//               <div className="p-2 bg-gradient-to-br from-purple-400 to-sky-400 rounded-lg shrink-0">
//                 <CheckCircle className="w-5 h-5 text-white" />
//               </div>

//               <div className="flex-1 min-w-0">
//                 <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
//                   Status
//                 </p>

//                 <span
//                   className={`
//                     inline-flex px-3 py-1 rounded-full text-xs font-bold
//                     bg-gradient-to-r ${getStatusColor(selectedOrder?._status || selectedOrder?.status)}
//                     text-white shadow-md
//                   `}
//                 >
//                   {selectedOrder?._status ||
//                     selectedOrder?.status ||
//                     '-'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* END OF LINE UID CARD — FULL WIDTH ON TABLET, AUTO ON DESKTOP */}
//           <div className="
//             col-span-1
//             sm:col-span-2
//             group p-5 rounded-xl
//             bg-gradient-to-br from-white to-indigo-50
//             dark:from-gray-800 dark:to-indigo-900/20
//             border border-indigo-300/50 dark:border-indigo-500/30
//             shadow-lg hover:shadow-xl hover:scale-[1.01]
//             transition-all duration-300

//             sm:p-5
//             md:p-6
//           ">
//             <div className="flex items-start gap-3">
//               <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg shrink-0">
//                 <AlertCircle className="w-5 h-5 text-white" />
//               </div>

//               <div className="flex-1 min-w-0">
//                 <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
//                   End of Line UID
//                 </p>

//                 {eolLoading ? (
//                   <div className="animate-pulse flex gap-2">
//                     <div className="h-4 bg-gradient-to-r from-indigo-200 to-purple-200 rounded w-1/2"></div>
//                     <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded w-1/4"></div>
//                   </div>
//                 ) : (
//                   <>
//                     <p className="text-sm font-bold text-gray-900 dark:text-white break-words">
//                       {eolData.endoflineuid || 'N/A'}
//                     </p>

//                     {eolError && (
//                       <span className="mt-1 inline-flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
//                         <AlertCircle className="w-3 h-3" />
//                         {eolError}
//                       </span>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//         </div>{/* END GRID */}
//       </div>{/* END PRODUCTION DETAILS */}

//     </div>
//   )
// }

// src/components/ReportsPanel.jsx
import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Calendar,
  Clock,
  FileText,
  Zap,
  Package,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export function ReportsPanel({
  selectedOrder,
  apiBase = "",
  clearSelectedOrder = () => {},
}) {
  const [fromDate, setFromDate] = useState("2023-09-19");
  const [fromTime, setFromTime] = useState("00:00:00");
  const [toDate, setToDate] = useState("2023-09-19");
  const [toTime, setToTime] = useState("23:59:59");
  const [includeDate, setIncludeDate] = useState(true);
  const [reportType, setReportType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [eolData, setEolData] = useState({});

  const [eolUid, setEolUid] = useState("");
  const [eolLoading, setEolLoading] = useState(false);
  const [eolError, setEolError] = useState("");

  const handleApply = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleClear = () => {
    setFromDate("2023-09-19");
    setFromTime("00:00:00");
    setToDate("2023-09-19");
    setToTime("23:59:59");
    setIncludeDate(true);
    setReportType("");
    setEolUid("");
    setEolError("");
    setEolData({});
    clearSelectedOrder();
  };

  const handleQuickSelect = (days) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);
    const formatDate = (d) => d.toISOString().split("T")[0];
    setFromDate(formatDate(pastDate));
    setToDate(formatDate(today));
  };

  // 🔥 End of Line UID Logic (unchanged)
  useEffect(() => {
    const uid = selectedOrder?._uid || selectedOrder?.uid || "";
    if (!uid) {
      setEolUid("");
      setEolError("");
      setEolData({});
      return;
    }

    const fromOrder =
      selectedOrder?.endoflineuid ||
      selectedOrder?.endOfLineUid ||
      selectedOrder?.eoluid ||
      "";

    if (fromOrder) {
      setEolUid(fromOrder);
      setEolData({});
      setEolError("");
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;
    const base = (apiBase || "").replace(/\/$/, "");
    const url = `${base}/api/trace/endoflineuid/${encodeURIComponent(uid)}`;

    setEolLoading(true);
    setEolError("");
    setEolData({});

    fetch(url, { signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const row = data?.data || {};
        setEolUid(row?.endoflineuid || "");
        setEolData(row);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setEolUid("");
        setEolError(err.message || "Failed to fetch EOL UID");
      })
      .finally(() => setEolLoading(false));

    return () => controller.abort();
  }, [apiBase, selectedOrder]);

  const getStatusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("pass") || s.includes("success") || s.includes("complete")) {
      return "from-green-400 to-emerald-600";
    }
    if (s.includes("pending") || s.includes("progress")) {
      return "from-yellow-400 to-orange-600";
    }
    if (s.includes("fail") || s.includes("error")) {
      return "from-red-400 to-rose-600";
    }
    return "from-gray-400 to-gray-600";
  };

  return (
    <div
      className="
        relative bg-gradient-to-br from-sky-50 via-purple-50 to-sky-100 
        dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 
        shadow-xl md:shadow-2xl 
        rounded-xl md:rounded-2xl 
        border border-sky-200/50 dark:border-purple-500/20 
        overflow-hidden transition-colors duration-200

        /* Mobile-first responsive padding */
        p-3
        sm:p-4 
        md:p-5 
        lg:p-6
        xl:p-7
      "
    >
      {/* Decorative blobs - scaled for mobile */}
      <div className="absolute top-0 right-0 w-40 h-40 sm:w-56 md:w-72 sm:h-56 md:h-72 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-2xl md:blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-56 md:w-72 sm:h-56 md:h-72 bg-sky-300/20 dark:bg-sky-500/10 rounded-full blur-2xl md:blur-3xl -z-10"></div>
      <div className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-48 md:w-64 sm:h-48 md:h-64 bg-pink-300/10 dark:bg-pink-500/5 rounded-full blur-2xl md:blur-3xl -z-10"></div>

      {/* ============================== */}
      {/* PRODUCTION DETAILS SECTION    */}
      {/* ============================== */}

      <div className="border-t border-sky-200/50 dark:border-purple-500/30 pt-3 sm:pt-4 md:pt-6">
        <h3
          className="
            text-base font-bold text-sky-700 dark:text-sky-300 
            mb-2 sm:mb-3 md:mb-4
            sm:text-lg 
            md:text-xl
            lg:text-2xl
          "
        >
          Production Details
        </h3>

        {/* RESPONSIVE GRID WITH MOBILE-FIRST APPROACH */}
        <div
          className="
            grid grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-2 
            gap-2
            sm:gap-3
            md:gap-4
            lg:gap-5
          "
        >
          {/* UID CARD */}
          <div
            className="
            group 
            p-3 sm:p-4 md:p-5 
            rounded-lg sm:rounded-xl 
            bg-gradient-to-br from-white to-sky-100
            dark:from-gray-800 dark:to-purple-900/20
            border border-sky-300/50 dark:border-purple-500/30
            shadow-md sm:shadow-lg 
            hover:shadow-lg sm:hover:shadow-xl 
            hover:scale-[1.01] sm:hover:scale-[1.02]
            transition-all duration-300
          "
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-sky-400 to-purple-500 rounded-md sm:rounded-lg shrink-0">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-sky-600 dark:text-sky-400 mb-0.5 sm:mb-1">
                  UID
                </p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white break-words">
                  {selectedOrder?._uid || selectedOrder?.uid || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* LINE CARD */}
          <div
            className="
            group 
            p-3 sm:p-4 md:p-5 
            rounded-lg sm:rounded-xl 
            bg-gradient-to-br from-white to-purple-200
            dark:from-gray-800 dark:to-purple-900/20
            border border-purple-300/50 dark:border-purple-500/30
            shadow-md sm:shadow-lg 
            hover:shadow-lg sm:hover:shadow-xl 
            hover:scale-[1.01] sm:hover:scale-[1.02]
            transition-all duration-300
          "
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-400 to-sky-500 rounded-md sm:rounded-lg shrink-0">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-purple-600 dark:text-purple-400 mb-0.5 sm:mb-1">
                  Line
                </p>

                {eolLoading ? (
                  <div className="animate-pulse">
                    <div className="h-3 sm:h-4 bg-gradient-to-r from-sky-200 to-purple-200 rounded w-3/4"></div>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                    {eolData.productline ||
                      selectedOrder?._line ||
                      selectedOrder?.line ||
                      "N/A"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* DATE CARD */}
          <div
            className="
            group 
            p-3 sm:p-4 md:p-5 
            rounded-lg sm:rounded-xl 
            bg-gradient-to-br from-white to-sky-100
            dark:from-gray-800 dark:to-sky-900/20
            border border-sky-300/50 dark:border-sky-500/30
            shadow-md sm:shadow-lg 
            hover:shadow-lg sm:hover:shadow-xl 
            hover:scale-[1.01] sm:hover:scale-[1.02]
            transition-all duration-300
          "
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-sky-400 to-blue-500 rounded-md sm:rounded-lg shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-sky-600 dark:text-sky-400 mb-0.5 sm:mb-1">
                  Date
                </p>
                <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white break-words">
                  {selectedOrder?._endDate ||
                    selectedOrder?.productionenddate ||
                    "-"}
                </p>
              </div>
            </div>
          </div>

          {/* STATUS CARD */}
          <div
            className="
            group 
            p-3 sm:p-4 md:p-5 
            rounded-lg sm:rounded-xl 
            bg-gradient-to-br from-white to-purple-200
            dark:from-gray-800 dark:to-purple-900/20
            border border-purple-300/50 dark:border-purple-500/30
            shadow-md sm:shadow-lg 
            hover:shadow-lg sm:hover:shadow-xl 
            hover:scale-[1.01] sm:hover:scale-[1.02]
            transition-all duration-300
          "
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-400 to-sky-400 rounded-md sm:rounded-lg shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-purple-600 dark:text-purple-400 mb-0.5 sm:mb-1">
                  Status
                </p>

                <span
                  className={`
                    inline-flex px-2 py-0.5 sm:px-3 sm:py-1 
                    rounded-full 
                    text-[10px] sm:text-xs 
                    font-bold 
                    bg-gradient-to-r ${getStatusColor(selectedOrder?._status || selectedOrder?.status)} 
                    text-white shadow-sm sm:shadow-md
                  `}
                >
                  {selectedOrder?._status || selectedOrder?.status || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* END OF LINE UID CARD — FULL WIDTH ON ALL SCREENS */}
          <div
            className="
            col-span-1 
            sm:col-span-2
            group 
            p-3 sm:p-4 md:p-5 
            rounded-lg sm:rounded-xl 
            bg-gradient-to-br from-white to-indigo-50
            dark:from-gray-800 dark:to-indigo-900/20
            border border-indigo-300/50 dark:border-indigo-500/30
            shadow-md sm:shadow-lg 
            hover:shadow-lg sm:hover:shadow-xl 
            hover:scale-[1.005] sm:hover:scale-[1.01]
            transition-all duration-300
          "
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-md sm:rounded-lg shrink-0">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-0.5 sm:mb-1">
                  End of Line UID
                </p>

                {eolLoading ? (
                  <div className="animate-pulse flex gap-2">
                    <div className="h-3 sm:h-4 bg-gradient-to-r from-indigo-200 to-purple-200 rounded w-1/2"></div>
                    <div className="h-3 sm:h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded w-1/4"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white break-words">
                      {eolData.endoflineuid || "N/A"}
                    </p>

                    {eolError && (
                      <span className="mt-0.5 sm:mt-1 inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-red-500 dark:text-red-400">
                        <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {eolError}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* END GRID */}
      </div>
      {/* END PRODUCTION DETAILS */}
    </div>
  );
}
