// // src/components/SummaryCardReworkPendingfromprod.jsx
// import React from 'react';

// export default function SummaryCardReworkPendingfromprod({  pageMaxWidth = "1200px",
//   palette = {
//     page: '#ffffff',
//     cardBlue: '#f0f4ff',
//     mutedText: '#666',
//     text: '#000',
//   },
//   modelName = "—",
//   variant = "—",
//   displayFromRaw,
//   displayToRaw,
//   fromTime = "00:00:00",
//   toTime = "23:59:59",
//   approvedCount = 0,
//   badgeColor = '#2fa84f',
//   formatDateTime
// }) {

//   // ✅ LOGIC: Style object for date/time boxes (keeps dynamic palette colors)
//   const smallBox = {
//     background: palette.page,
//     color: palette.text,
//   };

//   // ✅ LOGIC: Safe date formatting function with fallback
//   const safeFormatDateTime = (dateString) => {
//     if (formatDateTime && typeof formatDateTime === 'function') {
//       return formatDateTime(dateString);
//     }
//     return dateString || "—";
//   };

//   return (
//     // 📦 Main Container: Max-width wrapper with auto margins
//     <div style={{ maxWidth: pageMaxWidth }} className="mx-auto mb-6">

//       {/* 🎨 Gradient Card: Purple to Cyan gradient background with shadow effects */}
//       <div className="bg-gradient-to-br from-slate-600 via-slate-500 to-blue-700 p-6 rounded-xl flex gap-6 shadow-lg border border-black/5 transition-shadow hover:shadow-xl">

//         {/* 📋 LEFT SECTION: Product Information Grid */}
//         <div className="flex-1">

//           {/* Approved Count Badge */}
//           {/* <div className="text-sm mb-2.5" style={{ color: '#dbeafe' }}>
//             <strong style={{ color: '#e0f2fe' }}>Approved Count:</strong>{' '}
//             <span style={{ color: '#f0f9ff', fontSize: '18px', fontWeight: 'bold' }}>
//               {approvedCount || 0}
//             </span>
//           </div> */}

//           {/* 🔲 Info Boxes Grid: 2 boxes stacked vertically */}
//           <div className="grid gap-3">

//                 {/* 📌 Model Box: Only show if model data exists */}
//                 {(modelName && modelName !== 'All Models') && (
//                 <div className="bg-white/95 text-gray-900 backdrop-blur-md p-4 rounded-lg border border-black/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
//                     <div
//                     style={{ color: palette.mutedText }}
//                     className="text-xs font-semibold uppercase tracking-wider mb-2"
//                     >
//                     Model
//                     </div>
//                     <div className="text-base font-medium">
//                     {modelName}
//                     </div>
//                 </div>
//                 )}

//                 {/* 📌 Variant Box: Only show if variant data exists */}
//                 {(variant && variant !== 'All Variants') && (
//                 <div className="bg-white/95 text-gray-900 backdrop-blur-md p-4 rounded-lg border border-black/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
//                     <div
//                     style={{ color: palette.mutedText }}
//                     className="text-xs font-semibold uppercase tracking-wider mb-2"
//                     >
//                     Variant
//                     </div>
//                     <div className="text-base font-medium">
//                     {variant}
//                     </div>
//                 </div>
//                 )}
//           </div>
//         </div>

//         {/* 📅 RIGHT SECTION: Date/Time Information Column */}
//         <div className="w-64 flex flex-col">

//           {/* 🕒 From Date Box: Uses dynamic smallBox styles */}
//           <div
//             style={smallBox}
//             className="p-4 rounded-lg border border-black/10 shadow-sm mb-3 min-w-[160px] hover:shadow-md transition-all"
//           >
//             <div
//               style={{ color: palette.mutedText }}
//               className="text-xs font-semibold uppercase tracking-wider mb-2"
//             >
//               From Date
//             </div>
//             <div className="text-base font-medium">
//               {safeFormatDateTime(displayFromRaw)}
//             </div>
//           </div>

//           {/* 🕒 To Date Box: Uses dynamic smallBox styles */}
//           <div
//             style={smallBox}
//             className="p-4 rounded-lg border border-black/10 shadow-sm mb-3 min-w-[160px] hover:shadow-md transition-all"
//           >
//             <div
//               style={{ color: palette.mutedText }}
//               className="text-xs font-semibold uppercase tracking-wider mb-2"
//             >
//               To Date
//             </div>
//             <div className="text-base font-medium">
//               {safeFormatDateTime(displayToRaw)}
//             </div>
//           </div>

//           {/* ⏰ From Time Box: Uses dynamic smallBox styles */}
//           <div
//             style={smallBox}
//             className="p-4 rounded-lg border border-black/10 shadow-sm mb-3 min-w-[160px] hover:shadow-md transition-all"
//           >
//             <div
//               style={{ color: palette.mutedText }}
//               className="text-xs font-semibold uppercase tracking-wider mb-2"
//             >
//               From Time
//             </div>
//             <div className="text-base font-medium">
//               {fromTime || "—"}
//             </div>
//           </div>

//           {/* ⏰ To Time Box: Uses dynamic smallBox styles */}
//           <div
//             style={smallBox}
//             className="p-4 rounded-lg border border-black/10 shadow-sm mb-3 min-w-[160px] hover:shadow-md transition-all"
//           >
//             <div
//               style={{ color: palette.mutedText }}
//               className="text-xs font-semibold uppercase tracking-wider mb-2"
//             >
//               To Time
//             </div>
//             <div className="text-base font-medium">
//               {toTime || "—"}
//             </div>
//           </div>

//           {/* ✅ Approved Count Badge: Dynamic color with pill shape and shadow */}
//           <div className="flex justify-end mt-2">
//             <div
//               style={{
//                 background: badgeColor,
//                 boxShadow: `0 4px 14px ${badgeColor}50`,
//               }}
//               className="px-6 py-2.5 rounded-md text-white font-semibold min-w-[100px] text-center text-sm uppercase tracking-wide"
//             >
//               {approvedCount} {approvedCount === 1 ? 'Record' : 'Records'}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/components/SummaryCardReworkPendingfromprod.jsx
import React from "react";

export default function SummaryCardReworkPendingfromprod({
  pageMaxWidth = "100%",
  palette = {
    page: "#ffffff",
    cardBlue: "#f0f4ff",
    mutedText: "#666",
    text: "#000",
  },
  modelName = "—",
  variant = "—",
  displayFromRaw,
  displayToRaw,
  fromTime = "00:00:00",
  toTime = "23:59:59",
  approvedCount = 0,
  badgeColor = "#2fa84f",
  formatDateTime,
}) {
  // Style object for date/time boxes (keeps dynamic palette colors)
  const smallBox = {
    background: palette.page,
    color: palette.text,
  };

  // Safe date formatting function with fallback
  const safeFormatDateTime = (dateString) => {
    if (formatDateTime && typeof formatDateTime === "function") {
      return formatDateTime(dateString);
    }
    return dateString || "—";
  };

  return (
    // Main Container: Responsive max-width wrapper
    <div
      style={{ maxWidth: pageMaxWidth }}
      className="mx-auto mb-4 sm:mb-6 px-2 sm:px-0"
    >
      {/* Gradient Card: Responsive padding and layout */}
      <div
        className="
        bg-gradient-to-br from-slate-600 via-slate-500 to-blue-700 
        p-3 sm:p-4 md:p-5 lg:p-6 
        rounded-lg sm:rounded-xl 
        flex flex-col lg:flex-row 
        gap-3 sm:gap-4 md:gap-5 lg:gap-6 
        shadow-md sm:shadow-lg 
        border border-black/5 
        transition-shadow hover:shadow-xl
      "
      >
        {/* LEFT SECTION: Product Information Grid */}
        <div className="flex-1 w-full">
          {/* Info Boxes Grid: Responsive grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
            {/* Model Box: Only show if model data exists */}
            {modelName && modelName !== "All Models" && (
              <div
                className="
                bg-white/95 text-gray-900 backdrop-blur-md 
                p-3 sm:p-4 
                rounded-md sm:rounded-lg 
                border border-black/10 
                shadow-sm hover:shadow-md 
                transition-all hover:-translate-y-0.5
              "
              >
                <div
                  style={{ color: palette.mutedText }}
                  className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1 sm:mb-2"
                >
                  Model
                </div>
                <div className="text-sm sm:text-base font-medium">
                  {modelName}
                </div>
              </div>
            )}

            {/* Variant Box: Only show if variant data exists */}
            {variant && variant !== "All Variants" && (
              <div
                className="
                bg-white/95 text-gray-900 backdrop-blur-md 
                p-3 sm:p-4 
                rounded-md sm:rounded-lg 
                border border-black/10 
                shadow-sm hover:shadow-md 
                transition-all hover:-translate-y-0.5
              "
              >
                <div
                  style={{ color: palette.mutedText }}
                  className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1 sm:mb-2"
                >
                  Variant
                </div>
                <div className="text-sm sm:text-base font-medium">
                  {variant}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SECTION: Date/Time Information */}
        <div
          className="
          w-full lg:w-64 
          flex flex-col 
          gap-2 sm:gap-3
        "
        >
          {/* Date/Time Grid: Responsive 2x2 grid on mobile, column on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
            {/* From Date Box */}
            <div
              style={smallBox}
              className="
                p-2.5 sm:p-3 md:p-4 
                rounded-md sm:rounded-lg 
                border border-black/10 
                shadow-sm 
                hover:shadow-md 
                transition-all
              "
            >
              <div
                style={{ color: palette.mutedText }}
                className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1 sm:mb-2"
              >
                From Date
              </div>
              <div className="text-xs sm:text-sm md:text-base font-medium">
                {safeFormatDateTime(displayFromRaw)}
              </div>
            </div>

            {/* To Date Box */}
            <div
              style={smallBox}
              className="
                p-2.5 sm:p-3 md:p-4 
                rounded-md sm:rounded-lg 
                border border-black/10 
                shadow-sm 
                hover:shadow-md 
                transition-all
              "
            >
              <div
                style={{ color: palette.mutedText }}
                className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1 sm:mb-2"
              >
                To Date
              </div>
              <div className="text-xs sm:text-sm md:text-base font-medium">
                {safeFormatDateTime(displayToRaw)}
              </div>
            </div>

            {/* From Time Box */}
            <div
              style={smallBox}
              className="
                p-2.5 sm:p-3 md:p-4 
                rounded-md sm:rounded-lg 
                border border-black/10 
                shadow-sm 
                hover:shadow-md 
                transition-all
              "
            >
              <div
                style={{ color: palette.mutedText }}
                className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1 sm:mb-2"
              >
                From Time
              </div>
              <div className="text-xs sm:text-sm md:text-base font-medium">
                {fromTime || "—"}
              </div>
            </div>

            {/* To Time Box */}
            <div
              style={smallBox}
              className="
                p-2.5 sm:p-3 md:p-4 
                rounded-md sm:rounded-lg 
                border border-black/10 
                shadow-sm 
                hover:shadow-md 
                transition-all
              "
            >
              <div
                style={{ color: palette.mutedText }}
                className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1 sm:mb-2"
              >
                To Time
              </div>
              <div className="text-xs sm:text-sm md:text-base font-medium">
                {toTime || "—"}
              </div>
            </div>
          </div>

          {/* Approved Count Badge: Responsive positioning and size */}
          <div className="flex justify-center lg:justify-end mt-2 sm:mt-3">
            <div
              style={{
                background: badgeColor,
                boxShadow: `0 2px 8px ${badgeColor}50`,
              }}
              className="
                px-3 sm:px-4 md:px-6 
                py-1.5 sm:py-2 md:py-2.5 
                rounded-md 
                text-white font-semibold 
                min-w-[80px] sm:min-w-[100px] 
                text-center 
                text-[11px] sm:text-xs md:text-sm 
                uppercase tracking-wide
              "
            >
              {approvedCount} {approvedCount === 1 ? "Record" : "Records"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
