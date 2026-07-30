import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Trash2, Send } from "lucide-react";
import { toggleLike, deletePost } from "../services/api";
import toast from "react-hot-toast";
import Avatar from "./Avatar";
import TimeAgo from "./TimeAgo";
import { getImageUrl } from "../utils/image";

export default function PostCard({ post, currentUser, onDelete }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.likes?.some((l) => l.user_id === currentUser?.id) || false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showBigHeart, setShowBigHeart] = useState(false);

  const imageUrl = getImageUrl(post);

  const handleLike = async (e) => {
    e?.stopPropagation();
    if (!currentUser) return toast.error("Please login first");
    if (likeLoading) return;
    setLikeLoading(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((p) => (wasLiked ? p - 1 : p + 1));
    try {
      await toggleLike(post.id);
    } catch {
      setLiked(wasLiked);
      setLikeCount((p) => (wasLiked ? p + 1 : p - 1));
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDoubleTap = () => {
    if (!currentUser) return;
    if (!liked) handleLike();
    setShowBigHeart(true);
    setTimeout(() => setShowBigHeart(false), 700);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setShowMenu(false);
    if (!confirm("Delete this post?")) return;
    try {
      await deletePost(post.id);
      toast.success("Post deleted");
      onDelete(post.id);
    } catch {
      toast.error("Cannot delete post");
    }
  };

  const commentCount = post.comments_count ?? post.comments?.length ?? 0;

  return (
    <article className="
      bg-black border border-[#262626] rounded-2xl overflow-hidden
      card-hover
    ">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shrink-0">
            <div className="bg-black rounded-full p-[2px]">
              <Avatar name={post.user?.name} size="md" />
            </div>
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-sm leading-tight">{post.user?.name}</p>
            <TimeAgo date={post.created_at} className="text-[#737373] text-xs" />
          </div>
        </button>

        {/* Menu */}
        <div className="relative">
          <button
            id={`post-menu-${post.id}`}
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-2 text-[#a8a8a8] hover:text-white transition-colors rounded-full hover:bg-white/8"
          >
            <MoreHorizontal size={20} />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-10 w-44 bg-[#1a1a1a] border border-[#303030] rounded-2xl shadow-2xl overflow-hidden z-30"
              >
                {currentUser?.id === post.user_id ? (
                  <button
                    id={`delete-post-${post.id}`}
                    onClick={handleDelete}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#ed4956] hover:bg-[#ed4956]/10 font-semibold transition-colors"
                  >
                    <Trash2 size={15} /> Delete Post
                  </button>
                ) : (
                  <div className="px-4 py-3 text-xs text-[#737373] text-center">
                    No options available
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Media — 1:1 square (consistent with Instagram) ── */}
      {imageUrl && (
        <div
          className="relative w-full aspect-square bg-[#050505] select-none cursor-pointer overflow-hidden"
          onClick={() => navigate(`/post/${post.id}`)}
          onDoubleClick={handleDoubleTap}
        >
          <img
            src={imageUrl}
            alt={post.caption || "post"}
            className="w-full h-full object-cover block"
            loading="lazy"
          />

          {/* Double-tap heart */}
          <AnimatePresence>
            {showBigHeart && (
              <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1.1 }}
                exit={{ opacity: 0, scale: 1.4 }}
                transition={{ duration: 0.32 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
              >
                <Heart size={90} className="fill-white text-white drop-shadow-2xl" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="px-4 pt-3 pb-4">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-4">
            {/* Like */}
            <motion.button
              id={`like-btn-${post.id}`}
              onClick={handleLike}
              whileTap={{ scale: 0.78 }}
              animate={liked ? { scale: [1, 1.28, 1] } : { scale: 1 }}
              transition={{ duration: 0.28 }}
              className="focus:outline-none"
              aria-label="Like"
            >
              <Heart
                size={26}
                className={`transition-colors duration-150 ${liked ? "fill-[#ed4956] text-[#ed4956]" : "text-white hover:text-[#a8a8a8]"}`}
              />
            </motion.button>

            {/* Comment */}
            <button
              id={`comment-btn-${post.id}`}
              onClick={() => navigate(`/post/${post.id}`)}
              aria-label="Comment"
            >
              <MessageCircle size={26} className="text-white hover:text-[#a8a8a8] transition-colors duration-150" />
            </button>

            {/* Share */}
            <button
              onClick={() => toast("Copied to clipboard!", { icon: "📋" })}
              aria-label="Share"
            >
              <Send size={24} className="text-white hover:text-[#a8a8a8] transition-colors duration-150 -rotate-12" />
            </button>
          </div>

          {/* Save */}
          <motion.button
            id={`save-btn-${post.id}`}
            onClick={() => setSaved(!saved)}
            whileTap={{ scale: 0.78 }}
            aria-label="Save"
          >
            <Bookmark
              size={26}
              className={`transition-colors duration-150 ${saved ? "fill-white text-white" : "text-white hover:text-[#a8a8a8]"}`}
            />
          </motion.button>
        </div>

        {/* Like count */}
        {likeCount > 0 && (
          <p className="text-sm font-semibold text-white mb-1.5">
            {likeCount.toLocaleString()} {likeCount === 1 ? "like" : "likes"}
          </p>
        )}

        {/* Caption */}
        {post.caption && (
          <p className="text-sm text-[#f5f5f5] leading-snug">
            <span className="font-semibold mr-1.5">{post.user?.name}</span>
            <span className="text-[#d4d4d4] font-normal">{post.caption}</span>
          </p>
        )}

        {/* View comments */}
        {commentCount > 0 && (
          <button
            onClick={() => navigate(`/post/${post.id}`)}
            className="text-sm text-[#737373] hover:text-[#a8a8a8] transition-colors mt-1 block"
          >
            View all {commentCount} comments
          </button>
        )}

        <TimeAgo
          date={post.created_at}
          className="text-[11px] text-[#737373] uppercase tracking-wider mt-2 block"
        />
      </div>
    </article>
  );
}
