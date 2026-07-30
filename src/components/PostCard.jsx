import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function PostCard({ post, currentUser, onDelete }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(
    post.likes?.some((l) => l.user_id === currentUser?.id) || false,
  );
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [likeAnimate, setLikeAnimate] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [saved, setSaved] = useState(false);

  const imageUrl = getImageUrl(post);

  const handleLike = async (e) => {
    e?.stopPropagation();
    if (!currentUser) return toast.error("Please login first");
    if (likeLoading) return;
    setLikeLoading(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));
    setLikeAnimate(true);
    setTimeout(() => setLikeAnimate(false), 300);
    try {
      await toggleLike(post.id);
    } catch {
      setLiked(wasLiked);
      setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDoubleTap = () => {
    if (!currentUser || liked) return;
    handleLike();
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
    <article className="bg-[#000] border-b border-[#262626] pb-2">
      {/* ── Post Header ── */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-3">
        <div className="flex items-center gap-3 cursor-pointer">
          {/* Avatar with gradient ring */}
          <div className="p-[2px] rounded-full bg-gradient-to-bl from-yellow-400 via-pink-500 to-purple-600">
            <div className="bg-[#000] rounded-full p-[2px]">
              <Avatar name={post.user?.name} size="md" />
            </div>
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">
              {post.user?.name}
            </p>
            <div className="flex items-center gap-1">
              <TimeAgo
                date={post.created_at}
                className="text-gray-400 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Three dot menu */}
        <div className="relative">
          <button
            id={`post-menu-${post.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <MoreHorizontal size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-10 bg-[#1c1c1c] border border-[#333] rounded-2xl shadow-2xl overflow-hidden z-20 w-40">
              {currentUser?.id === post.user_id && (
                <button
                  id={`delete-post-${post.id}`}
                  onClick={handleDelete}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-red-400 hover:bg-red-500/10 font-semibold transition-colors"
                >
                  <Trash2 size={15} /> Delete
                </button>
              )}
              <button
                onClick={() => {
                  setShowMenu(false);
                  navigate(`/post/${post.id}`);
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-white hover:bg-white/5 transition-colors border-t border-[#333]"
              >
                View Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Image ── */}
      {imageUrl && (
        <div
          className="relative w-full bg-black cursor-pointer select-none overflow-hidden flex items-center justify-center"
          style={{ minHeight: "280px", maxHeight: "585px" }}
          onClick={() => navigate(`/post/${post.id}`)}
          onDoubleClick={handleDoubleTap}
        >
          <img
            src={imageUrl}
            alt={post.caption || "post"}
            className="w-full h-full object-cover block"
            style={{ maxHeight: "585px" }}
            loading="lazy"
          />
        </div>
      )}

      {/* ── Actions Bar ── */}
      <div className="px-3 sm:px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            {/* Like */}
            <button
              id={`like-btn-${post.id}`}
              onClick={handleLike}
              className="group -m-1 p-1"
              aria-label="Like post"
            >
              <Heart
                size={26}
                className={`transition-transform group-hover:scale-110 ${likeAnimate ? "like-animate" : ""} ${
                  liked
                    ? "fill-red-500 text-red-500"
                    : "text-white hover:text-gray-400"
                }`}
              />
            </button>

            {/* Comment */}
            <button
              id={`comment-btn-${post.id}`}
              onClick={() => navigate(`/post/${post.id}`)}
              className="group -m-1 p-1"
            >
              <MessageCircle
                size={26}
                className="text-white hover:text-gray-400 transition-colors"
              />
            </button>

            {/* Share / Send */}
            <button className="group -m-1 p-1">
              <Send
                size={24}
                className="text-white hover:text-gray-400 transition-colors -rotate-12"
              />
            </button>
          </div>

          {/* Bookmark */}
          <button
            id={`save-btn-${post.id}`}
            onClick={() => setSaved(!saved)}
            className="group -m-1 p-1"
          >
            <Bookmark
              size={26}
              className={`transition-transform group-hover:scale-110 ${
                saved
                  ? "fill-white text-white"
                  : "text-white hover:text-gray-400"
              }`}
            />
          </button>
        </div>

        {/* Like count */}
        {likeCount > 0 && (
          <p className="text-sm font-semibold text-white mb-1">
            {likeCount.toLocaleString()} {likeCount === 1 ? "like" : "likes"}
          </p>
        )}

        {/* Caption */}
        {post.caption && (
          <p className="text-sm text-white leading-snug">
            <span className="font-semibold mr-1.5">{post.user?.name}</span>
            <span className="text-gray-200 font-normal">{post.caption}</span>
          </p>
        )}

        {/* View all comments */}
        {commentCount > 0 && (
          <button
            onClick={() => navigate(`/post/${post.id}`)}
            className="text-sm text-gray-500 mt-1 hover:text-gray-300 transition-colors block"
          >
            View all {commentCount} comments
          </button>
        )}

        {/* Timestamp small */}
        <TimeAgo
          date={post.created_at}
          className="text-[11px] text-gray-600 uppercase tracking-wide mt-2 block"
        />
      </div>
    </article>
  );
}
