"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { VPSConnection, WebSocketConnection, VPSData } from "@/types/vps";

export function useWebSocketManager(connections: VPSConnection[]) {
  const [wsConnections, setWsConnections] = useState<Record<string, WebSocketConnection>>({});
  const wsRefs = useRef<Record<string, WebSocket>>({});

  const createWebSocketConnection = useCallback(
    (connection: VPSConnection) => {
      const ws = new WebSocket(connection.url);
      wsRefs.current[connection.id] = ws;

      // Update connection status
      setWsConnections((prev) => ({
        ...prev,
        [connection.id]: {
          ws: null,
          status: "connecting",
          data: null,
          lastUpdate: null,
        },
      }));

      ws.onopen = () => {
        setWsConnections((prev) => ({
          ...prev,
          [connection.id]: {
            ...prev[connection.id],
            ws,
            status: "connected",
          },
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data: VPSData = JSON.parse(event.data);
          setWsConnections((prev) => ({
            ...prev,
            [connection.id]: {
              ...prev[connection.id],
              data,
              lastUpdate: new Date(),
            },
          }));
        } catch (error) {
          console.error("Failed to parse WebSocket data:", error);
        }
      };

      ws.onerror = () => {
        setWsConnections((prev) => ({
          ...prev,
          [connection.id]: {
            ...prev[connection.id],
            status: "error",
          },
        }));
      };

      ws.onclose = () => {
        setWsConnections((prev) => ({
          ...prev,
          [connection.id]: {
            ...prev[connection.id],
            ws: null,
            status: "disconnected",
          },
        }));

        // Attempt to reconnect after 5 seconds
        if (connections.find((conn) => conn.id === connection.id)) {
          setTimeout(() => {
            if (wsRefs.current[connection.id]?.readyState === WebSocket.CLOSED) {
              createWebSocketConnection(connection);
            }
          }, 5000);
        }
      };
    },
    [connections]
  );

  useEffect(() => {
    // Clean up removed connections
    Object.keys(wsRefs.current).forEach((id) => {
      if (!connections.find((conn) => conn.id === id)) {
        if (wsRefs.current[id]) {
          wsRefs.current[id].close();
          delete wsRefs.current[id];
        }
        setWsConnections((prev) => {
          const newConnections = { ...prev };
          delete newConnections[id];
          return newConnections;
        });
      }
    });

    // Create new connections
    connections.forEach((connection) => {
      if (!wsRefs.current[connection.id]) {
        createWebSocketConnection(connection);
      }
    });

    // Cleanup on unmount
    return () => {
      Object.values(wsRefs.current).forEach((ws) => ws.close());
      wsRefs.current = {};
    };
  }, [connections, createWebSocketConnection]);

  return wsConnections;
}