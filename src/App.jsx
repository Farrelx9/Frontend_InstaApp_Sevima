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
import { MessageSquare } from "lucide-react";
import "./App.css";

// AppLayout: Sidebar kiri slim (72px) + main content terpusat
function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#000]">
      {/* Left sidebar (fixed) */}
      <Navbar />

      {/* Main content area — offset dari sidebar kiri */}
      {/* Mobile: full width dengan padding top/bottom */}
      {/* Desktop (md+): margin kiri 72px, konten terpusat */}
      <div className="flex-1 md:ml-[72px]">
        <div className="w-full flex justify-center">
          {/* Inner container: max 935px sesuai Instagram, padding kiri-kanan */}
          <div className="w-full max-w-[935px] px-4 pt-16 pb-20 md:pt-8 md:pb-10">
            {children}
          </div>
        </div>
      </div>

      {/* Floating Messages Pill */}
      <div className="hidden md:flex fixed bottom-5 right-5 z-40 bg-[#1a1a1a] border border-white/10 hover:border-white/20 rounded-full px-5 py-3 items-center gap-3 shadow-2xl cursor-pointer hover:bg-[#222] transition-all group select-none">
        <div className="relative">
          <MessageSquare size={18} className="text-white" />
          <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">5</span>
        </div>
        <span className="text-sm font-semibold text-white">Messages</span>
        <div className="flex -space-x-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 border-2 border-[#1a1a1a] flex items-center justify-center text-[9px] font-bold text-white">F</div>
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 border-2 border-[#1a1a1a] flex items-center justify-center text-[9px] font-bold text-white">A</div>
        </div>
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
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
            },
            success: {
              iconTheme: { primary: "#e6683c", secondary: "#fff" },
              duration: 2500,
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
              duration: 3000,
            },
          }}
        />

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><AppLayout><HomePage /></AppLayout></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><AppLayout><CreatePostPage /></AppLayout></ProtectedRoute>} />
          <Route path="/post/:id" element={<ProtectedRoute><AppLayout><PostDetailPage /></AppLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
