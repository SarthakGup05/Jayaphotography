import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import axiosInstance from "@/lib/axiosinstance";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axiosInstance.get("/testimonials/get-testimonials");
        const data = res.data.testimonials
          .filter((t) => t.isActive && t.type === "text")
          .sort((a, b) => a.sortOrder - b.sortOrder);
        setTestimonials(data);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      }
    };
    fetchTestimonials();
  }, []);

  if (testimonials.length === 0) return null;

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[current];

  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 py-20"
      style={{ backgroundColor: "#D3D3FF" }} // Beige base
    >
      <div className="w-full max-w-4xl text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 text-[#2D2A26]">
          What Clients Say
        </h2>
        <p className="text-[#5A5349] mb-12">
          Real words from people who trusted us to capture their story.
        </p>

        {/* Card */}
        <div className="bg-white border border-[#E4D9C5] rounded-2xl p-10 shadow-sm transition-all">
          {/* Rating */}
          <div className="flex justify-center mb-6">
            {[...Array(t.rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-lg md:text-xl text-[#2D2A26] leading-relaxed mb-8 italic">
            “{t.text}”
          </blockquote>

          {/* Client Info */}
          <div className="flex flex-col items-center">
            {t.image ? (
              <img
                src={t.image}
                alt={t.name}
                className="w-14 h-14 rounded-full object-cover mb-3 ring-2 ring-[#0D9488]" // Teal accent
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#0D9488] flex items-center justify-center text-sm font-medium text-white mb-3">
                {t.name?.charAt(0)}
              </div>
            )}
            <div className="font-medium text-[#2D2A26]">{t.name}</div>
            <div className="text-sm text-[#5A5349]">{t.service}</div>
          </div>
        </div>

        {/* Navigation */}
        {testimonials.length > 1 && (
          <div className="flex justify-center items-center mt-10 gap-6">
            <button
              onClick={prev}
              className="p-2 rounded-full border border-[#E4D9C5] hover:bg-[#0D9488] hover:text-white transition"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition ${
                    i === current ? "bg-[#0D9488]" : "bg-[#D6C6B3]"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2 rounded-full border border-[#E4D9C5] hover:bg-[#0D9488] hover:text-white transition"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
