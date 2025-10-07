import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const JayaAbout = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload hero image for instant LCP
  useEffect(() => {
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = '/bg/1.jpg';
    preloadLink.fetchpriority = 'high';
    document.head.appendChild(preloadLink);

    return () => {
      if (document.head.contains(preloadLink)) {
        document.head.removeChild(preloadLink);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black mt-20">
      {/* About Section with Side-by-Side Layout */}
      <div className="py-16 bg-[#F0E7E5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image with reserved space */}
            <div className="relative flex justify-center lg:justify-start">
              <div className="relative">
                {/* Main Image Container with fixed aspect ratio */}
                <div 
                  className="w-80 h-[500px] rounded-lg overflow-hidden shadow-lg relative"
                  style={{ aspectRatio: '320/500' }}
                >
                  {/* Skeleton loader */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-400 rounded-full animate-spin"></div>
                      </div>
                    </div>
                  )}

                  <img
                    src="/bg/1.jpg"
                    alt="Jaya - Professional Photographer"
                    width="320"
                    height="500"
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="eager"
                    fetchpriority="high"
                    decoding="sync"
                    onLoad={() => setImageLoaded(true)}
                    style={{ aspectRatio: '320/500' }}
                  />

                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                </div>

                {/* Minimal decorative elements */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-200 rounded-full"></div>
                <div className="absolute -bottom-3 -left-3 w-3 h-3 bg-yellow-200 rounded-full"></div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-6">
              {/* Small intro text */}
              <div className="text-gray-600 text-xs uppercase tracking-wider font-medium">
                Photographer
              </div>

              <h1 className="text-black">About Jaya</h1>

              <div className="space-y-4 text-gray-700 text-2xl leading-relaxed font-semibold">
                <p>
                  Hi, I'm Jaya Agnihotri. My journey in photography began in
                  college with fashion, food, and product shoots. But my heart
                  always belonged to babies—I've loved them since childhood and
                  share a special connection with them. In 2018, I followed my
                  passion and started baby and maternity photography. Since
                  then, I've captured over 500 beautiful stories, creating
                  artistic setups, styling themes, and helping moms feel
                  confident and radiant. I have done my Masters in Photography,
                  which has strengthened my vision and creativity. For me, every
                  shoot is about love, artistry, and celebrating life's most
                  precious moments.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 pt-4">
                <Link to="/gallery">
                  <button className="button cursor-pointer px-6 py-3 bg-black text-white hover:bg-gray-800 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl">
                    View Portfolio
                  </button>
                </Link>
                <Link to="/contact-us">
                  <button className="button cursor-pointer px-6 py-3 border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 rounded-lg">
                    Book Session
                  </button>
                </Link>
              </div>

              {/* Minimal stats */}
              <div className="grid grid-cols-3 gap-6 mt-10 pt-6 border-t border-gray-300">
                <div className="text-center">
                  <div className="text-lg font-light text-black mb-1">10+</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">
                    Years
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-light text-black mb-1">500+</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">
                    Sessions
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-light text-black mb-1">
                    Masters
                  </div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">
                    Degree
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ✅ Ensure no layout shifts */
        img {
          max-width: 100%;
          height: auto;
          display: block;
        }

        /* ✅ Optimize animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ✅ Prevent CLS during load */
        .w-80 {
          contain: layout style paint;
        }
      `}</style>
    </div>
  );
};

export default JayaAbout;
