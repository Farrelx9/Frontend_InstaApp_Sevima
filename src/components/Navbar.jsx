import { Link, useLocation } from "react-router-dom";
import {
  Home,
  PlusSquare,
  User,
  Heart,
  LogOut,
  Menu,
} from "lucide-react";
import InstagramLogo from "./InstagramLogo";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "./Avatar";
import toast from "react-hot-toast";

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
  };

  const handleNotificationClick = () => {
    toast("No new notifications", { icon: "🔔" });
  };

  return (
    <>
      {/* ========================================================= */}
      {/* INSTAGRAM SLIM LEFT SIDEBAR (Desktop & Tablet: >= 768px)  */}
      {/* ========================================================= */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-50 bg-[#000] border-r border-white/10 w-[72px] py-6 px-2 items-center justify-between transition-all">
        {/* Top Logo & Main Nav */}
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Logo */}
          <Link
            to="/"
            id="desktop-sidebar-logo"
            className="p-3 rounded-2xl hover:bg-white/10 transition-colors group"
            title="Sevima Insta"
          >
            <InstagramLogo
              size={24}
              className="text-white group-hover:scale-110 transition-transform"
            />
          </Link>

          {/* Nav Icons */}
          <nav className="flex flex-col items-center gap-2 w-full mt-2">
            <Link
              to="/"
              id="sidebar-home"
              title="Home"
              className={`p-3 rounded-2xl transition-all relative ${
                isActive("/")
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Home size={24} fill={isActive("/") ? "currentColor" : "none"} />
            </Link>

            <Link
              to="/create"
              id="sidebar-create"
              title="Create Post"
              className={`p-3 rounded-2xl transition-all ${
                isActive("/create")
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <PlusSquare size={24} />
            </Link>

            <button
              onClick={handleNotificationClick}
              title="Notifications"
              className="p-3 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all relative"
            >
              <Heart size={24} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
            </button>

            <Link
              to="/profile"
              id="sidebar-profile"
              title="Profile"
              className={`p-3 rounded-2xl transition-all ${
                isActive("/profile")
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {user ? (
                <Avatar
                  name={user.name}
                  size="sm"
                  className="w-6 h-6 text-[10px]"
                />
              ) : (
                <User size={24} />
              )}
            </Link>
          </nav>
        </div>

        {/* Bottom Menu & Logout */}
        <div className="flex flex-col items-center gap-2 w-full border-t border-white/10 pt-4">
          {user && (
            <button
              id="sidebar-logout"
              onClick={handleLogout}
              title="Sign Out"
              className="p-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={22} />
            </button>
          )}

          <button
            title="More Options"
            className="p-3 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MOBILE TOP BAR (< 768px)                                   */}
      {/* ========================================================= */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#000]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[470px] mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" id="mobile-top-logo" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg animated-gradient">
              <InstagramLogo size={18} className="text-white" />
            </div>
            <span className="text-xl font-black gradient-text tracking-tight">
              Sevima
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNotificationClick}
              className="p-2 text-gray-400 hover:text-white"
            >
              <Heart size={20} />
            </button>
            <Link to="/create" className="p-2 text-gray-400 hover:text-white">
              <PlusSquare size={20} />
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MOBILE BOTTOM NAV (< 768px)                                */}
      {/* ========================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#000]/95 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-[470px] mx-auto h-16 flex items-center justify-around px-6">
          <Link
            to="/"
            className={`p-2 transition-all ${isActive("/") ? "text-white" : "text-gray-600"}`}
          >
            <Home size={22} fill={isActive("/") ? "white" : "none"} />
          </Link>
          <Link to="/create" className="p-3 rounded-2xl animated-gradient">
            <PlusSquare size={20} className="text-white" />
          </Link>
          <Link
            to="/profile"
            className={`p-2 transition-all ${isActive("/profile") ? "text-white" : "text-gray-600"}`}
          >
            <User size={22} fill={isActive("/profile") ? "white" : "none"} />
          </Link>
        </div>
      </nav>
    </>
  );
}
