import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Instagram, Play, Award, Camera } from "lucide-react";
import { Link } from "react-router-dom";

const JayaAbout = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* About Section with Side-by-Side Layout */}
      <div className="py-20 bg-[#FAF0DC]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image */}
            <div className="relative flex justify-center lg:justify-start">
              <div className="relative">
                {/* Main Image */}
                <div className="w-96 h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://img.freepik.com/free-photo/western-female-photographer-exploring-city-udaipur-india_53876-65361.jpg" // Replace with your actual image path
                    alt="Jaya - Professional Photographer"
                    className="w-full h-full object-cover"
                  />

                  {/* Subtle gradient overlay for better text readability if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                  {/* Optional: Badge or label */}
                  {/* <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3">
                      <div className="text-black font-semibold text-sm">Jaya Photography</div>
                      <div className="text-gray-600 text-xs">Maternity & Newborn Specialist</div>
                    </div>
                  </div> */}
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-pink-200 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-8 -left-4 w-6 h-6 bg-yellow-200 rounded-full animate-bounce"></div>

                {/* Image Shadow */}
                <div className="absolute -bottom-4 -z-10 w-96 h-20 bg-black/20 rounded-full blur-xl"></div>
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <h2 className="text-3xl text-black mb-8 font-semibold">About Jaya</h2>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p>
                  With a Masters in Photography and over 10 years of experience,
                  I specialize in capturing the intimate moments of motherhood
                  and the pure joy of new life.
                </p>
                <p>
                  Based in Lucknow, I believe every session should tell a unique
                  story. My approach combines artistic vision with genuine
                  emotion to create timeless photographs you'll treasure
                  forever.
                </p>
                <div className="flex gap-6 pt-4">
                  <Link to="/gallery">
                    <button className="px-8 py-4 bg-black text-white hover:bg-gray-800 transition-all duration-300 font-medium tracking-wide rounded-lg shadow-lg hover:shadow-xl">
                      VIEW PORTFOLIO
                    </button>
                  </Link>
                  <Link to="/contact">
                    <button className="px-8 py-4 border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 font-medium tracking-wide rounded-lg">
                      BOOK SESSION
                    </button>
                  </Link>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-300">
                <div className="text-center">
                  <div className="text-3xl font-thin text-black mb-2">10+</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wider">
                    Years
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-thin text-black mb-2">500+</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wider">
                    Sessions
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-thin text-black mb-2">
                    Masters
                  </div>
                  <div className="text-sm text-gray-600 uppercase tracking-wider">
                    Degree
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JayaAbout;
