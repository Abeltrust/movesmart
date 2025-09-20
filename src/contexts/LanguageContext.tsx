import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

interface LanguageContextType {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
  isLoading: boolean
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
]

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.guide': 'AI Guide',
    'nav.travel': 'Travel',
    'nav.maps': 'Maps',
    'nav.profile': 'Profile',
    'nav.login': 'Sign In',
    'nav.logout': 'Sign Out',
    'hero.title': 'Your AI-Powered Immigration Companion',
    'hero.subtitle': 'Navigate the world with confidence using our intelligent guide for safe and legal relocation',
    'hero.cta': 'Start Your Journey',
    'hero.demo': 'Watch Demo',
    'features.guide.title': 'AI Immigration Guide',
    'features.guide.desc': 'Get personalized visa and immigration advice powered by advanced AI',
    'features.travel.title': 'Travel Services',
    'features.travel.desc': 'Book flights, hotels, and transportation with immigration-friendly options',
    'features.maps.title': 'Smart Navigation',
    'features.maps.desc': 'Navigate airports, cities, and landmarks with step-by-step guidance',
    'features.community.title': 'Global Community',
    'features.community.desc': 'Connect with fellow immigrants and share experiences',
    'guide.title': 'AI Immigration Guide',
    'guide.placeholder': 'Ask me anything about immigration, visas, or travel...',
    'guide.send': 'Send',
    'guide.listening': 'Listening...',
    'guide.speak': 'Speak',
    'guide.stop': 'Stop',
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong. Please try again.',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.guide': 'Guía IA',
    'nav.travel': 'Viajes',
    'nav.maps': 'Mapas',
    'nav.profile': 'Perfil',
    'nav.login': 'Iniciar Sesión',
    'nav.logout': 'Cerrar Sesión',
    'hero.title': 'Tu Compañero de Inmigración con IA',
    'hero.subtitle': 'Navega por el mundo con confianza usando nuestra guía inteligente para reubicación segura y legal',
    'hero.cta': 'Comienza Tu Viaje',
    'hero.demo': 'Ver Demo',
    'features.guide.title': 'Guía de Inmigración IA',
    'features.guide.desc': 'Obtén consejos personalizados sobre visas e inmigración con IA avanzada',
    'features.travel.title': 'Servicios de Viaje',
    'features.travel.desc': 'Reserva vuelos, hoteles y transporte con opciones amigables para inmigrantes',
    'features.maps.title': 'Navegación Inteligente',
    'features.maps.desc': 'Navega por aeropuertos, ciudades y puntos de referencia con guía paso a paso',
    'features.community.title': 'Comunidad Global',
    'features.community.desc': 'Conéctate con otros inmigrantes y comparte experiencias',
    'guide.title': 'Guía de Inmigración IA',
    'guide.placeholder': 'Pregúntame cualquier cosa sobre inmigración, visas o viajes...',
    'guide.send': 'Enviar',
    'guide.listening': 'Escuchando...',
    'guide.speak': 'Hablar',
    'guide.stop': 'Parar',
    'common.loading': 'Cargando...',
    'common.error': 'Algo salió mal. Por favor, inténtalo de nuevo.',
  },
  // Add more languages as needed
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export { SUPPORTED_LANGUAGES }

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0])
  const [isLoading] = useState(false)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('movesmart_language')
    if (savedLanguage) {
      const language = SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage)
      if (language) {
        setCurrentLanguage(language)
      }
    }
  }, [])

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
    localStorage.setItem('movesmart_language', language.code)
  }

  const t = (key: string): string => {
    const languageTranslations = translations[currentLanguage.code as keyof typeof translations]
    return (languageTranslations as Record<string, string>)?.[key] || (translations.en as Record<string, string>)[key] || key
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}