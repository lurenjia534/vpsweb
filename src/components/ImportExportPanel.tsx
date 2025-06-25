"use client";

import { useState } from "react";
import Image from "next/image";

interface ImportExportPanelProps {
  onImport: (file: File) => Promise<boolean>;
  onExport: () => void;
}

export default function ImportExportPanel({ onImport, onExport }: ImportExportPanelProps) {
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const success = await onImport(file);
    if (!success) {
      setError("Failed to parse file");
    } else {
      setError("");
    }
  };

  return (
    <div className="bg-gray-100 border-4 border-black rounded-lg shadow-md overflow-hidden p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="flex-1">
          <p className="text-xs font-mono uppercase mb-2">
            NOTE: CONNECTIONS ARE STORED LOCALLY IN YOUR BROWSER
          </p>
          <p className="text-xs font-mono">INCOGNITO/PRIVATE WINDOWS HAVE SEPARATE STORAGE</p>
          {fileName && (
            <p className="text-xs font-mono mt-2">Selected: {fileName}</p>
          )}
          {error && (
            <p className="text-xs font-mono text-red-500 mt-1">{error}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onExport}
            aria-label="Export connections"
            title="Export connections"
            className="bg-black text-white font-bold uppercase px-4 py-2 border-2 border-black hover:bg-white hover:text-black transition-colors text-xs flex items-center"
          >
            <Image src="/file.svg" alt="" width={16} height={16} className="mr-2" />
            EXPORT
          </button>
          <label
            className="bg-white text-black font-bold uppercase px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors text-xs cursor-pointer flex items-center"
          >
            <Image src="/window.svg" alt="" width={16} height={16} className="mr-2" />
            IMPORT
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

