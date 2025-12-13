// import React from 'react'

// // Accepts either orders (array) or statusSummary (object)
// export function StatusCards({ orders = [], statusSummary = null }) {
//   const hasSummary = !!statusSummary

//   // total may be adjusted later in fallback after UID dedupe
//   let total = hasSummary ? (statusSummary.total ?? 0) : (Array.isArray(orders) ? orders.length : 0)

//   // Shown counts (initialized from summary if present)
//   let showCompleted = hasSummary ? (statusSummary.completed ?? 0) : 0
//   let showInProgress = hasSummary ? (statusSummary.inprogress ?? 0) : 0
//   let showScrap = hasSummary ? (statusSummary.scrap ?? 0) : 0


// // If no statusSummary, calculate from orders with UID dedupe (latest row wins)
// if (!hasSummary && Array.isArray(orders)) {
//   // RESET COUNTS FIRST - This is the key fix!
//   showCompleted = 0
//   showInProgress = 0
//   showScrap = 0 
//   total = orders.length

//   // Only calculate if there are orders
//   if (orders.length > 0) {
//     const normalizeStatus = (order) => {
//       const raw =
//         (order._status && String(order._status)) ||
//         (order.status && String(order.status)) ||
//         (order.productstatus && String(order.productstatus)) ||
//         (order.__raw && (order.__raw.status || order.__raw.productstatus)) ||
//         ''
//       const s = raw.toString().trim().toLowerCase()
//       if (!s) return ''
//       if (s.includes('pass') || s.includes('completed') || s === 'complete') return 'Completed'
//       if (s.includes('scrap') || s.includes('scrapped')) return 'Scrap'
//       if (s.includes('in progress') || s.includes('in_progress') || s === 'inprogress') return 'In Progress'
//       return s
//         .split(/[_\s-]+/)
//         .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w))
//         .join(' ')
//     }

//     // Deduplicate by UID, prefer latest by productionenddate then productionstartdate
//     const byUid = new Map()
//     for (const o of orders) {
//       const uid = (o.uid || o.UID || o._uid || '').trim()
//       if (!uid) continue
//       const curr = byUid.get(uid)
//       const currEnd = curr?.productionenddate || curr?._endDate || ''
//       const currStart = curr?.productionstartdate || curr?._startDate || ''
//       const nextEnd = o.productionenddate || o._endDate || ''
//       const nextStart = o.productionstartdate || o._startDate || ''
//       if (
//         !curr ||
//         String(nextEnd) > String(currEnd) ||
//         (String(nextEnd) === String(currEnd) && String(nextStart) > String(currStart))
//       ) {
//         byUid.set(uid, o)
//       }
//     }

//     const uniqueOrders = Array.from(byUid.values())

//     let c = 0,
//       ip = 0,
//       sc = 0
//     for (const row of uniqueOrders) {
//       const s = normalizeStatus(row)
//       if (s === 'Completed') c++
//       else if (s === 'In Progress') ip++
//       else if (s === 'Scrap') sc++
//     }

//     // overwrite shown counts + total to reflect unique UIDs
//     showCompleted = c
//     showInProgress = ip
//     showScrap = sc
//     total = uniqueOrders.length
//   }
// }



//   // percent helper - fixed rounding to show 99% when not fully complete
//   const pct = (value) => {
//     if (!total) return 0
//     const rawPercentage = (value / total) * 100
    
//     // Show a minimum of 1% if value > 0 to make the bar visible
//     if (value > 0 && rawPercentage < 1) return 1
//     if (rawPercentage === 100) return 100
//     return Math.floor(rawPercentage)
//   }


//   const animatedProgressBar = (percentage, color) => (
//     <div className="relative">
//       <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full h-3 shadow-inner">
//         <div className={`${color} h-3 rounded-full transition-all duration-500 ease-out shadow-lg`} style={{ width: `${percentage}%` }} />
//       </div>
//     </div>
//   )

//   const completedPercentage = pct(showCompleted)
//   const inProgressPercentage = pct(showInProgress)
//   const scrapPercentage = pct(showScrap)

//   return (
//   <div className="relative bg-gradient-to-br from-sky-100 via-purple-100 to-indigo-100 dark:from-gray-900 dark:via-purple-900/30 dark:to-indigo-900/30 shadow-2xl rounded-2xl p-4 border border-sky-200/50 dark:border-purple-500/30 overflow-hidden max-w-8xl w-full">
//     <div className="flex items-center justify-between mb-6">
//   <div className="flex items-center gap-3">
//     <div className="p-2.5 bg-gradient-to-br from-sky-400 to-purple-600 rounded-xl shadow-lg">
//       <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//       </svg>
//     </div>
//     <h2 className="text-lg font-bold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
//       Production Status
//     </h2>
//   </div>
  
//   {/* Live indicator */}
//   <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-300 dark:border-green-600">
//     <div className="w-2 h-2 bg-green-500 rounded-md animate-pulse"></div>
//     <span className="text-xs font-semibold text-green-700 dark:text-green-300">Live</span>
//   </div>
// </div>

//       <div className="grid grid-cols-3 gap-4">
//       <div className="relative group mb-6 p-3 rounded-2xl bg-gradient-to-br from-white to-sky-50 dark:from-gray-800 dark:to-purple-900/20 border-2 border-sky-300 dark:border-purple-500/40 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 col-span-3">
//         {/* Decorative corner */}
//         <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-transparent rounded-tr-2xl rounded-bl-full"></div>
        
//         <div className="relative">
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-2">
//               <div className="p-2 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg">
//                 <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                 </svg>
//               </div>
//               <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Total Records</span>
//             </div>
            
//             <div className="flex items-center gap-2">
//               <span className="text-lg font-black bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
//                 {total}
//               </span>
//             </div>
//           </div>
          
//           {/* Enhanced progress bar */}
//           <div className="relative">
//             <div className="w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full h-3 shadow-inner overflow-hidden">
//               <div className="relative h-3 rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-purple-600 shadow-lg transition-all duration-500" style={{ width: '100%' }}>
//                 {/* Shimmer effect */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
// {/* COMPLETED CARD */}
// <div className="group relative p-3 rounded-2xl bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-emerald-900/20 border border-emerald-300/50 dark:border-emerald-500/30 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-[1.02] transition-all duration-300">
//   {/* Icon Badge */}
//   <div className="absolute -top-2 -left-2 p-2 bg-gradient-to-br from-emerald-400 to-green-600 rounded-lg shadow-xl group-hover:scale-110 transition-transform duration-300">
//   <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//     </svg>
//   </div>
  
//   <div className="pt-4">
//     {/* Header with count */}
//     <div className="flex items-start justify-between mb-2">
//       <div>
//         <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
//           Completed
//         </p>
//         <div className="flex items-baseline gap-2">
//           <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
//             {showCompleted}
//           </span>
//           <span className="text-lg font-bold text-emerald-500 dark:text-emerald-400">
//             /{total}
//           </span>
//         </div>
//         </div>
      
//       {/* Percentage Badge */}
//       <div className="px-2 py-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg shadow-lg -mt-4 absolute top-5 right-3 translate-y-1">
//       <span className="text-sm font-black text-white">
//         {Math.min(completedPercentage, 100)}%
//       </span>
//       </div>
//     </div>
    
//     {/* Enhanced Progress Bar */}
//     <div className="relative">
//       <div className="w-full bg-gradient-to-r from-emerald-100 to-green-100 dark:from-gray-700 dark:to-gray-600 rounded-full h-4 shadow-inner overflow-hidden">
//         <div 
//           className="relative h-4 rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 shadow-lg transition-all duration-700 ease-out group-hover:shadow-emerald-500/50"
//           style={{ width: `${Math.min(completedPercentage, 100)}%` }}
//         >
//           {/* Animated shimmer */}
//           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          
//           {/* Glow effect */}
//           <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]"></div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

//   {/* IN PROGRESS CARD */}
//   <div className="group relative p-3 rounded-2xl bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-amber-900/20 border border-amber-300/50 dark:border-amber-500/30 shadow-lg hover:shadow-2xl hover:shadow-amber-500/20 hover:scale-[1.02] transition-all duration-300">
//     {/* Icon Badge */}
//     <div className="absolute -top-2 -left-2 p-2 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
//       <svg className="w-3 h-3 text-white animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//       </svg>
//     </div>
    
//     <div className="pt-4">
//       <div className="flex items-start justify-between mb-2">
//         <div>
//           <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
//             In Progress
//           </p>
//           <div className="flex items-baseline gap-2">
//             <span className="text-2xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
//               {showInProgress}
//             </span>
//             <span className="text-lg font-bold text-amber-500 dark:text-amber-400">
//               /{total}
//             </span>
//           </div>
//         </div>
        
//         <div className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg shadow-lg -mt-5">
//           <span className="text-sm font-black text-white">
//              {Math.min(inProgressPercentage, 100)}%
//           </span>
//         </div>
//       </div>
      
//       <div className="relative">
//         <div className="w-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-gray-700 dark:to-gray-600 rounded-full h-4 shadow-inner overflow-hidden">
//           <div 
//             className="relative h-4 rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-600 shadow-lg transition-all duration-700 ease-out group-hover:shadow-amber-500/50"
//             style={{ width: `${Math.max(Math.min(inProgressPercentage, 100), showInProgress > 0 ? 1 : 0)}%` }}
//           >
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
//             <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>


//   {/* SCRAP CARD */}
//   <div className="group relative p-3 rounded-2xl bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-red-900/20 border border-red-300/50 dark:border-red-500/30 shadow-lg hover:shadow-2xl hover:shadow-red-500/20 hover:scale-[1.02] transition-all duration-300">
//     {/* Icon Badge */}
//     <div className="absolute -top-2 -left-2 p-2 bg-gradient-to-br from-red-400 to-rose-600 rounded-lg shadow-xl group-hover:scale-110 transition-transform duration-300">
//       <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//       </svg>
//     </div>
    
//     <div className="pt-4">
//       <div className="flex items-start justify-between mb-2">
//         <div>
//           <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">
//             Scrap
//           </p>
//           <div className="flex items-baseline gap-2">
//             <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
//               {showScrap}
//             </span>
//             <span className="text-lg font-bold text-red-500 dark:text-red-400">
//               /{total}
//             </span>
//           </div>
//         </div>
        
//         <div className="px-2 py-1 bg-gradient-to-r from-red-500 to-rose-600 rounded-lg shadow-lg -mt-5">
//           <span className="text-sm font-black text-white">
//             {Math.min(scrapPercentage, 100)}%
//           </span>
//         </div>
//       </div>
      
//       <div className="relative">
//         <div className="w-full bg-gradient-to-r from-red-100 to-rose-100 dark:from-gray-700 dark:to-gray-600 rounded-full h-4 shadow-inner overflow-hidden">
//           <div 
//             className="relative h-4 rounded-full bg-gradient-to-r from-red-500 via-rose-500 to-red-600 shadow-lg transition-all duration-700 ease-out group-hover:shadow-red-500/50"
//             style={{ width: `${Math.max(Math.min(scrapPercentage, 100), showScrap > 0 ? 1 : 0)}%` }}
//           >
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
//             <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]"></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
//       </div>
//     </div>
//   )
// }



import React from 'react'

// Accepts either orders (array) or statusSummary (object)
export function StatusCards({ orders = [], statusSummary = null }) {
  const hasSummary = !!statusSummary

  // total may be adjusted later in fallback after UID dedupe
  let total = hasSummary ? (statusSummary.total ?? 0) : (Array.isArray(orders) ? orders.length : 0)

  // Shown counts (initialized from summary if present)
  let showCompleted = hasSummary ? (statusSummary.completed ?? 0) : 0
  let showInProgress = hasSummary ? (statusSummary.inprogress ?? 0) : 0
  let showScrap = hasSummary ? (statusSummary.scrap ?? 0) : 0

  // If no statusSummary, calculate from orders with UID dedupe (latest row wins)
  if (!hasSummary && Array.isArray(orders)) {
    showCompleted = 0
    showInProgress = 0
    showScrap = 0 
    total = orders.length

    if (orders.length > 0) {
      const normalizeStatus = (order) => {
        const raw =
          (order._status && String(order._status)) ||
          (order.status && String(order.status)) ||
          (order.productstatus && String(order.productstatus)) ||
          (order.__raw && (order.__raw.status || order.__raw.productstatus)) ||
          ''
        const s = raw.toString().trim().toLowerCase()
        if (!s) return ''
        if (s.includes('pass') || s.includes('completed') || s === 'complete') return 'Completed'
        if (s.includes('scrap') || s.includes('scrapped')) return 'Scrap'
        if (s.includes('in progress') || s.includes('in_progress') || s === 'inprogress') return 'In Progress'
        return s
          .split(/[_\s-]+/)
          .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w))
          .join(' ')
      }

      // Deduplicate by UID, prefer latest
      const byUid = new Map()
      for (const o of orders) {
        const uid = (o.uid || o.UID || o._uid || '').trim()
        if (!uid) continue
        const curr = byUid.get(uid)
        const currEnd = curr?.productionenddate || curr?._endDate || ''
        const currStart = curr?.productionstartdate || curr?._startDate || ''
        const nextEnd = o.productionenddate || o._endDate || ''
        const nextStart = o.productionstartdate || o._startDate || ''
        if (
          !curr ||
          String(nextEnd) > String(currEnd) ||
          (String(nextEnd) === String(currEnd) && String(nextStart) > String(currStart))
        ) {
          byUid.set(uid, o)
        }
      }

      const uniqueOrders = Array.from(byUid.values())

      let c = 0,
        ip = 0,
        sc = 0
      for (const row of uniqueOrders) {
        const s = normalizeStatus(row)
        if (s === 'Completed') c++
        else if (s === 'In Progress') ip++
        else if (s === 'Scrap') sc++
      }

      showCompleted = c
      showInProgress = ip
      showScrap = sc
      total = uniqueOrders.length
    }
  }

  // percent helper
  const pct = (value) => {
    if (!total) return 0
    const rawPercentage = (value / total) * 100
    if (value > 0 && rawPercentage < 1) return 1
    if (rawPercentage === 100) return 100
    return Math.floor(rawPercentage)
  }

  const completedPercentage = pct(showCompleted)
  const inProgressPercentage = pct(showInProgress)
  const scrapPercentage = pct(showScrap)

  return (
    <div className="
      relative bg-gradient-to-br from-sky-100 via-purple-100 to-indigo-100 
      dark:from-gray-900 dark:via-purple-900/30 dark:to-indigo-900/30 
      shadow-2xl rounded-2xl p-4 border border-sky-200/50 dark:border-purple-500/30 
      overflow-hidden w-full
    ">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-sky-400 to-purple-600 rounded-xl shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>

          <h2 className="text-lg font-bold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
            Production Status
          </h2>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 
                        rounded-full border border-green-300 dark:border-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-md animate-pulse"></div>
          <span className="text-xs font-semibold text-green-700 dark:text-green-300">Live</span>
        </div>
      </div>

      {/* RESPONSIVE GRID */}
      <div className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        gap-4
      ">
        
        {/* TOTAL RECORDS CARD — full width always */}
        <div className="
          col-span-1 sm:col-span-2 lg:col-span-3
          group relative mb-6 p-3 rounded-2xl 
          bg-gradient-to-br from-white to-sky-50 
          dark:from-gray-800 dark:to-purple-900/20 
          border-2 border-sky-300 dark:border-purple-500/40 
          shadow-xl hover:shadow-2xl hover:scale-[1.02] 
          transition-all duration-300
        ">
          {/* === Your TOTAL CARD CONTENT unchanged === */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-transparent rounded-tr-2xl rounded-bl-full"></div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Total Records</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-lg font-black bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
                  {total}
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
                              dark:from-gray-700 dark:to-gray-600 rounded-full h-3 shadow-inner overflow-hidden">
                <div className="relative h-3 rounded-full 
                                bg-gradient-to-r from-sky-500 via-blue-500 to-purple-600 
                                shadow-lg transition-all duration-500"
                     style={{ width: "100%" }}>
                  <div className="absolute inset-0 
                                  bg-gradient-to-r from-transparent via-white/30 to-transparent 
                                  animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==== COMPLETED CARD ==== */}
        <div className="group relative p-3 rounded-2xl bg-gradient-to-br from-white to-emerald-50 
                        dark:from-gray-800 dark:to-emerald-900/20 
                        border border-emerald-300/50 dark:border-emerald-500/30 
                        shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20 
                        hover:scale-[1.02] transition-all duration-300">
          <div className="absolute -top-2 -left-2 p-2 bg-gradient-to-br from-emerald-400 to-green-600 
                          rounded-lg shadow-xl group-hover:scale-110 transition-transform duration-300">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          <div className="pt-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                  Completed
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    {showCompleted}
                  </span>
                  <span className="text-lg font-bold text-emerald-500 dark:text-emerald-400">/{total}</span>
                </div>
              </div>

              <div className="px-2 py-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg shadow-lg -mt-4 absolute top-5 right-3 translate-y-1">
                <span className="text-sm font-black text-white">{Math.min(completedPercentage, 100)}%</span>
              </div>
            </div>

            <div className="relative">
              <div className="w-full bg-gradient-to-r from-emerald-100 to-green-100 dark:from-gray-700 dark:to-gray-600 
                              rounded-full h-4 shadow-inner overflow-hidden">
                <div className="relative h-4 rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 
                                shadow-lg transition-all duration-700 ease-out group-hover:shadow-emerald-500/50"
                     style={{ width: `${Math.min(completedPercentage, 100)}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==== IN PROGRESS CARD ==== */}
        <div className="group relative p-3 rounded-2xl bg-gradient-to-br from-white to-amber-50 
                        dark:from-gray-800 dark:to-amber-900/20 
                        border border-amber-300/50 dark:border-amber-500/30 
                        shadow-lg hover:shadow-2xl hover:shadow-amber-500/20 
                        hover:scale-[1.02] transition-all duration-300">
          <div className="absolute -top-2 -left-2 p-2 bg-gradient-to-br from-amber-400 to-orange-600 
                          rounded-lg shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            <svg className="w-3 h-3 text-white animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          
          <div className="pt-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                  In Progress
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {showInProgress}
                  </span>
                  <span className="text-lg font-bold text-amber-500 dark:text-amber-400">/{total}</span>
                </div>
              </div>

              <div className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg shadow-lg -mt-5">
                <span className="text-sm font-black text-white">{Math.min(inProgressPercentage, 100)}%</span>
              </div>
            </div>

            <div className="relative">
              <div className="w-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-gray-700 dark:to-gray-600 
                              rounded-full h-4 shadow-inner overflow-hidden">
                <div className="relative h-4 rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-600 
                                shadow-lg transition-all duration-700 ease-out group-hover:shadow-amber-500/50"
                     style={{
                      width: `${Math.max(Math.min(inProgressPercentage, 100), showInProgress > 0 ? 1 : 0)}%`
                     }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==== SCRAP CARD ==== */}
        <div className="group relative p-3 rounded-2xl bg-gradient-to-br from-white to-red-50 
                        dark:from-gray-800 dark:to-red-900/20 
                        border border-red-300/50 dark:border-red-500/30 
                        shadow-lg hover:shadow-2xl hover:shadow-red-500/20 
                        hover:scale-[1.02] transition-all duration-300">
          
          <div className="absolute -top-2 -left-2 p-2 bg-gradient-to-br from-red-400 to-rose-600 
                          rounded-lg shadow-xl group-hover:scale-110 transition-transform duration-300">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div className="pt-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">
                  Scrap
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                    {showScrap}
                  </span>
                  <span className="text-lg font-bold text-red-500 dark:text-red-400">/{total}</span>
                </div>
              </div>

              <div className="px-2 py-1 bg-gradient-to-r from-red-500 to-rose-600 rounded-lg shadow-lg -mt-5">
                <span className="text-sm font-black text-white">{Math.min(scrapPercentage, 100)}%</span>
              </div>
            </div>

            <div className="relative">
              <div className="w-full bg-gradient-to-r from-red-100 to-rose-100 dark:from-gray-700 dark:to-gray-600 
                              rounded-full h-4 shadow-inner overflow-hidden">
                <div className="relative h-4 rounded-full bg-gradient-to-r from-red-500 via-rose-500 to-red-600 
                                shadow-lg transition-all duration-700 ease-out group-hover:shadow-red-500/50"
                     style={{
                       width: `${Math.max(Math.min(scrapPercentage, 100), showScrap > 0 ? 1 : 0)}%`
                     }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]"></div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div> {/* END GRID */}

    </div>
  )
}
