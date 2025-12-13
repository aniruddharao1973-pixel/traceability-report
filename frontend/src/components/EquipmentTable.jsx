// import React, { useEffect, useState } from "react";
// import ReportControls from "./ReportControls"; // Adjust path as needed

// export function EquipmentTable({ reportData }) {
//   const [localRows, setLocalRows] = useState([]);

//   // ✅ Update local data when reportData changes
//   useEffect(() => {
//     if (reportData && Array.isArray(reportData)) {
//       setLocalRows(reportData);
//     } else {
//       setLocalRows([]);
//     }
//   }, [reportData]);

//   // Equipment Count Badge with gradient colors based on count
//   const renderEquipmentCountBadge = (count) => {
//     let bg = "#4f46e5"; // Default blue

//     if (count >= 8000) bg = "linear-gradient(135deg, #10b981, #059669)"; // Green gradient for high counts
//     else if (count >= 5000) bg = "linear-gradient(135deg, #3b82f6, #2563eb)"; // Blue gradient
//     else if (count >= 1000) bg = "linear-gradient(135deg, #f59e0b, #d97706)"; // Amber gradient
//     else bg = "linear-gradient(135deg, #ef4444, #dc2626)"; // Red gradient for low counts

//     return (
//       <div
//         style={{
//           display: "inline-block",
//           padding: "6px 12px",
//           background: bg,
//           color: "#fff",
//           borderRadius: 8,
//           fontWeight: 700,
//           minWidth: 80,
//           textAlign: "center",
//           fontSize: "14px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
//         }}
//       >
//         {count?.toLocaleString() || "0"}
//       </div>
//     );
//   };

//   if (!localRows || localRows.length === 0) {
//     return (
//       <div className="text-center mt-10 text-lg font-semibold text-gray-500">
//         No equipment data available
//       </div>
//     );
//   }

//   return (
//     <section className="equipment-report-container mx-auto text-center" style={{ maxWidth: '1300px' }}>
//       <style>{`
//         @media print {
//           .no-print { display: none !important; }
//           #equipment-report-area { width: 100%; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//           table { page-break-inside: auto; }
//           tr { page-break-inside: avoid; page-break-after: auto; }
//           thead { display: table-header-group; }
//           tfoot { display: table-footer-group; }
//         }
//         @keyframes spin { 0%{transform:rotate(0deg);}100%{transform:rotate(360deg);} }
//       `}</style>

//       <div id="equipment-report-area" className="overflow-x-auto border-none rounded-xl shadow-lg bg-gradient-to-br from-purple-200 via-violet-200 to-indigo-200 p-4">
//         <table className="w-full border-collapse text-sm bg-white rounded-lg overflow-hidden shadow-md">
//           <thead className="bg-gradient-to-br from-slate-600 via-slate-500 to-blue-700 text-white font-semibold sticky top-0 z-10">
//             <tr>
//               <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">SL NO</th>
//               <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">PRODUCT ID</th>
//               <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">EQUIPMENT ID</th>
//               <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">EQUIPMENT NAME</th>
//               <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">EQUIPMENT COUNT</th>
//             </tr>
//           </thead>

//           <tbody>
//             {localRows.map((row, index) => (
//               <tr key={index} className="hover:bg-gradient-to-r hover:from-pink-50 hover:via-rose-50 hover:to-blue-50 transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
//                 <td className="border border-gray-200 p-3 text-gray-700 font-medium">
//                   {index + 1}
//                 </td>
//                 <td className="border border-gray-200 p-3 text-gray-700 font-medium">
//                   {row.productid || "—"}
//                 </td>
//                 <td className="border border-gray-200 p-3 text-gray-700 font-medium">
//                   {row.equipmentid || "—"}
//                 </td>
//                 <td className="border border-gray-200 p-3 text-gray-700 font-medium">
//                   {row.equipmentname || "—"}
//                 </td>
//                 <td className="border border-gray-200 p-3 text-center">
//                   {renderEquipmentCountBadge(row.equipment_count)}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Export PDF button placed below the table */}
//       <div className="mt-6 no-print">
//         <ReportControls uid="equipment_pass_rate" reportType="equipment" />
//       </div>
//     </section>
//   );
// }



import React, { useEffect, useState } from "react";
import ReportControls from "./ReportControls";

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
    else if (numericCount >= 5000) bg = "linear-gradient(135deg, #3b82f6, #2563eb)";
    else if (numericCount >= 1000) bg = "linear-gradient(135deg, #f59e0b, #d97706)";
    else bg = "linear-gradient(135deg, #ef4444, #dc2626)";

    return (
      <div
        style={{
          display: "inline-block",
          padding: "6px 12px",
          background: bg,
          color: "#fff",
          borderRadius: 8,
          fontWeight: 700,
          minWidth: 80,
          textAlign: "center",
          fontSize: "14px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
        }}
      >
        {numericCount.toLocaleString()}
      </div>
    );
  };

  if (!localRows || localRows.length === 0) {
    return (
      <div className="text-center mt-10 text-lg font-semibold text-gray-500">
        No equipment data available
      </div>
    );
  }

  return (
    <section className="equipment-report-container mx-auto text-center" style={{ maxWidth: '1300px' }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          #equipment-report-area { width: 100%; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
        }
        @keyframes spin { 0%{transform:rotate(0deg);}100%{transform:rotate(360deg);} }
      `}</style>

      <div id="equipment-report-area" className="overflow-x-auto border-none rounded-xl shadow-lg bg-gradient-to-br from-purple-200 via-violet-200 to-indigo-200 p-4">
        <table className="w-full border-collapse text-sm bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gradient-to-br from-slate-600 via-slate-500 to-blue-700 text-white font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">SL NO</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">PRODUCT ID</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">EQUIPMENT ID</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">EQUIPMENT NAME</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">EQUIPMENT COUNT</th>
            </tr>
          </thead>

          <tbody>
            {localRows.map((row, index) => (
              <tr key={index} className="hover:bg-gradient-to-r hover:from-pink-50 hover:via-rose-50 hover:to-blue-50 transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">
                  {index + 1}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">
                  {row.productid || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">
                  {row.equipmentid || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">
                  {row.equipmentname || "—"}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {/* ✅ FIX: Try multiple property names */}
                  {renderEquipmentCountBadge(
                    row.equipment_count || 
                    row.equipmentcount || 
                    row.count || 
                    row.record_count || 
                    0
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 no-print">
        <ReportControls uid="equipment_pass_rate" reportType="equipment" />
      </div>
    </section>
  );
}