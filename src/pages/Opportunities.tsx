import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { 
  GraduationCap, 
  Briefcase, 
  Award, 
  ExternalLink, 
  MapPin, 
  Calendar, 
  DollarSign,
  BookOpen,
  Star,
  CheckCircle,
  Target,
  FileText,
  Send,
  Heart,
  X
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import AIService from '../services/AIService'
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom"


const aiService = new AIService()

interface Opportunity {
  link: string | undefined
  id: string
  type: 'scholarship' | 'fellowship' | 'job'
  title: string
  organization: string
  location: string
  country: string
  description: string
  requirements: string[]
  benefits: string[]
  deadline: string
  amount?: string
  duration?: string
  applicationLink: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  matchScore: number
  tags: string[]
  logo?: string
  featured: boolean
}

interface OpportunityFilters {
  type: string
  country: string
  difficulty: string
  minAmount: number
  maxAmount: number
  searchQuery: string
}

export default function Opportunities() {
  const { } = useLanguage()
  const { user, isAuthenticated } = useAuth()
  const [] = useSearchParams()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  
  const [filters, setFilters] = useState<OpportunityFilters>({
    type: 'all',
    country: 'all',
    difficulty: 'all',
    minAmount: 0,
    maxAmount: 100000,
    searchQuery: ''
  })

  // Mock opportunities data - in real app, this would come from AI API
  const generateMockOpportunities = (type: 'scholarship' | 'fellowship' | 'job', count: number): Opportunity[] => {
    const opportunities: Opportunity[] = []
    
    const scholarshipTemplates = [
  { org: 'University of Toronto', country: 'Canada', amount: '$45,000/year', url: 'https://www.utoronto.ca' },
  { org: 'Harvard University', country: 'USA', amount: '$50,000/year', url: 'https://www.harvard.edu' },
  { org: 'Oxford University', country: 'UK', amount: '£35,000/year', url: 'https://www.ox.ac.uk' },
  { org: 'ETH Zurich', country: 'Switzerland', amount: 'CHF 40,000/year', url: 'https://ethz.ch' },
  { org: 'University of Melbourne', country: 'Australia', amount: 'AUD 35,000/year', url: 'https://www.unimelb.edu.au' },
  { org: 'Sorbonne University', country: 'France', amount: '€25,000/year', url: 'https://www.sorbonne.fr' },
  { org: 'Technical University Munich', country: 'Germany', amount: '€30,000/year', url: 'https://www.tum.de' },
  { org: 'University of Tokyo', country: 'Japan', amount: '¥3,000,000/year', url: 'https://www.u-tokyo.ac.jp/en/' },
  { org: 'National University Singapore', country: 'Singapore', amount: 'SGD 40,000/year', url: 'https://www.nus.edu.sg' },
  { org: 'University of Copenhagen', country: 'Denmark', amount: 'DKK 200,000/year', url: 'https://www.ku.dk/en/' }
]

const fellowshipTemplates = [
  { org: 'Google', country: 'USA', amount: '$120,000', url: 'https://about.google' },
  { org: 'Microsoft', country: 'USA', amount: '$115,000', url: 'https://www.microsoft.com' },
  { org: 'United Nations', country: 'USA', amount: '$60,000', url: 'https://www.un.org' },
  { org: 'World Bank', country: 'USA', amount: '$75,000', url: 'https://www.worldbank.org' },
  { org: 'European Commission', country: 'Belgium', amount: '€55,000', url: 'https://ec.europa.eu' },
  { org: 'CERN', country: 'Switzerland', amount: 'CHF 65,000', url: 'https://home.cern' },
  { org: 'Max Planck Institute', country: 'Germany', amount: '€45,000', url: 'https://www.mpg.de/en' },
  { org: 'RIKEN', country: 'Japan', amount: '¥4,500,000', url: 'https://www.riken.jp/en' },
  { org: 'A*STAR', country: 'Singapore', amount: 'SGD 55,000', url: 'https://www.a-star.edu.sg' },
  { org: 'CSIRO', country: 'Australia', amount: 'AUD 60,000', url: 'https://www.csiro.au' }
]

const jobTemplates = [
  { org: 'VFS Global', country: 'Global', amount: '$70,000-$100,000', url: 'https://www.vfsglobal.com/en/individuals/careers/index.html' }, 
  { org: 'Visa', country: 'USA', amount: '$80,000-$120,000', url: 'https://corporate.visa.com/en/careers.html' },                      
  { org: 'USCIS (U.S. Citizenship and Immigration Services)', country: 'USA', amount: '$60,000-$100,000', url: 'https://www.uscis.gov/about-us/careers/career-opportunities' }, 
  { org: 'ICE (U.S. Immigration and Customs Enforcement)', country: 'USA', amount: '$60,000-$100,000', url: 'https://www.ice.gov/careers' },
  { org: 'NWIRP (Northwest Immigrant Rights Project)', country: 'USA', amount: '$50,000-$80,000', url: 'https://www.nwirp.org/join/jobs-internships/' },                               
  { org: 'Envoy Global', country: 'USA', amount: '$70,000-$110,000', url: 'https://www.envoyglobal.com/about-us/careers/' },                                                        
  { org: 'IOM (International Organization for Migration)', country: 'Global', amount: '$60,000-$100,000', url: 'https://www.iom.int/iom-career-gateways' },                      
  { org: 'GVCW (Global Visa Center World)', country: 'Greece', amount: '$50,000-$80,000', url: 'https://www.gvcworld.eu/form/career-opportunities' },                             
  { org: 'BAL Immigration Law', country: 'USA', amount: '$60,000-$100,000', url: 'https://www.bal.com/careers/' },                                                                
  { org: 'Upwardly Global', country: 'USA', amount: '$50,000-$90,000', url: 'https://www.upwardlyglobal.org' }                                                                         // Org that helps immigrant professionals; may have job resources :contentReference[oaicite:9]{index=9}
]


    let templates = scholarshipTemplates
    if (type === 'fellowship') templates = fellowshipTemplates
    if (type === 'job') templates = jobTemplates

    const subjects = ['Computer Science', 'Engineering', 'Medicine', 'Business', 'Law', 'Arts', 'Sciences', 'Economics', 'Psychology', 'Environmental Studies']
    const levels = ['Undergraduate', 'Graduate', 'PhD', 'Postdoc', 'Professional']
    const difficulties = ['Easy', 'Medium', 'Hard'] as const

    for (let i = 0; i < count; i++) {
      const template = templates[i % templates.length]
      const subject = subjects[i % subjects.length]
      const level = levels[i % levels.length]
      const difficulty = difficulties[i % difficulties.length]
      
      let title = ''
      let description = ''
      let requirements: string[] = []
      let benefits: string[] = []
      
      if (type === 'scholarship') {
        title = `${subject} ${level} Scholarship`
        description = `Full funding scholarship for ${level.toLowerCase()} studies in ${subject} at ${template.org}. Covers tuition, living expenses, and research opportunities.`
        requirements = [
          'Minimum GPA of 3.5/4.0',
          'English proficiency (IELTS 6.5+)',
          'Academic transcripts',
          'Statement of purpose',
          'Two recommendation letters'
        ]
        benefits = [
          `Full tuition coverage (${template.amount})`,
          'Monthly living allowance',
          'Health insurance',
          'Research opportunities',
          'Mentorship program'
        ]
      } else if (type === 'fellowship') {
        title = `${subject} Research Fellowship`
        description = `Research fellowship program in ${subject} at ${template.org}. Work with leading researchers on cutting-edge projects.`
        requirements = [
          'PhD or equivalent experience',
          '2+ years research experience',
          'Published research papers',
          'Strong analytical skills',
          'Valid work authorization'
        ]
        benefits = [
          `Competitive salary (${template.amount})`,
          'Research funding',
          'Conference attendance',
          'Networking opportunities',
          'Career development'
        ]
      } else {
        title = `${subject} Specialist`
        description = `Join our team as a ${subject} specialist at ${template.org}. Help immigrants with specialized knowledge and expertise.`
        requirements = [
          '3+ years relevant experience',
          'Professional certification',
          'Excellent communication skills',
          'Multilingual abilities preferred',
          'Immigration knowledge'
        ]
        benefits = [
          `Competitive salary (${template.amount})`,
          'Health benefits',
          'Professional development',
          'Remote work options',
          'Immigration support'
        ]
      }

      opportunities.push({
        id: `${type}-${i + 1}`,
        type,
        title,
        organization: template.org,
        location: template.country === 'Global' ? 'Remote' : `${template.country}`,
        country: template.country,
        description,
        requirements,
        benefits,
        deadline: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amount: template.amount,
        duration: type === 'job' ? 'Full-time' : type === 'fellowship' ? '12-24 months' : '2-4 years',
        applicationLink: template.url,
        difficulty,
        matchScore: Math.floor(Math.random() * 30) + 70,
        tags: [subject, level, template.country, type,template.url],
        featured: i < 3,
        link: undefined
      })
    }

    return opportunities
  }

  

  const mockOpportunities: Opportunity[] = [
    ...generateMockOpportunities('scholarship', 100),
    ...generateMockOpportunities('fellowship', 100),
    ...generateMockOpportunities('job', 100)
  ]


  useEffect(() => {
    loadOpportunities()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [opportunities, filters])

  const loadOpportunities = async () => {
    setIsLoading(true)
    try {
      // Simulate AI API call to get personalized opportunities
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In real implementation, this would call AI service
      await aiService.getPersonalizedOpportunities(
        user || {},
        filters
      )
      
      setOpportunities(mockOpportunities)
      toast.success(`Found ${mockOpportunities.length} opportunities matching your profile`)
    } catch (error) {
      console.error('Error loading opportunities:', error)
      setOpportunities(mockOpportunities)
      toast.error('Using cached opportunities')
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = opportunities

    if (filters.type !== 'all') {
      filtered = filtered.filter(opp => opp.type === filters.type)
    }

    if (filters.country !== 'all') {
      filtered = filtered.filter(opp => opp.country.toLowerCase().includes(filters.country.toLowerCase()))
    }

    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(opp => opp.difficulty === filters.difficulty)
    }

    // Sort by match score and featured status
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return b.matchScore - a.matchScore
    })

    setFilteredOpportunities(filtered)
  }

  // const handleApply = async (opportunity: Opportunity) => {
  //   if (!isAuthenticated) {
  //     toast.error('Please sign in to apply for opportunities')
  //     return
  //   }

  //   setSelectedOpportunity(opportunity)
  //   setShowApplicationModal(true)
  // }

const navigate = useNavigate()

const handleApply = (opportunity: Opportunity) => {
  if (!isAuthenticated) {
    toast.error("Please sign in to apply for opportunities")
    return
  }

  if (!opportunity.applicationLink) {
    toast.error("Application link not available")
    return
  }

  const url = opportunity.applicationLink.trim()

  // Case 1: External link (starts with http or https)
  if (/^https?:\/\//i.test(url)) {
    window.open(url, "_blank", "noopener,noreferrer")
    return
  }

  // Case 2: Internal route (relative path)
  navigate(url)
}

  // const submitApplication = async () => {
  //   if (!selectedOpportunity) return

  //   setIsLoading(true)
  //   try {
  //     // Simulate application submission
  //     await new Promise(resolve => setTimeout(resolve, 2000))
      
  //     toast.success(`Application submitted for ${selectedOpportunity.title}!`)
  //     setShowApplicationModal(false)
  //     setSelectedOpportunity(null)
      
  //     // In real app, would track application status
  //     setTimeout(() => {
  //       toast.success('Application confirmation sent to your email')
  //     }, 3000)
  //   } catch (error) {
  //     toast.error('Failed to submit application. Please try again.')
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const toggleFavorite = (opportunityId: string) => {
    setFavorites(prev => 
      prev.includes(opportunityId)
        ? prev.filter(id => id !== opportunityId)
        : [...prev, opportunityId]
    )
    toast.success(favorites.includes(opportunityId) ? 'Removed from favorites' : 'Added to favorites')
  }

  const OpportunityCard = ({ opportunity }: { opportunity: Opportunity }) => {
    const getTypeIcon = () => {
      switch (opportunity.type) {
        case 'scholarship': return GraduationCap
        case 'fellowship': return Award
        case 'job': return Briefcase
        default: return BookOpen
      }
    }

    const getTypeColor = () => {
      switch (opportunity.type) {
        case 'scholarship': return 'bg-blue-500'
        case 'fellowship': return 'bg-purple-500'
        case 'job': return 'bg-green-500'
        default: return 'bg-gray-500'
      }
    }

    const getDifficultyColor = () => {
      switch (opportunity.difficulty) {
        case 'Easy': return 'text-green-600 bg-green-100'
        case 'Medium': return 'text-yellow-600 bg-yellow-100'
        case 'Hard': return 'text-red-600 bg-red-100'
        default: return 'text-gray-600 bg-gray-100'
      }
    }

    const TypeIcon = getTypeIcon()

    return (
      <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
    opportunity.featured ? 'ring-2 ring-primary-500' : ''
  }`}
>
  {opportunity.featured && (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white text-center py-1.5 text-xs sm:text-sm font-medium flex items-center justify-center space-x-1 sm:space-x-2">
      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
      <span>Featured Opportunity</span>
    </div>
  )}

  <div className="p-3 sm:p-5 lg:p-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4">
      <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-0">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 ${getTypeColor()} rounded-lg flex items-center justify-center`}>
          <TypeIcon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">{opportunity.title}</h3>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">{opportunity.organization}</p>
        </div>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2">
        <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold ${getDifficultyColor()}`}>
          {opportunity.difficulty}
        </span>
        <button
          onClick={() => toggleFavorite(opportunity.id)}
          className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${favorites.includes(opportunity.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
        </button>
      </div>
    </div>

    {/* Details */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 space-y-1 sm:space-y-0">
      <div className="flex items-center space-x-1">
        <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
        <span>{opportunity.location}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
        <span>Due: {new Date(opportunity.deadline).toLocaleDateString()}</span>
      </div>
      {opportunity.amount && (
        <div className="flex items-center space-x-1">
          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>{opportunity.amount}</span>
        </div>
      )}
    </div>

    <p className="text-xs sm:text-sm lg:text-base text-gray-700 mb-3 sm:mb-4 line-clamp-3">{opportunity.description}</p>

       {/* Tags */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {opportunity.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gray-100 text-gray-700 text-[10px] sm:text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {opportunity.tags.length > 3 && (
              <span className="inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gray-100 text-gray-700 text-[10px] sm:text-xs rounded-full">
                +{opportunity.tags.length - 3} more
              </span>
            )}
          </div>

          {/* Match score & actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current" />
              <span className="text-[10px] sm:text-xs font-semibold">{opportunity.matchScore}% match</span>
            </div>

            <div className="flex space-x-1 sm:space-x-2">
              <button
                onClick={() => setSelectedOpportunity(opportunity)}
                className="px-2 sm:px-3 py-1 sm:py-1.5 text-primary-600 border border-primary-600 rounded-md sm:rounded-lg hover:bg-primary-50 transition-colors text-[10px] sm:text-xs font-medium"
              >
                View Details
              </button>
              <button
                onClick={() => handleApply(opportunity)}
                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-primary-600 text-white rounded-md sm:rounded-lg hover:bg-primary-700 transition-colors text-[10px] sm:text-xs font-medium flex items-center space-x-1"
              >
                <span>Apply Now</span>
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>

        </div>
</motion.div>

    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8 py-2">
        {/* Header */}
        <div className="text-center mb-12">
          <h4 className="text-2xl lg:text-5xl font-bold text-gray-900 mb-1">
            Scholarships, Fellowships & Jobs
          </h4>
          <p className="text-sm text-gray-600 max-w-3xl mx-auto">
            AI-powered opportunities matching your profile. Find scholarships, fellowships, and job openings with personalized application guidance.
          </p>
        </div>

       {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-1 sm:p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 sm:mb-6">
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
              >
                <option value="all">All Types</option>
                <option value="scholarship">Scholarships</option>
                <option value="fellowship">Fellowships</option>
                <option value="job">Jobs</option>
              </select>

              <select
                value={filters.country}
                onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                className="px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
              >
                <option value="all">All Countries</option>
                <option value="canada">Canada</option>
                <option value="usa">USA</option>
                <option value="uk">United Kingdom</option>
                <option value="germany">Germany</option>
                <option value="australia">Australia</option>
              </select>

              <select
                value={filters.difficulty}
                onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                className="px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Info + Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-gray-600">
                Showing {filteredOpportunities.length} of {opportunities.length} opportunities
              </div>

              <button
                onClick={loadOpportunities}
                disabled={isLoading}
                className="flex items-center justify-center sm:justify-start space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 w-full sm:w-auto text-xs sm:text-sm"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Target className="h-4 w-4" />
                )}
                <span>{isLoading ? 'Finding...' : 'Get AI Recommendations'}</span>
              </button>
            </div>
          </div>

        {/* Opportunities Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        )}

         
        {filteredOpportunities.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 py-4 px-3 sm:py-5 sm:px-4 text-center">
            <Target className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">
              No opportunities found
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              Try adjusting your filters or search terms
            </p>
            <button className="btn-primary text-xs sm:text-sm px-3 py-2 sm:px-5 sm:py-2.5 w-full sm:w-auto">
              Get AI Recommendations
            </button>
          </div>


        )}


        {/* Opportunity Details Modal */}
        <AnimatePresence>
          {selectedOpportunity && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-md font-bold text-gray-900 mb-2">{selectedOpportunity.title}</h2>
                    <p className="text-sm text-gray-600">{selectedOpportunity.organization}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOpportunity(null)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-4">Description</h3>
                    <p className="text-gray-700 mb-6">{selectedOpportunity.description}</p>

                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Requirements</h3>
                    <ul className="space-y-2 mb-6">
                      {selectedOpportunity.requirements.map((req, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-4">Benefits</h3>
                    <ul className="space-y-2 mb-6">
                      {selectedOpportunity.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Star className="h-5 w-5 text-yellow-400 fill-current mt-0.5" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Key Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{selectedOpportunity.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deadline:</span>
                          <span className="font-medium">{new Date(selectedOpportunity.deadline).toLocaleDateString()}</span>
                        </div>
                        {selectedOpportunity.amount && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-medium">{selectedOpportunity.amount}</span>
                          </div>
                        )}
                        {selectedOpportunity.duration && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">{selectedOpportunity.duration}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Match Score:</span>
                          <span className="font-medium text-green-600">{selectedOpportunity.matchScore}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:space-x-4 gap-3 pt-4 sm:pt-6 border-t">
                  <button
                    onClick={() => setSelectedOpportunity(null)}
                    className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Close
                  </button>
                  
                  <button
                    onClick={() => handleApply(selectedOpportunity)}
                    className="flex-1 px-4 sm:px-6 py-2 sm:py-3 btn-primary flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Apply Now</span>
                  </button>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Application Modal */}
        <AnimatePresence>
          {showApplicationModal && selectedOpportunity && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-2xl w-full"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply for {selectedOpportunity.title}</h2>
                
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">AI Application Assistant</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    Our AI will help you complete this application with personalized guidance, document formatting, and submission tracking.
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Why are you interested in this opportunity?
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Tell us about your motivation and how this aligns with your goals..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Documents
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Drag and drop your documents here, or click to browse
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        CV, transcripts, certificates, etc.
                      </p>
                    </div>
                  </div>
                </div>

                {/* <div className="flex space-x-4">
                  <button
                    onClick={() => setShowApplicationModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitApplication}
                    disabled={isLoading}
                    className="flex-1 btn-primary py-3 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                    <span>{isLoading ? 'Submitting...' : 'Submit Application'}</span>
                  </button>
                </div> */}

                <div className="flex space-x-4 pt-6 border-t">
                  <button
                    onClick={() => setShowApplicationModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  
                  <a
                    href={selectedOpportunity.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 btn-primary py-3 flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>Go to Application Site</span>
                  </a>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}