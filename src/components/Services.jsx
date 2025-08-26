import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
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
      navigate(`/services/${slug}`);
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
    <div className="py-20 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-blue-200/25 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-medium text-purple-600 bg-purple-100 px-4 py-2 rounded-full uppercase tracking-wider">
              Our Services
            </span>
          </div>
          <h2 className="text-5xl text-gray-800 mb-6 leading-tight font-medium">
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
            effect="coverflow"
            coverflowEffect={{
              rotate: 15,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            breakpoints={{
              640: { 
                slidesPerView: 1,
                effect: 'slide'
              },
              768: { 
                slidesPerView: 2,
                effect: 'slide'
              },
              1024: { 
                slidesPerView: 3,
                effect: 'coverflow'
              },
              1280: { 
                slidesPerView: 4,
                effect: 'coverflow'
              }
            }}
            className="services-swiper pb-16"
          >
            {activeServices.map((service) => (
              <SwiperSlide key={service.id}>
                <Card 
                  className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-pointer bg-white/80 backdrop-blur-sm hover:bg-white/90 transform hover:-translate-y-2"
                  onClick={() => handleServiceClick(service.slug)}
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <div
                      className="aspect-[4/5] bg-cover bg-center bg-gray-200 group-hover:scale-110 transition-transform duration-700"
                      style={{ 
                        backgroundImage: `url(${service.coverImage || service.mainImage || '/placeholder-service.jpg'})` 
                      }}
                    ></div>
                    
                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-500"></div>
                    
                    {/* Hover overlay for better interaction */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                    
                    {/* Content */}
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-2xl font-medium mb-2 group-hover:text-amber-200 transition-colors duration-300 leading-tight">
                        {service.title}
                      </h3>
                      {service.subtitle && (
                        <p className="text-sm text-gray-200 group-hover:text-gray-100 transition-colors duration-300 leading-relaxed">
                          {service.subtitle}
                        </p>
                      )}
                      
                      {/* Learn More Button */}
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <span className="inline-flex items-center text-xs font-medium text-pink-200 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          Learn More
                          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/* Click indicator */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    {/* Decorative corner elements */}
                    <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer group border border-gray-200 hover:bg-white hover:scale-110">
            <svg className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          
          <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer group border border-gray-200 hover:bg-white hover:scale-110">
            <svg className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Custom CSS for pagination bullets - Fixed */}
      <style jsx>{`
        .custom-bullet {
          background: rgba(168, 85, 247, 0.3) !important;
          width: 12px !important;
          height: 12px !important;
          transition: all 0.3s ease !important;
        }
        
        .custom-bullet-active {
          background: linear-gradient(45deg, #ec4899, #a855f7) !important;
          transform: scale(1.2) !important;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.5) !important;
        }

        .services-swiper .swiper-slide {
          transition: all 0.3s ease;
        }

        .services-swiper .swiper-slide:not(.swiper-slide-active) {
          opacity: 0.7;
          transform: scale(0.95);
        }

        .services-swiper .swiper-slide.swiper-slide-active {
          opacity: 1;
          transform: scale(1);
        }

        .services-swiper .swiper-pagination-bullet {
          background: rgba(168, 85, 247, 0.3) !important;
          width: 12px !important;
          height: 12px !important;
          transition: all 0.3s ease !important;
        }
        
        .services-swiper .swiper-pagination-bullet-active {
          background: linear-gradient(45deg, #ec4899, #a855f7) !important;
          transform: scale(1.2) !important;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.5) !important;
        }
      `}</style>
    </div>
  );
};

export default Services;
