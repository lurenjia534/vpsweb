"use client";

import { motion } from "framer-motion";

export default function VPSCardSkeleton() {
  return (
    <motion.div 
      className="relative bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Status gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
      
      <div className="p-6">
        <div className="flex items-center justify-between gap-6">
          {/* Status and Name */}
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse" />
            <div>
              <div className="h-6 w-32 bg-gray-200 rounded-lg animate-pulse mb-2" />
              <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="h-3 w-8 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="text-center">
              <div className="h-3 w-8 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="text-center">
              <div className="h-3 w-10 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="text-center hidden lg:block">
              <div className="h-3 w-12 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1" />
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />
            <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}