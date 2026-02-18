// // src/App.jsx
// import React, { useState, useMemo, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // ✅ programmatic navigation
// import { Header } from './components/Header';
// import { OrderTable } from './components/OrderTable';
// import { ReportsPanel } from './components/ReportsPanel';
// import { StatusCards } from './components/StatusCards';
// import { ThemeProvider } from './contexts/ThemeContext';

// export function App() {
//   const [orders, setOrders] = useState([]);
//   const [visibleOrders, setVisibleOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [lineMap, setLineMap] = useState({});

//   const navigate = useNavigate();
//   const API_BASE_RAW = import.meta.env.VITE_API_BASE || '';
//   const API_BASE = API_BASE_RAW.replace(/\/$/, '');

//   const clearSelectedOrder = () => setSelectedOrder(null);

//   const normalizeStatus = (s) => {
//     const t = (s || '').toString().trim().toLowerCase();
//     if (!t) return '';
//     if (t === 'pass' || t === 'passed' || t === 'completed') return 'Completed';
//     if (t === 'scrap') return 'Scrap';
//     if (t.includes('in progress')) return 'In Progress';
//     return s;
//   };

//   // Fetch productid -> productionlinename lookup once
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const r = await fetch(`${API_BASE}/api/trace/productionlines`);
//         const j = await r.json();
//         if (cancelled) return;
//         const map = Object.fromEntries(
//           (j?.data || []).map((x) => [String(x.productid || '').trim(), x.productionlinename])
//         );
//         setLineMap(map);
//       } catch (e) {
//         console.error('Failed to load productionlines', e);
//       }
//     })();
//     return () => { cancelled = true; };
//   }, [API_BASE]);

//   // Enrich raw API rows with extra info
//   const mappedOrders = useMemo(() => {
//     return orders.map((r, idx) => {
//       const raw = r.__raw || r;
//       const productid =
//         r.productid || r.productId || r.PRODUCTID ||
//         (raw && (raw.productid || raw.productId || raw.PRODUCTID)) || '';
//       const productidKey = String(productid || '').trim();
//       const uid = r.uid || r.UID || (raw && (raw.uid || raw.UID)) || '';
//       const line = (productidKey && lineMap[productidKey]) ||
//         r.line || null;
//       return {
//         id: r.id || uid || String(idx + 1),
//         uid,
//         productid,
//         line,
//         model: r.productmodelname || r.model || '',
//         variant: r.productvariant || r.variant || '',
//         startDate: r.productionstartdate || r.startDate || '',
//         endDate: r.productionenddate || r.endDate || '',
//         status: normalizeStatus(r.status || r.productstatus),
//         endOfLineUid: r.endoflineuid || r.endofline_uid || r.endOfLineUid || '',
//         __raw: r
//       };
//     });
//   }, [orders, lineMap]);

//   // ✅ Open traceability report in the "window" route (this is the iframe/standalone page)
//   const openTraceabilityReport = (uid) => {
//     if (!uid) return;
//     // Use the traceability-window route created earlier, which reads ?uid=...
//     navigate(`/traceability-window?uid=${encodeURIComponent(uid)}`);
//   };

//   return (
//     <ThemeProvider>
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
//         <Header
//           onSearchResults={(res) => {
//             try {
//               setErrorMsg('');
//               const rows = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
//               setOrders(Array.isArray(rows) ? rows : []);
//             } catch (e) {
//               console.error('onResults mapping error', e);
//               setOrders([]);
//               setErrorMsg('Failed to read results');
//             }
//           }}
//           onSearchError={(msg) => setErrorMsg(msg || 'Search failed')}
//           selectedOrder={selectedOrder}
//           openTraceabilityReport={openTraceabilityReport} // passed so Header can open the report window/modal
//         />

//         <main className="w-full pl-4 pr-4 py-6">
//           <div className="grid grid-cols-1 gap-6">
//             {!!errorMsg && (
//               <div className="text-sm rounded-md border border-red-300 bg-red-50 text-red-800 px-3 py-2">
//                 {errorMsg}
//               </div>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.9fr)_450px] gap-4 items-start">
//               {/* Left: Orders table */}
//               <div className="overflow-x-auto min-w-0">
//                 <OrderTable
//                   orders={mappedOrders}
//                   onVisibleChange={setVisibleOrders}
//                   selectedRow={selectedOrder}
//                   onSelectionChange={(selected) => {
//                     setSelectedOrder(selected?.[0] || null);
//                   }}
//                 />
//               </div>

//               {/* Right: StatusCards + ReportsPanel */}
//               <div className="w-[570px] sticky top-4 self-start ml-4">
//                 <div className="space-y-6 overflow-hidden">
//                   <StatusCards orders={visibleOrders} />
//                   <ReportsPanel
//                     selectedOrder={selectedOrder}
//                     apiBase={API_BASE}
//                     clearSelectedOrder={clearSelectedOrder}
//                     openTraceabilityReport={openTraceabilityReport} // pass to ReportsPanel too
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </ThemeProvider>
//   );
// }

// export default App;

// src/App.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Header } from "./components/Header";
import { OrderTable } from "./components/OrderTable";
import { ReportsPanel } from "./components/ReportsPanel";
import { StatusCards } from "./components/StatusCards";
import { ThemeProvider } from "./contexts/ThemeContext";

export function App() {
  const [orders, setOrders] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [lineMap, setLineMap] = useState({});
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    console.log("App handleReset called - clearing orders and visibleOrders");
    setOrders([]);
    setVisibleOrders([]);
    setSelectedOrder(null);
    setErrorMsg("");
    setLoading(false); // Also reset loading state on reset
  };

  const API_BASE_RAW = import.meta.env.VITE_API_BASE || "";
  const API_BASE = API_BASE_RAW.replace(/\/$/, "");

  const clearSelectedOrder = () => setSelectedOrder(null);

  const normalizeStatus = (s) => {
    const t = (s || "").toString().trim().toLowerCase();
    if (!t) return "";
    if (t === "pass" || t === "passed" || t === "completed") return "Completed";
    if (t === "scrap") return "Scrap";
    if (t.includes("in progress")) return "In Progress";
    return s;
  };

  // Fetch productid -> productionlinename lookup once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/api/trace/productionlines`);
        const j = await r.json();
        if (cancelled) return;
        const map = Object.fromEntries(
          (j?.data || []).map((x) => [
            String(x.productid || "").trim(),
            x.productionlinename,
          ]),
        );
        setLineMap(map);
      } catch (e) {
        console.error("Failed to load productionlines", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [API_BASE]);

  // Enrich raw API rows with extra info
  const mappedOrders = useMemo(() => {
    return orders.map((r, idx) => {
      const raw = r.__raw || r;
      const productid =
        r.productid ||
        r.productId ||
        r.PRODUCTID ||
        (raw && (raw.productid || raw.productId || raw.PRODUCTID)) ||
        "";
      const productidKey = String(productid || "").trim();
      const uid = r.uid || r.UID || (raw && (raw.uid || raw.UID)) || "";
      const line = (productidKey && lineMap[productidKey]) || r.line || null;
      return {
        id: r.id || uid || String(idx + 1),
        uid,
        productid,
        line,
        model: r.productmodelname || r.model || "",
        variant: r.productvariant || r.variant || "",
        startDate: r.productionstartdate || r.startDate || "",
        endDate: r.productionenddate || r.endDate || "",
        status: normalizeStatus(r.status || r.productstatus),
        endOfLineUid: r.endoflineuid || r.endofline_uid || r.endOfLineUid || "",
        __raw: r,
      };
    });
  }, [orders, lineMap]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Header
          onSearchResults={(res) => {
            try {
              setErrorMsg("");
              setLoading(false); // Stop loading when results arrive
              const rows = Array.isArray(res?.data)
                ? res.data
                : Array.isArray(res)
                  ? res
                  : [];
              setOrders(Array.isArray(rows) ? rows : []);
            } catch (e) {
              console.error("onResults mapping error", e);
              setOrders([]);
              setErrorMsg("Failed to read results");
              setLoading(false); // Stop loading on error too
            }
          }}
          onSearchError={(msg) => {
            setErrorMsg(msg || "Search failed");
            setLoading(false); // Stop loading on error
          }}
          selectedOrder={selectedOrder}
          onReset={handleReset}
          onSearchStart={() => setLoading(true)} // Start loading when search begins
        />

        <main className="w-full pl-4 pr-4 py-6">
          <div className="grid grid-cols-1 gap-6">
            {!!errorMsg && (
              <div className="text-sm rounded-md border border-red-300 bg-red-50 text-red-800 px-3 py-2">
                {errorMsg}
              </div>
            )}

            {loading && (
              <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-lg shadow-xl p-8">
                    <div className="mb-8">
                      <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-3">
                        Searching Database
                      </h3>

                      <div className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0s" }}
                        />
                        <div
                          className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="h-3 bg-slate-100 rounded overflow-hidden"
                          style={{
                            animation: `fillRow 2s ease-in-out infinite`,
                            animationDelay: `${i * 0.2}s`,
                          }}
                        >
                          <div
                            className="h-full bg-sky-500"
                            style={{
                              animation: `progressFill 2s ease-in-out infinite`,
                              animationDelay: `${i * 0.2}s`,
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="relative h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-0 bg-sky-600"
                        style={{
                          animation: "slideProgress 2s ease-in-out infinite",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.9fr)_450px] gap-4 items-start">
              {/* Left: Orders table */}
              <div className="overflow-x-auto min-w-0">
                <OrderTable
                  orders={mappedOrders}
                  onVisibleChange={setVisibleOrders}
                  selectedRow={selectedOrder}
                  onSelectionChange={(selected) => {
                    setSelectedOrder(selected?.[0] || null);
                  }}
                  // loading={loading} // Pass loading state to OrderTable
                />
              </div>

              {/* Right: StatusCards + ReportsPanel */}
              {/* <div className="w-[570px] sticky top-4 self-start ml-4"> */}
              <div
                className="
                w-full 
                md:w-[450px] lg:w-[520px] xl:w-[570px] 
                md:sticky md:top-4 md:self-start 
                md:ml-4
              "
              >
                <div className="space-y-6 overflow-hidden">
                  <StatusCards orders={mappedOrders} />
                  <ReportsPanel
                    selectedOrder={selectedOrder}
                    apiBase={API_BASE}
                    clearSelectedOrder={clearSelectedOrder}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
