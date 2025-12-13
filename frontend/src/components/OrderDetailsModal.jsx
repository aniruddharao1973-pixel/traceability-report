// OrderDetailsModal.jsx
import React, { useEffect, useState } from 'react'

// * Converted from TS -> JS, added timeline fetch and normalized fields
export function OrderDetailsModal({ order, isOpen, onClose }) {
  // * local state for timeline rows fetched from backend
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      // * prevent background scroll when modal open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  // * Fetch timeline rows when modal opens and order.uid (or order._uid) is available
  useEffect(() => {
    let mounted = true
    const uid = order?.uid || order?._uid || order?.UID || order?.Uid
    if (!isOpen || !uid) {
      // * clear timeline when closed or no uid
      if (mounted) {
        setTimeline([])
        setError(null)
        setLoading(false)
      }
      return
    }

    const fetchTimeline = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/trace?uid=${encodeURIComponent(uid)}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const payload = await res.json()
        // * backend normalization: accept { success, data } or raw array/object
        const rows = payload && payload.data !== undefined ? payload.data : payload
        if (!mounted) return
        // * ensure rows is array (if single object returned wrap it)
        const rowsArr = Array.isArray(rows) ? rows : rows ? [rows] : []
        setTimeline(rowsArr)
      } catch (err) {
        console.error('Failed to fetch timeline:', err)
        if (mounted) setError(err.message || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchTimeline()

    return () => {
      mounted = false
    }
  }, [isOpen, order])

  // * don't render if modal is closed
  if (!isOpen) return null

  // * derive display-safe fields from order (accept both normalized keys and legacy keys)
  const display = {
    id: order?.id ?? order?.ID ?? order?.orderId ?? '',
    uid: order?.uid ?? order?._uid ?? order?.UID ?? '',
    productId: order?._productid ?? order?.productid ?? order?.productId ?? '',
    model: order?._model ?? order?.productmodelname ?? order?.model ?? '',
    variant: order?._variant ?? order?.productvariant ?? order?.variant ?? '',
    startDate: order?._startDate ?? order?.productionstartdate ?? order?.startDate ?? '',
    endDate: order?._endDate ?? order?.productionenddate ?? order?.endDate ?? '',
    status: order?._status ?? order?.status ?? order?.productstatus ?? ''
  }

  // * map a timeline row into readable display values (safe)
  const mapRowDisplay = (r) => ({
    station: r.station || r.equipmentid || r.equipment || r.name || 'Unknown',
    status: (r.status || r.productstatus || '').toString(),
    tsStart: r.productionstartdate || r.startDate || r.timestamp || r.createdAt || '',
    tsEnd: r.productionenddate || r.endDate || ''
  })

  // * map status -> tailwind classes (accepts mixed case)
  const getStatusColor = (status) => {
    const s = (status || '').toString().toLowerCase()
    switch (s) {
      case 'completed':
      case 'complete':
      case 'pass':
      case 'passed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'in progress':
      case 'in_progress':
      case 'inprogress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'scrap':
      case 'scrapped':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' // * fixed default return
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto"> {/* * wrapper */}
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        {/* overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75" />
        </div>

        {/* center helper (hidden) */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* modal panel */}
        <div
          className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-2xl sm:w-full"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 id="modal-headline" className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                    Order Details
                  </h3>

                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(display.status)}`}>
                    {display.status || 'Unknown'}
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="border-b dark:border-gray-700 pb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{display.id}</p> {/* * safe access */}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">UID</p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{display.uid}</p> {/* * safe access */}
                      </div>
                    </div>
                  </div>

                  <div className="border-b dark:border-gray-700 pb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Product ID</p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{display.productId}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Model</p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{display.model}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Variant</p>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{display.variant}</p>
                    </div>
                  </div>

                  <div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{display.startDate}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{display.endDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Section */}
                  <div className="border-t dark:border-gray-700 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">Timeline</h4>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{loading ? 'Loading...' : timeline.length + ' steps'}</div>
                    </div>

                    {error && <div className="text-sm text-red-600 dark:text-red-400 mb-2">Error loading timeline: {error}</div>}

                    {!loading && timeline.length === 0 && !error && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">No timeline records found for this UID.</div>
                    )}

                    <div className="space-y-2 mt-2 max-h-48 overflow-auto">
                      {timeline.map((r, i) => {
                        const row = mapRowDisplay(r) // * normalized row values
                        return (
                          <div key={i} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                            <div>
                              <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{row.station}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{row.tsStart}{row.tsEnd ? ` → ${row.tsEnd}` : ''}</div>
                            </div>
                            <div>
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(row.status)}`}>{row.status || 'Unknown'}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
