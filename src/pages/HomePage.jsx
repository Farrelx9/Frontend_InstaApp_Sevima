import { useState, useEffect } from 'react';
import { getPosts } from '../services/api';
import PostCard from '../components/PostCard';
import StoriesBar from '../components/StoriesBar';
import RightSidebar from '../components/RightSidebar';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

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
        const data = res.data;
        setPosts(data.data || []);
        setLastPage(data.last_page || 1);
      })
      .catch((err) => console.error('Failed to fetch posts:', err))
      .finally(() => {
        if (!ignore) {
          setLoading(false);
          setInitialLoad(false);
        }
      });
    return () => { ignore = true; };
  }, []);

  const loadMore = async () => {
    const next = page + 1;
    setLoading(true);
    try {
      const res = await getPosts(next);
      const data = res.data;
      setPosts((prev) => [...prev, ...(data.data || [])]);
      setPage(next);
      setLastPage(data.last_page || 1);
    } catch (err) {
      console.error('Failed to load more:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  if (initialLoad) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner" />
      </div>
    );
  }

  return (
    /*
      Instagram Web desktop layout:
      - Feed column: fixed max-w ~470px, centered
      - Right sidebar: fixed width ~320px, appears on lg+ screens
      - Gap between them: ~28px (Instagram uses ~56px total padding)
    */
    <div className="flex gap-7 justify-center items-start">

      {/* ─── FEED COLUMN (470px fixed width) ─── */}
      <div className="w-full max-w-[470px] flex-shrink-0">

        {/* Stories */}
        <StoriesBar />

        {/* Post cards */}
        <div className="mt-4 space-y-0">
          {posts.length === 0 ? (
            <div className="border border-white/10 rounded-xl p-16 text-center mt-8">
              <p className="text-4xl mb-3">📷</p>
              <p className="text-white font-semibold">No posts yet</p>
              <p className="text-gray-500 text-sm mt-1">Start sharing moments!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={user}
                onDelete={handlePostDelete}
              />
            ))
          )}
        </div>

        {/* Load more */}
        {page < lastPage && (
          <div className="text-center mt-6 mb-10">
            <button
              id="load-more-btn"
              onClick={loadMore}
              disabled={loading}
              className="text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-2 mx-auto transition-colors"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Loading...' : 'Load more posts'}
            </button>
          </div>
        )}
      </div>

      {/* ─── RIGHT SIDEBAR (320px, only lg+) ─── */}
      <RightSidebar user={user} />
    </div>
  );
}
