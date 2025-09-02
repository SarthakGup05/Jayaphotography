// components/ui/contact-us-form.jsx
import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Camera, MessageCircle, Send, Loader2 } from "lucide-react";
import axiosInstance from "../lib/axiosinstance";
import toast from "react-hot-toast";

export const Form = ({
  onSubmit,
  initialData = {},
  className = "",
  submitButtonText = "Send Message",
  ...props
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    message: "",
    ...initialData,
  });

  const [services, setServices] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);

  // Fetch services for dropdown
  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get("/services/get-services");
      setServices(response.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    } finally {
      setLoadingServices(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // If onSubmit prop is provided, use it; otherwise use default API call
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        await axiosInstance.post("/enquiries/create-enquiry", formData);
        toast.success("Message sent successfully! We'll get back to you soon.");
        
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          phone: "",
          serviceType: "",
          message: "",
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send message. Please try again.";
      toast.error(errorMessage);
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`} {...props}>
      {/* Name and Email Row */}
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

      {/* Phone and Service Type Row */}
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
              <option key={service.id} value={service.slug || service.title?.toLowerCase().replace(/\s+/g, '-')}>
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

      {/* Message Textarea */}
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
        />
      </div>

      {/* Submit Button */}
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
              <span>{submitButtonText}</span>
            </>
          )}
        </span>
      </button>
    </form>
  );
};

export default Form;
