'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { FiMenu, FiX, FiUpload, FiArrowRight, FiMessageSquare } from 'react-icons/fi'
import { RiChatSmileLine } from 'react-icons/ri'
import { BsFileEarmarkText } from 'react-icons/bs'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/", icon: <RiChatSmileLine className="text-lg" /> },
    { name: "About", href: "/about", icon: <RiChatSmileLine className="text-lg" /> },
    { name: "Services", href: "/services", icon: <RiChatSmileLine className="text-lg" /> },
    { name: "Contract Generator", href: "/contract-generator", icon: <BsFileEarmarkText className="text-lg" /> },
    { name: "Chat", href: "/chat", icon: <FiMessageSquare className="text-lg" /> },
  ]

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 30)
      
      // Hide navbar when scrolling down, show when scrolling up
      setIsVisible(currentScrollY < 100 || currentScrollY < window.previousScrollY)
      
      // Close mobile menu when scrolling
      if (mobileMenuOpen && currentScrollY > 50) {
        setMobileMenuOpen(false)
      }
      
      window.previousScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mobileMenuOpen])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const primaryGradient = 'from-indigo-500 to-purple-600'
  const primaryHover = 'hover:from-indigo-600 hover:to-purple-700'
  const textGradient = `bg-gradient-to-r ${primaryGradient} bg-clip-text text-transparent`

  return (
    <>
      {/* Main Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ 
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          opacity: { duration: 0.2 }
        }}
        className={`fixed w-[94%] max-w-7xl left-1/2 -translate-x-1/2 z-50 mt-4
                    ${isScrolled ? 'bg-gray-900/95 backdrop-blur-md' : 'bg-gray-900/80 backdrop-blur-sm'} 
                    border border-gray-800 rounded-xl shadow-2xl transition-all duration-300`}
      >
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              className="flex-shrink-0"
            >
              <Link href="/" className="flex items-center gap-2 focus-visible:outline-none">
                <motion.div 
                  className="h-8 w-8 rounded-lg overflow-hidden relative"
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
                <span className={`text-xl font-bold ${textGradient}`}>Gaprio</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className="relative group px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:rounded-md"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1"
                  >
                    {item.icon}
                    {item.name}
                  </motion.div>
                  {pathname === item.href && (
                    <motion.span 
                      className="absolute left-1/2 bottom-0 h-0.5 w-[80%] bg-gradient-to-r from-indigo-400 to-purple-500 -translate-x-1/2"
                      layoutId="active-nav-item"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* CTA Button - Desktop */}
            <div className="hidden md:block">
              <Link href="/get-started" className="focus-visible:outline-none">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 text-sm font-medium rounded-md text-white bg-gradient-to-r ${primaryGradient} ${primaryHover} shadow-lg transition-all duration-200 flex items-center`}
                >
                  Get Started
                  <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu Content */}
            <motion.div
              key="mobile-menu"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-[94%] max-w-md bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link 
                      href={item.href}
                      className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                        pathname === item.href 
                          ? 'text-white bg-gray-800' 
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile CTA Button */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: navItems.length * 0.05 + 0.1 }}
                  className="pt-4 mt-2 border-t border-gray-800"
                >
                  <Link href="/get-started" className="focus-visible:outline-none">
                    <button
                      className={`w-full px-4 py-3 text-sm font-medium rounded-md text-white bg-gradient-to-r ${primaryGradient} ${primaryHover} shadow-lg transition-all duration-200 flex items-center justify-center`}
                    >
                      Get Started
                      <FiArrowRight className="ml-2" />
                    </button>
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