// // src/components/ReportTable.jsx
// // NOTE: requires `jspdf` and `html2canvas` installed for Export PDF.
// // npm install jspdf html2canvas
// import React, { useEffect, useState } from 'react';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// export default function ReportTable({
//   uid = '',
//   rows = [],
//   loading,
//   error,
//   palette,
//   pageMaxWidth,
//   formatDateTime
// }) {
//   const [localRows, setLocalRows] = useState(rows);
//   const [mode, setMode] = useState('complete'); // 'complete' | 'detail'
//   const [expandedIdxs, setExpandedIdxs] = useState({});
//   const [fetching, setFetching] = useState(false);

//   // Only sync parent rows when in 'complete' mode.
//   useEffect(() => {
//     if (mode === 'complete') {
//       setLocalRows(rows || []);
//     }
//   }, [rows, mode]);

//   // When uid changes, if mode is detail fetch; when mode changes we fetch via onChange
//   useEffect(() => {
//     if (!uid) return;
//     if (mode === 'detail') {
//       fetchRows('detail');
//     } else if (!rows || rows.length === 0) {
//       fetchRows('complete');
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [uid]);

//   const fetchRows = async (selectedMode = 'complete') => {
//     if (!uid) return;
//     try {
//       setFetching(true);
//       const url = new URL('/api/trace', window.location.origin);
//       url.searchParams.set('uid', uid);

//       // send both variants to be robust
//       if (selectedMode === 'detail') {
//         url.searchParams.set('detail', '1');
//         url.searchParams.set('mode', 'detail');
//       }

//       // cache buster
//       url.searchParams.set('_ts', String(Date.now()));

//       // DEBUG log
//       console.log('[ReportTable] fetchRows -> GET', url.toString());

//       const resp = await fetch(url.toString());
//       if (!resp.ok) {
//         const txt = await resp.text();
//         throw new Error(txt || `HTTP ${resp.status}`);
//       }
//       const data = await resp.json();

//       console.log('[ReportTable] fetchRows response length:', Array.isArray(data) ? data.length : 'not-array', Array.isArray(data) ? data.slice(0,3) : null);

//       setLocalRows(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error('Failed to fetch report rows', err);
//     } finally {
//       setFetching(false);
//     }
//   };

//   const handleModeChange = (newMode) => {
//     setMode(newMode);
//     fetchRows(newMode);
//   };

//   const toggleExpand = (idx) => {
//     setExpandedIdxs(prev => ({ ...prev, [idx]: !prev[idx] }));
//   };

//   // // Export & print functions (unchanged)
//   // const exportPDF = async () => {
//   //   try {
//   //     const el = document.getElementById('report-area');
//   //     if (!el) {
//   //       alert('Report element not found (expected id="report-area")');
//   //       return;
//   //     }
//   //     const canvas = await html2canvas(el, { scale: 2, useCORS: true });
//   //     const imgData = canvas.toDataURL('image/png');

//   //     const pdf = new jsPDF('p', 'mm', 'a4');
//   //     const pdfWidth = pdf.internal.pageSize.getWidth();
//   //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//   //     const pageHeight = pdf.internal.pageSize.getHeight();

//   //     if (pdfHeight <= pageHeight) {
//   //       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//   //     } else {
//   //       const scale = canvas.width / pdfWidth;
//   //       const pageCanvas = document.createElement('canvas');
//   //       const pageCtx = pageCanvas.getContext('2d');
//   //       const pageCanvasHeightPx = Math.floor(pageHeight * scale);

//   //       pageCanvas.width = canvas.width;
//   //       pageCanvas.height = pageCanvasHeightPx;

//   //       let position = 0;
//   //       while (position < canvas.height) {
//   //         pageCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
//   //         pageCtx.drawImage(canvas, 0, position, canvas.width, pageCanvasHeightPx, 0, 0, canvas.width, pageCanvasHeightPx);
//   //         const pageImgData = pageCanvas.toDataURL('image/png');
//   //         pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, (pageCanvasHeightPx / canvas.width) * pdfWidth);
//   //         position += pageCanvasHeightPx;
//   //         if (position < canvas.height) pdf.addPage();
//   //       }
//   //     }

//   //     const safeUid = uid ? uid.replace(/\W+/g, '_') : 'report';
//   //     pdf.save(`traceability_${safeUid}.pdf`);
//   //   } catch (err) {
//   //     console.error('Export PDF failed', err);
//   //     alert('Export failed — check console for details.');
//   //   }
//   // };

//   const printReport = () => window.print();

//   // styles
//   const tableWrapperStyle = {
//     overflowX: 'auto',
//     border: `1px solid ${palette.page === '#fff' ? '#e0e0e0' : '#1f3a42'}`,
//     borderRadius: 4,
//     background: palette.page
//   };
//   const tableStyle = {
//     width: '100%',
//     borderCollapse: 'collapse',
//     fontSize: 13,
//     color: palette.text
//   };
//   const thTdBase = {
//     padding: '8px 10px',
//     border: `1px solid ${palette.page === '#fff' ? '#cfcfcf' : '#13333b'}`,
//     whiteSpace: 'normal',
//     wordBreak: 'break-word',
//     verticalAlign: 'top',
//     textAlign: 'left',
//     background: palette.page
//   };
//   const headerCellStyle = { ...thTdBase, background: palette.page === '#fff' ? '#f1f3f6' : '#0b2025', fontWeight: 700 };

//   const renderProductStatusBadge = (r) => {
//     const bg = (r.productstatus === 'PASS' ? '#2fa84f' : r.productstatus === 'FAIL' ? '#d9534f' : r.productstatus === 'SCRAP' ? '#e67e22' : r.productstatus === 'REWORK DONE' ? '#ccae37ff' : '#ccc');
//     return (
//       <div style={{
//         display: 'inline-block',
//         padding: '4px 10px',
//         background: bg,
//         color: '#fff',
//         borderRadius: 6,
//         fontWeight: 700,
//         minWidth: 64,
//         textAlign: 'center'
//       }}>
//         {r.productstatus || '—'}
//       </div>
//     );
//   };

//   return (
//     <section style={{ maxWidth: pageMaxWidth, margin: '0 auto', textAlign: 'center' }}>
//       <style>{`
//         @media print {
//           .no-print { display: none !important; }
//           #report-area { width: 100%; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; page-break-inside: avoid; }
//           table { page-break-inside: auto; }
//           tr { page-break-inside: avoid; page-break-after: auto; }
//           thead { display: table-header-group; }
//           tfoot { display: table-footer-group; }
//         }
//         @keyframes spin { 0%{transform:rotate(0deg);}100%{transform:rotate(360deg);} }
//       `}</style>

//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }} className="no-print">

//         <div style={{ display: 'flex', gap: 8 }}>
//           <button onClick={printReport} style={{ padding: '6px 10px' }}>Print</button>
//         </div>
//       </div>

//       {(loading || fetching) && (
//         <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//           <div style={{ width: 40, height: 40, border: '5px solid #f3f3f3', borderTop: '5px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
//         </div>
//       )}

//       {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

//       <div id="report-area">
//         {mode === 'detail' && <div style={{ textAlign: 'left', marginBottom: 8, color: '#666', fontSize: 13 }} className="no-print">Showing <strong>Detail</strong> (nested tests). Rows returned: {localRows.length}</div>}

//         <div style={tableWrapperStyle}>
//           <table style={tableStyle}>
//             <thead>
//               <tr>
//                 <th style={{ ...headerCellStyle, width: 280 }}>STATION</th>
//                 <th style={{ ...headerCellStyle, width: 160 }}>PRODUCTION START DATE</th>
//                 <th style={{ ...headerCellStyle, width: 160 }}>PRODUCTION END DATE</th>
//                 <th style={{ ...headerCellStyle, width: 160 }}>ASSEMBLY SEQUENCE</th>
//                 <th style={{ ...headerCellStyle, width: 70 }}>LSL</th>
//                 <th style={{ ...headerCellStyle, width: 150 }}>MEASURED VALUE</th>
//                 <th style={{ ...headerCellStyle, width: 70 }}>HSL</th>
//                 <th style={{ ...headerCellStyle, width: 70 }}>UNIT</th>
//                 <th style={{ ...headerCellStyle, width: 100 }}>TEST STATUS</th>
//                 <th style={{ ...headerCellStyle, width: 120 }}>REWORK COUNT</th>
//                 <th style={{ ...headerCellStyle, width: 160 }}>QUALITY REMARKS</th>
//                 <th style={{ ...headerCellStyle, width: 140 }}>OPERATOR</th>
//                 <th style={{ ...headerCellStyle, width: 80 }}>SHIFT</th>
//                 <th style={{ ...headerCellStyle, width: 120 }}>CYCLE TIME</th>
//                 <th style={{ ...headerCellStyle, width: 130 }}>PRODUCT STATUS</th>
//               </tr>
//             </thead>
//             <tbody>
//               {localRows && localRows.length > 0 ? (
//                 localRows.map((r, idx) => {
//                   if (mode === 'detail' && Array.isArray(r.tests)) {
//                     const expanded = !!expandedIdxs[idx];
//                     return (
//                       <React.Fragment key={idx}>
//                         <tr>
//                           <td style={{ ...thTdBase, cursor: 'pointer' }} onClick={() => toggleExpand(idx)}>
//                             <span className={`caret ${expanded ? 'expanded' : ''}`}>▶</span>
//                             {r.equipmentname || '—'}
//                           </td>
//                           <td style={{ ...thTdBase }}>{formatDateTime ? formatDateTime(r.productionstartdate) : r.productionstartdate}</td>
//                           <td style={{ ...thTdBase }}>{formatDateTime ? formatDateTime(r.productionenddate) : r.productionenddate}</td>
//                           <td style={{ ...thTdBase }}>—</td>
//                           <td style={{ ...thTdBase }}>—</td>
//                           <td style={{ ...thTdBase }}>—</td>
//                           <td style={{ ...thTdBase }}>—</td>
//                           <td style={{ ...thTdBase }}>—</td>
//                           <td style={{ ...thTdBase, textAlign: 'center' }}>—</td>
//                           <td style={{ ...thTdBase, textAlign: 'center' }}>{(r.reworkcount !== null && r.reworkcount !== undefined) ? r.reworkcount : '—'}</td>
//                           <td style={{ ...thTdBase }}>{r.qualityremarks || '—'}</td>
//                           <td style={{ ...thTdBase }}>{r.operatorid || '—'}</td>
//                           <td style={{ ...thTdBase, textAlign: 'center' }}>{r.shift || '—'}</td>
//                           <td style={{ ...thTdBase, textAlign: 'center' }}>{r.cycletime || '—'}</td>
//                           <td style={{ ...thTdBase, textAlign: 'center' }}>{renderProductStatusBadge(r)}</td>
//                         </tr>

//                         {expanded && r.tests.map((t, ti) => (
//                           <tr key={`t-${idx}-${ti}`} style={{ background: palette.page === '#fff' ? '#fafafa' : '#072025' }}>
//                             <td style={{ ...thTdBase, paddingLeft: 36 }}>{t.testid || '—'}</td>
//                             <td style={{ ...thTdBase }}>—</td>
//                             <td style={{ ...thTdBase }}>—</td>
//                             <td style={{ ...thTdBase }}>—</td>
//                             <td style={{ ...thTdBase }}>{t.lsl ?? '—'}</td>
//                             <td style={{ ...thTdBase }}>{t.value ?? '—'}</td>
//                             <td style={{ ...thTdBase }}>{t.hsl ?? '—'}</td>
//                             <td style={{ ...thTdBase }}>{t.unit ?? '—'}</td>
//                             <td style={{ ...thTdBase, textAlign: 'center' }}>{t.teststatus ?? '—'}</td>
//                             <td style={{ ...thTdBase, textAlign: 'center' }}>{(t.reworkcount !== null && t.reworkcount !== undefined) ? t.reworkcount : '—'}</td>
//                             <td style={{ ...thTdBase }}>{t.testremarks || '—'}</td>
//                             <td style={{ ...thTdBase }}>—</td>
//                             <td style={{ ...thTdBase, textAlign: 'center' }}>—</td>
//                             <td style={{ ...thTdBase, textAlign: 'center' }}>—</td>
//                             <td style={{ ...thTdBase, textAlign: 'center' }}>—</td>
//                           </tr>
//                         ))}
//                       </React.Fragment>
//                     );
//                   }

//                   return (
//                     <tr key={idx}>
//                       <td style={{ ...thTdBase }}>{r.equipmentname}</td>
//                       <td style={{ ...thTdBase }}>{formatDateTime ? formatDateTime(r.productionstartdate) : r.productionstartdate}</td>
//                       <td style={{ ...thTdBase }}>{formatDateTime ? formatDateTime(r.productionenddate) : r.productionenddate}</td>
//                       <td style={{ ...thTdBase }}>{r.testid || '—'}</td>
//                       <td style={{ ...thTdBase }}>{r.lsl ?? '—'}</td>
//                       <td style={{ ...thTdBase }}>{r.value ?? '—'}</td>
//                       <td style={{ ...thTdBase }}>{r.hsl ?? '—'}</td>
//                       <td style={{ ...thTdBase }}>{r.unit || '—'}</td>
//                       <td style={{ ...thTdBase, textAlign: 'center' }}>{r.teststatus || '—'}</td>
//                       <td style={{ ...thTdBase, textAlign: 'center' }}>{(r.reworkcount !== null && r.reworkcount !== undefined) ? r.reworkcount : '—'}</td>
//                       <td style={{ ...thTdBase }}>{r.qualityremarks || '—'}</td>
//                       <td style={{ ...thTdBase }}>{r.operatorid || '—'}</td>
//                       <td style={{ ...thTdBase, textAlign: 'center' }}>{r.shift || '—'}</td>
//                       <td style={{ ...thTdBase, textAlign: 'center' }}>{r.cycletime || '—'}</td>
//                       <td style={{ ...thTdBase, textAlign: 'center' }}>{renderProductStatusBadge(r)}</td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan={15} style={{ padding: 15, textAlign: 'center', color: palette.mutedText, fontWeight: 'bold', fontSize: '18px' }}>
//                     No Data Available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </section>
//   );
// }



// src/components/ReportTable.jsx
// NOTE: requires `jspdf` and `html2canvas` installed for Export PDF.
// npm install jspdf html2canvas



import React, { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function ReportTable({ reportData }) {
  const [localRows, setLocalRows] = useState([]);

  // ✅ Update local data when reportData changes
  useEffect(() => {
    if (reportData?.data && Array.isArray(reportData.data)) {
      setLocalRows(flattenReportData(reportData.data));
    } else if (Array.isArray(reportData)) {
      setLocalRows(flattenReportData(reportData));
    } else {
      setLocalRows([]);
    }
  }, [reportData]);

  // ✅ NEW: Function to flatten nested test data
  const flattenReportData = (data) => {
    if (!Array.isArray(data)) return [];
    
    const flattened = [];
    
    data.forEach(record => {
      // If this record has tests array, create a row for each test
      if (record.tests && Array.isArray(record.tests) && record.tests.length > 0) {
        record.tests.forEach(test => {
          flattened.push({
            ...record,        // Copy all parent record fields
            ...test,          // Override with test-specific fields
            tests: undefined, // Remove the nested tests array
            reworkcount: test.reworkcount ?? record.reworkcount ?? 0 // Ensure reworkcount is always set
          });
        });
      } else {
        // If no tests, use the record as-is but remove empty tests array
        const { tests, ...recordWithoutTests } = record;
        flattened.push({
          ...recordWithoutTests,
          reworkcount: recordWithoutTests.reworkcount ?? 0 // Ensure reworkcount is always set
        });
      }
    });
    
    return flattened;
  };

  // const printReport = () => window.print();

  // const exportPDF = async () => {
  //   try {
  //     const el = document.getElementById("report-area");
  //     if (!el) {
  //       alert('Report element not found (expected id="report-area")');
  //       return;
  //     }
  //     const canvas = await html2canvas(el, { scale: 2, useCORS: true });
  //     const imgData = canvas.toDataURL("image/png");

  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  //     const pageHeight = pdf.internal.pageSize.getHeight();

  //     if (pdfHeight <= pageHeight) {
  //       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //     } else {
  //       const scale = canvas.width / pdfWidth;
  //       const pageCanvas = document.createElement("canvas");
  //       const pageCtx = pageCanvas.getContext("2d");
  //       const pageCanvasHeightPx = Math.floor(pageHeight * scale);

  //       pageCanvas.width = canvas.width;
  //       pageCanvas.height = pageCanvasHeightPx;

  //       let position = 0;
  //       while (position < canvas.height) {
  //         pageCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
  //         pageCtx.drawImage(
  //           canvas,
  //           0,
  //           position,
  //           canvas.width,
  //           pageCanvasHeightPx,
  //           0,
  //           0,
  //           canvas.width,
  //           pageCanvasHeightPx
  //         );
  //         const pageImgData = pageCanvas.toDataURL("image/png");
  //         pdf.addImage(
  //           pageImgData,
  //           "PNG",
  //           0,
  //           0,
  //           pdfWidth,
  //           (pageCanvasHeightPx / canvas.width) * pdfWidth
  //         );
  //         position += pageCanvasHeightPx;
  //         if (position < canvas.height) pdf.addPage();
  //       }
  //     }

  //     pdf.save(`traceability_report.pdf`);
  //   } catch (err) {
  //     console.error("Export PDF failed", err);
  //     alert("Export failed — check console for details.");
  //   }
  // };

  const renderProductStatusBadge = (r) => {
    const bg =
      r.productstatus === "PASS"
        ? "#2fa84f"
        : r.productstatus === "FAIL"
        ? "#d9534f"
        : r.productstatus === "SCRAP"
        ? "#e67e22"
        : r.productstatus === "REWORK DONE"
        ? "#ccae37ff"
        : "#ccc";
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
        {r.productstatus || "—"}
      </div>
    );
  };

  if (!localRows || localRows.length === 0) {
    return (
      <div className="text-center mt-10 text-lg font-semibold text-gray-500">
        No report data available
      </div>
    );
  }

  return (
    <section className="mx-auto text-center" style={{ maxWidth: '1300px' }}>
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

      {/* <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
        className="no-print"
      >
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={exportPDF}
            style={{ padding: "6px 10px", background: "#4f46e5", color: "white", borderRadius: 6 }}
          >
            Export PDF
          </button>
          <button
            onClick={printReport}
            style={{ padding: "6px 10px", background: "#10b981", color: "white", borderRadius: 6 }}
          >
            Print
          </button>
        </div>
      </div> */}

      <div className="overflow-x-auto border-none rounded-xl shadow-lg bg-gradient-to-br from-purple-200 via-violet-200 to-indigo-200 p-4">
        <table className="w-full border-collapse text-sm bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gradient-to-br from-slate-600 via-slate-500 to-blue-700 text-white font-semibold sticky top-0 z-10">
            <tr>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">STATION</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">START DATE</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">END DATE</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">ASSEMBLY SEQUENCE</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">LSL</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">MEASURED VALUE</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">HSL</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">UNIT</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">TEST STATUS</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">REWORK COUNT</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">REMARKS</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">OPERATOR</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">SHIFT</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">CYCLE TIME</th>
              <th className="p-3 border-b-2 border-white/20 text-xs uppercase tracking-wider">PRODUCT STATUS</th>
            </tr>
          </thead>

          <tbody>
            {localRows.map((r, idx) => (
              <tr key={idx} className="hover:bg-gradient-to-r hover:from-pink-50 hover:via-rose-50 hover:to-blue-50 transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">{r.equipmentname || "—"}</td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">{r.productionstartdate || "—"}</td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">{r.productionenddate || "—"}</td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">{r.testid || "—"}</td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">{r.lsl ?? "—"}</td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">{r.value ?? "—"}</td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">{r.hsl ?? "—"}</td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">{r.unit || "—"}</td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">{r.teststatus || "—"}</td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">{r.reworkcount ?? 0}</td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">{r.qualityremarks || "—"}</td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">{r.operatorid || "—"}</td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">{r.shift || "—"}</td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">{r.cycletime || "—"}</td>
                <td className="border border-gray-200 p-3 text-gray-700 font-medium">{renderProductStatusBadge(r)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}