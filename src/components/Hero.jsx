import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Parallax } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/parallax";
import axiosInstance from "@/lib/axiosinstance";

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axiosInstance.get("/slider/get-sliders");
      setSlides(data.data);
    } catch (err) {
      setError("Failed to load slides. Please refresh the page.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-lg">No slides available.</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      <Swiper
        modules={[Autoplay, Pagination, Parallax]}
        parallax={true}
        speed={1200}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-full"
      >
        <div
          slot="container-start"
          className="absolute inset-0"
          data-swiper-parallax="-20%"
        ></div>

        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="w-full h-[800px] relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.mediaUrl})` }}
                data-swiper-parallax="-40%"
              ></div>

              <div
                className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white px-4"
                data-swiper-parallax="-100"
              >
                <h2
                  className="text-4xl md:text-6xl font-bold mb-4"
                  data-swiper-parallax="-200"
                >
                  {slide.title}
                </h2>
                <p
                  className="text-lg md:text-2xl font-light max-w-3xl"
                  data-swiper-parallax="-300"
                >
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
          opacity: 0.8;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: #f7b777;
          width: 12px;
          height: 12px;
        }
      `}</style>
    </div>
  );
};

export default Hero;
