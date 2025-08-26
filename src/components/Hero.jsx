import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Parallax } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/parallax";
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
      <div className={`w-full flex items-center justify-center bg-gray-50 ${
        isMobile ? 'h-[500px]' : 'h-screen'
      }`}>
        <div className="animate-pulse text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full flex items-center justify-center bg-gray-50 ${
        isMobile ? 'h-[500px]' : 'h-screen'
      }`}>
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className={`w-full flex items-center justify-center bg-gray-50 ${
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
      <Swiper
        modules={[Autoplay, Pagination, Parallax]}
        parallax={true}
        speed={1200}
        autoplay={{ 
          delay: 4000, 
          disableOnInteraction: false 
        }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true
        }}
        loop
        className="hero-swiper"
        breakpoints={{
          // Mobile (small)
          320: {
            slidesPerView: 1,
          },
          // Mobile (large)
          480: {
            slidesPerView: 1,
          },
          // Tablet
          768: {
            slidesPerView: 1,
          },
          // Laptop
          1024: {
            slidesPerView: 1,
          },
          // Desktop
          1200: {
            slidesPerView: 1,
          },
        }}
      >
        <div
          slot="container-start"
          className="absolute inset-0 z-0"
          data-swiper-parallax="-20%"
        />

        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="slide-content relative">
              {/* Background Image */}
              <div
                className={`slide-bg absolute inset-0 bg-cover bg-center bg-no-repeat ${
                  isMobile ? 'h-[500px]' : 'h-[820px]'
                }`}
                style={{ backgroundImage: `url(${slide.mediaUrl})` }}
                data-swiper-parallax="-40%"
              />

              {/* Content */}
              <div
                className="slide-text relative z-10 flex flex-col justify-center items-center text-center text-white px-4 h-full"
                data-swiper-parallax="-100"
              >
                <h2
                  className="slide-title font-bold mb-4 text-shadow-lg"
                  data-swiper-parallax="-200"
                >
                  {slide.title}
                </h2>
                <p
                  className="slide-subtitle font-light max-w-4xl text-shadow-md"
                  data-swiper-parallax="-300"
                >
                  {slide.subtitle}
                </p>
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
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          }
        }

        /* Desktop and larger screens */
        @media (min-width: 769px) {
          .hero-container {
            width: 100%;
            height: 60vh;
            min-height: 400px;
          }
        }

        .hero-swiper {
          width: 100%;
          height: 100%;
        }

        .slide-content {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .slide-bg {
          transform: scale(1.1);
          transition: transform 0.6s ease;
        }

        /* Mobile Text Styles */
        @media (max-width: 768px) {
          .slide-title {
            font-size: 1.5rem;
            line-height: 1.2;
          }

          .slide-subtitle {
            font-size: 0.9rem;
            line-height: 1.4;
            max-width: 90%;
          }
        }

        /* Desktop Text Styles */
        @media (min-width: 769px) {
          .slide-title {
            font-size: 2rem;
            line-height: 1.2;
          }

          .slide-subtitle {
            font-size: 1.1rem;
            line-height: 1.4;
          }
        }

        /* Text Shadow for better readability */
        .text-shadow-lg {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8), 
                       0 0 8px rgba(0, 0, 0, 0.6);
        }

        .text-shadow-md {
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7), 
                       0 0 6px rgba(0, 0, 0, 0.5);
        }

        /* Tablet */
        @media (min-width: 769px) and (max-width: 1023px) {
          .hero-container {
            height: 65vh;
            min-height: 450px;
          }

          .slide-title {
            font-size: 2.5rem;
          }

          .slide-subtitle {
            font-size: 1.2rem;
          }
        }

        /* Laptop */
        @media (min-width: 1024px) and (max-width: 1199px) {
          .hero-container {
            height: 70vh;
            min-height: 500px;
          }

          .slide-title {
            font-size: 3rem;
          }

          .slide-subtitle {
            font-size: 1.3rem;
          }
        }

        /* Desktop */
        @media (min-width: 1200px) {
          .hero-container {
            height: 75vh;
            min-height: 600px;
          }

          .slide-title {
            font-size: 3.5rem;
          }

          .slide-subtitle {
            font-size: 1.4rem;
          }
        }

        /* Mobile Pagination Styles */
        @media (max-width: 768px) {
          .hero-swiper :global(.swiper-pagination) {
            bottom: 15px;
          }

          .hero-swiper :global(.swiper-pagination-bullet) {
            background: white;
            opacity: 0.7;
            width: 8px;
            height: 8px;
            transition: all 0.3s ease;
          }

          .hero-swiper :global(.swiper-pagination-bullet-active) {
            background: #f7b777;
            opacity: 1;
            width: 10px;
            height: 10px;
            transform: scale(1.2);
          }
        }

        /* Desktop Pagination Styles */
        @media (min-width: 769px) {
          .hero-swiper :global(.swiper-pagination) {
            bottom: 20px;
          }

          .hero-swiper :global(.swiper-pagination-bullet) {
            background: white;
            opacity: 0.7;
            width: 10px;
            height: 10px;
            transition: all 0.3s ease;
          }

          .hero-swiper :global(.swiper-pagination-bullet-active) {
            background: #f7b777;
            opacity: 1;
            width: 12px;
            height: 12px;
            transform: scale(1.2);
          }
        }

        /* Hover Effects */
        .hero-swiper:hover .slide-bg {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default Hero;
