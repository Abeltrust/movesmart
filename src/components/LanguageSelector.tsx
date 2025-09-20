import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { useLanguage, SUPPORTED_LANGUAGES } from '../contexts/LanguageContext'

export default function LanguageSelector() {
  const { currentLanguage, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span>{currentLanguage.code.toUpperCase()}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  setLanguage(language)
                  setIsOpen(false)
                }}
                className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{language.flag}</span>
                  <div className="text-left">
                    <div className="font-medium">{language.code.toUpperCase()}</div>
                    <div className="text-xs text-gray-500">{language.name}</div>
                  </div>
                </div>
                {language.code === currentLanguage.code && (
                  <Check className="h-4 w-4 text-primary-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}