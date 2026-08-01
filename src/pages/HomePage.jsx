import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPosts } from "../services/api";
import PostCard from "../components/PostCard";
import PostCardSkeleton from "../components/PostCardSkeleton"; // ✅ Import Skeleton
import StoriesBar from "../components/StoriesBar";
import RightSidebar from "../components/RightSidebar";
import { useAuth } from "../contexts/AuthContext";

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

  const observerTarget = useRef(null);

  // Initial Load
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
        if (!ignore) setInitialLoad(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // Infinite Scroll Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Jika sentinel terlihat, belum loading, dan masih ada halaman berikutnya
        if (entries[0].isIntersecting && !loading && page < lastPage) {
          loadMore();
        }
      },
      { threshold: 0.5 }, // Trigger saat 50% elemen terlihat
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [page, lastPage, loading]);

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

  const handleDelete = (id) =>
    setPosts((p) => p.filter((post) => post.id !== id));

  /* ── Skeleton Loading (Initial Load) ─── */
  if (initialLoad) {
    return (
      <div className="w-full min-h-screen flex justify-center bg-black">
        <div className="flex flex-col xl:flex-row items-start justify-center gap-6 xl:gap-8 w-full max-w-6xl sm:pt-4 pb-24 sm:pb-10">
          <div className="w-full max-w-[630px] shrink-0 min-w-0 mx-auto xl:mx-0 space-y-4">
            {/* Stories Skeleton */}
            <div className="border border-[#262626] rounded-2xl bg-black p-4 animate-pulse overflow-x-auto">
              <div className="flex gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 shrink-0"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10" />
                    <div className="w-10 h-2 rounded bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
            {/* Posts Skeleton */}
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse border border-[#262626] rounded-2xl overflow-hidden bg-black"
              >
                <div className="flex items-center gap-3 p-4">
                  <div className="w-9 h-9 rounded-full bg-white/10 shrink-0" />
                  <div className="h-3 w-32 bg-white/10 rounded" />
                </div>
                <div className="w-full aspect-square bg-white/5" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-full bg-white/10 rounded" />
                  <div className="h-3 w-2/3 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="hidden xl:block shrink-0 w-[320px] sticky top-6 h-fit space-y-4">
            <div className="h-12 bg-white/10 rounded-xl animate-pulse" />
            <div className="h-40 bg-white/5 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Main Content ─── */
  return (
    <div className="w-full min-h-screen flex justify-center bg-black">
      <div className="flex flex-col xl:flex-row items-start justify-center gap-6 xl:gap-8 w-full max-w-6xl sm:pt-4 pb-24 sm:pb-10">
        {/*  FEED COLUMN ── */}
        <div className="w-full max-w-[630px] shrink-0 min-w-0 mx-auto xl:mx-0">
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
                className="border border-[#262626] rounded-2xl p-8 sm:p-16 text-center bg-black mt-4"
              >
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

          {/* ✅ INFINITE SCROLL SKELETON & SENTINEL */}
          {page < lastPage && (
            <>
              {/* Sentinel Element: Elemen tak terlihat yang memicu fetch saat discroll */}
              <div ref={observerTarget} className="h-10 -mt-10" />

              {/* Tampilkan skeleton hanya saat sedang fetching halaman berikutnya */}
              {loading && (
                <div className="mt-4">
                  <PostCardSkeleton />
                </div>
              )}
            </>
          )}

          {/* Pesan jika semua post sudah dimuat */}
          {page >= lastPage && posts.length > 0 && (
            <div className="text-center py-8 text-[#737373] text-sm">
              You're all caught up! No more posts to load ✌️
            </div>
          )}
        </div>

        {/* ─ RIGHT SIDEBAR ─ */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="hidden xl:block shrink-0 w-[320px] sticky top-6 h-fit"
        >
          <RightSidebar user={user} />
        </motion.div>
      </div>
    </div>
  );
}
