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
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex">
      {/* KIRI */}
      {isDesktop && (
        <div className="hidden xl:block xl:w-[62%] relative overflow-hidden">
          <ReactBitsBackground />
          <div className="absolute top-10 left-10 flex items-center gap-2.5 z-10">
            <InstagramLogo size={26} className="text-white" />
            <span className="text-lg font-semibold">Sevima Insta</span>
          </div>
        </div>
      )}

      {/* KANAN */}
      <div className="w-full xl:w-[38%] flex flex-col items-center justify-center px-8 sm:px-12 xl:px-16 xl:border-l xl:border-neutral-800">
        <div className="w-full max-w-sm mx-auto flex flex-col gap-9">
          {/* SECTION 1: logo mobile + judul */}
          <div className="flex flex-col gap-6">
            <div className="xl:hidden flex justify-center">
              <InstagramLogo size={34} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold">Masuk ke akun</h1>
          </div>

          {/* SECTION 2: form input + tombol masuk */}
          <div className="flex flex-col gap-5">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className="w-full h-16 flex items-center bg-transparent border border-neutral-700 rounded-3xl px-9 text-xl leading-none placeholder-neutral-500 focus:border-pink-500 outline-none"
              />
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password"
                className="w-full h-16 flex items-center bg-transparent border border-neutral-700 rounded-3xl px-9 text-xl leading-none placeholder-neutral-500 focus:border-pink-500 outline-none"
              />
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xl rounded-full transition-colors flex items-center justify-center gap-2 mt-1"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                {loading ? "Memproses..." : "Masuk"}
              </button>
            </form>
          </div>

          {/* SECTION 3: divider + buat akun baru */}
          <div className="flex flex-col gap-6 border-t border-neutral-800 pt-7">
            <Link
              to="/register"
              className="w-full h-16 flex items-center justify-center rounded-full border border-neutral-600 text-xl font-semibold text-white hover:bg-neutral-900 transition-colors"
            >
              Buat akun baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
