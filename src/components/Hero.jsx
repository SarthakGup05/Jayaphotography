import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1470&q=80",
    title: "Elegant Fashion Moments",
    subtitle: "Capturing style with every frame.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1727889490958-be651ef08d1d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8TWF0ZXJuaXR5JTIwc2hvb3RzfGVufDB8fDB8fHww",
    title: "Maternity Magic",
    subtitle: "Preserve the beauty of motherhood.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1545296593-4f1259273322?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZhc2hpb24lMjBwaG90b2dyYXBoeXxlbnwwfHwwfHx8MA%3D%3D",
    title: "Bold & Beautiful",
    subtitle: "Fashion that speaks for itself.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=1470&q=80",
    title: "Grace in Bloom",
    subtitle: "Celebrating the journey of motherhood.",
  },
];

const Hero = () => {
  return (
    <div className="w-full h-screen relative">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="w-full h-screen relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white px-4">
                <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-down">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-2xl font-light animate-fade-in-up">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .swiper-pagination-bullet {
          background: white;
          opacity: 1;
        }
        .animate-fade-in-down {
          animation: fadeInDown 1s ease both;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease both;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Hero;
