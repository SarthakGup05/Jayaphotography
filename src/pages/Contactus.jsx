import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Camera, 
  Send, 
  User, 
  MessageCircle,
  Instagram,
  Facebook,
  Loader2
} from 'lucide-react';
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axiosinstance";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    message: ''
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
      
      let servicesData = [];
      if (Array.isArray(response.data)) {
        servicesData = response.data.filter(service => service.isActive);
      } else if (response.data.services) {
        servicesData = response.data.services.filter(service => service.isActive);
      }
      
      setServices(servicesData);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
      setServices([
        { id: 1, name: "Maternity Photography", title: "Maternity Photography" },
        { id: 2, name: "Newborn Photography", title: "Newborn Photography" },
        { id: 3, name: "Baby Photography", title: "Baby Photography" },
        { id: 4, name: "Fashion Photography", title: "Fashion Photography" },
        { id: 5, name: "Family Photography", title: "Family Photography" },
        { id: 6, name: "Theme Photography", title: "Theme Photography" },
        { id: 7, name: "Other", title: "Other" }
      ]);
    } finally {
      setLoadingServices(false);
    }
  };

  const submitContactForm = async (contactData) => {
    try {
      setSubmitting(true);
      toast.loading("Sending your message...", { id: 'contact-form' });

      const submissionData = {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        serviceType: contactData.serviceType,
        message: contactData.message,
        source: 'contact_form',
        submittedAt: new Date().toISOString()
      };

      const response = await axiosInstance.post("/enquiries/create-enquiry", submissionData);
      
      toast.success("Thank you! We'll get back to you within 24 hours.", { 
        id: 'contact-form',
        icon: '🎉',
        duration: 5000
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceType: '',
        message: ''
      });

      return response.data;
    } catch (error) {
      console.error("Error submitting contact form:", error);
      const errorMessage = error.response?.data?.message || "Failed to send message. Please try again.";
      toast.error(errorMessage, { 
        id: 'contact-form',
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
      toast.error("Please wait, submitting your message...", { icon: '⏳' });
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
    if (!formData.serviceType) {
      toast.error("Please select a service type", { icon: '⚠️' });
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Please enter your message", { icon: '⚠️' });
      return;
    }

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

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Phone",
      details: ["+91 9335391320"],
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email",
      details: ["jayaagnihotriphotography@gmail.com"],
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Location",
      details: ["Vishal Khand 2, Gomti Nagar", "Lucknow, Uttar Pradesh"],
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Working Hours",
      details: ["Mon - Fri: 10:00 AM - 8:00 PM", "Sat - Sun: 10:00 AM - 6:00 PM"],
    }
  ];

  const socialLinks = [
    { 
      icon: <Instagram className="w-5 h-5" />, 
      name: "Instagram", 
      url: "https://www.instagram.com/jayaagnihotriphotography/" 
    },
    { 
      icon: <Facebook className="w-5 h-5" />, 
      name: "Facebook", 
      url: "https://facebook.com/jayaagnihotriphotography" 
    },
  ];

  // Animation refs
  const headerRef = useRef();
  const formRef = useRef();
  const infoRef = useRef();
  const socialsRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    gsap.fromTo(headerRef.current, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
    gsap.fromTo(formRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power2.out" });
    gsap.fromTo(infoRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8, delay: 0.4, ease: "power2.out" });
    gsap.fromTo(socialsRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8, delay: 0.6, ease: "power2.out" });
    gsap.fromTo(mapRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.8, ease: "power2.out" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3e6fa] via-white to-[#F0E7E5]">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 right-20 w-32 h-32 bg-pink-200/8 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-blue-200/6 rounded-full blur-2xl"></div>
      </div>

      {/* Header Section */}
      <div ref={headerRef} className="relative pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-100 mb-6">
            <Camera className="w-4 h-4 text-purple-600" />
            <span className="text-gray-700 font-medium text-sm">Get In Touch</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Contact 
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Us</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Ready to capture your special moments? Let's discuss your vision and create something beautiful together.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Contact Form (2/3) */}
          <div ref={formRef} className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Send us a Message</h2>
                <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all placeholder-gray-500 disabled:opacity-50 text-gray-800"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all placeholder-gray-500 disabled:opacity-50 text-gray-800"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all placeholder-gray-500 disabled:opacity-50 text-gray-800"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Camera className="absolute left-3 top-4 text-gray-500 w-4 h-4" />
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      disabled={submitting || loadingServices}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all text-gray-800 appearance-none cursor-pointer disabled:opacity-50"
                      required
                    >
                      <option value="">
                        {loadingServices ? "Loading services..." : "Select Service Type"}
                      </option>
                      {services.map((service) => (
                        <option key={service.id} value={service.name || service.title}>
                          {service.name || service.title}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      {loadingServices ? (
                        <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                      ) : (
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <MessageCircle className="absolute left-3 top-4 text-gray-500 w-4 h-4" />
                  <textarea
                    name="message"
                    placeholder="Tell us about your project, preferred dates, location, and any special requirements..."
                    value={formData.message}
                    onChange={handleInputChange}
                    disabled={submitting}
                    rows={5}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all placeholder-gray-500 resize-none disabled:opacity-50 text-gray-800"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span className="flex items-center justify-center gap-2">
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Contact Info (1/3) */}
          <div ref={infoRef} className="space-y-6">
            {/* Contact Details */}
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 shadow-sm">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                      {item.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 text-sm mb-0.5">{detail}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media Links */}
            <div ref={socialsRef} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-md">
              <h3 className="font-semibold text-gray-800 mb-3">Follow Us</h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl text-purple-600 hover:from-purple-200 hover:to-pink-200 transform hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md"
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Section */}
        <div ref={mapRef} className="mt-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Visit Our Studio</h2>
              <p className="text-gray-600">Located in Vishal Khand 2, Gomti Nagar, Lucknow. Our studio is equipped with state-of-the-art facilities.</p>
            </div>
            
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.2441234567!2d80.9862!3d26.8467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd991f32b16b%3A0x93ccba8909978be7!2sVishal%20Khand%202%2C%20Gomti%20Nagar%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              ></iframe>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-md">
                <div className="flex items-center gap-2 text-gray-800">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  <div>
                    <span className="font-semibold block text-sm">Jaya Agnihotri Photography</span>
                    <span className="text-xs text-gray-600">Vishal Khand 2, Gomti Nagar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
