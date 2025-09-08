'use client';
import React, { useState } from 'react';
import { 
  FaShieldAlt, 
  FaClock, 
  FaKey, 
  FaLock, 
  FaBell, 
  FaMobileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEyeSlash,
  FaTrash,
  FaDesktop
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const SecuritySection = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: 'Chrome on Windows', location: 'New York, USA', lastActive: '2 hours ago', current: true },
    { id: 2, device: 'Safari on iPhone', location: 'San Francisco, USA', lastActive: '1 day ago', current: false },
    { id: 3, device: 'Firefox on MacOS', location: 'London, UK', lastActive: '1 week ago', current: false }
  ]);

  const SecurityCard = ({ 
    icon, 
    title, 
    description, 
    action, 
    status, 
    color = 'indigo',
    children 
  }) => {
    const colorClasses = {
      indigo: 'bg-indigo-500/20 text-indigo-400',
      green: 'bg-green-500/20 text-green-400',
      blue: 'bg-blue-500/20 text-blue-400',
      red: 'bg-red-500/20 text-red-400',
      yellow: 'bg-yellow-500/20 text-yellow-400'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-700/50 rounded-xl p-5 border border-gray-600 hover:border-gray-500 transition-colors"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center`}>
              {icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white text-lg">{title}</h3>
              <p className="text-gray-400 text-sm mt-1">{description}</p>
            </div>
          </div>
          {status && (
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              status === 'enabled' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {status === 'enabled' ? 'Enabled' : 'Disabled'}
            </div>
          )}
        </div>
        
        {children}
        
        {action && (
          <div className="mt-4 pt-4 border-t border-gray-600">
            {action}
          </div>
        )}
      </motion.div>
    );
  };

  const terminateSession = (sessionId) => {
    setActiveSessions(activeSessions.filter(session => session.id !== sessionId));
  };

  const terminateAllSessions = () => {
    setActiveSessions(activeSessions.filter(session => session.current));
  };

  return (
    <div className="bg-gray-800 p-4 lg:p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
            <FaShieldAlt className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Security Center</h1>
            <p className="text-gray-400 text-sm">Manage your account security and privacy settings</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Two-Factor Authentication */}
        <SecurityCard
          icon={<FaMobileAlt className="text-lg" />}
          title="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
          status={twoFactorEnabled ? 'enabled' : 'disabled'}
          color="green"
          action={
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                twoFactorEnabled
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          }
        >
          <div className="text-sm text-gray-300 space-y-2">
            <div className="flex items-center space-x-2">
              {twoFactorEnabled ? (
                <FaCheckCircle className="text-green-400 text-sm" />
              ) : (
                <FaTimesCircle className="text-gray-400 text-sm" />
              )}
              <span>Require code from authenticator app</span>
            </div>
            <div className="flex items-center space-x-2">
              {twoFactorEnabled ? (
                <FaCheckCircle className="text-green-400 text-sm" />
              ) : (
                <FaTimesCircle className="text-gray-400 text-sm" />
              )}
              <span>Backup codes generated</span>
            </div>
          </div>
        </SecurityCard>

        {/* Password Management */}
        <SecurityCard
          icon={<FaKey className="text-lg" />}
          title="Password Security"
          description="Update your password regularly"
          color="blue"
          action={
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded-lg text-white font-medium transition-colors">
              Change Password
            </button>
          }
        >
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value="••••••••••••"
              readOnly
              className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 pr-12 text-white"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Last changed: 3 months ago</p>
        </SecurityCard>
      </div>

      {/* Active Sessions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <FaClock className="mr-2 text-blue-400" />
            Active Sessions
          </h2>
          {activeSessions.length > 1 && (
            <button
              onClick={terminateAllSessions}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Terminate All Others
            </button>
          )}
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {activeSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:border-gray-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <FaDesktop className="text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{session.device}</p>
                      <p className="text-gray-400 text-sm">{session.location}</p>
                      <p className="text-gray-500 text-xs">{session.lastActive}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {session.current && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                        Current
                      </span>
                    )}
                    {!session.current && (
                      <button
                        onClick={() => terminateSession(session.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Terminate session"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Privacy Settings */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center mb-6">
          <FaLock className="mr-2 text-purple-400" />
          Privacy Settings
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SecurityCard
            icon={<FaBell className="text-lg" />}
            title="Login Notifications"
            description="Get notified of new sign-ins"
            status="enabled"
            color="yellow"
            action={
              <button className="w-full bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded-lg text-white font-medium transition-colors">
                Configure
              </button>
            }
          />

          <SecurityCard
            icon={<FaShieldAlt className="text-lg" />}
            title="Data Privacy"
            description="Manage your data and privacy settings"
            color="purple"
            action={
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded-lg text-white font-medium transition-colors">
                View Settings
              </button>
            }
          />
        </div>
      </div>

      {/* Security Tips */}
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-3">🔒 Security Tips</h3>
        <ul className="text-sm text-gray-300 space-y-2">
          <li>• Use a strong, unique password for your account</li>
          <li>• Enable two-factor authentication for extra security</li>
          <li>• Regularly review your active sessions</li>
          <li>• Be cautious of suspicious emails and links</li>
          <li>• Keep your recovery options up to date</li>
        </ul>
      </div>
    </div>
  );
};

export default SecuritySection;