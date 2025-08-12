'use client'
import { motion } from 'framer-motion'
import { FiMic, FiHeart, FiUsers, FiCheckCircle } from 'react-icons/fi'

export default function SolutionSection() {
  const solutions = [
    {
      icon: <FiMic className="w-6 h-6" />,
      name: "Clause",
      tagline: "Voice-Powered Contract Drafting",
      description: "Listens to live negotiations & distinguishes parties through voice recognition to draft legally valid contracts.",
      features: [
        "Continuously updated from International Contract Law",
        "Real-time legal compliance checks",
        "Automated clause suggestions"
      ],
      principle: "Clarity > Complexity",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: <FiHeart className="w-6 h-6" />,
      name: "Harmony",
      tagline: "AI Mediation Engine",
      description: "Facilitates understanding by mediating conversations and bridging multifaceted perspectives.",
      features: [
        "Modeled on evidence-based parenting science",
        "Emotional tone analysis",
        "Conflict resolution protocols"
      ],
      principle: "Understanding > Arguing",
      color: "from-amber-500 to-pink-500"
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      name: "Accord",
      tagline: "Collaborative AI Workspace",
      description: "Multi-user AI chatbot that helps teams maximize productivity on complex group projects.",
      features: [
        "Trained on logic & psychology research",
        "Real-time consensus building",
        "Automated meeting summaries"
      ],
      principle: "Directness > Diplomacy",
      color: "from-emerald-500 to-cyan-500"
    }
  ]

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Floating gradient spheres */}
      {/* <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/30 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 right-0 w-80 h-80 bg-indigo-600/30 rounded-full filter blur-3xl animate-float animation-delay-4000"></div>
      </div> */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-20 px-4"
            >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                The{" "}
                <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 animate-gradient">
                    Solution
                </span>
                <span className="absolute left-0 bottom-0 w-full h-[3px] bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 rounded-full shadow-lg animate-pulse" />
                </span>
            </h2>

            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Our <span className="text-white font-semibold">AI-powered tools</span> 
                transform negotiation challenges into{" "}
                <span className="text-indigo-400 font-medium">seamless collaboration</span>, 
                making complex discussions smooth, efficient, and results-driven.
            </p>
            </motion.div>


        {/* Solutions grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
              className="relative group"
            >
              {/* Gradient border effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${solution.color} opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500`}></div>
              
              <div className="relative h-full bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 group-hover:border-gray-700 transition-all duration-300 overflow-hidden">
                {/* Solution header */}
                <div className="flex items-start mb-6">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${solution.color} text-white shadow-lg`}>
                    {solution.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-white">{solution.name}</h3>
                    <p className="text-sm text-gray-400">{solution.tagline}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-6">{solution.description}</p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {solution.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <FiCheckCircle className="flex-shrink-0 mt-1 mr-2 text-emerald-400" />
                      <span className="text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Principle badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800 border border-gray-700">
                    <span className="text-xs font-medium text-gray-300">{solution.principle}</span>
                  </div>
                </div>

                {/* Animated hover element */}
                <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full ${solution.color.replace('to', 'from')}/20 z-0 group-hover:scale-150 transition-transform duration-700`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300">
            Explore All Solutions
          </button>
        </motion.div>
      </div>
    </section>
  )
}