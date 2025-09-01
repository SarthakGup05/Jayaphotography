import React, { useState, useEffect } from 'react';
import { Camera, Phone, Mail, MapPin, User, Loader2 } from 'lucide-react';
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axiosinstance";

const CTASection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    service: ''
  });

  const [services, setServices] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const response = await axiosInstance.get("/services/get-services");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
      // Fallback to static services if API fails
      setServices([
        { id: 1, title: "Maternity Photography", slug: "maternity" },
        { id: 2, title: "Baby Photography", slug: "baby" },
        { id: 3, title: "Fashion Photography", slug: "fashion" },
        { id: 4, title: "Family Photography", slug: "family" },
        { id: 5, title: "Theme Photography", slug: "theme" }
      ]);
    } finally {
      setLoadingServices(false);
    }
  };

  const submitContactForm = async (contactData) => {
    try {
      setSubmitting(true);
      toast.loading("Sending your inquiry...", { id: 'cta-form' });

      const submissionData = {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        city: contactData.city,
        serviceType: contactData.service,
        message: `Inquiry from CTA section. City: ${contactData.city}, Service: ${contactData.service}`,
        source: 'cta_section',
        submittedAt: new Date().toISOString()
      };

      const response = await axiosInstance.post("/enquiries/create-enquiry", submissionData);
      
      toast.success("Thank you! We'll get back to you within 24 hours.", { 
        id: 'cta-form',
        icon: '🎉',
        duration: 5000
      });

      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        service: ''
      });

      return response.data;
    } catch (error) {
      console.error("Error submitting contact form:", error);
      const errorMessage = error.response?.data?.message || "Failed to send inquiry. Please try again.";
      toast.error(errorMessage, { 
        id: 'cta-form',
        icon: '❌',
        duration: 6000
      });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (submitting) {
      toast.error("Please wait, submitting your inquiry...", { icon: '⏳' });
      return;
    }

    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter your name", { icon: '⚠️' });
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email address", { icon: '⚠️' });
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number", { icon: '⚠️' });
      return;
    }
    if (!formData.city.trim()) {
      toast.error("Please enter your city", { icon: '⚠️' });
      return;
    }
    if (!formData.service) {
      toast.error("Please select a photography service", { icon: '⚠️' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address", { icon: '⚠️' });
      return;
    }

    try {
      await submitContactForm(formData);
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-[#f3e6fa] via-white to-[#F0E7E5]">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200/8 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 right-20 w-32 h-32 bg-pink-200/6 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-100 mb-6">
            <Camera className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Professional Photography</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Ready to Capture Your 
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Special Moments?</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Let's create beautiful memories together. Fill out the form below and we'll get in touch within 24 hours.
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all disabled:opacity-50 text-gray-800 placeholder-gray-500"
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all disabled:opacity-50 text-gray-800 placeholder-gray-500"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all disabled:opacity-50 text-gray-800 placeholder-gray-500"
                  required
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  name="city"
                  placeholder="Your City"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all disabled:opacity-50 text-gray-800 placeholder-gray-500"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <Camera className="absolute left-3 top-4 w-4 h-4 text-gray-500" />
              <select
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                disabled={submitting || loadingServices}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all appearance-none cursor-pointer disabled:opacity-50 text-gray-800"
                required
              >
                <option value="">
                  {loadingServices ? "Loading services..." : "Select Photography Service"}
                </option>
                {services.map((service) => (
                  <option key={service.id} value={service.slug || service.title.toLowerCase().replace(/\s+/g, '-')}>
                    {service.title}
                  </option>
                ))}
                <option value="multiple">Multiple Services</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                {loadingServices ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                ) : (
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Book Your Session</span>
                    <Camera className="w-4 h-4" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              We'll respond within 24 hours to discuss your vision and schedule your session
            </p>
          </div>
        </div>

        {/* Simple Feature List */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Camera className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Professional Quality</h3>
            <p className="text-sm text-gray-600">High-end equipment and expert techniques</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Phone className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Quick Response</h3>
            <p className="text-sm text-gray-600">We'll get back to you within 24 hours</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Flexible Location</h3>
            <p className="text-sm text-gray-600">Studio or on-location shoots available</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
