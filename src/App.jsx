import { useState, useEffect, lazy, Suspense } from "react"
import "./App.css"
import { Route, Routes, useLocation } from "react-router-dom"
import Layout from "./Layout/Layout"
import Loader from "./components/ui/Loader"
import { Toaster } from "react-hot-toast"

// 💤 Lazy-loaded pages for route-based code splitting
const Home = lazy(() => import("./pages/Home"))
const About = lazy(() => import("./pages/About"))
const ContactUsPage = lazy(() => import("./pages/Contactus"))
const Packages = lazy(() => import("./pages/Packages"))
const ServicePage = lazy(() => import("./pages/Servicepage"))
const Gallery = lazy(() => import("./pages/Gallery"))
const Unavailable = lazy(() => import("./pages/Unavailble"))

function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

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
          {/* Suspense ensures a fallback is shown while a lazy-loaded route loads */}
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about-us" element={<About />} />
                <Route path="/contact-us" element={<ContactUsPage />} />
                <Route path="/packages" element={<Packages />} />
                <Route path="/service/:slug" element={<ServicePage />} />
                <Route path="/gallery" element={<Gallery />} />
                {/* 404 Catch-all route */}
                <Route path="*" element={<Unavailable />} />
              </Route>
            </Routes>
          </Suspense>

          {/* 🔥 Global Toaster */}
          <Toaster
            position="top-center"
            toastOptions={{
              success: {
                style: { background: "#333", color: "#fff" },
              },
              error: {
                style: { background: "#ef4444", color: "#fff" },
              },
            }}
          />
        </>
      )}
    </>
  )
}

export default App
