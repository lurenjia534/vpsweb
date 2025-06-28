"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { loggedIn, login, register, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  useEffect(() => {
    if (!isLoading && loggedIn) {
      router.push("/");
    }
  }, [loggedIn, router, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    const result = isRegisterMode 
      ? await register(username, password)
      : await login(username, password);
    
    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "OPERATION_FAILED");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono uppercase">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 15px),
                           repeating-linear-gradient(-45deg, #000 0, #000 1px, transparent 1px, transparent 15px)`
        }}></div>
      </div>

      {/* Header */}
      <motion.div 
        className="absolute top-0 left-0 right-0 border-b-8 border-black p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
          VPS_MONITOR
        </h1>
        <p className="text-xs md:text-sm font-mono uppercase mt-2">
          CLOUD_SYNC_ENABLED
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4 pt-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          {/* Static Decorative Elements */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-black" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-black" />

          <form
            onSubmit={handleSubmit}
            className="border-8 border-black bg-white p-8 md:p-12 max-w-md w-full space-y-6 relative"
          >
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-black uppercase">
                {isRegisterMode ? 'CREATE' : 'ACCESS'}
              </h2>
              <div className="h-2 bg-black w-20"></div>
            </motion.div>

            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="USERNAME"
                  required
                  className="border-4 border-black p-4 w-full font-mono uppercase placeholder:text-gray-500 focus:outline-none focus:bg-yellow-100 transition-colors"
                  disabled={isSubmitting}
                />
                <div className="absolute -top-2 -left-2 text-xs font-black uppercase bg-white px-2">
                  USER_ID
                </div>
              </div>

              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={isRegisterMode ? 6 : undefined}
                  className="border-4 border-black p-4 w-full font-mono placeholder:text-gray-500 focus:outline-none focus:bg-yellow-100 transition-colors"
                  disabled={isSubmitting}
                />
                <div className="absolute -top-2 -left-2 text-xs font-black uppercase bg-white px-2">
                  PASS_KEY
                </div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-4 border-red-600 bg-red-100 p-3"
                >
                  <p className="text-red-600 font-mono uppercase text-sm">
                    ⚠ {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className={`relative w-full px-6 py-4 font-black uppercase text-lg border-4 border-black transition-all ${
                isSubmitting 
                  ? 'bg-gray-300 text-gray-600' 
                  : 'bg-black text-white hover:bg-white hover:text-black active:translate-x-1 active:translate-y-1'
              }`}
              disabled={isSubmitting}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {isSubmitting ? (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {isRegisterMode ? 'CREATING...' : 'AUTHENTICATING...'}
                </motion.span>
              ) : (
                isRegisterMode ? 'CREATE ACCOUNT →' : 'AUTHORIZE →'
              )}
            </motion.button>

            <motion.div 
              className="text-center space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setError("");
                }}
                className="text-xs font-mono uppercase text-gray-600 hover:text-black transition-colors"
              >
                {isRegisterMode ? '← BACK TO LOGIN' : 'CREATE NEW ACCOUNT →'}
              </button>
              <p className="text-xs font-mono uppercase text-gray-400">
                SECURE_CLOUD_STORAGE
              </p>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
