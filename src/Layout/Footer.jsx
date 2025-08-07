import React from 'react'
import {
  Mail,
  MapPin,
  Phone,
  Camera,
  Heart,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-white text-[#764F39] relative overflow-hidden font-raleway">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#764F39] blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-pink-300 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-purple-300 blur-3xl"></div>
      </div>

      <div className="relative z-10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Camera className="w-8 h-8 text-[#764F39]" />
              <h2 className="text-4xl font-bold text-[#764F39] font-playfair">
                Jaya Photography
              </h2>
            </div>
            <p className="text-[#764F39] max-w-2xl mx-auto text-lg">
              Capturing life's most precious moments with artistry and love
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* About */}
            <div className="group">
              <div className="bg-[#fef9f6] rounded-2xl p-8 border border-[#f3e7e1] transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center gap-3 mb-6">
                  <Heart className="w-6 h-6 text-[#764F39]" />
                  <h3 className="text-2xl font-bold text-[#764F39] font-playfair">
                    About Me
                  </h3>
                </div>
                <p className="leading-relaxed text-[#764F39] text-lg mb-4">
                  Hi! I'm Jaya. I have a Masters in Photography with 10 years of experience specializing in maternity and baby photography.
                </p>
                <p className="text-[#764F39] opacity-70">
                  Currently creating beautiful memories in Lucknow ✨
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="group">
              <div className="bg-[#fef9f6] rounded-2xl p-8 border border-[#f3e7e1] transition-all duration-300 hover:transform hover:scale-105">
                <h3 className="text-2xl font-bold mb-6 text-[#764F39] font-playfair">
                  Quick Links
                </h3>
                <ul className="space-y-4">
                  {['Home', 'About Us', 'Album'].map((item, index) => (
                    <li key={index}>
                      <a
                        href={`/${item.toLowerCase().replace(/\s/g, '')}`}
                        className="text-[#764F39] hover:underline text-lg flex items-center gap-2 transition-all duration-200 font-raleway"
                      >
                        <span className="w-2 h-2 bg-[#764F39] rounded-full opacity-0 group-hover/link:opacity-100 transition-opacity"></span>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="group">
              <div className="bg-[#fef9f6] rounded-2xl p-8 border border-[#f3e7e1] transition-all duration-300 hover:transform hover:scale-105">
                <h3 className="text-2xl font-bold mb-6 text-[#764F39] font-playfair">
                  Get In Touch
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4 font-raleway">
                    <MapPin className="w-5 h-5 text-[#764F39] mt-1" />
                    <span>
                      Vishal Khand 2, Gomti Nagar
                      <br />
                      <span className="text-sm text-[#764F39] opacity-70">Lucknow, India</span>
                    </span>
                  </li>
                  <li className="flex items-center gap-4 font-raleway">
                    <Mail className="w-5 h-5 text-[#764F39]" />
                    <a
                      href="mailto:jayaagnihotriphotography@gmail.com"
                      className="hover:underline break-all"
                    >
                      jayaagnihotriphotography@gmail.com
                    </a>
                  </li>
                  <li className="flex items-center gap-4 font-raleway">
                    <Phone className="w-5 h-5 text-[#764F39]" />
                    <a href="tel:9335391320" className="text-lg font-medium hover:underline">
                      +91 9335391320
                    </a>
                  </li>
                </ul>

                {/* Social Links */}
                <div className="mt-8 pt-6 border-t border-[#e2d4cd]">
                  <p className="text-sm text-[#764F39] opacity-70 mb-4 font-raleway">Follow my work</p>
                  <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 bg-[#764F39] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Instagram className="w-5 h-5 text-white" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-[#764F39] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Facebook className="w-5 h-5 text-white" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-[#764F39] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Twitter className="w-5 h-5 text-white" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-[#e2d4cd] pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left font-raleway">
                <p className="text-sm text-[#764F39] opacity-80">
                  © 2025 Jaya Photography. All rights reserved.
                </p>
                <p className="text-xs mt-1 text-[#764F39] opacity-70">
                  Made with <Heart className="w-3 h-3 inline text-[#764F39]" /> for capturing beautiful moments
                </p>
              </div>

              <div className="flex items-center gap-6 text-sm text-[#764F39] font-raleway opacity-80">
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">Terms of Service</a>
                <a href="#" className="hover:underline">Portfolio</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
