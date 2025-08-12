'use client'
import { motion } from 'framer-motion'
import { FiAlertTriangle, FiClock, FiUsers, FiMessageSquare } from 'react-icons/fi'

export default function ProblemSection() {
  const problems = [
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "Costly & Lengthy Business Negotiations",
      description: "Time-consuming processes that delay decisions and increase operational costs"
    },
    {
      icon: <FiAlertTriangle className="w-6 h-6" />,
      title: "Miscommunications hamper Productivity",
      description: "Critical details get lost in translation between teams and stakeholders"
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Lack of Multi-User AI Chatbots",
      description: "Existing solutions don't facilitate collaborative AI-assisted negotiations"
    },
    {
      icon: <FiMessageSquare className="w-6 h-6" />,
      title: "Inefficient Communication Channels",
      description: "Disjointed tools create silos instead of bridging understanding gaps"
    }
  ]

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated background elements */}
      {/* <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div> */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, staggerChildren: 0.2 }}
        viewport={{ once: true }}
        className="text-center mb-20"
        >
        {/* Heading */}
        <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 relative inline-block"
        >
            <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg animate-gradient">
            The Problem
            </span>
            {/* Underline */}
            <span className="block h-1 w-20 mx-auto mt-3 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 rounded-full"></span>
        </motion.h2>

        {/* Paragraph */}
        <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed tracking-wide"
        >
            Current negotiation processes are plagued with inefficiencies, costing
            businesses valuable time and resources — and leaving opportunities on
            the table.
        </motion.p>
        </motion.div>



        {/* Problem cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/70 transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 mb-4 text-purple-400`}>
                {problem.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{problem.title}</h3>
              <p className="text-gray-400">{problem.description}</p>
              
              {/* Animated underline */}
              <motion.div 
                className="mt-4 h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500 to-indigo-500/0"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
              />
            </motion.div>
          ))}
        </div>

        {/* Stats or additional content can go here */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-16 md:mt-20 text-center px-4"
        >
          <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gray-800 border border-gray-700 max-w-full sm:max-w-lg">
            <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-snug">
              <span className="font-bold text-white">70%</span> of business negotiations
              experience significant delays due to miscommunication
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}