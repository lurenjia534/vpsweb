export interface VPSData {
  os_name: string;
  uptime_days: number;
  load: [number, number, number];
  cpu: number;
  mem_used: string;
  mem_total: string;
  disk_used_gib: number;
  disk_total_gib: number;
  rx_rate: number;
  tx_rate: number;
  rx_total_gib: number;
  tx_total_gib: number;
  swap_used_mib: number;
  swap_total_mib: number;
  tcp: number;
  udp: number;
  processes: number;
  threads: number;
}

export interface VPSConnection {
  id: number | string;
  name: string;
  url: string;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WebSocketConnection {
  ws: WebSocket | null;
  status: "connecting" | "connected" | "disconnected" | "error";
  data: VPSData | null;
  lastUpdate: Date | null;
}