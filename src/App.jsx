import { useState, useEffect } from 'react'
import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import Layout from './Layout/Layout'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Loader from './components/ui/Loader'

// Import all your existing pages
import About from './pages/About'
import Home from './pages/Home'
import ContactUsPage from './pages/contactus'
import Packages from './pages/Packages'
import ServicePage from './pages/Servicepage'
import Gallery from './pages/Gallery'

// Import the 404 page
import Unavailable from './pages/Unavailble'

// 🔥 Import Toaster
import { Toaster } from 'react-hot-toast'

function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
  }, [])

  // Show loader on route change
  useEffect(() => {
    setLoading(true)
  }, [location.pathname])

  const handleLoaderFinish = () => setLoading(false)

  return (
    <>
      {loading && <Loader onFinish={handleLoaderFinish} />}
      {!loading && (
        <>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about-jaya" element={<About />} />
              <Route path="/contact-us" element={<ContactUsPage />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/service/:slug" element={<ServicePage />} />
              <Route path="/gallery" element={<Gallery />} />
              {/* 404 Catch-all route - MUST be last */}
              <Route path="*" element={<Unavailable />} />
            </Route>
          </Routes>

          {/* 🔥 Global Toaster */}
          <Toaster
            position="top-center"
            toastOptions={{
              success: {
                style: {
                  background: '#333',
                  color: '#fff',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                  color: '#fff',
                },
              },
            }}
          />
        </>
      )}
    </>
  )
}

export default App
