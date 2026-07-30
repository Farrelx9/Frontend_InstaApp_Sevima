import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getPosts } from '../services/api';
import toast from 'react-hot-toast';
import { LogOut, User, Grid, Settings, Heart, MessageCircle } from 'lucide-react';
import { getImageUrl } from '../utils/image';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getPosts(1)
      .then((res) => {
        const posts = res.data?.data || [];
        const mine = posts.filter((p) => p.user_id === user.id);
        setUserPosts(mine);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [user]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login');
  };

  if (!user) return null;

  const totalLikes = userPosts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);

  return (
    <div className="max-w-[650px] mx-auto px-4 py-6 fade-in">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 mb-8 bg-[#111] border border-white/5 p-6 rounded-3xl">
        {/* Avatar */}
        <div className="relative">
          <div className="p-[3px] rounded-full animated-gradient shadow-xl shadow-pink-500/20">
            <div className="bg-[#0a0a0a] rounded-full p-1">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 flex items-center justify-center shadow-lg">
                <span className="text-3xl sm:text-4xl font-black text-white uppercase">
                  {user.name?.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Info & Stats */}
        <div className="flex-1 text-center sm:text-left space-y-4">
          <div>
            <h2 className="text-white font-extrabold text-2xl">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <p className="text-pink-400 text-xs mt-1 font-medium">✨ Sevima Insta Member</p>
          </div>

          {/* Stats Bar */}
          <div className="flex justify-center sm:justify-start gap-8 pt-2 border-t border-white/10">
            <div className="text-center sm:text-left">
              <p className="text-white font-black text-xl">{userPosts.length}</p>
              <p className="text-gray-500 text-xs font-semibold">Posts</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-white font-black text-xl">{totalLikes}</p>
              <p className="text-gray-500 text-xs font-semibold">Likes</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-emerald-400 font-black text-xl">Active</p>
              <p className="text-gray-500 text-xs font-semibold">Status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <div className="bg-[#111] border border-white/8 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400">
            <User size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 font-medium">Account Name</p>
            <p className="text-white font-semibold text-sm truncate">{user.name}</p>
          </div>
        </div>

        <div className="bg-[#111] border border-white/8 rounded-2xl p-4 flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Settings size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 font-medium">Registered Email</p>
            <p className="text-white font-semibold text-sm truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Posts Section Header */}
      <div className="flex items-center gap-2 text-white mb-4 border-b border-white/10 pb-3">
        <Grid size={18} className="text-pink-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Your Posts</span>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner" />
        </div>
      ) : userPosts.length === 0 ? (
        <div className="bg-[#111] border border-white/5 rounded-3xl p-10 text-center">
          <p className="text-gray-400 text-sm font-medium">You haven't posted anything yet.</p>
          <button
            onClick={() => navigate('/create')}
            className="mt-4 px-6 py-2.5 animated-gradient text-white text-xs font-bold rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-pink-500/20"
          >
            Create First Post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden mb-8">
          {userPosts.map((post) => {
            const imageUrl = getImageUrl(post);
            return (
              <div
                key={post.id}
                onClick={() => navigate(`/post/${post.id}`)}
                className="aspect-square bg-[#111] relative group cursor-pointer overflow-hidden rounded-xl border border-white/5"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={post.caption || 'user post'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full p-3 flex items-center justify-center bg-white/5 text-gray-400 text-xs text-center">
                    {post.caption || 'No image'}
                  </div>
                )}
                {/* Hover overlay with likes and comments */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-sm font-bold">
                  <span className="flex items-center gap-1">
                    <Heart size={16} className="fill-white text-white" /> {post.likes?.length || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={16} className="fill-white text-white" /> {post.comments?.length || 0}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Logout button */}
      <button
        id="logout-btn"
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-xs font-semibold"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  );
}
