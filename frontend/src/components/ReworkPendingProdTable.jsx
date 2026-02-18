

// src\components\ReworkPendingProdTable.jsx
import React, { useEffect, useState } from "react";

export function ReworkPendingProdTable({ reportData }) {
  const [localRows, setLocalRows] = useState([]);

  // Update local data when reportData changes
  useEffect(() => {
    if (reportData) {
      if (Array.isArray(reportData.tableData)) {
        setLocalRows(reportData.tableData);
      } else if (Array.isArray(reportData.records)) {
        setLocalRows(reportData.records);
      } else {
        setLocalRows([]);
      }
      console.log("Local rows updated:", localRows);
    } else {
      setLocalRows([]);
    }
  }, [reportData]);

  if (!localRows || localRows.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8 md:py-10 text-sm sm:text-base md:text-lg font-semibold text-gray-500">
        No rework pending data available
      </div>
    );
  }

  return (
    <section className="rework-pending-container mx-auto text-center w-full">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          #rework-report-area { width: 100%; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
        }
        
        /* Mobile table responsive styles */
        @media (max-width: 768px) {
          .table-wrapper {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .responsive-table {
            font-size: 11px;
          }
          .responsive-table th,
          .responsive-table td {
            padding: 6px 4px;
            white-space: nowrap;
          }
          .responsive-table thead th {
            font-size: 10px;
            padding: 8px 4px;
          }
          .description-cell {
            max-width: 150px;
            white-space: normal !important;
            word-break: break-word;
          }
        }
        
        /* Tablet styles */
        @media (min-width: 769px) and (max-width: 1024px) {
          .responsive-table {
            font-size: 12px;
          }
          .responsive-table th,
          .responsive-table td {
            padding: 10px 6px;
          }
        }
        
        /* Scroll indicator for mobile */
        .scroll-indicator {
          display: none;
        }
        @media (max-width: 768px) {
          .scroll-indicator {
            display: block;
            text-align: center;
            font-size: 11px;
            color: #666;
            padding: 4px;
            background: #f0f0f0;
            border-radius: 4px;
            margin-bottom: 8px;
          }
        }
      `}</style>

      <div className="scroll-indicator">← Swipe horizontally to see more →</div>

      {/* Main Table - Responsive wrapper */}
      <div
        id="rework-report-area"
        className="table-wrapper border-none rounded-lg sm:rounded-xl shadow-md sm:shadow-lg bg-gradient-to-br from-purple-200 via-violet-200 to-indigo-200 p-2 sm:p-3 md:p-4"
      >
        <table className="responsive-table w-full min-w-[900px] border-collapse text-xs sm:text-sm bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gradient-to-br from-slate-600 via-slate-500 to-blue-700 text-white font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-1.5 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider">
                UID
              </th>
              <th className="p-1.5 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider">
                EQUIPMENT
              </th>
              <th className="p-1.5 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider">
                PRODUCT ID
              </th>
              <th className="p-1.5 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider">
                MODEL
              </th>
              <th className="p-1.5 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider">
                VARIANT
              </th>
              <th className="p-1.5 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider">
                DEFECTCODE
              </th>
              <th className="p-1.5 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider">
                DESCRIPTION
              </th>
              <th className="p-1.5 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider">
                REWORK BOOK DATE
              </th>
              <th className="p-1.5 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider">
                REWORK APPROVED
              </th>
              <th className="p-1.5 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider">
                REWORK EQUIPMENT
              </th>
              <th className="p-1.5 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider">
                OPERATOR
              </th>
              <th className="p-1.5 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider">
                SHIFT
              </th>
            </tr>
          </thead>

          <tbody>
            {localRows.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-gradient-to-r hover:from-pink-50 hover:via-rose-50 hover:to-blue-50 transition-all duration-200 hover:shadow-sm md:hover:scale-[1.01]"
              >
                <td className="border border-gray-200 p-1 sm:p-2 md:p-3 text-gray-700 font-mono font-medium sm:font-semibold text-[10px] sm:text-xs md:text-sm">
                  {row.Uid || row.Unit || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 md:p-3 text-gray-700 font-medium sm:font-semibold text-[10px] sm:text-xs md:text-sm">
                  {row.Equipment || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 md:p-3 text-gray-700 font-medium sm:font-semibold text-[10px] sm:text-xs md:text-sm">
                  {row.ProductId || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 md:p-3 text-gray-700 font-medium sm:font-semibold text-[10px] sm:text-xs md:text-sm">
                  {row.Model || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 md:p-3 text-gray-700 font-medium sm:font-semibold text-[10px] sm:text-xs md:text-sm">
                  {row.Variant || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 md:p-3 text-gray-700 font-medium sm:font-semibold text-[10px] sm:text-xs md:text-sm">
                  {row.Defectcode || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 md:p-3 text-gray-700 text-left font-medium sm:font-semibold description-cell text-[10px] sm:text-xs md:text-sm">
                  <div
                    className="truncate sm:whitespace-normal"
                    title={row.Description}
                  >
                    {row.Description || "—"}
                  </div>
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 md:p-3 text-gray-700 font-medium sm:font-semibold text-[9px] sm:text-[10px] md:text-xs">
                  {row.ReworkBookDate || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 md:p-3 text-gray-700 font-medium sm:font-semibold text-[9px] sm:text-[10px] md:text-xs">
                  {row.ReworkApprovedDateTime || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 md:p-3 text-gray-700 font-medium sm:font-semibold text-[10px] sm:text-xs md:text-sm">
                  {row.ReworkEquipment || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 md:p-3 text-gray-700 font-medium sm:font-semibold text-[10px] sm:text-xs md:text-sm">
                  {row.Operator || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 md:p-3 text-gray-700 font-medium sm:font-semibold text-[10px] sm:text-xs md:text-sm">
                  {row.SMR || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export PDF button - Responsive positioning */}
    </section>
  );
}
