import React, { useState, useEffect } from 'react';
import { Camera, Heart, Baby, Sparkles, Phone, Mail, MapPin, User, Loader2 } from 'lucide-react';
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

  // API Functions
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
        { id: 1, title: "Maternity Photography", slug: "maternity", description: "Capture the beautiful journey of motherhood with elegant and timeless portraits", icon: "heart" },
        { id: 2, title: "Baby Photography", slug: "baby", description: "Preserve precious moments of your little one's early days with gentle, loving captures", icon: "baby" },
        { id: 3, title: "Fashion Photography", slug: "fashion", description: "Express your unique style and personality through stunning fashion portraits", icon: "sparkles" }
      ]);
    } finally {
      setLoadingServices(false);
    }
  };

  const submitContactForm = async (contactData) => {
    try {
      setSubmitting(true);
      toast.loading("Sending your inquiry...", { id: 'cta-form' });

      // Prepare the data according to your API structure
      const submissionData = {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        city: contactData.city,
        serviceType: contactData.service,
        message: `Inquiry from CTA section. City: ${contactData.city}, Service: ${contactData.service}`,
        source: 'cta_section', // To identify the source
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
    
    // Prevent double submission
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
      // Error is already handled in submitContactForm
      console.error("Form submission failed:", error);
    }
  };

  // Helper function to get service icon
  const getServiceIcon = (iconType) => {
    switch (iconType) {
      case 'heart':
        return <Heart className="w-8 h-8" />;
      case 'baby':
        return <Baby className="w-8 h-8" />;
      case 'sparkles':
        return <Sparkles className="w-8 h-8" />;
      default:
        return <Camera className="w-8 h-8" />;
    }
  };

  // Helper function to get service color
  const getServiceColor = (index) => {
    const colors = [
      "from-pink-500 to-rose-500",
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-indigo-500",
      "from-green-500 to-emerald-500",
      "from-yellow-500 to-orange-500",
      "from-indigo-500 to-purple-500"
    ];
    return colors[index % colors.length];
  };

  // Create display services array from API data
  const displayServices = services.slice(0, 3).map((service, index) => ({
    title: service.title,
    description: service.description || `Professional ${service.title.toLowerCase()} services with attention to detail and artistic vision`,
    icon: getServiceIcon(service.icon || (index === 0 ? 'heart' : index === 1 ? 'baby' : 'sparkles')),
    color: getServiceColor(index)
  }));

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-rose-200 mb-6">
            <Camera className="w-5 h-5 text-rose-500" />
            <span className="text-rose-600 font-medium">Professional Photography</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Capture Life's Most
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent"> Beautiful Moments</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your precious memories into timeless art with our professional photography services
          </p>
          {loadingServices && (
            <p className="text-sm text-gray-500 flex items-center justify-center mt-2">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading our services...
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Services */}
          <div className="space-y-8">
            <div className="grid gap-6">
              {loadingServices ? (
                // Loading skeleton
                [...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg animate-pulse"
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gray-300 rounded-2xl"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-gray-300 rounded mb-3 w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                displayServices.map((service, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
                  >
                    <div className="flex items-start gap-6">
                      <div className={`p-4 rounded-2xl bg-gradient-to-r ${service.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {service.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-rose-600 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    <div className={`absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-r ${service.color} opacity-5 rounded-full group-hover:opacity-10 transition-opacity duration-500`}></div>
                  </div>
                ))
              )}
            </div>

            {/* Image placeholder */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-[4/3] shadow-2xl">
              <img 
                src="/5I4A3854.jpg"
                alt="Photography Session"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-lg font-semibold">Professional Photography</p>
                <p className="text-white/90">Creating memories that last forever</p>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="sticky top-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Get in Touch</h3>
                <p className="text-gray-600">Ready to create something beautiful together?</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder-gray-500 disabled:opacity-50"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder-gray-500 disabled:opacity-50"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder-gray-500 disabled:opacity-50"
                      required
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="city"
                      placeholder="Your City"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder-gray-500 disabled:opacity-50"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <Camera className="absolute left-4 top-6 text-gray-400 w-5 h-5" />
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    disabled={submitting || loadingServices}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-gray-700 appearance-none cursor-pointer disabled:opacity-50"
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
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    {loadingServices ? (
                      <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold py-4 px-8 rounded-xl hover:from-rose-600 hover:to-pink-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span className="flex items-center justify-center gap-2">
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>SENDING...</span>
                      </>
                    ) : (
                      <>
                        <span>BOOK YOUR SESSION</span>
                        <Camera className="w-5 h-5" />
                      </>
                    )}
                  </span>
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600 text-sm">
                  We'll respond within 24 hours to discuss your vision and schedule your session
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
