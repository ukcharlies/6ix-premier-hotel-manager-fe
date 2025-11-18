import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaHotel, FaCheckCircle } from "react-icons/fa";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.firstName) newErrors.firstName = "First name is required";
    if (!form.lastName) newErrors.lastName = "Last name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handle = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...registerData } = form;
      await api.post("/auth/register", registerData);
      navigate("/login", { 
        state: { message: "Registration successful! Please check your email to verify your account." }
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setErrors(prev => ({
        ...prev,
        submit: errorMessage,
        ...(errorMessage.includes("email") && { email: errorMessage }),
        ...(errorMessage.includes("password") && { password: errorMessage })
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-4000" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Content container */}
      <div className="w-full max-w-md lg:max-w-4xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left side - Welcome message (hidden on mobile) */}
          <div className="hidden lg:flex flex-col justify-center text-white animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-lg">
                <FaHotel className="text-3xl text-white" />
              </div>
              <h1 className="text-3xl font-bold">6ix Premier</h1>
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">Join Our Community</h2>
            <p className="text-white/80 text-lg mb-6">
              Create your account and start enjoying premium hospitality services today.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-white/90">
                <FaCheckCircle className="text-rose-300" />
                <span>Easy registration process</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <FaCheckCircle className="text-rose-300" />
                <span>Exclusive member benefits</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <FaCheckCircle className="text-rose-300" />
                <span>Instant account activation</span>
              </div>
            </div>
          </div>

          {/* Right side - Register form */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Account</h3>
              <p className="text-gray-600">Join us for a premium experience</p>
            </div>

            {errors.submit && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-shake">
                {errors.submit}
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              {/* Name fields row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'firstName' ? 'ring-2 ring-indigo-500 rounded-lg' : ''}`}>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handle}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="John"
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                        errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-indigo-500'
                      }`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-600 text-sm mt-1 animate-fade-in">{errors.firstName}</p>
                  )}
                </div>

                {/* Last name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'lastName' ? 'ring-2 ring-indigo-500 rounded-lg' : ''}`}>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handle}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Doe"
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                        errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-indigo-500'
                      }`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-600 text-sm mt-1 animate-fade-in">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'ring-2 ring-indigo-500 rounded-lg' : ''}`}>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handle}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-indigo-500'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1 animate-fade-in">{errors.email}</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'ring-2 ring-indigo-500 rounded-lg' : ''}`}>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handle}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none pr-12 ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-indigo-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1 animate-fade-in">{errors.password}</p>
                )}
                <PasswordStrengthMeter password={form.password} />
              </div>

              {/* Confirm Password field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className={`relative transition-all duration-300 ${focusedField === 'confirmPassword' ? 'ring-2 ring-indigo-500 rounded-lg' : ''}`}>
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handle}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none pr-12 ${
                      errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-indigo-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1 animate-fade-in">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms checkbox */}
              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer hover:text-indigo-600 transition-colors">
                <input type="checkbox" required className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span>I agree to the Terms & Conditions</span>
              </label>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-rose-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-6"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Creating account...</span>
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Footer links */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add animations to CSS */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        .delay-2000 { animation-delay: 2s; }
        .delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
