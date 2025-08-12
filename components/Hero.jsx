'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

export default function Hero() {

  const primaryGradient = 'bg-gradient-to-r from-indigo-500 to-purple-600'
  const textGradient = `bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent`

  return (
    <section className="relative  overflow-hidden pt-10">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-24 md:py-32 text-center">
        {/* Badge or small header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800 mb-6 shadow-lg"
        >
          <span className="h-2 w-2 rounded-full bg-purple-500 mr-2 animate-pulse"></span>
          <span className="text-sm font-medium text-gray-300">Bridging the Human-AI Divide</span>
        </motion.div>

        {/* Heading */}
        <motion.h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="block">AI-Powered</span>
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
          <Link href='/' className={`${primaryGradient} hover:from-indigo-600 cursor-pointer hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl`}>
            Get Started <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href='/' className="bg-transparent hover:bg-gray-800 cursor-pointer text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 border border-gray-700">
            Learn More
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
