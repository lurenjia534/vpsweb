"use client";

import { useState } from "react";

interface AddVPSFormProps {
  onAdd: (name: string, url: string) => void;
}

export default function AddVPSForm({ onAdd }: AddVPSFormProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim() && url.trim()) {
      onAdd(name.trim(), url.trim());
      setName("");
      setUrl("");
      setIsExpanded(false);
    }
  };

  return (
    <div className="bg-white border-4 border-black p-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left p-6 border-b-4 border-black hover:bg-gray-100 transition-colors"
      >
        <h2 className="text-2xl font-black uppercase tracking-tight">
          ADD VPS CONNECTION
        </h2>
        <span className="text-3xl font-black">
          {isExpanded ? "−" : "+"}
        </span>
      </button>

      {isExpanded && (
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
              onClick={() => {
                setIsExpanded(false);
                setName("");
                setUrl("");
              }}
              className="bg-white text-black font-bold uppercase py-3 px-6 border-2 border-black hover:bg-black hover:text-white transition-colors"
            >
              CANCEL
            </button>
          </div>
        </form>
      )}
    </div>
  );
}