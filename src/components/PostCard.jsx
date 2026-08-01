// components/PostCard.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Trash2,
  Send,
} from "lucide-react";
import { toggleLike, deletePost } from "../services/api";
import toast from "react-hot-toast";
import Avatar from "./Avatar";
import TimeAgo from "./TimeAgo";
import { getImageUrl } from "../utils/image";
import ConfirmModal from "./ConfirmModal"; // ✅ Import Modal Baru

const DOUBLE_TAP_DELAY = 250;

export default function PostCard({ post, currentUser, onDelete }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(
    post.likes?.some((l) => l.user_id === currentUser?.id) || false,
  );
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showBigHeart, setShowBigHeart] = useState(false);

  // ✅ State untuk Modal Delete Post
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const tapTimeout = useRef(null);
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

  const handleMediaTap = () => {
    if (tapTimeout.current) {
      clearTimeout(tapTimeout.current);
      tapTimeout.current = null;
      handleDoubleTap();
      return;
    }
    tapTimeout.current = setTimeout(() => {
      tapTimeout.current = null;
      navigate(`/post/${post.id}`);
    }, DOUBLE_TAP_DELAY);
  };

  // ✅ Handler untuk membuka modal
  const openDeleteModal = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  // ✅ Handler konfirmasi delete dari modal
  const confirmDeletePost = async () => {
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      toast.success("Post deleted");
      onDelete(post.id);
      setShowDeleteModal(false);
    } catch {
      toast.error("Cannot delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const commentCount = post.comments_count ?? post.comments?.length ?? 0;

  return (
    <>
      <article className="bg-black border border-[#262626] rounded-2xl overflow-hidden card-hover mb-4 sm:mb-6">
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-3">
          <button
            onClick={() => navigate(`/profile/${post.user_id}`)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity min-w-0"
          >
            <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shrink-0">
              <div className="bg-black rounded-full p-[2px]">
                <Avatar name={post.user?.name} size="md" />
              </div>
            </div>
            <div className="text-left min-w-0">
              <p className="text-white font-semibold text-sm leading-tight truncate">
                {post.user?.name}
              </p>
              <TimeAgo
                date={post.created_at}
                className="text-[#737373] text-xs block truncate"
              />
            </div>
          </button>

          <div className="relative">
            <button
              id={`post-menu-${post.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 text-[#a8a8a8] hover:text-white transition-colors rounded-full hover:bg-white/8 active:scale-95"
            >
              <MoreHorizontal size={20} />
            </button>

            <AnimatePresence>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-48 bg-[#1a1a1a] border border-[#303030] rounded-xl shadow-2xl overflow-hidden z-30"
                  >
                    {currentUser?.id === post.user_id ? (
                      <button
                        id={`delete-post-${post.id}`}
                        onClick={openDeleteModal} // ✅ Ganti handleDelete langsung dengan openDeleteModal
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-[#ed4956] hover:bg-[#ed4956]/10 font-semibold transition-colors text-left"
                      >
                        <Trash2 size={16} /> Delete Post
                      </button>
                    ) : (
                      <div className="px-4 py-3.5 text-xs text-[#737373] text-center">
                        No options available
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Media & Actions (Sama seperti sebelumnya) */}
        {imageUrl && (
          <div
            className="relative w-full aspect-square bg-[#050505] select-none cursor-pointer overflow-hidden"
            onClick={handleMediaTap}
          >
            <img
              src={imageUrl}
              alt={post.caption || "post"}
              className="w-full h-full object-cover block"
              loading="lazy"
            />
            <AnimatePresence>
              {showBigHeart && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1.1 }}
                  exit={{ opacity: 0, scale: 1.4 }}
                  transition={{ duration: 0.32 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                >
                  <Heart
                    size={90}
                    className="fill-white text-white drop-shadow-2xl"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="px-3 sm:px-4 pt-3 pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4 sm:gap-5">
              <motion.button
                id={`like-btn-${post.id}`}
                onClick={handleLike}
                whileTap={{ scale: 0.78 }}
                animate={liked ? { scale: [1, 1.28, 1] } : { scale: 1 }}
                transition={{ duration: 0.28 }}
                className="focus:outline-none active:scale-90"
                aria-label="Like"
              >
                <Heart
                  size={26}
                  className={`transition-colors duration-150 ${liked ? "fill-[#ed4956] text-[#ed4956]" : "text-white hover:text-[#a8a8a8]"}`}
                />
              </motion.button>
              <button
                id={`comment-btn-${post.id}`}
                onClick={() => navigate(`/post/${post.id}`)}
                aria-label="Comment"
                className="active:scale-90 transition-transform"
              >
                <MessageCircle
                  size={26}
                  className="text-white hover:text-[#a8a8a8] transition-colors duration-150"
                />
              </button>
              <button
                onClick={() => toast("Copied to clipboard!", { icon: "" })}
                aria-label="Share"
                className="active:scale-90 transition-transform"
              >
                <Send
                  size={24}
                  className="text-white hover:text-[#a8a8a8] transition-colors duration-150 -rotate-12"
                />
              </button>
            </div>
            <motion.button
              id={`save-btn-${post.id}`}
              onClick={() => setSaved(!saved)}
              whileTap={{ scale: 0.78 }}
              aria-label="Save"
              className="active:scale-90 transition-transform"
            >
              <Bookmark
                size={26}
                className={`transition-colors duration-150 ${saved ? "fill-white text-white" : "text-white hover:text-[#a8a8a8]"}`}
              />
            </motion.button>
          </div>

          {likeCount > 0 && (
            <p className="text-sm font-semibold text-white mb-2">
              {likeCount.toLocaleString()} {likeCount === 1 ? "like" : "likes"}
            </p>
          )}

          {post.caption && (
            <p className="text-sm text-[#f5f5f5] leading-snug break-words">
              <span
                className="font-semibold mr-1.5 cursor-pointer hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${post.user_id}`);
                }}
              >
                {post.user?.name}
              </span>
              <span className="text-[#d4d4d4] font-normal">{post.caption}</span>
            </p>
          )}

          {commentCount > 0 && (
            <button
              onClick={() => navigate(`/post/${post.id}`)}
              className="text-sm text-[#737373] hover:text-[#a8a8a8] transition-colors mt-1.5 block text-left"
            >
              View all {commentCount} comments
            </button>
          )}
          <TimeAgo
            date={post.created_at}
            className="text-[11px] text-[#737373] uppercase tracking-wider mt-2.5 block"
          />
        </div>
      </article>

      {/* ✅ MODAL DELETE POST */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeletePost}
        title="Delete this post?"
        description="Are you sure you want to delete this post? This action cannot be undone and the post will be permanently removed."
        confirmText="Delete Post"
        isLoading={isDeleting}
      />
    </>
  );
}
