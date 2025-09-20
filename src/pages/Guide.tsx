import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, MicOff, Volume2,Lock,Book, Copy, ThumbsUp, ThumbsDown, MapPin, Plane, Hotel, FileText, Camera, Navigation, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import toast from 'react-hot-toast'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import AIService from '../services/AIService'
import { Link, useSearchParams } from 'react-router-dom'

const aiService = new AIService()

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  isLoading?: boolean
}

export default function Guide() {
  const { t, currentLanguage } = useLanguage()
  const { } = useAuth()
  const [searchParams] = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `# Welcome to MoveSmart AI

  Your AI-Powered Immigration Companion.
  Here’s what I can help you with:

  -  **# Visa & Immigration** 
  -  **# Travel Services** 
  -  **# Navigation & Location**
  -  **# Quick Actions** 

  What would you like to explore first?`,
      timestamp: new Date(),
    },
  ])


  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Web Speech API fallbacks
  const [speaking, setSpeaking] = useState(false)
  const [listening, setListening] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Handle URL parameters for specific topics
    const topic = searchParams.get('topic')
    const country = searchParams.get('country')
    
    if (topic || country) {
      let query = ''
      if (topic === 'visa') query = 'Help me with visa application process'
      else if (topic === 'housing') query = 'Guide me through finding accommodation'
      else if (country) query = `Tell me about immigrating to ${country}`
      
      if (query) {
        setTimeout(() => handleSendMessage(query), 1000)
      }
    }
  }, [searchParams])

  const quickActions = [
    {
      icon: FileText,
      title: "Complete Visa Application",
      query: "I want to apply for a visa. Please help me complete the entire application process including document verification and submission.",
      color: "bg-blue-500"
    },
    {
      icon: Plane,
      title: "Book Flight Now",
      query: "I want to book a flight from Mumbai to Toronto. Please search available options and help me complete the booking with immigration documentation.",
      color: "bg-green-500"
    },
    {
      icon: MapPin,
      title: "Virtual City Tour with Booking",
      query: "Give me a detailed virtual tour of Toronto including immigration offices, safe neighborhoods, and help me book accommodation in the best area for newcomers.",
      color: "bg-purple-500"
    },
    {
      icon: Hotel,
      title: "Book Accommodation Now",
      query: "I need accommodation for my first month in Canada. Please find and book immigration-friendly hotels or extended stay options with all necessary documentation.",
      color: "bg-orange-500"
    },
    {
      icon: Navigation,
      title: "Complete Airport Guide",
      query: "I'm traveling to Toronto airport. Please provide complete navigation from arrival to city center, including immigration procedures, transport booking, and first-day essentials.",
      color: "bg-red-500"
    },
    {
      icon: Camera,
      title: "Process My Documents",
      query: "I have passport photos and documents for my visa application. Please help me verify, format, and process them according to immigration requirements.",
      color: "bg-indigo-500"
    }
  ]

  const exampleQuestions = [
  "Apply and submit my Canadian student visa.",
  "Process my US green card application.",
  "Complete German job seeker visa and book travel.",
  "Book full relocation package to Sydney (flight + stay + local services)."
]


  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim()
    if (!text) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    }

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    }

    setMessages(prev => [...prev, userMessage, loadingMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Get conversation history
      const conversationHistory = messages.slice(1).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))

      const response = await aiService.getImmigrationAdvice(
        text,
        currentLanguage.code,
        conversationHistory
      )

      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
      }

      setMessages(prev => prev.slice(0, -1).concat(assistantMessage))
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: t('common.error'),
        timestamp: new Date(),
      }
      setMessages(prev => prev.slice(0, -1).concat(errorMessage))
      toast.error('Failed to get response. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSpeakMessage = (content: string) => {
    if ('speechSynthesis' in window) {
      if (speaking) {
        window.speechSynthesis.cancel()
        setSpeaking(false)
      } else {
        const utterance = new SpeechSynthesisUtterance(content)
        utterance.onend = () => setSpeaking(false)
        window.speechSynthesis.speak(utterance)
        setSpeaking(true)
      }
    } else {
      toast.error('Speech synthesis not supported in this browser')
    }
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Message copied to clipboard!')
  }

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      if (listening) {
        setListening(false)
      } else {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.onresult = (event: any) => {
          const result = event.results[0][0].transcript
          setInputMessage(result)
          setListening(false)
        }
        recognition.onerror = () => {
          toast.error('Speech recognition error. Please try again.')
          setListening(false)
        }
        recognition.start()
        setListening(true)
      }
    } else {
      toast.error('Speech recognition not supported in this browser')
    }
  }

  return (
  <div className="flex flex-col bg-gray-50 h-screen">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
      {/* Header */}
      <div className="text-center py-2">
        <h4 className="text-lg lg:text-xl font-bold text-gray-900 mb-1">
          MoveSmart AI Guide 🤖
        </h4>
        <p className="text-xs text-gray-600">
          Your personal immigration and relocation assistant powered by advanced AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 flex-1">
        {/* Sidebar (collapses on mobile) */}
        <div className="col-span-1 flex flex-col gap-2">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Quick Actions</h3>
            <div className="space-y-2 text-xs">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSendMessage(action.query)}
                  className="w-full flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div
                    className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}
                  >
                    <action.icon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-gray-700">{action.title}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="bg-white rounded-xl shadow-lg p-4 text-xs">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Explore More</h3>
            <div className="space-y-1">
              <Link
                to="/passport-locator"
                className="block p-2 rounded-lg hover:bg-purple-50 text-purple-600 font-medium"
              >
                <Book /> Apply e-Passport
              </Link>
              <Link
                to="/travel"
                className="block p-2 rounded-lg hover:bg-blue-50 text-blue-600 font-medium"
              >
                <Plane /> Travel Services
              </Link>
              <Link
                to="/maps"
                className="block p-2 rounded-lg hover:bg-green-50 text-green-600 font-medium"
              >
                <Navigation /> Smart Navigation
              </Link>
              <Link
                to="/profile"
                className="block p-2 rounded-lg hover:bg-purple-50 text-purple-600 font-medium"
              >
                <User /> My Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3 flex flex-col h-screen">
          {/* Example Questions */}
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border-b bg-white shadow-sm"
            >
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Try asking:</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {exampleQuestions.map((question, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSendMessage(question)}
                    className="text-left p-3 bg-white rounded-sm border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
                  >
                    <span className="text-gray-700 group-hover:text-primary-700 text-xs sm:text-sm">
                      {question}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Scrollable Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-lg border">
            <div className="space-y-2 text-xs sm:text-sm">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-3xl rounded-2xl px-4 py-2 shadow-sm ${
                        message.type === "user"
                          ? "bg-primary-500 text-white"
                          : "bg-gray-50 text-gray-800"
                      }`}
                    >
                      <ReactMarkdown className="prose prose-sm max-w-none">
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Fixed at Bottom */}
          <div className="sticky bottom-0 bg-white border-t shadow-lg p-4">
            <div className="flex items-end space-x-2 w-full">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={1}
                  disabled={isLoading}
                />
              </div>

              <button
                onClick={handleVoiceInput}
                className={`p-2 rounded-lg transition-colors ${
                  listening
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title={listening ? "Stop listening" : "Voice input"}
              >
                {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="btn-primary p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            {listening && (
              <div className="mt-1 text-center">
                <span className="text-red-500 font-medium"> Listening...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);


}