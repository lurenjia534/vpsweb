"use client";

import { VPSConnection, WebSocketConnection } from "@/types/vps";
import { formatBytes, formatUptime } from "@/utils/format";

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
  const getStatusColor = () => {
    switch (wsConnection?.status) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (wsConnection?.status) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      case "error":
        return "Error";
      default:
        return "Disconnected";
    }
  };

  const data = wsConnection?.data;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {connection.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
              {connection.url}
            </p>
          </div>
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {getStatusText()}
          </span>
          {wsConnection?.lastUpdate && (
            <span className="text-xs text-gray-500 dark:text-gray-500">
              • Updated {new Date(wsConnection.lastUpdate).toLocaleTimeString()}
            </span>
          )}
        </div>

        {data ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Uptime</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatUptime(data.uptime_days)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Load</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {data.load.map(l => l.toFixed(2)).join(" ")}
                </p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 dark:text-gray-400">CPU</span>
                <span className="text-gray-900 dark:text-white">{data.cpu.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(data.cpu, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 dark:text-gray-400">Memory</span>
                <span className="text-gray-900 dark:text-white">
                  {data.mem_used} / {data.mem_total}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      (parseFloat(data.mem_used) / parseFloat(data.mem_total)) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 dark:text-gray-400">Disk</span>
                <span className="text-gray-900 dark:text-white">
                  {data.disk_used_gib.toFixed(1)} GiB / {data.disk_total_gib.toFixed(1)} GiB
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${(data.disk_used_gib / data.disk_total_gib) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="text-xs">
                <p className="text-gray-500 dark:text-gray-400">Network</p>
                <p className="text-gray-900 dark:text-white">
                  ↓ {formatBytes(data.rx_rate)}/s
                </p>
                <p className="text-gray-900 dark:text-white">
                  ↑ {formatBytes(data.tx_rate)}/s
                </p>
              </div>
              <div className="text-xs">
                <p className="text-gray-500 dark:text-gray-400">Connections</p>
                <p className="text-gray-900 dark:text-white">
                  TCP: {data.tcp} | UDP: {data.udp}
                </p>
                <p className="text-gray-900 dark:text-white">
                  Proc: {data.processes} | Thr: {data.threads}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {wsConnection?.status === "connecting" ? "Connecting..." : "No data available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}