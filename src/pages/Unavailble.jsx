import React from 'react'

const Unavailable = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 mt-20 relative overflow-hidden">
      <div className="max-w-2xl mx-auto text-center">
        {/* Camera Icon */}
        <div className="mb-8 mt-10">
          <div className="relative inline-block">
            <div className="w-32 h-24 bg-gray-300 rounded-lg shadow-lg mx-auto relative">
              {/* Camera body */}
              <div className="absolute top-2 left-4 w-6 h-4 bg-gray-400 rounded"></div>
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                </div>
              </div>
              {/* Flash */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-gray-200 rounded-t-lg"></div>
            </div>
            {/* Broken/crossed out effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-1 bg-red-500 transform rotate-45 opacity-80"></div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-8">
          <h1 className="text-6xl font-bold text-white mb-2">404</h1>
          <h2 className="text-3xl font-semibold text-gray-200 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
            Oops! The page you're looking for seems to be out of focus. 
            It might have been moved, deleted, or never existed in our website.
          </p>
        </div>

        {/* Photography-themed message */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 mb-8 border border-gray-700">
          <p className="text-gray-300 italic">
            "Sometimes the most beautiful shots are the ones we never captured."
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button 
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Go Back
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-transparent border-2 border-gray-300 hover:border-white text-gray-300 hover:text-white font-medium rounded-lg transition-all duration-300 hover:bg-white/10"
          >
            Return to Home
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-40 right-10 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-700"></div>
      </div>
    </div>
  )
}

export default Unavailable
