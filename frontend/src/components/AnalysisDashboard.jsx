// // import React, { useState, useEffect } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { useLocation } from "react-router-dom";
// // import {
// //   Factory,
// //   Zap,
// //   Leaf,
// //   AlertTriangle,
// //   CheckCircle,
// //   Clock,
// //   Settings,
// //   BarChart3,
// //   Cpu,
// //   Battery,
// //   Thermometer,
// //   Gauge,
// //   TrendingUp,
// //   Shield,
// //   RotateCcw
// // } from 'lucide-react';

// // // Import Header component
// // import Header from './Header';

// // // Add this component at the top of your file (after imports)
// // const AnimatedBackground = () => {
// //   return (
// //     <div className="fixed inset-0 -z-10 overflow-hidden">
// //       {/* Base gradient - Light blue to purple like your UI */}
// //       <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-blue-500" />
      
// //       {/* Animated gradient orbs */}
// //       <motion.div
// //         animate={{
// //           scale: [1, 1.2, 1],
// //           opacity: [0.4, 0.6, 0.4],
// //         }}
// //         transition={{
// //           duration: 8,
// //           repeat: Infinity,
// //           ease: "easeInOut"
// //         }}
// //         className="absolute top-0 -left-48 w-96 h-96 bg-blue-300/40 rounded-full blur-3xl"
// //       />
// //       <motion.div
// //         animate={{
// //           scale: [1, 1.3, 1],
// //           opacity: [0.3, 0.5, 0.3],
// //         }}
// //         transition={{
// //           duration: 10,
// //           repeat: Infinity,
// //           ease: "easeInOut",
// //           delay: 2
// //         }}
// //         className="absolute bottom-0 -right-48 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"
// //       />
// //       <motion.div
// //         animate={{
// //           scale: [1, 1.1, 1],
// //           opacity: [0.3, 0.4, 0.3],
// //         }}
// //         transition={{
// //           duration: 12,
// //           repeat: Infinity,
// //           ease: "easeInOut",
// //           delay: 4
// //         }}
// //         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl"
// //       />
      
// //       {/* Grid pattern overlay - subtle for light theme */}
// //       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
// //       {/* Radial gradient overlay - lighter */}
// //       <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent)]" />
// //     </div>
// //   );
// // };

// // const AnalysisDashboard = ({ uid: externalUid }) => {
// //   const [uid, setUid] = useState(externalUid || '36800M58U0000001280325');
// //   const [analysisData, setAnalysisData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);

// //   // Sample UIDs for testing
// //   const sampleUids = [
// //     { id: '36800M58U0000001280325', label: 'Perfect Quality', type: 'perfect' },
// //     { id: '36800M58U0010293240925', label: 'Fast Performance', type: 'performance' },
// //     { id: '36700M58U0000108050425', label: 'Has Issues', type: 'issues' }
// //   ];

// //   const fetchAnalysis = async (productUid) => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const response = await fetch(`http://localhost:4000/api/trace/analysis?uid=${productUid}`);
// //       const data = await response.json();
// //       if (data.success) {
// //         setAnalysisData(data);
// //       } else {
// //         setError(data.message || 'Failed to fetch analysis');
// //       }
// //     } catch (err) {
// //       setError('Connection error: ' + err.message);
// //     }
// //     setLoading(false);
// //   };

// //   useEffect(() => {
// //     fetchAnalysis(uid);
// //   }, []);

// //   const location = useLocation();
// //   const isStandalone = location.pathname.includes("/analytics-window");

// //   const getStatusColor = (status) => {
// //     switch (status) {
// //       case 'PASS': return 'text-emerald-400';
// //       case 'FAIL': return 'text-rose-400';
// //       case 'REWORK': return 'text-amber-400';
// //       default: return 'text-gray-600';
// //     }
// //   };

// //   const getStatusIcon = (status) => {
// //     switch (status) {
// //       case 'PASS': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
// //       case 'FAIL': return <AlertTriangle className="w-5 h-5 text-rose-400" />;
// //       case 'REWORK': return <RotateCcw className="w-5 h-5 text-amber-400" />;
// //       default: return <Clock className="w-5 h-5 text-gray-600" />;
// //     }
// //   };

// //   const ProgressBar = ({ percentage, color = 'blue', label }) => (
// //     <div className="space-y-2">
// //       <div className="flex justify-between text-sm">
// //         <span className="text-gray-700">{label}</span>
// //         <span className="text-gray-600">{percentage}%</span>
// //       </div>
// //       <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
// //         <motion.div
// //           initial={{ width: 0 }}
// //           animate={{ width: `${percentage}%` }}
// //           transition={{ duration: 1, ease: "easeOut" }}
// //           className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-300 rounded-full shadow-lg shadow-${color}-500/50`}
// //         />
// //       </div>
// //     </div>
// //   );

// //   const StatCard = ({ icon, title, value, subtitle, color = 'blue', glow = false }) => (
// //     <motion.div
// //       whileHover={{ scale: 1.02, y: -5 }}
// //       className={`relative p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 ${
// //         glow ? `shadow-lg shadow-${color}-500/20` : ''
// //       } hover:shadow-xl hover:shadow-${color}-500/30 transition-all duration-300`}
// //     >
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <p className="text-gray-600 text-sm font-medium">{title}</p>
// //           <p className="text-2xl font-bold text-white mt-1">{value}</p>
// //           {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
// //         </div>
// //         <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400`}>
// //           {icon}
// //         </div>
// //       </div>
// //     </motion.div>
// //   );

// //   const StationNode = ({ station, isCurrent, isCompleted, isBottleneck }) => (
// //     <motion.div
// //       whileHover={{ scale: 1.05 }}
// //       className={`relative p-4 rounded-xl backdrop-blur-sm border-2 transition-all duration-300 ${
// //         isCurrent 
// //           ? 'bg-blue-500/10 border-blue-400 shadow-lg shadow-blue-500/25' 
// //           : isCompleted
// //           ? 'bg-emerald-500/10 border-emerald-400 shadow-lg shadow-emerald-500/25'
// //           : 'bg-slate-800/50 border-slate-600'
// //       } ${isBottleneck ? 'animate-pulse-glow' : ''}`}
// //     >
// //       <div className="text-center">
// //         <div className="flex justify-center mb-2">
// //           {getStatusIcon(station.test_status)}
// //         </div>
// //         <h4 className="font-semibold text-white text-sm">{station.station_name}</h4>
// //         <p className="text-gray-600 text-xs mt-1">Seq: {station.sequence}</p>
// //         {station.test_value && (
// //           <p className="text-gray-700 text-xs mt-1">{station.test_value} {station.test_unit}</p>
// //         )}
// //       </div>
      
// //       {isBottleneck && (
// //         <div className="absolute -top-2 -right-2">
// //           <div className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
// //             ⚠️
// //           </div>
// //         </div>
// //       )}
// //     </motion.div>
// //   );

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
// //         <motion.div
// //           animate={{ rotate: 360 }}
// //           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
// //           className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
// //         />
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
// //         <motion.div
// //           initial={{ scale: 0 }}
// //           animate={{ scale: 1 }}
// //           className="text-center p-8"
// //         >
// //           <AlertTriangle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
// //           <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
// //           <p className="text-gray-600">{error}</p>
// //         </motion.div>
// //       </div>
// //     );
// //   }

// //   if (!analysisData) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
// //         <div className="text-center">
// //           <Factory className="w-16 h-16 text-blue-400 mx-auto mb-4" />
// //           <h2 className="text-2xl font-bold text-white mb-2">No Data</h2>
// //           <p className="text-gray-600">Enter a UID to start analysis</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const { product_info, station_analysis, quality_metrics, industry4_metrics, recommendations } = analysisData;

// //   return (
// //     <div className="min-h-screen bg-transparent text-slate-900 p-6">
      
// // {/* Show Header only when not in /analytics-window route */}
// // {/* {!isStandalone && (
// //   <Header
// //     uid={uid}
// //     setUid={setUid}
// //     fetchAnalysis={fetchAnalysis}
// //     sampleUids={sampleUids}
// //     currentUid={uid}
// //   />
// // )} */}

// //       <div className="max-w-7xl mx-auto space-y-8">
// //         {/* Product Info Card */}
// //         <motion.div
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           className="grid grid-cols-1 lg:grid-cols-4 gap-6"
// //         >
// //           <StatCard
// //             icon={<Cpu className="w-6 h-6" />}
// //             title="Product ID"
// //             value={product_info.product_id}
// //             subtitle={product_info.product_model}
// //             color="blue"
// //             glow
// //           />
// //           <StatCard
// //             icon={<Gauge className="w-6 h-6" />}
// //             title="Cycle Time"
// //             value={product_info.total_cycle_time || 'N/A'}
// //             subtitle="Total production"
// //             color="emerald"
// //           />
// //           <StatCard
// //             icon={<Battery className="w-6 h-6" />}
// //             title="Status"
// //             value={product_info.status}
// //             subtitle={product_info.shift}
// //             color="emerald"
// //             glow={product_info.status === 'PASS'}
// //           />
// //           <StatCard
// //             icon={<Thermometer className="w-6 h-6" />}
// //             title="Variant"
// //             value={product_info.variant}
// //             subtitle="Product type"
// //             color="cyan"
// //           />
// //         </motion.div>

// //         {/* Production Flow */}
// //         <motion.section
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ delay: 0.2 }}
// //           className="bg-slate-800/30 rounded-2xl p-6 backdrop-blur-sm border border-slate-700/50"
// //         >
// //           <div className="flex items-center space-x-3 mb-6">
// //             <BarChart3 className="w-6 h-6 text-blue-400" />
// //             <h2 className="text-xl font-bold text-white">Production Flow</h2>
// //             <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
// //             <span className="text-gray-600">
// //               {station_analysis.completed_stations}/{station_analysis.total_stations} Stations
// //             </span>
// //           </div>

// //           <div className="flex overflow-x-auto pb-4 space-x-4">
// //           {station_analysis.station_sequence.map((station, index) => (
// //             <div key={`${station.sequence}-${index}`} className="flex items-center">
// //               <StationNode
// //                 station={station}
// //                 isCurrent={index === station_analysis.station_sequence.length - 1}
// //                 isCompleted={station.test_status === 'PASS'}
// //                 isBottleneck={station.test_status === 'FAIL'}
// //               />
// //               {index < station_analysis.station_sequence.length - 1 && (
// //                 <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-slate-600 mx-2 rounded-full" />
// //               )}
// //             </div>
// //           ))}
// //           </div>
// //         </motion.section>

// //         {/* Quality & Performance Metrics */}
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// //           {/* Quality Metrics */}
// //           <motion.section
// //             initial={{ opacity: 0, x: -20 }}
// //             animate={{ opacity: 1, x: 0 }}
// //             transition={{ delay: 0.3 }}
// //             className="bg-slate-800/30 rounded-2xl p-6 backdrop-blur-sm border border-slate-700/50"
// //           >
// //             <div className="flex items-center space-x-3 mb-6">
// //               <Shield className="w-6 h-6 text-emerald-400" />
// //               <h2 className="text-xl font-bold text-white">Quality Metrics</h2>
// //             </div>
            
// //             <div className="space-y-6">
// //               <ProgressBar 
// //                 percentage={quality_metrics.first_pass_yield} 
// //                 color="emerald" 
// //                 label="First Pass Yield" 
// //               />
// //               <ProgressBar 
// //                 percentage={85.2} 
// //                 color="blue" 
// //                 label="Station Yield Average" 
// //               />
// //               <ProgressBar 
// //                 percentage={15} 
// //                 color="amber" 
// //                 label="Rework Rate" 
// //               />
              
// //               <div className="grid grid-cols-2 gap-4 mt-6">
// //                 <div className="text-center p-4 bg-slate-700/30 rounded-xl">
// //                   <div className="text-2xl font-bold text-white">{quality_metrics.total_tests}</div>
// //                   <div className="text-gray-600 text-sm">Total Tests</div>
// //                 </div>
// //                 <div className="text-center p-4 bg-slate-700/30 rounded-xl">
// //                   <div className="text-2xl font-bold text-emerald-400">{quality_metrics.passed_tests}</div>
// //                   <div className="text-gray-600 text-sm">Passed Tests</div>
// //                 </div>
// //               </div>
// //             </div>
// //           </motion.section>

// //           {/* Industry 4.0 Insights */}
// //           <motion.section
// //             initial={{ opacity: 0, x: 20 }}
// //             animate={{ opacity: 1, x: 0 }}
// //             transition={{ delay: 0.4 }}
// //             className="bg-slate-800/30 rounded-2xl p-6 backdrop-blur-sm border border-slate-700/50"
// //           >
// //             <div className="flex items-center space-x-3 mb-6">
// //               <TrendingUp className="w-6 h-6 text-cyan-400" />
// //               <h2 className="text-xl font-bold text-white">Industry 4.0 Insights</h2>
// //             </div>

// //             <div className="space-y-6">
// //               <div className="grid grid-cols-2 gap-4">
// //                 <StatCard
// //                   icon={<Zap className="w-4 h-4" />}
// //                   title="Energy Used"
// //                   value="3.37 kWh"
// //                   color="amber"
// //                   small
// //                 />
// //                 <StatCard
// //                   icon={<Leaf className="w-4 h-4" />}
// //                   title="CO2 Emissions"
// //                   value="2.86 kg"
// //                   color="emerald"
// //                   small
// //                 />
// //               </div>

// //               <div className="space-y-4">
// //                 <h3 className="text-gray-700 font-semibold">Equipment Health</h3>
// //                 <ProgressBar percentage={92} color="emerald" label="Voltage Tester" />
// //                 <ProgressBar percentage={78} color="amber" label="Current Meter" />
// //                 <ProgressBar percentage={65} color="rose" label="Insulation Test" />
// //               </div>
// //             </div>
// //           </motion.section>
// //         </div>

// //         {/* Recommendations */}
// //         {recommendations && recommendations.length > 0 && (
// //           <motion.section
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ delay: 0.5 }}
// //             className="bg-slate-800/30 rounded-2xl p-6 backdrop-blur-sm border border-amber-500/30"
// //           >
// //             <div className="flex items-center space-x-3 mb-6">
// //               <AlertTriangle className="w-6 h-6 text-amber-400" />
// //               <h2 className="text-xl font-bold text-white">Smart Recommendations</h2>
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               {recommendations.map((rec, index) => (
// //                 <motion.div
// //                   key={index}
// //                   whileHover={{ scale: 1.02 }}
// //                   className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20"
// //                 >
// //                   <div className="flex items-start space-x-3">
// //                     <div className="p-2 bg-amber-500/20 rounded-lg">
// //                       <Settings className="w-4 h-4 text-amber-400" />
// //                     </div>
// //                     <div>
// //                       <h4 className="font-semibold text-white">{rec.title}</h4>
// //                       <p className="text-gray-700 text-sm mt-1">{rec.description}</p>
// //                       <p className="text-amber-400 text-xs mt-2">{rec.action}</p>
// //                     </div>
// //                   </div>
// //                 </motion.div>
// //               ))}
// //             </div>
// //           </motion.section>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default AnalysisDashboard;


// // import React, { useState, useEffect } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { useLocation } from "react-router-dom";
// // import {
// //   Factory,
// //   Zap,
// //   Leaf,
// //   AlertTriangle,
// //   CheckCircle,
// //   Clock,
// //   Settings,
// //   BarChart3,
// //   Cpu,
// //   Battery,
// //   Thermometer,
// //   Gauge,
// //   TrendingUp,
// //   Shield,
// //   RotateCcw
// // } from 'lucide-react';

// // // Import Header component
// // import Header from './Header';  

// // // Animated Background Component - Light Theme
// // const AnimatedBackground = () => {
// //   return (
// //     <div className="fixed inset-0 -z-10 overflow-hidden">
// //       {/* Base gradient - Light blue to purple like your UI */}
// //       <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-blue-500" />
      
// //       {/* Animated gradient orbs */}
// //       <motion.div
// //         animate={{
// //           scale: [1, 1.2, 1],
// //           opacity: [0.4, 0.6, 0.4],
// //         }}
// //         transition={{
// //           duration: 8,
// //           repeat: Infinity,
// //           ease: "easeInOut"
// //         }}
// //         className="absolute top-0 -left-48 w-96 h-96 bg-blue-300/40 rounded-full blur-3xl"
// //       />
// //       <motion.div
// //         animate={{
// //           scale: [1, 1.3, 1],
// //           opacity: [0.3, 0.5, 0.3],
// //         }}
// //         transition={{
// //           duration: 10,
// //           repeat: Infinity,
// //           ease: "easeInOut",
// //           delay: 2
// //         }}
// //         className="absolute bottom-0 -right-48 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"
// //       />
// //       <motion.div
// //         animate={{
// //           scale: [1, 1.1, 1],
// //           opacity: [0.3, 0.4, 0.3],
// //         }}
// //         transition={{
// //           duration: 12,
// //           repeat: Infinity,
// //           ease: "easeInOut",
// //           delay: 4
// //         }}
// //         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl"
// //       />
      
// //       {/* Grid pattern overlay - subtle for light theme */}
// //       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
// //       {/* Radial gradient overlay - lighter */}
// //       <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent)]" />
// //     </div>
// //   );
// // };

// // const AnalysisDashboard = ({ uid: externalUid }) => {
// //   const [uid, setUid] = useState(externalUid || '36800M58U0000001280325');
// //   const [analysisData, setAnalysisData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);

// //   // Sample UIDs for testing
// //   const sampleUids = [
// //     { id: '36800M58U0000001280325', label: 'Perfect Quality', type: 'perfect' },
// //     { id: '36800M58U0010293240925', label: 'Fast Performance', type: 'performance' },
// //     { id: '36700M58U0000108050425', label: 'Has Issues', type: 'issues' }
// //   ];

// //   const fetchAnalysis = async (productUid) => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const response = await fetch(`http://localhost:4000/api/trace/analysis?uid=${productUid}`);
// //       const data = await response.json();
// //       if (data.success) {
// //         setAnalysisData(data);
// //       } else {
// //         setError(data.message || 'Failed to fetch analysis');
// //       }
// //     } catch (err) {
// //       setError('Connection error: ' + err.message);
// //     }
// //     setLoading(false);
// //   };

// //   useEffect(() => {
// //     fetchAnalysis(uid);
// //   }, []);

// //   const location = useLocation();
// //   const isStandalone = location.pathname.includes("/analytics-window");

// //   const getStatusColor = (status) => {
// //     switch (status) {
// //       case 'PASS': return 'text-emerald-600';
// //       case 'FAIL': return 'text-rose-600';
// //       case 'REWORK': return 'text-amber-600';
// //       default: return 'text-gray-600';
// //     }
// //   };

// //   const getStatusIcon = (status) => {
// //     switch (status) {
// //       case 'PASS': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
// //       case 'FAIL': return <AlertTriangle className="w-5 h-5 text-rose-600" />;
// //       case 'REWORK': return <RotateCcw className="w-5 h-5 text-amber-600" />;
// //       default: return <Clock className="w-5 h-5 text-gray-600" />;
// //     }
// //   };

// //   const ProgressBar = ({ percentage, color = 'blue', label }) => {
// //     const colorMap = {
// //       blue: 'from-blue-500 to-blue-400 shadow-blue-500/50',
// //       emerald: 'from-emerald-500 to-emerald-400 shadow-emerald-500/50',
// //       amber: 'from-amber-500 to-amber-400 shadow-amber-500/50',
// //       rose: 'from-rose-500 to-rose-400 shadow-rose-500/50',
// //       cyan: 'from-cyan-500 to-cyan-400 shadow-cyan-500/50'
// //     };

// //     return (
// //       <div className="space-y-2">
// //         <div className="flex justify-between text-sm">
// //           <span className="text-gray-700 font-medium">{label}</span>
// //           <span className="text-gray-600 font-semibold">{percentage}%</span>
// //         </div>
// //         <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden border border-gray-300/50">
// //           <motion.div
// //             initial={{ width: 0 }}
// //             animate={{ width: `${percentage}%` }}
// //             transition={{ duration: 1.5, ease: "easeOut" }}
// //             className={`h-full bg-gradient-to-r ${colorMap[color]} rounded-full shadow-lg`}
// //           />
// //         </div>
// //       </div>
// //     );
// //   };

// //   const StatCard = ({ icon, title, value, subtitle, color = 'blue', glow = false }) => {
// //     const colorMap = {
// //       blue: 'from-blue-50 to-blue-100/50 border-blue-300/50 shadow-blue-500/10',
// //       emerald: 'from-emerald-50 to-emerald-100/50 border-emerald-300/50 shadow-emerald-500/10',
// //       amber: 'from-amber-50 to-amber-100/50 border-amber-300/50 shadow-amber-500/10',
// //       cyan: 'from-cyan-50 to-cyan-100/50 border-cyan-300/50 shadow-cyan-500/10',
// //       purple: 'from-purple-50 to-purple-100/50 border-purple-300/50 shadow-purple-500/10'
// //     };

// //     const iconBgMap = {
// //       blue: 'bg-blue-100 text-blue-600',
// //       emerald: 'bg-emerald-100 text-emerald-600',
// //       amber: 'bg-amber-100 text-amber-600',
// //       cyan: 'bg-cyan-100 text-cyan-600',
// //       purple: 'bg-purple-100 text-purple-600'
// //     };

// //     return (
// //       <motion.div
// //         whileHover={{ scale: 1.02, y: -4 }}
// //         className={`relative p-6 rounded-2xl bg-gradient-to-br ${colorMap[color]} backdrop-blur-xl border ${
// //           glow ? `shadow-xl ${colorMap[color].split('shadow-')[1]}` : 'shadow-lg'
// //         } hover:shadow-2xl transition-all duration-300`}
// //       >
// //         <div className="flex items-center justify-between">
// //           <div className="flex-1">
// //             <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
// //             <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
// //             {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
// //           </div>
// //           <div className={`p-3 rounded-xl ${iconBgMap[color]} backdrop-blur-sm`}>
// //             {icon}
// //           </div>
// //         </div>
// //       </motion.div>
// //     );
// //   };

// //   // const StationNode = ({ station, isCurrent, isCompleted, isBottleneck }) => (
// //   //   <motion.div
// //   //     whileHover={{ scale: 1.05, y: -4 }}
// //   //     className={`relative p-5 rounded-xl backdrop-blur-xl border-2 transition-all duration-300 min-w-[140px] ${
// //   //       isCurrent 
// //   //         ? 'bg-gradient-to-br from-blue-100 to-blue-50 border-blue-500 shadow-lg shadow-blue-500/30' 
// //   //         : isCompleted
// //   //         ? 'bg-gradient-to-br from-emerald-100 to-emerald-50 border-emerald-500 shadow-lg shadow-emerald-500/30'
// //   //         : 'bg-white/80 border-gray-300'
// //   //     } ${isBottleneck ? 'animate-pulse' : ''}`}
// //   //   >
// //   //     <div className="text-center">
// //   //       <div className="flex justify-center mb-3">
// //   //         {getStatusIcon(station.test_status)}
// //   //       </div>
// //   //       <h4 className="font-semibold text-gray-900 text-sm mb-1">{station.station_name}</h4>
// //   //       <p className="text-gray-600 text-xs mb-2">Seq: {station.sequence}</p>
// //   //       {station.test_value && (
// //   //         <p className="text-gray-700 text-xs font-medium bg-gray-100 px-2 py-1 rounded">
// //   //           {station.test_value} {station.test_unit}
// //   //         </p>
// //   //       )}
// //   //     </div>
      
// //   //     {isBottleneck && (
// //   //       <div className="absolute -top-2 -right-2">
// //   //         <div className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full shadow-lg shadow-rose-500/50 animate-pulse font-semibold">
// //   //           ⚠️
// //   //         </div>
// //   //       </div>
// //   //     )}
// //   //   </motion.div>
// //   // );

// //   const StationNode = ({ station, isCurrent, isCompleted, isBottleneck }) => {
// //   // Determine station type and set appropriate background color
// //   const getStationBackground = () => {
// //     const stationName = station.station_name?.toLowerCase() || '';
    
// //     // Rework stations - light orange background with dark orange border
// //     if (stationName.includes('rework')) {
// //       return 'bg-gradient-to-br from-orange-100 to-orange-50 border-orange-500 text-gray-900';
// //     }
    
// //     // Screw tightening stations - light green background with dark green border
// //     if (stationName.includes('screw') || stationName.includes('tight')) {
// //       return 'bg-gradient-to-br from-emerald-100 to-emerald-50 border-emerald-500 text-gray-900';
// //     }
    
// //     // Functional checker stations - light green background with dark green border  
// //     if (stationName.includes('function') || stationName.includes('checker') || stationName.includes('check')) {
// //       return 'bg-gradient-to-br from-emerald-100 to-emerald-50 border-emerald-500 text-gray-900';
// //     }
    
// //     // Default styling based on status
// //     if (isCurrent) {
// //       return 'bg-gradient-to-br from-blue-100 to-blue-50 border-blue-500 shadow-lg shadow-blue-500/30 text-gray-900';
// //     }
// //     if (isCompleted) {
// //       return 'bg-gradient-to-br from-emerald-100 to-emerald-50 border-emerald-500 shadow-lg shadow-emerald-500/30 text-gray-900';
// //     }
    
// //     return 'bg-white/80 border-gray-300 text-gray-900';
// //   };

// //   const stationClass = getStationBackground();

// //   return (
// //     <motion.div
// //       whileHover={{ scale: 1.05, y: -4 }}
// //       className={`relative p-5 rounded-xl backdrop-blur-xl border-2 transition-all duration-300 min-w-[140px] ${stationClass}`}
// //     >
// //       <div className="text-center">
// //         <div className="flex justify-center mb-3">
// //           {getStatusIcon(station.test_status)}
// //         </div>
// //         <h4 className="font-semibold text-gray-900 text-sm mb-1">{station.station_name}</h4>
// //         <p className="text-gray-600 text-xs mb-2">Seq: {station.sequence}</p>
// //         {station.test_value && (
// //           <p className="text-gray-700 text-xs font-medium bg-gray-100 px-2 py-1 rounded">
// //             {station.test_value} {station.test_unit}
// //           </p>
// //         )}
// //       </div>
      
// //       {/* Removed the danger symbol as requested */}
// //     </motion.div>
// //   );
// // };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <AnimatedBackground />
// //         <motion.div
// //           animate={{ rotate: 360 }}
// //           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
// //           className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
// //         />
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <AnimatedBackground />
// //         <motion.div
// //           initial={{ scale: 0 }}
// //           animate={{ scale: 1 }}
// //           className="text-center p-8"
// //         >
// //           <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
// //           <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
// //           <p className="text-gray-600">{error}</p>
// //         </motion.div>
// //       </div>
// //     );
// //   }

// //   if (!analysisData) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <AnimatedBackground />
// //         <div className="text-center">
// //           <Factory className="w-16 h-16 text-blue-500 mx-auto mb-4" />
// //           <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data</h2>
// //           <p className="text-gray-600">Enter a UID to start analysis</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const { product_info, station_analysis, quality_metrics, industry4_metrics, recommendations } = analysisData;

// //   return (
// //     <div className="min-h-screen p-6 relative">
// //       <AnimatedBackground />
      
// //       {/* Show Header only when not in /analytics-window route */}
// //       {/* {!isStandalone && (
// //         <Header
// //           uid={uid}
// //           setUid={setUid}
// //           fetchAnalysis={fetchAnalysis}
// //           sampleUids={sampleUids}
// //           currentUid={uid}
// //         />
// //       )} */}

// //       <div className="max-w-7xl mx-auto space-y-8 relative z-10">
// //         {/* Product Info Cards */}
// //         <motion.div
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
// //         >
// //           <StatCard
// //             icon={<Cpu className="w-6 h-6" />}
// //             title="Product ID"
// //             value={product_info.product_id.slice(-8)}
// //             subtitle={product_info.product_model}
// //             color="blue"
// //             glow
// //           />
// //           <StatCard
// //             icon={<Gauge className="w-6 h-6" />}
// //             title="Cycle Time"
// //             value={product_info.total_cycle_time || 'N/A'}
// //             subtitle={product_info.shift}
// //             // subtitle="Total production"
// //             color="purple"
// //           />
// //           <StatCard
// //             icon={<Battery className="w-6 h-6" />}
// //             title="Status"
// //             value={product_info.status}
            
// //             color="emerald"
// //             glow={product_info.status === 'PASS'}
// //           />
// //           <StatCard
// //             icon={<Thermometer className="w-6 h-6" />}
// //             title="Variant"
// //             value={product_info.variant}
// //             subtitle="Product type"
// //             color="cyan"
// //           />
          
// //         </motion.div>

// //         {/* Production Flow */}
// //         <motion.section
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ delay: 0.2 }}
// //           className="bg-white/70 rounded-2xl p-6 backdrop-blur-xl border border-gray-200/80 shadow-xl"
// //         >
// //           <div className="flex items-center space-x-3 mb-6">
// //             <div className="p-2 rounded-xl bg-blue-100">
// //               <BarChart3 className="w-6 h-6 text-blue-600" />
// //             </div>
// //             <h2 className="text-2xl font-bold text-gray-600">Production Flow</h2>
// //             <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 via-cyan-500/30 to-transparent"></div>
// //             <span className="text-gray-700 font-semibold bg-gray-100 px-4 py-2 rounded-full">
// //               {station_analysis.completed_stations}/{station_analysis.total_stations} Stations
// //             </span>
// //           </div>

// //           <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
// //             {station_analysis.station_sequence.map((station, index) => (
// //               <div key={`${station.sequence}-${index}`} className="flex items-center">
// //                 <StationNode
// //                   station={station}
// //                   isCurrent={index === station_analysis.station_sequence.length - 1}
// //                   isCompleted={station.test_status === 'PASS'}
// //                   isBottleneck={station.test_status === 'FAIL'}
// //                 />
// //                 {index < station_analysis.station_sequence.length - 1 && (
// //                   <motion.div 
// //                     initial={{ scaleX: 0 }}
// //                     animate={{ scaleX: 1 }}
// //                     transition={{ delay: 0.1 * index, duration: 0.5 }}
// //                     className="w-12 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 mx-2 rounded-full shadow-lg shadow-blue-500/50"
// //                   />
// //                 )}
// //               </div>
// //             ))}
// //           </div>
// //         </motion.section>

// //         {/* Quality & Performance Metrics */}
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// //           {/* Quality Metrics */}
// //           <motion.section
// //             initial={{ opacity: 0, x: -20 }}
// //             animate={{ opacity: 1, x: 0 }}
// //             transition={{ delay: 0.3 }}
// //             className="bg-white/70 rounded-2xl p-6 backdrop-blur-xl border border-gray-200/80 shadow-xl"
// //           >
// //             <div className="flex items-center space-x-3 mb-6">
// //               <div className="p-2 rounded-xl bg-emerald-100">
// //                 <Shield className="w-6 h-6 text-emerald-600" />
// //               </div>
// //               <h2 className="text-2xl font-bold text-gray-900">Quality Metrics</h2>
// //             </div>
            
// //             <div className="space-y-6">
// //               <ProgressBar 
// //                 percentage={quality_metrics.first_pass_yield} 
// //                 color="emerald" 
// //                 label="First Pass Yield" 
// //               />
// //               <ProgressBar 
// //                 percentage={85.2} 
// //                 color="blue" 
// //                 label="Station Yield Average" 
// //               />
// //               <ProgressBar 
// //                 percentage={15} 
// //                 color="amber" 
// //                 label="Rework Rate" 
// //               />
              
// //               <div className="grid grid-cols-2 gap-4 mt-6">
// //                 <div className="text-center p-4 bg-gray-50 rounded-xl backdrop-blur-sm border border-gray-200">
// //                   <div className="text-3xl font-bold text-gray-900 mb-1">{quality_metrics.total_tests}</div>
// //                   <div className="text-gray-600 text-sm">Total Tests</div>
// //                 </div>
// //                 <div className="text-center p-4 bg-emerald-50 rounded-xl backdrop-blur-sm border border-emerald-200">
// //                   <div className="text-3xl font-bold text-emerald-600 mb-1">{quality_metrics.passed_tests}</div>
// //                   <div className="text-gray-600 text-sm">Passed Tests</div>
// //                 </div>
// //               </div>
// //             </div>
// //           </motion.section>

// //           {/* Industry 4.0 Insights */}
// //           <motion.section
// //             initial={{ opacity: 0, x: 20 }}
// //             animate={{ opacity: 1, x: 0 }}
// //             transition={{ delay: 0.4 }}
// //             className="bg-white/70 rounded-2xl p-6 backdrop-blur-xl border border-gray-200/80 shadow-xl"
// //           >
// //             <div className="flex items-center space-x-3 mb-6">
// //               <div className="p-2 rounded-xl bg-cyan-100">
// //                 <TrendingUp className="w-6 h-6 text-cyan-600" />
// //               </div>
// //               <h2 className="text-2xl font-bold text-gray-900">Industry 4.0 Insights</h2>
// //             </div>

// //             <div className="space-y-6">
// //               {/* <div className="grid grid-cols-2 gap-4">
// //                 <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-300/50 backdrop-blur-sm">
// //                   <div className="flex items-center space-x-2 mb-2">
// //                     <Zap className="w-5 h-5 text-amber-600" />
// //                     <span className="text-gray-600 text-sm">Energy Used</span>
// //                   </div>
// //                   <div className="text-2xl font-bold text-gray-900">3.37 kWh</div>
// //                 </div>
// //                 <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-300/50 backdrop-blur-sm">
// //                   <div className="flex items-center space-x-2 mb-2">
// //                     <Leaf className="w-5 h-5 text-emerald-600" />
// //                     <span className="text-gray-600 text-sm">CO2 Emissions</span>
// //                   </div>
// //                   <div className="text-2xl font-bold text-gray-900">2.86 kg</div>
// //                 </div>
// //               </div> */}

// //               {/* <div className="space-y-4">
// //                 <h3 className="text-gray-700 font-semibold text-lg">Equipment Health</h3>
// //                 <ProgressBar percentage={92} color="emerald" label="Voltage Tester" />
// //                 <ProgressBar percentage={78} color="amber" label="Current Meter" />
// //                 <ProgressBar percentage={65} color="rose" label="Insulation Test" />
// //               </div> */}
// //               {/* Add this after the Equipment Health section in Industry 4.0 Insights */}
// //               <div className="space-y-4">
// //                 <h3 className="text-gray-700 font-semibold text-lg">Mechanical Measurements</h3>
                
// //                 <div className="grid grid-cols-1 gap-3">
// //                   {industry4_metrics.measurement_data?.mechanical_tests && Object.entries(industry4_metrics.measurement_data.mechanical_tests).map(([key, measurement]) => (
// //                     <div key={key} className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100/50 border border-cyan-300/50 backdrop-blur-sm">
// //                       <div className="flex items-center space-x-3">
// //                         <div className="p-2 rounded-lg bg-cyan-100">
// //                           <Settings className="w-4 h-4 text-cyan-600" />
// //                         </div>
// //                         <div>
// //                           <span className="text-gray-700 font-medium capitalize text-sm">
// //                             {key.replace(/_/g, ' ')}
// //                           </span>
// //                           <div className="text-gray-500 text-xs">
// //                             Spec: {measurement.specification}
// //                           </div>
// //                         </div>
// //                       </div>
// //                       <div className="text-right">
// //                         <span className="text-gray-900 font-bold text-lg block">
// //                           {measurement.value} {measurement.unit}
// //                         </span>
// //                         <span className="text-cyan-600 text-sm font-medium">
// //                           {measurement.tolerance}
// //                         </span>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>
// //           </motion.section>
// //         </div>

// //         {/* Recommendations */}
// //         {/* {recommendations && recommendations.length > 0 && (
// //           <motion.section
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ delay: 0.5 }}
// //             className="bg-white/70 rounded-2xl p-6 backdrop-blur-xl border border-amber-300/50 shadow-xl"
// //           >
// //             <div className="flex items-center space-x-3 mb-6">
// //               <div className="p-2 rounded-xl bg-amber-100">
// //                 <AlertTriangle className="w-6 h-6 text-amber-600" />
// //               </div>
// //               <h2 className="text-2xl font-bold text-gray-900">Smart Recommendations</h2>
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               {recommendations.map((rec, index) => (
// //                 <motion.div
// //                   key={index}
// //                   whileHover={{ scale: 1.02, y: -4 }}
// //                   className="p-5 bg-gradient-to-br from-amber-50 to-amber-100/30 rounded-xl border border-amber-300/50 backdrop-blur-sm hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
// //                 >
// //                   <div className="flex items-start space-x-3">
// //                     <div className="p-2 bg-amber-100 rounded-lg">
// //                       <Settings className="w-5 h-5 text-amber-600" />
// //                     </div>
// //                     <div className="flex-1">
// //                       <h4 className="font-semibold text-gray-900 text-lg mb-1">{rec.title}</h4>
// //                       <p className="text-gray-700 text-sm mb-2">{rec.description}</p>
// //                       <p className="text-amber-600 text-xs font-medium bg-amber-100 px-3 py-1 rounded-full inline-block">
// //                         {rec.action}
// //                       </p>
// //                     </div>
// //                   </div>
// //                 </motion.div>
// //               ))}
// //             </div>
// //           </motion.section>
// //         )} */}
// //       </div>
// //     </div>
// //   );
// // };

// // export default AnalysisDashboard;




// // import React, { useState, useEffect } from 'react';
// // import { motion } from 'framer-motion';
// // import { useLocation } from "react-router-dom";
// // import {
// //   Factory,
// //   AlertTriangle,
// //   CheckCircle,
// //   Clock,
// //   BarChart3,
// //   Cpu,
// //   Gauge,
// //   Battery,
// //   Thermometer,
// //   RotateCcw
// // } from 'lucide-react';

// // // Import Header component (kept commented as before)
// // // import Header from './Header';

// // // Animated Background Component - Light Theme (kept identical)
// // const AnimatedBackground = () => {
// //   return (
// //     <div className="fixed inset-0 -z-10 overflow-hidden">
// //       <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-blue-500" />
// //       <motion.div
// //         animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
// //         transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
// //         className="absolute top-0 -left-48 w-96 h-96 bg-blue-300/40 rounded-full blur-3xl"
// //       />
// //       <motion.div
// //         animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
// //         transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
// //         className="absolute bottom-0 -right-48 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"
// //       />
// //       <motion.div
// //         animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
// //         transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
// //         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl"
// //       />
// //       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[size:64px_64px]" />
// //       <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent)]" />
// //     </div>
// //   );
// // };

// // const AnalysisDashboard = ({ uid: externalUid }) => {
// //   const [uid, setUid] = useState(externalUid || '36800M58U0000001280325');
// //   const [analysisData, setAnalysisData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);

// //   const location = useLocation();
// //   const isStandalone = location.pathname.includes("/analytics-window");

// //   // Fetch analysis
// //   const fetchAnalysis = async (productUid) => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const resp = await fetch(`http://localhost:4000/api/trace/analysis?uid=${productUid}`);
// //       const data = await resp.json();
// //       if (data.success) setAnalysisData(data);
// //       else setError(data.message || 'Failed to fetch analysis');
// //     } catch (err) {
// //       setError('Connection error: ' + err.message);
// //     }
// //     setLoading(false);
// //   };

// //   useEffect(() => { fetchAnalysis(uid); }, []); // eslint-disable-line react-hooks/exhaustive-deps

// //   // Helpers for status visuals
// //   const statusPill = (status) => {
// //     if (!status) return null;
// //     const s = String(status).toUpperCase();
// //     const map = {
// //       PASS: 'bg-emerald-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold',
// //       FAIL: 'bg-rose-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold',
// //       REWORK: 'bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold'
// //     };
// //     return <span className={map[s] || 'bg-gray-400 text-white px-2 py-0.5 rounded-full text-xs font-semibold'}>{s}</span>;
// //   };

// //   const getCardClassByStatus = (status) => {
// //     const s = String(status || '').toUpperCase();
// //     if (s === 'PASS') return 'bg-gradient-to-br from-emerald-100 to-emerald-50 border-emerald-500 text-gray-900';
// //     if (s === 'FAIL') return 'bg-gradient-to-br from-rose-100 to-rose-50 border-rose-500 text-gray-900';
// //     if (s === 'REWORK') return 'bg-gradient-to-br from-amber-100 to-amber-50 border-amber-500 text-gray-900';
// //     return 'bg-white/80 border-gray-300 text-gray-900';
// //   };

// //   // Small UI components (kept style consistent with your original)
// //   const StatCard = ({ icon, title, value, subtitle, color = 'blue', glow = false }) => {
// //     const colorMap = {
// //       blue: 'from-blue-50 to-blue-100/50 border-blue-300/50 shadow-blue-500/10',
// //       emerald: 'from-emerald-50 to-emerald-100/50 border-emerald-300/50 shadow-emerald-500/10',
// //       amber: 'from-amber-50 to-amber-100/50 border-amber-300/50 shadow-amber-500/10',
// //       cyan: 'from-cyan-50 to-cyan-100/50 border-cyan-300/50 shadow-cyan-500/10',
// //       purple: 'from-purple-50 to-purple-100/50 border-purple-300/50 shadow-purple-500/10'
// //     };
// //     const iconBgMap = {
// //       blue: 'bg-blue-100 text-blue-600',
// //       emerald: 'bg-emerald-100 text-emerald-600',
// //       amber: 'bg-amber-100 text-amber-600',
// //       cyan: 'bg-cyan-100 text-cyan-600',
// //       purple: 'bg-purple-100 text-purple-600'
// //     };
// //     return (
// //       <motion.div whileHover={{ scale: 1.02, y: -4 }} className={`relative p-6 rounded-2xl bg-gradient-to-br ${colorMap[color]} backdrop-blur-xl border ${glow ? 'shadow-xl' : 'shadow-lg'} hover:shadow-2xl transition-all duration-300`}>
// //         <div className="flex items-center justify-between">
// //           <div className="flex-1">
// //             <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
// //             <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
// //             {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
// //           </div>
// //           <div className={`p-3 rounded-xl ${iconBgMap[color]} backdrop-blur-sm`}>{icon}</div>
// //         </div>
// //       </motion.div>
// //     );
// //   };

// //   const StationNode = ({ station, isLast }) => {
// //     const cardClass = getCardClassByStatus(station.status);
// //     return (
// //       <div className="flex items-center">
// //         <motion.div whileHover={{ scale: 1.03 }} className={`relative p-4 rounded-xl backdrop-blur-xl border-2 transition-all duration-300 min-w-[160px] ${cardClass}`}>
// //           <div className="flex items-center justify-between mb-2">
// //             <h4 className="font-semibold text-gray-900 text-sm">{station.station_name}</h4>
// //             {statusPill(station.status)}
// //           </div>
// //           {/* If you later add measurements per station, show tiny lines here; for now keep minimal */}
// //         </motion.div>

// //         {/* Blue connector line between cards (not after last) */}
// //         {!isLast && (
// //           <div className="mx-3">
// //             <motion.div
// //               initial={{ scaleX: 0 }}
// //               animate={{ scaleX: 1 }}
// //               transition={{ duration: 0.45 }}
// //               className="w-12 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 rounded-full shadow-lg"
// //             />
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

// //   // Loading / error / no-data screens (kept same)
// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <AnimatedBackground />
// //         <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" />
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <AnimatedBackground />
// //         <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center p-8">
// //           <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
// //           <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
// //           <p className="text-gray-600">{error}</p>
// //         </motion.div>
// //       </div>
// //     );
// //   }

// //   if (!analysisData) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <AnimatedBackground />
// //         <div className="text-center">
// //           <Factory className="w-16 h-16 text-blue-500 mx-auto mb-4" />
// //           <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data</h2>
// //           <p className="text-gray-600">Enter a UID to start analysis</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // NEW backend shape
// //   const {
// //     product_info = {},
// //     cycle_time_minutes = 0,
// //     number_of_cycles = 0,
// //     number_of_equipments = 0,
// //     quality_summary = {},
// //     station_flow = [],
// //     measurement_data = []
// //   } = analysisData;

// //   // small derived values
// //   const passPercent = quality_summary.pass_percent ?? 0;
// //   const failPercent = quality_summary.fail_percent ?? 0;

// //   return (
// //     <div className="min-h-screen p-6 relative">
// //       <AnimatedBackground />

// //       {/* Header - kept commented as you had */}
// //       {/* {!isStandalone && <Header uid={uid} setUid={setUid} fetchAnalysis={fetchAnalysis} />} */}

// //       <div className="max-w-7xl mx-auto space-y-8 relative z-10">
// //         {/* Top stat cards - adjusted to new fields */}
// //         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //           <StatCard icon={<Cpu className="w-6 h-6" />} title="Product ID" value={String(product_info.product_id || '').slice(-8) || 'N/A'} subtitle={product_info.model || product_info.product_model || ''} color="blue" glow />
// //           <StatCard icon={<Gauge className="w-6 h-6" />} title="Cycle Time (min)" value={cycle_time_minutes ?? '0.00'} subtitle={product_info.shift || ''} color="purple" />
// //           <StatCard icon={<Battery className="w-6 h-6" />} title="Number of Cycles" value={number_of_cycles ?? 0} subtitle="" color="emerald" glow />
// //           <StatCard icon={<Thermometer className="w-6 h-6" />} title="Variant" value={product_info.variant || 'N/A'} subtitle="Product type" color="cyan" />
// //         </motion.div>

// //         {/* Second row with equipment count + pass/fail card (keeps grid styling) */}
// //         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
// //           <StatCard icon={<SettingsIconFallback />} title="No. of Equipments" value={number_of_equipments ?? 0} subtitle="" color="blue" />
// //           <motion.div whileHover={{ scale: 1.02, y: -4 }} className="relative p-6 rounded-2xl bg-gradient-to-br from-white/80 to-white/70 backdrop-blur-xl border shadow-lg transition-all duration-300">
// //             <div className="flex items-center justify-between">
// //               <div className="flex-1">
// //                 <p className="text-gray-600 text-sm font-medium mb-1">Quality Summary</p>
// //                 <div className="flex items-baseline space-x-6">
// //                   <div>
// //                     <p className="text-3xl font-bold text-emerald-600">{passPercent}%</p>
// //                     <p className="text-gray-600 text-sm">PASS</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-3xl font-bold text-rose-600">{failPercent}%</p>
// //                     <p className="text-gray-600 text-sm">FAIL</p>
// //                   </div>
// //                 </div>
// //               </div>
// //               <div className="p-3 rounded-xl bg-blue-100">
// //                 <Gauge className="w-6 h-6 text-blue-600" />
// //               </div>
// //             </div>
// //           </motion.div>
// //         </motion.div>

// //         {/* Production Flow */}
// //         <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/70 rounded-2xl p-6 backdrop-blur-xl border border-gray-200/80 shadow-xl">
// //           <div className="flex items-center space-x-3 mb-6">
// //             <div className="p-2 rounded-xl bg-blue-100">
// //               <BarChart3 className="w-6 h-6 text-blue-600" />
// //             </div>
// //             <h2 className="text-2xl font-bold text-gray-600">Production Flow</h2>
// //             <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 via-cyan-500/30 to-transparent"></div>
// //             <span className="text-gray-700 font-semibold bg-gray-100 px-4 py-2 rounded-full">
// //               {station_flow.filter(s => String(s.status).toUpperCase() === 'PASS').length}/{station_flow.length} Stations
// //             </span>
// //           </div>

// //           <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
// //             {station_flow.map((st, i) => (
// //               <StationNode key={`${st.station_name}-${i}`} station={st} isLast={i === station_flow.length - 1} />
// //             ))}
// //           </div>
// //         </motion.section>

// //         {/* Measurement Data (PASS stations only) */}
// //         <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/70 rounded-2xl p-6 backdrop-blur-xl border border-gray-200/80 shadow-xl">
// //           <div className="flex items-center space-x-3 mb-6">
// //             <div className="p-2 rounded-xl bg-emerald-100">
// //               <CheckCircle className="w-6 h-6 text-emerald-600" />
// //             </div>
// //             <h2 className="text-2xl font-bold text-gray-900">Measurement Data (PASS stations)</h2>
// //           </div>

// //           <div className="space-y-3">
// //             {measurement_data.length === 0 && (
// //               <div className="p-4 rounded-xl bg-white/60 border border-gray-200 text-gray-700">
// //                 No PASS stations with measurements (showing PASS stations from flow)
// //               </div>
// //             )}

// //             {/* We show PASS stations from 'measurement_data' if backend provides; otherwise, fallback to station_flow PASS entries */}
// //             { (measurement_data.length > 0 ? measurement_data : station_flow.filter(s => String(s.status).toUpperCase() === 'PASS'))
// //               .map((m, idx) => (
// //                 <div key={`${m.station}-${idx}`} className="p-4 rounded-xl bg-white/60 border border-gray-200">
// //                   <div className="flex items-center justify-between">
// //                     <div className="font-semibold text-gray-900">{m.station || m.station_name}</div>
// //                     {statusPill(m.status || 'PASS')}
// //                   </div>

// //                   {/* measurements array is empty per current DB; if present, render list */}
// //                   {m.measurements && Array.isArray(m.measurements) && m.measurements.length > 0 ? (
// //                     <div className="mt-3 space-y-1 text-sm text-gray-700">
// //                       {m.measurements.map((meas, i) => (
// //                         <div key={i} className="flex justify-between">
// //                           <div>{meas.name}</div>
// //                           <div className="font-semibold">{meas.value} {meas.unit || ''}</div>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   ) : (
// //                     <div className="mt-3 text-sm text-gray-600 italic">No measurement data</div>
// //                   )}
// //                 </div>
// //               ))
// //             }
// //           </div>
// //         </motion.section>

// //       </div>
// //     </div>
// //   );
// // };

// // // A small fallback icon component used for equipments card (keeps imports minimal)
// // const SettingsIconFallback = () => (
// //   <div className="p-2 rounded-lg bg-blue-100">
// //     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
// //       <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0010 0H6a1 1 0 00-1 1v3a1 1 0 001 1h1.09a5.002 5.002 0 007.42 2.05l2.12-2.12a1 1 0 000-1.414l-2.12-2.12A1 1 0 0014.91.03L11.3 1.046zM3 9a1 1 0 000 2h2a1 1 0 001-1V9H3zm14 2a1 1 0 100-2h-2a1 1 0 00-1 1v1h3z" clipRule="evenodd" />
// //     </svg>
// //   </div>
// // );

// // export default AnalysisDashboard;



// // import React, { useState, useEffect } from 'react';
// // import { motion } from 'framer-motion';
// // import { useLocation } from "react-router-dom";
// // import {
// //   Factory,
// //   AlertTriangle,
// //   CheckCircle,
// //   Clock,
// //   BarChart3,
// //   Gauge,
// //   Battery,
// //   Thermometer,
// //   RotateCcw
// // } from 'lucide-react';

// // // Animated Background Component - identical to your theme
// // const AnimatedBackground = () => (
// //   <div className="fixed inset-0 -z-10 overflow-hidden">
// //     <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-blue-500" />
// //     <motion.div
// //       animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
// //       transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
// //       className="absolute top-0 -left-48 w-96 h-96 bg-blue-300/40 rounded-full blur-3xl"
// //     />
// //     <motion.div
// //       animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
// //       transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
// //       className="absolute bottom-0 -right-48 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"
// //     />
// //     <motion.div
// //       animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
// //       transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
// //       className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl"
// //     />
// //     <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[size:64px_64px]" />
// //     <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent)]" />
// //   </div>
// // );

// // // Inline barcode SVG (small, crisp) for the UID badge
// // const BarcodeIcon = ({ className = "w-5 h-5" }) => (
// //   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
// //     <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
// //     <path d="M4 7v10M7 7v10M10 7v10M13 7v10M16 7v10M19 7v10" />
// //   </svg>
// // );

// // const AnalysisDashboard = ({ uid: externalUid }) => {
// //   const [uid, setUid] = useState(externalUid || '36800M58U0000001280325');
// //   const [analysisData, setAnalysisData] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);

// //   const location = useLocation();
// //   const isStandalone = location.pathname.includes("/analytics-window");

// //   // Fetch analysis from your cleaned backend
// //   const fetchAnalysis = async (productUid) => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const resp = await fetch(`http://localhost:4000/api/trace/analysis?uid=${productUid}`);
// //       const data = await resp.json();
// //       if (data.success) setAnalysisData(data);
// //       else setError(data.message || 'Failed to fetch analysis');
// //     } catch (err) {
// //       setError('Connection error: ' + err.message);
// //     }
// //     setLoading(false);
// //   };

// //   useEffect(() => { fetchAnalysis(uid); }, []); // run on mount

// //   // ui helpers for status badges and card classes (status-based)
// //   const statusPill = (status) => {
// //     if (!status) return null;
// //     const s = String(status).toUpperCase();
// //     const map = {
// //       PASS: 'bg-emerald-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold',
// //       FAIL: 'bg-rose-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold',
// //       REWORK: 'bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold'
// //     };
// //     return <span className={map[s] || 'bg-gray-400 text-white px-2 py-0.5 rounded-full text-xs font-semibold'}>{s}</span>;
// //   };

// //   const getCardClassByStatus = (status) => {
// //     const s = String(status || '').toUpperCase();
// //     if (s === 'PASS') return 'bg-gradient-to-br from-emerald-100 to-emerald-50 border-emerald-500 text-gray-900';
// //     if (s === 'FAIL') return 'bg-gradient-to-br from-rose-100 to-rose-50 border-rose-500 text-gray-900';
// //     if (s === 'REWORK') return 'bg-gradient-to-br from-amber-100 to-amber-50 border-amber-500 text-gray-900';
// //     return 'bg-white/80 border-gray-300 text-gray-900';
// //   };

// //   // small reusable stat card — styles kept to match your UI
// //   const StatCard = ({ icon, title, value, subtitle, color = 'blue', glow = false }) => {
// //     const colorMap = {
// //       blue: 'from-blue-50 to-blue-100/50 border-blue-300/50 shadow-blue-500/10',
// //       emerald: 'from-emerald-50 to-emerald-100/50 border-emerald-300/50 shadow-emerald-500/10',
// //       amber: 'from-amber-50 to-amber-100/50 border-amber-300/50 shadow-amber-500/10',
// //       cyan: 'from-cyan-50 to-cyan-100/50 border-cyan-300/50 shadow-cyan-500/10',
// //       purple: 'from-purple-50 to-purple-100/50 border-purple-300/50 shadow-purple-500/10'
// //     };
// //     const iconBgMap = {
// //       blue: 'bg-blue-100 text-blue-600',
// //       emerald: 'bg-emerald-100 text-emerald-600',
// //       amber: 'bg-amber-100 text-amber-600',
// //       cyan: 'bg-cyan-100 text-cyan-600',
// //       purple: 'bg-purple-100 text-purple-600'
// //     };
// //     return (
// //       <motion.div whileHover={{ scale: 1.02, y: -4 }} className={`relative p-6 rounded-2xl bg-gradient-to-br ${colorMap[color]} backdrop-blur-xl border ${glow ? 'shadow-xl' : 'shadow-lg'} hover:shadow-2xl transition-all duration-300`}>
// //         <div className="flex items-center justify-between">
// //           <div className="flex-1">
// //             <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
// //             <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
// //             {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
// //           </div>
// //           <div className={`p-3 rounded-xl ${iconBgMap[color]} backdrop-blur-sm`}>{icon}</div>
// //         </div>
// //       </motion.div>
// //     );
// //   };

// //   const StationNode = ({ station, isLast }) => {
// //     const cardClass = getCardClassByStatus(station.status);
// //     return (
// //       <div className="flex items-center">
// //         <motion.div whileHover={{ scale: 1.03 }} className={`relative p-4 rounded-xl backdrop-blur-xl border-2 transition-all duration-300 min-w-[160px] ${cardClass}`}>
// //           <div className="flex items-center justify-between mb-2">
// //             <h4 className="font-semibold text-gray-900 text-sm">{station.station_name}</h4>
// //             {statusPill(station.status)}
// //           </div>
// //         </motion.div>

// //         {!isLast && (
// //           <div className="mx-3">
// //             <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.45 }} className="w-12 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 rounded-full shadow-lg" />
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

// //   // Loading / error / no-data screens (kept consistent)
// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <AnimatedBackground />
// //         <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" />
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <AnimatedBackground />
// //         <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center p-8">
// //           <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
// //           <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
// //           <p className="text-gray-600">{error}</p>
// //         </motion.div>
// //       </div>
// //     );
// //   }

// //   if (!analysisData) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <AnimatedBackground />
// //         <div className="text-center">
// //           <Factory className="w-16 h-16 text-blue-500 mx-auto mb-4" />
// //           <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data</h2>
// //           <p className="text-gray-600">Enter a UID to start analysis</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // expected backend shape (your cleaned backend)
// //   const {
// //     product_info = {},
// //     cycle_time_minutes = 0,
// //     number_of_cycles = 0,
// //     number_of_equipments = 0,
// //     quality_summary = {},
// //     station_flow = [],
// //     measurement_data = []
// //   } = analysisData;

// //   const passPercent = quality_summary.pass_percent ?? 0;
// //   const failPercent = quality_summary.fail_percent ?? 0;

// //   return (
// //     <div className="min-h-screen p-6 relative">
// //       <AnimatedBackground />

// //       <div className="max-w-7xl mx-auto space-y-8 relative z-10">

// //         {/* UID centered thin glass badge (Style A) */}
// //         <div className="flex justify-center">
// //           <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/30 border border-white/30 backdrop-blur-md shadow-md">
// //             <BarcodeIcon className="w-5 h-5 text-white/90" />
// //             <span className="text-white font-medium">UID: {uid}</span>
// //           </div>
// //         </div>

// //         {/* Top row: Four cards in one row */}
// //         <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //           <StatCard icon={<Gauge className="w-6 h-6" />} title="Cycle Time (min)" value={cycle_time_minutes ?? '0.00'} subtitle={product_info.shift || ''} color="purple" />
// //           <StatCard icon={<Battery className="w-6 h-6" />} title="Number of Cycles" value={number_of_cycles ?? 0} subtitle="" color="emerald" glow />
// //           <StatCard icon={<Thermometer className="w-6 h-6" />} title="Model" value={product_info.model || product_info.product_model || 'N/A'} subtitle="" color="cyan" />
// //           <StatCard icon={<Battery className="w-6 h-6" />} title="Variant" value={product_info.variant || 'N/A'} subtitle="Product type" color="blue" />
// //         </motion.div>

// //         {/* Second row: Equipments + Quality summary */}
// //         <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //           <StatCard icon={<Battery className="w-6 h-6" />} title="No. of Equipments" value={number_of_equipments ?? 0} subtitle="" color="blue" />
// //           <motion.div whileHover={{ scale: 1.02, y: -4 }} className="relative p-6 rounded-2xl bg-gradient-to-br from-white/80 to-white/70 backdrop-blur-xl border shadow-lg transition-all duration-300">
// //             <div className="flex items-center justify-between">
// //               <div className="flex-1">
// //                 <p className="text-gray-600 text-sm font-medium mb-1">Quality Summary</p>
// //                 <div className="flex items-baseline space-x-6">
// //                   <div>
// //                     <p className="text-3xl font-bold text-emerald-600">{passPercent}%</p>
// //                     <p className="text-gray-600 text-sm">PASS</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-3xl font-bold text-rose-600">{failPercent}%</p>
// //                     <p className="text-gray-600 text-sm">FAIL</p>
// //                   </div>
// //                 </div>
// //               </div>
// //               <div className="p-3 rounded-xl bg-blue-100">
// //                 <Gauge className="w-6 h-6 text-blue-600" />
// //               </div>
// //             </div>
// //           </motion.div>
// //         </motion.div>

// //         {/* Production Flow */}
// //         <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/70 rounded-2xl p-6 backdrop-blur-xl border border-gray-200/80 shadow-xl">
// //           <div className="flex items-center space-x-3 mb-6">
// //             <div className="p-2 rounded-xl bg-blue-100">
// //               <BarChart3 className="w-6 h-6 text-blue-600" />
// //             </div>
// //             <h2 className="text-2xl font-bold text-gray-600">Production Flow</h2>
// //             <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 via-cyan-500/30 to-transparent"></div>
// //             {/* <span className="text-gray-700 font-semibold bg-gray-100 px-4 py-2 rounded-full">
// //               {station_flow.filter(s => String(s.status).toUpperCase() === 'PASS').length}/{station_flow.length} Stations
// //             </span> */}
// //           </div>

// //           <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
// //             {station_flow.map((st, i) => (
// //               <StationNode key={`${st.station_name}-${i}`} station={st} isLast={i === station_flow.length - 1} />
// //             ))}
// //           </div>  
// //         </motion.section>

// //         {/* Measurement Data */}
// //         <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/70 rounded-2xl p-6 backdrop-blur-xl border border-gray-200/80 shadow-xl">
// //           <div className="flex items-center space-x-3 mb-6">
// //             <div className="p-2 rounded-xl bg-emerald-100">
// //               <CheckCircle className="w-6 h-6 text-emerald-600" />
// //             </div>
// //             <h2 className="text-2xl font-bold text-gray-900">Measurement Data (PASS stations)</h2>
// //           </div>

// //           <div className="space-y-3">
// //             {measurement_data.length === 0 && (
// //               <div className="p-4 rounded-xl bg-white/60 border border-gray-200 text-gray-700">
// //                 No PASS stations with measurements (showing PASS stations from flow)
// //               </div>
// //             )}

// //             {(measurement_data.length > 0 ? measurement_data : station_flow.filter(s => String(s.status).toUpperCase() === 'PASS'))
// //               .map((m, idx) => (
// //                 <div key={`${m.station}-${idx}`} className="p-4 rounded-xl bg-white/60 border border-gray-200">
// //                   <div className="flex items-center justify-between">
// //                     <div className="font-semibold text-gray-900">{m.station || m.station_name}</div>
// //                     {statusPill(m.status || 'PASS')}
// //                   </div>

// //                   {m.measurements && Array.isArray(m.measurements) && m.measurements.length > 0 ? (
// //                     <div className="mt-3 space-y-1 text-sm text-gray-700">
// //                       {m.measurements.map((meas, i) => (
// //                         <div key={i} className="flex justify-between">
// //                           <div>{meas.name}</div>
// //                           <div className="font-semibold">{meas.value} {meas.unit || ''}</div>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   ) : (
// //                     <div className="mt-3 text-sm text-gray-600 italic">No measurement data</div>
// //                   )}
// //                 </div>
// //               ))
// //             }
// //           </div>
// //         </motion.section>

// //       </div>
// //     </div>
// //   );
// // };

// // export default AnalysisDashboard;


// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { useLocation } from "react-router-dom";
// import {
//   Factory,
//   AlertTriangle,
//   CheckCircle,
//   Clock,
//   BarChart3,
//   Gauge,
//   Battery,
//   Thermometer,
//   RotateCcw
// } from 'lucide-react';

// // Animated Background Component - identical to your theme
// const AnimatedBackground = () => (
//   <div className="fixed inset-0 -z-10 overflow-hidden">
//     <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-blue-500" />
//     <motion.div
//       animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
//       transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
//       className="absolute top-0 -left-48 w-96 h-96 bg-blue-300/40 rounded-full blur-3xl"
//     />
//     <motion.div
//       animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
//       transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
//       className="absolute bottom-0 -right-48 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"
//     />
//     <motion.div
//       animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
//       transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
//       className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl"
//     />
//     <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[size:64px_64px]" />
//     <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent)]" />
//   </div>
// );

// // Inline barcode SVG (small, crisp) for the UID badge
// const BarcodeIcon = ({ className = "w-5 h-5" }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
//     <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
//     <path d="M4 7v10M7 7v10M10 7v10M13 7v10M16 7v10M19 7v10" />
//   </svg>
// );

// const AnalysisDashboard = ({ uid: externalUid }) => {
//   const [uid, setUid] = useState(null);
//   const [analysisData, setAnalysisData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const location = useLocation();
//   const isStandalone = location.pathname.includes("/analytics-window");

//   // Fetch analysis from your cleaned backend
//   const fetchAnalysis = async (productUid) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const resp = await fetch(`http://localhost:4000/api/trace/analysis?uid=${productUid}`);
//       const data = await resp.json();
//       if (data.success) setAnalysisData(data);
//       else setError(data.message || 'Failed to fetch analysis');
//     } catch (err) {
//       setError('Connection error: ' + err.message);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (externalUid) {
//       setLoading(true);        // <---- ADD THIS
//       setAnalysisData(null);   // clears old UI
//       setUid(externalUid);
//       fetchAnalysis(externalUid);
//     }
//   }, [externalUid]);



//     useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const routeUid = params.get("uid");
//     if (routeUid) {
//       setUid(routeUid);
//       fetchAnalysis(routeUid);
//     }
//   }, [location.search]);


// // ui helpers for status badges and card classes (status-based)
// const statusPill = (status) => {
//   if (!status) return null;

//   const s = String(status).toUpperCase();

//   const map = {
//     PASS: 'bg-emerald-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold',
//     FAIL: 'bg-rose-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold',
//     REWORK: 'bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold',
    
//     // ✅ Added REWORK DONE in orange
//     "REWORK DONE": 'bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold'
//   };

//   return (
//     <span
//       className={
//         map[s] ||
//         'bg-gray-400 text-white px-2 py-0.5 rounded-full text-xs font-semibold'
//       }
//     >
//       {s}
//     </span>
//   );
// };

// const getCardClassByStatus = (status) => {
//   const s = String(status || '').toUpperCase();

//   if (s === 'PASS')
//     return 'bg-gradient-to-br from-emerald-100 to-emerald-50 border-emerald-500 text-gray-900';

//   if (s === 'FAIL')
//     return 'bg-gradient-to-br from-rose-100 to-rose-50 border-rose-500 text-gray-900';

//   // ✅ Added REWORK DONE (orange card)
//   if (s === 'REWORK DONE')
//     return 'bg-gradient-to-br from-orange-100 to-orange-50 border-orange-500 text-gray-900';

//   // Existing REWORK (yellow-ish)
//   if (s === 'REWORK')
//     return 'bg-gradient-to-br from-amber-100 to-amber-50 border-amber-500 text-gray-900';

//   return 'bg-white/80 border-gray-300 text-gray-900';
// };


//   // small reusable stat card — styles kept to match your UI
//   const StatCard = ({ icon, title, value, subtitle, color = 'blue', glow = false }) => {
//     const colorMap = {
//       blue: 'from-blue-50 to-blue-100/50 border-blue-300/50 shadow-blue-500/10',
//       emerald: 'from-emerald-50 to-emerald-100/50 border-emerald-300/50 shadow-emerald-500/10',
//       amber: 'from-amber-50 to-amber-100/50 border-amber-300/50 shadow-amber-500/10',
//       cyan: 'from-cyan-50 to-cyan-100/50 border-cyan-300/50 shadow-cyan-500/10',
//       purple: 'from-purple-50 to-purple-100/50 border-purple-300/50 shadow-purple-500/10'
//     };
//     const iconBgMap = {
//       blue: 'bg-blue-100 text-blue-600',
//       emerald: 'bg-emerald-100 text-emerald-600',
//       amber: 'bg-amber-100 text-amber-600',
//       cyan: 'bg-cyan-100 text-cyan-600',
//       purple: 'bg-purple-100 text-purple-600'
//     };
//     return (
//       <motion.div whileHover={{ scale: 1.02, y: -4 }} className={`relative p-6 rounded-2xl bg-gradient-to-br ${colorMap[color]} backdrop-blur-xl border ${glow ? 'shadow-xl' : 'shadow-lg'} hover:shadow-2xl transition-all duration-300`}>
//         <div className="flex items-center justify-between">
//           <div className="flex-1">
//             <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
//             <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
//             {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
//           </div>
//           <div className={`p-3 rounded-xl ${iconBgMap[color]} backdrop-blur-sm`}>{icon}</div>
//         </div>
//       </motion.div>
//     );
//   };

//   const StationNode = ({ station, isLast }) => {
//     const cardClass = getCardClassByStatus(station.status);
//     return (
//       <div className="flex items-center">
//         <motion.div whileHover={{ scale: 1.03 }} className={`relative p-4 rounded-xl backdrop-blur-xl border-2 transition-all duration-300 min-w-[160px] ${cardClass}`}>
//           <div className="flex items-center justify-between mb-2">
//             <h4 className="font-semibold text-gray-900 text-sm">{station.station_name}</h4>
//             {statusPill(station.status)}
//           </div>
//         </motion.div>

//         {!isLast && (
//           <div className="mx-3">
//             <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.45 }} className="w-12 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 rounded-full shadow-lg" />
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Loading / error / no-data screens (kept consistent)
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <AnimatedBackground />
//         <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <AnimatedBackground />
//         <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center p-8">
//           <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
//           <p className="text-gray-600">{error}</p>
//         </motion.div>
//       </div>
//     );
//   }

//   if (!analysisData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <AnimatedBackground />
//         <div className="text-center">
//           <Factory className="w-16 h-16 text-blue-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data</h2>
//           <p className="text-gray-600">Enter a UID to start analysis</p>
//         </div>
//       </div>
//     );
//   }

//   // expected backend shape (your cleaned backend)
//   const {
//     product_info = {},
//     cycle_time_minutes = 0,
//     number_of_cycles = 0,
//     number_of_equipments = 0,
//     quality_summary = {},
//     station_flow = [],
//     measurement_data = []
//   } = analysisData;

//   const passPercent = quality_summary.pass_percent ?? 0;
//   const failPercent = quality_summary.fail_percent ?? 0;

//   return (
//     <div className="min-h-screen p-6 relative">
//       <AnimatedBackground />

//       <div className="max-w-7xl mx-auto space-y-8 relative z-10">

//         {/* UID centered thin glass badge (Style A) */}
//         <div className="flex justify-center">
//           <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/30 border border-white/30 backdrop-blur-md shadow-md">
//             <BarcodeIcon className="w-5 h-5 text-white/90" />
//             <span className="text-white font-medium">UID: {uid}</span>
//           </div>
//         </div>

//         {/* Top row: Four cards in one row */}
// {/* Top row: Four cards in one row */}
// <motion.div 
//   initial={{ opacity: 0, y: 12 }} 
//   animate={{ opacity: 1, y: 0 }} 
//   className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
// >
//   <StatCard 
//     icon={<Gauge className="w-6 h-6" />} 
//     title="Cycle Time (min)" 
//     value={cycle_time_minutes ?? '0.00'} 
//     subtitle=""       // ❌ removed shift
//     color="purple" 
//   />

//   <StatCard 
//     icon={<Battery className="w-6 h-6" />} 
//     title="Number of Cycles" 
//     value={number_of_cycles ?? 0} 
//     subtitle="" 
//     color="emerald" 
//     glow 
//   />

//   <StatCard 
//     icon={<Thermometer className="w-6 h-6" />} 
//     title="Model" 
//     value={product_info.model || product_info.product_model || 'N/A'} 
//     subtitle=""       // ❌ no extra text
//     color="cyan" 
//   />

//   <StatCard 
//     icon={<Battery className="w-6 h-6" />} 
//     title="Variant" 
//     value={product_info.variant || 'N/A'} 
//     subtitle=""       // ❌ removed 'Product type'
//     color="blue" 
//   />
// </motion.div>


//         {/* Second row: Equipments + Quality summary */}
//         <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <StatCard icon={<Battery className="w-6 h-6" />} title="No. of Equipments" value={number_of_equipments ?? 0} subtitle="" color="blue" />
//           <motion.div whileHover={{ scale: 1.02, y: -4 }} className="relative p-6 rounded-2xl bg-gradient-to-br from-white/80 to-white/70 backdrop-blur-xl border shadow-lg transition-all duration-300">
//             <div className="flex items-center justify-between">
//               <div className="flex-1">
//                 <p className="text-gray-600 text-sm font-medium mb-1">Quality Summary</p>
//                 <div className="flex items-baseline space-x-6">
//                   <div>
//                     <p className="text-3xl font-bold text-emerald-600">{passPercent}%</p>
//                     <p className="text-gray-600 text-sm">PASS</p>
//                   </div>
//                   <div>
//                     <p className="text-3xl font-bold text-rose-600">{failPercent}%</p>
//                     <p className="text-gray-600 text-sm">FAIL</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="p-3 rounded-xl bg-blue-100">
//                 <Gauge className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>

//         {/* Production Flow */}
//         <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/70 rounded-2xl p-6 backdrop-blur-xl border border-gray-200/80 shadow-xl">
//           <div className="flex items-center space-x-3 mb-6">
//             <div className="p-2 rounded-xl bg-blue-100">
//               <BarChart3 className="w-6 h-6 text-blue-600" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-600">Production Flow</h2>
//             <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 via-cyan-500/30 to-transparent"></div>
//             {/* <span className="text-gray-700 font-semibold bg-gray-100 px-4 py-2 rounded-full">
//               {station_flow.filter(s => String(s.status).toUpperCase() === 'PASS').length}/{station_flow.length} Stations
//             </span> */}
//           </div>

//           <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
//             {station_flow.map((st, i) => (
//               <StationNode key={`${st.station_name}-${i}`} station={st} isLast={i === station_flow.length - 1} />
//             ))}
//           </div>  
//         </motion.section>

//         {/* Measurement Data - UPDATED TO 2-COLUMN GRID */}
//         <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/70 rounded-2xl p-6 backdrop-blur-xl border border-gray-200/80 shadow-xl">
//           <div className="flex items-center space-x-3 mb-6">
//             <div className="p-2 rounded-xl bg-emerald-100">
//               <CheckCircle className="w-6 h-6 text-emerald-600" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900">Measurement Data (PASS stations)</h2>
//           </div>

//           {/* CHANGED: 2-column grid layout */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {measurement_data.length === 0 && (
//               <div className="col-span-2 p-4 rounded-xl bg-white/60 border border-gray-200 text-gray-700">
//                 No PASS stations with measurements (showing PASS stations from flow)
//               </div>
//             )}

//             {(measurement_data.length > 0 ? measurement_data : station_flow.filter(s => String(s.status).toUpperCase() === 'PASS'))
//               .map((m, idx) => (
//                 <div key={`${m.station}-${idx}`} className="p-4 rounded-xl bg-white/60 border border-gray-200">
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="font-semibold text-gray-900">{m.station || m.station_name}</div>
//                     {statusPill(m.status || 'PASS')}
//                   </div>

//                   {m.measurements && Array.isArray(m.measurements) && m.measurements.length > 0 ? (
//                     <div className="space-y-2 text-sm text-gray-700">
//                       {m.measurements.map((meas, i) => (
//                         <div key={i} className="flex justify-between items-center p-2 bg-gray-50/50 rounded-lg">
//                           {/* CHANGED: Added testid display with limits */}
//                           <div className="font-medium text-gray-800">
//                             {meas.testid || 'Measurement'}
//                           </div>
//                           <div className="text-right">
//                             <div className="font-semibold text-gray-900">
//                               {meas.value} {meas.unit || ''}
//                             </div>
//                             {/* CHANGED: Added LSL/HSL limits */}
//                             {meas.lsl && meas.hsl && (
//                               <div className="text-xs text-gray-500">
//                                 LSL: {meas.lsl} | HSL: {meas.hsl}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="text-sm text-gray-600 italic">No measurement data</div>
//                   )}
//                 </div>
//               ))
//             }
//           </div>
//         </motion.section>
//       </div>
//     </div>
//   );
// };

// export default AnalysisDashboard;



// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { useLocation } from "react-router-dom";

// // Icons (clean + only the ones you actually use)
// import {
//   Package,      // Model
//   Repeat,       // Number of Cycles
//   Layers,       // Variant
//   Server,       // Number of Equipments
//   Timer,        // Cycle Time
//   PieChart,     // Quality Summary
//   Factory,
//   AlertTriangle,
//   CheckCircle,
//   BarChart3,
//   Gauge,
//   RotateCcw
// } from "lucide-react";


// // Add custom scrollbar styles
// const scrollbarStyles = `
//   .custom-scrollbar::-webkit-scrollbar {
//     width: 8px;
//   }
//   .custom-scrollbar::-webkit-scrollbar-track {
//     background: rgba(255, 255, 255, 0.3);
//     border-radius: 10px;
//   }
//   .custom-scrollbar::-webkit-scrollbar-thumb {
//     background: linear-gradient(to bottom, rgba(139, 92, 246, 0.6), rgba(59, 130, 246, 0.6));
//     border-radius: 10px;
//   }
//   .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//     background: linear-gradient(to bottom, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.8));
//   }
// `;

// // Animated Background Component - identical to your theme
// const AnimatedBackground = () => (
//   <div className="fixed inset-0 -z-10 overflow-hidden">
//     <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-blue-500" />
//     <motion.div
//       animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
//       transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
//       className="absolute top-0 -left-48 w-96 h-96 bg-blue-300/40 rounded-full blur-3xl"
//     />
//     <motion.div
//       animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
//       transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
//       className="absolute bottom-0 -right-48 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"
//     />
//     <motion.div
//       animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
//       transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
//       className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl"
//     />
//     <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[size:64px_64px]" />
//     <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent)]" />
//   </div>
// );

// // Inline barcode SVG (small, crisp) for the UID badge
// const BarcodeIcon = ({ className = "w-5 h-5" }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
//     <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
//     <path d="M4 7v10M7 7v10M10 7v10M13 7v10M16 7v10M19 7v10" />
//   </svg>
// );

// const AnalysisDashboard = ({ uid: externalUid }) => {
//   const [uid, setUid] = useState(null);
//   const [analysisData, setAnalysisData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const location = useLocation();
//   const isStandalone = location.pathname.includes("/analytics-window");

//   // Fetch analysis from your cleaned backend
//   const fetchAnalysis = async (productUid) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const resp = await fetch(`http://localhost:4000/api/trace/analysis?uid=${productUid}`);
//       const data = await resp.json();
//       if (data.success) setAnalysisData(data);
//       else setError(data.message || 'Failed to fetch analysis');
//     } catch (err) {
//       setError('Connection error: ' + err.message);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (externalUid) {
//       setLoading(true);
//       setAnalysisData(null);
//       setUid(externalUid);
//       fetchAnalysis(externalUid);
//     }
//   }, [externalUid]);

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const routeUid = params.get("uid");
//     if (routeUid) {
//       setUid(routeUid);
//       fetchAnalysis(routeUid);
//     }
//   }, [location.search]);

//   // ui helpers for status badges and card classes (status-based)
//   const statusPill = (status) => {
//     if (!status) return null;

//     const s = String(status).toUpperCase();

//     const map = {
//       PASS: 'bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg',
//       FAIL: 'bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg',
//       REWORK: 'bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg',
//       "REWORK DONE": 'bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg'
//     };

//     return (
//       <span
//         className={
//           map[s] ||
//           'bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg'
//         }
//       >
//         {s}
//       </span>
//     );
//   };

//   const getCardClassByStatus = (status) => {
//     const s = String(status || '').toUpperCase();

//     if (s === 'PASS')
//       return 'bg-gradient-to-br from-emerald-100/80 via-emerald-50/60 to-white/40 border-emerald-400/50 text-gray-900';

//     if (s === 'FAIL')
//       return 'bg-gradient-to-br from-rose-100/80 via-rose-50/60 to-white/40 border-rose-400/50 text-gray-900';

//     if (s === 'REWORK DONE')
//       return 'bg-gradient-to-br from-orange-100/80 via-orange-50/60 to-white/40 border-orange-400/50 text-gray-900';

//     if (s === 'REWORK')
//       return 'bg-gradient-to-br from-amber-100/80 via-amber-50/60 to-white/40 border-amber-400/50 text-gray-900';

//     return 'bg-white/80 border-gray-300 text-gray-900';
//   };

//   // Improved StatCard component
//   const StatCard = ({ icon, title, value, subtitle, color = 'blue', glow = false }) => {
//     const colorMap = {
//       blue: 'from-blue-100/60 via-blue-50/40 to-white/30 border-blue-400/40 shadow-blue-400/20',
//       emerald: 'from-emerald-100/60 via-emerald-50/40 to-white/30 border-emerald-400/40 shadow-emerald-400/20',
//       amber: 'from-amber-100/60 via-amber-50/40 to-white/30 border-amber-400/40 shadow-amber-400/20',
//       cyan: 'from-cyan-100/60 via-cyan-50/40 to-white/30 border-cyan-400/40 shadow-cyan-400/20',
//       purple: 'from-purple-100/60 via-purple-50/40 to-white/30 border-purple-400/40 shadow-purple-400/20'
//     };
//     const iconBgMap = {
//       blue: 'bg-gradient-to-br from-blue-200/80 to-blue-100/60 text-blue-700 shadow-lg shadow-blue-400/30',
//       emerald: 'bg-gradient-to-br from-emerald-200/80 to-emerald-100/60 text-emerald-700 shadow-lg shadow-emerald-400/30',
//       amber: 'bg-gradient-to-br from-amber-200/80 to-amber-100/60 text-amber-700 shadow-lg shadow-amber-400/30',
//       cyan: 'bg-gradient-to-br from-cyan-200/80 to-cyan-100/60 text-cyan-700 shadow-lg shadow-cyan-400/30',
//       purple: 'bg-gradient-to-br from-purple-200/80 to-purple-100/60 text-purple-700 shadow-lg shadow-purple-400/30'
//     };
//     return (
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         whileHover={{ scale: 1.03, y: -6 }} 
//         className={`relative p-6 rounded-3xl bg-gradient-to-br ${colorMap[color]} backdrop-blur-2xl border-2 ${glow ? 'shadow-2xl' : 'shadow-xl'} hover:shadow-2xl transition-all duration-500`}
//       >
//         <div className="flex items-center justify-between">
//           <div className="flex-1">
//           <p className="text-indigo-900 text-xs font-extrabold uppercase tracking-wider mb-2">
//             {title}
//           </p>
//                       <p className="text-4xl font-black text-gray-900 mb-1">{value}</p>
//             {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
//           </div>
//           <div className={`p-4 rounded-2xl ${iconBgMap[color]} backdrop-blur-sm`}>{icon}</div>
//         </div>
//       </motion.div>
//     );
//   };

//   const StationNode = ({ station, isLast }) => {
//     const cardClass = getCardClassByStatus(station.status);
//     return (
//       <div className="flex items-center">
//         <motion.div 
//           whileHover={{ scale: 1.03, y: -4 }} 
//           className={`relative p-5 rounded-2xl backdrop-blur-2xl border-2 transition-all duration-300 min-w-[180px] shadow-lg ${cardClass}`}
//         >
//           <div className="flex items-center justify-between mb-2">
//             <h4 className="font-bold text-gray-900 text-sm">{station.station_name}</h4>
//             {statusPill(station.status)}
//           </div>
//         </motion.div>

//         {!isLast && (
//           <div className="mx-3">
//             <motion.div 
//               initial={{ scaleX: 0 }} 
//               animate={{ scaleX: 1 }} 
//               transition={{ duration: 0.45 }} 
//               className="w-12 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 rounded-full shadow-lg" 
//             />
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Loading / error / no-data screens
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <AnimatedBackground />
//         <motion.div 
//           animate={{ rotate: 360 }} 
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }} 
//           className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" 
//         />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <AnimatedBackground />
//         <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center p-8">
//           <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
//           <p className="text-gray-600">{error}</p>
//         </motion.div>
//       </div>
//     );
//   }

//   if (!analysisData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <AnimatedBackground />
//         <div className="text-center">
//           <Factory className="w-16 h-16 text-blue-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data</h2>
//           <p className="text-gray-600">Enter a UID to start analysis</p>
//         </div>
//       </div>
//     );
//   }

//   const {
//     product_info = {},
//     cycle_time_minutes = 0,
//     number_of_cycles = 0,
//     number_of_equipments = 0,
//     quality_summary = {},
//     station_flow = [],
//     measurement_data = []
//   } = analysisData;

//   const passPercent = quality_summary.pass_percent ?? 0;
//   const failPercent = quality_summary.fail_percent ?? 0;

//   return (
//     <>
//       <style>{scrollbarStyles}</style>
//       <div className="min-h-screen p-6 relative">
//         <AnimatedBackground />

//         <div className="max-w-7xl mx-auto space-y-8 relative z-10">

//           {/* UID - IMPROVED: Bigger and Brighter */}
//           {/* <div className="flex justify-center">
//             <motion.div 
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="inline-flex items-center gap-4 px-8 py-3.5 rounded-full bg-white/40 border-2 border-white/50 backdrop-blur-xl shadow-2xl shadow-blue-500/20"
//             >
//               <BarcodeIcon className="w-6 h-6 text-white drop-shadow-lg" />
//               <span className="text-white text-xl font-bold tracking-wide drop-shadow-lg">
//                 UID: {uid}
//               </span>
//             </motion.div>
//           </div> */}

//           {/* UID - Darker, Higher Contrast, Matches Background */}
//           <div className="flex justify-center">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="
//                 inline-flex items-center gap-4 
//                 px-8 py-3.5 
//                 rounded-full 
//                 bg-white/20 
//                 border border-white/40 
//                 backdrop-blur-2xl 
//                 shadow-lg
//               "
//               style={{
//                 boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
//               }}
//             >
//               <BarcodeIcon className="w-6 h-6 text-orange-900 drop-shadow-sm" />

//               <span className="text-indigo-800 text-xl font-extrabold tracking-wide drop-shadow-sm">
//                 UID: {uid}
//               </span>
//             </motion.div>
//           </div>


//         {/* TOP ROW - EXACTLY AS REQUESTED */}
//         <motion.div 
//           initial={{ opacity: 0, y: 12 }} 
//           animate={{ opacity: 1, y: 0 }} 
//           className="grid grid-cols-1 md:grid-cols-3 gap-6"
//         >
//         {/* 1. Cycle Time */}
//         <StatCard 
//           icon={<Timer className="w-6 h-6" />} 
//           title="Cycle Time (min)" 
//           value={cycle_time_minutes ?? '0.00'} 
//           subtitle=""
//           color="purple" 
//         />


//           {/* 2. Number of Equipments */}
//           <StatCard 
//             icon={<Server className="w-6 h-6" />} 
//             title="No. of Equipments" 
//             value={number_of_equipments ?? 0} 
//             subtitle="" 
//             color="blue" 
//           />


//           {/* 3. Variant */}
//           <StatCard 
//             icon={<Layers className="w-6 h-6" />} 
//             title="Variant" 
//             value={product_info.variant || 'N/A'} 
//             subtitle=""
//             color="blue" 
//           />

//         </motion.div>


//         {/* SECOND ROW - EXACTLY AS REQUESTED */}
//         <motion.div 
//           initial={{ opacity: 0, y: 8 }} 
//           animate={{ opacity: 1, y: 0 }} 
//           className="grid grid-cols-1 md:grid-cols-3 gap-6"
//         >

//         {/* 1. Number of Cycles */}
//         <StatCard 
//           icon={<Repeat className="w-6 h-6" />} 
//           title="Number of Cycles" 
//           value={number_of_cycles ?? 0} 
//           subtitle="" 
//           color="emerald" 
//           glow 
//         />


//           {/* 2. Model */}
//           <StatCard 
//           icon={<Package className="w-6 h-6" />} 
//             title="Model" 
//             value={product_info.model || 'N/A'} 
//             subtitle=""
//             color="cyan" 
//           />

//           {/* 3. Quality Summary */}
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             whileHover={{ scale: 1.03, y: -6 }} 
//             className="relative p-6 rounded-3xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-2xl border-2 border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500"
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex-1">
//               <p className="text-blue-900 text-xs font-extrabold uppercase tracking-wider mb-2">
//                 Quality Summary
//               </p>
//                 <div className="flex items-baseline space-x-6">
//                   <div>
//                     <p className="text-4xl font-black text-emerald-600">{passPercent}%</p>
//                     <p className="text-gray-900 text-sm font-extrabold">PASS</p>
//                   </div>
//                   <div>
//                     <p className="text-4xl font-black text-rose-600">{failPercent}%</p>
//                     <p className="text-gray-900 text-sm font-extrabold">FAIL</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-200/80 to-blue-100/60 shadow-lg shadow-blue-400/30">
//               <PieChart className="w-6 h-6 text-blue-700" />
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>


//           {/* Production Flow */}
//           <motion.section 
//             initial={{ opacity: 0, y: 10 }} 
//             animate={{ opacity: 1, y: 0 }} 
//             transition={{ delay: 0.2 }} 
//             className="bg-white/70 rounded-3xl p-6 backdrop-blur-2xl border-2 border-white/50 shadow-2xl"
//           >
//             <div className="flex items-center space-x-3 mb-6">
//               <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-200/80 to-blue-100/60 shadow-lg shadow-blue-400/30">
//                 <BarChart3 className="w-6 h-6 text-blue-700" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900">Production Flow</h2>
//               <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 via-cyan-500/30 to-transparent"></div>
//             </div>

//             <div 
//               className="flex overflow-x-auto overflow-y-hidden pb-4 space-x-4 custom-scrollbar scroll-smooth" 
//               style={{ 
//                 WebkitOverflowScrolling: 'touch',
//                 scrollBehavior: 'smooth',
//                 overscrollBehavior: 'contain'
//               }}
//             >
//               {station_flow.map((st, i) => (
//                 <StationNode key={`${st.station_name}-${i}`} station={st} isLast={i === station_flow.length - 1} />
//               ))}
//             </div> 
//           </motion.section>

//         {/* Measurement Data - ONE BY ONE VERTICAL LAYOUT */}
//         <motion.section 
//           initial={{ opacity: 0, y: 8 }} 
//           animate={{ opacity: 1, y: 0 }} 
//           className="bg-white/70 rounded-3xl p-6 backdrop-blur-2xl border-2 border-white/50 shadow-2xl"
//         >
//           <div className="flex items-center space-x-3 mb-6">
//             <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-200/80 to-emerald-100/60 shadow-lg shadow-emerald-400/30">
//               <CheckCircle className="w-6 h-6 text-emerald-700" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900">Measurement Data (PASS stations)</h2>
//           </div>

//           {/* ONE-BY-ONE VERTICAL LAYOUT */}
//           <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
//             <div className="space-y-6"> {/* Changed from grid to vertical space */}
//               {measurement_data.length === 0 && (
//                 <div className="p-4 rounded-xl bg-white/60 border border-gray-200 text-gray-700">
//                   No PASS stations with measurements (showing PASS stations from flow)
//                 </div>
//               )}

//               {(measurement_data.length > 0 ? measurement_data : station_flow.filter(s => String(s.status).toUpperCase() === 'PASS'))
//                 .map((m, idx) => (
//                   <motion.div 
//                     key={`${m.station}-${idx}`}
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ delay: idx * 0.05 }}
//                     whileHover={{ scale: 1.01, y: -2 }}
//                     className="p-6 rounded-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 border-2 border-white/50 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300"
//                   >
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="font-bold text-gray-900 text-lg">{m.station || m.station_name}</div>
//                                   <span className="
//                       px-4 py-1 rounded-full text-xs font-bold
//                       bg-gradient-to-r from-emerald-700 to-emerald-800 
//                       text-white shadow-[0_2px_6px_rgba(16,185,129,0.45)]
//                     ">
//                       PASS
//                     </span>

//                     </div>

//                     {m.measurements && Array.isArray(m.measurements) && m.measurements.length > 0 ? (
//                       <div className="space-y-4">
//                         {m.measurements.map((meas, i) => (
//                           <motion.div 
//                             key={i}
//                             initial={{ opacity: 0, x: -10 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: 0.1 + i * 0.05 }}
//                             className="p-4 rounded-xl bg-gradient-to-br from-blue-50/60 to-purple-50/40 border border-blue-200/40 backdrop-blur-sm"
//                           >
//                             <div className="flex justify-between items-start gap-4">
//                               <div className="flex-1">
//                                 <div className="font-semibold text-gray-800 text-base mb-2">
//                                   {meas.testid || 'Measurement'}
//                                 </div>
//                                 {meas.lsl && meas.hsl && (
//                                   <div className="text-sm text-gray-900 font-medium space-x-2">
//                                     <span className="inline-block bg-blue-00/90 px-3 py-1 rounded">LSL: {meas.lsl}</span>
//                                     <span className="inline-block bg-purple-300/80 px-3 py-1 rounded">HSL: {meas.hsl}</span>
//                                   </div>
//                                 )}
//                               </div>
//                               <div className="flex items-center gap-4">
//                                 {/* Value + Unit */}
//                                 <div className="text-right">
//                                   <div className="font-bold text-xl text-gray-900">
//                                     {meas.value}
//                                   </div>
//                                   <div className="text-sm text-gray-600 font-medium">
//                                     {meas.unit || ''}
//                                   </div>
//                                 </div>

//                                 {/* PASS badge */}
//                                 <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
//                                   PASS
//                                 </span>
//                               </div>
//                             </div>


//                           </motion.div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="text-sm text-gray-600 italic p-4 bg-gray-50/40 rounded-lg text-center">
//                         No measurement data available
//                       </div>
//                     )}
//                   </motion.div>
//                 ))
//               }
//             </div>
//           </div>
//         </motion.section>
//                 </div>
//               </div>
//             </>
//           );
//         };

// export default AnalysisDashboard;


// src/components/AnalysisDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from "react-router-dom";

// lucide icons (only the ones you use)
import {
  Package,
  Repeat,
  Layers,
  Server,
  Timer,
  PieChart,
  Factory,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from "lucide-react";

// Add custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, rgba(139, 92, 246, 0.6), rgba(59, 130, 246, 0.6));
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.8));
  }
`;

// Animated Background Component - unchanged
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-blue-500" />
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-0 -left-48 w-72 sm:w-80 md:w-96 h-72 sm:h-80 md:h-96 bg-blue-300/40 rounded-full blur-3xl"
    />
    <motion.div
      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute bottom-0 -right-48 w-72 sm:w-80 md:w-96 h-72 sm:h-80 md:h-96 bg-purple-300/30 rounded-full blur-3xl"
    />
    <motion.div
      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-80 md:w-96 h-72 sm:h-80 md:h-96 bg-indigo-300/30 rounded-full blur-3xl"
    />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[size:64px_64px]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent)]" />
  </div>
);

// Inline barcode SVG (small, crisp)
const BarcodeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <path d="M4 7v10M7 7v10M10 7v10M13 7v10M16 7v10M19 7v10" />
  </svg>
);

const AnalysisDashboard = ({ uid: externalUid }) => {
  const [uid, setUid] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();

  // Fetch analysis from backend (unchanged)
  const fetchAnalysis = async (productUid) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`http://localhost:4000/api/trace/analysis?uid=${productUid}`);
      const data = await resp.json();
      if (data.success) setAnalysisData(data);
      else setError(data.message || 'Failed to fetch analysis');
    } catch (err) {
      setError('Connection error: ' + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (externalUid) {
      setLoading(true);
      setAnalysisData(null);
      setUid(externalUid);
      fetchAnalysis(externalUid);
    }
  }, [externalUid]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const routeUid = params.get("uid");
    if (routeUid) {
      setUid(routeUid);
      fetchAnalysis(routeUid);
    }
  }, [location.search]);

  // UI helpers - unchanged
  const statusPill = (status) => {
    if (!status) return null;
    const s = String(status).toUpperCase();
    const map = {
      PASS: 'bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg',
      FAIL: 'bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg',
      REWORK: 'bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg',
      "REWORK DONE": 'bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg'
    };
    return <span className={map[s] || 'bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg'}>{s}</span>;
  };

  const getCardClassByStatus = (status) => {
    const s = String(status || '').toUpperCase();
    if (s === 'PASS') return 'bg-gradient-to-br from-emerald-100/80 via-emerald-50/60 to-white/40 border-emerald-400/50 text-gray-900';
    if (s === 'FAIL') return 'bg-gradient-to-br from-rose-100/80 via-rose-50/60 to-white/40 border-rose-400/50 text-gray-900';
    if (s === 'REWORK DONE') return 'bg-gradient-to-br from-orange-100/80 via-orange-50/60 to-white/40 border-orange-400/50 text-gray-900';
    if (s === 'REWORK') return 'bg-gradient-to-br from-amber-100/80 via-amber-50/60 to-white/40 border-amber-400/50 text-gray-900';
    return 'bg-white/80 border-gray-300 text-gray-900';
  };

  // StatCard - preserved logic, added responsive typography & paddings
  const StatCard = ({ icon, title, value, subtitle, color = 'blue', glow = false }) => {
    const colorMap = {
      blue: 'from-blue-100/60 via-blue-50/40 to-white/30 border-blue-400/40 shadow-blue-400/20',
      emerald: 'from-emerald-100/60 via-emerald-50/40 to-white/30 border-emerald-400/40 shadow-emerald-400/20',
      amber: 'from-amber-100/60 via-amber-50/40 to-white/30 border-amber-400/40 shadow-amber-400/20',
      cyan: 'from-cyan-100/60 via-cyan-50/40 to-white/30 border-cyan-400/40 shadow-cyan-400/20',
      purple: 'from-purple-100/60 via-purple-50/40 to-white/30 border-purple-400/40 shadow-purple-400/20'
    };
    const iconBgMap = {
      blue: 'bg-gradient-to-br from-blue-200/80 to-blue-100/60 text-blue-700 shadow-lg shadow-blue-400/30',
      emerald: 'bg-gradient-to-br from-emerald-200/80 to-emerald-100/60 text-emerald-700 shadow-lg shadow-emerald-400/30',
      amber: 'bg-gradient-to-br from-amber-200/80 to-amber-100/60 text-amber-700 shadow-lg shadow-amber-400/30',
      cyan: 'bg-gradient-to-br from-cyan-200/80 to-cyan-100/60 text-cyan-700 shadow-lg shadow-cyan-400/30',
      purple: 'bg-gradient-to-br from-purple-200/80 to-purple-100/60 text-purple-700 shadow-lg shadow-purple-400/30'
    };
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03, y: -6 }} 
        className={`relative p-4 sm:p-5 lg:p-6 rounded-2xl lg:rounded-3xl bg-gradient-to-br ${colorMap[color]} backdrop-blur-2xl border-2 ${glow ? 'shadow-2xl' : 'shadow-xl'} hover:shadow-2xl transition-all duration-500`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 pr-3">
            <p className="text-indigo-900 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider mb-1 sm:mb-2">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-0">{value}</p>
            {subtitle && <p className="text-gray-600 text-xs sm:text-sm">{subtitle}</p>}
          </div>
          <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${iconBgMap[color]} backdrop-blur-sm`}>
            <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7">{icon}</div>
          </div>
        </div>
      </motion.div>
    );
  };

  // StationNode - keep look & animation, adjust min width for responsive
  const StationNode = ({ station, isLast }) => {
    const cardClass = getCardClassByStatus(station.status);
    return (
      <div className="flex items-center shrink-0">
        <motion.div 
          whileHover={{ scale: 1.03, y: -4 }} 
          className={`relative p-3 sm:p-5 rounded-2xl backdrop-blur-2xl border-2 transition-all duration-300 min-w-[150px] sm:min-w-[180px] shadow-lg ${cardClass}`}
        >
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm">{station.station_name}</h4>
            {statusPill(station.status)}
          </div>
        </motion.div>

        {!isLast && (
          <div className="mx-2 sm:mx-3">
            <motion.div 
              initial={{ scaleX: 0 }} 
              animate={{ scaleX: 1 }} 
              transition={{ duration: 0.45 }} 
              className="w-10 sm:w-12 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 rounded-full shadow-lg" 
            />
          </div>
        )}
      </div>
    );
  };

  // Loading / error / empty states - preserved
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <AnimatedBackground />
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }} 
          className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full" 
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <AnimatedBackground />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center p-4 sm:p-8">
          <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-rose-500 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Error</h2>
          <p className="text-gray-600 text-sm sm:text-base">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <AnimatedBackground />
        <div className="text-center">
          <Factory className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">No Data</h2>
          <p className="text-gray-600 text-sm sm:text-base">Enter a UID to start analysis</p>
        </div>
      </div>
    );
  }

  // destructure analysisData (unchanged)
  const {
    product_info = {},
    cycle_time_minutes = 0,
    number_of_cycles = 0,
    number_of_equipments = 0,
    quality_summary = {},
    station_flow = [],
    measurement_data = []
  } = analysisData;

  const passPercent = quality_summary.pass_percent ?? 0;
  const failPercent = quality_summary.fail_percent ?? 0;

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="min-h-screen p-4 sm:p-6 lg:p-12 relative">
        <AnimatedBackground />

        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 relative z-10">
          {/* UID - responsive sizes */}
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="
                inline-flex items-center gap-3 sm:gap-4 
                px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-3.5
                rounded-full 
                bg-white/20 
                border border-white/40 
                backdrop-blur-2xl 
                shadow-lg
              "
              style={{ boxShadow: "0 8px 25px rgba(0,0,0,0.12)" }}
            >
              <BarcodeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-900 drop-shadow-sm" />
              <span className="text-indigo-800 text-sm sm:text-lg lg:text-xl font-extrabold tracking-wide">
                UID: {uid}
              </span>
            </motion.div>
          </div>

          {/* TOP ROW - responsive: mobile 1 col, tablet 2, desktop 3 */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            <StatCard icon={<Timer className="w-5 h-5" />} title="Cycle Time (min)" value={cycle_time_minutes ?? '0.00'} subtitle="" color="purple" />
            <StatCard icon={<Server className="w-5 h-5" />} title="No. of Equipments" value={number_of_equipments ?? 0} subtitle="" color="blue" />
            <StatCard icon={<Layers className="w-5 h-5" />} title="Variant" value={product_info.variant || 'N/A'} subtitle="" color="blue" />
          </motion.div>

          {/* SECOND ROW */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            <StatCard icon={<Repeat className="w-5 h-5" />} title="Number of Cycles" value={number_of_cycles ?? 0} subtitle="" color="emerald" glow />
            <StatCard icon={<Package className="w-5 h-5" />} title="Model" value={product_info.model || 'N/A'} subtitle="" color="cyan" />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.03, y: -6 }} className="relative p-4 sm:p-6 rounded-2xl lg:rounded-3xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-2xl border-2 border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-blue-900 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider mb-2">Quality Summary</p>
                  <div className="flex items-baseline space-x-4 sm:space-x-6">
                    <div>
                      <p className="text-2xl sm:text-4xl font-black text-emerald-600">{passPercent}%</p>
                      <p className="text-gray-900 text-xs sm:text-sm font-extrabold">PASS</p>
                    </div>
                    <div>
                      <p className="text-2xl sm:text-4xl font-black text-rose-600">{failPercent}%</p>
                      <p className="text-gray-900 text-xs sm:text-sm font-extrabold">FAIL</p>
                    </div>
                  </div>
                </div>
                <div className="p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-200/80 to-blue-100/60 shadow-lg shadow-blue-400/30">
                  <PieChart className="w-4 h-4 sm:w-6 sm:h-6 text-blue-700" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Production Flow section */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/70 rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 backdrop-blur-2xl border-2 border-white/50 shadow-2xl">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-blue-200/80 to-blue-100/60 shadow-lg">
                <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-blue-700" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Production Flow</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 via-cyan-500/30 to-transparent ml-3"></div>
            </div>

            <div
              className="flex overflow-x-auto overflow-y-hidden pb-3 sm:pb-4 space-x-3 sm:space-x-4 custom-scrollbar scroll-smooth"
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth',
                overscrollBehavior: 'contain'
              }}
            >
              {station_flow.map((st, i) => (
                <StationNode key={`${st.station_name}-${i}`} station={st} isLast={i === station_flow.length - 1} />
              ))}
            </div>
          </motion.section>

          {/* Measurement Data */}
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/70 rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 backdrop-blur-2xl border-2 border-white/50 shadow-2xl">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-emerald-200/80 to-emerald-100/60 shadow-lg">
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-700" />
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Measurement Data (PASS stations)</h2>
            </div>

            {/* vertical list; responsive max heights */}
            <div className="max-h-[420px] sm:max-h-[520px] lg:max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-4 sm:space-y-6">
                {measurement_data.length === 0 && (
                  <div className="p-3 sm:p-4 rounded-xl bg-white/60 border border-gray-200 text-gray-700 text-sm sm:text-base">
                    No PASS stations with measurements (showing PASS stations from flow)
                  </div>
                )}

                {(measurement_data.length > 0 ? measurement_data : station_flow.filter(s => String(s.status).toUpperCase() === 'PASS'))
                  .map((m, idx) => (
                    <motion.div
                      key={`${m.station || m.station_name}-${idx}`}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.04 }}
                      whileHover={{ scale: 1.01, y: -2 }}
                      className="p-3 sm:p-6 rounded-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 border-2 border-white/50 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-bold text-gray-900 text-base sm:text-lg">{m.station || m.station_name}</div>
                        <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-700 to-emerald-800 text-white shadow-[0_2px_6px_rgba(16,185,129,0.45)]">PASS</span>
                      </div>

                      {m.measurements && Array.isArray(m.measurements) && m.measurements.length > 0 ? (
                        <div className="space-y-3">
                          {m.measurements.map((meas, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.06 + i * 0.03 }}
                              className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-blue-50/60 to-purple-50/40 border border-blue-200/40 backdrop-blur-sm"
                            >
                              <div className="flex justify-between items-start gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-gray-800 text-sm sm:text-base mb-1">
                                    {meas.testid || 'Measurement'}
                                  </div>
                                  {meas.lsl && meas.hsl && (
                                    <div className="text-sm text-gray-900 font-medium space-x-2">
                                      <span className="inline-block px-2 py-0.5 text-xs sm:text-sm rounded bg-blue-50/90">LSL: {meas.lsl}</span>
                                      <span className="inline-block px-2 py-0.5 text-xs sm:text-sm rounded bg-purple-50/80">HSL: {meas.hsl}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <div className="font-bold text-lg sm:text-xl text-gray-900">{meas.value}</div>
                                    <div className="text-xs sm:text-sm text-gray-600 font-medium">{meas.unit || ''}</div>
                                  </div>

                                  <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md">PASS</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600 italic p-3 sm:p-4 bg-gray-50/40 rounded-lg text-center">No measurement data available</div>
                      )}
                    </motion.div>
                  ))
                }
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default AnalysisDashboard;
