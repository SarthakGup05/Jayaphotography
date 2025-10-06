import React from 'react';

const AboutStorySection = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-stone-100 via-neutral-50 to-rose-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-none shadow-2xl">
              <img 
                src="/bg/2.jpg"
                alt="Female photographer with camera"
                className="w-full h-[650px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/30"></div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8 lg:pl-8">
            {/* Title */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-light text-gray-600 tracking-wide">
                About My Story
              </h2>
            </div>

            {/* Story Content */}
            <div className="space-y-6">
              <p className="text-lg text-gray-600 leading-relaxed font-light tracking-wide">
                I have had the privilege of working with the most amazing clientele who help me love my work a bit more. My favourite are the adorable toddlers on sets. It's a delight to speak to them in their language, make them pose for the camera, and seeing them smile.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed font-light tracking-wide">
                Whether it's babies or adult fashion models or even expecting mothers, I can not stress enough how important it is to make the subjects comfortable. I won't get a good picture till I make them happy, and I won't stop till I get a good picture.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed font-light tracking-wide">
                Some times when I feel demotivated, I go back to the messages these parents have sent me after the shoot and I swear it's the most beautiful thing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStorySection;