// src\components\EquipmentTable.jsx
import React, { useEffect, useState } from "react";

export function EquipmentTable({ reportData }) {
  const [localRows, setLocalRows] = useState([]);

  // ✅ Update local data when reportData changes
  useEffect(() => {
    console.log("📊 EquipmentTable - Raw reportData:", reportData);

    if (reportData && Array.isArray(reportData)) {
      // Debug: Check what properties we have
      if (reportData.length > 0) {
        console.log("🔍 First item properties:", Object.keys(reportData[0]));
        console.log("🔍 First item values:", reportData[0]);
      }

      setLocalRows(reportData);
    } else {
      setLocalRows([]);
    }
  }, [reportData]);

  // Equipment Count Badge with gradient colors based on count
  const renderEquipmentCountBadge = (count) => {
    // ✅ FIX: Ensure count is a valid number
    const numericCount = Number(count) || 0;

    let bg = "#4f46e5";

    if (numericCount >= 8000) bg = "linear-gradient(135deg, #10b981, #059669)";
    else if (numericCount >= 5000)
      bg = "linear-gradient(135deg, #3b82f6, #2563eb)";
    else if (numericCount >= 1000)
      bg = "linear-gradient(135deg, #f59e0b, #d97706)";
    else bg = "linear-gradient(135deg, #ef4444, #dc2626)";

    return (
      <div
        style={{
          display: "inline-block",
          padding: "4px 8px",
          background: bg,
          color: "#fff",
          borderRadius: 6,
          fontWeight: 600,
          minWidth: 60,
          textAlign: "center",
          fontSize: "11px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
        }}
        className="sm:px-3 sm:py-1.5 sm:text-xs md:text-sm md:min-w-[70px] lg:min-w-[80px]"
      >
        {numericCount.toLocaleString()}
      </div>
    );
  };

  if (!localRows || localRows.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8 md:py-10 text-sm sm:text-base md:text-lg font-semibold text-gray-500">
        No equipment data available
      </div>
    );
  }

  return (
    <section className="equipment-report-container mx-auto text-center w-full">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          #equipment-report-area { width: 100%; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
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
        }
        
        /* Tablet styles */
        @media (min-width: 769px) and (max-width: 1024px) {
          .responsive-table {
            font-size: 12px;
          }
          .responsive-table th,
          .responsive-table td {
            padding: 10px 8px;
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

      <div
        id="equipment-report-area"
        className="table-wrapper border-none rounded-lg sm:rounded-xl shadow-md sm:shadow-lg bg-gradient-to-br from-purple-200 via-violet-200 to-indigo-200 p-2 sm:p-3 md:p-4"
      >
        <table className="responsive-table w-full min-w-[500px] sm:min-w-[600px] border-collapse text-xs sm:text-sm bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gradient-to-br from-slate-600 via-slate-500 to-blue-700 text-white font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-1.5 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider">
                SL NO
              </th>
              <th className="p-1.5 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider">
                PRODUCT ID
              </th>
              <th className="p-1.5 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider hidden sm:table-cell">
                EQUIPMENT ID
              </th>
              <th className="p-1.5 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider">
                EQUIPMENT NAME
              </th>
              <th className="p-1.5 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider">
                COUNT
              </th>
            </tr>
          </thead>

          <tbody>
            {localRows.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-gradient-to-r hover:from-pink-50 hover:via-rose-50 hover:to-blue-50 transition-all duration-200 hover:shadow-sm md:hover:scale-[1.01]"
              >
                <td className="border border-gray-200 p-1 sm:p-2 md:p-3 text-gray-700 font-medium text-[10px] sm:text-xs md:text-sm">
                  {index + 1}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 md:p-3 text-gray-700 font-medium text-[10px] sm:text-xs md:text-sm">
                  {row.productid || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 md:p-3 text-gray-700 font-medium text-[10px] sm:text-xs md:text-sm hidden sm:table-cell">
                  {row.equipmentid || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 md:p-3 text-gray-700 font-medium text-[10px] sm:text-xs md:text-sm">
                  {row.equipmentname || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 md:p-3 text-center">
                  {/* ✅ FIX: Try multiple property names */}
                  {renderEquipmentCountBadge(
                    row.equipment_count ||
                      row.equipmentcount ||
                      row.count ||
                      row.record_count ||
                      0,
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
