"use client";

import { useState, useEffect } from "react";
import { VPSConnection } from "@/types/vps";
import { useWebSocketManager } from "@/hooks/useWebSocketManager";
import AddVPSModal from "@/components/AddVPSModal";
import VPSCard from "@/components/VPSCard";

export default function Home() {
  const [connections, setConnections] = useState<VPSConnection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <main className="min-h-screen bg-white p-0">
      <div className="border-b-4 border-black p-8 flex items-center justify-between">
        <header>
          <h1 className="text-6xl font-black uppercase tracking-tight">
            VPS_MONITOR
          </h1>
          <p className="text-sm font-mono uppercase mt-2">
            REAL-TIME MONITORING SYSTEM FOR YOUR VPS INSTANCES
          </p>
        </header>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white font-black uppercase px-8 py-4 border-4 border-black hover:bg-white hover:text-black transition-colors"
        >
          + ADD VPS
        </button>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {connections.map((connection) => (
            <VPSCard
              key={connection.id}
              connection={connection}
              wsConnection={wsConnections[connection.id]}
              onRemove={() => removeConnection(connection.id)}
            />
          ))}
          
          {connections.length === 0 && (
            <div className="col-span-full border-4 border-dashed border-black p-16 text-center">
              <p className="font-mono uppercase text-lg">
                NO VPS CONNECTIONS DETECTED
              </p>
              <p className="font-mono text-sm mt-2">
                ADD CONNECTION TO BEGIN MONITORING
              </p>
            </div>
          )}
        </div>
      </div>

      <AddVPSModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addConnection}
      />
    </main>
  );
}