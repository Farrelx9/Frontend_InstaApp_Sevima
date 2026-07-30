import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPosts } from "../services/api";
import PostCard from "../components/PostCard";
import StoriesBar from "../components/StoriesBar";
import RightSidebar from "../components/RightSidebar";
import { useAuth } from "../contexts/AuthContext";
import { Loader2 } from "lucide-react";

const feedVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.18 } },
};

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let ignore = false;
    getPosts(1)
      .then((res) => {
        if (ignore) return;
        const d = res.data;
        setPosts(d.data || []);
        setLastPage(d.last_page || 1);
      })
      .catch((e) => console.error(e))
      .finally(() => {
        if (!ignore) {
          setInitialLoad(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const loadMore = async () => {
    const next = page + 1;
    setLoading(true);
    try {
      const res = await getPosts(next);
      const d = res.data;
      setPosts((p) => [...p, ...(d.data || [])]);
      setPage(next);
      setLastPage(d.last_page || 1);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => setPosts((p) => p.filter((post) => post.id !== id));

  /* ─── Skeleton Loading ─── */
  if (initialLoad) {
    return (
      <div className="w-full flex justify-center pt-2">
        <div className="flex items-start justify-center gap-8 w-full max-w-[985px]">
          <div className="w-full max-w-[630px] shrink-0 space-y-4">
            <div className="flex gap-4 border border-[#262626] rounded-2xl bg-black p-4 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                  <div className="w-14 h-14 rounded-full bg-white/10" />
                  <div className="w-10 h-2 rounded bg-white/10" />
                </div>
              ))}
            </div>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse border border-[#262626] rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <div className="w-9 h-9 rounded-full bg-white/10 shrink-0" />
                  <div className="h-3 w-32 bg-white/10 rounded" />
                </div>
                <div className="w-full aspect-[4/3] bg-white/5" />
              </div>
            ))}
          </div>
          <div className="hidden xl:block shrink-0 w-[320px] animate-pulse space-y-4">
            <div className="h-12 bg-white/10 rounded-xl" />
            <div className="h-40 bg-white/5 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    /**
     * Perfect Viewport Centering & Flexible Responsive Feed Layout:
     * - Feed Column: max-w-[630px] centered
     * - Right Sidebar: w-[320px] right next to feed (xl+)
     * - Combined Unit: max-w-[982px] perfectly centered in viewport!
     */
    <div className="w-full flex justify-center">
      <div className="flex items-start justify-center gap-8 w-full max-w-[985px]">
        {/* ── FEED COLUMN (Max-width 630px) ── */}
        <div className="w-full max-w-[630px] shrink-0 min-w-0">
          {/* Stories */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-4"
          >
            <StoriesBar />
          </motion.div>

          {/* Posts Feed */}
          <motion.div
            variants={feedVariants}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-[#262626] rounded-2xl p-16 text-center bg-black"
              >
                <p className="text-4xl mb-3">📷</p>
                <p className="text-white font-bold text-base">No posts yet</p>
                <p className="text-[#737373] text-sm mt-1">
                  Start following people to see their posts here.
                </p>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {posts.map((post) => (
                  <motion.div
                    key={post.id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  >
                    <PostCard
                      post={post}
                      currentUser={user}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </motion.div>

          {/* Load More */}
          {page < lastPage && (
            <div className="text-center mt-6 mb-10">
              <button
                id="load-more-btn"
                onClick={loadMore}
                disabled={loading}
                className="flex items-center gap-2 mx-auto text-xs font-semibold text-[#a8a8a8] hover:text-white px-5 py-2 rounded-full border border-[#262626] hover:border-white/20 transition-all duration-200 disabled:opacity-60"
              >
                {loading && (
                  <Loader2 size={13} className="animate-spin text-[#0095f6]" />
                )}
                {loading ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR (xl+) ── */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="hidden xl:block shrink-0 w-[320px] sticky top-6"
        >
          <RightSidebar user={user} />
        </motion.div>
      </div>
    </div>
  );
}
