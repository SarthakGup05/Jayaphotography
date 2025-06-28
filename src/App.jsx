import { useState, useEffect } from 'react'
import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import Layout from './Layout/Layout'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Loader from './components/ui/Loader'

import About from './pages/About'
import Home from './pages/Home'
import ContactUsPage from './pages/Contactus'
import BabyPhotographyPage from './pages/Babyphotography'
import MaternityPhotography from './pages/MaternityPhotography'
import FashionPhotography from './pages/FashionPhotography'
import { Package } from 'lucide-react'
import Packages from './pages/Packages'

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
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about-jaya" element={<About />} />
            <Route path="/contact" element={<ContactUsPage />} />
            <Route path="/baby-photography" element={<BabyPhotographyPage />} />
            <Route path="/maternity-photography" element={<MaternityPhotography />} />
            <Route path="/fashion-photography" element={<FashionPhotography />} />
            <Route path="/packages" element={<Packages />} />
          </Route>
        </Routes>
      )}
    </>
  )
}

export default App