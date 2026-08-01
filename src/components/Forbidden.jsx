import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactBitsBackground from "./ReactBitsBackground"; // adjust path to your file

const REDIRECT_SECONDS = 8;

export default function Forbidden() {
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (paused) return;

    if (secondsLeft <= 0) {
      navigate("/login", { replace: true });
      return;
    }

    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, paused, navigate]);

  const progress = ((REDIRECT_SECONDS - secondsLeft) / REDIRECT_SECONDS) * 100;

  return (
    <div className="fb-wrap">
      <ReactBitsBackground />

      <style>{`
        @keyframes fb-fade-in {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fb-orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fb-glow-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .fb-wrap {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          overflow: hidden;
        }

        .fb-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 400px;
          text-align: center;
          padding: 2.75rem 2rem;
          border-radius: 1.25rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
          animation: fb-fade-in 0.6s ease-out;
        }

        .fb-icon-wrap {
          position: relative;
          width: 76px;
          height: 76px;
          margin: 0 auto 1.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fb-icon-ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: conic-gradient(from 0deg, #ec4899, #a855f7, #f97316, #ec4899);
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px));
          animation: fb-orbit 6s linear infinite;
        }
        .fb-icon-core {
          position: relative;
          width: 58px;
          height: 58px;
          border-radius: 9999px;
          background: #0a0a0c;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fb-icon-glow {
          position: absolute;
          inset: -14px;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.35), transparent 70%);
          animation: fb-glow-pulse 2.5s ease-in-out infinite;
        }

        .fb-eyebrow {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          background: linear-gradient(90deg, #ec4899, #f97316);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin: 0 0 0.5rem;
        }
        .fb-code {
          font-size: 2.75rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #ec4899, #a855f7 50%, #f97316);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin: 0 0 0.4rem;
        }
        .fb-title {
          color: #f5f5f5;
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 0.6rem;
        }
        .fb-desc {
          color: #a1a1aa;
          font-size: 0.88rem;
          line-height: 1.55;
          margin: 0 0 1.85rem;
        }

        .fb-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.6rem;
          background: linear-gradient(135deg, #ec4899, #a855f7);
          color: #fff;
          font-weight: 500;
          font-size: 0.9rem;
          border-radius: 0.65rem;
          text-decoration: none;
          transition: filter 0.15s ease, transform 0.15s ease;
        }
        .fb-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }
        .fb-btn:active {
          transform: translateY(0);
        }

        .fb-redirect {
          margin-top: 1.85rem;
        }
        .fb-redirect-text {
          color: #71717a;
          font-size: 0.78rem;
          margin-bottom: 0.5rem;
        }
        .fb-redirect-text button {
          color: #f0abfc;
          background: none;
          border: none;
          padding: 0;
          font: inherit;
          cursor: pointer;
          text-decoration: underline;
        }
        .fb-progress-track {
          width: 100%;
          height: 3px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          overflow: hidden;
        }
        .fb-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #ec4899, #f97316);
          border-radius: 999px;
          transition: width 1s linear;
        }
      `}</style>

      <div className="fb-card">
        <div className="fb-icon-wrap">
          <div className="fb-icon-glow" />
          <div className="fb-icon-ring" />
          <div className="fb-icon-core">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#fb-lock-gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <defs>
                <linearGradient
                  id="fb-lock-gradient"
                  x1="0"
                  y1="0"
                  x2="24"
                  y2="24"
                >
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
              <rect x="4" y="10" width="16" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
          </div>
        </div>

        <p className="fb-eyebrow">Error 403</p>
        <p className="fb-code">Access Denied</p>
        <p className="fb-desc">You need to log in first to access this page.</p>

        <Link to="/login" className="fb-btn">
          Go to Login
        </Link>

        <div className="fb-redirect">
          <p className="fb-redirect-text">
            {paused ? (
              <button onClick={() => setPaused(false)}>
                Resume automatic redirect
              </button>
            ) : (
              <>
                Redirecting to login in {secondsLeft} seconds ·{" "}
                <button onClick={() => setPaused(true)}>Cancel</button>
              </>
            )}
          </p>
          <div className="fb-progress-track">
            <div
              className="fb-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
