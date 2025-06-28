import React from 'react'
import { Mail, MapPin, Phone, Camera, Heart, Instagram, Facebook, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden font-lato">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-pink-300 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-purple-300 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Camera className="w-8 h-8 text-pink-400" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-playfair">
                Jaya Photography
              </h2>
            </div>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Capturing life's most precious moments with artistry and love
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* About */}
            <div className="group">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 hover:border-pink-400/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center gap-3 mb-6">
                  <Heart className="w-6 h-6 text-pink-400" />
                  <h3 className="text-2xl font-bold text-pink-400 font-playfair">About Me</h3>
                </div>
                <p className="leading-relaxed text-gray-300 text-lg mb-4">
                  Hi! I'm Jaya. I have a Masters in Photography with 10 years of experience specializing in maternity and baby photography.
                </p>
                <p className="text-gray-400">
                  Currently creating beautiful memories in Lucknow ✨
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="group">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 hover:border-purple-400/30 transition-all duration-300 hover:transform hover:scale-105">
                <h3 className="text-2xl font-bold mb-6 text-purple-400 font-playfair">Quick Links</h3>
                <ul className="space-y-4">
                  <li>
                    <a href="/" className="text-gray-300 hover:text-white text-lg flex items-center gap-2 group/link transition-all duration-200 hover:translate-x-2 font-lato">
                      <span className="w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover/link:opacity-100 transition-opacity"></span>
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/about" className="text-gray-300 hover:text-white text-lg flex items-center gap-2 group/link transition-all duration-200 hover:translate-x-2 font-lato">
                      <span className="w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover/link:opacity-100 transition-opacity"></span>
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/album" className="text-gray-300 hover:text-white text-lg flex items-center gap-2 group/link transition-all duration-200 hover:translate-x-2 font-lato">
                      <span className="w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover/link:opacity-100 transition-opacity"></span>
                      Album
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="group">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 hover:border-blue-400/30 transition-all duration-300 hover:transform hover:scale-105">
                <h3 className="text-2xl font-bold mb-6 text-blue-400 font-playfair">Get In Touch</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4 group/contact font-lato">
                    <MapPin className="w-5 h-5 text-blue-400 mt-1 group-hover/contact:scale-110 transition-transform" />
                    <span className="text-gray-300 group-hover/contact:text-white transition-colors">
                      Vishal Khand 2, Gomti Nagar<br />
                      <span className="text-sm text-gray-400">Lucknow, India</span>
                    </span>
                  </li>
                  <li className="flex items-center gap-4 group/contact font-lato">
                    <Mail className="w-5 h-5 text-blue-400 group-hover/contact:scale-110 transition-transform" />
                    <a href="mailto:jayaagnihotriphotography@gmail.com" className="text-gray-300 hover:text-white transition-colors break-all">
                      jayaagnihotriphotography@gmail.com
                    </a>
                  </li>
                  <li className="flex items-center gap-4 group/contact font-lato">
                    <Phone className="w-5 h-5 text-blue-400 group-hover/contact:scale-110 transition-transform" />
                    <a href="tel:9335391320" className="text-gray-300 hover:text-white transition-colors text-lg font-medium">
                      +91 9335391320
                    </a>
                  </li>
                </ul>
                
                {/* Social Links */}
                <div className="mt-8 pt-6 border-t border-gray-700/50">
                  <p className="text-sm text-gray-400 mb-4 font-lato">Follow my work</p>
                  <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-gray-700/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400 text-center md:text-left font-lato">
                <p className="text-sm">
                  © 2025 Jaya Photography. All rights reserved.
                </p>
                <p className="text-xs mt-1">
                  Made with <Heart className="w-3 h-3 inline text-pink-400" /> for capturing beautiful moments
                </p>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-400 font-lato">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Portfolio</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer