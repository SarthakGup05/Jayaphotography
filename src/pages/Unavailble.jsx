import React from 'react'
import { Camera, Home, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react'

const Unavailable = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e6fa] via-white to-[#F0E7E5] flex items-center justify-center px-4 mt-20 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 bg-purple-200/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-32 h-32 bg-pink-200/8 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-blue-200/6 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Enhanced Camera Icon */}
        <div className="mb-8">
          <div className="relative inline-block group">
           
            
            {/* Error indicator */}
            {/* <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-1 bg-red-400 transform rotate-45 opacity-80 rounded-full shadow-lg"></div>
              <div className="absolute">
                <AlertCircle className="w-8 h-8 text-red-500 bg-white rounded-full p-1 shadow-lg" />
              </div>
            </div> */}
          </div>
        </div>

        {/* Enhanced Error Content */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 mb-8">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-6xl font-bold text-gray-800">4</span>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <span className="text-6xl font-bold text-gray-800">4</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Page Not Found
            </h2>
            
            <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              Oops! The page you're looking for seems to be out of focus. 
              It might have been moved, deleted, or never existed.
            </p>
          </div>
        </div>

        {/* Photography Quote */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-purple-100/50 shadow-md">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-purple-700 uppercase tracking-wide">Photography Wisdom</span>
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-gray-700 italic text-lg">
            "Sometimes the most beautiful shots are the ones we never captured."
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-purple-200 hover:border-purple-300 text-purple-600 hover:text-purple-700 font-semibold rounded-2xl transition-all duration-300 hover:bg-purple-50 transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            <span>Return Home</span>
          </button>
        </div>

        {/* Additional Help */}
        {/* <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">Need help finding something specific?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/" className="text-purple-600 hover:text-purple-700 hover:underline transition-colors duration-200">
              Homepage
            </a>
            <span className="text-gray-300">•</span>
            <a href="/services" className="text-purple-600 hover:text-purple-700 hover:underline transition-colors duration-200">
              Services
            </a>
            <span className="text-gray-300">•</span>
            <a href="/gallery" className="text-purple-600 hover:text-purple-700 hover:underline transition-colors duration-200">
              Gallery
            </a>
            <span className="text-gray-300">•</span>
            <a href="/contact" className="text-purple-600 hover:text-purple-700 hover:underline transition-colors duration-200">
              Contact
            </a>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Unavailable
