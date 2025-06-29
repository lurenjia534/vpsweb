"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileDown, FileUp, X, Loader2 } from "lucide-react";

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
      setTimeout(() => {
        handleClose();
      }, 500);
    }
    setIsImporting(false);
  };

  const handleExport = () => {
    onExport();
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
            className="relative w-full max-w-lg mx-auto bg-white/60 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-6 flex items-center justify-between border-b border-white/20">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                Import / Export Connections
              </h2>
              <motion.button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            <div className="p-6 space-y-6">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1, ease: "easeInOut" }}
                className="bg-white/30 border border-white/20 p-4 rounded-lg"
              >
                <p className="text-xs font-medium text-gray-700">
                  Note: Connections are stored in your account. Use export to back up or share them.
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2, ease: "easeInOut" }}
                className="space-y-4"
              >
                {/* Export */}
                <div className="p-4 bg-white/30 rounded-lg border border-white/20">
                  <h3 className="text-sm font-bold text-gray-800 mb-1">
                    Export Connections
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Save your current VPS connections to a JSON file.
                  </p>
                  <motion.button
                    onClick={handleExport}
                    className="w-full bg-gray-800 text-white font-semibold px-4 py-2.5 rounded-lg border border-transparent hover:bg-gray-900 hover:shadow-lg transition-all text-sm flex items-center justify-center"
                    whileTap={{ scale: 0.98 }}
                  >
                    <FileDown className="mr-2" size={16} />
                    Export to File
                  </motion.button>
                </div>

                {/* Import */}
                <div className="p-4 bg-white/30 rounded-lg border border-white/20">
                  <h3 className="text-sm font-bold text-gray-800 mb-1">
                    Import Connections
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Load connections from a previously exported JSON file.
                  </p>
                  {fileName && (
                    <motion.p
                      className="text-xs font-medium mb-2 text-green-700 bg-green-100/50 px-2 py-1 rounded"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Selected: {fileName}
                    </motion.p>
                  )}
                  {error && (
                    <motion.p
                      className="text-xs font-medium mb-2 text-red-700 bg-red-100/50 px-2 py-1 rounded"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {error}
                    </motion.p>
                  )}
                  <label
                    className={`w-full bg-white/80 text-gray-800 font-semibold px-4 py-2.5 rounded-lg border border-gray-300/50 hover:bg-white hover:shadow-lg transition-all text-sm cursor-pointer flex items-center justify-center ${
                      isImporting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isImporting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FileUp className="mr-2" size={16} />
                    )}
                    {isImporting ? 'Importing...' : 'Select File to Import'}
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
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}