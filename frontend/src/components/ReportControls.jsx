// // src/components/ReportControls.jsx
// import React from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// export default function ReportControls({
//   uid,
//   keepThemeForExport = false,
//   reportType = "traceability",
// }) {
//   const isAppDark = () => {
//     return (
//       document.body.classList.contains("dark") ||
//       document.documentElement.getAttribute("data-theme") === "dark"
//     );
//   };

//   const forceLightBefore = () => {
//     document.body.classList.add("force-light-for-export");
//   };

//   const restoreThemeAfter = (wasDark) => {
//     document.body.classList.remove("force-light-for-export");
//   };

//   const getTargetElement = () => {
//     console.log("🔍 Looking for report container...");

//     if (reportType === "equipment") {
//       return document.getElementById("full-report-page");
//     } else if (reportType === "rework") {
//       return document.querySelector(".rework-report-container");
//     } else if (reportType === "rework-pending") {
//       return document.querySelector(".rework-report-container");
//     } else if (reportType === "ReworkPendingProdTable") {
//       return document.getElementById("full-report-page");
//     } else if (reportType === "reworkpendingtable") {
//       return document.getElementById("full-report-page");
//     } else {
//       return document.querySelector(".traceability-report-container");
//     }
//   };

//   const getFileName = () => {
//     const safeUid = uid ? uid.replace(/\W+/g, "_") : "report";
//     if (reportType === "equipment") {
//       return `equipment_pass_rate_${safeUid}.pdf`;
//     } else if (reportType === "rework") {
//       return `rework_approved_${safeUid}.pdf`;
//     } else if (reportType === "ReworkPendingProdTable") {
//       return `rework_pending_prod_table_${safeUid}.pdf`;
//     } else if (reportType === "reworkpendingtable") {
//       return `rework_pending_table_${safeUid}.pdf`;
//     } else {
//       return `traceability_${safeUid}.pdf`;
//     }
//   };

//   const exportPDF = async () => {
//     try {
//       console.log("📤 Starting PDF export for:", reportType);

//       const el = getTargetElement();

//       if (!el) {
//         console.error("❌ Element not found!");
//         const elementName =
//           reportType === "equipment"
//             ? "#full-report-page"
//             : reportType === "rework"
//             ? ".rework-report-container"
//             : reportType === "ReworkPendingProdTable"
//             ? "#full-report-page"
//             : reportType === "reworkpendingtable"
//             ? "#full-report-page"
//             : ".traceability-report-container";
//         alert(`Report container not found. Looking for: ${elementName}`);
//         return;
//       }

//       const appWasDark = isAppDark();
//       if (!keepThemeForExport && appWasDark) {
//         forceLightBefore();
//       }

//       // Hide export buttons during capture
//       const exportButtons = document.querySelector(".report-controls");
//       if (exportButtons) exportButtons.style.display = "none";

//       console.log("📸 Capturing full page with html2canvas...");

//       await new Promise((resolve) => setTimeout(resolve, 500));
//       const canvas = await html2canvas(el, {
//         scale: 3, // Increase from 2 to 3 for better quality
//         useCORS: true,
//         allowTaint: true, // Change from false to true
//         logging: true,
//         backgroundColor: "#ffffff",
//         scrollX: 0,
//         scrollY: -window.scrollY,
//         windowWidth: document.documentElement.offsetWidth,
//         windowHeight: document.documentElement.offsetHeight,
//         onclone: function (clonedDoc) {
//           // Force images to load in the cloned document
//           const images = clonedDoc.querySelectorAll("img");
//           images.forEach((img) => {
//             if (img.complete) {
//               img.style.opacity = "1";
//             }
//           });
//         },
//       });

//       // Restore export buttons
//       if (exportButtons) exportButtons.style.display = "flex";
//       if (!keepThemeForExport && appWasDark) restoreThemeAfter(appWasDark);

//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = pdf.internal.pageSize.getHeight();

//       const imgWidth = canvas.width;
//       const imgHeight = canvas.height;
//       const ratio = imgHeight / imgWidth;

//       let imgWidthMM = pdfWidth - 20; // Margin
//       let imgHeightMM = imgWidthMM * ratio;

//       // Handle multi-page content
//       let heightLeft = imgHeightMM;
//       let position = 10; // Start position

//       pdf.addImage(imgData, "PNG", 10, position, imgWidthMM, imgHeightMM);
//       heightLeft -= pdfHeight;

//       // Add additional pages if content is too long
//       while (heightLeft >= 0) {
//         position = heightLeft - imgHeightMM;
//         pdf.addPage();
//         pdf.addImage(imgData, "PNG", 10, position, imgWidthMM, imgHeightMM);
//         heightLeft -= pdfHeight;
//       }

//       const fileName = getFileName();
//       console.log("💾 Saving PDF as:", fileName);
//       pdf.save(fileName);
//     } catch (err) {
//       console.error("❌ Export PDF failed", err);
//       alert("Export failed — check console for details.");
//     }
//   };

//   return (
//     <div className="report-controls no-print flex gap-4 items-center justify-center">
//       <button
//         onClick={exportPDF}
//         title="Export PDF"
//         className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-lg"
//       >
//         Export PDF
//       </button>
//     </div>
//   );
// }

// src/components/ReportControls.jsx
import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ReportControls({
  uid,
  keepThemeForExport = false,
  reportType = "traceability",
}) {
  const isAppDark = () => {
    return (
      document.body.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark"
    );
  };

  const forceLightBefore = () => {
    document.body.classList.add("force-light-for-export");
  };

  const restoreThemeAfter = () => {
    document.body.classList.remove("force-light-for-export");
  };

  /* ---------------- TARGET ELEMENT ---------------- */
  const getTargetElement = () => {
    console.log("🔍 Looking for report container...");

    if (reportType === "analysis") {
      return document.getElementById("full-report-page");
    }

    if (reportType === "equipment") {
      return document.getElementById("full-report-page");
    }

    if (reportType === "rework" || reportType === "rework-pending") {
      return document.querySelector(".rework-report-container");
    }

    if (
      reportType === "ReworkPendingProdTable" ||
      reportType === "reworkpendingtable"
    ) {
      return document.getElementById("full-report-page");
    }

    // Default → Traceability
    return document.querySelector(".traceability-report-container");
  };

  /* ---------------- FILE NAME ---------------- */
  const getFileName = () => {
    const safeUid = uid ? uid.replace(/\W+/g, "_") : "report";

    if (reportType === "analysis") {
      return `analysis_${safeUid}.pdf`;
    } else if (reportType === "equipment") {
      return `equipment_pass_rate_${safeUid}.pdf`;
    } else if (reportType === "rework") {
      return `rework_approved_${safeUid}.pdf`;
    } else if (reportType === "ReworkPendingProdTable") {
      return `rework_pending_prod_table_${safeUid}.pdf`;
    } else if (reportType === "reworkpendingtable") {
      return `rework_pending_table_${safeUid}.pdf`;
    } else {
      return `traceability_${safeUid}.pdf`;
    }
  };

  /* ---------------- EXPORT PDF ---------------- */
  const exportPDF = async () => {
    try {
      console.log("📤 Starting PDF export for:", reportType);

      const el = getTargetElement();

      if (!el) {
        console.error("❌ Element not found!");
        alert("Report container not found. Check reportType or DOM id/class.");
        return;
      }

      const appWasDark = isAppDark();
      if (!keepThemeForExport && appWasDark) {
        forceLightBefore();
      }

      // Hide export buttons
      const exportButtons = document.querySelector(".report-controls");
      if (exportButtons) exportButtons.style.display = "none";

      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      });

      if (exportButtons) exportButtons.style.display = "flex";
      if (!keepThemeForExport && appWasDark) restoreThemeAfter();

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidthMM = pdfWidth - 20;
      const imgHeightMM = (canvas.height / canvas.width) * imgWidthMM;

      let position = 10;
      let heightLeft = imgHeightMM;

      pdf.addImage(imgData, "PNG", 10, position, imgWidthMM, imgHeightMM);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeightMM;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidthMM, imgHeightMM);
        heightLeft -= pdfHeight;
      }

      pdf.save(getFileName());
    } catch (err) {
      console.error("❌ Export PDF failed", err);
      alert("Export failed — check console.");
    }
  };

  return (
    <div className="report-controls no-print flex gap-4 items-center justify-center">
      <button
        onClick={exportPDF}
        title="Export PDF"
        className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-lg"
      >
        Export PDF
      </button>
    </div>
  );
}
