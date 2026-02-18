

// src\components\ReworkApprovedtable.jsx
import React, { useEffect, useState } from "react";

export function ReworkApprovedTable({ reportData }) {
  const [localRows, setLocalRows] = useState([]);

  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "—";

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      let hours = date.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;

      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    } catch (error) {
      return "—";
    }
  };

  useEffect(() => {
    if (reportData && Array.isArray(reportData)) {
      setLocalRows(reportData);
    } else {
      setLocalRows([]);
    }
  }, [reportData]);

  const renderStatusBadge = (status) => {
    let bg = "#6b7280";

    if (status === "PASS") bg = "linear-gradient(135deg, #10b981, #059669)";
    else if (status === "FAIL")
      bg = "linear-gradient(135deg, #ef4444, #dc2626)";
    else if (status === "REWORK DONE")
      bg = "linear-gradient(135deg, #f97316, #ea580c)";
    else if (status === "SCRAP")
      bg = "linear-gradient(135deg, #92400e, #78350f)";

    return (
      <div
        style={{
          display: "inline-block",
          padding: "4px 8px",
          background: bg,
          color: "#fff",
          borderRadius: 6,
          fontWeight: 600,
          textAlign: "center",
          fontSize: "10px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
        className="sm:px-3 sm:py-1.5 sm:text-xs"
      >
        {status || "UNKNOWN"}
      </div>
    );
  };

  const renderReworkCountBadge = (count) => {
    const reworkCount = parseInt(count) || 0;
    let bg = "#6b7280";

    if (reworkCount === 0) bg = "linear-gradient(135deg, #10b981, #059669)";
    else if (reworkCount === 1)
      bg = "linear-gradient(135deg, #f59e0b, #d97706)";
    else bg = "linear-gradient(135deg, #8b5cf6, #7c3aed)";

    return (
      <div
        style={{
          display: "inline-block",
          padding: "4px 8px",
          background: bg,
          color: "#fff",
          borderRadius: 6,
          fontWeight: 600,
          textAlign: "center",
          fontSize: "12px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
        }}
        className="sm:px-3 sm:py-1.5 sm:text-sm"
      >
        {reworkCount}
      </div>
    );
  };

  if (!localRows || localRows.length === 0) {
    return (
      <div className="text-center py-8 text-sm sm:text-base md:text-lg font-semibold text-gray-500">
        No rework data available
      </div>
    );
  }

  return (
    <section className="rework-report-container mx-auto text-center w-full">
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
        }
        
        /* Tablet styles */
        @media (min-width: 769px) and (max-width: 1024px) {
          .responsive-table {
            font-size: 12px;
          }
          .responsive-table th,
          .responsive-table td {
            padding: 8px 6px;
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
        id="rework-report-area"
        className="table-wrapper border-none rounded-lg sm:rounded-xl shadow-md sm:shadow-lg bg-gradient-to-br from-purple-200 via-violet-200 to-indigo-200 p-2 sm:p-3 md:p-4"
      >
        <table className="responsive-table w-full min-w-[800px] border-collapse text-xs sm:text-sm bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gradient-to-br from-slate-600 via-slate-500 to-blue-700 text-white font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-xs uppercase tracking-wider">
                SL NO
              </th>
              <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-xs uppercase tracking-wider">
                EQUIPMENT
              </th>
              <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-xs uppercase tracking-wider">
                EQUIPMENT ID
              </th>
              <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-xs uppercase tracking-wider">
                PRODUCTION START
              </th>
              <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-xs uppercase tracking-wider">
                PRODUCTION END
              </th>
              <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-xs uppercase tracking-wider">
                REWORK BOOK DATE
              </th>
              <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-xs uppercase tracking-wider">
                REWORK APPROVED DATE
              </th>
              <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-xs uppercase tracking-wider">
                DEFECT CODE
              </th>
              <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-xs uppercase tracking-wider">
                DESCRIPTION
              </th>
              <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-xs uppercase tracking-wider">
                REWORK COUNT
              </th>
              <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-xs uppercase tracking-wider">
                QUALITY REMARKS
              </th>
              <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-xs uppercase tracking-wider">
                OPERATOR
              </th>
              <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-xs uppercase tracking-wider">
                SHIFT
              </th>
              <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-xs uppercase tracking-wider">
                CYCLE TIME
              </th>
              <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[9px] sm:text-xs uppercase tracking-wider">
                STATUS
              </th>
            </tr>
          </thead>

          <tbody>
            {localRows.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-gradient-to-r hover:from-pink-50 hover:via-rose-50 hover:to-blue-50 transition-all duration-200 hover:shadow-sm md:hover:scale-[1.01]"
              >
                <td className="border border-gray-200 p-1 sm:p-2 text-gray-700 font-medium text-[10px] sm:text-xs md:text-sm">
                  {index + 1}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 text-gray-700 font-medium text-[10px] sm:text-xs md:text-sm">
                  {row.Equipment || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 text-gray-700 font-medium text-[10px] sm:text-xs md:text-sm">
                  {row.EquipmentId || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 text-gray-700 font-medium text-[10px] sm:text-xs md:text-sm">
                  {formatDateTimeLocal(row.ProductionStartDate)}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 text-gray-700 font-medium text-[10px] sm:text-xs md:text-sm">
                  {formatDateTimeLocal(row.ProductionEndDate)}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 text-gray-700 font-medium text-[10px] sm:text-xs md:text-sm">
                  {formatDateTimeLocal(row.RewarkBookDate)}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 text-gray-700 font-medium text-[10px] sm:text-xs md:text-sm">
                  {formatDateTimeLocal(row.RewarkApprovedDate)}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 text-gray-700 font-medium text-[10px] sm:text-xs md:text-sm">
                  {row.DefectCode || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 text-gray-700 font-medium text-[10px] sm:text-xs md:text-sm">
                  {row.Description || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 text-center">
                  {renderReworkCountBadge(row.RewarkCount)}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 text-gray-700 font-medium text-[10px] sm:text-xs md:text-sm">
                  {row.QualityRemarks || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 text-gray-700 font-medium text-[10px] sm:text-xs md:text-sm">
                  {row.Operator || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 text-gray-700 font-medium text-[10px] sm:text-xs md:text-sm">
                  {row.Shift || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 text-gray-700 font-medium text-[10px] sm:text-xs md:text-sm">
                  {row.CycleTime || "—"}
                </td>
                <td className="border border-gray-200 p-1 sm:p-2 text-center">
                  {renderStatusBadge(row.Status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
