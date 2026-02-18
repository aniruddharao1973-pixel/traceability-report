// // components\ReworkSelectorModal.jsx
// import React, { useEffect, useState } from "react";
// import { FileCheck, Clock, AlertCircle, X, ChevronRight } from "lucide-react";

// const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:4000";

// export default function ReworkSelectorModal({ onClose, onGenerate }) {
//   const [mode, setMode] = useState("rework-approved");
//   const [rows, setRows] = useState(null);

//   const [selectedUid, setSelectedUid] = useState("");
//   const [loading, setLoading] = useState(true);
//   // const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

//   useEffect(() => {
//     let endpoint = "";
//     const controller = new AbortController();

//     if (mode === "rework-approved") {
//       endpoint = "/api/trace/rework-approved/uids";
//     } else if (mode === "rework-approved-pending-from-production") {
//       endpoint = "/api/trace/rework-pending/uids";
//     } else if (mode === "rework-pending") {
//       endpoint = "/api/trace/rework-pending-count/uids";
//     }

//     // reset UI state for new fetch
//     setLoading(true);
//     setSelectedUid("");
//     setRows(null); // IMPORTANT: null = not fetched yet

//     fetch(`${API_BASE}${endpoint}`, { signal: controller.signal })
//       .then((r) => r.json())
//       .then((d) => {
//         setRows(Array.isArray(d?.data) ? d.data : []);
//       })
//       .catch((e) => {
//         if (e.name !== "AbortError") {
//           setRows([]);
//         }
//       })
//       .finally(() => {
//         setLoading(false);
//       });

//     return () => controller.abort();
//   }, [mode]);

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

//   const modes = [
//     {
//       id: "rework-approved",
//       label: "Rework Approved",
//       icon: FileCheck,
//       color: "from-green-500 to-emerald-600",
//       bgColor: "bg-green-50",
//       textColor: "text-green-700",
//       borderColor: "border-green-500",
//     },
//     {
//       id: "rework-approved-pending-from-production",
//       label: "Approved Pending",
//       icon: Clock,
//       color: "from-orange-500 to-amber-600",
//       bgColor: "bg-orange-50",
//       textColor: "text-orange-700",
//       borderColor: "border-orange-500",
//     },
//     {
//       id: "rework-pending",
//       label: "Rework Pending",
//       icon: AlertCircle,
//       color: "from-red-500 to-rose-600",
//       bgColor: "bg-red-50",
//       textColor: "text-red-700",
//       borderColor: "border-red-500",
//     },
//   ];

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all">
//         {/* Header with gradient */}
//         <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 relative">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all"
//           >
//             <X size={20} />
//           </button>
//           <h2 className="text-2xl font-bold text-white">Rework Reports</h2>
//           <p className="text-white/90 text-sm mt-1">
//             Select report type and UID to generate
//           </p>
//         </div>

//         <div className="p-6">
//           {/* Mode selector - Modern cards */}
//           <div className="grid grid-cols-3 gap-3 mb-6">
//             {modes.map((m) => {
//               const Icon = m.icon;
//               const isActive = mode === m.id;

//               return (
//                 <button
//                   key={m.id}
//                   onClick={() => setMode(m.id)}
//                   className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
//                     isActive
//                       ? `${m.borderColor} ${m.bgColor} shadow-lg scale-105`
//                       : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
//                   }`}
//                 >
//                   <div
//                     className={`inline-flex p-2 rounded-lg mb-2 ${
//                       isActive ? `bg-gradient-to-br ${m.color}` : "bg-gray-100"
//                     }`}
//                   >
//                     <Icon
//                       size={20}
//                       className={isActive ? "text-white" : "text-gray-600"}
//                     />
//                   </div>
//                   <div
//                     className={`text-xs font-semibold ${
//                       isActive ? m.textColor : "text-gray-700"
//                     }`}
//                   >
//                     {m.label}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           {/* UID Selection Section */}
//           <div className="mb-6">
//             <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//               <span className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full"></span>
//               Select UID
//               <span className="ml-auto text-xs font-normal text-gray-500">
//                 {!isInitialLoading && Array.isArray(rows) && (
//                   <>
//                     {rows.length} {rows.length === 1 ? "record" : "records"}
//                   </>
//                 )}
//               </span>
//             </h3>

//             <div
//               className={`border-2 rounded-xl overflow-hidden ${
//                 isInitialLoading
//                   ? "border-transparent bg-transparent"
//                   : "border-gray-200 bg-gray-50"
//               }`}
//             >
//               <div className="max-h-72 overflow-auto">
//                 {loading && (
//                   <div className="p-4 space-y-3">
//                     {[...Array(5)].map((_, i) => (
//                       <div
//                         key={i}
//                         className="
//           h-12 rounded-lg
//           bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200
//           animate-pulse
//           flex items-center px-4
//         "
//                       >
//                         <div className="w-2 h-2 rounded-full bg-gray-400 mr-3"></div>
//                         <div className="h-4 w-40 rounded bg-gray-400/60"></div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {!loading && Array.isArray(rows) && rows.length === 0 && (
//                   <div className="p-8 text-center">
//                     <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-3">
//                       <AlertCircle size={32} className="text-gray-400" />
//                     </div>
//                     <p className="text-sm text-gray-500 font-medium">
//                       No records found
//                     </p>
//                     <p className="text-xs text-gray-400 mt-1">
//                       Try selecting a different report type
//                     </p>
//                   </div>
//                 )}
//                 {!loading &&
//                   Array.isArray(rows) &&
//                   rows.map((r, index) => {
//                     const uid = r.uid || r.Uid;
//                     if (!uid) return null;

//                     const isInitialLoading = loading && rows === null;
//                     return (
//                       <div
//                         key={uid}
//                         onClick={() => setSelectedUid(uid)}
//                         className={`p-4 cursor-pointer transition-all duration-150 flex items-center justify-between group ${
//                           index !== rows.length - 1
//                             ? "border-b border-gray-200"
//                             : ""
//                         } ${
//                           selectedUid === uid
//                             ? "bg-gradient-to-r from-blue-100 to-purple-100 border-l-4 border-l-purple-500"
//                             : "bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50"
//                         }`}
//                       >
//                         <div className="flex items-center gap-3">
//                           <div
//                             className={`w-2 h-2 rounded-full ${
//                               selectedUid === uid
//                                 ? "bg-purple-500"
//                                 : "bg-gray-300 group-hover:bg-purple-400"
//                             }`}
//                           ></div>
//                           <span
//                             className={`font-mono text-sm ${
//                               selectedUid === uid
//                                 ? "font-semibold text-purple-900"
//                                 : "text-gray-700"
//                             }`}
//                           >
//                             {uid}
//                           </span>
//                         </div>
//                         {selectedUid === uid && (
//                           <ChevronRight size={18} className="text-purple-500" />
//                         )}
//                       </div>
//                     );
//                   })}
//               </div>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-3">
//             <button
//               onClick={onClose}
//               className="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 border border-gray-200"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={handleGenerate}
//               disabled={!selectedUid}
//               className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
//                 selectedUid
//                   ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105"
//                   : "bg-gray-300 cursor-not-allowed"
//               }`}
//             >
//               Generate Report
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // components/ReworkSelectorModal.jsx
// import React, { useEffect, useState } from "react";
// import { FileCheck, Clock, AlertCircle, X, ChevronRight } from "lucide-react";

// const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:4000";
// const MIN_LOADER_TIME = 400; // ms

// export default function ReworkSelectorModal({ onClose, onGenerate }) {
//   const [mode, setMode] = useState("rework-approved");
//   const [rows, setRows] = useState(null);
//   const [selectedUid, setSelectedUid] = useState("");
//   const [loading, setLoading] = useState(true);

//   const isInitialLoading = loading && rows === null;

//   useEffect(() => {
//     let endpoint = "";
//     const controller = new AbortController();
//     const startTime = Date.now();

//     if (mode === "rework-approved") {
//       endpoint = "/api/trace/rework-approved/uids";
//     } else if (mode === "rework-approved-pending-from-production") {
//       endpoint = "/api/trace/rework-pending/uids";
//     } else if (mode === "rework-pending") {
//       endpoint = "/api/trace/rework-pending-count/uids";
//     }

//     setLoading(true);
//     setSelectedUid("");
//     setRows(null);

//     fetch(`${API_BASE}${endpoint}`, { signal: controller.signal })
//       .then((r) => r.json())
//       .then((d) => {
//         setRows(Array.isArray(d?.data) ? d.data : []);
//       })
//       .catch((e) => {
//         if (e.name !== "AbortError") setRows([]);
//       })
//       .finally(() => {
//         const elapsed = Date.now() - startTime;
//         const remaining = MIN_LOADER_TIME - elapsed;

//         if (remaining > 0) {
//           setTimeout(() => setLoading(false), remaining);
//         } else {
//           setLoading(false);
//         }
//       });

//     return () => controller.abort();
//   }, [mode]);

//   const handleGenerate = () => {
//     if (!selectedUid) return alert("Select a UID");
//     onGenerate({ uid: selectedUid, reportType: mode });
//     onClose();
//   };

//   const modes = [
//     {
//       id: "rework-approved",
//       label: "Rework Approved",
//       icon: FileCheck,
//       color: "from-green-500 to-emerald-600",
//       bgColor: "bg-green-50",
//       textColor: "text-green-700",
//       borderColor: "border-green-500",
//     },
//     {
//       id: "rework-approved-pending-from-production",
//       label: "Approved Pending",
//       icon: Clock,
//       color: "from-orange-500 to-amber-600",
//       bgColor: "bg-orange-50",
//       textColor: "text-orange-700",
//       borderColor: "border-orange-500",
//     },
//     {
//       id: "rework-pending",
//       label: "Rework Pending",
//       icon: AlertCircle,
//       color: "from-red-500 to-rose-600",
//       bgColor: "bg-red-50",
//       textColor: "text-red-700",
//       borderColor: "border-red-500",
//     },
//   ];

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 relative">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2"
//           >
//             <X size={20} />
//           </button>
//           <h2 className="text-2xl font-bold text-white">Rework Reports</h2>
//           <p className="text-white/90 text-sm mt-1">
//             Select report type and UID to generate
//           </p>
//         </div>

//         <div className="p-6">
//           {/* Mode Selector */}
//           <div className="grid grid-cols-3 gap-3 mb-6">
//             {modes.map((m) => {
//               const Icon = m.icon;
//               const isActive = mode === m.id;

//               return (
//                 <button
//                   key={m.id}
//                   onClick={() => setMode(m.id)}
//                   className={`p-4 rounded-xl border-2 transition-all ${
//                     isActive
//                       ? `${m.borderColor} ${m.bgColor} shadow-lg scale-105`
//                       : "border-gray-200 bg-white hover:border-gray-300"
//                   }`}
//                 >
//                   <div
//                     className={`inline-flex p-2 rounded-lg mb-2 ${
//                       isActive ? `bg-gradient-to-br ${m.color}` : "bg-gray-100"
//                     }`}
//                   >
//                     <Icon
//                       size={20}
//                       className={isActive ? "text-white" : "text-gray-600"}
//                     />
//                   </div>
//                   <div
//                     className={`text-xs font-semibold ${
//                       isActive ? m.textColor : "text-gray-700"
//                     }`}
//                   >
//                     {m.label}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           {/* UID Section */}
//           <div className="mb-6">
//             <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//               <span className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full"></span>
//               Select UID
//               {!isInitialLoading && Array.isArray(rows) && (
//                 <span className="ml-auto text-xs text-gray-500">
//                   {rows.length} {rows.length === 1 ? "record" : "records"}
//                 </span>
//               )}
//             </h3>

//             <div className="rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
//               <div className="max-h-72 overflow-auto">
//                 {isInitialLoading && (
//                   <div className="p-4 space-y-3">
//                     {[...Array(5)].map((_, i) => (
//                       <div
//                         key={i}
//                         className="h-12 rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse flex items-center px-4"
//                       >
//                         <div className="w-2 h-2 rounded-full bg-gray-400 mr-3"></div>
//                         <div className="h-4 w-40 rounded bg-gray-400/60"></div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {!loading && Array.isArray(rows) && rows.length === 0 && (
//                   <div className="p-8 text-center">
//                     <AlertCircle className="mx-auto text-gray-400 mb-3" />
//                     <p className="text-sm text-gray-500 font-medium">
//                       No records found
//                     </p>
//                   </div>
//                 )}

//                 {!loading &&
//                   Array.isArray(rows) &&
//                   rows.map((r) => {
//                     const uid = r.uid || r.Uid;
//                     if (!uid) return null;

//                     return (
//                       <div
//                         key={uid}
//                         onClick={() => setSelectedUid(uid)}
//                         className={`p-4 cursor-pointer flex justify-between items-center border-b ${
//                           selectedUid === uid
//                             ? "bg-gradient-to-r from-blue-100 to-purple-100 border-l-4 border-purple-500"
//                             : "bg-white hover:bg-gray-50"
//                         }`}
//                       >
//                         <span className="font-mono text-sm">{uid}</span>
//                         {selectedUid === uid && (
//                           <ChevronRight size={18} className="text-purple-500" />
//                         )}
//                       </div>
//                     );
//                   })}
//               </div>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-3">
//             <button
//               onClick={onClose}
//               className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={handleGenerate}
//               disabled={!selectedUid}
//               className={`flex-1 py-3 rounded-xl font-semibold text-white ${
//                 selectedUid
//                   ? "bg-gradient-to-r from-blue-500 to-purple-600"
//                   : "bg-gray-300 cursor-not-allowed"
//               }`}
//             >
//               Generate Report
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// // components/ReworkSelectorModal.jsx
// import React, { useEffect, useState } from "react";
// import { FileCheck, Clock, AlertCircle, X, ChevronRight } from "lucide-react";

// // const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:4000";
// const API_BASE = import.meta.env.VITE_API_BASE;

// const MIN_LOADER_TIME = 400; // ms

// // ✨ Beautiful Shimmer Loader Component
// const ShimmerLoader = () => {
//   return (
//     <div className="p-4 space-y-3">
//       {[...Array(5)].map((_, i) => (
//         <div
//           key={i}
//           className="relative h-12 rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden"
//           style={{ animationDelay: `${i * 0.1}s` }}
//         >
//           {/* Shimmer Effect */}
//           <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]">
//             <div className="h-full w-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
//           </div>

//           {/* Content Skeleton */}
//           <div className="relative h-full flex items-center px-4">
//             <div className="w-2 h-2 rounded-full bg-gray-300 mr-3 animate-pulse" />
//             <div className="flex-1 space-y-2">
//               <div className="h-3 w-32 rounded bg-gray-300/70" />
//             </div>
//             <div className="w-4 h-4 rounded bg-gray-300/50" />
//           </div>
//         </div>
//       ))}

//       {/* Pulsing Dots Indicator */}
//       <div className="flex justify-center items-center gap-2 py-4">
//         {[...Array(3)].map((_, i) => (
//           <div
//             key={i}
//             className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
//             style={{
//               animation: `bounce 1.4s infinite ease-in-out`,
//               animationDelay: `${i * 0.16}s`,
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// // ✨ Empty State Component
// const EmptyState = () => {
//   return (
//     <div className="p-12 text-center">
//       <div className="relative inline-block mb-4">
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-30 animate-pulse" />
//         <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-4">
//           <AlertCircle className="text-gray-400" size={32} />
//         </div>
//       </div>
//       <p className="text-sm text-gray-500 font-medium mb-1">No records found</p>
//       <p className="text-xs text-gray-400">
//         Try selecting a different report type
//       </p>
//     </div>
//   );
// };

// export default function ReworkSelectorModal({ onClose, onGenerate }) {
//   const [mode, setMode] = useState("rework-approved");
//   const [rows, setRows] = useState(null);
//   const [selectedUid, setSelectedUid] = useState("");
//   const [loading, setLoading] = useState(true);

//   const isInitialLoading = loading && rows === null;

//   useEffect(() => {
//     let endpoint = "";
//     const controller = new AbortController();
//     const startTime = Date.now();

//     if (mode === "rework-approved") {
//       endpoint = "/api/trace/rework-approved/uids";
//     } else if (mode === "rework-approved-pending-from-production") {
//       endpoint = "/api/trace/rework-pending/uids";
//     } else if (mode === "rework-pending") {
//       endpoint = "/api/trace/rework-pending-count/uids";
//     }

//     setLoading(true);
//     setSelectedUid("");
//     setRows(null);

//     fetch(`${API_BASE}${endpoint}`, { signal: controller.signal })
//       .then((r) => r.json())
//       .then((d) => {
//         setRows(Array.isArray(d?.data) ? d.data : []);
//       })
//       .catch((e) => {
//         if (e.name !== "AbortError") setRows([]);
//       })
//       .finally(() => {
//         const elapsed = Date.now() - startTime;
//         const remaining = MIN_LOADER_TIME - elapsed;

//         if (remaining > 0) {
//           setTimeout(() => setLoading(false), remaining);
//         } else {
//           setLoading(false);
//         }
//       });

//     return () => controller.abort();
//   }, [mode]);

//   const handleGenerate = () => {
//     if (!selectedUid) return alert("Select a UID");
//     onGenerate({ uid: selectedUid, reportType: mode });
//     onClose();
//   };

//   const modes = [
//     {
//       id: "rework-approved",
//       label: "Rework Approved",
//       icon: FileCheck,
//       color: "from-green-500 to-emerald-600",
//       bgColor: "bg-green-50",
//       textColor: "text-green-700",
//       borderColor: "border-green-500",
//     },
//     {
//       id: "rework-approved-pending-from-production",
//       label: "Approved Pending",
//       icon: Clock,
//       color: "from-orange-500 to-amber-600",
//       bgColor: "bg-orange-50",
//       textColor: "text-orange-700",
//       borderColor: "border-orange-500",
//     },
//     {
//       id: "rework-pending",
//       label: "Rework Pending",
//       icon: AlertCircle,
//       color: "from-red-500 to-rose-600",
//       bgColor: "bg-red-50",
//       textColor: "text-red-700",
//       borderColor: "border-red-500",
//     },
//   ];

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slideUp">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 relative overflow-hidden">
//           {/* Animated Background Pattern */}
//           <div className="absolute inset-0 opacity-10">
//             <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl animate-float" />
//             <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl animate-float-delayed" />
//           </div>

//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all hover:rotate-90 duration-300 z-10"
//           >
//             <X size={20} />
//           </button>

//           <div className="relative">
//             <h2 className="text-2xl font-bold text-white">Rework Reports</h2>
//             <p className="text-white/90 text-sm mt-1">
//               Select report type and UID to generate
//             </p>
//           </div>
//         </div>

//         <div className="p-6">
//           {/* Mode Selector */}
//           <div className="grid grid-cols-3 gap-3 mb-6">
//             {modes.map((m) => {
//               const Icon = m.icon;
//               const isActive = mode === m.id;

//               return (
//                 <button
//                   key={m.id}
//                   onClick={() => setMode(m.id)}
//                   className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
//                     isActive
//                       ? `${m.borderColor} ${m.bgColor} shadow-lg scale-105`
//                       : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
//                   }`}
//                 >
//                   <div
//                     className={`inline-flex p-2 rounded-lg mb-2 transition-all ${
//                       isActive
//                         ? `bg-gradient-to-br ${m.color} shadow-md`
//                         : "bg-gray-100"
//                     }`}
//                   >
//                     <Icon
//                       size={20}
//                       className={`${isActive ? "text-white" : "text-gray-600"} transition-transform ${
//                         isActive ? "scale-110" : ""
//                       }`}
//                     />
//                   </div>
//                   <div
//                     className={`text-xs font-semibold ${
//                       isActive ? m.textColor : "text-gray-700"
//                     }`}
//                   >
//                     {m.label}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           {/* UID Section */}
//           <div className="mb-6">
//             <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//               <span className="w-1 h-4 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full animate-pulse"></span>
//               Select UID
//               {!isInitialLoading && Array.isArray(rows) && (
//                 <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full animate-fadeIn">
//                   {rows.length} {rows.length === 1 ? "record" : "records"}
//                 </span>
//               )}
//             </h3>

//             <div className="rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 transition-all duration-300">
//               <div className="max-h-72 overflow-auto custom-scrollbar">
//                 {/* Loading State */}
//                 {isInitialLoading && <ShimmerLoader />}

//                 {/* Empty State */}
//                 {!loading && Array.isArray(rows) && rows.length === 0 && (
//                   <EmptyState />
//                 )}

//                 {/* Data List */}
//                 {!loading &&
//                   Array.isArray(rows) &&
//                   rows.map((r, index) => {
//                     const uid = r.uid || r.Uid;
//                     if (!uid) return null;

//                     return (
//                       <div
//                         key={uid}
//                         onClick={() => setSelectedUid(uid)}
//                         className={`p-4 cursor-pointer flex justify-between items-center border-b transition-all duration-300 animate-fadeIn ${
//                           selectedUid === uid
//                             ? "bg-gradient-to-r from-blue-100 to-purple-100 border-l-4 border-purple-500 shadow-sm"
//                             : "bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30"
//                         }`}
//                         style={{ animationDelay: `${index * 0.05}s` }}
//                       >
//                         <div className="flex items-center gap-3">
//                           <div
//                             className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                               selectedUid === uid
//                                 ? "bg-purple-500 scale-125"
//                                 : "bg-gray-300"
//                             }`}
//                           />
//                           <span
//                             className={`font-mono text-sm ${
//                               selectedUid === uid
//                                 ? "font-semibold text-purple-700"
//                                 : "text-gray-700"
//                             }`}
//                           >
//                             {uid}
//                           </span>
//                         </div>
//                         {selectedUid === uid && (
//                           <ChevronRight
//                             size={18}
//                             className="text-purple-500 animate-pulse"
//                           />
//                         )}
//                       </div>
//                     );
//                   })}
//               </div>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-3">
//             <button
//               onClick={onClose}
//               className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-300 hover:shadow-md"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={handleGenerate}
//               disabled={!selectedUid}
//               className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
//                 selectedUid
//                   ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:scale-105 active:scale-95"
//                   : "bg-gray-300 cursor-not-allowed"
//               }`}
//             >
//               Generate Report
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// components/ReworkSelectorModal.jsx
import React, { useEffect, useState } from "react";
import { FileCheck, Clock, AlertCircle, X, ChevronRight } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE;
const MIN_LOADER_TIME = 400; // ms

// ✨ Beautiful Shimmer Loader Component
const ShimmerLoader = () => {
  return (
    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="relative h-10 sm:h-12 rounded-md sm:rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>

          {/* Content Skeleton */}
          <div className="relative h-full flex items-center px-3 sm:px-4">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300 mr-2 sm:mr-3 animate-pulse" />
            <div className="flex-1 space-y-1.5 sm:space-y-2">
              <div className="h-2.5 sm:h-3 w-24 sm:w-32 rounded bg-gray-300/70" />
            </div>
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-gray-300/50" />
          </div>
        </div>
      ))}

      {/* Pulsing Dots Indicator */}
      <div className="flex justify-center items-center gap-1.5 sm:gap-2 py-3 sm:py-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            style={{
              animation: `bounce 1.4s infinite ease-in-out`,
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ✨ Empty State Component
const EmptyState = () => {
  return (
    <div className="p-8 sm:p-10 md:p-12 text-center">
      <div className="relative inline-block mb-3 sm:mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-30 animate-pulse" />
        <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-3 sm:p-4">
          <AlertCircle className="text-gray-400" size={24} />
        </div>
      </div>
      <p className="text-xs sm:text-sm text-gray-500 font-medium mb-1">
        No records found
      </p>
      <p className="text-[10px] sm:text-xs text-gray-400">
        Try selecting a different report type
      </p>
    </div>
  );
};

export default function ReworkSelectorModal({ onClose, onGenerate, isMobile }) {
  const [mode, setMode] = useState("rework-approved");
  const [rows, setRows] = useState(null);
  const [selectedUid, setSelectedUid] = useState("");
  const [loading, setLoading] = useState(true);

  const isInitialLoading = loading && rows === null;

  useEffect(() => {
    let endpoint = "";
    const controller = new AbortController();
    const startTime = Date.now();

    if (mode === "rework-approved") {
      endpoint = "/api/trace/rework-approved/uids";
    } else if (mode === "rework-approved-pending-from-production") {
      endpoint = "/api/trace/rework-pending/uids";
    } else if (mode === "rework-pending") {
      endpoint = "/api/trace/rework-pending-count/uids";
    }

    setLoading(true);
    setSelectedUid("");
    setRows(null);

    fetch(`${API_BASE}${endpoint}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => {
        setRows(Array.isArray(d?.data) ? d.data : []);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setRows([]);
      })
      .finally(() => {
        const elapsed = Date.now() - startTime;
        const remaining = MIN_LOADER_TIME - elapsed;

        if (remaining > 0) {
          setTimeout(() => setLoading(false), remaining);
        } else {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [mode]);

  const handleGenerate = () => {
    if (!selectedUid) return alert("Select a UID");
    onGenerate({ uid: selectedUid, reportType: mode });
    onClose();
  };

  const modes = [
    {
      id: "rework-approved",
      label: "Rework Approved",
      shortLabel: "Approved",
      icon: FileCheck,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-500",
    },
    {
      id: "rework-approved-pending-from-production",
      label: "Approved Pending",
      shortLabel: "Pending",
      icon: Clock,
      color: "from-orange-500 to-amber-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      borderColor: "border-orange-500",
    },
    {
      id: "rework-pending",
      label: "Rework Pending",
      shortLabel: "Rework",
      icon: AlertCircle,
      color: "from-red-500 to-rose-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-500",
    },
  ];

  return (
    <div
      className={`
      ${isMobile ? "fixed inset-0" : "fixed inset-0"} 
      bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] 
      p-2 sm:p-3 md:p-4 animate-fadeIn
    `}
    >
      <div
        className={`
        bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl 
        w-full 
        ${
          isMobile
            ? "max-w-full max-h-[90vh]"
            : "max-w-[90vw] sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[85vh] sm:max-h-[90vh]"
        }
        overflow-hidden animate-slideUp flex flex-col
      `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 sm:p-5 md:p-6 relative overflow-hidden flex-shrink-0">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-white rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-white rounded-full blur-3xl animate-float-delayed" />
          </div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition-all hover:rotate-90 duration-300 z-10"
          >
            <X size={16} className="sm:w-5 sm:h-5" />
          </button>

          <div className="relative pr-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
              Rework Reports
            </h2>
            <p className="text-white/90 text-xs sm:text-sm mt-0.5 sm:mt-1">
              Select report type and UID to generate
            </p>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6 overflow-y-auto flex-1">
          {/* Mode Selector */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 mb-4 sm:mb-5 md:mb-6">
            {modes.map((m) => {
              const Icon = m.icon;
              const isActive = mode === m.id;

              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`
                    p-2 sm:p-3 md:p-4 
                    rounded-lg sm:rounded-xl 
                    border sm:border-2 
                    transition-all duration-300 transform 
                    hover:scale-105 
                    ${
                      isActive
                        ? `${m.borderColor} ${m.bgColor} shadow-lg scale-105`
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                    }
                  `}
                >
                  <div
                    className={`
                      inline-flex p-1.5 sm:p-2 rounded-md sm:rounded-lg 
                      mb-1 sm:mb-2 transition-all 
                      ${isActive ? `bg-gradient-to-br ${m.color} shadow-md` : "bg-gray-100"}
                    `}
                  >
                    <Icon
                      size={14}
                      className={`
                        sm:w-4 sm:h-4 md:w-5 md:h-5
                        ${isActive ? "text-white" : "text-gray-600"} 
                        transition-transform 
                        ${isActive ? "scale-110" : ""}
                      `}
                    />
                  </div>
                  <div
                    className={`
                      text-[10px] sm:text-xs font-semibold 
                      ${isActive ? m.textColor : "text-gray-700"}
                    `}
                  >
                    <span className="hidden sm:inline">{m.label}</span>
                    <span className="sm:hidden">{m.shortLabel}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* UID Section */}
          <div className="mb-4 sm:mb-5 md:mb-6">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
              <span className="w-0.5 sm:w-1 h-3 sm:h-4 bg-gradient-to-b from-cyan-500 to-purple-500 rounded-full animate-pulse"></span>
              Select UID
              {!isInitialLoading && Array.isArray(rows) && (
                <span className="ml-auto text-[10px] sm:text-xs text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full animate-fadeIn">
                  {rows.length} {rows.length === 1 ? "record" : "records"}
                </span>
              )}
            </h3>

            <div className="rounded-lg sm:rounded-xl overflow-hidden border sm:border-2 border-gray-200 bg-gray-50 transition-all duration-300">
              <div className="max-h-48 sm:max-h-60 md:max-h-72 overflow-auto custom-scrollbar">
                {/* Loading State */}
                {isInitialLoading && <ShimmerLoader />}

                {/* Empty State */}
                {!loading && Array.isArray(rows) && rows.length === 0 && (
                  <EmptyState />
                )}

                {/* Data List */}
                {!loading &&
                  Array.isArray(rows) &&
                  rows.map((r, index) => {
                    const uid = r.uid || r.Uid;
                    if (!uid) return null;

                    return (
                      <div
                        key={uid}
                        onClick={() => setSelectedUid(uid)}
                        className={`
                          p-3 sm:p-4 
                          cursor-pointer 
                          flex justify-between items-center 
                          border-b 
                          transition-all duration-300 animate-fadeIn 
                          ${
                            selectedUid === uid
                              ? "bg-gradient-to-r from-blue-100 to-purple-100 border-l-2 sm:border-l-4 border-purple-500 shadow-sm"
                              : "bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30"
                          }
                        `}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div
                            className={`
                              w-1.5 h-1.5 sm:w-2 sm:h-2 
                              rounded-full transition-all duration-300 
                              ${
                                selectedUid === uid
                                  ? "bg-purple-500 scale-125"
                                  : "bg-gray-300"
                              }
                            `}
                          />
                          <span
                            className={`
                            font-mono text-xs sm:text-sm 
                            ${selectedUid === uid ? "font-semibold text-purple-700" : "text-gray-700"}
                          `}
                          >
                            {uid}
                          </span>
                        </div>
                        {selectedUid === uid && (
                          <ChevronRight
                            size={14}
                            className="sm:w-4 sm:h-4 text-purple-500 animate-pulse"
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-300 hover:shadow-md text-xs sm:text-sm md:text-base"
            >
              Cancel
            </button>

            <button
              onClick={handleGenerate}
              disabled={!selectedUid}
              className={`
                flex-1 py-2 sm:py-2.5 md:py-3 
                rounded-lg sm:rounded-xl 
                font-semibold text-white 
                transition-all duration-300 
                text-xs sm:text-sm md:text-base
                ${
                  selectedUid
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:scale-105 active:scale-95"
                    : "bg-gray-300 cursor-not-allowed"
                }
              `}
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
