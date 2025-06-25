"use client";

import { useState } from "react";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black opacity-75"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white border-4 border-black w-full max-w-md mx-4">
        <div className="border-b-4 border-black p-6 flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase tracking-tight">
            ADD VPS CONNECTION
          </h2>
          <button
            onClick={handleClose}
            className="text-3xl font-black hover:bg-black hover:text-white px-2 transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
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
              className="w-full px-4 py-3 border-2 border-black font-mono text-sm focus:outline-none focus:border-4"
              required
              autoFocus
            />
          </div>

          <div>
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
              className="w-full px-4 py-3 border-2 border-black font-mono text-sm focus:outline-none focus:border-4"
              required
            />
            <p className="mt-2 text-xs font-mono uppercase">
              ENTER THE WEBSOCKET URL OF YOUR VPS PROBE
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="submit"
              className="bg-black text-white font-bold uppercase py-3 px-6 border-2 border-black hover:bg-white hover:text-black transition-colors"
            >
              ADD CONNECTION
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="bg-white text-black font-bold uppercase py-3 px-6 border-2 border-black hover:bg-black hover:text-white transition-colors"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}