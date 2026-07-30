import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const STORIES = [
  { id: 1, name: "Alex",  grad: "from-yellow-400 via-pink-500 to-purple-600", emoji: "⚡" },
  { id: 2, name: "Maya",  grad: "from-pink-500 via-rose-500 to-purple-500",   emoji: "🎨" },
  { id: 3, name: "Josh",  grad: "from-orange-400 via-red-500 to-pink-500",    emoji: "🚀" },
  { id: 4, name: "Sari",  grad: "from-teal-400 via-blue-500 to-indigo-600",   emoji: "🌴" },
  { id: 5, name: "Reza",  grad: "from-purple-500 via-indigo-500 to-blue-600", emoji: "🎧" },
  { id: 6, name: "Tina",  grad: "from-green-400 via-cyan-500 to-blue-500",    emoji: "📸" },
  { id: 7, name: "Budi",  grad: "from-yellow-500 via-orange-500 to-red-500",  emoji: "☕" },
  { id: 8, name: "Lisa",  grad: "from-pink-400 via-rose-500 to-red-400",      emoji: "✨" },
];

export default function StoriesBar() {
  const [active, setActive] = useState(null);

  return (
    <>
      <div className="border border-[#262626] rounded-2xl bg-black py-4 px-3 overflow-hidden">
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
          {/* Your Story */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <div className="w-[60px] h-[60px] sm:w-[66px] sm:h-[66px] rounded-full bg-[#1a1a1a] border-2 border-dashed border-[#444] hover:border-white/40 flex items-center justify-center transition-colors duration-200">
              <span className="text-2xl text-[#737373] hover:text-white transition-colors leading-none">+</span>
            </div>
            <span className="text-[11px] text-[#737373] w-16 text-center truncate">Your story</span>
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
              <div className={`p-[2.5px] rounded-full bg-gradient-to-tr ${s.grad}`}>
                <div className="bg-black rounded-full p-[2px]">
                  <div className={`w-[55px] h-[55px] sm:w-[60px] sm:h-[60px] rounded-full bg-gradient-to-br ${s.grad} flex items-center justify-center`}>
                    <span className="text-[22px] sm:text-2xl font-bold text-white">{s.name[0]}</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-[#f5f5f5] w-16 text-center truncate">{s.name}</span>
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
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.88, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.88, y: 20 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[380px] aspect-[9/16] bg-[#111] rounded-2xl border border-[#262626] overflow-hidden flex flex-col p-5"
            >
              {/* Progress */}
              <div className="w-full h-[3px] bg-white/20 rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  onAnimationComplete={() => setActive(null)}
                  className="h-full bg-white rounded-full"
                />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${active.grad} flex items-center justify-center text-sm font-bold text-white`}>
                    {active.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{active.name}</p>
                    <p className="text-[10px] text-[#737373]">Just now</p>
                  </div>
                </div>
                <button onClick={() => setActive(null)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                <span className="text-7xl">{active.emoji}</span>
                <p className="text-lg font-bold text-white">{active.name}&apos;s Story</p>
              </div>

              <p className="text-center text-xs text-[#737373] mt-4">Tap anywhere to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
