// src/components/ReportControls.jsx
import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";

export default function ReportControls({
  uid,
  reportData = [],
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
    // Prefer the full report wrapper if present (contains header + summary + table)
    return (
      document.getElementById("full-report-page") ||
      document.querySelector(".traceability-report-container") ||
      document.body
    );
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
    let el;
    let originalWidth;

    try {
      console.log("📤 Starting PDF export for:", reportType);

      el = getTargetElement();
      if (!el) {
        alert("Report container not found");
        return;
      }

      /* ---------- FORCE DESKTOP LAYOUT ---------- */
      originalWidth = el.style.width;
      el.classList.add("force-desktop-export");
      el.style.width = "1200px";
      window.scrollTo(0, 0);

      const appWasDark = isAppDark();
      if (!keepThemeForExport && appWasDark) {
        forceLightBefore();
      }

      // Hide export buttons
      const exportButtons = document.querySelector(".report-controls");
      if (exportButtons) exportButtons.style.display = "none";

      await new Promise((r) => setTimeout(r, 500));

      /* ---------- CAPTURE ---------- */
      // ✅ LANDSCAPE PDF (MANDATORY FOR WIDE TABLES)
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      /* ---------- CAPTURE HEADER + SUMMARY ---------- */
      /* ---------- CAPTURE HEADER + SUMMARY (WITH DEBUG LOGS) ---------- */
      let startY = 10;

      console.log("🧭 PDF ROOT ELEMENT (el):", el);

      // Step 1: Try to locate header inside export root
      let headerEl = el.querySelector(".pdf-header-block");

      console.log("🔍 Try .pdf-header-block inside el:", headerEl);

      // Step 2: Fallbacks (inside el)
      if (!headerEl) {
        headerEl = el.querySelector(".summary-card-container");
        console.log("🔍 Try .summary-card-container inside el:", headerEl);
      }

      if (!headerEl) {
        headerEl = el.querySelector(".report-header");
        console.log("🔍 Try .report-header inside el:", headerEl);
      }

      // Step 3: Global fallback (VERY IMPORTANT DEBUG)
      if (!headerEl) {
        headerEl = document.querySelector(".pdf-header-block");
        console.log("🌍 Global .pdf-header-block:", headerEl);
      }

      if (!headerEl) {
        headerEl = document.querySelector(".summary-card-container");
        console.log("🌍 Global .summary-card-container:", headerEl);
      }

      // Step 4: Final result
      if (!headerEl) {
        console.warn("❌ HEADER / SUMMARY NOT FOUND — exporting table only");
      } else {
        console.log("✅ HEADER FOUND:", headerEl);
        console.log(
          "📐 HEADER SIZE:",
          headerEl.offsetWidth,
          "x",
          headerEl.offsetHeight,
        );

        const headerCanvas = await html2canvas(headerEl, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          windowWidth: 1200,
        });

        console.log(
          "🖼 HEADER CANVAS SIZE:",
          headerCanvas.width,
          "x",
          headerCanvas.height,
        );

        const headerImg = headerCanvas.toDataURL("image/jpeg", 0.85);

        // Landscape A4 usable width ≈ 277mm
        pdf.addImage(headerImg, "JPEG", 10, 10, 277, 0);

        // Dynamic spacing based on header height
        startY = 10 + headerCanvas.height / 3;

        console.log("📍 TABLE START Y:", startY);
      }

      autoTable(pdf, {
        html: el.querySelector("table"),
        startY,

        theme: "grid",
        tableWidth: "auto",

        styles: {
          fontSize: 7,
          cellPadding: 2,
          valign: "middle",
          halign: "center",
          textColor: [30, 41, 59], // slate-800
          lineColor: [203, 213, 225], // slate-300
          lineWidth: 0.1,
        },

        headStyles: {
          fillColor: [37, 99, 235], // blue-600
          textColor: 255,
          fontStyle: "bold",
          fontSize: 7,
          halign: "center",
        },

        bodyStyles: {
          fillColor: [248, 250, 252], // slate-50
        },

        alternateRowStyles: {
          fillColor: [241, 245, 249], // slate-100
        },

        columnStyles: {
          0: { cellWidth: 40 }, // STATION
          1: { cellWidth: 30 }, // START
          2: { cellWidth: 30 }, // END
          3: { cellWidth: 26 }, // SEQUENCE
          10: { cellWidth: 28 }, // REMARKS
        },

        rowPageBreak: "avoid",
        pageBreak: "auto",

        didParseCell: function (data) {
          // 🎨 STATUS BASED COLORING
          if (data.section === "body") {
            const txt = String(data.cell.text || "").toLowerCase();

            if (txt.includes("pass")) {
              data.cell.styles.textColor = [22, 163, 74]; // green-600
              data.cell.styles.fontStyle = "bold";
            }

            if (txt.includes("fail")) {
              data.cell.styles.textColor = [220, 38, 38]; // red-600
              data.cell.styles.fontStyle = "bold";
            }

            if (txt.includes("scrap")) {
              data.cell.styles.textColor = [234, 88, 12]; // orange-600
              data.cell.styles.fontStyle = "bold";
            }
          }
        },
      });

      // ✅ TABLE EXPORT — NO ROW BREAKS, NO COLUMN LOSS
      // autoTable(pdf, {
      //   html: el.querySelector("table"),
      //   startY,

      //   theme: "grid",
      //   tableWidth: "auto",

      //   styles: {
      //     fontSize: 7,
      //     cellPadding: 2,
      //     overflow: "linebreak",
      //     halign: "center",
      //     valign: "middle",
      //   },

      //   headStyles: {
      //     fillColor: [51, 65, 85],
      //     textColor: 255,
      //     fontSize: 7,
      //     halign: "center",
      //   },

      //   bodyStyles: {
      //     halign: "center",
      //   },

      //   columnStyles: {
      //     0: { cellWidth: 40 }, // STATION
      //     1: { cellWidth: 30 }, // START
      //     2: { cellWidth: 30 }, // END
      //     3: { cellWidth: 26 }, // SEQUENCE
      //     10: { cellWidth: 28 }, // REMARKS
      //   },

      //   rowPageBreak: "avoid", // 🔥 NO ROW SPLIT
      //   pageBreak: "auto",
      // });

      // pdf.save(getFileName());

      // const pdfWidth = pdf.internal.pageSize.getWidth();
      // const pdfHeight = pdf.internal.pageSize.getHeight();

      // const imgWidth = pdfWidth - 20;
      // const imgHeight = (canvas.height / canvas.width) * imgWidth;

      // let position = 10;
      // let heightLeft = imgHeight;

      // pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
      // heightLeft -= pdfHeight;

      // while (heightLeft > 0) {
      //   position = heightLeft - imgHeight;
      //   pdf.addPage();
      //   pdf.addImage(imgData, "JPEG", 10, position, imgWidth, imgHeight);
      //   heightLeft -= pdfHeight;
      // }

      pdf.save(getFileName());
    } catch (err) {
      console.error("❌ Export PDF failed", err);
      alert("Export failed — check console.");
    } finally {
      /* ---------- RESTORE UI (CRITICAL) ---------- */
      if (el) {
        el.classList.remove("force-desktop-export");
        el.style.width = originalWidth || "";
      }

      const exportButtons = document.querySelector(".report-controls");
      if (exportButtons) exportButtons.style.display = "flex";

      restoreThemeAfter();
    }
  };

  /* ---------------- EXPORT EXCEL ---------------- */
  const exportExcel = () => {
    if (!reportData || reportData.length === 0) {
      alert("No data available to export");
      return;
    }

    let formattedData = [];

    // 🔹 TRACEABILITY (already fixed earlier)
    if (reportType === "traceability") {
      formattedData = reportData.map((row, index) => ({
        "S.No": index + 1,
        UID: row.uid || "—",
        "End Of Line UID": row.endoflineuid || "—",
        Model: row.productmodelname || "—",
        Variant: row.productvariant || "—",
        Station: row.equipmentname || "—",
        "Start Date": row.productionstartdate || "—",
        "End Date": row.productionenddate || "—",
        Sequence: row.testid || "—",
        LSL: row.lsl ?? "—",
        Value: row.value ?? "—",
        HSL: row.hsl ?? "—",
        Unit: row.unit || "—",
        Test: row.teststatus || "—",
        Rework: row.reworkcount ?? 0,
        Remarks: row.qualityremarks || "—",
        Operator: row.operatorid || "—",
        Shift: row.shift || "—",
        Cycle: row.cycletime || "—",
        Status: row.productstatus || "—",
      }));
    }

    // 🔹 EQUIPMENT PASS RATE
    // 🔹 EQUIPMENT PASS RATE (ONLY ACTUAL DATA)
    if (reportType === "equipment") {
      formattedData = reportData.map((row, index) => ({
        "S.No": index + 1,
        "Equipment Name": row.equipmentname || "—",
        "Product ID": row.productid || "—",
        "Equipment ID": row.equipmentid || "—",
        Model: row.productmodelname || "—",
        Variant: row.productvariant || "—",
        "Total Count": Number(row.equipment_count) || 0,
      }));
    }

    // 🔹 REWORK APPROVED REPORT
    if (reportType === "rework") {
      formattedData = reportData.map((row, index) => ({
        "S.No": index + 1,

        Equipment: row.Equipment || "—",
        "Equipment ID": row.EquipmentId || "—",

        "Production Start Date": row.ProductionStartDate || "—",
        "Production End Date": row.ProductionEndDate || "—",

        "Rework Book Date": row.RewarkBookDate || "—",
        "Rework Approved Date": row.RewarkApprovedDate || "—",

        "Defect Code": row.DefectCode || "—",
        Description: row.Description || "—",

        "Rework Count": row.RewarkCount ?? 0,

        // ✅ FIX — THIS WAS MISSING
        "Quality Remarks": row.QualityRemarks || "—",

        Operator: row.Operator || "—",
        Shift: row.Shift || "—",
        "Cycle Time": row.CycleTime || "—",

        Status: row.Status || "—",
      }));
    }

    // 🔹 REWORK PENDING FROM PRODUCTION
    if (reportType === "rework-pending-prod") {
      formattedData = reportData.map((row, index) => ({
        "S.No": index + 1,
        UID: row.Uid || row.Unit || "—",
        Equipment: row.Equipment || "—",
        "Product ID": row.ProductId || "—",
        Model: row.Model || "—",
        Variant: row.Variant || "—",
        "Defect Code": row.Defectcode || "—",
        Description: row.Description || "—",
        "Rework Book Date": row.ReworkBookDate || "—",
        "Rework Approved Date": row.ReworkApprovedDateTime || "—",
        "Rework Equipment": row.ReworkEquipment || "—",
        Operator: row.Operator || "—",
        Shift: row.Shift || row.SMR || "—",
      }));
    }

    if (reportType === "reworkpendingtable") {
      formattedData = reportData.map((row, index) => ({
        "S.No": index + 1,
        UID: row.Uid || "—",
        Equipment: row.Equipment || "—",
        "Product ID": row.ProductId || "—",
        Model: row.Model || "—",
        Variant: row.Variant || "—",
        "Defect Code": row.Defectcode || "—",
        Description: row.Description || "—",
        "Rework Book Date": row.ReworkBookDate || "—",
        "Rework Approved Date": row.ReworkApprovedDateTime || "—",
        "Rework Equipment": row.ReworkEquipment || "—",
        Operator: row.Operator || "—",
        Shift: row.Shift || row.SMR || "—",
      }));
    }

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    const sheetName =
      reportType === "equipment"
        ? "Equipment Pass Rate"
        : reportType === "rework"
          ? "Rework Approved"
          : reportType === "rework-pending-prod"
            ? "Rework Pending From Production"
            : "Traceability Report";

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const safeUid = uid ? uid.replace(/\W+/g, "_") : "report";

    const fileName =
      reportType === "equipment"
        ? `equipment_pass_rate_${safeUid}.xlsx`
        : reportType === "rework"
          ? `rework_approved_${safeUid}.xlsx`
          : reportType === "rework-pending-prod"
            ? `rework_pending_from_production_${safeUid}.xlsx`
            : `traceability_${safeUid}.xlsx`;

    XLSX.writeFile(workbook, fileName);
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
      <button
        onClick={exportExcel}
        title="Export Excel"
        className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-lg"
      >
        Export Excel
      </button>
    </div>
  );
}
