// src/AppRouter.jsx
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { App } from "./App"; // Parent dashboard (keeps your existing import style)
import TraceabilityReport from "./components/TraceabilityReport"; // default export
import TraceabilityWindow from "./pages/TraceabilityWindow"; // the new wrapper page
import EquipmentPassRateReport from "./components/EquipmentPassRateReport"; // Equipment report component
import EquipmentPassRateWindow from "./pages/EquipmentPassRateWindow"; // Equipment wrapper page
import ReworkReport from "./components/ReworkReport"; // Rework report component
import ReworkReportWindow from "./pages/ReworkReportWindow"; // Rework wrapper page
import ReworkPendingFromProdReport from "./components/ReworkPendingFromProdReport"; // Rework pending from production component
import ReworkPendingFromProdWindow from "./pages/reworkpendingfromprodwindow"; // Rework pending wrapper page
import ReworkPendingReport from "./components/reworkpendingreport"; // ✅ NEW: Rework Pending Report component
import ReworkPendingWindow from "./pages/reworkpendingwindow"; // ✅ NEW: Rework Pending wrapper page
import AnalysisDashboard from "./components/AnalysisDashboard"; // ✅ Industry 4.0 dashboard
import { ThemeProvider } from "./contexts/ThemeContext";


export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        {/* Main dashboard / parent */}
        <Route path="/" element={<App />} />

        {/* Existing traceability report page (if you still want the full page route) */}
        <Route path="/traceability-report" element={<TraceabilityReport />} />

        {/* NEW: route that renders the report in "window/iframe mode" */}
        <Route path="/traceability-window" element={<TraceabilityWindow />} />

        {/* Equipment Pass Rate Report Routes */}
        <Route path="/equipment-pass-rate-report" element={<EquipmentPassRateReport />} />
        <Route path="/equipment-pass-rate-window" element={<EquipmentPassRateWindow />} />

        {/* ✅ Rework Approved Count Report Routes */}
        <Route path="/rework-approved-report" element={<ReworkReport />} />
        <Route path="/rework-approved-window" element={<ReworkReportWindow />} />

        {/* ✅ Rework Pending From Production Routes */}
        <Route path="/rework-pending-from-prod-report" element={<ReworkPendingFromProdReport />} />
        <Route path="/rework-pending-from-prod-window" element={<ReworkPendingFromProdWindow />} />

        {/* ✅ NEW: Rework Pending Report Routes */}
        <Route path="/rework-pending-report" element={<ReworkPendingReport />} />
        <Route path="/rework-pending-window" element={<ReworkPendingWindow />} />

        {/* ✅ Industry 4.0 Analytics Dashboard Route */}
              <Route
        path="/analytics-window"
        element={
          <ThemeProvider>
            <AnalysisDashboard />
          </ThemeProvider>
        }
      />

        {/* Catch-all 404 */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
              <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                404 — Page Not Found
              </h1>
            </div>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default AppRouter;