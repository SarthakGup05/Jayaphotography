import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/lib/axiosinstance';

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

  // Handle card click to navigate to service detail page
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
              <div className="text-xl text-gray-700 font-light">Loading beautiful services...</div>
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
    <div className="py-20 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 relative">
      {/* Minimal background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-24 h-24 bg-pink-200/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-200/15 rounded-full blur-xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
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

        {/* Swiper Slider */}
        <div className="relative">
          <Swiper
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
              delay: 3000, 
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            effect="slide"
            breakpoints={{
              640: { 
                slidesPerView: 1
              },
              768: { 
                slidesPerView: 2
              },
              1024: { 
                slidesPerView: 3
              },
              1280: { 
                slidesPerView: 4
              }
            }}
            className="services-swiper pb-16"
          >
            {activeServices.map((service) => (
              <SwiperSlide key={service.id}>
                <div 
                  className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer hover:shadow-lg border border-white/20"
                  onClick={() => handleServiceClick(service.slug)}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={service.coverImage || service.mainImage || '/placeholder-service.jpg'}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    
                    {/* Minimal hover overlay */}
                    <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-all duration-300"></div>
                    
                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-medium mb-1 group-hover:text-pink-200 transition-colors duration-200">
                        {service.title}
                      </h3>
                      {service.subtitle && (
                        <p className="text-sm text-gray-200 opacity-90">
                          {service.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Simple hover indicator */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
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

      {/* Minimal CSS styling */}
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

        .services-swiper .swiper-pagination-bullet {
          background: rgba(168, 85, 247, 0.3) !important;
          width: 10px !important;
          height: 10px !important;
          transition: all 0.2s ease !important;
        }
        
        .services-swiper .swiper-pagination-bullet-active {
          background: linear-gradient(45deg, #ec4899, #a855f7) !important;
          transform: scale(1.2) !important;
        }
      `}</style>
    </div>
  );
};

export default Services;
