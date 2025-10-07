import React, {
  useState,
  useEffect,
  useRef,
  memo,
} from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import axiosInstance from "@/lib/axiosinstance";

// ✅ Lazy-load GSAP for performance
const loadGSAP = () => import("gsap");

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 → next, -1 → prev
  const cardRef = useRef(null);
  const gsapRef = useRef(null);

  // ✅ Fetch testimonials
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

  // ✅ Lazy-load GSAP once
  useEffect(() => {
    loadGSAP().then((mod) => {
      gsapRef.current = mod.gsap;
    });
  }, []);

  // ✅ Animate card slide on change
  useEffect(() => {
    if (!gsapRef.current || !cardRef.current) return;
    const gsap = gsapRef.current;

    const card = cardRef.current;
    gsap.fromTo(
      card,
      {
        x: direction > 0 ? 100 : -100,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      }
    );
  }, [current]);

  // ✅ Auto-slide every 6s
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials]);

  if (testimonials.length === 0) return null;

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const t = testimonials[current];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24 bg-gradient-to-b from-[#f8f4ff] to-[#f2f2f2] overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0D9488]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#a855f7]/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-4xl text-center relative z-10">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-3 text-[#1e1e1e]">
          What Our Clients Say
        </h2>
        <p className="text-[#5A5349] mb-12 text-base md:text-lg">
          Real stories from people who trusted us to capture their experience.
        </p>

        {/* Testimonial Card */}
        <div
          ref={cardRef}
          className="bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl p-10 shadow-xl transition-all duration-700"
        >
          {/* Rating */}
          <div className="flex justify-center mb-6">
            {[...Array(t.rating)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 text-yellow-400 fill-yellow-400"
              />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-lg md:text-xl text-[#2D2A26] leading-relaxed mb-8 italic max-w-2xl mx-auto">
            “{t.text}”
          </blockquote>

          {/* Client Info */}
          <div className="flex flex-col items-center">
            {t.image ? (
              <img
                src={t.image}
                alt={t.name}
                className="w-14 h-14 rounded-full object-cover mb-3 ring-2 ring-[#0D9488]"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#0D9488] flex items-center justify-center text-sm font-medium text-white mb-3">
                {t.name?.charAt(0)}
              </div>
            )}
            <div className="font-medium text-[#2D2A26] text-lg">{t.name}</div>
            <div className="text-sm text-[#5A5349]">{t.service}</div>
          </div>
        </div>

        {/* Navigation */}
        {testimonials.length > 1 && (
          <div className="flex justify-center items-center mt-10 gap-6">
            <button
              onClick={prev}
              className="p-2 rounded-full border border-[#ddd] hover:bg-[#0D9488] hover:text-white transition"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === current
                      ? "bg-[#0D9488] scale-110"
                      : "bg-[#D6C6B3] hover:bg-[#0D9488]/50"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2 rounded-full border border-[#ddd] hover:bg-[#0D9488] hover:text-white transition"
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

export default memo(Testimonials);
