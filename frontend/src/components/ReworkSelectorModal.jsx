// // frontend/src/components/ReworkSelectorModal.jsx
// import React, { useEffect, useState } from "react";

// const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:4000";

// export default function ReworkSelectorModal({ onClose, onGenerate }) {
//   const [mode, setMode] = useState("rework-approved");
//   const [rows, setRows] = useState([]);
//   const [selectedUid, setSelectedUid] = useState("");
//   const [loading, setLoading] = useState(false);

// useEffect(() => {
//   let endpoint = "";
//   const controller = new AbortController();

//     if (mode === "rework-approved") {
//     endpoint = "/api/trace/rework-approved/uids";
//     } else if (mode === "rework-approved-pending-from-production") {
//     endpoint = "/api/trace/rework-pending/uids";
//     } else if (mode === "rework-pending") {
//     endpoint = "/api/trace/rework-pending-count/uids";
//     }


//   setLoading(true);
//   setSelectedUid("");
//   setRows([]);

//   fetch(`${API_BASE}${endpoint}`, { signal: controller.signal })
//     .then((r) => r.json())
//     .then((d) => setRows(d.data || []))
//     .catch((e) => {
//       if (e.name !== "AbortError") setRows([]);
//     })
//     .finally(() => setLoading(false));

//   return () => controller.abort();
// }, [mode]);


//   const handleGenerate = () => {
//     if (!selectedUid) {
//       alert("Select a UID");
//       return;
//     }

//     onGenerate({
//       uid: selectedUid,
//       reportType: mode,
//     });

//     onClose();
//   };

//   return (
//     <div className="absolute right-0 mt-2 w-[32rem] bg-white rounded-xl shadow-2xl p-6 border z-[100]">
//       <h2 className="text-xl font-bold mb-4">Rework Reports</h2>

//       {/* Mode selector */}
//       <div className="flex gap-2 mb-4">
//         <button
//           onClick={() => setMode("rework-approved")}
//           className={`px-3 py-1 rounded ${
//             mode === "rework-approved"
//               ? "bg-purple-600 text-white"
//               : "bg-gray-100"
//           }`}
//         >
//           Rework Approved
//         </button>

//         <button
//           onClick={() =>
//             setMode("rework-approved-pending-from-production")
//           }
//           className={`px-3 py-1 rounded ${
//             mode === "rework-approved-pending-from-production"
//               ? "bg-purple-600 text-white"
//               : "bg-gray-100"
//           }`}
//         >
//           Approved Pending from Production
//         </button>

//         <button
//           onClick={() => setMode("rework-pending")}
//           className={`px-3 py-1 rounded ${
//             mode === "rework-pending"
//               ? "bg-purple-600 text-white"
//               : "bg-gray-100"
//           }`}
//         >
//           Rework Pending
//         </button>
//       </div>

//     {/* UID table */}
//     <div className="border rounded max-h-64 overflow-auto">
//     {loading && (
//         <div className="p-4 text-sm text-gray-500">Loading…</div>
//     )}

//     {!loading && rows.length === 0 && (
//         <div className="p-4 text-sm text-gray-500">
//         No records found
//         </div>
//     )}

//     {!loading &&
//         rows.map((r) => {
//         const uid = r.uid || r.Uid;   // ✅ normalize UID key
//         if (!uid) return null;

//         return (
//             <div
//             key={uid}
//             onClick={() => setSelectedUid(uid)}
//             className={`p-2 cursor-pointer border-b hover:bg-purple-50 ${
//                 selectedUid === uid ? "bg-purple-200" : ""
//             }`}
//             >
//             {uid}
//             </div>
//         );
//         })}
//     </div>


//       {/* Actions */}
//       <div className="flex gap-2 mt-4">
//         <button
//           onClick={onClose}
//           className="flex-1 py-2 rounded bg-gray-200"
//         >
//           Cancel
//         </button>

//         <button
//         onClick={handleGenerate}
//         disabled={!selectedUid}
//         className={`flex-1 py-2 rounded text-white ${
//             selectedUid
//             ? "bg-purple-600 hover:bg-purple-700"
//             : "bg-purple-300 cursor-not-allowed"
//         }`}
//         >
//           Generate Report
//         </button>
//       </div>
//     </div>
//   );
// }



// components\ReworkSelectorModal.jsx
import React, { useEffect, useState } from "react";
import { FileCheck, Clock, AlertCircle, X, ChevronRight } from "lucide-react";

const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:4000";

export default function ReworkSelectorModal({ onClose, onGenerate }) {
  const [mode, setMode] = useState("rework-approved");
  const [rows, setRows] = useState([]);
  const [selectedUid, setSelectedUid] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let endpoint = "";
    const controller = new AbortController();

    if (mode === "rework-approved") {
      endpoint = "/api/trace/rework-approved/uids";
    } else if (mode === "rework-approved-pending-from-production") {
      endpoint = "/api/trace/rework-pending/uids";
    } else if (mode === "rework-pending") {
      endpoint = "/api/trace/rework-pending-count/uids";
    }

    setLoading(true);
    setSelectedUid("");
    setRows([]);

    fetch(`${API_BASE}${endpoint}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => setRows(d.data || []))
      .catch((e) => {
        if (e.name !== "AbortError") setRows([]);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [mode]);

  const handleGenerate = () => {
    if (!selectedUid) {
      alert("Select a UID");
      return;
    }

    onGenerate({
      uid: selectedUid,
      reportType: mode,
    });

    onClose();
  };

  const modes = [
    {
      id: "rework-approved",
      label: "Rework Approved",
      icon: FileCheck,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-500"
    },
    {
      id: "rework-approved-pending-from-production",
      label: "Approved Pending",
      icon: Clock,
      color: "from-orange-500 to-amber-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      borderColor: "border-orange-500"
    },
    {
      id: "rework-pending",
      label: "Rework Pending",
      icon: AlertCircle,
      color: "from-red-500 to-rose-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-500"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all"
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold text-white">Rework Reports</h2>
          <p className="text-white/90 text-sm mt-1">Select report type and UID to generate</p>
        </div>

        <div className="p-6">
          {/* Mode selector - Modern cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {modes.map((m) => {
              const Icon = m.icon;
              const isActive = mode === m.id;
              
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                    isActive
                      ? `${m.borderColor} ${m.bgColor} shadow-lg scale-105`
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <div className={`inline-flex p-2 rounded-lg mb-2 ${
                    isActive ? `bg-gradient-to-br ${m.color}` : "bg-gray-100"
                  }`}>
                    <Icon size={20} className={isActive ? "text-white" : "text-gray-600"} />
                  </div>
                  <div className={`text-xs font-semibold ${
                    isActive ? m.textColor : "text-gray-700"
                  }`}>
                    {m.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* UID Selection Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full"></span>
              Select UID
              <span className="ml-auto text-xs font-normal text-gray-500">
                {rows.length} {rows.length === 1 ? 'record' : 'records'}
              </span>
            </h3>
            
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              <div className="max-h-72 overflow-auto">
                {loading && (
                  <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
                    <p className="text-sm text-gray-500 mt-3">Loading records...</p>
                  </div>
                )}

                {!loading && rows.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-3">
                      <AlertCircle size={32} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium">No records found</p>
                    <p className="text-xs text-gray-400 mt-1">Try selecting a different report type</p>
                  </div>
                )}

                {!loading &&
                  rows.map((r, index) => {
                    const uid = r.uid || r.Uid;
                    if (!uid) return null;

                    return (
                      <div
                        key={uid}
                        onClick={() => setSelectedUid(uid)}
                        className={`p-4 cursor-pointer transition-all duration-150 flex items-center justify-between group ${
                          index !== rows.length - 1 ? "border-b border-gray-200" : ""
                        } ${
                          selectedUid === uid
                            ? "bg-gradient-to-r from-blue-100 to-purple-100 border-l-4 border-l-purple-500"
                            : "bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            selectedUid === uid ? "bg-purple-500" : "bg-gray-300 group-hover:bg-purple-400"
                          }`}></div>
                          <span className={`font-mono text-sm ${
                            selectedUid === uid ? "font-semibold text-purple-900" : "text-gray-700"
                          }`}>
                            {uid}
                          </span>
                        </div>
                        {selectedUid === uid && (
                          <ChevronRight size={18} className="text-purple-500" />
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 border border-gray-200"
            >
              Cancel
            </button>

            <button
              onClick={handleGenerate}
              disabled={!selectedUid}
              className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                selectedUid
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}