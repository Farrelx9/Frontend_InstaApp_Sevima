import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPost,
  getComments,
  createComment,
  deleteComment,
  toggleLike,
  deletePost,
} from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import {
  Heart,
  MessageCircle,
  Send,
  ArrowLeft,
  Trash2,
  Bookmark,
} from "lucide-react";
import Avatar from "../components/Avatar";
import TimeAgo from "../components/TimeAgo";
import { getImageUrl } from "../utils/image";
import { motion, AnimatePresence } from "framer-motion";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pr, cr] = await Promise.all([getPost(id), getComments(id)]);
        const p = pr.data;
        setPost(p);
        setComments(cr.data || []);
        setLikeCount(p.likes?.length || 0);
        setLiked(p.likes?.some((l) => l.user_id === user?.id) || false);
      } catch {
        toast.error("Post not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id, user, navigate]);

  const handleLike = async () => {
    if (!user) return toast.error("Please login first");
    if (likeLoading) return;
    setLikeLoading(true);
    const was = liked;
    setLiked(!was);
    setLikeCount((n) => (was ? n - 1 : n + 1));
    try {
      await toggleLike(id);
    } catch {
      setLiked(was);
      setLikeCount((n) => (was ? n + 1 : n - 1));
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const res = await createComment(id, { body: commentText });
      setComments((prev) => [res.data, ...prev]);
      setCommentText("");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (cid) => {
    try {
      await deleteComment(id, cid);
      setComments((prev) => prev.filter((c) => c.id !== cid));
      toast.success("Comment deleted");
    } catch {
      toast.error("Cannot delete");
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Delete this post?")) return;
    try {
      await deletePost(id);
      toast.success("Post deleted");
      navigate("/");
    } catch {
      toast.error("Cannot delete post");
    }
  };

  const imageUrl = getImageUrl(post);

  /* ─── Loading State ─── */
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[60vh]">
        <div className="spinner" />
      </div>
    );
  }
  if (!post) return null;

  /* ─── Reusable CommentRow Component ─── */
  const CommentRow = ({ c }) => (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -8 }}
      className="flex items-start gap-3 group"
    >
      <Avatar name={c.user?.name} size="sm" className="shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#f5f5f5] leading-snug">
          <span className="font-semibold mr-1.5 text-white">
            {c.user?.name}
          </span>
          {c.body}
        </p>
        <TimeAgo
          date={c.created_at}
          className="text-[11px] text-[#737373] mt-0.5 block"
        />
      </div>
      {user?.id === c.user_id && (
        <button
          onClick={() => handleDeleteComment(c.id)}
          className="opacity-0 group-hover:opacity-100 p-1 text-[#737373] hover:text-[#ed4956] transition-all shrink-0"
        >
          <Trash2 size={13} />
        </button>
      )}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-[935px] mx-auto"
    >
      {/*
        ══════════════════════════════════════════════
        INSTAGRAM SPLIT LAYOUT
          Mobile (<768px):  Stack vertical (image → info panel)
          Desktop (≥768px): flex-row → Image | Info Panel

        Info Panel is FIXED 340px width on desktop.
        Image column takes remaining flex-1 space.
        ══════════════════════════════════════════════
      */}
      <div
        className="
        bg-black border border-[#262626] rounded-2xl
        overflow-hidden shadow-2xl
        flex flex-col md:flex-row
        md:min-h-[580px]
      "
      >
        {/* ══════════════════════════════════════════
            LEFT — Image Panel (flex-1 on desktop)
            ══════════════════════════════════════════ */}
        <div
          className="
          flex-1 min-w-0
          bg-[#0a0a0a]
          border-b md:border-b-0 md:border-r border-[#262626]
          flex items-center justify-center
          min-h-[280px] md:min-h-[580px]
        "
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={post.caption || "post"}
              className="w-full h-full object-contain max-h-[640px] block"
            />
          ) : (
            <p className="text-[#737373] text-sm p-8 text-center select-none">
              No media
            </p>
          )}
        </div>

        {/* ══════════════════════════════════════════
            RIGHT — Info Panel (fixed 340px on md+)
            ══════════════════════════════════════════ */}
        <div
          className="
          w-full md:w-[340px] md:max-w-[340px] md:shrink-0
          flex flex-col bg-black
          md:min-h-[580px]
        "
        >
          {/* ── Author Header ── */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626] shrink-0 bg-[#0d0d0d]">
            <div className="flex items-center gap-3">
              <button
                id="detail-back-btn"
                onClick={() => navigate(-1)}
                className="p-1.5 text-[#a8a8a8] hover:text-white rounded-full hover:bg-white/8 transition-colors"
              >
                <ArrowLeft size={19} />
              </button>
              <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shrink-0">
                <div className="bg-black rounded-full p-[1.5px]">
                  <Avatar name={post.user?.name} size="sm" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white leading-tight truncate">
                  {post.user?.name}
                </p>
                <TimeAgo
                  date={post.created_at}
                  className="text-[11px] text-[#737373]"
                />
              </div>
            </div>

            {user?.id === post.user_id && (
              <button
                id="delete-post-btn"
                onClick={handleDeletePost}
                title="Delete post"
                className="p-1.5 text-[#737373] hover:text-[#ed4956] rounded-full hover:bg-[#ed4956]/10 transition-colors ml-2 shrink-0"
              >
                <Trash2 size={17} />
              </button>
            )}
          </div>

          {/* ── Scrollable Comments Area ── */}
          <div
            className="
            flex-1 overflow-y-auto no-scrollbar
            p-4 space-y-4
            min-h-[160px] max-h-[340px] md:max-h-none
          "
          >
            {/* Caption */}
            {post.caption && (
              <div className="flex items-start gap-3 pb-4 border-b border-[#1a1a1a]">
                <Avatar
                  name={post.user?.name}
                  size="sm"
                  className="shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#f5f5f5] leading-snug">
                    <span className="font-semibold mr-1.5 text-white">
                      {post.user?.name}
                    </span>
                    {post.caption}
                  </p>
                  <TimeAgo
                    date={post.created_at}
                    className="text-[11px] text-[#737373] mt-1 block"
                  />
                </div>
              </div>
            )}

            {/* Comments List */}
            <AnimatePresence>
              {comments.map((c) => (
                <CommentRow key={c.id} c={c} />
              ))}
            </AnimatePresence>

            {comments.length === 0 && !post.caption && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <MessageCircle size={28} className="text-[#333] mb-2" />
                <p className="text-[#737373] text-sm font-medium">
                  No comments yet.
                </p>
                <p className="text-[#555] text-xs mt-1">
                  Be the first to comment!
                </p>
              </div>
            )}
          </div>

          {/* ── Action Bar + Comment Input (Pinned Bottom) ── */}
          <div className="border-t border-[#262626] shrink-0 bg-[#0d0d0d]">
            {/* Action Buttons */}
            <div className="px-4 pt-3 pb-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Like */}
                  <motion.button
                    id="like-btn"
                    onClick={handleLike}
                    whileTap={{ scale: 0.75 }}
                    animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Heart
                      size={24}
                      className={`transition-colors duration-150 ${
                        liked
                          ? "fill-[#ed4956] text-[#ed4956]"
                          : "text-white hover:text-[#a8a8a8]"
                      }`}
                    />
                  </motion.button>

                  {/* Comment icon (no action, just visual) */}
                  <MessageCircle
                    size={24}
                    className="text-white hover:text-[#a8a8a8] cursor-pointer transition-colors"
                  />

                  {/* Share */}
                  <button onClick={() => toast("Link copied! 📋")}>
                    <Send
                      size={22}
                      className="text-white hover:text-[#a8a8a8] transition-colors -rotate-12"
                    />
                  </button>
                </div>

                {/* Bookmark */}
                <button onClick={() => setSaved((s) => !s)}>
                  <Bookmark
                    size={24}
                    className={`transition-colors duration-150 ${
                      saved
                        ? "fill-white text-white"
                        : "text-white hover:text-[#a8a8a8]"
                    }`}
                  />
                </button>
              </div>

              {/* Like Count */}
              {likeCount > 0 && (
                <p className="text-sm font-semibold text-white mt-2">
                  {likeCount.toLocaleString()}{" "}
                  {likeCount === 1 ? "like" : "likes"}
                </p>
              )}

              {/* Timestamp */}
              <TimeAgo
                date={post.created_at}
                className="text-[10px] text-[#737373] uppercase tracking-widest mt-1 block"
              />
            </div>

            {/* Comment Input */}
            {user && (
              <form
                onSubmit={handleComment}
                className="flex items-center gap-2 px-4 py-3 border-t border-[#1a1a1a]"
              >
                <input
                  id="comment-input"
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment…"
                  className="flex-1 bg-transparent text-sm text-white placeholder-[#555] focus:outline-none"
                />
                <button
                  id="comment-submit-btn"
                  type="submit"
                  disabled={!commentText.trim() || submitting}
                  className="text-sm font-bold text-[#0095f6] hover:text-white disabled:text-[#333] disabled:cursor-not-allowed transition-colors"
                >
                  Post
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
