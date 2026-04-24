import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BookingSuccessModal = ({ isOpen, ride, onClose, onViewRides }) => {
  return (
    <AnimatePresence>
      {isOpen && ride && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-900/60 dark:bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-zinc-200 dark:border-zinc-800 text-center relative overflow-hidden"
          >
            {/* Decorative background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Animated Checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="w-20 h-20 mx-auto bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-[1.5rem] flex items-center justify-center mb-6 rotate-3"
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">
              Ride Confirmed!
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Your <span className="font-bold text-zinc-900 dark:text-white">{ride.vehicleName}</span> is ready for you.
            </p>

            {/* JSON Data Display (Trip Details) */}
            <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl p-4 space-y-3 text-left mb-8 border border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-bold uppercase tracking-wider">Trip ID</span>
                <span className="font-mono text-zinc-900 dark:text-white font-bold">{ride.id}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-bold uppercase tracking-wider">Total Fare</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">{ride.fare}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-2xl font-black text-sm transition-colors"
              >
                Close
              </button>
              <button
                onClick={onViewRides}
                className="flex-1 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                My Rides
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingSuccessModal;