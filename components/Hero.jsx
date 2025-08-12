'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

export default function Hero() {

  const primaryGradient = 'bg-gradient-to-r from-indigo-500 to-purple-600'
  const textGradient = `bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient`

  return (
    <section className="relative overflow-hidden pt-10 bg-gray-900 text-white">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-24 md:py-32 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800 mb-6 shadow-lg"
        >
          <span className="h-2 w-2 rounded-full bg-purple-500 mr-2 animate-pulse"></span>
          <span className="text-sm font-medium text-gray-300">Bridging the Human-AI Divide</span>
        </motion.div>

        {/* Heading with Halo Glow */}
        <motion.h1 
          className="relative text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="block text-white drop-shadow-[0_0_15px_rgba(139,92,246,0.7)]">AI-Powered</span>
          <span className={textGradient}>Mediator for Real Human Gaps</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p 
          className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Harnessing advanced AI technology to understand, interpret, and bridge
          communication gaps — fostering clarity, empathy, and genuine human
          connection across cultures, industries, and perspectives.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link href='/' className={`${primaryGradient} hover:from-indigo-600 hover:to-purple-700 cursor-pointer text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl`}>
            Get Started <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href='/' className="bg-transparent hover:bg-gray-800 cursor-pointer text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 border border-gray-700">
            Learn More
          </Link>
        </motion.div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 5s ease infinite;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
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
    </section>
  )
}
