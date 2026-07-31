import { useState, useSyncExternalStore } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { login as apiLogin } from "../services/api";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import InstagramLogo from "../components/InstagramLogo";
import ReactBitsBackground from "../components/ReactBitsBackground";

function subscribe(callback) {
  const mq = window.matchMedia("(min-width: 1280px)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia("(min-width: 1280px)").matches;
}

function getServerSnapshot() {
  return false;
}

function useIsDesktop() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiLogin(form);
      login(res.data.token, res.data.user);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // Reusable class untuk input agar konsisten
  const inputClass =
    "w-full h-[56px] bg-neutral-900/40 border border-neutral-800 rounded-xl px-4 text-sm text-white placeholder-neutral-500 focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/20 outline-none transition-all duration-300";

  return (
    <div className="min-h-screen w-full bg-black text-white flex">
      {/* KIRI - Background Area */}
      {isDesktop && (
        <div className="hidden xl:block xl:w-[62%] relative overflow-hidden">
          <ReactBitsBackground />
          <div className="absolute top-10 left-10 flex items-center gap-2.5 z-10">
            <InstagramLogo size={26} className="text-white" />
            <span className="text-lg font-semibold tracking-wide">
              Sevima Insta
            </span>
          </div>
        </div>
      )}

      {/* KANAN - Form Area */}
      <div className="w-full xl:w-[38%] flex flex-col items-center justify-center px-6 sm:px-12 xl:px-16 xl:border-l xl:border-neutral-900/50">
        <div className="w-full max-w-[400px] mx-auto flex flex-col gap-8">
          {/* HEADER MODERN */}
          <div className="flex flex-col gap-3 text-center xl:text-left">
            <div className="xl:hidden flex justify-center mb-2">
              <InstagramLogo size={40} className="text-white" />
            </div>
            {/* Judul Modern: Singkat dan Personal */}
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Enter your details to access your account.
            </p>
          </div>

          {/* FORM INPUTS */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email address"
              className={inputClass}
            />

            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
              className={inputClass}
            />

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full h-[52px] mt-2 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-lg shadow-pink-900/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* DIVIDER ELEGAN */}
          <div className="relative flex items-center justify-center my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800"></div>
            </div>
            <span className="relative bg-black px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Or continue with
            </span>
          </div>

          {/* TOMBOL REGISTER */}
          <Link
            to="/register"
            className="w-full h-[52px] flex items-center justify-center rounded-xl border border-neutral-800 text-sm font-semibold text-neutral-300 hover:bg-neutral-900 hover:text-white hover:border-neutral-700 transition-all duration-300"
          >
            Create new account
          </Link>
        </div>
      </div>
    </div>
  );
}
