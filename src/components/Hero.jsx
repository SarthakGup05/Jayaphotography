import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import axios from "axios";
import axiosInstance from "@/lib/axiosinstance";

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Fetch slides from your backend ───
  const fetchSlides = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axiosInstance.get("/slider/get-sliders");
      // Your slides are in data.data
      setSlides(data.data);
    } catch (err) {
      setError("Failed to load slides. Please refresh the page.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Load slides on mount ───
  useEffect(() => {
    fetchSlides();
  }, []);

  // ─── Loading state ───
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // ─── Error state ───
  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  // ─── No slides fallback ───
  if (slides.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-lg">No slides available.</div>
      </div>
    );
  }

  // ─── Render slider with your animation and overlay ───
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
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="w-full h-screen relative">
              <img
                src={slide.mediaUrl} // ⚠️ This is your API's image URL
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

      {/* ─── Keep your animation styles ─── */}
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
