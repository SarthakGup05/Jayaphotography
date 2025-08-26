import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  Send,
  User,
  MapPin,
  Briefcase,
  AlertCircle,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axiosinstance";

const ReviewForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    service: "",
    location: "",
    rating: 0,
    text: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  // Colors
  const accentViolet = "#6D28D9";

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setServicesLoading(true);
        const response = await axiosInstance.get("/services/get-services", {
          params: { isActive: "true", sortBy: "sortOrder", sortOrder: "asc" },
        });
        let servicesData =
          Array.isArray(response.data) && response.data.length
            ? response.data
            : response.data.services || [];
        const activeServices = servicesData
          .filter((s) => s.isActive)
          .sort((a, b) => a.sortOrder - b.sortOrder);
        setServices(activeServices);
      } catch (error) {
        toast.error("Failed to load services, using defaults");
        setServices([
          { id: "fallback-1", name: "Maternity Photography" },
          { id: "fallback-2", name: "Newborn Photography" },
          { id: "fallback-3", name: "Baby Photography" },
          { id: "fallback-4", name: "Family Photography" },
        ]);
      } finally {
        setServicesLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleRatingClick = (rating) => {
    setFormData((p) => ({ ...p, rating }));
    if (errors.rating) setErrors((p) => ({ ...p, rating: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.service) newErrors.service = "Service is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email";
    }
    if (formData.rating === 0) newErrors.rating = "Rating is required";
    if (!formData.text.trim()) newErrors.text = "Review text is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) submitData.append(key, value);
      });
      submitData.append("type", "text");

      const response = await axiosInstance.post(
        "/testimonials/create-testimonial",
        submitData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        toast.success(
          response.data.message ||
            "Thank you! Your review has been submitted and is pending approval."
        );
        setFormData({
          name: "",
          service: "",
          location: "",
          rating: 0,
          text: "",
          email: "",
          phone: "",
        });
        setErrors({});
      }
    } catch (err) {
      toast.error("Failed to submit review. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white rounded-2xl">
      <CardContent className="p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name + Location */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                <User className="w-4 h-4" /> Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.name
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:ring-violet-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4" /> Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.location
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:ring-violet-300"
                }`}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.location}
                </p>
              )}
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.email
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:ring-violet-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300 transition"
              />
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <Briefcase className="w-4 h-4" /> Service *
              {servicesLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            </label>
            <select
              name="service"
              value={formData.service}
              onChange={handleInputChange}
              disabled={isSubmitting || servicesLoading}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.service
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:ring-violet-300"
              }`}
            >
              <option value="">
                {servicesLoading ? "Loading services..." : "Select a service"}
              </option>
              {services.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.service && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.service}
              </p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Overall Rating *
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  disabled={isSubmitting}
                  className="p-1"
                >
                  <Star
                    className={`w-8 h-8 transition ${
                      star <= formData.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 hover:text-yellow-400"
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm text-gray-600">
                {formData.rating > 0
                  ? `${formData.rating}/5`
                  : "Click to rate"}
              </span>
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.rating}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Your Review *
            </label>
            <textarea
              name="text"
              rows={4}
              maxLength={1000}
              value={formData.text}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition resize-none ${
                errors.text
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:ring-violet-300"
              }`}
              placeholder="Tell us about your experience..."
            />
            <div className="text-sm text-gray-500 mt-1">
              {formData.text.length}/1000 characters
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting || servicesLoading}
              className={`px-8 py-3 rounded-lg font-medium flex items-center gap-3 text-white transition ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-90 hover:shadow-lg"
              }`}
              style={{ backgroundColor: accentViolet }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
