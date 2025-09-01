import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Instagram, Play, Award, Camera } from "lucide-react";
import { Link } from "react-router-dom";

const JayaAbout = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* About Section with Side-by-Side Layout */}
      <div className="py-16 bg-[#F0E7E5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <div className="relative flex justify-center lg:justify-start">
              <div className="relative">
                {/* Main Image */}
                <div className="w-80 h-[500px] rounded-lg overflow-hidden shadow-lg">
                  <img
                    src="https://img.freepik.com/free-photo/western-female-photographer-exploring-city-udaipur-india_53876-65361.jpg"
                    alt="Jaya - Professional Photographer"
                    className="w-full h-full object-cover"
                  />

                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                </div>

                {/* Minimal decorative elements */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-200 rounded-full"></div>
                <div className="absolute -bottom-3 -left-3 w-3 h-3 bg-yellow-200 rounded-full"></div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-6">
              {/* Small intro text */}
              <div className="text-gray-600 text-xs uppercase tracking-wider font-medium">
                Photographer
              </div>

              <h1 className="text-black">About Jaya</h1>

              <div className="space-y-4 text-gray-700 text-2xl leading-relaxed font-semibold">
                <p>
                  Itwas 2012, and I had just moved to Lucknow from Kanpur to
                  study. Since I had some time on my hands, I enrolled myself
                  for a photography workshop, and that was the beginning of the
                  most adventurous part of my life. Lots of criticism, some
                  motivation and a few hundred shoots later, here I am - single
                  handedly running a photography business.
                </p>
                <p>
                  I soon dropped out of biotech and enrolled in Bachelor in
                  visual arts, finishing it with masters in photography. By the
                  time I was 25, I had already shot successful campaigns for few
                  reputed colleges, and was travelling all over the country for
                  work. Yes, I dropped it all to pursue my passion of
                  photography. As much as it may sound like a cliche, this
                  happening to me in reality was unnerving. For the first couple
                  of years, my mind was constantly wondering if I've made the
                  right choice, will I be financially sustainable and so much
                  more. But when I pick up my camera and start creating
                  beautiful images, I feel like the most powerful person and
                  absolutely unstoppable.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 pt-4 cursor-pointer">
                <Link to="/gallery">
                  <button className="button cursor-pointer px-6 py-3 bg-black text-white hover:bg-gray-800 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl">
                    View Portfolio
                  </button>
                </Link>
                <Link to="/contact">
                  <button className="button cursor-pointer px-6 py-3 border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 rounded-lg">
                    Book Session
                  </button>
                </Link>
              </div>

              {/* Minimal stats */}
              <div className="grid grid-cols-3 gap-6 mt-10 pt-6 border-t border-gray-300">
                <div className="text-center">
                  <div className="text-lg font-light text-black mb-1">10+</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">
                    Years
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-light text-black mb-1">500+</div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">
                    Sessions
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-light text-black mb-1">
                    Masters
                  </div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">
                    Degree
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional: Additional minimal content sections */}
      {/* <div className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-black mb-4">Philosophy</h3>
            <p className="text-gray-700">
              Every photograph should be a window into a moment that matters. 
              Through careful composition and natural light, I create images 
              that speak to the heart and stand the test of time.
            </p>
          </div>
        </div>
      </div> */}

      {/* Services preview */}
      {/* <div className="py-12 bg-[#FAF0DC]">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-center text-black mb-8">Specializations</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-pink-200">
                <Camera className="w-5 h-5 text-gray-700" />
              </div>
              <h4 className="text-black mb-2">Maternity</h4>
              <p className="caption text-gray-600">
                Celebrating the beauty of expecting mothers
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-yellow-200">
                <Award className="w-5 h-5 text-gray-700" />
              </div>
              <h4 className="text-black mb-2">Newborn</h4>
              <p className="caption text-gray-600">
                Capturing precious first moments
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-pink-200">
                <Play className="w-5 h-5 text-gray-700" />
              </div>
              <h4 className="text-black mb-2">Family</h4>
              <p className="caption text-gray-600">
                Creating lasting family memories
              </p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default JayaAbout;
