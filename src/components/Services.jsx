import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/lib/axiosinstance';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(new Set());
  const navigate = useNavigate();
  
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const swiperRef = useRef(null);

  // Function to fetch services from API
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/services/get-services');
      setServices(response.data || []);
    } catch (err) {
      setError('Failed to load services. Please try again later.');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Preload first service image for instant LCP
  useEffect(() => {
    if (services.length > 0) {
      const firstService = services.find(s => s.isActive);
      if (firstService) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = firstService.coverImage || firstService.mainImage;
        preloadLink.fetchpriority = 'high';
        document.head.appendChild(preloadLink);

        return () => {
          if (document.head.contains(preloadLink)) {
            document.head.removeChild(preloadLink);
          }
        };
      }
    }
  }, [services]);

  // ✅ GSAP Animations - Lazy-loaded & Optimized (transforms only, no CLS)
  useEffect(() => {
    if (loading || error || services.length === 0) return;

    (async () => {
      try {
        const gsapModule = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        const gsap = gsapModule.default;
        gsap.registerPlugin(ScrollTrigger);

        let ctx = gsap.context(() => {
          // ✅ Header animation - only opacity and scale (no layout shifts)
          gsap.fromTo(
            ".header-content",
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".header-content",
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );

          // ✅ Background decorations - subtle float only
          gsap.utils.toArray(".bg-decoration").forEach((decoration, index) => {
            gsap.fromTo(
              decoration,
              { opacity: 0, scale: 0.8 },
              {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "power2.out",
                delay: index * 0.2,
                scrollTrigger: {
                  trigger: ".header-content",
                  start: "top 85%",
                  toggleActions: "play none none none",
                },
              }
            );
          });
        }, containerRef);

        return () => {
          ctx.revert();
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
      } catch (error) {
        console.warn("GSAP failed to load:", error);
      }
    })();
  }, [loading, error, services]);

  // ✅ Simple hover animations (lazy-loaded)
  useEffect(() => {
    if (loading || error) return;

    (async () => {
      try {
        const gsapModule = await import("gsap");
        const gsap = gsapModule.default;

        const serviceCards = gsap.utils.toArray(".service-card");

        serviceCards.forEach((card) => {
          const img = card.querySelector(".service-img");
          const overlay = card.querySelector(".service-overlay");
          const content = card.querySelector(".service-content");
          const indicator = card.querySelector(".service-indicator");

          const hoverTl = gsap.timeline({ paused: true });
          hoverTl
            .to(img, { scale: 1.05, duration: 0.3, ease: "power2.out" }, 0)
            .to(overlay, { opacity: 1, duration: 0.3 }, 0)
            .to(content, { y: -5, duration: 0.3, ease: "power2.out" }, 0)
            .to(indicator, { scale: 1.1, duration: 0.3, ease: "power2.out" }, 0);

          card.addEventListener("mouseenter", () => hoverTl.play());
          card.addEventListener("mouseleave", () => hoverTl.reverse());
        });
      } catch (error) {
        console.warn("GSAP failed to load:", error);
      }
    })();
  }, [services, loading, error]);

  const handleServiceClick = (slug) => {
    if (slug) {
      navigate(`/service/${slug}`);
    }
  };

  const handleImageLoad = (id) => {
    setImagesLoaded(prev => new Set([...prev, id]));
  };

  // ✅ Loading state with reserved space (prevents CLS)
  if (loading) {
    return (
      <div className="py-20 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header skeleton */}
          <div className="text-center mb-16">
            <div className="h-8 w-32 bg-purple-200 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="h-12 w-96 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 w-[500px] bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>

          {/* Swiper skeleton with reserved aspect ratio */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-12">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white/90 rounded-2xl overflow-hidden"
                style={{ aspectRatio: '4/5' }}
              >
                <div className="w-full h-full bg-gray-200 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-20 bg-gradient-to-br from-red-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="text-red-600 text-lg mb-4">{error}</div>
            <button 
              onClick={fetchServices}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition-all duration-300 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (services.length === 0) {
    return (
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="text-gray-600 text-lg">No services available at the moment.</div>
          </div>
        </div>
      </div>
    );
  }

  const activeServices = services.filter(service => service.isActive);

  return (
    <div 
      ref={containerRef}
      className="py-20 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 relative overflow-hidden"
    >
      {/* ✅ Simplified background (no parallax to avoid CLS) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="bg-decoration absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-pink-300/30 to-purple-400/20 rounded-full blur-2xl"></div>
        <div className="bg-decoration absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-bl from-purple-300/25 to-blue-400/20 rounded-full blur-2xl"></div>
        <div className="bg-decoration absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-blue-300/20 to-pink-300/15 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="header-content">
            <div className="inline-block mb-4">
              <span className="text-sm font-medium text-purple-600 bg-purple-100 px-4 py-2 rounded-full uppercase tracking-wider">
                Our Services
              </span>
            </div>
            <h2 className="text-5xl text-gray-800 mb-6 leading-tight font-bold">
              Capturing Life's
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-light">
                Most Precious Moments
              </span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              With artistry and emotion, we transform fleeting moments into timeless memories
            </p>
          </div>
        </div>

        {/* ✅ Optimized Swiper with lazy loading */}
        <div className="relative">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={true}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
              bulletClass: 'custom-bullet',
              bulletActiveClass: 'custom-bullet-active'
            }}
            autoplay={{ 
              delay: 4000, 
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            lazy={{
              loadPrevNext: true,
              loadPrevNextAmount: 1,
            }}
            preloadImages={false}
            watchSlidesProgress={true}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 }
            }}
            className="services-swiper pb-16"
          >
            {activeServices.map((service, index) => (
              <SwiperSlide key={service.id}>
                <div 
                  className="service-card bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer hover:shadow-2xl border border-white/20"
                  onClick={() => handleServiceClick(service.slug)}
                  style={{ contain: 'layout style paint' }}
                >
                  {/* ✅ Image Container with fixed aspect ratio (prevents CLS) */}
                  <div 
                    className="relative overflow-hidden"
                    style={{ aspectRatio: '4/5' }}
                  >
                    {/* Skeleton loader */}
                    {!imagesLoaded.has(service.id) && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                    )}

                    <img
                      src={service.coverImage || service.mainImage || '/placeholder-service.jpg'}
                      alt={service.title}
                      width="400"
                      height="500"
                      className="service-img w-full h-full object-cover transition-transform duration-300"
                      loading={index < 3 ? "eager" : "lazy"}
                      fetchpriority={index < 2 ? "high" : "auto"}
                      decoding={index < 3 ? "sync" : "async"}
                      onLoad={() => handleImageLoad(service.id)}
                      style={{ aspectRatio: '4/5' }}
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Hover overlay */}
                    <div className="service-overlay absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 opacity-0 transition-opacity duration-300"></div>
                    
                    {/* Content overlay */}
                    <div className="service-content absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-medium mb-1 transition-colors duration-200">
                        {service.title}
                      </h3>
                      {service.subtitle && (
                        <p className="text-sm text-gray-200 opacity-90">
                          {service.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Hover indicator */}
                    <div className="service-indicator absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer group border border-purple-100 hover:bg-white hover:shadow-md">
            <svg className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          
          <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer group border border-purple-100 hover:bg-white hover:shadow-md">
            <svg className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ✅ Prevent layout shifts */
        img {
          max-width: 100%;
          height: auto;
          display: block;
        }

        .custom-bullet {
          background: rgba(168, 85, 247, 0.3) !important;
          width: 10px !important;
          height: 10px !important;
          transition: all 0.2s ease !important;
        }
        
        .custom-bullet-active {
          background: linear-gradient(45deg, #ec4899, #a855f7) !important;
          transform: scale(1.2) !important;
        }

        .services-swiper .swiper-slide {
          transition: opacity 0.3s ease;
        }

        .services-swiper .swiper-slide:not(.swiper-slide-active) {
          opacity: 0.8;
        }

        .services-swiper .swiper-slide.swiper-slide-active {
          opacity: 1;
        }

        /* ✅ Optimized background animations (GPU-accelerated) */
        @keyframes floatGentle {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: translate(10px, -10px) scale(1.05);
            opacity: 0.5;
          }
        }

        .bg-decoration {
          animation: floatGentle 8s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .bg-decoration:nth-child(1) { animation-delay: 0s; }
        .bg-decoration:nth-child(2) { animation-delay: -2s; }
        .bg-decoration:nth-child(3) { animation-delay: -4s; }

        .service-card:hover .service-overlay {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2)) !important;
          opacity: 1 !important;
        }

        /* ✅ CSS containment for better performance */
        .service-card {
          contain: layout style paint;
        }
      `}</style>
    </div>
  );
};

export default Services;
