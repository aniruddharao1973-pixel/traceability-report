// src\components\ReworkPendingProdTable.jsx
import React, { useEffect, useState } from "react";
import ReportControls from "./ReportControls";
// import SummaryCardReworkPendingfromprod from "./SummaryCardReworkPendingfromprod";


export function ReworkPendingProdTable({ reportData }) {
  const [localRows, setLocalRows] = useState([]);

  // ✅ Update local data when reportData changes
    useEffect(() => {
    if (reportData) {
        // Handle both /complete-data (tableData) and /uid/:uid (tableData) responses
        if (Array.isArray(reportData.tableData)) {
        setLocalRows(reportData.tableData);
        } else if (Array.isArray(reportData.records)) {
        setLocalRows(reportData.records);
        } else {
        setLocalRows([]);
        }
        console.log('Local rows updated:', localRows);
    } else {
        setLocalRows([]);
    }
    }, [reportData]);
    // console.log('Local rows updated:', localRows);

  if (!localRows || localRows.length === 0) {
    return (
      <div className="text-center mt-10 text-lg font-semibold text-gray-500">
        No rework pending data available
      </div>
    );
  }

  return (
    <section className="rework-pending-container mx-auto text-center" style={{ maxWidth: '1400px' }}>
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

      {/* ✅ Summary Card */}
      {/* {reportData?.header && (
        <SummaryCardReworkPendingfromprod
        modelName={reportData.header.model || "All Models"}
        variant={reportData.header.variant || "All Variants"}
        displayFromRaw={reportData.header.fromDate}
        displayToRaw={reportData.header.toDate}
        fromTime={reportData.header.fromTime}
        toTime={reportData.header.toTime}
        approvedCount={reportData.header.approvedCount || localRows.length}
        badgeColor="#10b981"
        />
      )} */}

      {/* ✅ Main Table */}
      <div id="rework-report-area" className="overflow-x-auto border-none rounded-xl shadow-lg bg-gradient-to-br from-purple-200 via-violet-200 to-indigo-200 p-4">
        <table className="w-full border-collapse text-sm bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gradient-to-br from-slate-600 via-slate-500 to-blue-700 text-white font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">UID</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">EQUIPMENT</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">PRODUCT ID</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">MODEL</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">VARIANT</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">DEFECTCODE</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">DESCRIPTION</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">REWORK BOOK DATE</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">REWORK APPROVED</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">REWORK EQUIPMENT</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">OPERATOR</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">SHIFT</th>
            </tr>
          </thead>

          <tbody>
            {localRows.map((row, index) => (
              <tr key={index} className="hover:bg-gradient-to-r hover:from-pink-50 hover:via-rose-50 hover:to-blue-50 transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
                <td className="border border-gray-200 p-3 text-gray-700 font-mono font-semibold">
                    {row.Uid || row.Unit || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-semibold">
                  {row.Equipment || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-semibold">
                  {row.ProductId || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-semibold">
                  {row.Model || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-semibold">
                  {row.Variant || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-semibold">
                  {row.Defectcode || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 text-left max-w-xs font-semibold">
                  <div className="truncate" title={row.Description}>
                    {row.Description || "—"}
                  </div>
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-semibold text-xs">
                  {row.ReworkBookDate || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-semibold text-xs">
                  {row.ReworkApprovedDateTime || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-semibold">
                  {row.ReworkEquipment || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-semibold">
                  {row.Operator || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-semibold">
                  {row.SMR || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export PDF button placed below the table */}
      <div className="mt-6 no-print">
        <ReportControls uid="rework_pending_production" reportType="rework-pending" />
      </div>
    </section>
  );
}