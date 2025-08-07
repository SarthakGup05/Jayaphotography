import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Facebook, Instagram, Camera, Heart, Award, Users, Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

const JayaAbout = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFE1F5' }}>
      {/* Hero Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Profile Avatar Placeholder */}
          {/* <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl">
            <Camera className="w-16 h-16 text-white" />
          </div> */}

          {/* Main Heading */}
          <h1 className="text-4xl lg:text-6xl font-light text-black leading-tight mb-6">
            Meet <span className="text-gray-800 font-medium">Jaya Agnihotri</span>
          </h1>
          
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-8"></div>
          
          <p className="text-xl text-gray-800 font-light max-w-3xl mx-auto leading-relaxed">
            Masters in Photography • 10+ Years Experience • Baby & Maternity Specialist
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Story */}
          <div className="space-y-8">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Quote className="w-8 h-8 text-purple-400" />
                  <h2 className="text-2xl font-light text-black">My Story</h2>
                </div>
                
                <div className="space-y-6 text-gray-800 leading-relaxed">
                  <p className="text-lg">
                    Hi! I'm <span className="font-semibold text-black">Jaya</span>. I am Masters in Photography and have 
                    experience of 10 years. I am specialised in maternity 
                    and baby photography, currently working and living in 
                    Lucknow. I absolutely love shooting Maternity, Baby 
                    and Newborn photography.
                  </p>

                  <p className="text-lg">
                    At our studio, we offer a wide range of baby 
                    photoshoot options that are tailored to meet your 
                    specific needs and preferences. We provide both 
                    indoor and outdoor shoots with the most innovative 
                    props and backdrops that will make your baby's 
                    photoshoot even more special.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Specializations */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Heart className="w-8 h-8 text-pink-400" />
                  <h2 className="text-2xl font-light text-black">My Specializations</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { title: "Maternity Photography", desc: "Capturing the beautiful journey of motherhood" },
                    { title: "Baby Photography", desc: "Precious moments with your little ones" },
                    { title: "Newborn Photography", desc: "First days of life captured with tenderness" },
                    { title: "Family Portraits", desc: "Creating lasting memories for the whole family" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-3"></div>
                      <div>
                        <h3 className="font-medium text-black mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-700">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Contact */}
          <div className="space-y-8">
            {/* Statistics */}
            <div className="grid grid-cols-1 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-100 to-pink-100 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <div className="text-4xl font-light text-black mb-2">Masters</div>
                  <div className="text-sm tracking-wider text-gray-800 font-medium">IN PHOTOGRAPHY</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-100 to-purple-100 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <Star className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                  <div className="text-4xl font-light text-black mb-2">10+</div>
                  <div className="text-sm tracking-wider text-gray-800 font-medium">YEARS OF EXPERIENCE</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-100 to-pink-100 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <div className="text-4xl font-light text-black mb-2">500+</div>
                  <div className="text-sm tracking-wider text-gray-800 font-medium">HAPPY FAMILIES</div>
                </CardContent>
              </Card>
            </div>

            {/* Connect Section */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <h3 className="text-xl font-light text-black mb-6 text-center">Connect With Me</h3>
                
                {/* Social Media Links */}
                <div className="flex justify-center space-x-4 mb-8">
                  <a 
                    href="#" 
                    className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-500 hover:to-pink-500 flex items-center justify-center rounded-full transition-all duration-300 group hover:scale-110 hover:shadow-lg"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                  </a>
                  <a 
                    href="#" 
                    className="w-14 h-14 bg-gradient-to-br from-pink-100 to-purple-100 hover:from-pink-500 hover:to-purple-500 flex items-center justify-center rounded-full transition-all duration-300 group hover:scale-110 hover:shadow-lg"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-6 h-6 text-pink-600 group-hover:text-white transition-colors" />
                  </a>
                </div>

                {/* Call to Action */}
                <div className="text-center">
                  <Link to="/contact">
                    <button className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-sm tracking-wider transition-all duration-300 rounded-lg hover:scale-105 hover:shadow-lg transform">
                      BOOK A SESSION
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quote Section */}
        <div className="mt-20">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50">
            <CardContent className="p-12 text-center">
              <Quote className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              <blockquote className="text-2xl lg:text-3xl font-light text-black leading-relaxed italic mb-6">
                "Every photograph tells a story, and I'm here to help you tell yours beautifully."
              </blockquote>
              <p className="text-gray-800 font-medium">— Jaya Agnihotri</p>
            </CardContent>
          </Card>
        </div>

        {/* Services Preview */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-light text-black mb-4">Why Choose Me?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: "Professional Expertise",
                desc: "Masters degree in Photography with 10+ years of specialized experience in maternity and baby photography."
              },
              {
                icon: Heart,
                title: "Personalized Approach",
                desc: "Every session is tailored to your unique vision and preferences, ensuring your story is told authentically."
              },
              {
                icon: Star,
                title: "Creative Innovation",
                desc: "Using the most innovative props and backdrops to create magical and memorable photoshoots."
              }
            ].map((item, idx) => (
              <Card key={idx} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-medium text-black mb-4">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JayaAbout;
