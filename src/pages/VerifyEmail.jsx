import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useSearchParams } from "react-router-dom";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const [msg, setMsg] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const tokenFromQuery = searchParams.get("token");
    if (!tokenFromQuery) return;

    setToken(tokenFromQuery);
    const verifyFromLink = async () => {
      setIsVerifying(true);
      try {
        await api.post("/auth/verify-email", { token: tokenFromQuery });
        setMsg("Email verified successfully. You can log in now.");
      } catch (err) {
        setMsg(err.response?.data?.message || "Verification failed");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyFromLink();
  }, [searchParams]);

  const submit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      await api.post("/auth/verify-email", { token });
      setMsg("Email verified successfully. You can log in now.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Verify Email</h2>
      {msg && <div className="mb-2">{msg}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Verification token"
          className="w-full border p-2 rounded"
        />
        <button
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-60"
          disabled={isVerifying || !token}
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
