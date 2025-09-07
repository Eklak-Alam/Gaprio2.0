"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DemoNotification() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating action button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-red-600 rounded-full cursor-pointer shadow-lg flex items-center justify-center text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Website status notification"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </motion.button>

      {/* Notification panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-16 z-40 w-80 bg-red-600 text-white rounded-lg shadow-xl p-4"
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.6 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">Demo Website Notice</h3>
                <div className="mt-1 text-sm">
                  <p>
                    This is currently a demo website. AI is unavailable due to
                    lack of Azure funding.
                  </p>
                </div>
                <div className="mt-3">
                  <a
                    href="mailto:hanu_24a12res261@iitp.ac.in"
                    className="text-sm font-medium text-red-100 hover:text-white underline"
                  >
                    Contact us here
                  </a>
                </div>
              </div>
              <button
                className="ml-auto flex-shrink-0 text-red-200 hover:text-white"
                onClick={() => setIsOpen(false)}
                aria-label="Close notification"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
