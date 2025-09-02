import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/lib/axiosinstance';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Refs for GSAP animations
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

  // Fetch services when component mounts
  useEffect(() => {
    fetchServices();
  }, []);

  // GSAP Liquid & Wave Animations (Background and Headings Only)
  useEffect(() => {
    if (loading || error || services.length === 0) return;

    let ctx = gsap.context(() => {
      // Set initial states for header and background only
      gsap.set(['.header-content', '.bg-decoration', '.wave-element'], {
        autoAlpha: 0
      });

      // Create wave elements for header
      const headerContainer = document.querySelector('.header-content');
      if (headerContainer) {
        // Add wave layers
        for (let i = 0; i < 3; i++) {
          const wave = document.createElement('div');
          wave.className = `wave-element wave-${i}`;
          wave.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(236, 72, 153, ${0.1 - i * 0.03}), transparent);
            z-index: -1;
            transform: skewX(-10deg);
          `;
          headerContainer.appendChild(wave);
        }
      }

      // Liquid wave motion for header
      gsap.fromTo('.header-content', 
        {
          autoAlpha: 0,
          y: 120,
          scaleX: 0.2,
          skewX: 25,
          rotationY: 45,
          transformOrigin: "center bottom"
        },
        {
          autoAlpha: 1,
          y: 0,
          scaleX: 1,
          skewX: 0,
          rotationY: 0,
          duration: 2.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.header-content',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Wave elements animation
      gsap.utils.toArray('.wave-element').forEach((wave, index) => {
        gsap.fromTo(wave,
          {
            autoAlpha: 0,
            x: -200,
            scaleX: 0
          },
          {
            autoAlpha: 1,
            x: 0,
            scaleX: 1,
            duration: 1.5,
            ease: 'power3.out',
            delay: 0.3 + index * 0.2,
            scrollTrigger: {
              trigger: '.header-content',
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );

        // Continuous wave motion
        gsap.to(wave, {
          x: 200,
          duration: 4 + index,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.5
        });
      });

      // Background liquid blobs animation
      gsap.fromTo('.bg-decoration',
        {
          autoAlpha: 0,
          scale: 0.1,
          rotation: -180,
          filter: "blur(20px)"
        },
        {
          autoAlpha: 1,
          scale: 1,
          rotation: 0,
          filter: "blur(8px)",
          duration: 2,
          ease: 'elastic.out(1, 0.3)',
          stagger: 0.4,
          scrollTrigger: {
            trigger: '.header-content',
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Parallax liquid background (smooth movement)
      gsap.to('.parallax-bg', {
        yPercent: -40,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2
        }
      });

    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [loading, error, services]);

  // Simple hover animations for service cards (no scroll animations)
  useEffect(() => {
    if (loading || error) return;

    const serviceCards = gsap.utils.toArray('.service-card');
    serviceCards.forEach(card => {
      const img = card.querySelector('.service-img');
      const overlay = card.querySelector('.service-overlay');
      const content = card.querySelector('.service-content');
      const indicator = card.querySelector('.service-indicator');

      const hoverTl = gsap.timeline({ paused: true });
      hoverTl
        .to(img, { 
          scale: 1.05,
          duration: 0.3, 
          ease: "power2.out" 
        })
        .to(overlay, { 
          autoAlpha: 1,
          duration: 0.3 
        }, 0)
        .to(content, { 
          y: -5,
          duration: 0.3,
          ease: "power2.out" 
        }, 0)
        .to(indicator, { 
          scale: 1.1,
          rotation: 5,
          duration: 0.3, 
          ease: "power2.out" 
        }, 0);

      card.addEventListener('mouseenter', () => hoverTl.play());
      card.addEventListener('mouseleave', () => hoverTl.reverse());
    });
  }, [services, loading, error]);

  // Handle card click
  const handleServiceClick = (slug) => {
    if (slug) {
      navigate(`/service/${slug}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-20 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-xl text-gray-700 font-light animate-pulse">Loading beautiful services...</div>
            </div>
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
      {/* Animated Liquid Parallax Background */}
      <div className="parallax-bg absolute inset-0 pointer-events-none">
        <div className="bg-decoration absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-pink-300/30 to-purple-400/20 rounded-full"></div>
        <div className="bg-decoration absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-bl from-purple-300/25 to-blue-400/20 rounded-full"></div>
        <div className="bg-decoration absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-blue-300/20 to-pink-300/15 rounded-full"></div>
        <div className="bg-decoration absolute bottom-1/3 right-1/3 w-28 h-28 bg-gradient-to-tl from-pink-200/20 to-purple-300/15 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Animated Liquid Wave Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="header-content relative">
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

        {/* Regular Swiper (No Scroll Animations) */}
        <div className="relative">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
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
            effect="slide"
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
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={service.coverImage || service.mainImage || '/placeholder-service.jpg'}
                      alt={service.title}
                      className="service-img w-full h-full object-cover transition-all duration-300"
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Hover overlay */}
                    <div className="service-overlay absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 opacity-0 transition-all duration-300"></div>
                    
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

                    {/* Simple hover indicator */}
                    <div className="service-indicator absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200">
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

          {/* Simple Navigation Buttons */}
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

      {/* CSS for liquid background and header animations only */}
      <style jsx>{`
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
          transition: all 0.3s ease;
        }

        .services-swiper .swiper-slide:not(.swiper-slide-active) {
          opacity: 0.8;
        }

        .services-swiper .swiper-slide.swiper-slide-active {
          opacity: 1;
        }

        @keyframes liquidFloat {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1);
            filter: blur(8px) hue-rotate(0deg);
          }
          33% { 
            transform: translateY(-15px) rotate(5deg) scale(1.1);
            filter: blur(10px) hue-rotate(30deg);
          }
          66% { 
            transform: translateY(8px) rotate(-3deg) scale(0.95);
            filter: blur(6px) hue-rotate(-20deg);
          }
        }

        @keyframes liquidPulse {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            opacity: 0.3;
          }
          50% { 
            transform: scale(1.2) rotate(180deg);
            opacity: 0.7;
          }
        }

        .bg-decoration {
          animation: liquidFloat 12s ease-in-out infinite;
        }

        .bg-decoration:nth-child(1) {
          animation-delay: 0s;
        }

        .bg-decoration:nth-child(2) {
          animation-delay: -3s;
        }

        .bg-decoration:nth-child(3) {
          animation-delay: -6s;
        }

        .bg-decoration:nth-child(4) {
          animation-delay: -9s;
        }

        .wave-element {
          animation: liquidPulse 8s ease-in-out infinite;
        }

        .service-card:hover .service-overlay {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2)) !important;
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default Services;
