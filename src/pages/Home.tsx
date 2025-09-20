import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  MessageCircle, 
  Globe, 
  Users, 
  ArrowRight, 
  Star,
  CheckCircle,
  Play,
  Zap,
  Shield,
  Heart,
  Navigation,
  FileText,
  Camera,
  GraduationCap,
  CheckSquare, Plane, Map ,Rocket
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function Home() {
  const { t } = useLanguage()
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const features = [
    {
      icon: MessageCircle,
      title: 'AI Immigration Guide',
      description: 'Step-by-step visa guidance, document checklists, and personalized immigration roadmaps',
      color: 'bg-blue-500',
      link: '/guide'
    },
    {
      icon: Plane,
      title: 'Immigration-Friendly Travel',
      description: 'Book flights, hotels, and transport with proper documentation for visa applications',
      color: 'bg-green-500',
      link: '/travel'
    },
    {
      icon: Navigation,
      title: 'Smart Navigation',
      description: 'Find immigration offices, safe neighborhoods, and essential services with AI guidance',
      color: 'bg-yellow-500',
      link: '/maps'
    },
    {
      icon: Users,
      title: 'Global Community',
      description: 'Connect with fellow immigrants, share experiences, and get mentorship support',
      color: 'bg-purple-500',
      link: '/profile'
    }
  ]

  const stats = [
    { number: '50K+', label: 'Users Helped', icon: Users },
    { number: '150+', label: 'Countries', icon: Globe },
    { number: '10+', label: 'Languages', icon: MessageCircle },
    { number: '99%', label: 'Success Rate', icon: CheckCircle }
  ]

  const benefits = [
    { text: 'AI-powered step-by-step guidance', icon: Zap },
    { text: 'Immigration-friendly booking options', icon: Plane },
    { text: 'Virtual tours and location previews', icon: Camera },
    { text: 'Real-time visa and travel updates', icon: CheckCircle },
    { text: 'Secure document management', icon: Shield },
    { text: 'Global immigrant community support', icon: Heart }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        initial={{ opacity: 0, y: 20 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="hero-gradient text-white py-16 sm:py-20 lg:py-28"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Text */}
            <div className="text-center lg:text-left">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                {t('hero.title')}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-base sm:text-sm lg:text-lg mb-8 text-blue-100 leading-relaxed max-w-3xl mx-auto lg:mx-0"
              >
                Navigate the world with confidence using our intelligent guide for safe and legal relocation. From visa guidance to virtual tours, we are your complete immigration companion.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link
                  to="/guide"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                
                <Link 
                  to="/maps" 
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-200 text-sm sm:text-base"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Virtual Tour
                </Link>
              </motion.div>
            </div>

            {/* Floating Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative hidden md:block"
            >
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 sm:p-8 animate-float">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-4 text-sm sm:text-base">
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500 mt-1" />
                    <div className="flex-1">
                      <p className="text-gray-800">"What documents do I need for a student visa to Canada?"</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <p className="text-gray-700 text-xs sm:text-sm">
                      For a Canadian student visa, you will need: passport, letter of acceptance, proof of financial support ($10,000+ CAD), medical exam, and clean criminal record...
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        <CheckSquare className="h-3 w-3" /> Checklist
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        <Plane className="h-3 w-3" /> Book Travel
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                        <Map className="h-3 w-3" /> Virtual Tour
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl transform rotate-3 scale-105 opacity-20"></div>
            </motion.div>
          </div>
        </div>
      </motion.section>


      {/* Features Section */}
      <motion.section 
        ref={featuresRef}
        initial={{ opacity: 0 }}
        animate={featuresInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="py-10 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-5">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
              Complete Immigration & Relocation Platform
            </h2>
            <p className="text-md text-gray-600 max-w-3xl mx-auto">
              From visa guidance to virtual tours - everything you need for successful immigration
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  to={feature.link}
                 className="card p-8 py-8 h-1/2 md:h-full group cursor-pointer"
                >
                  <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-md font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-4 px-8 flex items-center text-primary-600 font-medium">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* Quick Start Guide */}
          <div className="mt-10 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Your Immigration Journey in 4 Steps
              </h3>
              <p className="text-gray-600 text-sm">
                Follow our proven process used by thousands of successful immigrants
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'AI Consultation', desc: 'Get personalized visa guidance', icon: MessageCircle, link: '/guide' },
                { step: '2', title: 'Document Prep', desc: 'Prepare required documents', icon: FileText, link: '/guide?topic=documents' },
                { step: '3', title: 'Book Travel', desc: 'Immigration-friendly bookings', icon: Plane, link: '/travel' },
                { step: '4', title: 'Explore Destination', desc: 'Virtual tours & navigation', icon: Camera, link: '/maps' }
              ].map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                    <item.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="text-lg font-bold text-primary-600 mb-2">Step {item.step}</div>
                  <h4 className="font-semibold text-mdtext-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        ref={statsRef}
        initial={{ opacity: 0 }}
        animate={statsInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="py-10 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-lg lg:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Immigrants Worldwide
            </h2>
            <p className="text-md text-gray-600">
              Join thousands who have successfully navigated their immigration journey with MoveSmart
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-white rounded-xl shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-xl lg:text-4xl font-bold text-gray-900 mb-4">
                Why 50,000+ Immigrants Choose MoveSmart
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <benefit.icon className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-lg text-gray-700">{benefit.text}</span>
                  </motion.div>
                ))}
                <Link
                  to="/opportunities"
                  className="inline-flex items-center space-x-2 btn-secondary ml-4"
                >
                  <GraduationCap className="h-5 w-5" />
                  <span>Find Opportunities</span>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Happy immigrants"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Success Stories from Our Community
          </h2>
          
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-8 w-8 text-yellow-400 fill-current" />
            ))}
          </div>
          
          <blockquote className="text-md lg:text-3xl font-medium text-gray-900 mb-8 leading-relaxed">
            "MoveSmart made my immigration journey so much easier. The AI guide answered all my questions in my native language, helped me book immigration-friendly flights, and even gave me virtual tours of Toronto before I arrived. Incredible!"
          </blockquote>
          
          <div className="flex items-center justify-center space-x-4">
            <img
              src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
              alt="Sarah Martinez"
              className="w-16 h-16 rounded-full"
            />
            <div className="text-left">
              <div className="font-semibold text-gray-900">Sarah Martinez</div>
              <div className="text-gray-600">Student Visa to Canada</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl lg:text-4xl font-bold mb-4 flex items-center gap-2">
            Ready to Start Your Immigration Journey?
            <Rocket className="h-8 w-8 text-primary-500" />
          </h2>
          <p className="text-md mb-4 text-blue-100">
            Join 50,000+ successful immigrants who trusted MoveSmart for their relocation journey. Get started with our AI guide today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/guide"
              className="inline-flex items-center text-md justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            
            <Link
              to="/maps"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-200"
            >
              Take Virtual Tour
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}