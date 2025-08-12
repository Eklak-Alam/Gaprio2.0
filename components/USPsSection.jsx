'use client'
import { motion } from 'framer-motion'
import { FiUsers, FiCpu, FiBook, FiActivity, FiAward, FiMessageSquare } from 'react-icons/fi'

export default function USPsSection() {
  const features = [
    {
      icon: <FiUsers className="w-5 h-5" />,
      title: "Multi-User AI Chatbot",
      description: "Handles group chats with full context awareness across all participants",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: <FiCpu className="w-5 h-5" />,
      title: "Logic over Diplomacy",
      description: "Makes decisions based on facts and data, not flattery or politics",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <FiBook className="w-5 h-5" />,
      title: "Regular Law Revisions",
      description: "Always updated with the latest legal changes and compliance requirements",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <FiActivity className="w-5 h-5" />,
      title: "Integrated Agentic AI",
      description: "Acts on your behalf with full context memory and permission-based actions",
      color: "from-rose-500 to-pink-500"
    },
    {
      icon: <FiAward className="w-5 h-5" />,
      title: "Research-Backed Training",
      description: "Informed by credible, peer-reviewed evidence-based sources",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FiMessageSquare className="w-5 h-5" />,
      title: "Zero Learning Curve",
      description: "Familiar chat interface - like WhatsApp but for professional negotiations",
      color: "from-violet-500 to-fuchsia-500"
    }
  ]

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Decorative grid pattern */}
      {/* <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[length:60px_60px]"></div>
      </div> */}
      
      {/* Animated gradient circles */}
      {/* <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div> */}

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
            Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Advantages</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Why professionals choose our platform for critical negotiations
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="relative group"
            >
              <div className="relative h-full bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 group-hover:border-gray-700 transition-all duration-300 overflow-hidden">
                {/* Gradient corner accent */}
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-bl-3xl`}></div>
                
                {/* Feature icon */}
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} mb-4 text-white`}>
                  {feature.icon}
                </div>
                
                {/* Feature content */}
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
                
                {/* Hover indicator */}
                <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.color} transition-all duration-500`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800/50 rounded-xl border border-gray-800 p-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="border-r border-gray-800 pr-6 last:border-0 last:pr-0">
              <div className="text-3xl font-bold text-white mb-2">98%</div>
              <div className="text-sm text-gray-400">Accuracy Rate</div>
            </div>
            <div className="border-r border-gray-800 pr-6 last:border-0 last:pr-0">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-sm text-gray-400">Availability</div>
            </div>
            <div className="border-r border-gray-800 pr-6 last:border-0 last:pr-0">
              <div className="text-3xl font-bold text-white mb-2">10x</div>
              <div className="text-sm text-gray-400">Faster Negotiations</div>
            </div>
            <div className="border-r border-gray-800 pr-6 last:border-0 last:pr-0">
              <div className="text-3xl font-bold text-white mb-2">100+</div>
              <div className="text-sm text-gray-400">Legal Jurisdictions</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}