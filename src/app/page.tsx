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
import VPSCardSkeleton from "@/components/VPSCardSkeleton";
import ImportExportModal from "@/components/ImportExportModal";
import { Settings, Plus, LogOut, Server, Loader2 } from "lucide-react";

export default function Home() {
  const { loggedIn, logout, isLoading } = useAuth();
  const router = useRouter();
  const [connections, setConnections] = useState<VPSConnection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const [isLoadingConnections, setIsLoadingConnections] = useState(true);
  const wsConnections = useWebSocketManager(connections);

  useEffect(() => {
    if (!isLoading && !loggedIn) {
      router.push("/login");
    }
  }, [loggedIn, router, isLoading]);

  // Load connections from the API once authenticated
  useEffect(() => {
    if (!isLoading && loggedIn) {
      setIsLoadingConnections(true);
      apiClient.connections
        .list()
        .then((list) => {
          setConnections(list);
          setIsLoadingConnections(false);
        })
        .catch((err) => {
          console.error("Failed to load connections", err);
          setIsLoadingConnections(false);
        });
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>
        
        <div className="min-h-screen flex items-center justify-center">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="w-20 h-20 mx-auto flex items-center justify-center">
                <Loader2 className="w-16 h-16 animate-spin text-purple-600" strokeWidth={3} />
              </div>
              <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
            </div>
          </motion.div>
        </div>
        
        <style jsx>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <motion.div 
        className="backdrop-blur-md bg-white/70 shadow-xl border-b border-white/20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <header>
              <motion.h1 
                className="text-3xl md:text-5xl font-black bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              >
                VPS Monitor
              </motion.h1>
              <motion.p 
                className="text-sm text-gray-600 mt-2 font-medium"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              >
                Real-time infrastructure monitoring
              </motion.p>
            </header>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <motion.button
                onClick={() => setIsImportExportModalOpen(true)}
                className="px-5 py-2.5 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-700 hover:bg-white hover:shadow-md transition-all flex items-center justify-center gap-2 font-medium"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.25, type: "spring", stiffness: 200 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-5 h-5" />
                Settings
              </motion.button>
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-medium flex items-center gap-2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3, type: "spring", stiffness: 200 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                Add VPS
              </motion.button>
              <motion.button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-white/80 backdrop-blur border border-gray-200 rounded-xl text-gray-700 hover:bg-white hover:shadow-md transition-all font-medium flex items-center gap-2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.35, type: "spring", stiffness: 200 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-4 h-4" />
                Log out
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="p-4 md:p-8">
        <motion.div 
          className="max-w-7xl mx-auto space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AnimatePresence mode="popLayout">
            {isLoadingConnections ? (
              // Show skeleton loaders while loading
              [...Array(3)].map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <VPSCardSkeleton />
                </motion.div>
              ))
            ) : (
              connections.map((connection, index) => (
                <motion.div
                  key={connection.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.08,
                    ease: "easeOut",
                    layout: { duration: 0.3, type: "spring", stiffness: 300, damping: 30 }
                  }}
                >
                  <VPSCard
                    connection={connection}
                    wsConnection={wsConnections[connection.id]}
                    onRemove={() => removeConnection(connection.id)}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
          
          {!isLoadingConnections && connections.length === 0 && (
            <motion.div 
              className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg p-16 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6">
                  <Server className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
                </div>
              </motion.div>
              <motion.p 
                className="text-gray-900 text-xl font-semibold mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                No servers connected
              </motion.p>
              <motion.p 
                className="text-gray-500 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                Add your first VPS to begin monitoring your infrastructure
              </motion.p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

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