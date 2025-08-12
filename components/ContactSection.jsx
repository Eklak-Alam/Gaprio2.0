'use client'
import { motion } from 'framer-motion'
import { FiPhone, FiGlobe, FiMail, FiGithub, FiLinkedin, FiTwitter, FiInstagram } from 'react-icons/fi'

export default function ContactSection() {
  const contactMethods = [
    {
      icon: <FiPhone className="w-6 h-6" />,
      title: "Call Us",
      value: "+91 62016 68873",
      link: "tel:+916201668873",
      color: "from-green-500 to-emerald-500",
      hover: "hover:shadow-emerald-500/30"
    },
    {
      icon: <FiGlobe className="w-6 h-6" />,
      title: "Visit Us",
      value: "gaprio.vercel.app",
      link: "https://gaprio.vercel.app",
      color: "from-blue-500 to-cyan-500",
      hover: "hover:shadow-blue-500/30"
    },
    {
      icon: <FiMail className="w-6 h-6" />,
      title: "Email Us",
      value: "hanushashwat733@gmail.com",
      link: "mailto:hanushashwat733@gmail.com",
      color: "from-amber-500 to-orange-500",
      hover: "hover:shadow-amber-500/30"
    }
  ]

  const socialLinks = [
    { icon: <FiGithub className="w-5 h-5" />, url: "#", name: "GitHub", hover: "hover:bg-gray-800 hover:text-white" },
    { icon: <FiLinkedin className="w-5 h-5" />, url: "#", name: "LinkedIn", hover: "hover:bg-blue-600 hover:text-white" },
    { icon: <FiTwitter className="w-5 h-5" />, url: "#", name: "Twitter", hover: "hover:bg-blue-400 hover:text-white" },
    { icon: <FiInstagram className="w-5 h-5" />, url: "#", name: "Instagram", hover: "hover:bg-pink-600 hover:text-white" }
  ]

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20">

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gray-900/70 backdrop-blur-xl border border-gray-800 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Visual */}
            <div className="hidden lg:block relative h-full min-h-[500px] bg-gradient-to-br from-indigo-900/30 to-purple-900/30">
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="relative w-full h-full"
                >
                  <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[length:60px_60px] opacity-10"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{
                        rotate: 360,
                        transition: {
                          duration: 60,
                          repeat: Infinity,
                          ease: "linear"
                        }
                      }}
                      className="absolute w-64 h-64 border-2 border-dashed border-indigo-500/30 rounded-full"
                    ></motion.div>
                    <motion.div
                      animate={{
                        rotate: -360,
                        transition: {
                          duration: 40,
                          repeat: Infinity,
                          ease: "linear"
                        }
                      }}
                      className="absolute w-80 h-80 border-2 border-dashed border-purple-500/20 rounded-full"
                    ></motion.div>
                    <div className="relative z-10 text-center p-8">
                      <motion.h3
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-white mb-4"
                      >
                        Let's Connect
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        viewport={{ once: true }}
                        className="text-gray-400 max-w-md mx-auto"
                      >
                        We're excited to hear from you and discuss how we can work together.
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Side - Contact Info */}
            <div className="p-12">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Thank You!
                  </span>
                </h2>
                <p className="text-lg text-gray-400 mb-10">
                  Reach out to us through any of these channels
                </p>

                {/* Contact Cards */}
                <div className="space-y-6 mb-12">
                  {contactMethods.map((method, index) => (
                    <motion.a
                      key={index}
                      href={method.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 * index }}
                      viewport={{ once: true }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className={`flex items-center gap-6 p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-transparent shadow-lg ${method.hover} transition-all duration-300`}
                    >
                      <div className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} text-white shadow-md`}>
                        {method.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{method.title}</h3>
                        <p className="text-gray-400">{method.value}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Follow Us</h3>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5, scale: 1.1 }}
                        className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gray-800 text-gray-400 ${social.hover} border border-gray-700 hover:border-transparent transition-all duration-300 shadow-md`}
                        aria-label={social.name}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}