import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Camera, ChevronRight, Heart, Star, Loader2, AlertCircle } from "lucide-react";
import axiosInstance from "../lib/axiosinstance";
import { toast } from "react-hot-toast";
import PhotographyPortfolio from "@/components/PhotographyPortfolio";
import Modal from "../Layout/modal";
import ContactForm from "../components/form";

const ServicePage = () => {
  const { slug } = useParams();
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
        
        const response = await axiosInstance.get(`/services/slug/${slug}`);
        setServiceData(response.data);
        
        document.title = `${response.data.title} - ${response.data.subtitle}`;
        
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

  /* ─────────────────────────────────────────────────────────
     Custom booking handler for the service
  ───────────────────────────────────────────────────────── */
  const handleBookingSubmit = async (formData) => {
    try {
      const bookingData = {
        ...formData,
        serviceId: serviceData.id,
        serviceTitle: serviceData.title,
        serviceSlug: serviceData.slug,
        bookingType: "service_booking"
      };

      const response = await axiosInstance.post("/enquiries/create-enquiry", bookingData);
      
      toast.success(`Booking request for "${serviceData.title}" sent successfully! We'll contact you soon.`);
      
      console.log("Service booking response:", response.data);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to submit booking. Please try again.";
      toast.error(errorMessage);
      console.error("Service booking error:", error);
    }
  };

  // Loading state - Updated with purple background and white text
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#9575CD' }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <p className="text-white font-light">Loading service details...</p>
        </div>
      </div>
    );
  }

  // Error state - Updated with purple background and white text
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#9575CD' }}>
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-300" />
          <h2 className="text-2xl font-light text-white">Service Not Found</h2>
          <p className="text-white/80 font-light">{error}</p>
          <button
            onClick={() => navigate('/services')}
            className="bg-white text-purple-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  if (!serviceData) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#9575CD' }}>
      {/* Hero Section - Remains unchanged */}
      <section className="relative flex flex-col items-center justify-center py-16 px-4 overflow-hidden mt-16" style={{ backgroundColor: '#FAF0DC' }}>
        <div className="absolute inset-0 bg-white/30 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <span className="inline-flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full border border-gray-300 text-xs text-black font-light tracking-wide">
            {serviceData.featured ? "Featured Service" : "Professional Service"}
          </span>
          <h1
            className="text-4xl md:text-5xl font-thin text-black tracking-tight text-center"
            style={{ fontFamily: "Raleway, sans-serif" }}
          >
            {serviceData.title.split(" ")[0]}{" "}
            <span className="font-thin text-gray-800">
              {serviceData.title.split(" ").slice(1).join(" ")}
            </span>
          </h1>
          <p className="text-base md:text-lg font-light text-gray-800 max-w-2xl text-center">
            {serviceData.subtitle}
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            <span className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full text-xs text-gray-700">
              <Heart className="w-3 h-3 text-red-400" />
              Professional Service
            </span>
            {serviceData.featured && (
              <span className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full text-xs text-gray-700">
                <Star className="w-3 h-3 text-yellow-400" />
                Featured Service
              </span>
            )}
            <span className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full text-xs text-gray-700">
              <Camera className="w-3 h-3 text-gray-600" />
              {serviceData.duration || "Professional Studio"}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Section - Updated with white text for contrast */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Description */}
          <div className="space-y-6">
            <div className="space-y-4">
              <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-xs text-white font-light border border-white/30">
                {serviceData.subtitle}
              </span>
              
              <h2
                className="text-3xl md:text-4xl font-thin text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {serviceData.title}
              </h2>
              
              <p className="text-base md:text-lg font-light text-white/90 leading-relaxed">
                {serviceData.description}
              </p>

              {/* Duration Display */}
              {serviceData.duration && (
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Camera className="w-4 h-4" />
                  <span>Session Duration: {serviceData.duration}</span>
                </div>
              )}
            </div>

            {/* Features List */}
            {serviceData.features && serviceData.features.length > 0 && (
              <div>
                <h3 className="text-xl font-light text-white mb-4">
                  What's Included
                </h3>
                <ul className="space-y-3">
                  {serviceData.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-white/90 font-light"
                    >
                      <ChevronRight className="w-4 h-4 text-white/70 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Button with Modal - Updated with white background */}
            <Modal
              trigger={
                <button className="group bg-white text-purple-700 font-medium px-8 py-4 rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <span className="flex items-center gap-2">
                    <span>Book This Session</span>
                    <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </span>
                </button>
              }
              title={
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📸</span>
                  <div>
                    <span className="text-xl font-semibold">Book "{serviceData.title}"</span>
                    <div className="text-sm text-muted-foreground font-normal">
                      {serviceData.subtitle}
                    </div>
                  </div>
                </div>
              }
              description={`Ready to capture beautiful moments? Fill in your details below and we'll create something amazing together with our ${serviceData.title} service.`}
              className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
            >
              {({ close }) => (
                <ContactForm
                  initialData={{
                    serviceType: serviceData.slug || serviceData.title?.toLowerCase().replace(/\s+/g, "-"),
                    message: `Hi! I'm interested in booking a "${serviceData.title}" session. ${serviceData.duration ? `I understand the session duration is ${serviceData.duration}.` : ''} Please let me know about availability and next steps.`
                  }}
                  submitButtonText={`Book ${serviceData.title}`}
                  onSubmit={async (formData) => {
                    await handleBookingSubmit(formData);
                    close();
                  }}
                  className="max-w-none"
                />
              )}
            </Modal>
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
                    if (serviceData.coverImage && e.target.src !== serviceData.coverImage) {
                      e.target.src = serviceData.coverImage;
                    } else {
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
                <div className="w-full h-96 md:h-[500px] bg-white/50 flex items-center justify-center">
                  <Camera className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating accent elements - Updated with white/transparent colors */}
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/20 rounded-full opacity-60" />
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-white/10 rounded-full opacity-40" />
          </div>
        </div>
      </section>
      
      <PhotographyPortfolio />
      
      {/* Bottom CTA Section with Modal - Updated with semi-transparent background and white text */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <h3
            className="text-2xl md:text-3xl font-thin text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to Capture These Precious Moments?
          </h3>
          <p className="text-base font-light text-white/90 mb-8 max-w-2xl mx-auto">
            Book your {serviceData.title.toLowerCase()} session today and create memories that will last a lifetime. 
            Our professional team is ready to make your special day unforgettable.
          </p>
          
          {/* Bottom CTA Button with Modal - Updated with white background */}
          <Modal
            trigger={
              <button className="bg-white text-purple-700 font-medium px-10 py-4 rounded-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                Schedule Your Session
              </button>
            }
            title={
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <span className="text-xl font-semibold">Schedule Your {serviceData.title}</span>
                  <div className="text-sm text-muted-foreground font-normal">
                    Let's plan your perfect session
                  </div>
                </div>
              </div>
            }
            description={`Ready to book your ${serviceData.title} session? Share your details and preferences with us, and we'll get back to you within 24 hours to confirm your booking.`}
            className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
          >
            {({ close }) => (
              <ContactForm
                initialData={{
                  serviceType: serviceData.slug || serviceData.title?.toLowerCase().replace(/\s+/g, "-"),
                  message: `Hi! I'd like to schedule a "${serviceData.title}" session. Please let me know your availability and any preparation details I should be aware of.`
                }}
                submitButtonText={`Schedule ${serviceData.title} Session`}
                onSubmit={async (formData) => {
                  await handleBookingSubmit(formData);
                  close();
                }}
                className="max-w-none"
              />
            )}
          </Modal>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
