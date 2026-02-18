// // src/components/ReportTable.jsx
// import React, { useEffect, useState } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// export function ReportTable({ reportData }) {
//   const [localRows, setLocalRows] = useState([]);

//   // ✅ Update local data when reportData changes
//   useEffect(() => {
//     if (reportData?.data && Array.isArray(reportData.data)) {
//       setLocalRows(flattenReportData(reportData.data));
//     } else if (Array.isArray(reportData)) {
//       setLocalRows(flattenReportData(reportData));
//     } else {
//       setLocalRows([]);
//     }
//   }, [reportData]);

//   // ✅ NEW: Function to flatten nested test data
//   const flattenReportData = (data) => {
//     if (!Array.isArray(data)) return [];

//     const flattened = [];

//     data.forEach((record) => {
//       // If this record has tests array, create a row for each test
//       if (
//         record.tests &&
//         Array.isArray(record.tests) &&
//         record.tests.length > 0
//       ) {
//         record.tests.forEach((test) => {
//           flattened.push({
//             ...record, // Copy all parent record fields
//             ...test, // Override with test-specific fields
//             tests: undefined, // Remove the nested tests array
//             reworkcount: test.reworkcount ?? record.reworkcount ?? 0, // Ensure reworkcount is always set
//           });
//         });
//       } else {
//         // If no tests, use the record as-is but remove empty tests array
//         const { tests, ...recordWithoutTests } = record;
//         flattened.push({
//           ...recordWithoutTests,
//           reworkcount: recordWithoutTests.reworkcount ?? 0, // Ensure reworkcount is always set
//         });
//       }
//     });

//     return flattened;
//   };

//   const renderProductStatusBadge = (r) => {
//     const bg =
//       r.productstatus === "PASS"
//         ? "#2fa84f"
//         : r.productstatus === "FAIL"
//           ? "#d9534f"
//           : r.productstatus === "SCRAP"
//             ? "#e67e22"
//             : r.productstatus === "REWORK DONE"
//               ? "#ccae37ff"
//               : "#ccc";
//     return (
//       <div
//         style={{
//           display: "inline-block",
//           padding: "2px 6px",
//           background: bg,
//           color: "#fff",
//           borderRadius: 4,
//           fontWeight: 600,
//           minWidth: 50,
//           textAlign: "center",
//           fontSize: "10px",
//           whiteSpace: "nowrap",
//         }}
//         className="sm:px-2.5 sm:py-1 sm:text-xs md:px-3 md:py-1.5 md:text-sm md:min-w-[64px]"
//       >
//         {r.productstatus || "—"}
//       </div>
//     );
//   };

//   if (!localRows || localRows.length === 0) {
//     return (
//       <div className="text-center py-6 sm:py-8 md:py-10 text-sm sm:text-base md:text-lg font-semibold text-gray-500">
//         No report data available
//       </div>
//     );
//   }

//   return (
//     <section className="mx-auto text-center w-full">
//       <style>{`
//         @media print {
//           .no-print { display: none !important; }
//           #report-area { width: 100%; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//           table { page-break-inside: auto; }
//           tr { page-break-inside: avoid; page-break-after: auto; }
//           thead { display: table-header-group; }
//           tfoot { display: table-footer-group; }
//         }

//         /* Mobile table responsive styles */
//         @media (max-width: 768px) {
//           .table-wrapper {
//             overflow-x: auto;
//             -webkit-overflow-scrolling: touch;
//           }
//           .responsive-table {
//             font-size: 10px;
//           }
//           .responsive-table th,
//           .responsive-table td {
//             padding: 4px;
//             white-space: nowrap;
//           }
//           .responsive-table thead th {
//             font-size: 9px;
//             padding: 6px 4px;
//           }
//           /* Hide less important columns on mobile */
//           .hide-mobile {
//             display: none;
//           }
//         }

//         /* Tablet styles */
//         @media (min-width: 769px) and (max-width: 1024px) {
//           .responsive-table {
//             font-size: 11px;
//           }
//           .responsive-table th,
//           .responsive-table td {
//             padding: 8px 6px;
//           }
//           .hide-mobile {
//             display: table-cell;
//           }
//         }

//         /* Desktop styles */
//         @media (min-width: 1025px) {
//           .responsive-table {
//             font-size: 14px;
//           }
//           .hide-mobile {
//             display: table-cell;
//           }
//         }

//         /* Scroll indicator for mobile */
//         .scroll-indicator {
//           display: none;
//         }
//         @media (max-width: 768px) {
//           .scroll-indicator {
//             display: block;
//             text-align: center;
//             font-size: 11px;
//             color: #666;
//             padding: 4px;
//             background: #f0f0f0;
//             border-radius: 4px;
//             margin-bottom: 8px;
//           }
//         }
//       `}</style>

//       <div className="scroll-indicator">
//         ← Swipe horizontally to see more columns →
//       </div>

//       <div className="table-wrapper overflow-x-auto border-none rounded-lg sm:rounded-xl shadow-md sm:shadow-lg bg-gradient-to-br from-purple-200 via-violet-200 to-indigo-200 p-2 sm:p-3 md:p-4">
//         <table className="responsive-table w-full min-w-[800px] border-collapse bg-white rounded-lg overflow-hidden shadow-md">
//           <thead className="bg-gradient-to-br from-slate-600 via-slate-500 to-blue-700 text-white font-semibold sticky top-0 z-10">
//             <tr>
//               <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider">
//                 STATION
//               </th>
//               <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider">
//                 START
//               </th>
//               <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider hide-mobile">
//                 END DATE
//               </th>
//               <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider">
//                 SEQUENCE
//               </th>
//               <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider hide-mobile">
//                 LSL
//               </th>
//               <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider">
//                 VALUE
//               </th>
//               <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider hide-mobile">
//                 HSL
//               </th>
//               <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider hide-mobile">
//                 UNIT
//               </th>
//               <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider">
//                 TEST
//               </th>
//               <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider">
//                 REWORK
//               </th>
//               <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider hide-mobile">
//                 REMARKS
//               </th>
//               <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider">
//                 OPERATOR
//               </th>
//               <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider hide-mobile">
//                 SHIFT
//               </th>
//               <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider hide-mobile">
//                 CYCLE
//               </th>
//               <th className="p-1 sm:p-2 md:p-3 border-b-2 border-white/20 text-[8px] sm:text-[10px] md:text-xs uppercase tracking-wider">
//                 STATUS
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {localRows.map((r, idx) => (
//               <tr
//                 key={idx}
//                 className="hover:bg-gradient-to-r hover:from-pink-50 hover:via-rose-50 hover:to-blue-50 transition-all duration-200 hover:shadow-sm md:hover:scale-[1.01]"
//               >
//                 <td className="border border-gray-200 p-0.5 sm:p-1.5 md:p-3 text-gray-700 font-medium text-[9px] sm:text-[11px] md:text-sm">
//                   {r.equipmentname || "—"}
//                 </td>
//                 <td className="border border-gray-200 p-0.5 sm:p-1.5 md:p-3 text-gray-700 font-medium text-[9px] sm:text-[11px] md:text-sm">
//                   {r.productionstartdate || "—"}
//                 </td>
//                 <td className="border border-gray-200 p-0.5 sm:p-1.5 md:p-3 text-gray-700 font-medium text-[9px] sm:text-[11px] md:text-sm hide-mobile">
//                   {r.productionenddate || "—"}
//                 </td>
//                 <td className="border border-gray-200 p-0.5 sm:p-1.5 md:p-3 text-gray-700 font-medium text-[9px] sm:text-[11px] md:text-sm">
//                   {r.testid || "—"}
//                 </td>
//                 <td className="border border-gray-200 p-0.5 sm:p-1.5 md:p-3 text-gray-700 font-medium text-[9px] sm:text-[11px] md:text-sm hide-mobile">
//                   {r.lsl ?? "—"}
//                 </td>
//                 <td className="border border-gray-200 p-0.5 sm:p-1.5 md:p-3 text-gray-700 font-medium text-[9px] sm:text-[11px] md:text-sm">
//                   {r.value ?? "—"}
//                 </td>
//                 <td className="border border-gray-200 p-0.5 sm:p-1.5 md:p-3 text-gray-700 font-medium text-[9px] sm:text-[11px] md:text-sm hide-mobile">
//                   {r.hsl ?? "—"}
//                 </td>
//                 <td className="border border-gray-200 p-0.5 sm:p-1.5 md:p-3 text-gray-700 font-medium text-[9px] sm:text-[11px] md:text-sm hide-mobile">
//                   {r.unit || "—"}
//                 </td>
//                 <td className="border border-gray-200 p-0.5 sm:p-1.5 md:p-3 text-gray-700 font-medium text-[9px] sm:text-[11px] md:text-sm">
//                   {r.teststatus || "—"}
//                 </td>
//                 <td className="border border-gray-200 p-0.5 sm:p-1.5 md:p-3 text-gray-700 font-medium text-[9px] sm:text-[11px] md:text-sm">
//                   {r.reworkcount ?? 0}
//                 </td>
//                 <td className="border border-gray-200 p-0.5 sm:p-1.5 md:p-3 text-gray-700 font-medium text-[9px] sm:text-[11px] md:text-sm hide-mobile">
//                   {r.qualityremarks || "—"}
//                 </td>
//                 <td className="border border-gray-200 p-0.5 sm:p-1.5 md:p-3 text-gray-700 font-medium text-[9px] sm:text-[11px] md:text-sm">
//                   {r.operatorid || "—"}
//                 </td>
//                 <td className="border border-gray-200 p-0.5 sm:p-1.5 md:p-3 text-gray-700 font-medium text-[9px] sm:text-[11px] md:text-sm hide-mobile">
//                   {r.shift || "—"}
//                 </td>
//                 <td className="border border-gray-200 p-0.5 sm:p-1.5 md:p-3 text-gray-700 font-medium text-[9px] sm:text-[11px] md:text-sm hide-mobile">
//                   {r.cycletime || "—"}
//                 </td>
//                 <td className="border border-gray-200 p-0.5 sm:p-1.5 md:p-3 text-center">
//                   {renderProductStatusBadge(r)}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   );
// }

// src/components/ReportTable.jsx
import React, { useEffect, useState } from "react";

export function ReportTable({ reportData }) {
  const [localRows, setLocalRows] = useState([]);

  // Update local data when reportData changes
  useEffect(() => {
    if (reportData?.data && Array.isArray(reportData.data)) {
      setLocalRows(flattenReportData(reportData.data));
    } else if (Array.isArray(reportData)) {
      setLocalRows(flattenReportData(reportData));
    } else {
      setLocalRows([]);
    }
  }, [reportData]);

  // Flatten nested tests
  const flattenReportData = (data) => {
    if (!Array.isArray(data)) return [];

    const flattened = [];

    data.forEach((record) => {
      if (Array.isArray(record.tests) && record.tests.length > 0) {
        record.tests.forEach((test) => {
          flattened.push({
            ...record,
            ...test,
            tests: undefined,
            reworkcount: test.reworkcount ?? record.reworkcount ?? 0,
          });
        });
      } else {
        const { tests, ...rest } = record;
        flattened.push({
          ...rest,
          reworkcount: rest.reworkcount ?? 0,
        });
      }
    });

    return flattened;
  };

  const renderProductStatusBadge = (r) => {
    const bg =
      r.productstatus === "PASS"
        ? "#16a34a"
        : r.productstatus === "FAIL"
          ? "#dc2626"
          : r.productstatus === "SCRAP"
            ? "#ea580c"
            : r.productstatus === "REWORK DONE"
              ? "#ca8a04"
              : "#9ca3af";

    return (
      <span
        style={{
          display: "inline-block",
          padding: "2px 8px",
          backgroundColor: bg,
          color: "#fff",
          borderRadius: 4,
          fontWeight: 600,
          fontSize: "10px",
          whiteSpace: "nowrap",
          minWidth: 60,
        }}
      >
        {r.productstatus || "—"}
      </span>
    );
  };

  if (!localRows.length) {
    return (
      <div className="text-center py-6 text-sm font-semibold text-gray-500">
        No report data available
      </div>
    );
  }

  return (
    <section className="w-full">
      <style>{`
        @media print {
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
          thead { display: table-header-group; }
        }

        @media (max-width: 768px) {
          .responsive-table {
            font-size: 10px;
          }
          .responsive-table th,
          .responsive-table td {
            padding: 4px;
            white-space: nowrap;
          }
        }
      `}</style>

      <div className="text-center text-xs text-gray-600 mb-2 md:hidden">
        ← Swipe horizontally to see more columns →
      </div>

      <div className="overflow-x-auto rounded-xl shadow-md bg-gradient-to-br from-purple-200 via-violet-200 to-indigo-200 p-2">
        <table className="responsive-table w-full min-w-[1500px] border-collapse bg-white rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-slate-700 to-blue-700 text-white">
            <tr>
              {[
                "STATION",
                "START",
                "END DATE",
                "SEQUENCE",
                "LSL",
                "VALUE",
                "HSL",
                "UNIT",
                "TEST",
                "REWORK",
                "REMARKS",
                "OPERATOR",
                "SHIFT",
                "CYCLE",
                "STATUS",
              ].map((h) => (
                <th
                  key={h}
                  className="p-2 border-b border-white/20 text-[10px] uppercase tracking-wide text-center"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {localRows.map((r, idx) => (
              <tr key={idx} className="hover:bg-blue-50 transition-colors">
                <td className="cell">{r.equipmentname || "—"}</td>
                <td className="cell">{r.productionstartdate || "—"}</td>
                <td className="cell">{r.productionenddate || "—"}</td>
                <td className="cell">{r.testid || "—"}</td>
                <td className="cell">{r.lsl ?? "—"}</td>
                <td className="cell">{r.value ?? "—"}</td>
                <td className="cell">{r.hsl ?? "—"}</td>
                <td className="cell">{r.unit || "—"}</td>
                <td className="cell">{r.teststatus || "—"}</td>
                <td className="cell">{r.reworkcount ?? 0}</td>
                <td className="cell">{r.qualityremarks || "—"}</td>
                <td className="cell">{r.operatorid || "—"}</td>
                <td className="cell">{r.shift || "—"}</td>
                <td className="cell">{r.cycletime || "—"}</td>
                <td className="cell text-center">
                  {renderProductStatusBadge(r)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .cell {
          border: 1px solid #e5e7eb;
          padding: 6px;
          font-size: 11px;
          text-align: center;
          color: #374151;
          white-space: nowrap;
        }
      `}</style>
    </section>
  );
}
