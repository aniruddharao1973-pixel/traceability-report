// src\components\reworkpendingtable.jsx
import React, { useEffect, useState } from "react";

export function ReportTable({ reportData }) {
  const [localRows, setLocalRows] = useState([]);

  // ✅ Update local data when reportData changes
  useEffect(() => {
    if (reportData?.data && Array.isArray(reportData.data)) {
      setLocalRows(reportData.data);
    } else if (Array.isArray(reportData)) {
      setLocalRows(reportData);
    } else {
      setLocalRows([]);
    }
  }, [reportData]);

  const renderReworkStatusBadge = (r) => {
    const bg = r.ReworkApprovedDateTime
      ? "#2fa84f" // Green for approved
      : "#e67e22"; // Orange for pending
    return (
      <div
        style={{
          display: "inline-block",
          padding: "4px 10px",
          background: bg,
          color: "#fff",
          borderRadius: 6,
          fontWeight: 700,
          minWidth: 64,
          textAlign: "center",
        }}
      >
        {r.ReworkApprovedDateTime ? "APPROVED" : "PENDING"}
      </div>
    );
  };

  if (!localRows || localRows.length === 0) {
    return (
      <div className="text-center mt-10 text-lg font-semibold text-gray-500">
        No rework pending data available
      </div>
    );
  }

  return (
    <section className="mx-auto text-center" style={{ maxWidth: "1800px" }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          #report-area { width: 100%; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
        }
        @keyframes spin { 0%{transform:rotate(0deg);}100%{transform:rotate(360deg);} }
      `}</style>

      <div className="overflow-x-auto border-none rounded-xl shadow-lg bg-gradient-to-br from-purple-200 via-violet-200 to-indigo-200 p-4">
        <table className="w-full border-collapse text-sm bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gradient-to-br from-slate-600 via-slate-500 to-blue-700 text-white font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">
                UID
              </th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">
                EQUIPMENT
              </th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">
                PRODUCT ID
              </th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">
                MODEL
              </th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">
                VARIANT
              </th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">
                DEFECT CODE
              </th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">
                DESCRIPTION
              </th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">
                REWORK BOOK DATE
              </th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">
                REWORK APPROVED DATE
              </th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">
                REWORK EQUIPMENT
              </th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">
                OPERATOR
              </th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">
                SHIFT
              </th>
              {/* <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">STATUS</th> */}
            </tr>
          </thead>

          <tbody>
            {localRows.map((r, idx) => (
              <tr
                key={idx}
                className="hover:bg-gradient-to-r hover:from-pink-50 hover:via-rose-50 hover:to-blue-50 transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
              >
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">
                  {r.Uid || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">
                  {r.Equipment || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">
                  {r.ProductId || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">
                  {r.Model || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">
                  {r.Variant || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">
                  {r.Defectcode || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">
                  {r.Description || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">
                  {r.ReworkBookDate || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">
                  {r.ReworkApprovedDateTime || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">
                  {r.ReworkEquipment || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">
                  {r.Operator || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">
                  {r.Shift || "—"}
                </td>
                {/* <td className="border border-gray-200 p-3 text-gray-700 font-medium">{renderReworkStatusBadge(r)}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
