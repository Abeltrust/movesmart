import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { 
  Plane, 
  Hotel, 
  Bus, 
  Package, 
  Calendar, 
  MapPin, 
  Users, 
  Star,
  Search,
  Filter,
  
  DollarSign,
  Wifi,
  Coffee,
 
  Shield,
  CheckCircle,
  X,
  Heart,
  
  ExternalLink,
  
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

interface FlightResult {
  id: string
  airline: string
  logo: string
  departure: {
    city: string
    airport: string
    time: string
    date: string
  }
  arrival: {
    city: string
    airport: string
    time: string
    date: string
  }
  duration: string
  stops: number
  price: number
  class: string
  baggage: string
  amenities: string[]
}

interface HotelResult {
  id: string
  name: string
  image: string
  rating: number
  reviews: number
  location: string
  price: number
  originalPrice?: number
  amenities: string[]
  distance: string
  cancellation: boolean
}

interface BookingData {
  type: 'flight' | 'hotel' | 'transport'
  from?: string
  to?: string
  checkIn?: string
  checkOut?: string
  passengers?: number
  rooms?: number
  class?: string
}

export default function Travel() {
  const { t } = useLanguage()
  const { user, isAuthenticated } = useAuth()
  const [searchParams] = useSearchParams()
  const [activeService, setActiveService] = useState<string>('flights')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [favorites, setFavorites] = useState<string[]>([])

  const [bookingData, setBookingData] = useState<BookingData>({
    type: 'flight',
    from: '',
    to: '',
    checkIn: '',
    checkOut: '',
    passengers: 1,
    rooms: 1,
    class: 'economy'
  })

  useEffect(() => {
    // Handle URL parameters for specific services
    const service = searchParams.get('service')
    const destination = searchParams.get('destination')
    
    if (service && ['flights', 'hotels', 'transport', 'shipping'].includes(service)) {
      setActiveService(service)
    }
    
    if (destination) {
      setBookingData(prev => ({ ...prev, to: destination }))
    }
  }, [searchParams])

  const services = [
    {
      id: 'flights',
      icon: Plane,
      title: 'Flight Booking',
      description: 'Find and book flights worldwide with immigration-friendly options',
      color: 'bg-blue-500',
      features: ['Best price guarantee', 'Flexible dates', 'Visa-friendly bookings', '24/7 support']
    },
    {
      id: 'hotels',
      icon: Hotel,
      title: 'Hotel Reservations',
      description: 'Discover accommodations for every budget and preference',
      color: 'bg-green-500',
      features: ['Verified reviews', 'Instant confirmation', 'Free cancellation', 'Local insights']
    },
    {
      id: 'transport',
      icon: Bus,
      title: 'Ground Transport',
      description: 'Buses, trains, and car rentals across countries',
      color: 'bg-yellow-500',
      features: ['Multi-city routes', 'Real-time tracking', 'Digital tickets', 'Group discounts']
    },
    {
      id: 'shipping',
      icon: Package,
      title: 'Shipping Services',
      description: 'Ship your belongings safely to your new destination',
      color: 'bg-purple-500',
      features: ['Door-to-door', 'Insurance included', 'Customs handling', 'Real-time tracking']
    }
  ]

  const mockFlights: FlightResult[] = [
    {
      id: '1',
      airline: 'Emirates',
      logo: '🛫',
      departure: { city: 'New York', airport: 'JFK', time: '14:30', date: '2024-02-15' },
      arrival: { city: 'Dubai', airport: 'DXB', time: '09:45', date: '2024-02-16' },
      duration: '12h 15m',
      stops: 0,
      price: 1250,
      class: 'Economy',
      baggage: '2 x 23kg',
      amenities: ['WiFi', 'Entertainment', 'Meals']
    },
    {
      id: '2',
      airline: 'British Airways',
      logo: '✈️',
      departure: { city: 'New York', airport: 'JFK', time: '22:15', date: '2024-02-15' },
      arrival: { city: 'London', airport: 'LHR', time: '10:30', date: '2024-02-16' },
      duration: '7h 15m',
      stops: 0,
      price: 890,
      class: 'Economy',
      baggage: '1 x 23kg',
      amenities: ['WiFi', 'Entertainment']
    },
    {
      id: '3',
      airline: 'Lufthansa',
      logo: '🛩️',
      departure: { city: 'New York', airport: 'JFK', time: '18:45', date: '2024-02-15' },
      arrival: { city: 'Frankfurt', airport: 'FRA', time: '08:20', date: '2024-02-16' },
      duration: '8h 35m',
      stops: 0,
      price: 1050,
      class: 'Economy',
      baggage: '1 x 23kg',
      amenities: ['WiFi', 'Meals']
    }
  ]

  const mockHotels: HotelResult[] = [
    {
      id: '1',
      name: 'Grand Plaza Hotel',
      image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      reviews: 1250,
      location: 'Downtown Dubai',
      price: 180,
      originalPrice: 220,
      amenities: ['WiFi', 'Pool', 'Gym', 'Spa'],
      distance: '0.5 km from center',
      cancellation: true
    },
    {
      id: '2',
      name: 'Business Suites',
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.5,
      reviews: 890,
      location: 'Business District',
      price: 120,
      amenities: ['WiFi', 'Breakfast', 'Gym'],
      distance: '1.2 km from center',
      cancellation: true
    },
    {
      id: '3',
      name: 'Luxury Resort',
      image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      reviews: 2100,
      location: 'Beachfront',
      price: 350,
      originalPrice: 420,
      amenities: ['WiFi', 'Pool', 'Beach', 'Spa', 'Restaurant'],
      distance: '5 km from center',
      cancellation: false
    }
  ]

  const handleSearch = async () => {
    setIsSearching(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (activeService === 'flights') {
        setSearchResults(mockFlights)
        toast.success(`Found ${mockFlights.length} flights`)
      } else if (activeService === 'hotels') {
        setSearchResults(mockHotels)
        toast.success(`Found ${mockHotels.length} hotels`)
      } else {
        setSearchResults([])
        toast.success('Search completed')
      }
    } catch (error) {
      toast.error('Search failed. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleBooking = (item: any) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book')
      return
    }
    
    setSelectedItem(item)
    setShowBookingModal(true)
  }

  const confirmBooking = async () => {
    setIsSearching(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Booking confirmed! Check your email for details.')
      setShowBookingModal(false)
      setSelectedItem(null)
      
      // Simulate sending confirmation email and booking reference
      setTimeout(() => {
        toast.success(`Booking reference: MS${Math.random().toString(36).substr(2, 9).toUpperCase()}`)
      }, 2000)
    } catch (error) {
      toast.error('Booking failed. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    )
    toast.success(favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites')
  }

  const FlightCard = ({ flight }: { flight: FlightResult }) => (
    <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
>
  {/* Header */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
    <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-0">
      <span className="text-xl sm:text-2xl">{flight.logo}</span>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{flight.airline}</h3>
        <p className="text-xs sm:text-sm text-gray-600">{flight.class} • {flight.baggage}</p>
      </div>
    </div>
    <button
      onClick={() => toggleFavorite(flight.id)}
      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
    >
      <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${favorites.includes(flight.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
    </button>
  </div>

  {/* Flight Times */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4 text-center sm:text-left">
    <div>
      <p className="text-lg sm:text-2xl font-bold text-gray-900">{flight.departure.time}</p>
      <p className="text-xs sm:text-sm text-gray-600">{flight.departure.city}</p>
      <p className="text-xs text-gray-500">{flight.departure.airport}</p>
    </div>
    <div className="flex flex-col items-center justify-center">
      <p className="text-xs sm:text-sm text-gray-600 mb-1">{flight.duration}</p>
      <div className="flex items-center justify-center">
        <div className="w-6 h-px bg-gray-300"></div>
        <Plane className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mx-1 sm:mx-2" />
        <div className="w-6 h-px bg-gray-300"></div>
      </div>
      <p className="text-xs text-gray-500 mt-1">{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</p>
    </div>
    <div className="text-sm sm:text-right">
      <p className="text-lg sm:text-2xl font-bold text-gray-900">{flight.arrival.time}</p>
      <p className="text-xs sm:text-sm text-gray-600">{flight.arrival.city}</p>
      <p className="text-xs text-gray-500">{flight.arrival.airport}</p>
    </div>
  </div>

  {/* Amenities and Price */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {flight.amenities.map((amenity, index) => (
        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          {amenity === 'WiFi' && <Wifi className="h-3 w-3 mr-1" />}
          {amenity === 'Meals' && <Coffee className="h-3 w-3 mr-1" />}
          {amenity}
        </span>
      ))}
    </div>
    <div className="text-right">
      <p className="text-lg sm:text-2xl font-bold text-primary-600">${flight.price}</p>
      <button
        onClick={() => handleBooking(flight)}
        className="btn-primary px-4 py-1 sm:px-6 sm:py-2 text-xs sm:text-sm mt-1 flex items-center justify-center space-x-1 sm:space-x-2 w-full sm:w-auto"
      >
        <span>Book Now</span>
        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
      </button>
    </div>
  </div>
</motion.div>

  )

  const HotelCard = ({ hotel }: { hotel: HotelResult }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => toggleFavorite(hotel.id)}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
        >
          <Heart className={`h-5 w-5 ${favorites.includes(hotel.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
        </button>
        {hotel.originalPrice && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
            Save ${hotel.originalPrice - hotel.price}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{hotel.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{hotel.rating}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-2">{hotel.location}</p>
        <p className="text-sm text-gray-500 mb-4">{hotel.distance} • {hotel.reviews} reviews</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {hotel.amenities.slice(0, 4).map((amenity, index) => (
            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              {amenity === 'WiFi' && <Wifi className="h-3 w-3 mr-1" />}
              {amenity === 'Pool' && <span className="mr-1">🏊</span>}
              {amenity === 'Gym' && <span className="mr-1">💪</span>}
              {amenity === 'Spa' && <span className="mr-1">🧘</span>}
              {amenity}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              {hotel.originalPrice && (
                <span className="text-sm text-gray-500 line-through">${hotel.originalPrice}</span>
              )}
              <span className="text-2xl font-bold text-primary-600">${hotel.price}</span>
            </div>
            <p className="text-sm text-gray-600">per night</p>
            {hotel.cancellation && (
              <p className="text-xs text-green-600 flex items-center mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                Free cancellation
              </p>
            )}
          </div>
          <button
            onClick={() => handleBooking(hotel)}
            className="btn-primary px-6 py-2 flex items-center space-x-2"
          >
            <span>Book Now</span>
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-lg lg:text-5xl font-bold text-gray-900 mb-2">
            Travel Services
          </h1>
          <p className="text-sm text-gray-600 max-w-3xl mx-auto">
            Book all your travel needs in one place with immigration-friendly options and expert support
          </p>
        </div>

        {/* Service Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-2">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveService(service.id)}
              className={`flex items-center space-x-3 px-6 py-2 rounded-lg font-sm transition-all duration-200 ${
                activeService === service.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              <service.icon className="h-5 w-5" />
              <span>{service.title}</span>
            </button>
          ))}
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-2">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {activeService === 'flights' && 'Search Flights'}
            {activeService === 'hotels' && 'Find Hotels'}
            {activeService === 'transport' && 'Ground Transport'}
            {activeService === 'shipping' && 'Shipping Services'}
          </h2>
          
          {activeService === 'flights' && (
            <div className="grid md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={bookingData.from}
                    onChange={(e) => setBookingData({...bookingData, from: e.target.value})}
                    placeholder="Departure city"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={bookingData.to}
                    onChange={(e) => setBookingData({...bookingData, to: e.target.value})}
                    placeholder="Destination city"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={bookingData.checkIn}
                    onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select 
                    value={bookingData.passengers}
                    onChange={(e) => setBookingData({...bookingData, passengers: parseInt(e.target.value)})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={1}>1 Passenger</option>
                    <option value={2}>2 Passengers</option>
                    <option value={3}>3 Passengers</option>
                    <option value={4}>4+ Passengers</option>
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="w-full btn-primary py-3 disabled:opacity-50"
                >
                  {isSearching ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Searching...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Search className="h-5 w-5" />
                      <span>Search</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeService === 'hotels' && (
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={bookingData.to}
                    onChange={(e) => setBookingData({...bookingData, to: e.target.value})}
                    placeholder="City or hotel name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={bookingData.checkIn}
                    onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={bookingData.checkOut}
                    onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="w-full btn-primary py-3 disabled:opacity-50"
                >
                  {isSearching ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Searching...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Search className="h-5 w-5" />
                      <span>Search</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-4">
                <h2 className="text-sm sm:text-base lg:text-xl font-bold text-gray-900">
                  Search Results ({searchResults.length})
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
                  <button className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm">
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Filters</span>
                  </button>
                  <select className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-primary-500">
                    <option>Sort by Price</option>
                    <option>Sort by Rating</option>
                    <option>Sort by Duration</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {activeService === 'flights' && searchResults.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} />
                ))}

                {activeService === 'hotels' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {searchResults.map((hotel) => (
                      <HotelCard key={hotel.id} hotel={hotel} />
                    ))}
                  </div>
                )}
              </div>
            </div>

        )}

        {/* Booking Modal */}
        <AnimatePresence>
          {showBookingModal && selectedItem && (
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
                className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Confirm Booking</h3>
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {activeService === 'flights' && (
                    <>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                        <span className="text-2xl">{selectedItem.logo}</span>
                        <div>
                          <h4 className="font-semibold">{selectedItem.airline}</h4>
                          <p className="text-sm text-gray-600">
                            {selectedItem.departure.city} → {selectedItem.arrival.city}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Departure</p>
                          <p className="font-semibold">{selectedItem.departure.time}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Arrival</p>
                          <p className="font-semibold">{selectedItem.arrival.time}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Duration</p>
                          <p className="font-semibold">{selectedItem.duration}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Price</p>
                          <p className="font-semibold text-primary-600">${selectedItem.price}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {activeService === 'hotels' && (
                    <>
                      <img
                        src={selectedItem.image}
                        alt={selectedItem.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-semibold text-lg">{selectedItem.name}</h4>
                        <p className="text-gray-600">{selectedItem.location}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm">{selectedItem.rating} ({selectedItem.reviews} reviews)</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Check-in</p>
                          <p className="font-semibold">{bookingData.checkIn}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Check-out</p>
                          <p className="font-semibold">{bookingData.checkOut}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Price per night</p>
                          <p className="font-semibold text-primary-600">${selectedItem.price}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total</p>
                          <p className="font-semibold text-primary-600">${selectedItem.price * 3}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">Immigration-Friendly Booking</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      This booking includes all documentation needed for visa applications and immigration purposes.
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowBookingModal(false)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmBooking}
                      disabled={isSearching}
                      className="flex-1 btn-primary py-3 disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {isSearching ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Booking...</span>
                        </div>
                      ) : (
                        <>
                          <span>Confirm Booking</span>
                          <CheckCircle className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features */}
        <div className="bg-primary-50 rounded-2xl p-8">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900 mb-4 text-center">
            Why Choose MoveSmart Travel?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Best Prices Guaranteed</h3>
              <p className="text-gray-600">We match any lower price you find elsewhere</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">24/7 Multilingual Support</h3>
              <p className="text-gray-600">Get help in your language, anytime you need it</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Immigration-Friendly</h3>
              <p className="text-gray-600">Bookings designed to support your visa applications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}