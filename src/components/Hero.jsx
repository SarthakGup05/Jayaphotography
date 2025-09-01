import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Parallax, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/parallax";
import "swiper/css/effect-fade";
import axiosInstance from "@/lib/axiosinstance";

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axiosInstance.get("/slider/get-sliders");
      setSlides(data.data);
    } catch (err) {
      setError("Failed to load slides. Please refresh the page.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  if (loading) {
    return (
      <div className={`w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 ${
        isMobile ? 'h-[500px]' : 'h-screen'
      }`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-xl text-gray-700 font-light animate-pulse">Loading beautiful moments...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 ${
        isMobile ? 'h-[500px]' : 'h-screen'
      }`}>
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button 
            onClick={fetchSlides}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className={`w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 ${
        isMobile ? 'h-[500px]' : 'h-screen'
      }`}>
        <div className="text-gray-600 text-lg">No slides available.</div>
      </div>
    );
  }

  return (
    <div className={`hero-container relative overflow-hidden mx-auto ${
      isMobile ? 'max-w-[450px] h-[800px]' : 'w-full'
    }`}>
      {/* Enhanced background blur effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 z-[5] pointer-events-none"></div>
      
      <Swiper
        modules={[Autoplay, Pagination, Parallax, EffectFade]}
        parallax={true}
        effect="fade"
        fadeEffect={{
          crossFade: true
        }}
        speed={1500}
        autoplay={{ 
          delay: 5000, 
          disableOnInteraction: false 
        }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true
        }}
        loop
        className="hero-swiper"
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 1 },
          768: { slidesPerView: 1 },
          1024: { slidesPerView: 1 },
          1200: { slidesPerView: 1 },
        }}
      >
        <div
          slot="container-start"
          className="absolute inset-0 z-0"
          data-swiper-parallax="-20%"
        />

        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="slide-content relative mt-8 w-full h-full">
              {/* Enhanced Background Image with overlay */}
              <div
                className={`slide-bg absolute inset-0 bg-cover bg-center bg-no-repeat ${
                  isMobile ? 'h-[600px]' : 'h-[700px]'
                }`}
                style={{ 
                  backgroundImage: `url(${slide.mediaUrl})`,
                  filter: 'brightness(0.8) contrast(1.1) saturate(1.1)'
                }}
                data-swiper-parallax="-40%"
              />

              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-pink-900/20"></div>

              {/* Decorative elements */}
              <div className="absolute top-8 left-8 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-8 right-8 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>

              {/* Enhanced Content */}
              <div
                className="slide-text relative z-10 flex flex-col justify-center items-center text-center text-white px-4 h-full"
                data-swiper-parallax="-100"
              >
                {/* Slide number indicator */}
                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                  {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </div>

                <div className="hero-content-wrapper">
                  <h2
                    className="slide-title font-light mb-6 text-shadow-lg relative"
                    data-swiper-parallax="-200"
                  >
                    <span className="relative z-10 font-normal">{slide.title}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-3xl"></div>
                  </h2>
                  
                  <div className="content-divider mb-6">
                    <div className="w-20 h-[2px] bg-gradient-to-r from-pink-400 to-purple-400 mx-auto mb-2"></div>
                    <div className="w-12 h-[1px] bg-white/50 mx-auto"></div>
                  </div>
                  
                  <p
                    className="slide-subtitle font-light max-w-4xl text-shadow-md relative backdrop-blur-sm"
                    data-swiper-parallax="-300"
                  >
                    {slide.subtitle}
                  </p>

                  {/* Call to action button */}
                  {/* <div className="mt-8" data-swiper-parallax="-400">
                    <button className="group bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                      <span className="mr-2">Explore</span>
                      <svg className="w-4 h-4 inline-block group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx>{`
        .hero-container {
          width: 100%;
        }

        /* Mobile Standard Size - 450x500 */
        @media (max-width: 768px) {
          .hero-container {
            max-width: 450px;
            height: 500px !important;
            margin: 0 auto;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2),
                        0 0 0 1px rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
          }
        }

        /* Desktop and larger screens */
        @media (min-width: 769px) {
          .hero-container {
            width: 100%;
            height: 60vh;
            min-height: 400px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          }
        }

        .hero-swiper {
          width: 100%;
          height: 100%;
          border-radius: inherit;
        }

        .slide-content {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .slide-bg {
          transform: scale(1.1);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: inherit;
        }

        .hero-content-wrapper {
          transform: translateY(0);
          transition: all 0.6s ease;
        }

        .content-divider {
          opacity: 0.8;
        }

        /* Enhanced Mobile Text Styles */
        @media (max-width: 768px) {
          .slide-title {
            font-size: 1.75rem;
            line-height: 1.2;
            letter-spacing: -0.02em;
            font-weight: 700;
          }

          .slide-subtitle {
            font-size: 0.95rem;
            line-height: 1.5;
            max-width: 90%;
            font-weight: 300;
          }
        }

        /* Enhanced Desktop Text Styles */
        @media (min-width: 769px) {
          .slide-title {
            font-size: 2.5rem;
            line-height: 1.1;
            letter-spacing: -0.02em;
            font-weight: 700;
          }

          .slide-subtitle {
            font-size: 1.2rem;
            line-height: 1.6;
            font-weight: 300;
          }
        }

        /* Enhanced Text Shadow */
        .text-shadow-lg {
          text-shadow: 
            2px 2px 4px rgba(0, 0, 0, 0.9), 
            0 0 10px rgba(0, 0, 0, 0.7),
            0 0 20px rgba(0, 0, 0, 0.4);
        }

        .text-shadow-md {
          text-shadow: 
            1px 1px 3px rgba(0, 0, 0, 0.8), 
            0 0 8px rgba(0, 0, 0, 0.6),
            0 0 15px rgba(0, 0, 0, 0.3);
        }

        /* Tablet */
        @media (min-width: 769px) and (max-width: 1023px) {
          .hero-container {
            height: 65vh;
            min-height: 450px;
          }

          .slide-title {
            font-size: 2.75rem;
          }

          .slide-subtitle {
            font-size: 1.25rem;
          }
        }

        /* Laptop */
        @media (min-width: 1024px) and (max-width: 1199px) {
          .hero-container {
            height: 70vh;
            min-height: 500px;
          }

          .slide-title {
            font-size: 3.25rem;
          }

          .slide-subtitle {
            font-size: 1.35rem;
          }
        }

        /* Desktop */
        @media (min-width: 1200px) {
          .hero-container {
            height: 75vh;
            min-height: 600px;
          }

          .slide-title {
            font-size: 3.75rem;
          }

          .slide-subtitle {
            font-size: 1.45rem;
          }
        }

        /* Enhanced Mobile Pagination Styles */
        @media (max-width: 768px) {
          .hero-swiper :global(.swiper-pagination) {
            bottom: 20px;
          }

          .hero-swiper :global(.swiper-pagination-bullet) {
            background: linear-gradient(45deg, rgba(255,255,255,0.8), rgba(255,255,255,0.6));
            opacity: 0.7;
            width: 10px;
            height: 10px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(255,255,255,0.3);
            backdrop-filter: blur(10px);
          }

          .hero-swiper :global(.swiper-pagination-bullet-active) {
            background: linear-gradient(45deg, #ec4899, #a855f7);
            opacity: 1;
            width: 12px;
            height: 12px;
            transform: scale(1.3);
            box-shadow: 0 0 20px rgba(236, 72, 153, 0.6);
          }
        }

        /* Enhanced Desktop Pagination Styles */
        @media (min-width: 769px) {
          .hero-swiper :global(.swiper-pagination) {
            bottom: 25px;
          }

          .hero-swiper :global(.swiper-pagination-bullet) {
            background: linear-gradient(45deg, rgba(255,255,255,0.8), rgba(255,255,255,0.6));
            opacity: 0.7;
            width: 12px;
            height: 12px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(255,255,255,0.3);
            backdrop-filter: blur(10px);
          }

          .hero-swiper :global(.swiper-pagination-bullet-active) {
            background: linear-gradient(45deg, #ec4899, #a855f7);
            opacity: 1;
            width: 14px;
            height: 14px;
            transform: scale(1.3);
            box-shadow: 0 0 25px rgba(236, 72, 153, 0.6);
          }
        }

        /* Enhanced Hover Effects */
        .hero-swiper:hover .slide-bg {
          transform: scale(1.05);
          filter: brightness(0.9) contrast(1.2) saturate(1.2);
        }

        .hero-swiper:hover .hero-content-wrapper {
          transform: translateY(-5px);
        }

        /* Animation keyframes */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .slide-title {
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .slide-subtitle {
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .content-divider {
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
};

export default Hero;
