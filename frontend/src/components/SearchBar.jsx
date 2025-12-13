// src/components/SearchBar.jsx
import React, { useState } from 'react'

// Use env base when available, fallback to localhost
const API_BASE = import.meta.env?.VITE_API_BASE || 'http://localhost:4000'

export function SearchBar({ onResults, onError }) {
  const [searchType, setSearchType] = useState('uid') // uid | productid | productmodelname | productvariant | productionstartdate | productionenddate | status | endoflineuid
  const [searchValue, setSearchValue] = useState('')
  const [searchHistory, setSearchHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [searchWarning, setSearchWarning] = useState('')
  const [loading, setLoading] = useState(false) // NEW: show buffering while fetching


  const emitError = (msg) => {
    setSearchWarning(msg)
    if (onError) onError(msg)
    // eslint-disable-next-line no-console
    console.error(msg)
  }

  const getQueryValue = () => (searchValue || '').trim()

  async function fetchJson(url) {
    const res = await fetch(url, { redirect: 'follow' }) // follow 307 from /api/trace → /uid-contains
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  }

  // Merge all pages for uid-contains when needed
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
        if (Array.isArray(json.data) && json.data.length) {
          results.push(json.data)
        }
      }
    }

    await Promise.all(Array.from({ length: Math.min(concurrency, pages.length) }, () => worker()))
    return all.concat(...results)
  }

  // Keep only the latest row per UID (safety)
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
    const value = getQueryValue()
    if (!value) return
    setLoading(true)

    try {
      let payload = []

      if (searchType === 'uid') {
        // Try exact UID via main route.
        const exactUrl = `${API_BASE}/api/trace?uid=${encodeURIComponent(value)}`
        const exact = await fetchJson(exactUrl)

        // If backend redirected/empty, do a full contains sweep
        const asArray = Array.isArray(exact?.data) ? exact.data : (Array.isArray(exact) ? exact : [])
        if (asArray.length > 0) {
          payload = asArray
        } else {
          const limit = 2000
          const firstUrl = `${API_BASE}/api/trace/uid-contains?term=${encodeURIComponent(value)}&page=1&limit=${limit}`
          const first = await fetchJson(firstUrl)
          payload = await fetchAllPages({ term: value, limit, first })
        }
      } else if (searchType === 'endoflineuid') {
        // End-of-line UID exact (Part 3)
        const url = `${API_BASE}/api/trace?endoflineuid=${encodeURIComponent(value)}`
        const data = await fetchJson(url)
        payload = data && data.data !== undefined ? data.data : data
      } else {
        // Other columns exact (Part 4)
        const url = `${API_BASE}/api/trace?${encodeURIComponent(searchType)}=${encodeURIComponent(value)}`
        const data = await fetchJson(url)
        payload = data && data.data !== undefined ? data.data : data
      }

      payload = uniqueLatestByUid(payload)
      if (onResults) onResults(payload)

      if (searchValue.trim()) {
        setSearchHistory((prev) => {
          const v = searchValue.trim()
          const next = [v, ...prev.filter((s) => s !== v)]
          return next.slice(0, 5)
        })
      }
    } catch (err) {
      emitError('Search error: ' + err.message)
      if (onResults) onResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSearchValue('')
    setSearchWarning('')
    if (onResults) onResults([])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  const selectHistoryItem = (item) => {
    setSearchValue(item)
    setShowHistory(false)
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-200">Search</h2>

      {searchWarning && (
        <div className="mb-2 text-sm text-yellow-700 bg-yellow-100 border border-yellow-300 rounded px-3 py-2">
          {searchWarning}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2 relative">
          <label htmlFor="orderSearch" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Find
          </label>

          <div className="relative">
            <input
              type="text"
              id="orderSearch"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white border-0 outline-none"
              placeholder="Enter value"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => searchHistory.length > 0 && setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 150)}
              aria-label="Find"
              disabled={loading} 
            />

            {searchValue && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-300"
                onClick={() => setSearchValue('')}
                aria-label="Clear find input"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {showHistory && searchHistory.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md border dark:border-gray-600 max-h-60 overflow-auto">
              <div className="py-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b dark:border-gray-600">
                  Recent Searches
                </div>

                {searchHistory.map((item, index) => (
                  <div
                    key={index}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      selectHistoryItem(item)
                    }}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:bg-gray-600 cursor-pointer flex justify-between items-center"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-300"
                      
                      onMouseDown={(e) => {    // # changed onClick → onMouseDown for reliable delete before blur
                        e.stopPropagation()
                        e.preventDefault()
                        setSearchHistory((prev) => prev.filter((i) => i !== item))  // # now removes item instantly
                        }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="searchBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search by
          </label>
          <select
            id="searchBy"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white border-0 outline-none"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="uid">UID</option>
            <option value="productid">Product ID</option>
            <option value="productmodelname">Product Model</option>
            <option value="productvariant">Product Variant</option>
            <option value="productionstartdate">Production Start Date</option>
            <option value="productionenddate">Production End Date</option>
            <option value="status">Status</option>
            <option value="endoflineuid">End of line UID</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-2 flex items-end gap-2">
      <button
        type="button"
        onClick={handleSearch}
        disabled={loading}                       // NEW
        aria-busy={loading ? 'true' : 'false'}   // NEW
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-800 transition-colors duration-200"
      >
        {loading ? (
          // NEW: spinner
          <>
            <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
              <path d="M4 12a8 8 0 018-8" fill="currentColor" />
            </svg>
            Fetching...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Find
          </>
        )}
      </button>


        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:text-gray-200 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>
      </div>
    </div>
  )
}
