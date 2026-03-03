import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaHotel, FaCheckCircle, FaEnvelope } from "react-icons/fa";
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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationEmailSent, setRegistrationEmailSent] = useState(true);
  const [requiresEmailVerification, setRequiresEmailVerification] = useState(true);

  // Auto-scroll to first error when validation fails
  useEffect(() => {
    if (Object.keys(errors).length > 0 && !registrationSuccess) {
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`) || 
                          document.querySelector('.bg-red-50.border-red-400');
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [errors, registrationSuccess]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the Terms & Conditions to continue";
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
      const response = await api.post("/auth/register", registerData);
      setRegistrationEmailSent(response.data?.emailSent !== false);
      setRequiresEmailVerification(response.data?.requiresEmailVerification !== false);
      setRegistrationSuccess(true);
    } catch (err) {
      const data = err.response?.data;

      if (data?.errors) {
        // Backend field-level validation errors (from validationMiddleware)
        // Each field error can be a string or an array of strings
        const fieldErrors = {};
        Object.entries(data.errors).forEach(([field, value]) => {
          fieldErrors[field] = Array.isArray(value) ? value.join(" • ") : value;
        });
        setErrors(prev => ({ ...prev, ...fieldErrors, submit: null }));
      } else {
        // Generic error (e.g. "User already exists")
        const message =
          err.code === "ECONNABORTED"
            ? "Request timed out. Your account may still have been created. Try logging in or re-registering with the same email."
            : data?.message || "Registration failed. Please try again.";
        const friendlyMessages = {
          "User already exists": "An account with this email already exists. Try logging in instead.",
          "Error registering user": "Something went wrong on our end. Please try again later.",
        };
        setErrors(prev => ({
          ...prev,
          submit: friendlyMessages[message] || message,
          ...(message.toLowerCase().includes("email") && { email: friendlyMessages[message] || message }),
        }));
      }
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
      <div className="w-full max-w-md md:max-w-5xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Left side - Welcome message (hidden on mobile) */}
          <div className="hidden md:flex flex-col justify-center text-white auth-fade-in">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-premier-copper/30 backdrop-blur-md rounded-lg">
                <FaHotel className="text-3xl text-premier-copper" />
              </div>
              <h1 className="text-3xl font-bold">6ix Premier</h1>
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">Join Our Community</h2>
            <p className="text-premier-light text-lg mb-6">
              Create your account and start enjoying premium hospitality services today.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-premier-light">
                <FaCheckCircle className="text-premier-copper" />
                <span>Easy registration process</span>
              </div>
              <div className="flex items-center space-x-3 text-premier-light">
                <FaCheckCircle className="text-premier-copper" />
                <span>Exclusive member benefits</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <FaCheckCircle className="text-premier-copper" />
                <span>Email-based account activation</span>
              </div>
            </div>
          </div>

          {/* Right side - Register form / Success message */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 auth-slide-up max-h-[90vh] overflow-y-auto">
            {registrationSuccess ? (
              /* ── Success screen ── */
              <div className="text-center py-8 auth-fade-in">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 auth-pulse-slow">
                  <FaEnvelope className="text-3xl text-green-600" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  {requiresEmailVerification ? "Check Your Email" : "Account Created"}
                </h3>
                {!requiresEmailVerification ? (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6 text-left">
                    <p className="text-sm text-green-800 font-semibold">
                      Your account is active and ready to use.
                    </p>
                    <p className="text-sm text-green-700 mt-2">
                      Continue to login with your new credentials.
                    </p>
                  </div>
                ) : registrationEmailSent ? (
                  <>
                    <p className="text-dark-400 mb-2">
                      We've sent a verification link to
                    </p>
                    <p className="text-premier-copper font-semibold text-lg mb-6">{form.email}</p>
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6 text-left">
                      <p className="text-sm text-blue-800 font-bold mb-2">
                        📧 Next steps:
                      </p>
                      <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
                        <li><strong>Open your email inbox</strong></li>
                        <li>Click the <strong>"Verify Email"</strong> button in the email</li>
                        <li>Once verified, you can log in to your account</li>
                      </ol>
                    </div>
                    <p className="text-sm text-dark-400 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      💡 <strong>Didn't receive the email?</strong> Check your spam folder or try registering again.
                    </p>
                  </>
                ) : (
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-6 text-left">
                    <p className="text-sm text-amber-800 font-semibold">
                      Account created, but verification email could not be sent right now.
                    </p>
                    <p className="text-sm text-amber-700 mt-2">
                      Please contact support/admin to verify your account manually before logging in.
                    </p>
                  </div>
                )}
                <Link
                  to="/login"
                  className="inline-block w-full sm:w-auto bg-gradient-to-r from-premier-copper to-primary-600 text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Go to Login
                </Link>
              </div>
            ) : (
              /* ── Registration form ── */
              <>
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Account</h3>
              <p className="text-dark-400">Join us for a premium experience</p>
            </div>

            {errors.submit && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm auth-shake flex items-start gap-2">
                <span className="mt-0.5 shrink-0">⚠️</span>
                <span>{errors.submit}</span>
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              {/* Name fields row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First name */}
                <div>
                  <label className="block text-sm font-medium text-premier-dark mb-2">First Name</label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'firstName' ? 'ring-2 ring-premier-copper rounded-lg' : ''}`}>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handle}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="John"
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                        errors.firstName ? 'border-red-500 bg-red-50' : 'border-premier-gray hover:border-primary-300 focus:border-premier-copper'
                      }`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-600 text-sm mt-1 auth-fade-in">{errors.firstName}</p>
                  )}
                </div>

                {/* Last name */}
                <div>
                  <label className="block text-sm font-medium text-premier-dark mb-2">Last Name</label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'lastName' ? 'ring-2 ring-premier-copper rounded-lg' : ''}`}>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handle}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Doe"
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                        errors.lastName ? 'border-red-500 bg-red-50' : 'border-premier-gray hover:border-primary-300 focus:border-premier-copper'
                      }`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-600 text-sm mt-1 auth-fade-in">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-premier-dark mb-2">Email Address</label>
                <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'ring-2 ring-premier-copper rounded-lg' : ''}`}>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handle}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-premier-gray hover:border-primary-300 focus:border-premier-copper'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1 auth-fade-in">{errors.email}</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm font-medium text-premier-dark mb-2">Password</label>
                <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'ring-2 ring-premier-copper rounded-lg' : ''}`}>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handle}
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
                  <div className="mt-1 auth-fade-in">
                    {errors.password.includes(" • ") ? (
                      <ul className="text-red-600 text-sm space-y-0.5 list-none">
                        {errors.password.split(" • ").map((msg, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="mt-0.5 text-red-500">✕</span>
                            <span>{msg}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-red-600 text-sm">{errors.password}</p>
                    )}
                  </div>
                )}
                <PasswordStrengthMeter password={form.password} />
              </div>

              {/* Confirm Password field */}
              <div>
                <label className="block text-sm font-medium text-premier-dark mb-2">Confirm Password</label>
                <div className={`relative transition-all duration-300 ${focusedField === 'confirmPassword' ? 'ring-2 ring-premier-copper rounded-lg' : ''}`}>
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handle}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none pr-12 ${
                      errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-premier-gray hover:border-primary-300 focus:border-premier-copper'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-premier-copper transition-colors duration-200"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1 auth-fade-in">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms checkbox */}
              <div className={`p-3 rounded-lg transition-all duration-300 ${errors.terms ? 'bg-red-50 border-2 border-red-400 auth-shake' : ''}`}>
                <label className="flex items-center space-x-2 text-sm text-premier-dark cursor-pointer hover:text-premier-copper transition-colors">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked);
                      if (e.target.checked) setErrors(prev => ({ ...prev, terms: null }));
                    }}
                    className="w-4 h-4 rounded border-premier-gray text-premier-copper focus:ring-premier-copper"
                  />
                  <span>I agree to the Terms & Conditions</span>
                </label>
                {errors.terms && (
                  <p className="text-red-600 text-sm mt-2 font-semibold auth-fade-in flex items-center gap-1">
                    <span className="text-lg">⚠</span>
                    {errors.terms}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-premier-copper to-primary-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-6"
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
            <div className="mt-6 pt-6 border-t border-premier-gray">
              <p className="text-center text-dark-400 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-premier-copper hover:text-primary-600 font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add animations to CSS */}
      <style>{`
        @keyframes auth-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes auth-slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes auth-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes auth-pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .auth-fade-in { animation: auth-fade-in 0.6s ease-out forwards; }
        .auth-slide-up { animation: auth-slide-up 0.6s ease-out forwards; }
        .auth-shake { animation: auth-shake 0.4s ease-in-out; }
        .auth-pulse-slow { animation: auth-pulse-slow 2s ease-in-out infinite; }
        .delay-2000 { animation-delay: 2s; }
        .delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
