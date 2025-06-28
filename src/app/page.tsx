"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VPSConnection } from "@/types/vps";
import { useWebSocketManager } from "@/hooks/useWebSocketManager";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import AddVPSModal from "@/components/AddVPSModal";
import VPSCard from "@/components/VPSCard";
import ImportExportModal from "@/components/ImportExportModal";

export default function Home() {
  const { loggedIn, logout, isLoading } = useAuth();
  const router = useRouter();
  const [connections, setConnections] = useState<VPSConnection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const wsConnections = useWebSocketManager(connections);

  useEffect(() => {
    if (!isLoading && !loggedIn) {
      router.push("/login");
    }
  }, [loggedIn, router, isLoading]);

  // Load connections from the API once authenticated
  useEffect(() => {
    if (!isLoading && loggedIn) {
      apiClient.connections
        .list()
        .then((list) => setConnections(list))
        .catch((err) => console.error("Failed to load connections", err));
    }
  }, [loggedIn, isLoading]);

  const addConnection = async (name: string, url: string) => {
    try {
      const newConnection = await apiClient.connections.create(name, url);
      setConnections((prev) => [newConnection, ...prev]);
    } catch (error) {
      console.error("Failed to add connection", error);
    }
  };

  const removeConnection = async (id: number | string) => {
    try {
      await apiClient.connections.delete(Number(id));
      setConnections((prev) => prev.filter((conn) => conn.id !== id));
    } catch (error) {
      console.error("Failed to remove connection", error);
    }
  };

  const exportConnections = () => {
    const data = JSON.stringify(connections, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vps-connections.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importConnections = async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      if (Array.isArray(imported)) {
        await Promise.all(
          imported.map((c: VPSConnection) =>
            apiClient.connections.create(c.name, c.url)
          )
        );
        const refreshed = await apiClient.connections.list();
        setConnections(refreshed);
        return true;
      }
    } catch (error) {
      console.error("Invalid file format", error);
    }
    return false;
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="font-mono uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white p-0">
      <motion.div 
        className="border-b-4 border-black p-4 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: "linear" }}
      >
        <header>
          <motion.h1 
            className="text-3xl md:text-6xl font-black uppercase tracking-tight"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1, ease: "linear" }}
          >
            VPS_MONITOR
          </motion.h1>
          <motion.p 
            className="text-xs md:text-sm font-mono uppercase mt-1 md:mt-2"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2, ease: "linear" }}
          >
            REAL-TIME MONITORING SYSTEM
          </motion.p>
        </header>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto">
          <motion.button
            onClick={() => setIsImportExportModalOpen(true)}
            className="bg-white text-black font-black uppercase px-4 md:px-6 py-3 md:py-4 border-4 border-black hover:bg-black hover:text-white transition-colors w-full md:w-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.25, ease: "linear" }}
            whileTap={{ scale: 0.95 }}
          >
            ⚙
          </motion.button>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white font-black uppercase px-4 md:px-8 py-3 md:py-4 border-4 border-black hover:bg-white hover:text-black transition-colors w-full md:w-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.3, ease: "linear" }}
            whileTap={{ scale: 0.95 }}
          >
            + ADD VPS
          </motion.button>
          <motion.button
            onClick={handleLogout}
            className="bg-white text-black font-black uppercase px-4 md:px-6 py-3 md:py-4 border-4 border-black hover:bg-black hover:text-white transition-colors w-full md:w-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.35, ease: "linear" }}
            whileTap={{ scale: 0.95 }}
          >
            LOG OUT
          </motion.button>
        </div>
      </motion.div>

      <div className="p-4 md:p-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4, ease: "linear" }}
        >
          <AnimatePresence mode="popLayout">
            {connections.map((connection, index) => (
              <motion.div
                key={connection.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.2, 
                  delay: index * 0.05,
                  ease: "linear",
                  layout: { duration: 0.2, ease: "linear" }
                }}
              >
                <VPSCard
                  connection={connection}
                  wsConnection={wsConnections[connection.id]}
                  onRemove={() => removeConnection(connection.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {connections.length === 0 && (
            <motion.div 
              className="col-span-full border-4 border-dashed border-black p-8 md:p-16 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "linear" }}
            >
              <p className="font-mono uppercase text-sm md:text-lg">
                NO VPS CONNECTIONS DETECTED
              </p>
              <p className="font-mono text-xs md:text-sm mt-2">
                ADD CONNECTION TO BEGIN MONITORING
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <AddVPSModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addConnection}
      />

      <ImportExportModal
        isOpen={isImportExportModalOpen}
        onClose={() => setIsImportExportModalOpen(false)}
        onImport={importConnections}
        onExport={exportConnections}
      />
    </main>
  );
}