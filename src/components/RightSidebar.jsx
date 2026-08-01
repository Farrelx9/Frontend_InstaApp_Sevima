import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";

const SUGGESTIONS = [
  { id: 1, name: "fanus andrianto", sub: "Followed by adaydwi + 12 more" },
  { id: 2, name: "Rizky Raphoksi", sub: "Followed by rizalmp + 13 more" },
  { id: 3, name: "ronna", sub: "Followed by adaydwi + 12 more" },
  { id: 4, name: "salsabilaa pw", sub: "Followed by ekatahirapr + 7" },
  { id: 5, name: "dr. Christie", sub: "Followed by sandradewi_ch" },
];

export default function RightSidebar({ user }) {
  const [following, setFollowing] = useState({});
  if (!user) return null;

  const username = user.email
    ? user.email.split("@")[0]
    : user.name.toLowerCase().replace(/\s+/g, "");

  return (
    // PERBAIKAN: Gunakan w-full max-w-[340px] agar tidak overflow di tablet kecil
    // Sticky top disesuaikan agar tidak menempel ke atas saat scroll
    <aside className="w-full max-w-[340px] lg:w-[320px] shrink-0 pt-2 space-y-6 sticky top-6 select-none">
      {/* ── Current User ── */}
      <div className="flex items-center justify-between">
        <Link to="/profile" className="flex items-center gap-3 group min-w-0">
          <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shrink-0">
            <div className="bg-black rounded-full p-[1.5px]">
              <Avatar name={user.name} size="md" />
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white group-hover:text-[#a8a8a8] transition-colors truncate">
              {username}
            </p>
            <p className="text-xs text-[#737373] truncate">{user.name}</p>
          </div>
        </Link>
        <Link
          to="/profile"
          className="text-xs font-semibold text-[#0095f6] hover:text-white transition-colors shrink-0 ml-2"
        >
          Switch
        </Link>
      </div>

      {/* ── Suggested For You ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
            Suggested for you
          </span>
          <button className="text-xs font-bold text-white hover:text-[#a8a8a8] transition-colors">
            See all
          </button>
        </div>

        <motion.div
          className="space-y-3.5"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        >
          {SUGGESTIONS.map((s) => (
            <motion.div
              key={s.id}
              variants={{
                hidden: { opacity: 0, x: 8 },
                show: { opacity: 1, x: 0 },
              }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Avatar name={s.name} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate hover:underline cursor-pointer">
                    {s.name}
                  </p>
                  <p className="text-[11px] text-[#737373] truncate">{s.sub}</p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setFollowing((p) => ({ ...p, [s.id]: !p[s.id] }))
                }
                // PERBAIKAN: Padding tombol diperbesar sedikit agar mudah ditekan di mobile
                className={`ml-3 px-3 py-1.5 text-xs font-bold shrink-0 transition-colors duration-150 rounded-lg ${
                  following[s.id]
                    ? "text-[#737373] hover:text-[#ed4956]"
                    : "text-[#0095f6] hover:text-white hover:bg-white/5"
                }`}
              >
                {following[s.id] ? "Following" : "Follow"}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Footer Links ── */}
      <div className="space-y-3 pt-2 border-t border-[#1a1a1a]">
        <p className="text-[11px] text-[#737373] leading-relaxed flex flex-wrap gap-x-1">
          {[
            "About",
            "Help",
            "Press",
            "API",
            "Jobs",
            "Privacy",
            "Terms",
            "Locations",
            "Language",
            "Meta Verified",
          ].map((item, i, arr) => (
            <span key={item}>
              {item}
              {i < arr.length - 1 && " · "}
            </span>
          ))}
        </p>
        <p className="text-[11px] text-[#737373]">© 2026 Instagram from Meta</p>
      </div>
    </aside>
  );
}
