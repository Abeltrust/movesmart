import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { Search, MapPin, Star, Clock, Phone, Plane, Building, Guitar as Hospital, GraduationCap, ShoppingBag, Coffee, Bus, X, List, Map as MapIcon, Info } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import toast from 'react-hot-toast'

interface Place {
  id: string
  name: string
  address: string
  category: string
  rating: number
  reviews: number
  phone?: string
  website?: string
  hours?: string
  description: string
  position: { lat: number; lng: number }
  photos?: string[]
  priceLevel?: number
  distance?: string
  travelTime?: string
}

interface MapState {
  center: { lat: number; lng: number }
  zoom: number
  places: Place[]
  selectedPlace: Place | null
  searchQuery: string
  activeCategory: string
  isLoading: boolean
  userLocation: { lat: number; lng: number } | null
}

export default function Maps() {
  const { } = useLanguage()
  const [searchParams] = useSearchParams()
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const infoWindowRef = useRef<any>(null)

  const [mapState, setMapState] = useState<MapState>({
    center: { lat: 10.2899, lng: 11.1706 },
    zoom: 12,
    places: [],
    selectedPlace: null,
    searchQuery: '',
    activeCategory: 'all',
    isLoading: false,
    userLocation: null
  })

  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')

  const categories = [
    { id: 'all', name: 'All Places', icon: MapPin, color: 'bg-gray-500' },
    { id: 'immigration', name: 'Immigration Offices', icon: Building, color: 'bg-blue-500' },
    { id: 'airports', name: 'Airports', icon: Plane, color: 'bg-green-500' },
    { id: 'hospitals', name: 'Healthcare', icon: Hospital, color: 'bg-red-500' },
    { id: 'schools', name: 'Education', icon: GraduationCap, color: 'bg-purple-500' },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'bg-yellow-500' },
    { id: 'restaurants', name: 'Restaurants', icon: Coffee, color: 'bg-orange-500' },
    { id: 'transport', name: 'Transport', icon: Bus, color: 'bg-indigo-500' }
  ]

  // Mock places data
  const mockPlaces: Place[] = [
    {
      id: '1',
      name: 'Immigration, Refugees and Citizenship Canada',
      address: '55 St Clair Ave E, Toronto, ON M4T 1M2',
      category: 'immigration',
      rating: 3.8,
      reviews: 245,
      phone: '+1 888-242-2100',
      website: 'https://www.canada.ca/en/immigration-refugees-citizenship.html',
      hours: 'Mon-Fri 8:30 AM - 4:30 PM',
      description: 'Main immigration office for visa applications, citizenship ceremonies, and immigration services.',
      position: { lat: 43.6896, lng: -79.3931 },
      photos: ['https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=400']
    },
    {
      id: '2',
      name: 'Toronto Pearson International Airport',
      address: '6301 Silver Dart Dr, Mississauga, ON L5P 1B2',
      category: 'airports',
      rating: 4.1,
      reviews: 12500,
      phone: '+1 416-247-7678',
      website: 'https://www.torontopearson.com',
      hours: '24 hours',
      description: 'Canada\'s largest and busiest airport, serving as the main international gateway to Toronto.',
      position: { lat: 43.6777, lng: -79.6248 },
      photos: ['https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=400']
    },
    {
      id: '3',
      name: 'Toronto General Hospital',
      address: '200 Elizabeth St, Toronto, ON M5G 2C4',
      category: 'hospitals',
      rating: 4.3,
      reviews: 890,
      phone: '+1 416-340-4800',
      website: 'https://www.uhn.ca',
      hours: '24 hours emergency',
      description: 'Major teaching hospital and trauma center with comprehensive medical services.',
      position: { lat: 43.6591, lng: -79.3890 },
      photos: ['https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=400']
    },
    {
      id: '4',
      name: 'University of Toronto',
      address: '27 King\'s College Cir, Toronto, ON M5S 1A1',
      category: 'schools',
      rating: 4.6,
      reviews: 1250,
      phone: '+1 416-978-2011',
      website: 'https://www.utoronto.ca',
      hours: 'Mon-Fri 9:00 AM - 5:00 PM',
      description: 'Prestigious public research university, consistently ranked among the world\'s top universities.',
      position: { lat: 43.6629, lng: -79.3957 },
      photos: ['https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400']
    },
    {
      id: '5',
      name: 'Eaton Centre',
      address: '220 Yonge St, Toronto, ON M5B 2H1',
      category: 'shopping',
      rating: 4.4,
      reviews: 8900,
      phone: '+1 416-598-8560',
      website: 'https://www.cfshops.com/toronto-eaton-centre.html',
      hours: 'Mon-Sat 10:00 AM - 9:00 PM, Sun 11:00 AM - 7:00 PM',
      description: 'Premier shopping destination in downtown Toronto with over 250 stores and restaurants.',
      position: { lat: 43.6544, lng: -79.3807 },
      photos: ['https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg?auto=compress&cs=tinysrgb&w=400']
    }
  ]

  useEffect(() => {
    // Handle URL parameters
    const category = searchParams.get('category')
    const country = searchParams.get('country')
    
    if (category && categories.find(cat => cat.id === category)) {
      setMapState(prev => ({ ...prev, activeCategory: category }))
    }
    
    if (country) {
      handleCountrySearch(country)
    }
  }, [searchParams])

  useEffect(() => {
    initializeMap()
  }, [])

  useEffect(() => {
    if (googleMapRef.current) {
      updateMapPlaces()
    }
  }, [mapState.activeCategory, mapState.searchQuery])

  const initializeMap = () => {
    if (!mapRef.current || typeof window === 'undefined' || !(window as any).google) {
      // Fallback: Load Google Maps script dynamically
      loadGoogleMapsScript()
      return
    }

    const google = (window as any).google
    const map = new google.maps.Map(mapRef.current, {
      center: mapState.center,
      zoom: mapState.zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true
    })

    googleMapRef.current = map
    infoWindowRef.current = new (window as any).google.maps.InfoWindow()

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setMapState(prev => ({ ...prev, userLocation: userPos }))
          
          // Add user location marker
          new google.maps.Marker({
            position: userPos,
            map: map,
            title: 'Your Location',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" fill="white"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(24, 24)
            }
          })
        },
        (error) => {
          console.warn('Geolocation error:', error)
        }
      )
    }

    updateMapPlaces()
  }

    const loadGoogleMapsScript = () => {
      if (typeof window === 'undefined') return

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }


  const updateMapPlaces = () => {
    if (!googleMapRef.current || typeof window === 'undefined' || !(window as any).google) return
    
    const google = (window as any).google

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // Filter places based on category and search
    let filteredPlaces = mockPlaces
    
    if (mapState.activeCategory !== 'all') {
      filteredPlaces = filteredPlaces.filter(place => place.category === mapState.activeCategory)
    }
    
    if (mapState.searchQuery) {
      const query = mapState.searchQuery.toLowerCase()
      filteredPlaces = filteredPlaces.filter(place => 
        place.name.toLowerCase().includes(query) ||
        place.address.toLowerCase().includes(query) ||
        place.description.toLowerCase().includes(query)
      )
    }

    // Add markers for filtered places
    filteredPlaces.forEach(place => {
      const marker = new google.maps.Marker({
        position: place.position,
        map: googleMapRef.current,
        title: place.name,
        icon: {
          url: getMarkerIcon(place.category),
          scaledSize: new google.maps.Size(32, 32)
        }
      })

      marker.addListener('click', () => {
        handlePlaceSelect(place)
      })

      markersRef.current.push(marker)
    })

    setMapState(prev => ({ ...prev, places: filteredPlaces }))
  }

  const getMarkerIcon = (category: string): string => {
    const icons = {
      immigration: '#3B82F6',
      airports: '#10B981',
      hospitals: '#EF4444',
      schools: '#8B5CF6',
      shopping: '#F59E0B',
      restaurants: '#F97316',
      transport: '#6366F1'
    }
    
    const color = icons[category as keyof typeof icons] || '#6B7280'
    
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="16" cy="16" r="4" fill="white"/>
      </svg>
    `)}`
  }

  const handleCountrySearch = async (country: string) => {
    setMapState(prev => ({ ...prev, isLoading: true }))
    
    try {
      if (typeof window === 'undefined' || !(window as any).google) {
        throw new Error('Google Maps not loaded')
      }
      
      // Use Geocoding API to find country center
      const google = (window as any).google
      const geocoder = new google.maps.Geocoder()
      const result = await new Promise<any[]>((resolve, reject) => {
        geocoder.geocode({ address: country }, (results: any, status: any) => {
          if (status === 'OK' && results) {
            resolve(results)
          } else {
            reject(new Error('Geocoding failed'))
          }
        })
      })

      if (result.length > 0) {
        const location = result[0].geometry.location
        const newCenter = { lat: location.lat(), lng: location.lng() }
        
        setMapState(prev => ({ 
          ...prev, 
          center: newCenter,
          zoom: 10,
          isLoading: false 
        }))
        
        if (googleMapRef.current) {
          googleMapRef.current.setCenter(newCenter)
          googleMapRef.current.setZoom(10)
        }
        
        toast.success(`Showing ${country}`)
      }
    } catch (error) {
      console.error('Country search error:', error)
      toast.error('Failed to find country')
      setMapState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const handleSearch = async () => {
    if (!mapState.searchQuery.trim()) return
    
    setMapState(prev => ({ ...prev, isLoading: true }))
    
    try {
      if (typeof window === 'undefined' || !(window as any).google) {
        throw new Error('Google Maps not loaded')
      }
      
      const google = (window as any).google
      const geocoder = new google.maps.Geocoder()
      const result = await new Promise<any[]>((resolve, reject) => {
        geocoder.geocode({ address: mapState.searchQuery }, (results: any, status: any) => {
          if (status === 'OK' && results) {
            resolve(results)
          } else {
            reject(new Error('Search failed'))
          }
        })
      })

      if (result.length > 0) {
        const location = result[0].geometry.location
        const newCenter = { lat: location.lat(), lng: location.lng() }
        
        setMapState(prev => ({ 
          ...prev, 
          center: newCenter,
          zoom: 15,
          isLoading: false 
        }))
        
        if (googleMapRef.current) {
          googleMapRef.current.setCenter(newCenter)
          googleMapRef.current.setZoom(15)
        }
        
        toast.success('Location found!')
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Location not found')
      setMapState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const handlePlaceSelect = (place: Place) => {
    setMapState(prev => ({ ...prev, selectedPlace: place }))
    
    if (googleMapRef.current && infoWindowRef.current) {
      const content = `
        <div style="max-width: 300px; padding: 10px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${place.name}</h3>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${place.address}</p>
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="color: #F59E0B; margin-right: 4px;">★</span>
            <span style="font-size: 14px;">${place.rating} (${place.reviews} reviews)</span>
          </div>
          <p style="margin: 0; font-size: 14px; line-height: 1.4;">${place.description}</p>
        </div>
      `
      
      infoWindowRef.current.setContent(content)
      infoWindowRef.current.setPosition(place.position)
      infoWindowRef.current.open(googleMapRef.current)
    }
  }

  const handleCloseDetails = () => {
    setMapState(prev => ({ ...prev, selectedPlace: null }))
    if (infoWindowRef.current) {
      infoWindowRef.current.close()
    }
  }

  const PlaceCard = ({ place }: { place: Place }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => handlePlaceSelect(place)}
    >
      {place.photos && place.photos[0] && (
        <img
          src={place.photos[0]}
          alt={place.name}
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
      )}
      
      <h3 className="font-semibold text-gray-900 mb-2">{place.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{place.address}</p>
      
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span>{place.rating}</span>
        </div>
        <span>({place.reviews} reviews)</span>
      </div>
      
      {place.hours && (
        <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{place.hours}</span>
        </div>
      )}
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-8 py-4">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-lg lg:text-4xl font-bold text-gray-900 mb-2">
            Smart Navigation & Maps
          </h1>
          <p className="text-sm text-gray-600">
            Discover immigration offices, essential services, and navigate your new city with confidence
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={mapState.searchQuery}
                  onChange={(e) => setMapState(prev => ({ ...prev, searchQuery: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for places, addresses, or services..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={mapState.isLoading}
              className="btn-primary px-6 py-3 disabled:opacity-50"
            >
              {mapState.isLoading ? 'Searching...' : 'Search'}
            </button>
            
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'map' ? 'bg-white text-primary-600 shadow' : 'text-gray-600'
                }`}
              >
                <MapIcon className="h-4 w-4" />
                <span>Map</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white text-primary-600 shadow' : 'text-gray-600'
                }`}
              >
                <List className="h-4 w-4" />
                <span>List</span>
              </button>
            </div>
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setMapState(prev => ({ ...prev, activeCategory: category.id }))}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  mapState.activeCategory === category.id
                    ? `${category.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map or List View */}
          <div className="lg:col-span-2">
            {viewMode === 'map' ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div
                  ref={mapRef}
                  className="w-full h-96 lg:h-[600px] bg-gray-100 flex items-center justify-center"
                >
                  {typeof window === 'undefined' || !(window as any).google ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading map...</p>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {mapState.places.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
                {mapState.places.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No places found</h3>
                    <p className="text-gray-600">Try adjusting your search or category filters</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setMapState(prev => ({ ...prev, activeCategory: 'immigration' }))}
                  className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Building className="h-5 w-5 text-blue-600" />
                  <span>Find Immigration Offices</span>
                </button>
                <button
                  onClick={() => setMapState(prev => ({ ...prev, activeCategory: 'airports' }))}
                  className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plane className="h-5 w-5 text-green-600" />
                  <span>Airport Navigation</span>
                </button>
                <button
                  onClick={() => setMapState(prev => ({ ...prev, activeCategory: 'hospitals' }))}
                  className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Hospital className="h-5 w-5 text-red-600" />
                  <span>Healthcare Services</span>
                </button>
              </div>
            </div>

            {/* Selected Place Details */}
            <AnimatePresence>
              {mapState.selectedPlace && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {mapState.selectedPlace.name}
                    </h3>
                    <button
                      onClick={handleCloseDetails}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                      <span className="text-sm text-gray-600">{mapState.selectedPlace.address}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm">
                        {mapState.selectedPlace.rating} ({mapState.selectedPlace.reviews} reviews)
                      </span>
                    </div>
                    
                    {mapState.selectedPlace.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{mapState.selectedPlace.phone}</span>
                      </div>
                    )}
                    
                    {mapState.selectedPlace.hours && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{mapState.selectedPlace.hours}</span>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {mapState.selectedPlace.description}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Immigration Tips */}
            <div className="bg-primary-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">Immigration Tips</h3>
              <div className="space-y-3 text-sm text-primary-800">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-primary-600 mt-0.5" />
                  <span>Always bring original documents to immigration offices</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-primary-600 mt-0.5" />
                  <span>Arrive early for appointments - processing can take time</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-primary-600 mt-0.5" />
                  <span>Keep digital copies of all important documents</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}