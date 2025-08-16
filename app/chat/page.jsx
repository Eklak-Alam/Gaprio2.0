'use client';

import { motion } from 'framer-motion';
import { FiMessageSquare, FiSend, FiUsers, FiArrowRight } from 'react-icons/fi';
import { FaRobot, FaHandshake } from 'react-icons/fa';
import Link from 'next/link';

export default function ChatHero() {
  const messages = [
    {
      id: 1,
      text: "Hello! I'm your AI mediator. How can I assist your conversation today?",
      sender: "ai",
      delay: 0.2
    },
    {
      id: 2,
      text: "We're having trouble agreeing on contract terms",
      sender: "user",
      delay: 0.4
    },
    {
      id: 3,
      text: "I can help mediate. Let me analyze both positions and suggest fair compromises.",
      sender: "ai",
      delay: 0.6
    }
  ];

  const primaryGradient = 'bg-gradient-to-r from-indigo-500 to-purple-600';
  const textGradient = 'bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient';

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden p-10">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 opacity-20 -z-10">
        <div className="absolute top-0 left-0 w-56 h-56 sm:w-72 sm:h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-56 h-56 sm:w-72 sm:h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-56 h-56 sm:w-72 sm:h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
        {/* Left Column - Text Content */}
        <div className="md:w-1/2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800 mb-6 shadow-lg"
          >
            <span className="h-2 w-2 rounded-full bg-purple-500 mr-2 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-300">Bridging Human-AI Communication</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
          >
            <span className="block text-white drop-shadow-[0_0_15px_rgba(139,92,246,0.7)]">AI-Powered</span>
            <span className={textGradient}>Mediation Chat</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300"
          >
            Intelligent conversations that understand, mediate, and bridge gaps between humans and AI.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/chat/register"
              className={`${primaryGradient} hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg`}
            >
              <FiMessageSquare />
              Start Chatting
            </Link>

            <Link
              href="/chat/login"
              className="bg-transparent hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-all border border-gray-700 flex items-center gap-2"
            >
              <FiUsers />
              Join Chat
            </Link>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div 
            className="mt-8 grid grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2 text-sm">
              <FaRobot className="text-purple-400" />
              <span>AI Mediation</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FaHandshake className="text-indigo-400" />
              <span>Conflict Resolution</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FiUsers className="text-pink-400" />
              <span>Multi-User</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FiMessageSquare className="text-blue-400" />
              <span>Real-time</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Chat Preview */}
        <div className="md:w-1/2">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700"
          >
            {/* Chat Header */}
            <div className={`${primaryGradient} p-4 text-white flex items-center gap-3`}>
              <div className="w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center">
                <FaRobot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">AI Mediator</h3>
                <p className="text-xs opacity-80">Active in conversation</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-4 h-96 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: message.sender === 'ai' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: message.delay }}
                  className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${message.sender === 'ai' ? 'bg-gray-700' : 'bg-indigo-600'}`}>
                    <p className={message.sender === 'ai' ? 'text-gray-100' : 'text-white'}>
                      {message.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="border-t border-gray-700 p-4 flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 bg-gray-700 border border-gray-600 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
              <button className={`${primaryGradient} text-white p-2 rounded-full hover:from-indigo-600 hover:to-purple-700 transition-colors`}>
                <FiSend className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

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
    </div>
  );
}