import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  User, Settings, HelpCircle, Info, Globe, Bell, Shield, LogOut,
  Edit, FileText, MapPin, Plane, MessageCircle, Download, Upload
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSelector from '../components/LanguageSelector'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth()
  const { } = useLanguage()

  const menuItems = [
    {
      icon: Settings,
      title: 'Account Settings',
      subtitle: 'Manage your account preferences',
      onClick: () => toast.success('Opening account settings...'),
      link: '/profile?section=settings'
    },
    {
      icon: FileText,
      title: 'My Documents',
      subtitle: 'Manage visa documents and checklists',
      onClick: () => toast.success('Opening document manager...'),
      link: '/profile?section=documents'
    },
    {
      icon: MapPin,
      title: 'Saved Places',
      subtitle: 'Your bookmarked locations and routes',
      onClick: () => toast.success('Opening saved places...'),
      link: '/profile?section=places'
    },
    {
      icon: Plane,
      title: 'Travel History',
      subtitle: 'View your bookings and travel records',
      onClick: () => toast.success('Opening travel history...'),
      link: '/profile?section=travel'
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Control your notification preferences',
      onClick: () => toast.success('Opening notification settings...'),
      link: '/profile?section=notifications'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy and security settings',
      onClick: () => toast.success('Opening privacy settings...'),
      link: '/profile?section=privacy'
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help and contact our support team',
      onClick: () => toast.success('Opening help center...'),
      link: '/guide?topic=help'
    },
    {
      icon: Info,
      title: 'About MoveSmart',
      subtitle: 'Learn more about our platform',
      onClick: () => toast.success('Opening about page...'),
      link: '/profile?section=about'
    }
  ]

  const stats = [
    { label: 'AI Consultations', value: '24', icon: MessageCircle },
    { label: 'Countries Explored', value: '3', icon: Globe },
    { label: 'Travel Bookings', value: '2', icon: Plane },
    { label: 'Documents Prepared', value: '8', icon: FileText }
  ]

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-2">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-2"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0 text-center sm:text-left">
            
            {/* Avatar */}
            <div className="relative self-center sm:self-auto">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                )}
              </div>
              <button className="absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600">
                <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-lg lg:text-3xl font-bold text-gray-900">
                {isAuthenticated ? user?.name : 'Welcome, Traveler!'}
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {isAuthenticated ? user?.email : 'Sign in to sync your preferences and track your journey'}
              </p>

              {isAuthenticated && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-4 space-y-2 sm:space-y-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active User
                  </span>
                  <span className="text-sm text-gray-500">
                    Member since {new Date(user?.createdAt || '').toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {!isAuthenticated && (
            <div className="mt-6 text-center">
              <button
                onClick={() => toast.success('Redirecting to sign in...')}
                className="btn-primary px-8 py-3"
              >
                Sign In / Create Account
              </button>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-2"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Journey Stats</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-primary-600 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-2"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link
                to="/guide?topic=visa"
                className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <MessageCircle className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-medium text-blue-900">Ask AI Guide</h3>
                  <p className="text-sm text-blue-700">Get immigration advice</p>
                </div>
              </Link>
              
              <button
                onClick={() => toast.success('Document upload feature coming soon!')}
                className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Upload className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-medium text-green-900">Upload Documents</h3>
                  <p className="text-sm text-green-700">Secure document storage</p>
                </div>
              </button>
              
              <button
                onClick={() => toast.success('Generating immigration checklist...')}
                className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Download className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-medium flex text-purple-900">Download Checklist</h3>
                  <p className="text-sm text-purple-700">Personalized visa guide</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* Immigration Progress */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-2"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Immigration Progress</h2>
            
            <div className="space-y-4">
              {[
                { step: 'Initial Consultation', status: 'completed', progress: 100 },
                { step: 'Document Preparation', status: 'in-progress', progress: 60 },
                { step: 'Visa Application', status: 'pending', progress: 0 },
                { step: 'Travel Booking', status: 'pending', progress: 0 }
              ].map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.status === 'completed' ? 'bg-green-100 text-green-600' :
                    item.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {item.status === 'completed' ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{item.step}</span>
                      <span className="text-sm text-gray-500">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          item.status === 'completed' ? 'bg-green-500' :
                          item.status === 'in-progress' ? 'bg-blue-500' :
                          'bg-gray-300'
                        }`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Link
                to="/guide?topic=next-steps"
                className="inline-flex items-center  space-x-2 btn-primary"
              >
                <MessageCircle className="h-5 w-5" />
                <span className='text-md'>Get Next Steps</span>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Language Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-2"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <Globe className="h-6 w-6 text-primary-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Language Preferences</h3>
                <p className="text-sm text-gray-600">Choose your preferred language for the interface</p>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-2"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Settings & Support</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="w-full"
              >
                {item.link ? (
                  <Link
                    to={item.link}
                    className="flex items-center space-x-4 p-6 hover:bg-gray-50 transition-colors text-left w-full"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.subtitle}</p>
                    </div>
                  </Link>
                ) : (
                  <button
                    onClick={item.onClick}
                    className="flex items-center space-x-4 p-6 hover:bg-gray-50 transition-colors text-left w-full"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.subtitle}</p>
                    </div>
                  </button>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center"
        >
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-primary-600 mb-2">MoveSmart AI</h3>
          <p className="text-gray-600 mb-4">Version 1.0.0</p>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your AI-powered companion for safe and legal immigration worldwide. The "Google Maps for Immigration" – 
            helping 50,000+ people navigate their journey to a new life with step-by-step guidance, virtual tours, and smart booking.
          </p>
          
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/guide"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-800 font-medium"
            >
              <MessageCircle className="h-4 w-4" />
              <span>AI Guide</span>
            </Link>
            <Link
              to="/travel"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-800 font-medium"
            >
              <Plane className="h-4 w-4" />
              <span>Travel Services</span>
            </Link>
            <Link
              to="/maps"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-800 font-medium"
            >
              <MapPin className="h-4 w-4" />
              <span>Smart Maps</span>
            </Link>
          </div>
        </motion.div>

        {/* Logout Button */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-2 px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
