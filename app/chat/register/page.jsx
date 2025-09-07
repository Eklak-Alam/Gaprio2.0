'use client'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram, FaEye, FaEyeSlash, FaUser, FaInfoCircle, FaImage } from "react-icons/fa"
import { useApi } from '@/context/ApiContext'

export default function Signup() {
  const { signup, loading, error, clearError, isAuthenticated } = useApi();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    avatarUrl: '',
    about: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      window.location.href = '/chat/dashboard'
    }
  }, [isAuthenticated])

  // Clear error when form changes
  useEffect(() => {
    if (error) clearError()
    if (successMessage) setSuccessMessage('')
  }, [formData])

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Full name is required'
    }
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    
    if (formData.avatarUrl && !/^https?:\/\/.+\..+/.test(formData.avatarUrl)) {
      errors.avatarUrl = 'Please enter a valid URL'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      // Prepare data according to UserRequest DTO
      const userData = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        avatarUrl: formData.avatarUrl || null,
        about: formData.about || null
      }
      
      const response = await signup(userData)
      setSuccessMessage('Account created successfully! Redirecting to login...')
      
      // Redirect to login after successful signup
      setTimeout(() => {
        window.location.href = '/chat/login'
      }, 2000)
    } catch (err) {
      // Error is handled in the context
      console.error('Signup error:', err)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-900 text-white relative overflow-hidden">
      <Head>
        <title>Gaprio - Sign Up</title>
        <meta name="description" content="Create your Gaprio account to start chatting" />
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
          transition={{ type: 'spring', stiffness: 100 }}
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

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 pt-28">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/10"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Create an Account</h2>
          <p className="text-gray-400 mb-8">Join Gaprio today, it only takes a minute!</p>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Success Message */}
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm"
            >
              {successMessage}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                <FaUser className="inline mr-1 text-indigo-400" size={12} />
                Full Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Your full name"
              />
              {formErrors.name && (
                <p className="text-red-400 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="your_username"
              />
              {formErrors.username && (
                <p className="text-red-400 text-sm mt-1">{formErrors.username}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">Only letters, numbers, and underscores allowed</p>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="your@email.com"
              />
              {formErrors.email && (
                <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
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
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-red-400 text-sm mt-1">{formErrors.password}</p>
              )}
            </div>

            {/* Avatar URL (Optional) */}
            <div className="space-y-1">
              <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-300">
                <FaImage className="inline mr-1 text-indigo-400" size={12} />
                Avatar URL (Optional)
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id="avatarUrl"
                name="avatarUrl"
                type="url"
                value={formData.avatarUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="https://example.com/avatar.jpg"
              />
              {formErrors.avatarUrl && (
                <p className="text-red-400 text-sm mt-1">{formErrors.avatarUrl}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">Link to your profile picture</p>
            </div>

            {/* About/Bio (Optional) */}
            <div className="space-y-1">
              <label htmlFor="about" className="block text-sm font-medium text-gray-300">
                <FaInfoCircle className="inline mr-1 text-indigo-400" size={12} />
                About/Bio (Optional)
              </label>
              <motion.textarea
                whileFocus={{ scale: 1.01 }}
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
                placeholder="Tell us a little about yourself..."
              />
              <p className="text-gray-500 text-xs mt-1">Max 250 characters</p>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="w-4 h-4 rounded border border-gray-700 bg-gray-800 focus:ring-indigo-500 focus:ring-2"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-400">
                  I agree to the <a href="#" className="text-indigo-400 hover:text-indigo-300">Terms of Service</a> and <a href="#" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</a>
                </label>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition font-medium shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </div>
              ) : 'Sign Up'}
            </motion.button>
          </form>

          {/* Divider + Login Link */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} className="mt-6">
              <Link
                href="/chat/login"
                className="w-full block text-center bg-gray-800 border border-gray-700 text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition font-medium"
              >
                Login to your account
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
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </div>
  )
}