
interface GeminiMessage {
  role: 'user' | 'model'
  parts: Array<{ text: string }>
}

interface GeminiRequest {
  contents: GeminiMessage[]
  generationConfig?: {
    temperature?: number
    topK?: number
    topP?: number
    maxOutputTokens?: number
  }
  safetySettings?: Array<{
    category: string
    threshold: string
  }>
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>
    }
    finishReason: string
  }>
}

interface BookingRequest {
  type: 'flight' | 'hotel' | 'transport' | 'visa'
  from?: string
  to?: string
  date?: string
  passengers?: number
  class?: string
  documents?: any[]
  userPermission?: boolean
}

interface CountryData {
  visaRequirements: any
  costOfLiving: any
  jobMarket: any
  healthcare: any
  education: any
  culture: any
  immigration: any
}

class AIService {
  private apiKey: string
  private apiUrl: string
  private countryDataCache: Map<string, CountryData> = new Map()

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCYIwm307rDO_mrbizPUJhLRpr7x0B5dLk'
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
  }

  async getImmigrationAdvice(
    userMessage: string,
    language: string = 'en',
    conversationHistory: Array<{ role: string; content: string }> = []
  ): Promise<string> {
    try {
      // Check if user is requesting booking or document processing
      const isBookingRequest = this.detectBookingIntent(userMessage)
      const isDocumentRequest = this.detectDocumentIntent(userMessage)
      
      if (isBookingRequest) {
        return await this.handleBookingRequest(userMessage, conversationHistory)
      }
      
      if (isDocumentRequest) {
        return await this.handleDocumentProcessing(userMessage, conversationHistory)
      }

      // Get real-time data for the query
      const enrichedContext = await this.enrichWithRealTimeData(userMessage)
      
      const systemPrompt = this.getEnhancedSystemPrompt(language, enrichedContext)
      
      const geminiMessages: GeminiMessage[] = []
      
      // Add system prompt
      geminiMessages.push({
        role: 'user',
        parts: [{ text: systemPrompt }]
      })
      
      geminiMessages.push({
        role: 'model',
       parts: [{
                  text: 'Got it! I’m MoveSmart AI, your go-to for immigration and relocation. I can help book flights, handle visa applications, give real-time country info, and guide you step by step. I can even complete tasks with your permission. What would you like to do first?'
                }]
 })

      // Add conversation history
      conversationHistory.forEach((msg) => {
        if (msg.role === 'user') {
          geminiMessages.push({
            role: 'user',
            parts: [{ text: msg.content }]
          })
        } else if (msg.role === 'assistant') {
          geminiMessages.push({
            role: 'model',
            parts: [{ text: msg.content }]
          })
        }
      })

      // Add current user message with enriched context
      geminiMessages.push({
        role: 'user',
        parts: [{ text: `${userMessage}\n\nContext: ${enrichedContext}` }]
      })

      const requestBody: GeminiRequest = {
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2000,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      }

      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(requestBody),
})


      if (!response.ok) {
        const errorData = await response.text()
        console.error('Gemini API Error:', response.status, errorData)
        throw new Error(`API request failed: ${response.status}`)
      }

      const data: GeminiResponse = await response.json()
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated')
      }

      const generatedText = data.candidates[0]?.content?.parts?.[0]?.text
      
      if (!generatedText) {
        throw new Error('Empty response from API')
      }

      return this.enhanceResponseWithActionableButtons(generatedText, userMessage)
    } catch (error) {
      console.error('AI Service Error:', error)
      return this.getFallbackResponse(language)
    }
  }
  handleBookingRequest(userMessage: string, conversationHistory: { role: string; content: string }[]): string | PromiseLike<string> {
    throw new Error("Method not implemented.")
  }

  private detectBookingIntent(message: string): boolean {
    const bookingKeywords = [
      'book flight', 'book hotel', 'reserve', 'purchase ticket',
      'buy ticket', 'make reservation', 'book travel', 'book accommodation',
      'find flights', 'search flights', 'flight booking', 'hotel booking'
    ]
    
    return bookingKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  private detectDocumentIntent(message: string): boolean {
    const documentKeywords = [
      'visa application', 'apply for visa', 'process visa',
      'submit documents', 'upload documents', 'visa processing',
      'immigration documents', 'document verification'
    ]
    
    return documentKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    )
  }

//   private async handleBookingRequest(message: string, history: any[]): Promise<string> {
//   const bookingDetails = this.extractBookingDetails(message)

//   if (bookingDetails.type === 'flight') {
//     return await this.processFlightBooking(bookingDetails, message)
//   } else if (bookingDetails.type === 'hotel') {
//     return await this.processHotelBooking(bookingDetails, message)
//   }

//   return this.getBookingErrorResponse()
// }



private async processFlightBooking(details: any, originalMessage: string): Promise<string> {
  const flights = await this.searchFlights(details)

  if (!flights || flights.length === 0) {
    return " Sorry, no flights were found for your request. Please try different dates or routes."
  }

  // Show only top 3 flight options
  const options = flights.slice(0, 3).map((flight, index) => {
    return `${index + 1}. ${flight.airline} – ${flight.flightNumber || 'N/A'}  
   From: ${flight.departure} → To: ${flight.arrival}  
   Status: ${flight.status}`
  }).join("\n\n")

  return `# ✈️ Flight Options\n${options}\n\n👉 Reply with "Book [Option]" to continue.`
}


private async processHotelBooking(details: any, originalMessage: string): Promise<string> {
  const hotels = await this.searchHotels(details)

  return `# 🏨 Hotel Options
1. Extended Stay Suites – $120/night – Kitchen + Immigration docs support  
2. Business Hotel Central – $180/night – WiFi + Concierge  

👉 Reply with "Book [Option]" to confirm.`
}

private async handleDocumentProcessing(_message: string, _history: any[]): Promise<string> {
  return `# 📋 Visa Application
- I can check documents, complete forms, and submit.  
- Supported: Canada, USA, UK, Australia, Germany, more.  

👉 Reply with "Start visa for [Country]" to begin.`
}


  private async enrichWithRealTimeData(message: string): Promise<string> {
    // Extract country/location from message
    const countries = this.extractCountries(message)
    let enrichedData = ''

    for (const country of countries) {
      const countryData = await this.getCountryData(country)
      enrichedData += `\n\nReal-time data for ${country}:\n`
      enrichedData += `- Visa processing time: ${countryData.immigration.processingTime}\n`
      enrichedData += `- Current visa fees: ${countryData.immigration.fees}\n`
      enrichedData += `- Job market: ${countryData.jobMarket.status}\n`
      enrichedData += `- Cost of living index: ${countryData.costOfLiving.index}\n`
      enrichedData += `- Healthcare system: ${countryData.healthcare.type}\n`
    }

    return enrichedData
  }

  private extractCountries(message: string): string[] {
    const countryPatterns = [
      /\b(canada|canadian)\b/i,
      /\b(usa|america|united states)\b/i,
      /\b(uk|britain|united kingdom)\b/i,
      /\b(australia|australian)\b/i,
      /\b(germany|german)\b/i,
      /\b(france|french)\b/i,
      /\b(spain|spanish)\b/i,
      /\b(italy|italian)\b/i,
      /\b(netherlands|dutch)\b/i,
      /\b(sweden|swedish)\b/i
    ]

    const countries: string[] = []
    countryPatterns.forEach(pattern => {
      const match = message.match(pattern)
      if (match) {
        countries.push(match[1].toLowerCase())
      }
    })

    return countries
  }

  private async getCountryData(country: string): Promise<CountryData> {
    if (this.countryDataCache.has(country)) {
      return this.countryDataCache.get(country)!
    }

    // Simulate real-time data fetching
    const data: CountryData = {
      visaRequirements: {
        processingTime: '2-4 weeks',
        fees: '$150-500',
        requirements: ['Passport', 'Photos', 'Financial proof', 'Medical exam']
      },
      costOfLiving: {
        index: 75,
        rent: '$800-2000/month',
        food: '$300-500/month',
        transport: '$100-200/month'
      },
      jobMarket: {
        status: 'Strong demand for skilled workers',
        averageSalary: '$45,000-80,000',
        unemployment: '3.2%'
      },
      healthcare: {
        type: 'Universal healthcare',
        cost: 'Free/Low cost',
        quality: 'High'
      },
      education: {
        system: 'World-class universities',
        cost: '$10,000-30,000/year',
        language: 'English'
      },
      culture: {
        language: 'English',
        diversity: 'Highly multicultural',
        climate: 'Varies by region'
      },
      immigration: {
        processingTime: '6-12 months',
        fees: '$1,500-3,000',
        pathways: ['Express Entry', 'Provincial Nominee', 'Family Sponsorship']
      }
    }

    this.countryDataCache.set(country, data)
    return data
  }

// private async searchFlights(details: any): Promise<any[]> {
//   try {
//     const response = await fetch(
//       `http://api.aviationstack.com/v1/flights?access_key=${import.meta.env.VITE_AVIATIONSTACK_API_KEY}&dep_iata=${details.from}&arr_iata=${details.to}`
//     )
//     const data = await response.json()

//     if (!data.data || data.data.length === 0) {
//       return []
//     }

//     // Format top 3 flights
//     return data.data.slice(0, 3).map((flight: any) => ({
//       airline: flight.airline?.name || "Unknown",
//       flightNumber: flight.flight?.iata || "N/A",
//       departure: flight.departure?.airport,
//       arrival: flight.arrival?.airport,
//       status: flight.flight_status
//     }))
//   } catch (error) {
//     console.error("Aviationstack API error:", error)
//     return []
//   }
// }
private async searchFlights(details: any): Promise<any[]> {
  const url = `http://api.aviationstack.com/v1/flights?access_key=${import.meta.env.VITE_AVIATIONSTACK_API_KEY}&dep_iata=${details.from}&arr_iata=${details.to}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data && data.data) {
      return data.data.map((flight: any) => ({
        airline: flight.airline?.name || 'Unknown Airline',
        flightNumber: flight.flight?.iata || 'N/A',
        departure: flight.departure?.airport || 'Unknown',
        arrival: flight.arrival?.airport || 'Unknown',
        status: flight.flight_status || 'Unknown'
      }))
    }
    return []
  } catch (error) {
    console.error('Error fetching flights:', error)
    return []
  }
}


  private async searchHotels(details: any): Promise<any[]> {
    // Simulate hotel search
    return [
      {
        name: 'Extended Stay Suites',
        price: 120,
        rating: 4.5,
        features: ['Kitchen', 'Laundry', 'Business center']
      },
      {
        name: 'Business Hotel Central',
        price: 180,
        rating: 4.2,
        features: ['WiFi', 'Gym', 'Meeting rooms']
      }
    ]
  }

  private enhanceResponseWithActionableButtons(response: string, userMessage: string): string {
    let enhancedResponse = response

    // Add booking buttons for flight-related queries
    if (userMessage.toLowerCase().includes('flight') || userMessage.toLowerCase().includes('book')) {
      enhancedResponse += `\n\n## 🚀 **Instant Actions:**\n`
      enhancedResponse += `- **[📱 Book This Flight Now](/travel?action=book&type=flight)** - Complete booking in 2 minutes\n`
      enhancedResponse += `- **[🗺️ Airport Navigation Guide](/maps?category=airports)** - Step-by-step airport guidance\n`
      enhancedResponse += `- **[📋 Visa Requirements Check](/guide?action=visa-check)** - Verify your travel documents\n`
      enhancedResponse += `- **[🏨 Book Arrival Hotel](/travel?action=book&type=hotel)** - Secure accommodation\n`
    }

    // Add visa processing buttons
    if (userMessage.toLowerCase().includes('visa') || userMessage.toLowerCase().includes('immigration')) {
      enhancedResponse += `\n\n## 📋 **Visa Processing Center:**\n`
      enhancedResponse += `- **[📤 Start Visa Application](/guide?action=visa-apply)** - I'll process your application\n`
      enhancedResponse += `- **[📷 Upload Documents](/profile?section=documents)** - Secure document processing\n`
      enhancedResponse += `- **[🏛️ Find Immigration Offices](/maps?category=immigration)** - Locate nearest offices\n`
      enhancedResponse += `- **[📊 Track Application Status](/profile?section=applications)** - Monitor progress\n`
    }

    // Add location-specific buttons
    const locationMatch = userMessage.match(/\b(canada|usa|uk|germany|australia|france|spain|italy)\b/i)
    if (locationMatch) {
      const country = locationMatch[1].toLowerCase()
      enhancedResponse += `\n\n## 🌍 **${country.toUpperCase()} Immigration Hub:**\n`
      enhancedResponse += `- **[📖 Complete ${country} Guide](/guide?country=${country})** - Everything you need to know\n`
      enhancedResponse += `- **[🗺️ Explore ${country} Cities](/maps?country=${country})** - Virtual tours and navigation\n`
      enhancedResponse += `- **[✈️ Book Travel to ${country}](/travel?destination=${country})** - Immigration-friendly bookings\n`
      enhancedResponse += `- **[👥 Connect with ${country} Community](/profile?section=community&country=${country})** - Meet other immigrants\n`
    }

    return enhancedResponse
  }

private getEnhancedSystemPrompt(language: string, enrichedContext: string): string {
  const prompts: Record<string, string> = {
    en: `Hi! I’m MoveSmart AI, your all-in-one immigration and relocation assistant.
**What I Can Do for You:**
- Book flights, hotels, and transport
- Process visas and immigration documents
- Give live updates on visa times, fees, and requirements
- Guide you with step-by-step instructions and virtual tours

**How I Work:**
- I complete tasks within the platform and redirect to external websites if needed
- I provide full, actionable solutions with details
- I can perform tasks immediately if you give permission

**Enhanced Context:** ${enrichedContext}

Let’s make your immigration and relocation smooth and stress-free!`,

    es: `¡Hola! Soy MoveSmart AI, tu asistente completo para inmigración y reubicación.
    
**Qué Puedo Hacer:**
- Reservar vuelos, hoteles y transporte
- Procesar visas y documentos de inmigración
- Dar información en tiempo real sobre tiempos, tarifas y requisitos de visas
- Guiarte paso a paso y ofrecer recorridos virtuales

**Contexto Mejorado:** ${enrichedContext}

¡Vamos a hacer tu proceso de inmigración y reubicación fácil y sin estrés!`
  }

  return prompts[language] || prompts.en
}



 private getBookingErrorResponse(): string {
  return `❌ Booking temporarily unavailable.  
I can still help with:
- Flight search & comparison  
- Hotel recommendations  
- Visa guidance  
- Immigration office locations  
- Country-specific guides  

Please rephrase your request or specify what you need help with.`
}


  private getFallbackResponse(language: string): string {
  const fallbacks = {
    en: `🤖 MoveSmart AI is having a brief hiccup, but I’m still here!  
I can help with visas, flights, hotels, documents, and immigration info.  
Try asking again or tell me what you need most!`,

    es: `🤖 MoveSmart AI tiene un pequeño inconveniente, ¡pero sigo aquí!  
Puedo ayudarte con visas, vuelos, hoteles, documentos e información de inmigración.  
Intenta preguntar de nuevo o dime qué necesitas.`
  }

  return fallbacks[language as keyof typeof fallbacks] || fallbacks.en
}


  async getPersonalizedOpportunities(userProfile: any, filters: any): Promise<any[]> {
    try {
      // In real implementation, this would call an external API
      // For now, we'll simulate AI-powered opportunity matching
      
      await this.getImmigrationAdvice('Get personalized opportunities', 'en', [])
      
      // In real implementation, parse the AI response and return structured data
      return []
    } catch (error) {
      console.error('Error getting personalized opportunities:', error)
      return []
    }
  }

  async getLocationInfo(location: string): Promise<string> {
    const enrichedData = await this.enrichWithRealTimeData(`information about ${location}`)
    const prompt = `Provide comprehensive immigration-focused information about ${location}, including:
    - Immigration offices and their exact locations with directions
    - Safe neighborhoods recommended for new immigrants with rental prices
    - Essential services (banks that open accounts for newcomers, hospitals, schools)
    - Transportation options with costs and immigrant-friendly tips
    - Cultural integration advice and local customs
    - Job market information and networking opportunities
    - Cost of living breakdown with specific prices
    - Step-by-step first-week survival guide
    
    Format as a complete relocation guide with actionable information and specific details.
    
    Current data: ${enrichedData}`

    return this.getImmigrationAdvice(prompt)
  }

  async getVirtualTour(location: string): Promise<string> {
  const prompt = `Give a friendly, easy-to-follow virtual tour of ${location} for new immigrants:
- Airport arrival tips and what to expect
- Immigration process guidance
- Transport options to the city center with costs
- Key downtown spots and landmarks
- First-stop essentials: SIM cards, currency exchange, groceries
- Neighborhood safety and rental prices
- Immigration offices with directions and parking
- Banks friendly to newcomers
- Shopping areas for essentials
- Healthcare access tips

Keep it casual, helpful, and easy to visualize.`

  return this.getImmigrationAdvice(prompt)
}


  async generateBookingLink(request: BookingRequest): Promise<string> {
    // Return internal platform links instead of external ones
    const baseUrls = {
      flight: '/travel?service=flights&action=book',
      hotel: '/travel?service=hotels&action=book',
      transport: '/travel?service=transport&action=book',
      visa: '/guide?action=visa-apply'
    }

    let url = baseUrls[request.type]
    
    if (request.from) url += `&from=${encodeURIComponent(request.from)}`
    if (request.to) url += `&to=${encodeURIComponent(request.to)}`
    if (request.date) url += `&date=${request.date}`

    return url
  }
}

export default AIService

export const aiService = new AIService()