import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useSearchParams, Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const getVerifyRequestStore = () => {
  if (!window.__verifyEmailRequests) {
    window.__verifyEmailRequests = {};
  }
  return window.__verifyEmailRequests;
};

const verifyTokenOnce = async (token) => {
  const store = getVerifyRequestStore();
  if (!store[token]) {
    store[token] = api.post("/auth/verify-email", { token }).catch((error) => {
      delete store[token];
      throw error;
    });
  }
  return store[token];
};

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token"), [searchParams]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    if (status !== "loading") return undefined;

    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 92) return current;
        const step = Math.max(1, Math.floor((100 - current) / 12));
        return Math.min(92, current + step);
      });
    }, 120);

    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token found. Please check your email link and try again.");
      return;
    }

    const verifyEmail = async () => {
      try {
        await verifyTokenOnce(token);
        setProgress(100);
        window.setTimeout(() => setStatus("success"), 220);
      } catch (err) {
        setProgress(100);
        const msg = err.response?.data?.message;
        if (msg?.toLowerCase().includes("invalid") || msg?.toLowerCase().includes("expired")) {
          setErrorMessage("This verification link is invalid or has expired. Please register again or contact support.");
        } else {
          setErrorMessage(msg || "Verification failed. Please try again later.");
        }
        window.setTimeout(() => setStatus("error"), 220);
      }
    };

    verifyEmail();
  }, [token]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8 verify-fade-in">
        <div className="text-center">
          <div
            className="verify-progress-ring mx-auto mb-4"
            style={{
              background: `conic-gradient(#A47550 ${progress * 3.6}deg, rgba(255,255,255,0.12) ${progress * 3.6}deg)`,
            }}
          >
            <div className="verify-progress-inner">
              <span className="verify-progress-value">{progress}%</span>
            </div>
          </div>
          <p className="text-white/80 text-sm tracking-wide">Verifying your email...</p>
        </div>
        <style>{`
          @keyframes verify-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .verify-fade-in { animation: verify-fade-in 0.35s ease-out forwards; }
          .verify-progress-ring {
            width: 104px;
            height: 104px;
            border-radius: 9999px;
            padding: 5px;
            transition: background 0.2s ease;
          }
          .verify-progress-inner {
            width: 100%;
            height: 100%;
            border-radius: 9999px;
            background: #000;
            border: 1px solid rgba(164, 117, 80, 0.22);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .verify-progress-value {
            color: #fff;
            font-weight: 700;
            font-size: 16px;
            letter-spacing: 0.4px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-premier-dark via-dark-700 to-premier-copper flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 text-center">

          {/* ── Success state ── */}
          {status === "success" && (
            <div className="py-8 verify-fade-in">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <FaCheckCircle className="text-4xl text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Email Verified!</h2>
              <p className="text-dark-400 mb-6">
                Your account has been successfully verified. You can now log in and start using your account.
              </p>
              <Link
                to="/login"
                className="inline-block w-full bg-gradient-to-r from-premier-copper to-primary-600 text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Go to Login
              </Link>
            </div>
          )}

          {/* ── Error state ── */}
          {status === "error" && (
            <div className="py-8 verify-fade-in">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <FaTimesCircle className="text-4xl text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Verification Failed</h2>
              <p className="text-dark-400 mb-6">{errorMessage}</p>
              <div className="space-y-3">
                <Link
                  to="/register"
                  className="inline-block w-full bg-gradient-to-r from-premier-copper to-primary-600 text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Register Again
                </Link>
                <Link
                  to="/login"
                  className="inline-block w-full border-2 border-premier-copper text-premier-copper font-semibold py-3 px-8 rounded-lg hover:bg-premier-copper/10 transition-all duration-200"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes verify-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .verify-fade-in { animation: verify-fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
