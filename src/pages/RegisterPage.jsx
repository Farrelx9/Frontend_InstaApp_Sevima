import { useState, useSyncExternalStore } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { register as apiRegister } from "../services/api";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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

  // Reusable class untuk input agar konsisten dengan LoginPage
  const inputClass =
    "w-full h-[56px] bg-neutral-900/30 border border-neutral-800 rounded-xl px-4 text-sm text-white placeholder-neutral-500 focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 outline-none transition-all duration-300";

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
          {/* HEADER */}
          <div className="flex flex-col gap-3 text-center xl:text-left">
            <div className="xl:hidden flex justify-center mb-2">
              <InstagramLogo size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Create Account
            </h1>
            <p className="text-neutral-500 text-sm">
              Join our community and start sharing moments.
            </p>
          </div>

          {/* FORM INPUTS */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <input
              id="register-name"
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full Name"
              className={inputClass}
            />

            <input
              id="register-email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email Address"
              className={inputClass}
            />

            {/* Password Field with Toggle */}
            <div className="relative">
              <input
                id="register-password"
                type={showPass ? "text" : "password"}
                required
                minLength={6}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password (min. 6 characters)"
                // pr-12 memberikan ruang aman agar teks tidak menabrak ikon mata
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors p-1"
                aria-label="Toggle password visibility"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full h-[52px] mt-2 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-lg shadow-pink-900/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* FOOTER LINK */}
          <div className="text-center mt-4">
            <p className="text-neutral-500 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-pink-500 hover:text-pink-400 font-medium transition-colors ml-1"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
