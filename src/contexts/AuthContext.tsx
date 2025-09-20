import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  sessionId: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (userData: Omit<User, 'id' | 'sessionId' | 'createdAt'>) => void
  logout: () => void
  isAuthenticated: boolean
  sessionId: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [sessionId] = useState(() => {
    const existingSession = Cookies.get('movesmart_session')
    return existingSession || uuidv4()
  })

  useEffect(() => {
    // Set session cookie
    Cookies.set('movesmart_session', sessionId, { expires: 30 })
    
    // Check for existing user data
    const userData = Cookies.get('movesmart_user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
        Cookies.remove('movesmart_user')
      }
    }
  }, [sessionId])

  const login = (userData: Omit<User, 'id' | 'sessionId' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: uuidv4(),
      sessionId,
      createdAt: new Date().toISOString(),
    }
    
    setUser(newUser)
    Cookies.set('movesmart_user', JSON.stringify(newUser), { expires: 30 })
  }

  const logout = () => {
    setUser(null)
    Cookies.remove('movesmart_user')
    // Keep session for anonymous usage
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      sessionId
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}