import { Link, useLocation, useNavigate } from "react-router-dom";
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
  AlertCircle,
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
  const navigate = useNavigate();

  // State untuk Modal Konfirmasi Sign Out
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const isActive = (path) => path && pathname === path;

  const handleLogoutRequest = () => {
    setShowSignOutModal(true);
  };

  const confirmLogout = async () => {
    setShowSignOutModal(false);
    await logout();
    toast.success("Signed out successfully");
    navigate("/login", { replace: true });
  };

  const handleNotif = () => toast("No new notifications", { icon: "🔔" });

  // Class dasar untuk konsistensi item navigasi
  const navItemClass = `
    relative flex items-center w-full rounded-xl 
    transition-all duration-200 ease-in-out group
    hover:bg-white/8 active:scale-[0.98]
  `;

  return (
    <>
      {/* ═════════════════════════════════════════════════
          DESKTOP & TABLET LEFT SIDEBAR (≥ 640px / sm+)
          PERBAIKAN:
          - Single Toggle: Tombol panah ada di BAWAH (konsisten Desktop/Tablet).
          - Sign Out Modal: Animasi smooth dengan backdrop blur.
          - Fixed Icon Size: Container w-6 h-6 agar ikon selalu tegak lurus.
          ═══════════════════════════════════════════════════ */}
      <aside
        className={`
          hidden sm:flex flex-col
          sticky top-0 h-screen z-50
          w-full bg-black border-r border-[#262626]
          py-6 px-2.5
          items-center justify-between
          transition-all duration-300 ease-in-out
          select-none overflow-y-auto no-scrollbar
        `}
      >
        {/* ─ Top Section: Logo + Nav Links ── */}
        <div className="flex flex-col items-center sm:items-start gap-4 w-full">
          {/* Logo Area */}
          <div className="flex items-center justify-between w-full px-1 mb-2 min-h-[44px]">
            <Link
              to="/"
              id="sidebar-logo"
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/8 transition-colors duration-200 overflow-visible"
              onMouseEnter={() => setTooltip("logo")}
              onMouseLeave={() => setTooltip(null)}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="shrink-0 flex items-center justify-center w-[26px] h-[26px]"
              >
                <InstagramLogo size={26} className="text-white" />
              </motion.div>

              {/* Logo Text: Muncul di Tablet+, Hidden di Icon-Only Mode */}
              {!isCollapsed && (
                <span className="hidden sm:inline text-xl font-bold gradient-text tracking-tight whitespace-nowrap leading-none pt-0.5">
                  Sevima
                </span>
              )}
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col items-center sm:items-start gap-1 w-full">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              const inner = (
                <>
                  {/* Active Background Pill */}
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-white/10 rounded-xl"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}

                  {/* Icon Container: FIXED SIZE & CENTERED */}
                  <div className="relative z-10 shrink-0 flex items-center justify-center w-6 h-6 ml-1 sm:ml-0.5">
                    {item.path === "/profile" && user ? (
                      <div
                        className={`p-[1.5px] rounded-full ${active ? "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600" : ""}`}
                      >
                        <Avatar
                          name={user.name}
                          size="sm"
                          className="w-[22px] h-[22px] text-[10px]"
                        />
                      </div>
                    ) : (
                      <Icon
                        size={24} // KUNCI: Ukuran tetap 24px
                        strokeWidth={active ? 2.5 : 2}
                        fill={
                          active && item.fillOnActive ? "currentColor" : "none"
                        }
                        className={`transition-colors duration-150 ${
                          active
                            ? "text-white"
                            : "text-[#a8a8a8] group-hover:text-white"
                        }`}
                      />
                    )}
                  </div>

                  {/* Label Text: Consistent Typography */}
                  {!isCollapsed && (
                    <span
                      className={`
                        hidden sm:inline relative z-10 truncate leading-none pt-0.5
                        text-[15px] font-medium tracking-wide
                        transition-colors duration-150
                        ${active ? "font-bold text-white" : "text-[#f5f5f5] group-hover:text-white"}
                      `}
                    >
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip for Collapsed Mode */}
                  <AnimatePresence>
                    {isCollapsed && tooltip === item.id && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        className="absolute left-[72px] bg-[#1a1a1a] text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#333] shadow-xl whitespace-nowrap z-50 pointer-events-none"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              );

              const baseCls = `${navItemClass} p-3 gap-4 ${active ? "cursor-default" : "cursor-pointer"}`;

              return item.path ? (
                <Link
                  key={item.id}
                  to={item.path}
                  id={item.id}
                  className={baseCls}
                  onMouseEnter={() => setTooltip(item.id)}
                  onMouseLeave={() => setTooltip(null)}
                >
                  {inner}
                </Link>
              ) : (
                <button
                  key={item.id}
                  id={item.id}
                  onClick={
                    item.id === "nav-notifications" ? handleNotif : undefined
                  }
                  className={baseCls}
                  onMouseEnter={() => setTooltip(item.id)}
                  onMouseLeave={() => setTooltip(null)}
                >
                  {inner}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Bottom Section: Toggle & Logout ── */}
        <div className="flex flex-col items-center sm:items-start gap-1 w-full border-t border-[#262626] pt-4 pb-10 mt-2">
          {/* SINGLE TOGGLE BUTTON (Desktop & Tablet) */}
          {/* Posisinya konsisten di atas Sign Out */}
          <button
            onClick={onToggleCollapse}
            className={`${navItemClass} p-3 gap-4 text-[#a8a8a8] hover:bg-white/8 hover:text-white group cursor-pointer hidden sm:flex`}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <div className="relative z-10 shrink-0 flex items-center justify-center w-6 h-6 ml-1 sm:ml-0.5">
              {isCollapsed ? (
                <ChevronRight size={24} />
              ) : (
                <ChevronLeft size={24} />
              )}
            </div>
            {!isCollapsed && (
              <span className="hidden sm:inline text-[15px] font-medium leading-none pt-0.5 truncate">
                Collapse
              </span>
            )}
          </button>

          {user && (
            <button
              id="sidebar-logout"
              onClick={handleLogoutRequest}
              className={`${navItemClass} p-3 gap-4 text-[#ed4956] hover:bg-[#ed4956]/10 group cursor-pointer`}
              onMouseEnter={() => setTooltip("logout")}
              onMouseLeave={() => setTooltip(null)}
            >
              <div className="relative z-10 shrink-0 flex items-center justify-center w-6 h-6 ml-1 sm:ml-0.5">
                <LogOut
                  size={24}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </div>
              {!isCollapsed && (
                <span className="hidden sm:inline text-[15px] font-medium leading-none pt-0.5 truncate">
                  Sign Out
                </span>
              )}
            </button>
          )}
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════
    SIGN OUT CONFIRMATION MODAL
    ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showSignOutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowSignOutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-gradient-to-b from-[#1e1e1e] to-[#161616] border border-[#2a2a2a] rounded-3xl p-14 shadow-2xl shadow-black/50 relative overflow-hidden flex flex-col justify-center"
            >
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#ed4956]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col items-center text-center relative">
                <div className="relative w-16 h-16 mb-6 shrink-0">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-[#ed4956]/20"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <div className="relative w-16 h-16 rounded-full bg-[#ed4956]/10 border border-[#ed4956]/20 flex items-center justify-center">
                    <AlertCircle
                      size={26}
                      className="text-[#ed4956]"
                      strokeWidth={2}
                    />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 shrink-0">
                  Sign out?
                </h3>

                <p className="text-sm text-[#a8a8a8] leading-relaxed max-w-[280px] mx-auto mb-8">
                  You'll need to log back in to access your account and continue
                  where you left off.
                </p>
              </div>

              <div className="flex gap-3 px-1">
                <button
                  onClick={() => setShowSignOutModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-[#262626] text-white font-semibold text-sm hover:bg-[#333] active:scale-[0.98] transition-all duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-3 rounded-2xl bg-[#ed4956] text-white font-semibold text-sm hover:bg-[#d63b48] active:scale-[0.98] transition-all duration-150 shadow-lg shadow-[#ed4956]/20"
                >
                  Sign out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ══════════════════════════════════════════════════
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
            <button
              onClick={handleNotif}
              className="p-2 text-[#a8a8a8] hover:text-white"
            >
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
                    <span className="font-bold text-white text-lg gradient-text">
                      Sevima
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1 text-gray-400"
                  >
                    <X size={20} />
                  </button>
                </div>
                <nav className="space-y-2">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return item.path ? (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-colors ${active ? "bg-white/10 text-white" : "text-white hover:bg-white/10"}`}
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
                    handleLogoutRequest(); // Buka modal juga di mobile drawer
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
          <Link
            to="/"
            className={`p-3 transition-colors ${pathname === "/" ? "text-white" : "text-[#737373]"}`}
          >
            <Home size={24} fill={pathname === "/" ? "currentColor" : "none"} />
          </Link>
          <button
            onClick={handleNotif}
            className="p-3 text-[#737373] hover:text-white transition-colors"
          >
            <Heart size={24} />
          </button>
          <Link
            to="/create"
            className={`p-3 transition-colors ${pathname === "/create" ? "text-white" : "text-[#737373]"}`}
          >
            <PlusSquare size={24} />
          </Link>
          <Link
            to="/profile"
            className={`p-3 transition-colors ${pathname === "/profile" ? "text-white" : "text-[#737373]"}`}
          >
            {user ? (
              <div
                className={`p-[1.5px] rounded-full ${pathname === "/profile" ? "bg-white" : ""}`}
              >
                <Avatar
                  name={user.name}
                  size="sm"
                  className="w-6 h-6 text-[10px]"
                />
              </div>
            ) : (
              <User
                size={24}
                fill={pathname === "/profile" ? "currentColor" : "none"}
              />
            )}
          </Link>
        </div>
      </nav>
    </>
  );
}
