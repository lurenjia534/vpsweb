"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div 
            className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md border border-white/20 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Gradient decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />
            
            <div className="p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Add VPS Connection
              </h2>
              <motion.button
                onClick={handleClose}
                className="w-10 h-10 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 backdrop-blur flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all"
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Server Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Production Server"
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-400"
                  required
                  autoFocus
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <label
                  htmlFor="url"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  WebSocket URL
                </label>
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="ws://127.0.0.1:8080/ws"
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono text-sm placeholder-gray-400"
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  Connect to your VPS monitoring probe endpoint
                </p>
              </motion.div>

              <motion.div 
                className="flex gap-3 pt-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <motion.button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add Connection
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 bg-gray-100/80 backdrop-blur text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200/80 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}