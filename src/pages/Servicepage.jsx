import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Camera, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import axiosInstance from "../lib/axiosinstance";
import { toast } from "react-hot-toast";
import PhotographyPortfolio from "@/components/PhotographyPortfolio";
import Modal from "../Layout/modal";
import ContactForm from "../components/form";

const ServicePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f3e6fa] to-[#F0E7E5]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
            <Loader2 className="absolute inset-0 m-auto w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Loading Service</h3>
            <p className="text-sm text-gray-600">Please wait a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f3e6fa] to-[#F0E7E5]">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm mx-4">
          <div className="p-4 bg-white rounded-full shadow-md">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Service Not Found</h2>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/services')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-md text-sm"
            >
              Back to Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!serviceData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e6fa] via-white to-[#F0E7E5]">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 bg-purple-200/15 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 right-20 w-32 h-32 bg-pink-200/12 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-blue-200/8 rounded-full blur-2xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Service Badge */}
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-purple-100 mb-6">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
            <span className="text-xs font-medium text-gray-700">
              {serviceData.featured ? "Featured Service" : "Professional Service"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 tracking-tight">
            {serviceData.title.split(" ").map((word, index) => (
              <span key={index} className={index === 0 ? "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" : ""}>
                {word}{" "}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
            {serviceData.subtitle}
          </p>

          {/* Service Highlights */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-100">
              <span className="text-xs font-medium text-gray-700">Professional Quality</span>
            </div>
            {serviceData.duration && (
              <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-100">
                <span className="text-xs font-medium text-gray-700">{serviceData.duration}</span>
              </div>
            )}
            {serviceData.featured && (
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-full border border-yellow-200">
                <span className="text-xs font-medium text-orange-700">Featured</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Content (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="space-y-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium mb-3">
                    Service Overview
                  </span>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    About {serviceData.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {serviceData.description}
                  </p>
                </div>

                {/* Duration Display */}
                {serviceData.duration && (
                  <div className="flex items-center gap-3 p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                    <Camera className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700 font-medium">Session Duration: {serviceData.duration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Features List */}
            {serviceData.features && serviceData.features.length > 0 && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  What's Included
                </h3>
                <div className="grid gap-3">
                  {serviceData.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50/40 to-pink-50/40 rounded-xl border border-purple-100/50"
                    >
                      <ChevronRight className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-2">
              <Modal
                trigger={
                  <button className="w-full group bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    <span className="flex items-center justify-center gap-2">
                      <span>Book This Session</span>
                      <Camera className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                    </span>
                  </button>
                }
                title={
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📸</span>
                    <div>
                      <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Book "{serviceData.title}"
                      </span>
                      <div className="text-sm text-gray-600 font-normal">
                        {serviceData.subtitle}
                      </div>
                    </div>
                  </div>
                }
                description={`Ready to capture beautiful moments? Fill in your details below and we'll create something amazing together with our ${serviceData.title} service.`}
                className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto"
              >
                {({ close }) => (
                  <ContactForm
                    initialData={{
                      serviceType: serviceData.slug || serviceData.title?.toLowerCase().replace(/\s+/g, "-"),
                      message: `Hello! I'm interested in booking a "${serviceData.title}" session. ${serviceData.duration ? `I understand the session duration is ${serviceData.duration}.` : ''} Please let me know about availability and next steps.`
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
          </div>

          {/* Right Column - Image (1/3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white/20 backdrop-blur-sm border border-white/30">
                {serviceData.mainImage ? (
                  <img
                    src={serviceData.mainImage}
                    alt={serviceData.title}
                    className="w-full h-80 lg:h-96 object-cover"
                    onError={(e) => {
                      if (serviceData.coverImage && e.target.src !== serviceData.coverImage) {
                        e.target.src = serviceData.coverImage;
                      } else {
                        e.target.src = "/api/placeholder/400/300";
                      }
                    }}
                  />
                ) : serviceData.coverImage ? (
                  <img
                    src={serviceData.coverImage}
                    alt={serviceData.title}
                    className="w-full h-80 lg:h-96 object-cover"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/400/300";
                    }}
                  />
                ) : (
                  <div className="w-full h-80 lg:h-96 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-purple-300" />
                  </div>
                )}
                
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <PhotographyPortfolio />
      
      {/* Bottom CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 relative overflow-hidden">
          {/* Subtle Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 to-pink-50/20"></div>
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600"></div>
          
          <div className="relative z-10">
            <div className="mb-6">
              <div className="inline-flex p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full shadow-md mb-4">
                <Camera className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Ready to Capture These Moments?
            </h3>
            
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Book your {serviceData.title.toLowerCase()} session today and create memories that will last a lifetime. 
              Our professional team is ready to make your day special.
            </p>
            
            <Modal
              trigger={
                <button className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Schedule Your Session
                </button>
              }
              title={
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Schedule Your {serviceData.title}
                    </span>
                    <div className="text-sm text-gray-600 font-normal">
                      Let's plan your perfect session
                    </div>
                  </div>
                </div>
              }
              description={`Ready to book your ${serviceData.title} session? Share your details and preferences with us, and we'll get back to you within 24 hours to confirm your booking.`}
              className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto"
            >
              {({ close }) => (
                <ContactForm
                  initialData={{
                    serviceType: serviceData.slug || serviceData.title?.toLowerCase().replace(/\s+/g, "-"),
                    message: `Hello! I'd like to schedule a "${serviceData.title}" session. Please let me know your availability and any preparation details I should be aware of.`
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
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
