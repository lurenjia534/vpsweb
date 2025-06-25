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
        return "bg-gray-300";
    }
  };

  const getStatusText = () => {
    switch (wsConnection?.status) {
      case "connected":
        return "ONLINE";
      case "connecting":
        return "CONNECTING";
      case "error":
        return "ERROR";
      default:
        return "OFFLINE";
    }
  };

  const data = wsConnection?.data;

  return (
    <div className="bg-white border-4 border-black">
      <div className="border-b-4 border-black p-3 md:p-4 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-base md:text-xl font-black uppercase truncate">
            {connection.name}
          </h3>
          <p className="text-xs font-mono truncate">
            {connection.url}
          </p>
        </div>
        <button
          onClick={onRemove}
          className="text-xl md:text-2xl font-black hover:bg-black hover:text-white px-2 transition-colors ml-2"
        >
          ×
        </button>
      </div>

      <div className="border-b-2 border-black p-3 md:p-4 flex items-center gap-2 md:gap-3">
        <div className={`w-3 h-3 md:w-4 md:h-4 ${getStatusColor()}`} />
        <span className="font-bold uppercase text-xs md:text-sm">
          {getStatusText()}
        </span>
        {wsConnection?.lastUpdate && (
          <span className="text-xs font-mono ml-auto hidden sm:inline">
            {new Date(wsConnection.lastUpdate).toLocaleTimeString()}
          </span>
        )}
      </div>

      {data ? (
        <div>
          <div className="grid grid-cols-2 border-b-2 border-black">
            <div className="p-3 md:p-4 border-r-2 border-black">
              <p className="text-xs font-bold uppercase">UPTIME</p>
              <p className="text-sm md:text-lg font-mono font-bold">
                {formatUptime(data.uptime_days)}
              </p>
            </div>
            <div className="p-3 md:p-4">
              <p className="text-xs font-bold uppercase">LOAD</p>
              <p className="text-xs md:text-lg font-mono font-bold">
                {data.load.map(l => l.toFixed(2)).join(" ")}
              </p>
            </div>
          </div>

          <div className="p-3 md:p-4 border-b-2 border-black">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-bold uppercase">CPU</span>
              <span className="text-xs font-mono font-bold">{data.cpu.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-300 h-3 md:h-4 border-2 border-black">
              <div
                className="bg-black h-full transition-all"
                style={{ width: `${Math.min(data.cpu, 100)}%` }}
              />
            </div>
          </div>

          <div className="p-3 md:p-4 border-b-2 border-black">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-bold uppercase">MEMORY</span>
              <span className="text-xs font-mono font-bold">
                {data.mem_used} / {data.mem_total}
              </span>
            </div>
            <div className="w-full bg-gray-300 h-3 md:h-4 border-2 border-black">
              <div
                className="bg-black h-full transition-all"
                style={{
                  width: `${
                    (parseFloat(data.mem_used) / parseFloat(data.mem_total)) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="p-3 md:p-4 border-b-2 border-black">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-bold uppercase">SWAP</span>
              <span className="text-xs font-mono font-bold">
                {(data.swap_used_mib / 1024).toFixed(1)}G / {(data.swap_total_mib / 1024).toFixed(1)}G
              </span>
            </div>
            <div className="w-full bg-gray-300 h-3 md:h-4 border-2 border-black">
              <div
                className="bg-black h-full transition-all"
                style={{
                  width: `${(data.swap_used_mib / data.swap_total_mib) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="p-3 md:p-4 border-b-2 border-black">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-bold uppercase">DISK</span>
              <span className="text-xs font-mono font-bold">
                {data.disk_used_gib.toFixed(1)}G / {data.disk_total_gib.toFixed(1)}G
              </span>
            </div>
            <div className="w-full bg-gray-300 h-3 md:h-4 border-2 border-black">
              <div
                className="bg-black h-full transition-all"
                style={{
                  width: `${(data.disk_used_gib / data.disk_total_gib) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 border-b-2 border-black">
            <div className="p-3 md:p-4 border-r-2 border-black">
              <p className="text-xs font-bold uppercase mb-1 md:mb-2">NETWORK RATE</p>
              <p className="text-xs font-mono">
                ↓ {formatBytes(data.rx_rate)}/S
              </p>
              <p className="text-xs font-mono">
                ↑ {formatBytes(data.tx_rate)}/S
              </p>
            </div>
            <div className="p-3 md:p-4">
              <p className="text-xs font-bold uppercase mb-1 md:mb-2">NETWORK TOTAL</p>
              <p className="text-xs font-mono">
                ↓ {data.rx_total_gib.toFixed(2)}G
              </p>
              <p className="text-xs font-mono">
                ↑ {data.tx_total_gib.toFixed(2)}G
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="p-3 md:p-4 border-r-2 border-black">
              <p className="text-xs font-bold uppercase mb-1 md:mb-2">CONNECTIONS</p>
              <p className="text-xs font-mono">
                TCP: {data.tcp}
              </p>
              <p className="text-xs font-mono">
                UDP: {data.udp}
              </p>
            </div>
            <div className="p-3 md:p-4">
              <p className="text-xs font-bold uppercase mb-1 md:mb-2">SYSTEM</p>
              <p className="text-xs font-mono">
                PROC: {data.processes}
              </p>
              <p className="text-xs font-mono">
                THR: {data.threads}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 md:p-12 text-center">
          <p className="font-mono uppercase text-xs md:text-sm">
            {wsConnection?.status === "connecting" ? "CONNECTING..." : "NO DATA"}
          </p>
        </div>
      )}
    </div>
  );
}