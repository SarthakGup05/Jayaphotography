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

  // Enhanced mobile detection with debouncing
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Debounced resize handler
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };

    checkMobile();
    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axiosInstance.get("/slider/get-sliders");
      
      // Filter only active slides and sort by order
      const activeSlides = (data.data || data || [])
        .filter(slide => slide.isActive)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      
      console.log(`📱 Loaded ${activeSlides.length} active slides for ${isMobile ? 'mobile' : 'desktop'}`);
      setSlides(activeSlides);
    } catch (err) {
      setError("Failed to load slides. Please refresh the page.");
      console.error("Hero fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // Enhanced media URL selection with fallback logic
  const getMediaUrl = (slide) => {
    if (isMobile) {
      // For mobile: prefer mobile media, fallback to desktop if not available
      if (slide.mobileMediaUrl) {
        console.log(`📱 Using mobile media for slide: ${slide.title}`);
        return slide.mobileMediaUrl;
      } else {
        console.log(`📱 Fallback to desktop media for slide: ${slide.title}`);
      }
    }
    return slide.mediaUrl;
  };

  // Enhanced poster URL with mobile optimization
  const getPosterUrl = (slide) => {
    if (slide.type === 'VIDEO' && slide.posterUrl) {
      return slide.posterUrl;
    }
    // Fallback: use first frame of video or a placeholder
    return null;
  };

  // Preload critical images for better performance
  const preloadImages = () => {
    slides.slice(0, 3).forEach(slide => { // Preload first 3 slides
      const img = new Image();
      img.src = getMediaUrl(slide);
    });
  };

  useEffect(() => {
    if (slides.length > 0) {
      preloadImages();
    }
  }, [slides, isMobile]);

  if (loading) {
    return (
      <div
        className={`w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 ${
          isMobile ? "aspect-square max-w-md mx-auto" : "h-screen"
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-xl text-gray-700 font-light animate-pulse">
            Loading beautiful moments...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`w-full flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 ${
          isMobile ? "aspect-square max-w-md mx-auto" : "h-screen"
        }`}
      >
        <div className="text-center p-8">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button
            onClick={fetchSlides}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div
        className={`w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 ${
          isMobile ? "aspect-square max-w-md mx-auto" : "h-screen"
        }`}
      >
        <div className="text-center p-8">
          <div className="text-gray-600 text-lg mb-2">No slides available</div>
          <div className="text-gray-500 text-sm">Please add some slides from the admin panel</div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-container relative overflow-hidden mx-auto">
      {/* Enhanced background blur effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 z-[5] pointer-events-none"></div>
      
      <Swiper
        modules={[Autoplay, Pagination, Parallax, EffectFade]}
        parallax={true}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        speed={1200}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          renderBullet: (index, className) => {
            return `<span class="${className} custom-bullet"></span>`;
          },
        }}
        loop={slides.length > 1}
        className="hero-swiper"
        lazy={true} // Enable lazy loading
        preloadImages={false}
        watchSlidesProgress={true}
        onSlideChange={(swiper) => {
          // Preload next slide
          const nextIndex = (swiper.activeIndex + 1) % slides.length;
          const nextSlide = slides[nextIndex];
          if (nextSlide) {
            const img = new Image();
            img.src = getMediaUrl(nextSlide);
          }
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="slide-content relative w-full h-full">
              {/* Media Content - Handle both images and videos */}
              {slide.type === 'VIDEO' ? (
                <VideoSlide 
                  slide={slide}
                  isMobile={isMobile}
                  mediaUrl={getMediaUrl(slide)}
                  posterUrl={getPosterUrl(slide)}
                />
              ) : (
                <ImageSlide 
                  slide={slide}
                  isMobile={isMobile}
                  mediaUrl={getMediaUrl(slide)}
                />
              )}

              {/* Floating decorative elements - reduced for mobile */}
              {!isMobile && (
                <>
                  <div className="absolute top-8 left-8 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute bottom-8 right-8 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
                </>
              )}

              {/* Enhanced Content Overlay */}
              <div
                className="slide-text relative z-10 flex flex-col justify-center items-center text-center text-white px-4 h-full"
                data-swiper-parallax="-100"
              >
                {/* Slide indicator - hidden on small mobile */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium hidden sm:block">
                  {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </div>

                {/* Media type indicator */}
                <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium flex items-center space-x-1">
                  {slide.type === 'VIDEO' ? (
                    <>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      <span className="hidden sm:inline">Video</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                      </svg>
                      <span className="hidden sm:inline">Image</span>
                    </>
                  )}
                </div>

                <div className="hero-content-wrapper max-w-4xl">
                  <h2
                    className="slide-title font-light mb-4 text-shadow-lg relative"
                    data-swiper-parallax="-200"
                  >
                    <span className="relative z-10 font-normal">
                      {slide.title}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-3xl"></div>
                  </h2>

                  {slide.subtitle && (
                    <>
                      <div className="content-divider mb-4">
                        <div className="w-16 h-[2px] bg-gradient-to-r from-pink-400 to-purple-400 mx-auto mb-2"></div>
                        <div className="w-8 h-[1px] bg-white/50 mx-auto"></div>
                      </div>

                      <p
                        className="slide-subtitle font-light text-shadow-md relative backdrop-blur-sm"
                        data-swiper-parallax="-300"
                      >
                        {slide.subtitle}
                      </p>
                    </>
                  )}

                  {slide.description && (
                    <p
                      className="slide-description font-light text-white/90 mt-3"
                      data-swiper-parallax="-350"
                    >
                      {slide.description}
                    </p>
                  )}

                  {/* Device-specific indicator for debugging */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded px-2 py-1 text-xs">
                      {isMobile ? 'Mobile' : 'Desktop'} • {slide.type}
                      {isMobile && slide.mobileMediaUrl && ' • Optimized'}
                    </div>
                  )}
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

        /* Mobile: Perfect 375x375 square aspect ratio */
        @media (max-width: 768px) {
          .hero-container {
            width: 100%;
            max-width: 375px;
            aspect-ratio: 1 / 1; /* Perfect square for mobile */
            margin: 0 auto;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15),
                        0 0 0 1px rgba(255, 255, 255, 0.1);
          }

          .slide-bg, .slide-video {
            aspect-ratio: 1 / 1;
          }
        }

        /* Desktop: 16:9 cinematic aspect ratio */
        @media (min-width: 769px) {
          .hero-container {
            width: 100%;
            max-width: 1920px;
            aspect-ratio: 16 / 9;
            margin: 0 auto;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          }

          .slide-bg, .slide-video {
            aspect-ratio: 16 / 9;
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

        .slide-bg, .slide-video {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          border-radius: inherit;
          transform: scale(1.05);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .slide-video {
          object-fit: cover;
        }

        /* Responsive typography */
        .slide-title {
          font-size: clamp(1.5rem, 4vw, 3.5rem);
          line-height: 1.2;
        }

        .slide-subtitle {
          font-size: clamp(0.9rem, 2vw, 1.25rem);
          line-height: 1.6;
          max-width: 90%;
          margin: 0 auto;
        }

        .slide-description {
          font-size: clamp(0.8rem, 1.5vw, 1rem);
          line-height: 1.5;
          max-width: 85%;
          margin: 0 auto;
        }

        /* Enhanced pagination styles */
        .hero-swiper .swiper-pagination {
          bottom: 20px;
        }

        .hero-swiper .custom-bullet {
          background: rgba(255, 255, 255, 0.4);
          width: 10px;
          height: 10px;
          border-radius: 50%;
          transition: all 0.3s ease;
          margin: 0 4px;
        }

        .hero-swiper .custom-bullet.swiper-pagination-bullet-active {
          background: linear-gradient(45deg, #ec4899, #8b5cf6);
          transform: scale(1.3);
          box-shadow: 0 0 10px rgba(236, 72, 153, 0.5);
        }

        /* Mobile-specific adjustments */
        @media (max-width: 480px) {
          .hero-container {
            max-width: 100%;
            border-radius: 8px;
          }

          .slide-text {
            padding: 16px;
          }

          .content-divider {
            margin-bottom: 12px;
          }

          .hero-swiper .swiper-pagination {
            bottom: 15px;
          }
        }

        /* Performance optimizations */
        .slide-bg, .slide-video {
          will-change: transform;
        }

        .hero-swiper .swiper-slide-active .slide-bg,
        .hero-swiper .swiper-slide-active .slide-video {
          transform: scale(1.0);
        }
      `}</style>
    </div>
  );
};

// Optimized image slide component
const ImageSlide = ({ slide, isMobile, mediaUrl }) => (
  <div
    className="slide-bg absolute inset-0 bg-cover bg-center bg-no-repeat swiper-lazy"
    style={{
      backgroundImage: `url(${mediaUrl})`,
      filter: "brightness(0.85) contrast(1.1) saturate(1.05)",
    }}
    data-swiper-parallax="-40%"
    loading="lazy"
  />
);

// Enhanced video slide component with better mobile support
const VideoSlide = ({ slide, isMobile, mediaUrl, posterUrl }) => (
  <>
    <video
      className="slide-video absolute inset-0 swiper-lazy"
      style={{
        filter: "brightness(0.85) contrast(1.1) saturate(1.05)",
      }}
      data-swiper-parallax="-40%"
      autoPlay
      muted
      loop
      playsInline
      poster={posterUrl}
      preload={isMobile ? "metadata" : "auto"} // Save bandwidth on mobile
      onLoadStart={() => console.log(`🎥 Loading video: ${slide.title}`)}
      onCanPlay={() => console.log(`✅ Video ready: ${slide.title}`)}
      onError={(e) => console.error(`❌ Video error: ${slide.title}`, e)}
    >
      <source src={mediaUrl} type="video/mp4" />
      <source src={mediaUrl} type="video/webm" />
      
      {/* Fallback to poster if video fails */}
      {posterUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${posterUrl})`,
            filter: "brightness(0.85) contrast(1.1) saturate(1.05)",
          }}
        />
      )}
    </video>
    
    {/* Enhanced gradient overlay for better text readability */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30"></div>
  </>
);

export default Hero;
