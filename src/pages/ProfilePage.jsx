import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../services/api";
import toast from "react-hot-toast";
import { LogOut, Grid, Bookmark, Tag, Heart, MessageCircle, Plus } from "lucide-react";
import { getImageUrl } from "../utils/image";
import { motion } from "framer-motion";

const TABS = [
  { id: "posts", label: "POSTS", icon: Grid },
  { id: "saved", label: "SAVED", icon: Bookmark },
  { id: "tagged", label: "TAGGED", icon: Tag },
];

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
        const all = res.data?.data || [];
        setUserPosts(all.filter((p) => p.user_id === user.id));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!user) return null;

  const totalLikes = userPosts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);
  const username = user.email
    ? user.email.split("@")[0]
    : user.name.toLowerCase().replace(/\s+/g, "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-[850px] mx-auto py-6 px-4 sm:px-6"
    >
      {/* ════════════════════════════════════════════
          CLEAN PROFILE HEADER
          ════════════════════════════════════════════ */}
      <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 pb-8 border-b border-[#262626] mb-8">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="p-[3px] rounded-full animated-gradient shadow-xl">
            <div className="bg-black rounded-full p-1">
              <div className="
                w-24 h-24 sm:w-32 sm:h-32
                rounded-full
                bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400
                flex items-center justify-center
                shadow-inner
              ">
                <span className="text-4xl sm:text-5xl font-black text-white uppercase select-none">
                  {user.name?.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 w-full text-center sm:text-left space-y-4">
          {/* Username & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 flex-wrap justify-center sm:justify-start">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {username}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/create")}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition-colors duration-200"
              >
                <Plus size={15} />
                <span>New Post</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#ed4956]/10 hover:bg-[#ed4956]/20 text-[#ed4956] text-xs font-semibold rounded-xl transition-colors duration-200"
                title="Sign Out"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex justify-center sm:justify-start gap-6 sm:gap-8 text-sm pt-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-base">{userPosts.length}</span>
              <span className="text-[#a8a8a8]">posts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-base">{totalLikes}</span>
              <span className="text-[#a8a8a8]">likes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-emerald-400 text-base">Active</span>
              <span className="text-[#a8a8a8]">account</span>
            </div>
          </div>

          {/* Bio Info */}
          <div className="space-y-0.5 text-center sm:text-left">
            <p className="font-semibold text-white text-sm">{user.name}</p>
            <p className="text-xs text-[#a8a8a8]">{user.email}</p>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════
          NAVIGATION TABS
          ════════════════════════════════════════════ */}
      <div className="flex justify-center gap-10 sm:gap-14 border-b border-[#262626] mb-6">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                flex items-center gap-2 py-3 border-b-2 -mb-px
                text-xs font-bold uppercase tracking-wider
                transition-all duration-200
                ${active ? "border-white text-white" : "border-transparent text-[#737373] hover:text-[#a8a8a8]"}
              `}
            >
              <Icon size={14} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════
          POSTS GRID
          ════════════════════════════════════════════ */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="spinner" />
        </div>
      ) : activeTab !== "posts" ? (
        <div className="py-16 text-center text-[#737373] text-sm font-medium">
          No {activeTab} posts yet.
        </div>
      ) : userPosts.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#333] flex items-center justify-center text-[#737373]">
            <Grid size={28} />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">No Posts Yet</h3>
            <p className="text-[#737373] text-xs mt-1">
              When you share photos, they will appear on your profile.
            </p>
          </div>
          <button
            onClick={() => navigate("/create")}
            className="flex items-center gap-2 px-5 py-2.5 animated-gradient text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
          >
            <Plus size={16} />
            <span>Share Your First Photo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {userPosts.map((post) => {
            const img = getImageUrl(post);
            return (
              <button
                key={post.id}
                onClick={() => navigate(`/post/${post.id}`)}
                className="aspect-square bg-[#111] relative group overflow-hidden rounded-2xl border border-[#262626] focus:outline-none"
              >
                {img ? (
                  <img
                    src={img}
                    alt={post.caption || "post"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 block"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#737373] text-xs p-4 text-center">
                    {post.caption || "No image"}
                  </div>
                )}

                {/* Hover overlay */}
                <div className="
                  absolute inset-0 bg-black/60
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                  flex items-center justify-center gap-6
                  text-white font-bold
                ">
                  <span className="flex items-center gap-1.5 text-sm">
                    <Heart size={18} className="fill-white text-white" />
                    {post.likes?.length || 0}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <MessageCircle size={18} className="fill-white text-white" />
                    {post.comments?.length || 0}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
