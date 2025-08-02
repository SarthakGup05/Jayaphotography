import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const Testimonial = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      service: "Maternity Photography",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Jaya captured the most beautiful moments of my pregnancy journey. Her patience and creativity made the entire experience so comfortable and memorable. The photos are absolutely stunning and we'll treasure them forever.",
      location: "Lucknow"
    },
    {
      id: 2,
      name: "Rahul & Kavita Singh",
      service: "Newborn Photography",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Working with Jaya for our baby's first photoshoot was amazing. She has such a gentle way with newborns and captured the sweetest moments. The props and setup were perfect, and the final photos exceeded our expectations.",
      location: "Lucknow"
    },
    {
      id: 3,
      name: "Anita Gupta",
      service: "Baby Photography",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&face",
      rating: 5,
      text: "Jaya's expertise in baby photography is exceptional. She knew exactly how to work with our 6-month-old and got the most adorable shots. Her studio is well-equipped and she made the whole family feel at ease.",
      location: "Lucknow"
    },
    // {
    //   id: 4,
    //   name: "Deepak Verma",
    //   service: "Fashion Photography",
    //   image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    //   rating: 5,
    //   text: "Jaya's fashion photography skills are outstanding. She has an eye for detail and knows how to bring out the best in every shot. The lighting and composition were perfect, and she delivered exactly what we envisioned.",
    //   location: "Lucknow"
    // },
    // {
    //   id: 5,
    //   name: "Sneha Agarwal",
    //   service: "Maternity & Baby Photography",
    //   image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    //   rating: 5,
    //   text: "From my maternity shoot to my baby's first photos, Jaya has been incredible. She captures emotions beautifully and has a natural talent for making everyone comfortable. Highly recommend her services!",
    //   location: "Lucknow"
    // }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentTestimonial];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Hear from the families who have trusted us to capture their most precious moments
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="relative">
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-12 md:p-16">
              <div className="grid md:grid-cols-3 gap-12 items-center">
                {/* Client Image */}
                <div className="flex justify-center">
                  <div className="relative">
                    <img
                      src={current.image}
                      alt={current.name}
                      className="w-32 h-32 rounded-full object-cover shadow-lg"
                    />
                    <div className="absolute -top-2 -right-2 bg-gray-900 text-white p-2 rounded-full">
                      <Quote className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="md:col-span-2 space-y-6">
                  {/* Rating */}
                  <div className="flex space-x-1">
                    {[...Array(current.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-xl md:text-2xl font-light text-gray-800 leading-relaxed italic">
                    "{current.text}"
                  </blockquote>

                  {/* Client Info */}
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-gray-900">{current.name}</h4>
                    <p className="text-sm text-gray-600 uppercase tracking-wider">{current.service}</p>
                    <p className="text-sm text-gray-500">{current.location}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-900 text-gray-900 hover:text-white p-3 rounded-full shadow-lg transition-all duration-300"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-900 text-gray-900 hover:text-white p-3 rounded-full shadow-lg transition-all duration-300"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial ? 'bg-gray-900' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* All Testimonials Grid */}
        {/* <div className="mt-20">
          <h3 className="text-2xl font-light text-gray-900 text-center mb-12">
            More Happy Clients
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.service}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {testimonial.text.substring(0, 120)}...
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Testimonial;