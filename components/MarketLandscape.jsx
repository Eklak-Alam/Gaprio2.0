'use client'
import { motion } from 'framer-motion'
import { FiCheck, FiX, FiDollarSign, FiUsers, FiZap, FiLayers } from 'react-icons/fi'

export default function MarketLandscape() {
  const comparisons = [
    {
      category: "User Capacity",
      traditional: {
        icon: <FiUsers className="text-red-400" />,
        text: "Single-user only",
        cons: ["Limited to 1:1 interactions", "No group context"]
      },
      gaprio: {
        icon: <FiUsers className="text-emerald-400" />,
        text: "Multi-user AI",
        pros: ["Group negotiation support", "Full context awareness"]
      }
    },
    {
      category: "Pricing Model",
      traditional: {
        icon: <FiDollarSign className="text-red-400" />,
        text: "Expensive services",
        cons: ["High per-hour rates", "Hidden fees"]
      },
      gaprio: {
        icon: <FiDollarSign className="text-emerald-400" />,
        text: "Affordable AI",
        pros: ["Predictable pricing", "No surprise costs"]
      }
    },
    {
      category: "Technology",
      traditional: {
        icon: <FiLayers className="text-red-400" />,
        text: "Manual processes",
        cons: ["Human bottlenecks", "Inconsistent quality"]
      },
      gaprio: {
        icon: <FiZap className="text-emerald-400" />,
        text: "Agentic AI",
        pros: ["Automated workflows", "Continuous improvements"]
      }
    },
    {
      category: "Legal Compliance",
      traditional: {
        icon: <FiLayers className="text-red-400" />,
        text: "Static contracts",
        cons: ["Manual updates needed", "Compliance risks"]
      },
      gaprio: {
        icon: <FiCheck className="text-emerald-400" />,
        text: "Auto-updating",
        pros: ["Real-time law revisions", "Always compliant"]
      }
    }
  ]

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Decorative elements */}
      {/* <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-indigo-600/20 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div> */}

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
            Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Landscape</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            How Gaprio compares to traditional solutions
          </p>
        </motion.div>

        {/* Comparison table */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 bg-gray-800/50 border-b border-gray-800">
            <div className="col-span-12 md:col-span-3 p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Comparison</h3>
            </div>
            <div className="col-span-6 md:col-span-4 p-6 border-l border-gray-800">
              <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Traditional Solutions</h3>
            </div>
            <div className="col-span-6 md:col-span-5 p-6 border-l border-gray-800">
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Gaprio Advantage</h3>
            </div>
          </div>

          {/* Comparison rows */}
          {comparisons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="grid grid-cols-12 border-b border-gray-800 last:border-0 group hover:bg-gray-800/30 transition-colors duration-300"
            >
              {/* Category */}
              <div className="col-span-12 md:col-span-3 p-6">
                <h4 className="text-lg font-medium text-white">{item.category}</h4>
              </div>

              {/* Traditional solution */}
              <div className="col-span-6 md:col-span-4 p-6 border-l border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  {item.traditional.icon}
                  <span className="text-gray-300">{item.traditional.text}</span>
                </div>
                <ul className="space-y-2">
                  {item.traditional.cons.map((con, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-400">
                      <FiX className="flex-shrink-0 mt-0.5 mr-2 text-red-400" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gaprio advantage */}
              <div className="col-span-6 md:col-span-5 p-6 border-l border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  {item.gaprio.icon}
                  <span className="text-gray-300">{item.gaprio.text}</span>
                </div>
                <ul className="space-y-2">
                  {item.gaprio.pros.map((pro, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-400">
                      <FiCheck className="flex-shrink-0 mt-0.5 mr-2 text-emerald-400" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Key differentiators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FiUsers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Multi-User First</h3>
            </div>
            <p className="text-gray-400">
              First-of-its-kind AI designed specifically for group negotiations and team collaborations.
            </p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <FiDollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Cost Effective</h3>
            </div>
            <p className="text-gray-400">
              Fraction of the cost of traditional legal and negotiation services with better results.
            </p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FiZap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Always Current</h3>
            </div>
            <p className="text-gray-400">
              Continuously updated with the latest legal frameworks and negotiation best practices.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}