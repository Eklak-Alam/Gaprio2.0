'use client';
import React, { useState } from 'react';
import { 
  FaUser, 
  FaEdit, 
  FaCamera, 
  FaSave, 
  FaTimes, 
  FaEnvelope, 
  FaIdCard, 
  FaCrown,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaLinkedin,
  FaGithub,
  FaTwitter
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileSection = ({ currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(currentUser);
  const [profileImage, setProfileImage] = useState(currentUser.avatarUrl || '');

  const handleSave = () => {
    // Here you would typically make an API call to update the user
    console.log('Saving changes:', editedUser);
    setIsEditing(false);
    // Update currentUser with editedUser data
  };

  const handleCancel = () => {
    setEditedUser(currentUser);
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const InputField = ({ label, value, onChange, name, type = 'text', placeholder, icon: Icon }) => (
    <div className="space-y-2">
      <label className="text-gray-400 text-sm font-medium flex items-center">
        {Icon && <Icon className="mr-2 text-sm" />}
        {label}
      </label>
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      ) : (
        <p className="text-white font-medium">{value || 'Not provided'}</p>
      )}
    </div>
  );

  const SocialLink = ({ platform, username, icon: Icon }) => (
    username && (
      <motion.a
        whileHover={{ scale: 1.05 }}
        href={`https://${platform}.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors p-2 bg-gray-700/50 rounded-lg"
      >
        <Icon className="text-lg" />
        <span className="text-sm">@{username}</span>
      </motion.a>
    )
  );

  return (
    <div className="bg-gray-800 p-4 lg:p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
            <FaUser className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Profile</h1>
            <p className="text-gray-400 text-sm">Manage your personal information</p>
          </div>
        </div>
        
        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white transition-colors"
          >
            <FaEdit className="text-sm" />
            <span>Edit Profile</span>
          </motion.button>
        ) : (
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white transition-colors"
            >
              <FaSave className="text-sm" />
              <span>Save</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white transition-colors"
            >
              <FaTimes className="text-sm" />
              <span>Cancel</span>
            </motion.button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700/50 rounded-2xl p-6 text-center border border-gray-600"
          >
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-bold">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt={currentUser.username}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  currentUser.username?.charAt(0).toUpperCase()
                )}
              </div>
              
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                  <FaCamera className="text-white text-sm" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <h2 className="text-xl font-bold text-white mb-1">
              {currentUser.name || currentUser.username}
            </h2>
            <p className="text-gray-400 mb-4">@{currentUser.username}</p>

            <div className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center">
              <FaCrown className="mr-1 text-sm" />
              {currentUser.role}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-white font-bold text-lg">247</div>
                <div className="text-gray-400 text-xs">Messages</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-lg">23</div>
                <div className="text-gray-400 text-xs">Friends</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-lg">12</div>
                <div className="text-gray-400 text-xs">Groups</div>
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-700/50 rounded-2xl p-6 mt-6 border border-gray-600"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
            <div className="space-y-2">
              <SocialLink platform="twitter" username={currentUser.twitter} icon={FaTwitter} />
              <SocialLink platform="github" username={currentUser.github} icon={FaGithub} />
              <SocialLink platform="linkedin" username={currentUser.linkedin} icon={FaLinkedin} />
            </div>
          </motion.div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700/50 rounded-2xl p-6 border border-gray-600"
          >
            <h3 className="text-lg font-semibold text-white mb-6">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                value={editedUser.name}
                onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                name="name"
                placeholder="Enter your full name"
                icon={FaUser}
              />

              <InputField
                label="Username"
                value={editedUser.username}
                onChange={(e) => setEditedUser({...editedUser, username: e.target.value})}
                name="username"
                placeholder="Enter username"
                icon={FaIdCard}
              />

              <InputField
                label="Email Address"
                value={editedUser.email}
                onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                name="email"
                type="email"
                placeholder="Enter email address"
                icon={FaEnvelope}
              />

              <InputField
                label="Phone Number"
                value={editedUser.phone}
                onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                name="phone"
                type="tel"
                placeholder="Enter phone number"
                icon={FaPhone}
              />

              <InputField
                label="Location"
                value={editedUser.location}
                onChange={(e) => setEditedUser({...editedUser, location: e.target.value})}
                name="location"
                placeholder="Enter your location"
                icon={FaMapMarkerAlt}
              />

              <InputField
                label="Website"
                value={editedUser.website}
                onChange={(e) => setEditedUser({...editedUser, website: e.target.value})}
                name="website"
                type="url"
                placeholder="Enter website URL"
                icon={FaGlobe}
              />
            </div>

            {/* Bio Section */}
            <div className="mt-6">
              <label className="text-gray-400 text-sm font-medium mb-2 block">Bio</label>
              {isEditing ? (
                <textarea
                  value={editedUser.bio || ''}
                  onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  rows="4"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              ) : (
                <p className="text-white">
                  {currentUser.bio || 'No bio provided yet. Tell us something about yourself!'}
                </p>
              )}
            </div>
          </motion.div>

          {/* Account Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-700/50 rounded-2xl p-6 mt-6 border border-gray-600"
          >
            <h3 className="text-lg font-semibold text-white mb-6">Account Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">User ID</label>
                <p className="text-white font-mono text-sm bg-gray-600 p-2 rounded-lg">
                  {currentUser.id}
                </p>
              </div>

              <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">Member Since</label>
                <p className="text-white flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-400" />
                  {currentUser.createdAt || 'January 2024'}
                </p>
              </div>

              <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">Status</label>
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                  Active
                </span>
              </div>

              <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">Last Login</label>
                <p className="text-white">2 hours ago</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;