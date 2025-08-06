import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Quote, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  VideoIcon,
  MessageSquare
} from 'lucide-react';

const Testimonial = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      service: "Maternity Photography",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Jaya captured the most beautiful moments of my pregnancy journey. Her patience and creativity made the entire experience so comfortable and memorable. The photos are absolutely stunning and we'll treasure them forever.",
      location: "Lucknow",
      type: "text"
    },
    {
      id: 2,
      name: "Rahul & Kavita Singh",
      service: "Newborn Photography",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Working with Jaya for our baby's first photoshoot was amazing. She has such a gentle way with newborns and captured the sweetest moments.",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", // Replace with actual video
      videoPoster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=711&fit=crop", // 9:16 aspect ratio
      location: "Lucknow",
      type: "video"
    },
    {
      id: 3,
      name: "Anita Gupta",
      service: "Baby Photography",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&face",
      rating: 5,
      text: "Jaya's expertise in baby photography is exceptional. She knew exactly how to work with our 6-month-old and got the most adorable shots. Her studio is well-equipped and she made the whole family feel at ease.",
      location: "Lucknow",
      type: "text"
    },
    {
      id: 4,
      name: "Deepak Verma",
      service: "Fashion Photography",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Amazing experience working with Jaya. Professional, creative, and delivered exactly what we wanted.",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4", // Replace with actual video
      videoPoster: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=711&fit=crop", // 9:16 aspect ratio
      location: "Lucknow",
      type: "video"
    },
  ];

  const current = testimonials[currentTestimonial];

  // Video controls
  useEffect(() => {
    if (current.type === 'video' && videoRef.current) {
      setIsPlaying(false);
      setVideoProgress(0);
      videoRef.current.currentTime = 0;
    }
  }, [currentTestimonial]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoProgress = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setVideoProgress(0);
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-full text-sm mb-6">
            <Star className="w-4 h-4 fill-current" />
            <span>Client Stories</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-gray-900 mb-6 leading-tight">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Hear from the families who have trusted us to capture their most precious moments
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="relative mb-16">
          {current.type === 'video' ? (
            // Video Testimonial Layout
            <div className="flex justify-center">
              <Card className="border-0 shadow-2xl bg-white overflow-hidden max-w-md">
                <CardContent className="p-0">
                  {/* Video Container with 9:16 aspect ratio */}
                  <div className="relative w-full aspect-[9/16] bg-gray-900 overflow-hidden">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      poster={current.videoPoster}
                      muted={isMuted}
                      onTimeUpdate={handleVideoProgress}
                      onEnded={handleVideoEnd}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    >
                      <source src={current.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    
                    {/* Video Overlay */}
                    <div className="absolute inset-0 bg-black/10" />
                    
                    {/* Video Controls */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={togglePlay}
                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-6 rounded-full transition-all duration-300 transform hover:scale-110"
                      >
                        {isPlaying ? (
                          <Pause className="w-12 h-12" />
                        ) : (
                          <Play className="w-12 h-12 ml-1" />
                        )}
                      </button>
                    </div>
                    
                    {/* Video Progress Bar */}
                    {isPlaying && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                        <div 
                          className="h-full bg-white transition-all duration-300"
                          style={{ width: `${videoProgress}%` }}
                        />
                      </div>
                    )}
                    
                    {/* Mute Button */}
                    <button
                      onClick={toggleMute}
                      className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>

                    {/* Video Type Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <VideoIcon className="w-3 h-3" />
                        Video
                      </div>
                    </div>

                    {/* Client Info Overlay on Video */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
                      {/* Rating */}
                      <div className="flex space-x-1 mb-3">
                        {[...Array(current.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      
                      {/* Client Info */}
                      <div className="flex items-center space-x-3 mb-2">
                        <img
                          src={current.image}
                          alt={current.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                        />
                        <div>
                          <h4 className="font-medium text-sm">{current.name}</h4>
                          <p className="text-xs text-white/80 uppercase tracking-wider">
                            {current.service}
                          </p>
                        </div>
                      </div>
                      
                      {/* Short text */}
                      <p className="text-xs text-white/90 italic">"{current.text}"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Text Testimonial Layout
            <Card className="border-0 shadow-2xl bg-white overflow-hidden max-w-4xl mx-auto">
              <CardContent className="p-12 lg:p-16">
                <div className="text-center">
                  {/* Type Badge */}
                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-8">
                    <MessageSquare className="w-4 h-4" />
                    Written Review
                  </div>

                  {/* Rating */}
                  <div className="flex justify-center space-x-1 mb-8">
                    {[...Array(current.rating)].map((_, i) => (
                      <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Large Quote */}
                  <div className="relative mb-12">
                    <Quote className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 text-gray-200" />
                    <blockquote className="text-2xl lg:text-4xl font-light text-gray-800 leading-relaxed italic max-w-4xl">
                      "{current.text}"
                    </blockquote>
                  </div>

                  {/* Client Info */}
                  <div className="flex items-center justify-center space-x-6">
                    <img
                      src={current.image}
                      alt={current.name}
                      className="w-20 h-20 rounded-full object-cover shadow-lg"
                    />
                    <div className="text-left">
                      <h4 className="text-2xl font-medium text-gray-900 mb-1">{current.name}</h4>
                      <p className="text-gray-600 uppercase tracking-wider font-medium mb-1">
                        {current.service}
                      </p>
                      <p className="text-gray-500">{current.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-900 text-gray-900 hover:text-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-900 text-gray-900 hover:text-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Testimonial Indicators with Preview */}
        <div className="flex justify-center items-center space-x-4 mb-16">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              onClick={() => setCurrentTestimonial(index)}
              className={`group flex items-center space-x-3 px-4 py-2 rounded-full transition-all duration-300 ${
                index === currentTestimonial 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium hidden sm:block">
                {testimonial.name.split(' ')[0]}
              </span>
              {testimonial.type === 'video' ? (
                <VideoIcon className="w-4 h-4" />
              ) : (
                <MessageSquare className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-light text-gray-900 mb-2">500+</div>
              <div className="text-gray-600 text-sm uppercase tracking-wider">Happy Clients</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-light text-gray-900 mb-2">5.0</div>
              <div className="text-gray-600 text-sm uppercase tracking-wider flex items-center justify-center gap-1">
                Average Rating <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-light text-gray-900 mb-2">3+</div>
              <div className="text-gray-600 text-sm uppercase tracking-wider">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-light text-gray-900 mb-2">100%</div>
              <div className="text-gray-600 text-sm uppercase tracking-wider">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
