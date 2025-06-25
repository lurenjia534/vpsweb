"use client";

import { useState, useEffect } from "react";
import { VPSConnection } from "@/types/vps";
import { useWebSocketManager } from "@/hooks/useWebSocketManager";
import AddVPSForm from "@/components/AddVPSForm";
import VPSCard from "@/components/VPSCard";

export default function Home() {
  const [connections, setConnections] = useState<VPSConnection[]>([]);
  const wsConnections = useWebSocketManager(connections);

  // Load connections from localStorage on mount
  useEffect(() => {
    const savedConnections = localStorage.getItem("vpsConnections");
    if (savedConnections) {
      setConnections(JSON.parse(savedConnections));
    }
  }, []);

  // Save connections to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("vpsConnections", JSON.stringify(connections));
  }, [connections]);

  const addConnection = (name: string, url: string) => {
    const newConnection: VPSConnection = {
      id: Date.now().toString(),
      name,
      url,
    };
    setConnections([...connections, newConnection]);
  };

  const removeConnection = (id: string) => {
    setConnections(connections.filter((conn) => conn.id !== id));
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            VPS Monitor
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time monitoring for your VPS instances
          </p>
        </header>

        <AddVPSForm onAdd={addConnection} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {connections.map((connection) => (
            <VPSCard
              key={connection.id}
              connection={connection}
              wsConnection={wsConnections[connection.id]}
              onRemove={() => removeConnection(connection.id)}
            />
          ))}
          
          {connections.length === 0 && (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No VPS connections yet. Add one to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}