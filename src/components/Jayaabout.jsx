import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const JayaAbout = () => {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Section */}
          <div className="order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-sm">
              <img
                src="/assets/images/founder/jaya.jpeg"
                alt="Jaya Agnihotri - Professional Photographer"
                className="w-full h-[700px] object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-all duration-500" />
            </div>
          </div>

          {/* Content Section */}
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-light text-gray-800 leading-tight mb-6">
                Get done your baby photography in Lucknow - About me
              </h1>
            </div>

            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p className="text-lg">
                Hi! I'm <span className="font-medium text-gray-800">Jaya</span>. I am Masters in Photography and have a 
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

            {/* Social Media Links */}
            <div className="flex space-x-4 pt-6">
              <a 
                href="#" 
                className="w-12 h-12 bg-gray-100 hover:bg-gray-900 flex items-center justify-center rounded-full transition-all duration-300 group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 bg-gray-100 hover:bg-gray-900 flex items-center justify-center rounded-full transition-all duration-300 group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </a>
            </div>

            {/* Call to Action */}
            <Link to="/about-jaya">
              <div className="pt-8">
                <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-sm tracking-wider transition-colors duration-300 rounded-sm">
                  MORE ABOUT ME
                </button>
              </div>
            </Link>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-8 text-center">
              <div className="text-3xl font-light text-gray-800 mb-2">10+</div>
              <div className="text-sm tracking-wider text-gray-600">YEARS OF EXPERIENCE</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-8 text-center">
              <div className="text-3xl font-light text-gray-800 mb-2">500+</div>
              <div className="text-sm tracking-wider text-gray-600">HAPPY FAMILIES</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-8 text-center">
              <div className="text-3xl font-light text-gray-800 mb-2">Masters</div>
              <div className="text-sm tracking-wider text-gray-600">IN PHOTOGRAPHY</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JayaAbout;