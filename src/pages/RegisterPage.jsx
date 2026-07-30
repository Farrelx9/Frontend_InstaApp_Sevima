import { useState, useSyncExternalStore } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { register as apiRegister } from "../services/api";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
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

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiRegister(form);
      login(res.data.token, res.data.user);
      toast.success("Account created! Welcome 🎉");
      navigate("/");
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        Object.values(errors)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error(err.response?.data?.message || "Registration failed");
      }
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
            <div>
              <h1 className="text-2xl font-bold">Buat akun baru</h1>
              <p className="text-neutral-500 text-base mt-1.5">
                Join the community
              </p>
            </div>
          </div>

          {/* SECTION 2: form input + tombol daftar */}
          <div className="flex flex-col gap-5">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                id="register-name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nama"
                className="w-full h-16 flex items-center bg-transparent border border-neutral-700 rounded-3xl px-9 text-xl leading-none placeholder-neutral-500 focus:border-pink-500 outline-none"
              />
              <input
                id="register-email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className="w-full h-16 flex items-center bg-transparent border border-neutral-700 rounded-3xl px-9 text-xl leading-none placeholder-neutral-500 focus:border-pink-500 outline-none"
              />

              {/* Password dengan toggle show/hide, tetap dipertahankan */}
              <div className="relative">
                <input
                  id="register-password"
                  type={showPass ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Minimal 6 karakter"
                  className="w-full h-16 flex items-center bg-transparent border border-neutral-700 rounded-3xl px-9 pr-14 text-xl leading-none placeholder-neutral-500 focus:border-pink-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-7 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                id="register-submit"
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xl rounded-full transition-colors flex items-center justify-center gap-2 mt-1"
              >
                {loading ? "Membuat akun..." : "Buat akun"}
              </button>
            </form>
          </div>

          {/* SECTION 3: divider + sudah punya akun */}
          <div className="flex flex-col gap-6 border-t border-neutral-800 pt-7">
            <p className="text-center text-base text-neutral-400">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="text-pink-500 hover:text-pink-400 font-semibold transition-colors"
              >
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
