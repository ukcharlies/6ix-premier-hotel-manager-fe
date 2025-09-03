import React, { useState } from "react";
import api from "../services/api";

export default function VerifyEmail() {
  const [token, setToken] = useState("");
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/verify-email", { token });
      setMsg("Email verified successfully. You can log in now.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Verification failed");
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
        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Verify
        </button>
      </form>
    </div>
  );
}
