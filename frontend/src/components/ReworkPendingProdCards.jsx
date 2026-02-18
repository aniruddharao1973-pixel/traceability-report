// src/components/ReworkPendingProdCards.jsx
//D:\DESKTOP FOLD-FILES 28-12-2025\TRACEBILITY REPORT V2\TRACEBILITY REPORT 3rd version - Copy\frontend\src\components\ReworkPendingProdCards.jsx
import React from "react";

export default function ReworkPendingProdCards({ rows = [] }) {
  if (!rows.length) return null;

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3"
        >
          {/* UID */}
          <div className="mb-2">
            <div className="text-[10px] uppercase tracking-wide text-gray-500">
              UID
            </div>
            <div className="text-xs font-mono font-semibold break-all text-gray-900 dark:text-gray-100">
              {row.Uid || row.Unit || "—"}
            </div>
          </div>

          {/* Core Info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Info label="Model" value={row.Model} />
            <Info label="Variant" value={row.Variant} />
            <Info label="Product ID" value={row.ProductId} />
            <Info label="Equipment" value={row.Equipment} />
          </div>

          {/* Divider */}
          <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

          {/* Secondary Info */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <Info label="Defect Code" value={row.Defectcode} />
            <Info label="Shift" value={row.SMR} />
            <Info label="Operator" value={row.Operator} />
            <Info label="Rework Equip." value={row.ReworkEquipment} />
          </div>

          {/* Dates */}
          <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
            <Info label="Book Date" value={row.ReworkBookDate} />
            <Info label="Approved On" value={row.ReworkApprovedDateTime} />
          </div>

          {/* Description */}
          {row.Description && (
            <div className="mt-2">
              <div className="text-[10px] uppercase text-gray-500">
                Description
              </div>
              <div className="text-xs text-gray-700 dark:text-gray-300">
                {row.Description}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase text-gray-500">{label}</div>
      <div className="font-medium text-gray-800 dark:text-gray-100">
        {value || "—"}
      </div>
    </div>
  );
}
