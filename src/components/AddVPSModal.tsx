"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
          {/* Overlay */}
          <motion.div 
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "linear" }}
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div 
            className="relative bg-white border-4 border-black w-full h-full md:h-auto md:max-w-md md:mx-4 flex flex-col"
            initial={{ scale: 0, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 5 }}
            transition={{ duration: 0.2, ease: "linear" }}
          >
            <div className="border-b-4 border-black p-4 md:p-6 flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                ADD VPS CONNECTION
              </h2>
              <motion.button
                onClick={handleClose}
                className="text-2xl md:text-3xl font-black hover:bg-black hover:text-white px-2 transition-colors"
                whileTap={{ scale: 0.8 }}
                transition={{ duration: 0.1, ease: "linear" }}
              >
                ×
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6 flex-1 md:flex-initial overflow-y-auto">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1, ease: "linear" }}
              >
                <label
                  htmlFor="name"
                  className="block text-sm font-bold uppercase tracking-wide mb-2"
                >
                  VPS NAME
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="SERVER_001"
                  className="w-full px-3 md:px-4 py-3 border-2 border-black font-mono text-sm focus:outline-none focus:border-4"
                  required
                  autoFocus
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.2, ease: "linear" }}
              >
                <label
                  htmlFor="url"
                  className="block text-sm font-bold uppercase tracking-wide mb-2"
                >
                  WEBSOCKET URL
                </label>
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="ws://127.0.0.1:8080/ws"
                  className="w-full px-3 md:px-4 py-3 border-2 border-black font-mono text-sm focus:outline-none focus:border-4"
                  required
                />
                <p className="mt-2 text-xs font-mono uppercase">
                  ENTER THE WEBSOCKET URL OF YOUR VPS PROBE
                </p>
              </motion.div>

              <motion.div 
                className="grid grid-cols-2 gap-3 md:gap-4 pt-4 md:pt-0"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.3, ease: "linear" }}
              >
                <motion.button
                  type="submit"
                  className="bg-black text-white font-bold uppercase py-3 px-4 md:px-6 border-2 border-black hover:bg-white hover:text-black transition-colors text-sm md:text-base"
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1, ease: "linear" }}
                >
                  ADD
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleClose}
                  className="bg-white text-black font-bold uppercase py-3 px-4 md:px-6 border-2 border-black hover:bg-black hover:text-white transition-colors text-sm md:text-base"
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1, ease: "linear" }}
                >
                  CANCEL
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}