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
  Twitter,
  Youtube,
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
        { id: 1, title: "Maternity Photography", slug: "maternity" },
        { id: 2, title: "Baby Photography", slug: "baby" },
        { id: 3, title: "Fashion Photography", slug: "fashion" },
        { id: 4, title: "Other", slug: "other" }
      ]);
    } finally {
      setLoadingServices(false);
    }
  };

  const submitContactForm = async (contactData) => {
    try {
      setSubmitting(true);
      toast.loading("Sending your message...", { id: 'contact-form' });

      // Prepare the data according to your API structure
      const submissionData = {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        serviceType: contactData.serviceType,
        message: contactData.message,
        source: 'contact_form', // To identify the source
        submittedAt: new Date().toISOString()
      };

      const response = await axiosInstance.post("/enquiries/create-enquiry", submissionData);
      
      toast.success("Thank you! We'll get back to you within 24 hours.", { 
        id: 'contact-form',
        icon: '🎉',
        duration: 5000
      });

      // Reset form on success
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
    
    // Prevent double submission
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

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["hello@photographystudio.com", "bookings@photographystudio.com"],
      color: "from-rose-500 to-pink-500"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location",
      details: ["123 Photography Lane", "Creative District, NY 10001"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      details: ["Mon - Fri: 9:00 AM - 7:00 PM", "Sat - Sun: 10:00 AM - 6:00 PM"],
      color: "from-purple-500 to-indigo-500"
    }
  ];

  const socialLinks = [
    { icon: <Instagram className="w-6 h-6" />, name: "Instagram", color: "hover:text-pink-500", url: "https://instagram.com/yourstudio" },
    { icon: <Facebook className="w-6 h-6" />, name: "Facebook", color: "hover:text-blue-500", url: "https://facebook.com/yourstudio" },
    { icon: <Twitter className="w-6 h-6" />, name: "Twitter", color: "hover:text-sky-500", url: "https://twitter.com/yourstudio" },
    { icon: <Youtube className="w-6 h-6" />, name: "YouTube", color: "hover:text-red-500", url: "https://youtube.com/yourstudio" }
  ];

  // Animation refs
  const headerRef = useRef();
  const formRef = useRef();
  const infoRef = useRef();
  const socialsRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    gsap.fromTo(headerRef.current, { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });
    gsap.fromTo(formRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power2.out" });
    gsap.fromTo(infoRef.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1, delay: 0.4, ease: "power2.out" });
    gsap.fromTo(socialsRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1, delay: 0.6, ease: "power2.out" });
    gsap.fromTo(mapRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: "power2.out" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50">
      {/* Header Section */}
      <div ref={headerRef} className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
            <Camera className="w-5 h-5 text-rose-400" />
            <span className="text-rose-300 font-medium">Get In Touch</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            Contact 
            <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent"> Us</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Ready to capture your special moments? Let's discuss your vision and create something beautiful together.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Contact Form */}
          <div ref={formRef} className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Send us a Message</h2>
                <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Full Name"
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

                <div className="grid md:grid-cols-2 gap-6">
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
                    <Camera className="absolute left-4 top-6 text-gray-400 w-5 h-5" />
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      disabled={submitting || loadingServices}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-gray-700 appearance-none cursor-pointer disabled:opacity-50"
                      required
                    >
                      <option value="">
                        {loadingServices ? "Loading services..." : "Select Service Type"}
                      </option>
                      {services.map((service) => (
                        <option key={service.id} value={service.slug || service.title.toLowerCase().replace(/\s+/g, '-')}>
                          {service.title}
                        </option>
                      ))}
                      <option value="other">Other</option>
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
                </div>

                <div className="relative">
                  <MessageCircle className="absolute left-4 top-6 text-gray-400 w-5 h-5" />
                  <textarea
                    name="message"
                    placeholder="Tell us about your project, preferred dates, location, and any special requirements..."
                    value={formData.message}
                    onChange={handleInputChange}
                    disabled={submitting}
                    rows={6}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all placeholder-gray-500 resize-none disabled:opacity-50"
                    required
                  ></textarea>
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

          {/* Right Column - Contact Info */}
          <div ref={infoRef} className="space-y-8">
            {/* Contact Details */}
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${item.color} text-white shadow-lg`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                      {item.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media Links */}
            <div ref={socialsRef} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 bg-gray-100 rounded-xl text-gray-600 ${social.color} transform hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg`}
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
        <div ref={mapRef} className="mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Visit Our Studio</h2>
              <p className="text-gray-600">Located in the heart of the creative district, our studio is easily accessible and equipped with state-of-the-art facilities.</p>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968459391!3d40.75889797932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1635959687750!5m2!1sen!2sus"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              ></iframe>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-rose-500" />
                  <span className="font-semibold">Our Studio Location</span>
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
