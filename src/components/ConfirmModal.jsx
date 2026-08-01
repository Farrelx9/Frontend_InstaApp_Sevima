import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  confirmColor = "bg-[#ed4956]", // Default merah untuk delete
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-gradient-to-b from-[#1e1e1e] to-[#161616] border border-[#2a2a2a] rounded-3xl p-8 shadow-2xl shadow-black/50 relative overflow-hidden flex flex-col justify-center"
        >
          {/* Glow Effect Background */}
          <div
            className={`absolute -top-16 -right-16 w-40 h-40 ${confirmColor}/10 rounded-full blur-3xl pointer-events-none`}
          />

          <div className="flex flex-col items-center text-center relative">
            <div className="relative w-16 h-16 mb-6 shrink-0">
              <motion.div
                className={`absolute inset-0 rounded-full ${confirmColor}/20`}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div
                className={`relative w-16 h-16 rounded-full ${confirmColor}/10 border border-${confirmColor.replace("bg-", "")}/20 flex items-center justify-center`}
              >
                <AlertCircle
                  size={26}
                  className={confirmColor.replace("bg-", "text-")}
                  strokeWidth={2}
                />
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 shrink-0">
              {title}
            </h3>
            <p className="text-sm text-[#a8a8a8] leading-relaxed max-w-[280px] mx-auto mb-8">
              {description}
            </p>
          </div>

          <div className="flex gap-3 px-1">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 rounded-2xl bg-[#262626] text-white font-semibold text-sm hover:bg-[#333] active:scale-[0.98] transition-all duration-150 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-3 rounded-2xl ${confirmColor} text-white font-semibold text-sm hover:brightness-110 active:scale-[0.98] transition-all duration-150 shadow-lg ${confirmColor}/20 disabled:opacity-50`}
            >
              {isLoading ? "Processing..." : confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
