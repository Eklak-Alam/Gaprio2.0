'use client'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa"

export default function Signup() {
  return (
    <div className="min-h-screen flex bg-gray-900 text-white relative overflow-hidden">
      <Head>
        <title>Gaprio - Sign Up</title>
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
              width={160}  // bigger width
              height={160} // bigger height
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
          Join us and explore the future
        </motion.p>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex space-x-6 text-white"
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
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 pt-32">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-xl"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Create an Account</h2>
          <p className="text-gray-400 mb-8">Join Gaprio today, it only takes a minute!</p>

          <form className="space-y-6">
            {/* Username */}
            <div className="space-y-1">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Your username"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="••••••••"
              />
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition font-medium shadow-lg"
            >
              Sign Up
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
                Login
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
