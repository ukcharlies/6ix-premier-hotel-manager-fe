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

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token found. Please check your email link and try again.");
      return;
    }

    const verifyEmail = async () => {
      try {
        await verifyTokenOnce(token);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        const msg = err.response?.data?.message;
        if (msg?.toLowerCase().includes("invalid") || msg?.toLowerCase().includes("expired")) {
          setErrorMessage("This verification link is invalid or has expired. Please register again or contact support.");
        } else {
          setErrorMessage(msg || "Verification failed. Please try again later.");
        }
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-premier-dark via-dark-700 to-premier-copper flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 text-center">

          {/* ── Loading state: spinner ── */}
          {status === "loading" && (
            <div className="py-12 verify-fade-in">
              <div className="mx-auto w-16 h-16 border-4 border-premier-gray border-t-premier-copper rounded-full animate-spin mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email</h2>
              <p className="text-dark-400">Please wait while we confirm your account...</p>
            </div>
          )}

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
