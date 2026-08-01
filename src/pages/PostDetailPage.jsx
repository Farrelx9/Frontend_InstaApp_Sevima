import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPost,
  getComments,
  createComment,
  deleteComment,
  updateComment,
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
  Pencil,
  Check,
  X,
} from "lucide-react";
import Avatar from "../components/Avatar";
import TimeAgo from "../components/TimeAgo";
import { getImageUrl } from "../utils/image";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmModal from "../components/ConfirmModal"; // ✅ Import Modal

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
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true,
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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

  const openDeleteCommentModal = (cid) => {
    setCommentToDelete(cid);
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;
    setIsDeletingComment(true);
    try {
      await deleteComment(id, commentToDelete);
      setComments((prev) => prev.filter((c) => c.id !== commentToDelete));
      toast.success("Comment deleted");
    } catch {
      toast.error("Cannot delete comment");
    } finally {
      setIsDeletingComment(false);
      setCommentToDelete(null);
    }
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.body);
  };

  const saveEdit = async (cid) => {
    if (!editText.trim()) return;
    try {
      const res = await updateComment(cid, editText);
      setComments((prev) => prev.map((c) => (c.id === cid ? res.data : c)));
      setEditingCommentId(null);
      setEditText("");
      toast.success("Comment updated");
    } catch {
      toast.error("Failed to update comment");
    }
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditText("");
  };

  // ✅ Handler untuk membuka modal (menggantikan confirm bawaan)
  const openDeletePostModal = () => {
    setShowDeletePostModal(true);
  };

  // ✅ Handler konfirmasi delete post dari modal
  const confirmDeletePost = async () => {
    setIsDeletingPost(true);
    try {
      await deletePost(id);
      toast.success("Post deleted");
      navigate("/"); // Kembali ke home setelah berhasil
    } catch {
      toast.error("Cannot delete post");
    } finally {
      setIsDeletingPost(false);
      setShowDeletePostModal(false);
    }
  };

  const imageUrl = getImageUrl(post);

  if (loading)
    return (
      <div className="w-full flex items-center justify-center min-h-[60vh]">
        <div className="spinner" />
      </div>
    );
  if (!post) return null;

  const CommentRow = ({ c }) => {
    const isOwner = user?.id === c.user_id;
    const isEditing = editingCommentId === c.id;

    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -8 }}
        className="flex items-start gap-3 group"
      >
        <button
          onClick={() => navigate(`/profile/${c.user_id}`)}
          className="shrink-0 mt-0.5 hover:opacity-80 transition-opacity"
        >
          <Avatar name={c.user?.name} size="sm" />
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex flex-col gap-2 w-full">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="bg-[#1a1a1a] border border-[#363636] rounded-lg px-3 py-1.5 text-sm text-white focus:border-[#0095f6] focus:outline-none w-full"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit(c.id);
                  if (e.key === "Escape") cancelEdit();
                }}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => saveEdit(c.id)}
                  disabled={!editText.trim()}
                  className="text-xs font-bold text-[#0095f6] hover:text-white disabled:text-[#333] transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="text-xs text-[#737373] hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-[#f5f5f5] leading-snug">
                <span
                  className="font-semibold mr-1.5 text-white cursor-pointer hover:underline"
                  onClick={() => navigate(`/profile/${c.user_id}`)}
                >
                  {c.user?.name}
                </span>
                {c.body}
              </p>
              <TimeAgo
                date={c.created_at}
                className="text-[11px] text-[#737373] mt-0.5 block"
              />
            </>
          )}
        </div>

        {isOwner && !isEditing && (
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 transition-opacity">
            <button
              onClick={() => startEditing(c)}
              className="p-1 text-[#737373] hover:text-white transition-colors"
              title="Edit comment"
            >
              <Pencil size={13} />
            </button>
            {/* ✅ Ganti direct delete dengan open modal */}
            <button
              onClick={() => openDeleteCommentModal(c.id)}
              className="p-1 text-[#737373] hover:text-[#ed4956] transition-colors"
              title="Delete comment"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}

        {isEditing && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => saveEdit(c.id)}
              className="p-1 text-[#0095f6] hover:text-white transition-colors"
            >
              <Check size={14} />
            </button>
            <button
              onClick={cancelEdit}
              className="p-1 text-[#737373] hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full h-[calc(100vh-80px)] flex justify-center bg-black"
      >
        <div className="w-full h-full max-w-[1600px] flex flex-col md:flex-row bg-black border-x border-[#262626] md:border-y md:border-[#262626] md:rounded-lg overflow-hidden shadow-2xl">
          {/* LEFT — Image Panel */}
          <div className="relative flex-1 bg-[#0a0a0a] flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={post.caption || "post"}
                className="w-full h-full object-contain"
              />
            ) : (
              <p className="text-[#737373] text-sm p-8 text-center select-none">
                No media
              </p>
            )}
          </div>

          {/* RIGHT — Info Panel */}
          <div className="w-full md:w-[400px] md:shrink-0 flex flex-col bg-black border-l border-[#262626] h-full">
            {/* Author Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626] shrink-0 bg-[#0d0d0d]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="p-1.5 text-[#a8a8a8] hover:text-white rounded-full hover:bg-white/8 transition-colors"
                >
                  <ArrowLeft size={19} />
                </button>
                <button
                  onClick={() => navigate(`/profile/${post.user_id}`)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity min-w-0"
                >
                  <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shrink-0">
                    <div className="bg-black rounded-full p-[1.5px]">
                      <Avatar name={post.user?.name} size="sm" />
                    </div>
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-semibold text-white leading-tight truncate">
                      {post.user?.name}
                    </p>
                    <TimeAgo
                      date={post.created_at}
                      className="text-[11px] text-[#737373]"
                    />
                  </div>
                </button>
              </div>
              {user?.id === post.user_id && (
                <button
                  onClick={openDeletePostModal}
                  className="p-1.5 text-[#737373] hover:text-[#ed4956] rounded-full hover:bg-[#ed4956]/10 transition-colors ml-2 shrink-0"
                >
                  <Trash2 size={17} />
                </button>
              )}
            </div>

            {/* Scrollable Comments Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
              {post.caption && (
                <div className="flex items-start gap-3 pb-4 border-b border-[#1a1a1a]">
                  <button
                    onClick={() => navigate(`/profile/${post.user_id}`)}
                    className="shrink-0 mt-0.5 hover:opacity-80 transition-opacity"
                  >
                    <Avatar name={post.user?.name} size="sm" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#f5f5f5] leading-snug">
                      <span
                        className="font-semibold mr-1.5 text-white cursor-pointer hover:underline"
                        onClick={() => navigate(`/profile/${post.user_id}`)}
                      >
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
                </div>
              )}
            </div>

            {/* Action Bar + Comment Input */}
            <div className="border-t border-[#262626] shrink-0 bg-[#0d0d0d]">
              <div className="px-4 pt-3 pb-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.button
                      onClick={handleLike}
                      whileTap={{ scale: 0.75 }}
                      animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Heart
                        size={24}
                        className={`transition-colors duration-150 ${liked ? "fill-[#ed4956] text-[#ed4956]" : "text-white hover:text-[#a8a8a8]"}`}
                      />
                    </motion.button>
                    <MessageCircle
                      size={24}
                      className="text-white hover:text-[#a8a8a8] cursor-pointer transition-colors"
                    />
                    <button onClick={() => toast("Link copied! 📋")}>
                      <Send
                        size={22}
                        className="text-white hover:text-[#a8a8a8] transition-colors -rotate-12"
                      />
                    </button>
                  </div>
                  <button onClick={() => setSaved((s) => !s)}>
                    <Bookmark
                      size={24}
                      className={`transition-colors duration-150 ${saved ? "fill-white text-white" : "text-white hover:text-[#a8a8a8]"}`}
                    />
                  </button>
                </div>
                {likeCount > 0 && (
                  <p className="text-sm font-semibold text-white mt-2">
                    {likeCount.toLocaleString()}{" "}
                    {likeCount === 1 ? "like" : "likes"}
                  </p>
                )}
                <TimeAgo
                  date={post.created_at}
                  className="text-[10px] text-[#737373] uppercase tracking-widest mt-1 block"
                />
              </div>

              {user && (
                <form
                  onSubmit={handleComment}
                  className="flex items-center gap-2 px-4 py-3 border-t border-[#1a1a1a]"
                >
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment…"
                    className="flex-1 bg-transparent text-sm text-white placeholder-[#555] focus:outline-none"
                  />
                  <button
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

      {/* ✅ MODAL DELETE POST */}
      <ConfirmModal
        isOpen={showDeletePostModal}
        onClose={() => setShowDeletePostModal(false)}
        onConfirm={confirmDeletePost}
        title="Delete this post?"
        description="Are you sure you want to delete this post? This action cannot be undone and all associated data will be permanently removed."
        confirmText="Delete Post"
        isLoading={isDeletingPost}
      />

      {/* ✅ MODAL DELETE COMMENT */}
      <ConfirmModal
        isOpen={!!commentToDelete}
        onClose={() => setCommentToDelete(null)}
        onConfirm={confirmDeleteComment}
        title="Delete this comment?"
        description="Are you sure you want to delete this comment? It will be permanently removed from this post."
        confirmText="Delete Comment"
        isLoading={isDeletingComment}
      />
    </>
  );
}
