"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";

interface AddVPSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, url: string) => void;
}

export default function AddVPSModal({ isOpen, onClose, onAdd }: AddVPSModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim() && url.trim()) {
      onAdd(name.trim(), url.trim());
      setName("");
      setUrl("");
      onClose();
    }
  };

  const handleClose = () => {
    setName("");
    setUrl("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div 
            className="relative bg-white/60 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-md border border-white/20 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-6 flex items-center justify-between border-b border-white/20">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                Add VPS Connection
              </h2>
              <motion.button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-4">
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1, ease: "easeInOut" }}
              >
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Server Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Production Server"
                  className="w-full px-4 py-2.5 bg-white/50 backdrop-blur border border-gray-300/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all placeholder-gray-500 text-sm"
                  required
                  autoFocus
                />
              </motion.div>

              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2, ease: "easeInOut" }}
              >
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  WebSocket URL
                </label>
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="ws://127.0.0.1:8080/ws"
                  className="w-full px-4 py-2.5 bg-white/50 backdrop-blur border border-gray-300/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all font-mono text-xs placeholder-gray-500"
                  required
                />
                <p className="mt-1.5 text-xs text-gray-600">
                  Connect to your VPS monitoring probe endpoint.
                </p>
              </motion.div>

              <motion.div 
                className="flex gap-3 pt-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3, ease: "easeInOut" }}
              >
                <motion.button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 bg-white/50 backdrop-blur text-gray-800 font-semibold py-2.5 px-4 rounded-lg hover:bg-white/80 border border-gray-300/40 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="flex-1 bg-gray-800 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-900 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus size={16} />
                  Add Connection
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}