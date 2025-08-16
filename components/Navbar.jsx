'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { FiMenu, FiX, FiArrowRight, FiMessageSquare } from 'react-icons/fi'
import { RiChatSmileLine } from 'react-icons/ri'
import { BsFileEarmarkText } from 'react-icons/bs'
import { usePathname } from 'next/navigation'

export default function PremiumNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [visible, setVisible] = useState(true)
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/", icon: <RiChatSmileLine className="text-lg" /> },
    { name: "About", href: "/about", icon: <RiChatSmileLine className="text-lg" /> },
    { name: "Services", href: "/services", icon: <RiChatSmileLine className="text-lg" /> },
    { name: "Contract Generator", href: "/contract-generator", icon: <BsFileEarmarkText className="text-lg" /> },
    { name: "Chat", href: "/chat", icon: <FiMessageSquare className="text-lg" /> },
  ]

  // Enhanced scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show/hide navbar logic
      if (currentScrollY < 100) {
        setVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false)
      } else if (currentScrollY < lastScrollY - 10) {
        setVisible(true)
      }
      
      // Scrolled state for styling
      setIsScrolled(currentScrollY > 30)
      setLastScrollY(currentScrollY)
      
      // Close mobile menu when scrolling down
      if (mobileMenuOpen && currentScrollY > lastScrollY && currentScrollY > 100) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, mobileMenuOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const primaryGradient = 'bg-gradient-to-r from-indigo-500 to-purple-600'
  const primaryHover = 'hover:from-indigo-600 hover:to-purple-700'
  const textGradient = `bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent`

  return (
    <>
      {/* Main Navbar */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
          opacity: { duration: 0.2 }
        }}
        className={`fixed w-[94%] max-w-7xl left-1/2 -translate-x-1/2 z-50 mt-4
                    ${isScrolled ? 'bg-gray-900/95 backdrop-blur-lg' : 'bg-gray-900/90 backdrop-blur-md'} 
                    border border-gray-700/50 rounded-xl shadow-xl transition-all duration-300`}
      >
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo with enhanced animation */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Link href="/" className="flex items-center gap-2 focus-visible:outline-none">
                <motion.div 
                  className="h-8 w-8 rounded-lg overflow-hidden relative"
                  whileHover={{ rotate: 5 }}
                >
                  <Image 
                    src="/logo.png" 
                    alt="Gaprio Logo" 
                    width={32} 
                    height={32} 
                    className="object-contain"
                    priority
                  />
                </motion.div>
                <motion.span 
                  className={`text-xl font-bold ${textGradient}`}
                  whileHover={{ scale: 1.05 }}
                >
                  Gaprio
                </motion.span>
              </Link>
            </motion.div>

            {/* Desktop Navigation with enhanced interactions */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className="relative group px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors focus-visible:outline-none"
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.05,
                      color: "#ffffff"
                    }}
                    className="flex items-center gap-2"
                  >
                    <motion.span whileHover={{ scale: 1.2 }}>
                      {item.icon}
                    </motion.span>
                    {item.name}
                  </motion.div>
                  {pathname === item.href && (
                    <motion.span 
                      className="absolute left-1/2 bottom-0 h-[2px] w-[70%] bg-gradient-to-r from-indigo-400 to-purple-500 -translate-x-1/2"
                      layoutId="active-nav-item"
                      transition={{ 
                        type: 'spring', 
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                  {pathname !== item.href && (
                    <motion.span 
                      className="absolute left-1/2 bottom-0 h-[1px] w-0 group-hover:w-[70%] bg-gradient-to-r from-indigo-400/30 to-purple-500/30 -translate-x-1/2"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Enhanced CTA Button */}
            <div className="hidden md:block">
              <Link href="/get-started" className="focus-visible:outline-none">
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 5px 15px -3px rgba(139, 92, 246, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg text-white ${primaryGradient} ${primaryHover} shadow-lg transition-all flex items-center gap-2`}
                >
                  <span>Get Started</span>
                  <motion.span
                    animate={{ x: [0, 2, 0] }}
                    transition={{ 
                      repeat: Infinity,
                      duration: 1.5
                    }}
                  >
                    <FiArrowRight />
                  </motion.span>
                </motion.button>
              </Link>
            </div>

            {/* Enhanced Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all focus-visible:outline-none"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <motion.div
                  animate={{ rotate: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <FiMenu className="h-6 w-6" />
                </motion.div>
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Premium Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Enhanced Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-lg z-40"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Enhanced Mobile Menu Content */}
            <motion.div
              key="mobile-menu"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 400,
                damping: 30
              }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-[94%] max-w-md bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="px-2 py-4 space-y-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ 
                      x: 0, 
                      opacity: 1,
                      transition: { 
                        delay: index * 0.05,
                        type: 'spring',
                        stiffness: 500
                      }
                    }}
                  >
                    <Link 
                      href={item.href}
                      className={`block px-4 py-3 mx-2 rounded-lg text-base font-medium transition-all focus-visible:outline-none ${
                        pathname === item.href 
                          ? 'text-white bg-gradient-to-r from-indigo-500/20 to-purple-600/20' 
                          : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-3"
                      >
                        <motion.span whileTap={{ scale: 0.9 }}>
                          {item.icon}
                        </motion.span>
                        <span>{item.name}</span>
                        {pathname === item.href && (
                          <motion.span 
                            className="ml-auto h-2 w-2 rounded-full bg-purple-500"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}

                {/* Enhanced Mobile CTA Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ 
                    y: 0, 
                    opacity: 1,
                    transition: { delay: navItems.length * 0.05 + 0.1 }
                  }}
                  className="pt-2 px-2"
                >
                  <Link href="/get-started" className="focus-visible:outline-none">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-4 py-3 text-sm font-medium rounded-lg text-white ${primaryGradient} ${primaryHover} shadow-lg transition-all flex items-center justify-center gap-2`}
                    >
                      <span>Get Started</span>
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <FiArrowRight />
                      </motion.span>
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}