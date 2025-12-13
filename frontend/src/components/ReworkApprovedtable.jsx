// src\components\ReworkApprovedtable.jsx
import React, { useEffect, useState } from "react";
import ReportControls from "./ReportControls"; // Adjust path as needed

export function ReworkApprovedTable({ reportData }) {
  const [localRows, setLocalRows] = useState([]);


  // const formatDateTimeUTC = (dateString) => {
  //   if (!dateString) return "—";
  //   try {
  //     const date = new Date(dateString);
  //     if (isNaN(date.getTime())) return "—";
      
  //     const day = String(date.getUTCDate()).padStart(2, '0');
  //     const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  //     const year = date.getUTCFullYear();
      
  //     // Convert to 12-hour format with AM/PM
  //     let hours = date.getUTCHours();
  //     const ampm = hours >= 12 ? 'PM' : 'AM';
  //     hours = hours % 12;
  //     hours = hours ? hours : 12; // Convert 0 to 12
      
  //     const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  //     const seconds = String(date.getUTCSeconds()).padStart(2, '0');
      
  //     return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  //   } catch (error) {
  //     return "—";
  //   }
  // };


    const formatDateTimeLocal = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "—";
      
      // Use LOCAL methods instead of UTC
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      // Convert to 12-hour format with AM/PM using LOCAL time
      let hours = date.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    } catch (error) {
      return "—";
    }
  };


  // ✅ Update local data when reportData changes
  useEffect(() => {
    if (reportData && Array.isArray(reportData)) {
      setLocalRows(reportData);
    } else {
      setLocalRows([]);
    }
  }, [reportData]);

    // Status Badge with updated colors
  const renderStatusBadge = (status) => {
    let bg = "#6b7280"; // Default gray
    
    if (status === 'PASS') bg = "linear-gradient(135deg, #10b981, #059669)"; // Green
    else if (status === 'FAIL') bg = "linear-gradient(135deg, #ef4444, #dc2626)"; // Red
    else if (status === 'REWORK DONE') bg = "linear-gradient(135deg, #f97316, #ea580c)"; // Dark Orange
    else if (status === 'SCRAP') bg = "linear-gradient(135deg, #92400e, #78350f)"; // Dark Red/Brown

    return (
      <div
        style={{
          display: "inline-block",
          padding: "6px 12px",
          background: bg,
          color: "#fff",
          borderRadius: 8,
          fontWeight: 700,
          textAlign: "center",
          fontSize: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          textTransform: "uppercase"
        }}
      >
        {status || "UNKNOWN"}
      </div>
    );
  };

  // Rework Count Badge - Updated colors
  const renderReworkCountBadge = (count) => {
    const reworkCount = parseInt(count) || 0;
    let bg = "#6b7280"; // Default gray
    
    if (reworkCount === 0) bg = "linear-gradient(135deg, #10b981, #059669)"; // Green - No rework needed
    else if (reworkCount === 1) bg = "linear-gradient(135deg, #f59e0b, #d97706)"; // Amber - One rework
    else bg = "linear-gradient(135deg, #8b5cf6, #7c3aed)"; // Purple - Multiple reworks

    return (
      <div
        style={{
          display: "inline-block",
          padding: "6px 12px",
          background: bg,
          color: "#fff",
          borderRadius: 8,
          fontWeight: 700,
          textAlign: "center",
          fontSize: "14px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
        }}
      >
        {reworkCount}
      </div>
    );
  };

  if (!localRows || localRows.length === 0) {
    return (
      <div className="text-center mt-10 text-lg font-semibold text-gray-500">
        No rework data available
      </div>
    );
  }

  return (
    <section className="rework-report-container mx-auto text-center" style={{ maxWidth: '1400px' }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          #rework-report-area { width: 100%; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
        }
        @keyframes spin { 0%{transform:rotate(0deg);}100%{transform:rotate(360deg);} }
      `}</style>

      <div id="rework-report-area" className="overflow-x-auto border-none rounded-xl shadow-lg bg-gradient-to-br from-purple-200 via-violet-200 to-indigo-200 p-4">
        <table className="w-full border-collapse text-sm bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gradient-to-br from-slate-600 via-slate-500 to-blue-700 text-white font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">SL NO</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">EQUIPMENT</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">EQUIPMENT ID</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">PRODUCTION START</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">PRODUCTION END</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">REWORK BOOK DATE</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">REWORK APPROVED DATE</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">DEFECT CODE</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">DESCRIPTION</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">REWORK COUNT</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">QUALITY REMARKS</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">OPERATOR</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">SHIFT</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">CYCLE TIME</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">STATUS</th>
            </tr>
          </thead>

          <tbody>
            {localRows.map((row, index) => (
              <tr key={index} className="hover:bg-gradient-to-r hover:from-pink-50 hover:via-rose-50 hover:to-blue-50 transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
                <td className="border border-gray-200 p-2 text-gray-700 font-medium">
                  {index + 1}
                </td>
                <td className="border border-gray-200 p-2 text-gray-700 font-medium">
                  {row.Equipment || "—"}
                </td>
                <td className="border border-gray-200 p-2 text-gray-700 font-medium">
                  {row.EquipmentId || "—"}
                </td>
                <td className="border border-gray-200 p-2 text-gray-700 font-medium">
                  {formatDateTimeLocal(row.ProductionStartDate)}
                </td>
                <td className="border border-gray-200 p-2 text-gray-700 font-medium">
                   {formatDateTimeLocal(row.ProductionEndDate)}
                </td>
                <td className="border border-gray-200 p-2 text-gray-700 font-medium">
                  {formatDateTimeLocal(row.RewarkBookDate)}
                </td>
                <td className="border border-gray-200 p-2 text-gray-700 font-medium">
                   {formatDateTimeLocal(row.RewarkApprovedDate)}
                </td>
                <td className="border border-gray-200 p-2 text-gray-700 font-medium">
                  {row.DefectCode || "—"}
                </td>
                <td className="border border-gray-200 p-2 text-gray-700 font-medium">
                  {row.Description || "—"}
                </td>
                <td className="border border-gray-200 p-2 text-center">
                  {renderReworkCountBadge(row.RewarkCount)}
                </td>
                <td className="border border-gray-200 p-2 text-gray-700 font-medium">
                  {row.QualityRemarks || "—"}
                </td>
                <td className="border border-gray-200 p-2 text-gray-700 font-medium">
                  {row.Operator || "—"}
                </td>
                <td className="border border-gray-200 p-2 text-gray-700 font-medium">
                  {row.Shift || "—"}
                </td>
                <td className="border border-gray-200 p-2 text-gray-700 font-medium">
                  {row.CycleTime || "—"}
                </td>
                <td className="border border-gray-200 p-2 text-center">
                  {renderStatusBadge(row.Status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Export PDF button placed below the table */}
      {/* <div className="mt-6 no-print">
        <ReportControls uid="rework_approved" reportType="rework" />
      </div> */}
    </section>
  );
}