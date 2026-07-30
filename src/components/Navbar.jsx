import { Link, useLocation } from "react-router-dom";
import {
  Home,
  PlusSquare,
  User,
  Heart,
  LogOut,
  Menu,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import InstagramLogo from "./InstagramLogo";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "./Avatar";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const NAV_ITEMS = [
  { id: "nav-home", label: "Home", path: "/", icon: Home, fillOnActive: true },
  { id: "nav-search", label: "Search", path: null, icon: Search },
  { id: "nav-create", label: "Create", path: "/create", icon: PlusSquare },
  { id: "nav-notifications", label: "Notifications", path: null, icon: Heart },
  { id: "nav-profile", label: "Profile", path: "/profile", icon: User },
];

export default function Navbar({ isCollapsed, onToggleCollapse }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [tooltip, setTooltip] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const isActive = (path) => path && pathname === path;

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out successfully");
  };

  const handleNotif = () => toast("No new notifications", { icon: "🔔" });

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          DESKTOP & TABLET LEFT SIDEBAR (≥ 640px / sm+)
          Collapsible:
          - Expanded Mode: 240px
          - Collapsed / Slim Mode: 72px
          ═══════════════════════════════════════════════════ */}
      <aside
        className={`
        hidden sm:flex flex-col
        fixed top-0 left-0 bottom-0 z-50
        bg-black border-r border-[#262626]
        py-6 px-2.5
        items-center ${isCollapsed ? "lg:items-center w-[72px]" : "lg:items-start lg:w-[240px] w-[72px]"}
        justify-between
        transition-all duration-300 ease-in-out
        select-none overflow-hidden
      `}
      >
        {/* ── Top Section: Logo + Nav Links ── */}
        <div className="flex flex-col items-center lg:items-start gap-2 w-full">
          {/* Logo & Toggle Header */}
          <div className="flex items-center justify-between w-full px-1 mb-2">
            <Link
              to="/"
              id="sidebar-logo"
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/8 transition-all duration-200 overflow-hidden"
              onMouseEnter={() => setTooltip("logo")}
              onMouseLeave={() => setTooltip(null)}
            >
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="shrink-0">
                <InstagramLogo size={26} className="text-white" />
              </motion.div>
              {!isCollapsed && (
                <span className="hidden lg:inline text-xl font-bold gradient-text tracking-tight whitespace-nowrap">
                  Sevima
                </span>
              )}
            </Link>

            {/* Collapse Toggle Button (Desktop >= 1024px) */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col items-center lg:items-start gap-1 w-full">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const onClick = item.path === null
                ? (item.id === "nav-notifications" ? handleNotif : undefined)
                : undefined;

              const inner = (
                <>
                  {/* Active Indicator Pill */}
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-white/10 rounded-xl"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}

                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className="relative z-10 shrink-0"
                  >
                    {item.path === "/profile" && user ? (
                      <div className={`p-[2px] rounded-full ${active ? "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600" : ""}`}>
                        <Avatar name={user.name} size="sm" className="w-7 h-7 text-[11px]" />
                      </div>
                    ) : (
                      <Icon
                        size={24}
                        fill={active && item.fillOnActive ? "currentColor" : "none"}
                        strokeWidth={active ? 2.5 : 2}
                        className={`transition-colors duration-150 ${active ? "text-white" : "text-[#a8a8a8] group-hover:text-white"}`}
                      />
                    )}
                  </motion.div>

                  {/* Label (only when not collapsed on desktop) */}
                  {!isCollapsed && (
                    <span className={`hidden lg:inline text-[15px] relative z-10 transition-colors duration-150 truncate ${active ? "font-semibold text-white" : "font-normal text-[#f5f5f5] group-hover:text-white"}`}>
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip ONLY on collapsed / slim mode */}
                  <AnimatePresence>
                    {isCollapsed && tooltip === item.id && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.12 }}
                        className="absolute left-[72px] bg-[#1a1a1a] text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#333] shadow-xl whitespace-nowrap z-50 pointer-events-none"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              );

              const cls = `
                relative flex items-center gap-4
                p-3 rounded-xl w-full
                transition-colors duration-200
                hover:bg-white/8 group
                ${active ? "cursor-default" : "cursor-pointer"}
              `;

              return item.path ? (
                <Link
                  key={item.id}
                  to={item.path}
                  id={item.id}
                  className={cls}
                  onMouseEnter={() => setTooltip(item.id)}
                  onMouseLeave={() => setTooltip(null)}
                >
                  {inner}
                </Link>
              ) : (
                <button
                  key={item.id}
                  id={item.id}
                  onClick={onClick}
                  className={cls}
                  onMouseEnter={() => setTooltip(item.id)}
                  onMouseLeave={() => setTooltip(null)}
                >
                  {inner}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Bottom Section: Logout & More ── */}
        <div className="flex flex-col items-center lg:items-start gap-1 w-full border-t border-[#262626] pt-4">
          {user && (
            <button
              id="sidebar-logout"
              onClick={handleLogout}
              className="
                relative flex items-center gap-4
                p-3 rounded-xl w-full
                text-[#ed4956] hover:bg-[#ed4956]/10
                transition-colors duration-200 group
              "
              onMouseEnter={() => setTooltip("logout")}
              onMouseLeave={() => setTooltip(null)}
            >
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} className="shrink-0">
                <LogOut size={22} />
              </motion.div>
              {!isCollapsed && (
                <span className="hidden lg:inline text-[15px] font-semibold truncate">Sign Out</span>
              )}
            </button>
          )}

          <button
            onClick={onToggleCollapse}
            className="
              flex items-center gap-4
              p-3 rounded-xl w-full
              text-[#a8a8a8] hover:bg-white/8 hover:text-white
              transition-colors duration-200
            "
            title="Toggle Sidebar Layout"
          >
            <Menu size={24} className="shrink-0" />
            {!isCollapsed && (
              <span className="hidden lg:inline text-[15px] font-normal truncate">
                Collapse Menu
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════
          MOBILE TOP BAR WITH HAMBURGER DRAWER (< 640px / sm)
          ═══════════════════════════════════════════════════ */}
      <header className="sm:hidden fixed top-0 inset-x-0 z-50 h-14 bg-black/95 backdrop-blur-xl border-b border-[#262626]">
        <div className="flex items-center justify-between h-full px-4 max-w-[600px] mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-1.5 text-gray-300 hover:text-white rounded-lg"
            >
              <Menu size={22} />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg animated-gradient flex items-center justify-center shrink-0">
                <InstagramLogo size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">Sevima</span>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleNotif} className="p-2 text-[#a8a8a8] hover:text-white">
              <Heart size={22} />
            </button>
            <Link to="/create" className="p-2 text-[#a8a8a8] hover:text-white">
              <PlusSquare size={22} />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileDrawerOpen(false)}
            className="sm:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-64 bg-[#121212] border-r border-[#262626] h-full p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#262626] mb-4">
                  <div className="flex items-center gap-2">
                    <InstagramLogo size={22} className="text-white" />
                    <span className="font-bold text-white text-lg gradient-text">Sevima</span>
                  </div>
                  <button onClick={() => setMobileDrawerOpen(false)} className="p-1 text-gray-400">
                    <X size={20} />
                  </button>
                </div>
                <nav className="space-y-2">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return item.path ? (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setMobileDrawerOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-xl text-white hover:bg-white/10 font-semibold"
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <button
                        key={item.id}
                        onClick={() => {
                          setMobileDrawerOpen(false);
                          if (item.id === "nav-notifications") handleNotif();
                        }}
                        className="flex items-center gap-3 p-3 rounded-xl text-white hover:bg-white/10 font-semibold w-full text-left"
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
              {user && (
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 font-bold"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 h-14 bg-black/95 backdrop-blur-xl border-t border-[#262626]">
        <div className="flex items-center justify-around h-full px-2 max-w-[600px] mx-auto">
          <Link to="/" className={`p-3 transition-colors ${pathname === "/" ? "text-white" : "text-[#737373]"}`}>
            <Home size={24} fill={pathname === "/" ? "currentColor" : "none"} />
          </Link>
          <button onClick={handleNotif} className="p-3 text-[#737373] hover:text-white transition-colors">
            <Heart size={24} />
          </button>
          <Link to="/create" className={`p-3 transition-colors ${pathname === "/create" ? "text-white" : "text-[#737373]"}`}>
            <PlusSquare size={24} />
          </Link>
          <Link to="/profile" className={`p-3 transition-colors ${pathname === "/profile" ? "text-white" : "text-[#737373]"}`}>
            {user ? (
              <div className={`p-[1.5px] rounded-full ${pathname === "/profile" ? "bg-white" : ""}`}>
                <Avatar name={user.name} size="sm" className="w-6 h-6 text-[10px]" />
              </div>
            ) : (
              <User size={24} fill={pathname === "/profile" ? "currentColor" : "none"} />
            )}
          </Link>
        </div>
      </nav>
    </>
  );
}
