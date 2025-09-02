import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  Loader2,
  CheckCircle
} from 'lucide-react';
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axiosinstance";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

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

  // Animation refs
  const containerRef = useRef();

  // Minimal GSAP Animations
  useEffect(() => {
    let ctx = gsap.context(() => {
      // Set initial states
      gsap.set(['.animate-section'], {
        autoAlpha: 0,
        y: 30
      });

      // Simple fade-up animations for each section
      gsap.utils.toArray('.animate-section').forEach((section, index) => {
        gsap.fromTo(section,
          {
            autoAlpha: 0,
            y: 30
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            },
            delay: index * 0.1
          }
        );
      });

      // Simple hover effects for buttons
      gsap.utils.toArray('.hover-btn').forEach(btn => {
        const hoverTl = gsap.timeline({ paused: true });
        hoverTl.to(btn, {
          scale: 1.03,
          duration: 0.2,
          ease: 'power2.out'
        });

        btn.addEventListener('mouseenter', () => hoverTl.play());
        btn.addEventListener('mouseleave', () => hoverTl.reverse());
      });

    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

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
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: ["+91 9335391320"],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["jayaagnihotriphotography@gmail.com"],
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      details: ["Sushant Golf City", "Lucknow, Uttar Pradesh"],
      color: "from-purple-600 to-pink-500"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      details: ["Mon - Fri: 10:00 AM - 8:00 PM", "Sat - Sun: 10:00 AM - 6:00 PM"],
      color: "from-pink-600 to-purple-500"
    }
  ];

  const socialLinks = [
    { 
      icon: <Instagram className="w-6 h-6" />, 
      name: "Instagram", 
      url: "https://www.instagram.com/jayaagnihotriphotography/",
      color: "from-purple-500 to-pink-500"
    },
    { 
      icon: <Facebook className="w-6 h-6" />, 
      name: "Facebook", 
      url: "https://facebook.com/jayaagnihotriphotography",
      color: "from-blue-500 to-purple-500"
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-[#f3e6fa] via-white to-[#F0E7E5]">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-gradient-to-br from-pink-200/15 to-purple-200/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-blue-200/10 to-purple-200/10 rounded-full blur-2xl"></div>
      </div>

      {/* Hero Section */}
      <section className="animate-section relative pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-purple-100 mb-8">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            <Camera className="w-5 h-5 text-purple-600" />
            <span className="text-gray-700 font-semibold text-sm tracking-wide">Let's Create Something Beautiful</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-800 tracking-tight">
            Get In 
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 bg-clip-text text-transparent"> Touch</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Ready to capture your special moments? Let's discuss your vision and create something beautiful together.
          </p>

          {/* Trust Indicators */}
          <div className="flex justify-center items-center gap-6 mt-12 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Quick Response</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Professional Service</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Free Consultation</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Form - Takes more space */}
          <div className="animate-section lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Send us a Message</h2>
                <p className="text-gray-600 text-lg">Fill out the form below and we'll get back to you within 24 hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg">
                    
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full pl-16 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all placeholder-gray-500 disabled:opacity-50 text-gray-800 font-medium"
                      required
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg">
              
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full pl-16 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all placeholder-gray-500 disabled:opacity-50 text-gray-800 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg">
            
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full pl-16 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all placeholder-gray-500 disabled:opacity-50 text-gray-800 font-medium"
                      required
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-5  p-2 rounded-lg">
                
                    </div>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      disabled={submitting || loadingServices}
                      className="w-full pl-16 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all text-gray-800 appearance-none cursor-pointer disabled:opacity-50 font-medium"
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
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      {loadingServices ? (
                        <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                      ) : (
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-5 bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <textarea
                    name="message"
                    placeholder="Tell us about your project, preferred dates, location, and any special requirements..."
                    value={formData.message}
                    onChange={handleInputChange}
                    disabled={submitting}
                    rows={6}
                    className="w-full pl-16 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all placeholder-gray-500 resize-none disabled:opacity-50 text-gray-800 font-medium"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="hover-btn w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  <span className="flex items-center justify-center gap-3">
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info & Map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Details */}
            <div className="animate-section space-y-4">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-2 text-lg">{item.title}</h3>
                      {item.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 mb-1 font-medium">{detail}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="animate-section bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
              <h3 className="font-bold text-gray-800 mb-4 text-xl">Follow Our Journey</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`hover-btn flex-1 p-4 bg-gradient-to-r ${social.color} rounded-xl text-white hover:shadow-lg transition-all duration-300 text-center font-semibold`}
                    title={social.name}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {social.icon}
                      <span>{social.name}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="animate-section mt-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Visit Our Studio</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">Located in the beautiful Sushant Golf City, Lucknow. Our studio is equipped with state-of-the-art facilities to bring your vision to life.</p>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.2441234567!2d80.9496963!3d26.8541383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfdc58e64c56d%3A0x3a1f0c8f9a2b6c1e!2sSushant%20Golf%20City%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              ></iframe>
              
              {/* Map Overlay */}
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3 text-gray-800">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-bold block text-base">Jaya Agnihotri Photography</span>
                    <span className="text-sm text-gray-600 font-medium">Sushant Golf City, Lucknow</span>
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
