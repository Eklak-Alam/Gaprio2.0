"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaEye,
  FaEyeSlash,
  FaUserCheck,
} from "react-icons/fa";
import { useApi } from "@/context/ApiContext";

export default function Login() {
  const { login, loading, error, clearError, isAuthenticated, user } = useApi();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated() && user) {
      // Add a small delay to show success message
      const timer = setTimeout(() => {
        window.location.href = "/chat/dashboard";
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user]);

  // Update local error state when context error changes
  useEffect(() => {
    if (error) {
      setLoginError(error);
      setIsLoggingIn(false);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (loginError) {
      setLoginError("");
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    if (!formData.username || !formData.password) {
      setLoginError("Please fill in all fields");
      setIsLoggingIn(false);
      return;
    }

    try {
      await login(formData);
      // The redirect will happen automatically due to the useEffect above
    } catch (err) {
      // Error is already handled by the context
      console.error("Login failed:", err);
      setIsLoggingIn(false);
    }
  };

  // Show success message when user is authenticated but not yet redirected
  if (isAuthenticated() && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Head>
          <title>Gaprio - Login Successful</title>
        </Head>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white/5 backdrop-blur-md rounded-2xl shadow-xl"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaUserCheck size={32} className="text-white" />
          </motion.div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Login Successful!
          </h2>
          <p className="text-gray-300 mb-4">Welcome back, {user.name}!</p>
          <p className="text-gray-400">Redirecting to your chat dashboard...</p>

          <div className="mt-6">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-green-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-900 text-white relative overflow-hidden">
      <Head>
        <title>Gaprio - Login</title>
        <meta
          name="description"
          content="Login to your Gaprio account to start chatting"
        />
      </Head>

      {/* Animated Blobs Background */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Left Side - Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative pt-28"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Gaprio Logo"
              width={160}
              height={160}
              className="rounded-xl"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-extrabold mb-2 drop-shadow-[0_0_20px_rgba(139,92,246,0.7)]"
        >
          Gaprio
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 text-lg mb-12 text-center max-w-sm"
        >
          Join our community and connect with people worldwide
        </motion.p>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 text-left w-full max-w-xs"
        >
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
              <span className="text-xs">✓</span>
            </div>
            <span className="text-gray-300">Complete user profiles</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
              <span className="text-xs">✓</span>
            </div>
            <span className="text-gray-300">Custom avatars</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
              <span className="text-xs">✓</span>
            </div>
            <span className="text-gray-300">Personal bios</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
              <span className="text-xs">✓</span>
            </div>
            <span className="text-gray-300">End-to-end encryption</span>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex space-x-6 text-white mt-12"
        >
          {[FaTwitter, FaFacebook, FaLinkedin, FaInstagram].map((Icon, i) => (
            <motion.a
              key={i}
              whileHover={{ y: -5, scale: 1.1 }}
              href="#"
              className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition"
            >
              <Icon size={20} />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 pt-32">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/10"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 mb-8">Sign in to your Gaprio account</p>

          {/* Error Message */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm"
            >
              {loginError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="space-y-1">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300"
              >
                Username
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Enter your username"
                disabled={loading || isLoggingIn}
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition pr-12"
                  placeholder="Enter your password"
                  disabled={loading || isLoggingIn}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white disabled:opacity-50"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || isLoggingIn}
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-600 rounded bg-gray-800"
                  disabled={loading || isLoggingIn}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-300"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  href="/chat/forgot-password"
                  className="font-medium text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: loading || isLoggingIn ? 1 : 1.02 }}
              whileTap={{ scale: loading || isLoggingIn ? 1 : 0.98 }}
              type="submit"
              disabled={loading || isLoggingIn}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition font-medium shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading || isLoggingIn ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isLoggingIn ? "Authenticating..." : "Signing In..."}
                </div>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          {/* Divider + Signup */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} className="mt-6">
              <Link
                href="/chat/register"
                className="w-full block text-center bg-gray-800 border border-gray-700 text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition font-medium"
              >
                Create Account
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
