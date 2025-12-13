// import React, { useState, useRef, useEffect } from 'react'
// import { useTheme } from '../contexts/ThemeContext'

// const API_BASE = import.meta.env?.VITE_API_BASE || 'http://localhost:4000'

// export function Header({ onSearchResults, onSearchError }) {
//   const { theme, toggleTheme } = useTheme()
//   const [isProfileOpen, setIsProfileOpen] = useState(false)
//   const [isNotificationOpen, setIsNotificationOpen] = useState(false)
//   const [isSearchOpen, setIsSearchOpen] = useState(false)
  
//   // Search states
//   const [searchType, setSearchType] = useState('uid')
//   const [searchValue, setSearchValue] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [searchWarning, setSearchWarning] = useState('')

//   // refs for outside-click detection
//   const profileRef = useRef(null)
//   const notifRef = useRef(null)
//   const searchRef = useRef(null)
//   const profileBtnRef = useRef(null)
//   const notifBtnRef = useRef(null)
//   const searchBtnRef = useRef(null)

//   const closeAll = () => {
//     setIsProfileOpen(false)
//     setIsNotificationOpen(false)
//     setIsSearchOpen(false)
//   }

//   const toggleProfileDropdown = () => {
//     setIsProfileOpen((prev) => {
//       const next = !prev
//       if (next) {
//         setIsNotificationOpen(false)
//         setIsSearchOpen(false)
//       }
//       return next
//     })
//   }

//   const toggleNotificationDropdown = () => {
//     setIsNotificationOpen((prev) => {
//       const next = !prev
//       if (next) {
//         setIsProfileOpen(false)
//         setIsSearchOpen(false)
//       }
//       return next
//     })
//   }

//   const toggleSearchDropdown = () => {
//     setIsSearchOpen((prev) => {
//       const next = !prev
//       if (next) {
//         setIsProfileOpen(false)
//         setIsNotificationOpen(false)
//       }
//       return next
//     })
//   }

//   // close dropdowns on outside click
//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (profileRef.current && profileRef.current.contains(e.target)) return
//       if (profileBtnRef.current && profileBtnRef.current.contains(e.target)) return
//       if (notifRef.current && notifRef.current.contains(e.target)) return
//       if (notifBtnRef.current && notifBtnRef.current.contains(e.target)) return
//       if (searchRef.current && searchRef.current.contains(e.target)) return
//       if (searchBtnRef.current && searchBtnRef.current.contains(e.target)) return
//       closeAll()
//     }

//     document.addEventListener('click', handleClickOutside)
//     return () => document.removeEventListener('click', handleClickOutside)
//   }, [])

//   // close dropdowns on Escape key
//   useEffect(() => {
//     function handleEsc(e) {
//       if (e.key === 'Escape') {
//         closeAll()
//       }
//     }
//     document.addEventListener('keydown', handleEsc)
//     return () => document.removeEventListener('keydown', handleEsc)
//   }, [])

//   // Search functionality
//   const emitError = (msg) => {
//     setSearchWarning(msg)
//     if (onSearchError) onSearchError(msg)
//     console.error(msg)
//   }

//   async function fetchJson(url) {
//     const res = await fetch(url, { redirect: 'follow' })
//     if (!res.ok) throw new Error(`HTTP ${res.status}`)
//     return res.json()
//   }

//   async function fetchAllPages({ term, limit = 2000, first }) {
//     const total = Number(first.total || 0)
//     const totalPages = Math.max(1, Math.ceil(total / limit))
//     let all = Array.isArray(first.data) ? first.data : []
//     if (totalPages === 1) return all

//     const pages = []
//     for (let p = 2; p <= totalPages; p++) pages.push(p)

//     const concurrency = 8
//     let i = 0
//     const results = []

//     async function worker() {
//       while (i < pages.length) {
//         const page = pages[i++]
//         const url = `${API_BASE}/api/trace/uid-contains?term=${encodeURIComponent(term)}&page=${page}&limit=${limit}`
//         const json = await fetchJson(url)
//         if (Array.isArray(json.data) && json.data.length) {
//           results.push(json.data)
//         }
//       }
//     }

//     await Promise.all(Array.from({ length: Math.min(concurrency, pages.length) }, () => worker()))
//     return all.concat(...results)
//   }

//   function uniqueLatestByUid(rows) {
//     const byUid = new Map()
//     for (const r of rows || []) {
//       const uid = (r.uid || r.UID || r._uid || '').trim()
//       if (!uid) continue
//       const curr = byUid.get(uid)
//       const currStart = curr?.productionstartdate || curr?._startDate || ''
//       const nextStart = r.productionstartdate || r._startDate || ''
//       if (!curr || String(nextStart) > String(currStart)) {
//         byUid.set(uid, r)
//       }
//     }
//     return Array.from(byUid.values())
//   }

//   const handleSearch = async () => {
//     setSearchWarning('')
//     const value = searchValue.trim()
//     if (!value) return
//     setLoading(true)

//     try {
//       let payload = []

//       if (searchType === 'uid') {
//         const exactUrl = `${API_BASE}/api/trace?uid=${encodeURIComponent(value)}`
//         const exact = await fetchJson(exactUrl)

//         const asArray = Array.isArray(exact?.data) ? exact.data : (Array.isArray(exact) ? exact : [])
//         if (asArray.length > 0) {
//           payload = asArray
//         } else {
//           const limit = 2000
//           const firstUrl = `${API_BASE}/api/trace/uid-contains?term=${encodeURIComponent(value)}&page=1&limit=${limit}`
//           const first = await fetchJson(firstUrl)
//           payload = await fetchAllPages({ term: value, limit, first })
//         }
//       } else if (searchType === 'endoflineuid') {
//         const url = `${API_BASE}/api/trace?endoflineuid=${encodeURIComponent(value)}`
//         const data = await fetchJson(url)
//         payload = data && data.data !== undefined ? data.data : data
//       } else {
//         const url = `${API_BASE}/api/trace?${encodeURIComponent(searchType)}=${encodeURIComponent(value)}`
//         const data = await fetchJson(url)
//         payload = data && data.data !== undefined ? data.data : data
//       }

//       payload = uniqueLatestByUid(payload)
//       if (onSearchResults) onSearchResults(payload)
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

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault()
//       handleSearch()
//     }
//   }

//   return (
//     <header className="bg-gradient-to-r from-sky-400 to-purple-500 dark:from-purple-900 dark:to-indigo-900 shadow-lg transition-all duration-200">
//       <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
//         {/* <div className="flex items-center">
//           <h1 className="text-2xl font-bold text-white">
//             FactEyes<sup className="text-xs">®</sup>
//           </h1>
//         </div> */}
        
//         <div className="flex items-center">
//           <h1 className="text-2xl font-bold text-white">
//             FactEyes<sup className="text-xs">®</sup>
//           </h1>
//         </div>

//         <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3">
//           <div className="p-2 bg-white/20 rounded-lg">
//             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//             </svg>
//           </div>
//           <h2 className="text-lg font-bold text-white">
//             Reports Dashboard
//           </h2>
//         </div>
   
//         <div className="flex items-center space-x-4 mr-30">
//           {/* Search Icon */}
//           <div className="relative" ref={searchRef}>
//             <button
//               ref={searchBtnRef}
//               onClick={toggleSearchDropdown}
//               className="text-white hover:text-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
//               aria-haspopup="true"
//               aria-expanded={isSearchOpen}
//               aria-label="Search"
//               title="Search"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </button>

//                     
//           <div
//             className="absolute right-0 mt-2 w-96 bg-gradient-to-r from-sky-400 to-purple-500 dark:from-purple-900 dark:to-indigo-900 rounded-lg shadow-xl py-4 px-5 z-50 border dark:border-gray-700 transition-all duration-200 ease-in-out transform origin-top-right"
//             role="dialog"
//             aria-label="Search dialog"
//           >
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
//                   onKeyDown={handleKeyDown}
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

//                   <div className="flex gap-2 pt-2">
//                     <button
//                       type="button"
//                       onClick={handleSearch}
//                       disabled={loading}
//                       className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
//                     >
//                       {loading ? (
//                         <>
//                           <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
//                             <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
//                             <path d="M4 12a8 8 0 018-8" fill="currentColor" />
//                           </svg>
//                           Searching...
//                         </>
//                       ) : (
//                         <>
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                           </svg>
//                           Find
//                         </>
//                       )}
//                     </button>

//                     <button
//                       type="button"
//                       onClick={handleReset}
//                       className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors duration-200"
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                       </svg>
//                       Reset
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Theme Toggle */}
//           <button
//             onClick={toggleTheme}
//             className="text-white hover:text-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
//             aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
//             title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
//           >
//             {theme === 'dark' ? (
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
//               </svg>
//             ) : (
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
//               </svg>
//             )}
//           </button>

 
//           {/* User Profile */}
//           <div className="relative" ref={profileRef}>
//             <button
//               ref={profileBtnRef}
//               onClick={toggleProfileDropdown}
//               className="h-8 w-8 rounded-full bg-white text-purple-600 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 font-semibold"
//               aria-haspopup="true"
//               aria-expanded={isProfileOpen}
//               aria-label="User menu"
//               title="User menu"
//             >
//               <span>A</span>
//             </button>

//             {isProfileOpen && (
//               <div
//                 className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border dark:border-gray-700 transition-all duration-200 ease-in-out transform origin-top-right"
//                 role="menu"
//                 aria-label="User menu"
//               >
//                 <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">Your Profile</a>
//                 <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">Settings</a>
//                 <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-t dark:border-gray-700" role="menuitem">Sign out</a>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }



/// CODE ACTUALL STARTS HERE ///





// src\components\Header.jsx
import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { Calendar, Clock, FileText, Package, Zap, BarChart3, X, Info, Factory, ExternalLink } from 'lucide-react'
// import { useNavigate } from 'react-router-dom';
import AnalysisDashboard from './AnalysisDashboard';
import ReworkSelectorModal from "./ReworkSelectorModal";


const API_BASE = import.meta.env?.VITE_API_BASE || 'http://localhost:4000'

export function Header({ onSearchResults, onSearchError, selectedOrder, onReset, onSearchStart }) {
  const { theme, toggleTheme } = useTheme()
  // const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isReportsOpen, setIsReportsOpen] = useState(false)
  const [isReworkReportsOpen, setIsReworkReportsOpen] = useState(false)
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportUrl, setReportUrl] = useState("");
  const [iframeLoaded, setIframeLoaded] = useState(false);
  


  // Search states
  const [searchType, setSearchType] = useState('uid')
  const [searchValue, setSearchValue] = useState('')
  // const [loading, setLoading] = useState(false)
  const [searchWarning, setSearchWarning] = useState('')
  const [showUidToast, setShowUidToast] = useState(false);
  const [dialogContext, setDialogContext] = useState(''); // 'search' or 'report'

  // Reports states
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [fromTime, setFromTime] = useState('')
  const [toTime, setToTime] = useState('')
  const [includeDate, setIncludeDate] = useState(false)
  const [reportType, setReportType] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // refs for outside click
  const profileRef = useRef(null)
  const searchRef = useRef(null)
  const reportsRef = useRef(null)
  const profileBtnRef = useRef(null)
  const searchBtnRef = useRef(null)
  const reportsBtnRef = useRef(null)
  const reworkBtnRef = useRef(null) // ← ADD THIS LINE
  const reworkRef = useRef(null) // ← ADD THIS LINE for the rework panel container



const closeAll = () => {
    setIsProfileOpen(false)
    setIsSearchOpen(false)
    setIsReportsOpen(false)
    setIsReworkReportsOpen(false)
}

  const toggleProfileDropdown = () => {
    setIsProfileOpen((prev) => !prev)
    setIsSearchOpen(false)
    setIsReportsOpen(false)
  }

  const toggleSearchDropdown = () => {
    setIsSearchOpen((prev) => !prev)
    setIsProfileOpen(false)
    setIsReportsOpen(false)
  }

  const toggleReportsDropdown = () => {
    setIsReportsOpen((prev) => !prev)
    setIsProfileOpen(false)
    setIsSearchOpen(false)
  }

  useEffect(() => {
  console.log('[Header] selectedOrder prop:', selectedOrder)
}, [selectedOrder])

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
      ) return
      closeAll()
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // ESC key close
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') closeAll()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  // ----- SEARCH LOGIC -----
  const emitError = (msg) => {
    setSearchWarning(msg)
    if (onSearchError) onSearchError(msg)
    console.error(msg)
  }

  async function fetchJson(url) {
    const res = await fetch(url, { redirect: 'follow' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  }

  async function fetchAllPages({ term, limit = 2000, first }) {
    const total = Number(first.total || 0)
    const totalPages = Math.max(1, Math.ceil(total / limit))
    let all = Array.isArray(first.data) ? first.data : []
    if (totalPages === 1) return all

    const pages = []
    for (let p = 2; p <= totalPages; p++) pages.push(p)
    const concurrency = 8
    let i = 0
    const results = []

    async function worker() {
      while (i < pages.length) {
        const page = pages[i++]
        const url = `${API_BASE}/api/trace/uid-contains?term=${encodeURIComponent(term)}&page=${page}&limit=${limit}`
        const json = await fetchJson(url)
        if (Array.isArray(json.data) && json.data.length) results.push(json.data)
      }
    }
    await Promise.all(Array.from({ length: Math.min(concurrency, pages.length) }, () => worker()))
    return all.concat(...results)
  }

  function uniqueLatestByUid(rows) {
    const byUid = new Map()
    for (const r of rows || []) {
      const uid = (r.uid || r.UID || r._uid || '').trim()
      if (!uid) continue
      const curr = byUid.get(uid)
      const currStart = curr?.productionstartdate || curr?._startDate || ''
      const nextStart = r.productionstartdate || r._startDate || ''
      if (!curr || String(nextStart) > String(currStart)) {
        byUid.set(uid, r)
      }
    }
    return Array.from(byUid.values())
  }


const handleSearch = async () => {
  setSearchWarning('')
  const value = searchValue.trim()
  
  // ✅ Show dialog if no value entered
  if (!value) {
    setDialogContext('search');
    setShowUidToast(true);
    setTimeout(() => setShowUidToast(false), 3000);
    return;
  }
  
  if (onSearchStart) onSearchStart() // This triggers the full-screen loader

  try {
    let payload = []
    
    // ✅ SIMPLIFIED: Use the main search endpoint for ALL search types
    const url = `${API_BASE}/api/trace?${searchType}=${encodeURIComponent(value)}`
    console.log('🔍 Searching with URL:', url)
    
    const data = await fetchJson(url)
    payload = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
    
    // If no results for UID, try partial search
    if (searchType === 'uid' && payload.length === 0) {
      console.log('🔍 No exact UID match, trying partial search')
      const limit = 2000
      const firstUrl = `${API_BASE}/api/trace/uid-contains?term=${encodeURIComponent(value)}&page=1&limit=${limit}`
      const first = await fetchJson(firstUrl)
      payload = await fetchAllPages({ term: value, limit, first })
    }
    
    payload = uniqueLatestByUid(payload)
    
    if (onSearchResults) onSearchResults(payload)
    setIsSearchOpen(false)
    
  } catch (err) {
    console.error('🔍 Search failed:', err)
    
    // More specific error messages
    if (err.message.includes('HTTP 400')) {
      emitError('Invalid search request. Please check your input.')
    } else if (err.message.includes('HTTP 404')) {
      emitError('No results found. Please try a different search term.')
    } else if (err.message.includes('HTTP 500')) {
      emitError('Server error. Please try again later.')
    } else {
      emitError('Search failed: ' + err.message)
    }
    
    if (onSearchResults) onSearchResults([])
  }
  // No finally block needed since we removed loading state
}

const handleReset = () => {
  setSearchValue('')
  setSearchWarning('')
  // DON'T call onSearchResults here - let parent handle it
}

  // ----- REPORTS PANEL LOGIC -----
  const handleQuickSelect = (days) => {
    const now = new Date()
    const past = new Date(now)
    past.setDate(now.getDate() - days)
    setFromDate(past.toISOString().slice(0, 10))
    setToDate(now.toISOString().slice(0, 10))
  }

  // ✅ NEW: Called by ReworkSelectorModal
const handleReworkGenerate = ({ uid, reportType }) => {
  if (!uid || !reportType) {
    alert('Please select a UID');
    return;
  }

  const params = new URLSearchParams({
    uid,
    includeDateInReport: 'false',
    userSelectedFromDate: '',
    userSelectedToDate: '',
    userSelectedFromTime: '00:00:00',
    userSelectedToTime: '23:59:59'
  });

  let iframeSrc = '';

  if (reportType === 'rework-approved') {
    iframeSrc = `/#/rework-approved-window?${params.toString()}`;
  } else if (reportType === 'rework-approved-pending-from-production') {
    iframeSrc = `/#/rework-pending-from-prod-window?${params.toString()}`;
  } else if (reportType === 'rework-pending') {
    iframeSrc = `/#/rework-pending-window?${params.toString()}`;
  }

  // 🔴 IMPORTANT: reset iframe state
  setIframeLoaded(false);

  setReportType(reportType);
  setReportUrl(iframeSrc);
  setIsReportModalOpen(true);
  setIsReworkReportsOpen(false);
};



  const handleApply = () => {
 

      if (reportType === 'analytics') {
    setIsAnalyticsOpen(true)       // instead of opening an iframe
    setIsReportsOpen(false)
    setIsLoading(false)
    return                          // exit early so iframe logic doesn’t run
  }

  setIsLoading(true);
  const uid = selectedOrder.uid;
  
  // ✅ Build URL with date parameters
  const params = new URLSearchParams({
    uid: encodeURIComponent(uid),
    includeDateInReport: includeDate.toString(),
    userSelectedFromDate: fromDate || '',
    userSelectedToDate: toDate || '',
    userSelectedFromTime: fromTime || '00:00:00',
    userSelectedToTime: toTime || '23:59:59'
  });

let iframeSrc = '';

if (reportType === 'equipment') {
  iframeSrc = `/#/equipment-pass-rate-window?${params.toString()}`;
  console.log('🔗 Opening Equipment Pass Rate Report');
} else {
  iframeSrc = `/#/traceability-window?${params.toString()}`;
  console.log('🔗 Opening Traceability Report');
}


  console.log('🔗 URL Parameters being sent:', Object.fromEntries(params));

  setTimeout(() => {
    setReportUrl(iframeSrc);
    setIsReportModalOpen(true);
    setIsLoading(false);
    setIsReportsOpen(false);
  }, 300);
};

  return (
  <header className="bg-gradient-to-r from-sky-400 to-purple-500 dark:from-purple-900 dark:to-indigo-900 shadow-lg transition-all duration-200">
    <div className="container mx-auto px-4 py-2 flex items-center justify-between relative">

        <div className="flex items-center ml-6">
        <h1 className="text-xl font-bold text-white">
          Micrologic<sup className="text-xs">®</sup>
        </h1>
        
        {/* Analytics 4.0 Launch Button - MOVED INSIDE THE SAME FLEX CONTAINER */}
        <button
          onClick={() => {
            if (!selectedOrder?.uid) {
              setDialogContext('analytics');
              setShowUidToast(true);
              setTimeout(() => setShowUidToast(false), 2000);
              return;
            }
            setIsAnalyticsOpen(true);
          }}
          className="ml-20 mr-8 group flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          title="Open Industry 4.0 Analytics Dashboard"
        >
          <BarChart3 className="h-5 w-5 text-white group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-sm font-semibold text-white whitespace-nowrap">
            Analytics 4.0
          </span>
        </button>
      </div>
        


      {/* Reports Dashboard Label */}
      <div className="absolute left-1/2 transform -translate-x-[75%] flex items-center gap-3">
        <div className="p-2.5 bg-white/25 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-bold text-white tracking-wide">
          Reports Dashboard
        </h2>
      </div>

        {/* Right Side Controls */}
      
        <div className="flex items-center space-x-4 mr-8 relative z-[60]">
{/* Traceability & Pass Rate Report Button */}
<div className="relative" ref={reportsRef}>
  <button
    ref={reportsBtnRef}
    onClick={toggleReportsDropdown}
    className="group flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
    aria-haspopup="true"
    aria-expanded={isReportsOpen}
    title="Traceability & Pass Rate Report"
  >
    <BarChart3 className="h-5 w-5 text-white group-hover:rotate-12 transition-transform duration-300" />
    <span className="text-sm font-semibold text-white whitespace-nowrap">
      Traceability & Pass Rate Report
    </span>
  </button>

    {/* Main Reports Panel */}
    {isReportsOpen && (
      <div className="absolute right-0 mt-2 w-[26rem] bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 z-[50] border border-purple-400/40">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-sky-400 to-purple-600 rounded-xl shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
            Reports Panel
          </h2>
        </div>

        {/* Quick selectors */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            // { label: 'Today', days: 0, icon: Calendar },
            // { label: 'Yesterday', days: 1, icon: Clock },
            // { label: 'Last 7 days', days: 7, icon: FileText },
            // { label: 'Last 30 days', days: 30, icon: Package },
          ].map(({ label, days, icon: Icon }) => (
            <button
              key={label}
              onClick={() => handleQuickSelect(days)}
              className="group px-5 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-sky-400 to-purple-500 text-white shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <Icon className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Date/time pickers */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">From Date</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
              className="w-full rounded-lg border border-purple-300 px-3 py-2 dark:bg-gray-800 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">To Date</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
              className="w-full rounded-lg border border-purple-300 px-3 py-2 dark:bg-gray-800 dark:text-white" />
          </div>
        </div> */}

        {/* Include Date */}
        {/* <div className="flex items-center gap-3 mb-4">
          <input type="checkbox" id="includeDate" checked={includeDate} onChange={(e) => setIncludeDate(e.target.checked)}
            className="h-5 w-5 text-purple-600 border-purple-400 rounded" />
          <label htmlFor="includeDate" className="text-sm font-semibold text-sky-800 dark:text-sky-200">
            Include Date in Report
          </label>
        </div> */}

        {/* Report Type */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1">Report Type</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}
            className="w-full rounded-lg border border-purple-300 px-3 py-2 dark:bg-gray-800 dark:text-white">
            <option value="">Select report type</option>
            <option value="traceability">Traceability Report Complete</option>
            <option value="equipment">Equipment Pass Rate Report</option>
          </select>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleApply}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 via-purple-500 to-sky-600 hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing Report...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" /> Generate Report
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
    className="group px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
    aria-haspopup="true"
    aria-expanded={isReworkReportsOpen}
    title="Rework Reports"
  >
    <span className="text-sm font-semibold text-white">Rework</span>
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
    className="glow-button group relative w-14 h-14 glass-effect hover:bg-white/30 rounded-2xl border border-white/40 hover:border-white/60 transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/40 flex items-center justify-center overflow-hidden animate-glow-pulse"
    title="Search"
  >
    <div className="shimmer-effect absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-6 w-6 text-white group-hover:rotate-90 group-hover:scale-110 transition-all duration-500 relative z-10" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </button>

  {isSearchOpen && (
    <div
      className="dropdown-enter absolute right-0 mt-4 w-[440px] glass-effect-strong dark:bg-gray-900/95 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/50 transition-all duration-300 ease-out transform origin-top-right z-[80] overflow-hidden"
      role="dialog"
      aria-label="Search dialog"
      style={{ 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 60px rgba(139, 92, 246, 0.3)'
      }}
    >
      {/* Header with enhanced gradient */}
      <div className="relative bg-gradient-to-r from-sky-400 via-purple-500 to-indigo-600 dark:from-purple-900 dark:to-indigo-900 px-6 py-4 border-b border-white/20 overflow-hidden">
        <div className="shimmer-effect absolute inset-0 opacity-50"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 glass-effect backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg animate-float">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white drop-shadow-lg">Search</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {searchWarning && (
          <div className="mb-4 text-sm text-amber-700 dark:text-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-md hover-lift">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{searchWarning}</span>
          </div>
        )}

        <div className="space-y-3">
          {/* Search input */}
          <div className="group">
            <label htmlFor="searchInput" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-500 to-purple-600"></span>
              Find
            </label>
            <input
              type="text"
              id="searchInput"
              className="input-glow block w-full rounded-2xl border-2 border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl focus:ring-0 focus:border-purple-500 dark:focus:border-purple-400 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 transition-all duration-300 placeholder:text-gray-400 hover:border-purple-400 hover-lift"
              placeholder="Enter search value..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          {/* Search type dropdown */}
          <div className="group">
            <label htmlFor="searchTypeSelect" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-500 to-purple-600"></span>
              Search by
            </label>
            <div className="relative">
              <select
                id="searchTypeSelect"
                className="input-glow block w-full rounded-2xl border-2 border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl focus:ring-0 focus:border-purple-500 dark:focus:border-purple-400 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 pr-12 transition-all duration-300 cursor-pointer appearance-none hover:border-purple-400 hover-lift font-medium"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="uid">UID</option>
                <option value="productid">Product ID</option>
                <option value="productmodelname">Product Model</option>
                <option value="productvariant">Product Variant</option>
                <option value="productionstartdate"> Production Start Date</option>
                <option value="productionenddate"> Production End Date</option>
                <option value="status"> Status</option>
                <option value="endoflineuid"> End of line UID</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-purple-500 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleSearch}
              className="glow-button flex-1 relative inline-flex items-center justify-center px-5 py-3 text-base font-bold rounded-2xl text-white bg-gradient-to-r from-sky-500 via-purple-600 to-indigo-600 hover:from-sky-600 hover:via-purple-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden group"
              style={{ boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)' }}
            >
              <div className="shimmer-effect absolute inset-0"></div>
              <svg className="w-5 h-5 mr-2 relative z-10 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="relative z-10">Find</span>
            </button>

            <button
              type="button"
              onClick={() => {
                console.log('Reset button clicked');
                handleReset();
                if (onReset) {
                  onReset();
                }
              }}
              className="inline-flex items-center px-5 py-3 text-base font-bold rounded-2xl text-gray-700 dark:text-gray-200 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 border-2 border-gray-300 dark:border-gray-500 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</div>

  {/* Theme Toggle */}
  <button onClick={toggleTheme} className="text-white hover:text-gray-100">
    {theme === 'dark' ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    )}
  </button>

  {/* Profile */}
  <div className="relative" ref={profileRef}>
    <button
      ref={profileBtnRef}
      onClick={toggleProfileDropdown}
      className="h-8 w-8 rounded-full bg-white text-purple-600 flex items-center justify-center font-semibold"
    >
      <span>A</span>
    </button>
    {isProfileOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border dark:border-gray-700 z-[9999]">
           <a href="#" className="block px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
          Your Profile
        </a>
          <a href="#" className="block px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
          Settings
        </a>
        <a href="#" className="block px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border-t dark:border-gray-700">
        Sign out
      </a>
      </div>
    )}
  </div>
</div>

        {/* ---------- Report Modal (child window) ---------- */}
        {isReportModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[90%] h-[90%] overflow-hidden relative border border-purple-300 flex flex-col">

              {/* Top toolbar */}
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60">
                <div className="flex items-center gap-3">
                <strong className="text-sm text-gray-700 dark:text-gray-200">
                {reportType === 'equipment'
                  ? 'Equipment Pass Rate Report'
                  : reportType === 'rework-approved'
                    ? 'Rework Approved Report'
                    : reportType === 'rework-approved-pending-from-production'
                      ? 'Rework Approved Pending From Production Report'
                      : reportType === 'rework-pending'
                        ? 'Rework Pending Report'
                        : 'Traceability Report'
                }

                </strong>
                  <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{reportUrl}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    title="Open in new tab"
                    onClick={() => {
                      // open the traceability window in a new tab for debugging / full-screen view
                      const w = window.open(reportUrl, '_blank');
                      if (w) w.focus();
                    }}
                    className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    Open in tab
                  </button>

                  <button
                    title="Refresh iframe"
                    onClick={() => {
                      // reload iframe by toggling src (a quick way)
                      setIframeLoaded(false);
                      const tmp = reportUrl;
                      setReportUrl('about:blank');
                      setTimeout(() => setReportUrl(tmp), 50);
                    }}
                    className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    Refresh
                  </button>

                  <button
                    onClick={() => {
                      setIsReportModalOpen(false);
                      setIframeLoaded(false);
                    }}
                    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
                    title="Close"
                  >
                    <X className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>
              </div>

              {/* Content area */}
              <div className="flex-1 relative bg-black/5 dark:bg-black">
                {/* Loading indicator shown until iframe fires onLoad */}
                {!iframeLoaded && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
                    <div className="text-center">
                      <div className="mb-2 animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-white/80"></div>
                      <div className="text-sm text-white/90">Loading report…</div>
                    </div>
                  </div>
                )}

                <iframe
                  src={reportUrl}
                  title="Traceability Report"
                  className="w-full h-full border-none rounded-b-2xl"
                  onLoad={() => setIframeLoaded(true)}
                  style={{ background: '#fff' }}
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
        {/* ---------- Analytics 4.0 Child Window ---------- */}
        {isAnalyticsOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center 
                        bg-white/60 backdrop-blur-md">            
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl w-[95%] h-[90%] overflow-hidden relative border border-blue-400/40 flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-blue-50/90 via-purple-50/90 to-blue-50/90 backdrop-blur-xl border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Factory className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-gray-900 font-bold text-lg">
                      Industry 4.0 Analytics Dashboard
                    </h2>
                    <p className="text-gray-600 text-sm">UID: {selectedOrder?.uid}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                <button
                  title="Open in new tab"
                  onClick={() => window.open(`/#/analytics-window?uid=${selectedOrder?.uid}`, '_blank')}
                  className="px-4 py-2 text-sm rounded-xl bg-white/90 hover:bg-white text-gray-900 border border-gray-200/80 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in Tab</span>
                </button>
                  <button
                    onClick={() => setIsAnalyticsOpen(false)}
                    className="p-2 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                    title="Close"
                  >
                    <X className="w-5 h-5 text-gray-600 hover:text-gray-900" />
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
      {showUidToast && (
  <>
  <div 
    className="fixed inset-0 bg-brown/80 backdrop-blur-sm z-[99998] animate-dialog-fade"
    onClick={() => setShowUidToast(false)}
  />
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
     <div className="bg-gradient-to-br from-orange-600/90 to-orange-400/90 backdrop-blur-lg border border-orange-500/60 rounded-3xl shadow-2xl shadow-orange-700/30 w-full max-w-md animate-dialog-scale">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Info className="w-5 h-5 text-white" />
          </div>
            <h3 className="text-xl font-semibold text-white">
              {dialogContext === 'search' ? 'Input Required' : 'UID Selection Required'}
            </h3>
          </div>
          <button
            onClick={() => setShowUidToast(false)}
            className="w-8 h-8 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
          >
            {/* <X className="w-5 h-5 text-slate-400 hover:text-white" /> */}
          </button>
        </div>

        <div className="p-6">
        <p className="text-white text-sm leading-relaxed font-medium">
          {dialogContext === 'search'
            ? 'Please enter a traceability value to proceed with the search.'
            : 'Please select a valid UID from the list to proceed with the operation.'}
        </p>
        </div>

        <div className="p-6 pt-0">
          <button
            onClick={() => setShowUidToast(false)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  </>
)}
    </header>
)}

export default Header;
