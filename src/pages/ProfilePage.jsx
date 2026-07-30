import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../services/api";
import toast from "react-hot-toast";
import {
  LogOut,
  Grid,
  Bookmark,
  Tag,
  Heart,
  MessageCircle,
} from "lucide-react";
import { getImageUrl } from "../utils/image";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

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
    toast.success("Logged out");
    navigate("/login");
  };

  if (!user) return null;

  const totalLikes = userPosts.reduce(
    (acc, p) => acc + (p.likes?.length || 0),
    0
  );

  const username = user.email
    ? user.email.split("@")[0]
    : user.name.toLowerCase().replace(/\s+/g, "");

  return (
    <div className="w-full max-w-[935px] mx-auto px-2 sm:px-4 md:px-8 py-4 sm:py-6 fade-in">
      {/* ── Instagram Profile Header ── */}
      <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-12 md:gap-16 mb-8">
        {/* Avatar Container */}
        <div className="flex-shrink-0">
          <div className="p-[3px] rounded-full animated-gradient shadow-xl">
            <div className="bg-[#000] rounded-full p-1 sm:p-1.5">
              <div className="w-20 h-20 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 flex items-center justify-center shadow-inner">
                <span className="text-3xl sm:text-5xl font-black text-white uppercase select-none">
                  {user.name?.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Details & Action Controls */}
        <div className="flex-1 w-full text-center sm:text-left space-y-4">
          {/* Row 1: Username & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 flex-wrap justify-center sm:justify-start">
            <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              {username}
            </h1>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={() => toast.success("Profile setting updated")}
                className="px-4 py-1.5 bg-[#262626] hover:bg-[#343434] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors"
              >
                Edit profile
              </button>
              <button
                onClick={() => toast("Archive is empty", { icon: "📦" })}
                className="px-4 py-1.5 bg-[#262626] hover:bg-[#343434] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors"
              >
                View archive
              </button>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
              >
                <LogOut size={15} />
                <span className="sm:hidden">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Row 2: Stats */}
          <div className="flex justify-center sm:justify-start gap-6 sm:gap-10 py-1 text-sm sm:text-base">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white">{userPosts.length}</span>
              <span className="text-gray-300 font-normal">posts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white">{totalLikes}</span>
              <span className="text-gray-300 font-normal">likes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-emerald-400">Active</span>
              <span className="text-gray-300 font-normal">status</span>
            </div>
          </div>

          {/* Row 3: Name & Bio */}
          <div className="space-y-0.5 text-center sm:text-left">
            <h2 className="font-bold text-white text-sm sm:text-base">
              {user.name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">{user.email}</p>
            <p className="text-xs text-pink-400 font-medium pt-1">
              ✨ Sevima Insta Official Member
            </p>
          </div>
        </div>
      </header>

      {/* ── Navigation Tabs (POSTS / SAVED / TAGGED) ── */}
      <div className="flex justify-center border-t border-[#262626] gap-12 sm:gap-16 mb-4 sm:mb-6">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 py-3 border-t-2 text-xs font-bold uppercase tracking-wider transition-all -mt-[1px] ${
            activeTab === "posts"
              ? "border-white text-white"
              : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          <Grid size={14} />
          <span>Posts</span>
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-2 py-3 border-t-2 text-xs font-bold uppercase tracking-wider transition-all -mt-[1px] ${
            activeTab === "saved"
              ? "border-white text-white"
              : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          <Bookmark size={14} />
          <span>Saved</span>
        </button>
        <button
          onClick={() => setActiveTab("tagged")}
          className={`flex items-center gap-2 py-3 border-t-2 text-xs font-bold uppercase tracking-wider transition-all -mt-[1px] ${
            activeTab === "tagged"
              ? "border-white text-white"
              : "border-transparent text-gray-500 hover:text-gray-300"
          }`}
        >
          <Tag size={14} />
          <span>Tagged</span>
        </button>
      </div>

      {/* ── Posts 3-Column Grid ── */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="spinner" />
        </div>
      ) : activeTab !== "posts" ? (
        <div className="py-16 text-center text-gray-500 text-sm">
          No {activeTab} posts to display.
        </div>
      ) : userPosts.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Grid size={28} />
          </div>
          <h3 className="text-white font-bold text-lg mb-1">No Posts Yet</h3>
          <p className="text-gray-500 text-xs sm:text-sm mb-4">
            When you share photos, they will appear on your profile.
          </p>
          <button
            onClick={() => navigate("/create")}
            className="px-5 py-2 animated-gradient text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Share your first photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 sm:gap-4 md:gap-7">
          {userPosts.map((post) => {
            const imageUrl = getImageUrl(post);
            return (
              <div
                key={post.id}
                onClick={() => navigate(`/post/${post.id}`)}
                className="aspect-square bg-[#1a1a1a] relative group cursor-pointer overflow-hidden rounded-sm sm:rounded-md"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={post.caption || "user post"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full p-4 flex items-center justify-center bg-white/5 text-gray-400 text-xs text-center">
                    {post.caption || "No image"}
                  </div>
                )}

                {/* Hover Overlay with Likes & Comments Count */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white text-sm sm:text-base font-bold">
                  <span className="flex items-center gap-1.5">
                    <Heart size={18} className="fill-white text-white" />
                    {post.likes?.length || 0}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle size={18} className="fill-white text-white" />
                    {post.comments?.length || 0}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
