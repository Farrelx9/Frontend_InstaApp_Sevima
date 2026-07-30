import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, getComments, createComment, deleteComment, toggleLike, deletePost } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  Heart, MessageCircle, Send, ArrowLeft, Trash2
} from 'lucide-react';
import Avatar from '../components/Avatar';
import TimeAgo from '../components/TimeAgo';
import { getImageUrl } from '../utils/image';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, commentRes] = await Promise.all([
          getPost(id),
          getComments(id),
        ]);
        const p = postRes.data;
        setPost(p);
        setComments(commentRes.data);
        setLikeCount(p.likes?.length || 0);
        setLiked(p.likes?.some((l) => l.user_id === user?.id) || false);
      } catch {
        toast.error('Post not found');
        navigate('/');
      } finally {
        setLoadingPost(false);
      }
    };
    fetchData();
  }, [id, user, navigate]);

  const handleLike = async () => {
    if (!user) return toast.error('Please login first');
    if (likeLoading) return;
    setLikeLoading(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));
    try {
      await toggleLike(id);
    } catch {
      setLiked(wasLiked);
      setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
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
      setCommentText('');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(id, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success('Comment deleted');
    } catch {
      toast.error('Cannot delete comment');
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      await deletePost(id);
      toast.success('Post deleted');
      navigate('/');
    } catch {
      toast.error('Cannot delete post');
    }
  };

  const imageUrl = getImageUrl(post);

  if (loadingPost) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="max-w-[600px] mx-auto bg-[#111] border border-white/5 rounded-3xl overflow-hidden fade-in mt-4 mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
        <button
          id="detail-back-btn"
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-white font-semibold">Post</span>
      </div>

      {/* Post header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={post.user?.name} size="md" />
          <div>
            <p className="text-white font-semibold text-sm">{post.user?.name}</p>
            <TimeAgo date={post.created_at} className="text-gray-500 text-xs" />
          </div>
        </div>
        {user?.id === post.user_id && (
          <button
            id="delete-post-btn"
            onClick={handleDeletePost}
            className="p-2 rounded-full hover:bg-red-500/10 transition-colors text-gray-500 hover:text-red-400"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="w-full bg-[#111]">
          <img
            src={imageUrl}
            alt="post"
            className="w-full object-cover"
            style={{ maxHeight: '500px' }}
          />
        </div>
      )}

      {/* Actions */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center gap-4">
          <button
            id="like-btn"
            onClick={handleLike}
            className="flex items-center gap-1.5 group"
          >
            <Heart
              size={24}
              className={`transition-all group-hover:scale-110 ${
                liked ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-red-400'
              }`}
            />
            <span className={`text-sm font-medium ${liked ? 'text-red-400' : 'text-gray-400'}`}>
              {likeCount}
            </span>
          </button>
          <div className="flex items-center gap-1.5">
            <MessageCircle size={24} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-400">{comments.length}</span>
          </div>
        </div>

        {/* Caption */}
        {post.caption && (
          <div className="mt-3">
            <p className="text-sm text-white">
              <span className="font-semibold mr-2">{post.user?.name}</span>
              {post.caption}
            </p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-white/5 mx-4 mt-3" />

      {/* Comments section */}
      <div className="px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h3>
        <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3 group">
              <Avatar name={comment.user?.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">
                  <span className="font-semibold mr-2">{comment.user?.name}</span>
                  {comment.body}
                </p>
                <TimeAgo date={comment.created_at} className="text-xs text-gray-600 mt-0.5" />
              </div>
              {user?.id === comment.user_id && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-gray-600 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-gray-600 text-sm">No comments yet. Be the first!</p>
          )}
        </div>
      </div>

      {/* Comment input */}
      {user && (
        <div className="border-t border-white/5 px-4 py-3 sticky bottom-0 bg-[#0a0a0a]">
          <form onSubmit={handleComment} className="flex items-center gap-3">
            <Avatar name={user?.name} size="sm" />
            <div className="flex-1 relative">
              <input
                id="comment-input"
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-gray-600 focus:border-pink-500/40 pr-10 transition-all"
              />
              <button
                id="comment-submit-btn"
                type="submit"
                disabled={!commentText.trim() || submitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-300 disabled:text-gray-600 transition-colors"
              >
                <Send size={15} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
