'use client'
import { motion } from 'framer-motion'
import { FiCheck, FiX, FiUser, FiUsers, FiLock, FiZap, FiDollarSign } from 'react-icons/fi'

export default function CompetitorAnalysis() {
  const competitors = [
    {
      name: "ChatGPT",
      icon: "🤖",
      features: {
        multiUser: false,
        automated: true,
        encrypted: false,
        affordable: true
      },
      color: "text-blue-400"
    },
    {
      name: "Lawyer",
      icon: "⚖️",
      features: {
        multiUser: false,
        automated: false,
        encrypted: true,
        affordable: false
      },
      color: "text-amber-400"
    },
    {
      name: "Counselor",
      icon: "🧠",
      features: {
        multiUser: false,
        automated: false,
        encrypted: true,
        affordable: false
      },
      color: "text-purple-400"
    },
    {
      name: "Gaprio",
      icon: "🚀",
      features: {
        multiUser: true,
        automated: true,
        encrypted: true,
        affordable: true
      },
      color: "text-emerald-400"
    }
  ]

  const features = [
    {
      name: "Multi-User",
      icon: <FiUsers className="w-5 h-5" />,
      description: "Supports group negotiations with full context awareness"
    },
    {
      name: "Automated",
      icon: <FiZap className="w-5 h-5" />,
      description: "AI-powered processes without human bottlenecks"
    },
    {
      name: "Encrypted",
      icon: <FiLock className="w-5 h-5" />,
      description: "Enterprise-grade security for sensitive discussions"
    },
    {
      name: "Affordable",
      icon: <FiDollarSign className="w-5 h-5" />,
      description: "Fraction of traditional service costs"
    }
  ]

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Competitor</span> Analysis
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            How Gaprio outperforms traditional solutions across key metrics
          </p>
        </motion.div>

        {/* Comparison table */}
        <div className="overflow-x-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl min-w-[800px]"
          >
            {/* Table header */}
            <div className="grid grid-cols-5 border-b border-gray-800">
              <div className="col-span-1 p-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Features</h3>
              </div>
              {competitors.map((competitor, index) => (
                <div 
                  key={index}
                  className={`col-span-1 p-6 border-l border-gray-800 ${index === competitors.length - 1 ? 'bg-gray-800/20' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{competitor.icon}</span>
                    <h3 className={`text-lg font-semibold ${competitor.color}`}>{competitor.name}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature rows */}
            {features.map((feature, rowIndex) => (
              <motion.div
                key={rowIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.1 }}
                viewport={{ once: true }}
                className="grid grid-cols-5 border-b border-gray-800 last:border-0 group hover:bg-gray-800/20 transition-colors duration-300"
              >
                {/* Feature name */}
                <div className="col-span-1 p-6">
                  <div className="flex items-center gap-3">
                    <div className="text-indigo-400">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white">{feature.name}</h4>
                      <p className="text-sm text-gray-400 mt-1">{feature.description}</p>
                    </div>
                  </div>
                </div>

                {/* Competitor features */}
                {competitors.map((competitor, colIndex) => (
                  <div 
                    key={colIndex}
                    className={`col-span-1 p-6 border-l border-gray-800 flex items-center justify-center ${
                      colIndex === competitors.length - 1 ? 'bg-gray-800/10' : ''
                    }`}
                  >
                    {Object.values(competitor.features)[rowIndex] ? (
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"
                      >
                        <FiCheck className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400"
                      >
                        <FiX className="w-4 h-4" />
                      </motion.div>
                    )}
                  </div>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Key takeaways */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-gray-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Why Gaprio Stands Out</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Complete Solution</h4>
                  <p className="text-gray-400">Only Gaprio offers all critical features in one platform</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">No Compromises</h4>
                  <p className="text-gray-400">Enterprise security without enterprise pricing</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Built for Teams</h4>
                  <p className="text-gray-400">First AI negotiation tool designed for group dynamics</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FiCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Always Improving</h4>
                  <p className="text-gray-400">Continuous updates with latest legal frameworks</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}