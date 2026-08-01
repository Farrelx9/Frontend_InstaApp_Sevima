import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const STORIES = [
  {
    id: 1,
    name: "Alex",
    grad: "from-yellow-400 via-pink-500 to-purple-600",
    emoji: "⚡",
  },
  {
    id: 2,
    name: "Maya",
    grad: "from-pink-500 via-rose-500 to-purple-500",
    emoji: "🎨",
  },
  {
    id: 3,
    name: "Josh",
    grad: "from-orange-400 via-red-500 to-pink-500",
    emoji: "",
  },
  {
    id: 4,
    name: "Sari",
    grad: "from-teal-400 via-blue-500 to-indigo-600",
    emoji: "🌴",
  },
  {
    id: 5,
    name: "Reza",
    grad: "from-purple-500 via-indigo-500 to-blue-600",
    emoji: "🎧",
  },
  {
    id: 6,
    name: "Tina",
    grad: "from-green-400 via-cyan-500 to-blue-500",
    emoji: "📸",
  },
  {
    id: 7,
    name: "Budi",
    grad: "from-yellow-500 via-orange-500 to-red-500",
    emoji: "☕",
  },
  {
    id: 8,
    name: "Lisa",
    grad: "from-pink-400 via-rose-500 to-red-400",
    emoji: "✨",
  },
];

export default function StoriesBar() {
  const [active, setActive] = useState(null);

  return (
    <>
      {/* PERBAIKAN: px-2 sm:px-3 agar stories lebih lebar di mobile/tablet */}
      <div className="border border-[#262626] rounded-2xl bg-black py-4 px-2 sm:px-3 overflow-hidden">
        <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-1">
          {/* Your Story */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer"
          >
            {/* Ukuran responsive: w-14 di mobile/tablet, w-16 di desktop */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1a1a1a] border-2 border-dashed border-[#444] hover:border-white/40 flex items-center justify-center transition-colors duration-200">
              <span className="text-2xl text-[#737373] hover:text-white transition-colors leading-none">
                +
              </span>
            </div>
            <span className="text-[11px] text-[#737373] w-14 sm:w-16 text-center truncate">
              Your story
            </span>
          </motion.button>

          {/* Friends Stories */}
          {STORIES.map((s, i) => (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setActive(s)}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <div
                className={`p-[2.5px] rounded-full bg-gradient-to-tr ${s.grad}`}
              >
                <div className="bg-black rounded-full p-[2px]">
                  {/* Avatar responsive */}
                  <div
                    className={`w-[51px] h-[51px] sm:w-[56px] sm:h-[56px] rounded-full bg-gradient-to-br ${s.grad} flex items-center justify-center`}
                  >
                    <span className="text-lg sm:text-xl font-bold text-white">
                      {s.name[0]}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-[#f5f5f5] w-14 sm:w-16 text-center truncate">
                {s.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            // PERBAIKAN: p-4 sm:p-6 agar modal tidak mepet di HP kecil
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              // Aspect ratio 9/16 dengan max-width agar rapi di tablet landscape
              className="relative w-full max-w-[400px] aspect-[9/16] max-h-[85vh] bg-[#111] rounded-2xl border border-[#262626] overflow-hidden flex flex-col"
            >
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 p-3 z-10">
                <div className="w-full h-[3px] bg-white/20 rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                    onAnimationComplete={() => setActive(null)}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>

              {/* Header */}
              <div className="absolute top-5 left-3 right-3 z-10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${active.grad} flex items-center justify-center text-xs font-bold text-white ring-2 ring-black/50`}
                  >
                    {active.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white drop-shadow-md">
                      {active.name}
                    </p>
                    <p className="text-[10px] text-white/70 drop-shadow-md">
                      Just now
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActive(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-6">
                <span className="text-8xl drop-shadow-2xl animate-bounce-slow">
                  {active.emoji}
                </span>
                <p className="text-xl font-bold text-white">
                  {active.name}'s Story
                </p>
              </div>

              <p className="absolute bottom-6 w-full text-center text-xs text-white/50">
                Tap anywhere to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
