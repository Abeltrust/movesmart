import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Guide from './pages/Guide'
import Travel from './pages/Travel'
import Maps from './pages/Maps'
import Profile from './pages/Profile'
import Opportunities from './pages/Opportunities'
import Login from './pages/Login'
import PassportLocator from './pages/PassportLocator'

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/travel" element={<Travel />} />
              <Route path="/maps" element={<Maps />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/passport-locator" element={<PassportLocator />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App