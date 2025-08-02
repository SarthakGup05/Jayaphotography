import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Camera, ChevronRight, Heart, Star, Loader2, AlertCircle } from "lucide-react";
import axiosInstance from "../lib/axiosinstance"; // Your axios instance
import { toast } from "react-hot-toast";
import PhotographyPortfolio from "@/components/PhotographyPortfolio";

const ServicePage = () => {
  const { slug } = useParams(); // Get service slug from URL params
  const navigate = useNavigate();
  
  // State management
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch service data on component mount
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch service by slug from your API
        const response = await axiosInstance.get(`/services/slug/${slug}`);
        setServiceData(response.data);
        
        // Update document title with service name
        document.title = `${response.data.title} - ${response.data.subtitle}`;
        
        // Update meta description if available
        if (response.data.metaDescription) {
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute('content', response.data.metaDescription);
          }
        }
        
      } catch (error) {
        console.error("Error fetching service:", error);
        setError(error.response?.data?.error || "Failed to load service");
        
        if (error.response?.status === 404) {
          toast.error("Service not found");
          // Redirect to services page after 3 seconds
          setTimeout(() => navigate('/services'), 3000);
        } else {
          toast.error("Failed to load service details");
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchServiceData();
    }
  }, [slug, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          <p className="text-gray-600 font-light">Loading service details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h2 className="text-2xl font-light text-gray-800">Service Not Found</h2>
          <p className="text-gray-600 font-light">{error}</p>
          <button
            onClick={() => navigate('/services')}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-light px-6 py-3 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  // If no service data, return null
  if (!serviceData) {
    return null;
  }

  // Handle contact/booking action
  const handleBookSession = () => {
    // You can integrate with your booking system or contact form
    // For now, we'll navigate to a contact page or show a modal
    navigate('/contact', { 
      state: { 
        service: serviceData.title,
        prefilledMessage: `I'm interested in booking a ${serviceData.title} session.`
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-r from-pink-100 via-rose-50 to-orange-50 overflow-hidden mt-16">
        <div className="absolute inset-0 bg-white/40 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <span className="inline-flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full border border-pink-200/50 text-xs text-pink-600 font-light tracking-wide">
            {serviceData.featured ? "Featured Service" : "Professional Service"}
          </span>
          <h1
            className="text-4xl md:text-5xl font-thin text-gray-800 tracking-tight text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {serviceData.title.split(" ")[0]}{" "}
            <span className="font-thin text-pink-500">
              {serviceData.title.split(" ").slice(1).join(" ")}
            </span>
          </h1>
          <p className="text-base md:text-lg font-light text-gray-600 max-w-2xl text-center">
            {serviceData.subtitle}
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            <span className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full text-xs text-gray-500">
              <Heart className="w-3 h-3 text-pink-400" />
              Professional Service
            </span>
            {serviceData.featured && (
              <span className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full text-xs text-gray-500">
                <Star className="w-3 h-3 text-yellow-400" />
                Featured Service
              </span>
            )}
            <span className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full text-xs text-gray-500">
              <Camera className="w-3 h-3 text-blue-400" />
              {serviceData.duration || "Professional Studio"}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Description */}
          <div className="space-y-6">
            <div className="space-y-4">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full text-xs text-gray-700 font-light">
                {serviceData.subtitle}
              </span>
              
              <h2
                className="text-3xl md:text-4xl font-thin text-gray-800"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {serviceData.title}
              </h2>
              
              <p className="text-base md:text-lg font-light text-gray-600 leading-relaxed">
                {serviceData.description}
              </p>

              {/* Duration Display */}
              {serviceData.duration && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Camera className="w-4 h-4" />
                  <span>Session Duration: {serviceData.duration}</span>
                </div>
              )}
            </div>

            {/* Features List */}
            {serviceData.features && serviceData.features.length > 0 && (
              <div>
                <h3 className="text-xl font-light text-gray-800 mb-4">
                  What's Included
                </h3>
                <ul className="space-y-3">
                  {serviceData.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-gray-600 font-light"
                    >
                      <ChevronRight className="w-4 h-4 text-pink-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Button */}
            <button 
              onClick={handleBookSession}
              className="group bg-gradient-to-r from-pink-500 to-rose-500 text-white font-light px-8 py-4 rounded-xl hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center gap-2">
                <span>Book This Session</span>
                <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </span>
            </button>
          </div>

          {/* Right Side - Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              {serviceData.mainImage ? (
                <img
                  src={serviceData.mainImage}
                  alt={serviceData.title}
                  className="w-full h-96 md:h-[500px] object-cover"
                  onError={(e) => {
                    // Fallback to cover image if main image fails
                    if (serviceData.coverImage && e.target.src !== serviceData.coverImage) {
                      e.target.src = serviceData.coverImage;
                    } else {
                      // Fallback to placeholder
                      e.target.src = "/api/placeholder/600/400";
                    }
                  }}
                />
              ) : serviceData.coverImage ? (
                <img
                  src={serviceData.coverImage}
                  alt={serviceData.title}
                  className="w-full h-96 md:h-[500px] object-cover"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/600/400";
                  }}
                />
              ) : (
                <div className="w-full h-96 md:h-[500px] bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                  <Camera className="w-16 h-16 text-pink-300" />
                </div>
              )}
              {/* Overlay for better contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating accent elements */}
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-pink-200 rounded-full opacity-60" />
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-rose-200 rounded-full opacity-40" />
          </div>
        </div>
      </section>
      <PhotographyPortfolio />
      {/* Bottom CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center py-12 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl">
          <h3
            className="text-2xl md:text-3xl font-thin text-gray-800 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to Capture These Precious Moments?
          </h3>
          <p className="text-base font-light text-gray-600 mb-8 max-w-2xl mx-auto">
            Book your {serviceData.title.toLowerCase()} session today and create memories that will last a lifetime. 
            Our professional team is ready to make your special day unforgettable.
          </p>
          <button 
            onClick={handleBookSession}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-light px-10 py-4 rounded-xl hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Schedule Your Session
          </button>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
