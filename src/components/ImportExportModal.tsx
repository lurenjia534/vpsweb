"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileDown, FileUp } from "lucide-react";

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<boolean>;
  onExport: () => void;
}

export default function ImportExportModal({ 
  isOpen, 
  onClose, 
  onImport, 
  onExport 
}: ImportExportModalProps) {
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setFileName(file.name);
    setError("");
    
    const success = await onImport(file);
    if (!success) {
      setError("Failed to parse file. Please ensure it's a valid JSON file.");
    } else {
      setError("");
      // Close modal after successful import
      setTimeout(() => {
        handleClose();
      }, 500);
    }
    setIsImporting(false);
  };

  const handleExport = () => {
    onExport();
    // Close modal after export
    setTimeout(() => {
      handleClose();
    }, 500);
  };

  const handleClose = () => {
    setFileName("");
    setError("");
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
            className="relative bg-white border-4 border-black w-full h-full md:h-auto md:max-w-lg md:mx-4 flex flex-col"
            initial={{ scale: 0, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 5 }}
            transition={{ duration: 0.2, ease: "linear" }}
          >
            <div className="border-b-4 border-black p-4 md:p-6 flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                IMPORT/EXPORT CONNECTIONS
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

            <div className="p-4 md:p-6 space-y-4 md:space-y-6 flex-1 md:flex-initial overflow-y-auto">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1, ease: "linear" }}
                className="bg-gray-100 border-2 border-black p-4 rounded"
              >
                <p className="text-xs font-mono uppercase mb-2">
                  ⚠ NOTE: CONNECTIONS ARE STORED LOCALLY IN YOUR BROWSER
                </p>
                <p className="text-xs font-mono">
                  INCOGNITO/PRIVATE WINDOWS HAVE SEPARATE STORAGE
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.2, ease: "linear" }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide mb-3">
                    EXPORT CONNECTIONS
                  </h3>
                  <p className="text-xs font-mono mb-3">
                    Save your current VPS connections to a JSON file
                  </p>
                  <motion.button
                    onClick={handleExport}
                    className="bg-black text-white font-bold uppercase px-6 py-3 border-2 border-black hover:bg-white hover:text-black transition-colors text-sm flex items-center justify-center w-full"
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1, ease: "linear" }}
                  >
                    <FileDown className="mr-2" size={16} />
                    EXPORT TO FILE
                  </motion.button>
                </div>

                <div className="border-t-2 border-black pt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide mb-3">
                    IMPORT CONNECTIONS
                  </h3>
                  <p className="text-xs font-mono mb-3">
                    Load VPS connections from a previously exported JSON file
                  </p>
                  {fileName && (
                    <motion.p 
                      className="text-xs font-mono mb-2 text-green-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Selected: {fileName}
                    </motion.p>
                  )}
                  {error && (
                    <motion.p 
                      className="text-xs font-mono mb-2 text-red-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {error}
                    </motion.p>
                  )}
                  <label
                    className={`bg-white text-black font-bold uppercase px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors text-sm cursor-pointer flex items-center justify-center w-full ${
                      isImporting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <FileUp className="mr-2" size={16} />
                    {isImporting ? 'IMPORTING...' : 'SELECT FILE TO IMPORT'}
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isImporting}
                    />
                  </label>
                </div>
              </motion.div>

              <motion.div 
                className="pt-4 md:pt-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.3, ease: "linear" }}
              >
                <motion.button
                  type="button"
                  onClick={handleClose}
                  className="bg-white text-black font-bold uppercase py-3 px-6 border-2 border-black hover:bg-black hover:text-white transition-colors text-sm md:text-base w-full"
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1, ease: "linear" }}
                >
                  CLOSE
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}