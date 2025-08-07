import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Star, 
  Camera, 
  Upload, 
  X, 
  Play, 
  Pause, 
  VideoIcon, 
  MessageSquare,
  Send,
  User,
  MapPin,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../lib/axiosinstance';

const ReviewForm = () => {
  const [reviewType, setReviewType] = useState('text'); // 'text' or 'video'
  const [formData, setFormData] = useState({
    name: '',
    service: '',
    location: '',
    rating: 0,
    text: '',
    email: '',
    phone: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // New states for services API
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(null);
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  // Custom RGB beige color
  const beigeColor = 'rgb(118, 79, 57)';

  // Fetch services from API
  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      setServicesError(null);
      
      const response = await axiosInstance.get('/services/get-services', {
        params: {
          isActive: 'true', // Only get active services
          sortBy: 'name',
          sortOrder: 'asc'
        }
      });

      if (response.data.services) {
        setServices(response.data.services);
      } else {
        // Fallback to hardcoded services if API fails
        const fallbackServices = [
          { id: 1, name: 'Maternity Photography' },
          { id: 2, name: 'Newborn Photography' },
          { id: 3, name: 'Baby Photography' },
          { id: 4, name: 'Fashion Photography' },
          { id: 5, name: 'Family Photography' },
          { id: 6, name: 'Portrait Photography' },
          { id: 7, name: 'Event Photography' }
        ];
        setServices(fallbackServices);
        console.warn('Using fallback services data');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setServicesError('Failed to load services');
      
      // Use fallback services on error
      const fallbackServices = [
        { id: 1, name: 'Maternity Photography' },
        { id: 2, name: 'Newborn Photography' },
        { id: 3, name: 'Baby Photography' },
        { id: 4, name: 'Fashion Photography' },
        { id: 5, name: 'Family Photography' },
        { id: 6, name: 'Portrait Photography' },
        { id: 7, name: 'Event Photography' }
      ];
      setServices(fallbackServices);
      toast.error('Failed to load services, using default options');
    } finally {
      setServicesLoading(false);
    }
  };

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle rating selection
  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: ''
      }));
    }
  };

  // Handle video file upload - Updated with 10MB limit
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Video file must be less than 10MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file');
        return;
      }

      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      toast.success('Video uploaded successfully');
    }
  };

  // Start video recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 720 },
          height: { ideal: 1280 } // 9:16 aspect ratio
        }, 
        audio: true 
      });
      
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const file = new File([blob], 'recorded-video.webm', { type: 'video/webm' });
        setVideoFile(file);
        const url = URL.createObjectURL(blob);
        setVideoPreview(url);
        toast.success('Video recorded successfully');
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast.error('Unable to access camera. Please check permissions.');
    }
  };

  // Stop video recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
  };

  // Remove video
  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setIsPlaying(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Clean up object URL to prevent memory leaks
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
  };

  // Toggle video playback
  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.service) newErrors.service = 'Service is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (formData.rating === 0) newErrors.rating = 'Rating is required';
    
    if (reviewType === 'text' && !formData.text.trim()) {
      newErrors.text = 'Review text is required';
    }
    if (reviewType === 'video' && !videoFile) {
      newErrors.video = 'Video is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission with API integration
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for multipart/form-data submission
      const submitData = new FormData();
      
      // Add form data
      submitData.append('name', formData.name.trim());
      submitData.append('service', formData.service);
      submitData.append('location', formData.location.trim());
      submitData.append('rating', formData.rating.toString());
      submitData.append('text', formData.text.trim());
      submitData.append('email', formData.email.trim());
      submitData.append('type', reviewType);
      
      // Add optional phone number
      if (formData.phone.trim()) {
        submitData.append('phone', formData.phone.trim());
      }
      
      // Add video file if present
      if (videoFile) {
        submitData.append('video', videoFile);
      }

      // Make API call to submit testimonial
      const response = await axiosInstance.post('/testimonials/create-testimonial', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout for video uploads
        onUploadProgress: (progressEvent) => {
          // Optional: You can add upload progress feedback here
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });

      // Handle successful submission
      if (response.status === 201) {
        toast.success(response.data.message || 'Thank you! Your review has been submitted successfully and is pending approval.');
        
        // Reset form completely
        setFormData({
          name: '',
          service: '',
          location: '',
          rating: 0,
          text: '',
          email: '',
          phone: ''
        });
        setVideoFile(null);
        setVideoPreview(null);
        setReviewType('text');
        setErrors({});
        
        // Clean up any object URLs
        if (videoPreview) {
          URL.revokeObjectURL(videoPreview);
        }
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
      
    } catch (error) {
      console.error('Testimonial submission error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with an error status
        const { status, data } = error.response;
        
        if (status === 400) {
          // Validation errors from server
          if (data.error && data.error.includes('required')) {
            toast.error(data.error);
          } else if (data.error && data.error.includes('size')) {
            toast.error('File size too large. Please use a smaller file.');
          } else {
            toast.error(data.error || 'Please check your input and try again.');
          }
        } else if (status === 413) {
          toast.error('File size too large. Please use a smaller video file.');
        } else if (status === 429) {
          toast.error('Too many requests. Please wait a moment before submitting again.');
        } else if (status >= 500) {
          toast.error('Server error. Please try again later.');
        } else {
          toast.error(data.error || 'Failed to submit review. Please try again.');
        }
      } else if (error.request) {
        // Network error
        if (error.code === 'ECONNABORTED') {
          toast.error('Upload timeout. Please check your connection and try again.');
        } else {
          toast.error('Network error. Please check your connection and try again.');
        }
      } else {
        // Other errors
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      // Clean up video stream if component unmounts during recording
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      // Clean up object URLs
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm mb-6" style={{ backgroundColor: 'rgb(118, 79, 57)', color: 'white' }}>
            <Star className="w-4 h-4 fill-current" />
            <span>Share Your Experience</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light mb-6 leading-tight" style={{ color: beigeColor }}>
            Leave a Review
          </h2>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed" style={{ color: beigeColor }}>
            Help other families by sharing your experience with our photography services
          </p>
        </div>

        {/* Review Type Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-amber-50 rounded-full p-2 shadow-lg">
            <button
              onClick={() => setReviewType('text')}
              className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 ${
                reviewType === 'text'
                  ? 'text-white'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: reviewType === 'text' ? beigeColor : 'transparent',
                color: reviewType === 'text' ? 'white' : beigeColor
              }}
            >
              <MessageSquare className="w-4 h-4" />
              Written Review
            </button>
            <button
              onClick={() => setReviewType('video')}
              className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 ml-2 ${
                reviewType === 'video'
                  ? 'text-white'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: reviewType === 'video' ? beigeColor : 'transparent',
                color: reviewType === 'video' ? 'white' : beigeColor
              }}
            >
              <VideoIcon className="w-4 h-4" />
              Video Review
            </button>
          </div>
        </div>

        {/* Main Form */}
        <Card className="border-0 shadow-2xl bg-white overflow-hidden">
          <CardContent className="p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: beigeColor }}>
                    <User className="w-4 h-4" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                      errors.name ? 'border-red-500' : 'border-amber-200'
                    }`}
                    style={{
                      color: beigeColor,
                      focusRingColor: beigeColor
                    }}
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: beigeColor }}>
                    <MapPin className="w-4 h-4" />
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                      errors.location ? 'border-red-500' : 'border-amber-200'
                    }`}
                    style={{ color: beigeColor }}
                    placeholder="City, State"
                    disabled={isSubmitting}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: beigeColor }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                      errors.email ? 'border-red-500' : 'border-amber-200'
                    }`}
                    style={{ color: beigeColor }}
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: beigeColor }}>
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
                    style={{ color: beigeColor }}
                    placeholder="+91 98765 43210"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: beigeColor }}>
                  <Briefcase className="w-4 h-4" />
                  Photography Service *
                  {servicesLoading && <Loader2 className="w-4 h-4 animate-spin" style={{ color: beigeColor }} />}
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    errors.service ? 'border-red-500' : 'border-amber-200'
                  }`}
                  style={{ color: beigeColor }}
                  disabled={isSubmitting || servicesLoading}
                >
                  <option value="">
                    {servicesLoading ? 'Loading services...' : 'Select a service'}
                  </option>
                  {services.map(service => (
                    <option key={service.id || service.name} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
                {errors.service && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.service}
                  </p>
                )}
                {servicesError && (
                  <p className="text-yellow-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {servicesError} - Using default options
                  </p>
                )}
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-4" style={{ color: beigeColor }}>
                  Overall Rating *
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      disabled={isSubmitting}
                      className={`p-2 transition-all duration-300 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50 ${
                        star <= formData.rating 
                          ? 'text-yellow-400' 
                          : 'text-amber-200 hover:text-yellow-400'
                      }`}
                    >
                      <Star className={`w-8 h-8 ${
                        star <= formData.rating ? 'fill-current' : ''
                      }`} />
                    </button>
                  ))}
                  <span className="ml-4 text-sm self-center" style={{ color: beigeColor }}>
                    {formData.rating > 0 ? `${formData.rating}/5` : 'Click to rate'}
                  </span>
                </div>
                {errors.rating && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.rating}
                  </p>
                )}
              </div>

              {/* Review Content based on type */}
              {reviewType === 'text' ? (
                // Text Review
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: beigeColor }}>
                    Your Review *
                  </label>
                  <textarea
                    name="text"
                    value={formData.text}
                    onChange={handleInputChange}
                    rows={6}
                    maxLength={500}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 resize-none ${
                      errors.text ? 'border-red-500' : 'border-amber-200'
                    }`}
                    style={{ color: beigeColor }}
                    placeholder="Share your experience with our photography services..."
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm" style={{ color: beigeColor }}>
                      {formData.text.length}/500 characters
                    </span>
                    {errors.text && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.text}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                // Video Review
                <div>
                  <label className="block text-sm font-medium mb-4" style={{ color: beigeColor }}>
                    Video Review * (9:16 aspect ratio recommended, max 10MB)
                  </label>
                  
                  {!videoPreview ? (
                    <div className="space-y-4">
                      {/* Upload Options */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* File Upload */}
                        <div
                          onClick={isSubmitting ? undefined : () => fileInputRef.current?.click()}
                          className={`border-2 border-dashed border-amber-300 rounded-lg p-8 text-center transition-colors ${
                            isSubmitting 
                              ? 'opacity-50 cursor-not-allowed' 
                              : 'hover:border-amber-400 cursor-pointer'
                          }`}
                        >
                          <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: beigeColor }} />
                          <p className="font-medium mb-2" style={{ color: beigeColor }}>Upload Video</p>
                          <p className="text-sm" style={{ color: beigeColor }}>
                            MP4, WebM up to 10MB
                          </p>
                        </div>
                        
                        {/* Record Video */}
                        <div
                          onClick={isSubmitting ? undefined : (isRecording ? stopRecording : startRecording)}
                          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                            isSubmitting 
                              ? 'opacity-50 cursor-not-allowed' 
                              : isRecording 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-amber-300 hover:border-amber-400'
                          }`}
                        >
                          <Camera className={`w-12 h-12 mx-auto mb-4 ${
                            isRecording ? 'text-red-500' : ''
                          }`} style={!isRecording ? { color: beigeColor } : {}} />
                          <p className={`font-medium mb-2 ${
                            isRecording ? 'text-red-600' : ''
                          }`} style={!isRecording ? { color: beigeColor } : {}}>
                            {isRecording ? 'Stop Recording' : 'Record Video'}
                          </p>
                          <p className="text-sm" style={{ color: isRecording ? '#dc2626' : beigeColor }}>
                            {isRecording ? 'Recording in progress...' : 'Use your camera'}
                          </p>
                        </div>
                      </div>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                    </div>
                  ) : (
                    // Video Preview
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="relative max-w-md">
                          <div className="aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden">
                            <video
                              ref={videoRef}
                              src={videoPreview}
                              className="w-full h-full object-cover"
                              onPlay={() => setIsPlaying(true)}
                              onPause={() => setIsPlaying(false)}
                            />
                            
                            {/* Video Controls */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <button
                                type="button"
                                onClick={toggleVideoPlay}
                                disabled={isSubmitting}
                                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 disabled:opacity-50"
                              >
                                {isPlaying ? (
                                  <Pause className="w-8 h-8" />
                                ) : (
                                  <Play className="w-8 h-8 ml-1" />
                                )}
                              </button>
                            </div>
                            
                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={removeVideo}
                              disabled={isSubmitting}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-green-600 flex items-center justify-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Video ready for submission
                        </p>
                        <button
                          type="button"
                          onClick={removeVideo}
                          disabled={isSubmitting}
                          className="text-sm mt-2 disabled:opacity-50 hover:opacity-80 transition-opacity"
                          style={{ color: beigeColor }}
                        >
                          Replace video
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {errors.video && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.video}
                    </p>
                  )}
                  
                  {/* Optional text for video reviews */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium mb-2" style={{ color: beigeColor }}>
                      Additional Comments (Optional)
                    </label>
                    <textarea
                      name="text"
                      value={formData.text}
                      onChange={handleInputChange}
                      rows={3}
                      maxLength={500}
                      className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 resize-none"
                      style={{ color: beigeColor }}
                      placeholder="Any additional comments about your experience..."
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center pt-8">
                <button
                  type="submit"
                  disabled={isSubmitting || servicesLoading}
                  className={`px-12 py-4 rounded-lg font-medium transition-all duration-300 flex items-center gap-3 text-white ${
                    isSubmitting || servicesLoading
                      ? 'opacity-50 cursor-not-allowed'
                      : 'transform hover:scale-105 hover:opacity-90'
                  }`}
                  style={{ backgroundColor: beigeColor }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-12 text-sm" style={{ color: beigeColor }}>
          <p>Your review will be reviewed before being published on our website.</p>
          <p>Thank you for helping us improve our services!</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
