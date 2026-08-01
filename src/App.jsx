import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import CreatePostPage from "./pages/CreatePostPage";
import PostDetailPage from "./pages/PostDetailPage";
import ProfilePage from "./pages/ProfilePage";
import { MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import "./App.css";

function AppLayout({ children }) {
  const [showChat, setShowChat] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`min-h-screen bg-black text-[#f5f5f5] relative grid grid-cols-1 sm:grid-cols-[auto_1fr] ${
        isCollapsed ? "lg:grid-cols-[72px_1fr]" : "lg:grid-cols-[240px_1fr]"
      } transition-[grid-template-columns] duration-300 ease-in-out`}
    >
      {/* ── Left Sidebar Navigation ── */}
      <Navbar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      {/* ── Main Canvas Area ── */}
      <div
        className="
          min-w-0 w-full flex justify-center
          px-2 sm:px-4 lg:px-8
          pt-[60px] pb-[80px] sm:pt-6 sm:pb-8
        "
      >
        {/* Centered Content Container */}
        {/* max-w-2xl menjaga feed tetap proporsional di tablet landscape */}
        <main className="w-full max-w-7xl mx-auto flex justify-center">
          <div className="w-full min-w-0">{children}</div>
        </main>
      </div>

      {/* ── Floating Direct Messages Widget ─ */}
      <div className="hidden sm:block fixed bottom-5 right-4 lg:right-6 z-40">
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute bottom-14 right-0 w-[320px] max-w-[90vw] bg-[#111] border border-[#262626] rounded-2xl p-4 shadow-2xl mb-2"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#262626] mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare size={15} className="text-[#0095f6]" />
                  <span className="text-sm font-bold text-white">
                    Direct Messages
                  </span>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="p-1 text-[#737373] hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-1">
                {[
                  {
                    name: "Farrel",
                    msg: "Hey! Great app ",
                    time: "2m",
                    color: "from-pink-500 to-rose-400",
                  },
                  {
                    name: "Andi",
                    msg: "Check out the new design!",
                    time: "1h",
                    color: "from-purple-500 to-indigo-400",
                  },
                ].map((dm) => (
                  <div
                    key={dm.name}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-r ${dm.color} flex items-center justify-center font-bold text-xs text-white shrink-0`}
                    >
                      {dm.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {dm.name}
                      </p>
                      <p className="text-[11px] text-[#737373] truncate">
                        {dm.msg}
                      </p>
                    </div>
                    <span className="text-[10px] text-[#737373] shrink-0">
                      {dm.time}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowChat((p) => !p)}
          className="flex items-center gap-2.5 bg-[#111] border border-[#262626] hover:border-[#363636] rounded-full px-4 py-2.5 shadow-xl transition-all duration-200 group"
        >
          <div className="relative">
            <MessageSquare
              size={17}
              className="text-white group-hover:text-[#0095f6] transition-colors"
            />
            <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-pink-500 text-[8px] font-black text-white flex items-center justify-center rounded-full">
              2
            </span>
          </div>
          <span className="text-xs font-semibold text-white">Messages</span>
        </motion.button>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#fff",
              border: "1px solid #262626",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: "600",
              fontFamily: "Inter, sans-serif",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            },
            success: {
              iconTheme: { primary: "#0095f6", secondary: "#fff" },
              duration: 2500,
            },
            error: {
              iconTheme: { primary: "#ed4956", secondary: "#fff" },
              duration: 3000,
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <HomePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CreatePostPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/post/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PostDetailPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id?"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
