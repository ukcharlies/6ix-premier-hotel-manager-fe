import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      setMsg("Registered — check your email to verify the account.");
      navigate("/login");
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {msg && <div className="mb-2">{msg}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input
          name="firstName"
          value={form.firstName}
          onChange={handle}
          placeholder="First Name"
          className="w-full border p-2 rounded"
        />
        <input
          name="lastName"
          value={form.lastName}
          onChange={handle}
          placeholder="Last Name"
          className="w-full border p-2 rounded"
        />
        <input
          name="email"
          value={form.email}
          onChange={handle}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handle}
          placeholder="Password"
          className="w-full border p-2 rounded"
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
