"use client";

import { VPSConnection, WebSocketConnection } from "@/types/vps";
import { formatBytes, formatUptime } from "@/utils/format";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Check, 
  Loader2, 
  X, 
  AlertCircle, 
  ChevronDown,
  Trash2,
  Monitor,
  Link,
  Cpu,
  MemoryStick,
  Activity,
  HardDrive,
  RefreshCw,
  Clock,
  BarChart3,
  ArrowDown,
  ArrowUp,
  Wifi,
  Layers,
  Download,
  Upload,
  Network,
  Box
} from "lucide-react";

interface VPSCardProps {
  connection: VPSConnection;
  wsConnection?: WebSocketConnection;
  onRemove: () => void;
}

export default function VPSCard({
  connection,
  wsConnection,
  onRemove,
}: VPSCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getStatusColor = () => {
    switch (wsConnection?.status) {
      case "connected":
        return "from-emerald-400 to-green-500";
      case "connecting":
        return "from-amber-400 to-orange-500";
      case "error":
        return "from-red-400 to-rose-500";
      default:
        return "from-gray-300 to-gray-400";
    }
  };

  const getStatusIcon = () => {
    switch (wsConnection?.status) {
      case "connected":
        return <Check className="w-4 h-4" />;
      case "connecting":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "error":
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const data = wsConnection?.data;
  const memoryPercentage = data ? (parseFloat(data.mem_used) / parseFloat(data.mem_total)) * 100 : 0;

  return (
    <motion.div 
      className="relative group"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Glass background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/10 backdrop-blur-2xl rounded-2xl" />
      <div className="absolute inset-0 bg-gradient-to-tr from-gray-100/20 to-transparent rounded-2xl" />
      
      {/* Main content */}
      <div className="relative bg-transparent rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/20">
        {/* Status gradient line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getStatusColor()}`} />
        
        {/* Collapsed View */}
        <motion.div 
          className="p-6 cursor-pointer relative"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between gap-6">
            {/* Status and Name */}
            <div className="flex items-center gap-4">
              <div className={`relative p-2 rounded-xl bg-gradient-to-br ${getStatusColor()} text-white shadow-lg`}>
                {getStatusIcon()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                  {connection.name}
                  {wsConnection?.status === "connected" && (
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                      Live
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-500 font-mono flex items-center gap-1">
                  <Link className="w-3 h-3" />
                  {connection.url}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            {data && wsConnection?.status === "connected" ? (
              <>
                <div className="text-center px-4 py-2 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl">
                  <div className="flex items-center gap-1 justify-center text-gray-500 mb-1">
                    <Monitor className="w-3 h-3" />
                    <p className="text-xs font-medium uppercase tracking-wider">System</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{data.os_name}</p>
                </div>

                <div className="text-center px-4 py-2 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl">
                  <div className="flex items-center gap-1 justify-center text-blue-600 mb-1">
                    <Cpu className="w-3 h-3" />
                    <p className="text-xs font-medium uppercase tracking-wider">CPU</p>
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <p className="text-2xl font-bold text-gray-900">{data.cpu.toFixed(0)}</p>
                    <p className="text-sm text-gray-500">%</p>
                  </div>
                </div>

                <div className="text-center px-4 py-2 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl">
                  <div className="flex items-center gap-1 justify-center text-purple-600 mb-1">
                    <MemoryStick className="w-3 h-3" />
                    <p className="text-xs font-medium uppercase tracking-wider">Memory</p>
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <p className="text-2xl font-bold text-gray-900">{memoryPercentage.toFixed(0)}</p>
                    <p className="text-sm text-gray-500">%</p>
                  </div>
                </div>

                <div className="text-center px-4 py-2 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl hidden lg:block">
                  <div className="flex items-center gap-1 justify-center text-green-600 mb-1">
                    <Activity className="w-3 h-3" />
                    <p className="text-xs font-medium uppercase tracking-wider">Network</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900 space-y-0.5">
                    <p>↓ {formatBytes(data.rx_rate)}/s</p>
                    <p>↑ {formatBytes(data.tx_rate)}/s</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400 flex-1 text-center italic">
                {wsConnection?.status === "connecting" ? "Connecting..." : "Offline"}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="w-10 h-10 rounded-xl bg-white/50 hover:bg-white/80 backdrop-blur-xl border border-gray-200/50 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all shadow-sm hover:shadow-md"
                whileTap={{ scale: 0.9 }}
              >
                <ChevronDown 
                  className="w-5 h-5 transition-transform duration-300" 
                  style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </motion.button>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="w-10 h-10 rounded-xl bg-red-50/80 hover:bg-red-100 backdrop-blur-xl border border-red-200/50 flex items-center justify-center text-red-600 hover:text-red-700 transition-all shadow-sm hover:shadow-md"
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Expanded View */}
        <AnimatePresence mode="wait" initial={false}>
          {isExpanded && data && (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="border-t border-gray-200/50">
                {/* System Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 bg-gradient-to-br from-gray-50/50 to-gray-100/20 backdrop-blur">
                  <div className="p-4 border-r border-gray-200/50">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Monitor className="w-4 h-4" />
                      <p className="text-xs font-medium uppercase tracking-wider">System</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{data.os_name}</p>
                  </div>
                  <div className="p-4 border-r border-gray-200/50">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Clock className="w-4 h-4" />
                      <p className="text-xs font-medium uppercase tracking-wider">Uptime</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{formatUptime(data.uptime_days)}</p>
                  </div>
                  <div className="p-4 border-r border-gray-200/50">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <BarChart3 className="w-4 h-4" />
                      <p className="text-xs font-medium uppercase tracking-wider">Load Average</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{data.load.map(l => l.toFixed(2)).join(" • ")}</p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <RefreshCw className="w-4 h-4" />
                      <p className="text-xs font-medium uppercase tracking-wider">Updated</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {wsConnection?.lastUpdate ? new Date(wsConnection.lastUpdate).toLocaleTimeString() : "-"}
                    </p>
                  </div>
                </div>

                {/* Resource Usage */}
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CPU */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-100 rounded-lg">
                            <Cpu className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{data.cpu.toFixed(1)}%</span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 shadow-sm"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(data.cpu, 100)}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Memory */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-purple-100 rounded-lg">
                            <MemoryStick className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">Memory</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{data.mem_used} / {data.mem_total}</span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-500 shadow-sm"
                            initial={{ width: 0 }}
                            animate={{ width: `${memoryPercentage}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Swap */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-amber-100 rounded-lg">
                            <RefreshCw className="w-4 h-4 text-amber-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">Swap</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                          {(data.swap_used_mib / 1024).toFixed(1)}G / {(data.swap_total_mib / 1024).toFixed(1)}G
                        </span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-sm"
                            initial={{ width: 0 }}
                            animate={{ width: `${(data.swap_used_mib / data.swap_total_mib) * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Disk */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-emerald-100 rounded-lg">
                            <HardDrive className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">Disk</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                          {data.disk_used_gib.toFixed(1)}G / {data.disk_total_gib.toFixed(1)}G
                        </span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-sm"
                            initial={{ width: 0 }}
                            animate={{ width: `${(data.disk_used_gib / data.disk_total_gib) * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div 
                      className="relative bg-gradient-to-br from-white/50 to-gray-50/50 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 shadow-sm hover:shadow-md transition-all group"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Download className="w-8 h-8 text-gray-600" strokeWidth={1} />
                      </div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <ArrowDown className="w-3 h-3" />
                        Network In
                      </p>
                      <p className="text-lg font-bold text-gray-900">{formatBytes(data.rx_rate)}/s</p>
                      <p className="text-xs text-gray-500 mt-1">Total: {data.rx_total_gib.toFixed(2)}G</p>
                    </motion.div>
                    
                    <motion.div 
                      className="relative bg-gradient-to-br from-white/50 to-gray-50/50 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 shadow-sm hover:shadow-md transition-all group"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Upload className="w-8 h-8 text-gray-600" strokeWidth={1} />
                      </div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <ArrowUp className="w-3 h-3" />
                        Network Out
                      </p>
                      <p className="text-lg font-bold text-gray-900">{formatBytes(data.tx_rate)}/s</p>
                      <p className="text-xs text-gray-500 mt-1">Total: {data.tx_total_gib.toFixed(2)}G</p>
                    </motion.div>
                    
                    <motion.div 
                      className="relative bg-gradient-to-br from-white/50 to-gray-50/50 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 shadow-sm hover:shadow-md transition-all group"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Network className="w-8 h-8 text-gray-600" strokeWidth={1} />
                      </div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Wifi className="w-3 h-3" />
                        Connections
                      </p>
                      <p className="text-lg font-bold text-gray-900">{data.tcp + data.udp}</p>
                      <p className="text-xs text-gray-500 mt-1">TCP: {data.tcp} • UDP: {data.udp}</p>
                    </motion.div>
                    
                    <motion.div 
                      className="relative bg-gradient-to-br from-white/50 to-gray-50/50 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 shadow-sm hover:shadow-md transition-all group"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Layers className="w-8 h-8 text-gray-600" strokeWidth={1} />
                      </div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Box className="w-3 h-3" />
                        Processes
                      </p>
                      <p className="text-lg font-bold text-gray-900">{data.processes}</p>
                      <p className="text-xs text-gray-500 mt-1">Threads: {data.threads}</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}