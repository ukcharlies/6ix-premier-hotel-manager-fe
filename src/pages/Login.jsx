import React, { useState } from "react";
import { useAuth } from "../contexts/Authcontext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { validateEmail } from "../utils/validation";
import { FaEye, FaEyeSlash, FaHotel } from "react-icons/fa";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if redirected due to session expiry
  const sessionExpired = location.state?.sessionExpired;
  const sessionMessage = location.state?.message;

  const validateForm = () => {
    const newErrors = {};
    const emailValidation = validateEmail(formData.email);
    
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await auth.login(formData.email, formData.password);
      if (res?.data?.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setErrors({
        submit: errorMessage,
        ...(errorMessage.includes("password") && { password: errorMessage }),
        ...(errorMessage.includes("email") && { email: errorMessage })
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-premier-dark via-dark-700 to-premier-copper flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-premier-light rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-premier-gray rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-premier-light rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-4000" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Content container */}
      <div className="w-full max-w-md lg:max-w-4xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left side - Welcome message (hidden on mobile) */}
          <div className="hidden lg:flex flex-col justify-center text-white animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-premier-copper/30 backdrop-blur-md rounded-lg">
                <FaHotel className="text-3xl text-premier-copper" />
              </div>
              <h1 className="text-3xl font-bold">6ix Premier</h1>
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">Welcome Back</h2>
            <p className="text-premier-light text-lg mb-6">
              Experience luxury hospitality management at its finest. Manage your bookings, profile, and more with ease.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-premier-light">
                <div className="w-2 h-2 bg-premier-copper rounded-full"></div>
                <span>Seamless booking management</span>
              </div>
              <div className="flex items-center space-x-3 text-premier-light">
                <div className="w-2 h-2 bg-premier-copper rounded-full"></div>
                <span>Premium guest experience</span>
              </div>
              <div className="flex items-center space-x-3 text-premier-light">
                <div className="w-2 h-2 bg-premier-copper rounded-full"></div>
                <span>Secure & reliable</span>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 animate-slide-up">
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-premier-dark mb-2">Sign In</h3>
              <p className="text-dark-400">Enter your credentials to access your account</p>
            </div>

            {/* Session Expired Alert */}
            {sessionExpired && (
              <div className="mb-4 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium">Session Expired</p>
                  <p className="text-amber-700 text-xs mt-1">{sessionMessage || "Your session has expired. Please log in again."}</p>
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-shake">
                {errors.submit}
              </div>
            )}

            <form onSubmit={submit} className="space-y-5">
              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-premier-dark mb-2">Email Address</label>
                <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'ring-2 ring-premier-copper rounded-lg' : ''}`}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-premier-gray hover:border-primary-300 focus:border-premier-copper'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-2 animate-fade-in">{errors.email}</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm font-medium text-premier-dark mb-2">Password</label>
                <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'ring-2 ring-premier-copper rounded-lg' : ''}`}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none pr-12 ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-premier-gray hover:border-primary-300 focus:border-premier-copper'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-premier-copper transition-colors duration-200"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-2 animate-fade-in">{errors.password}</p>
                )}
              </div>

              {/* Remember me and forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-premier-dark cursor-pointer hover:text-premier-copper transition-colors">
                  <input type="checkbox" className="w-4 h-4 rounded border-premier-gray text-premier-copper focus:ring-premier-copper" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-premier-copper hover:text-primary-600 font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-premier-copper to-primary-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Signing in...</span>
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer links */}
            <div className="mt-6 pt-6 border-t border-premier-gray">
              <p className="text-center text-dark-400 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-premier-copper hover:text-primary-600 font-semibold transition-colors">
                  Create one
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
