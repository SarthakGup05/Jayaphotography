import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Camera, ChevronLeft, ChevronRight, X } from 'lucide-react';

const MaternityPhotography = () => {
  const [activeCategory, setActiveCategory] = useState('first');
  const [selectedImage, setSelectedImage] = useState(null);

  // Animation refs
  const heroRef = useRef();
  const navRef = useRef();
  const galleryRef = useRef();
  const ctaRef = useRef();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(heroRef.current, { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" });
    gsap.fromTo(navRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power2.out" });
    gsap.fromTo(galleryRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, delay: 0.5, ease: "power2.out", scrollTrigger: { trigger: galleryRef.current, start: "top 90%" } });
    gsap.fromTo(ctaRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: 0.7, ease: "power2.out", scrollTrigger: { trigger: ctaRef.current, start: "top 95%" } });
    return () => { ScrollTrigger.getAll().forEach(trigger => trigger.kill()); };
  }, [activeCategory]);

  const categories = {
    first: {
      title: "First Trimester",
      subtitle: "The Beginning of Wonder",
      description: "Capturing the intimate moments of early pregnancy – the subtle glow, the tender touches, and the quiet anticipation.",
      images: [
        { id: 1, src: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600", alt: "Early pregnancy portrait" },
        { id: 2, src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600", alt: "Couple's first trimester" },
        { id: 3, src: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600", alt: "Intimate early pregnancy" },
        { id: 4, src: "https://images.unsplash.com/photo-1559032556-b3b4e8e90f2c?w=600", alt: "First trimester lifestyle" }
      ],
      color: "from-pink-200 to-rose-300"
    },
    second: {
      title: "Second Trimester",
      subtitle: "Blossoming Beauty",
      description: "The golden period of pregnancy when you're glowing with health and energy. We capture the emerging bump, the radiant smile, and the confident beauty that comes with this magical time.",
      images: [
        { id: 5, src: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600", alt: "Second trimester glow" },
        { id: 6, src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600", alt: "Maternity fashion shoot" },
        { id: 7, src: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600", alt: "Outdoor maternity session" },
        { id: 8, src: "https://images.unsplash.com/photo-1559032556-b3b4e8e90f2c?w=600", alt: "Second trimester portrait" }
      ],
      color: "from-purple-200 to-pink-200"
    },
    third: {
      title: "Third Trimester",
      subtitle: "Ready to Meet You",
      description: "The final stretch filled with anticipation and love. These sessions celebrate the full beauty of pregnancy, the strong bond between parents, and the excitement of meeting your little one soon.",
      images: [
        { id: 9, src: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600", alt: "Third trimester beauty" },
        { id: 10, src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600", alt: "Full term maternity" },
        { id: 11, src: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600", alt: "Expecting parents" },
        { id: 12, src: "https://images.unsplash.com/photo-1559032556-b3b4e8e90f2c?w=600", alt: "Third trimester lifestyle" }
      ],
      color: "from-blue-200 to-purple-200"
    }
  };

  const ImageModal = ({ image, onClose, onPrev, onNext }) => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-2xl w-full max-h-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X size={32} />
        </button>
        <img 
          src={image.src} 
          alt={image.alt}
          className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg"
        />
        <button
          onClick={onPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/40 rounded-full p-2"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={onNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/40 rounded-full p-2"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );

  const currentImages = categories[activeCategory].images;
  const currentImageIndex = selectedImage ? currentImages.findIndex(img => img.id === selectedImage.id) : -1;

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setSelectedImage(currentImages[currentImageIndex - 1]);
    } else {
      setSelectedImage(currentImages[currentImages.length - 1]);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < currentImages.length - 1) {
      setSelectedImage(currentImages[currentImageIndex + 1]);
    } else {
      setSelectedImage(currentImages[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-purple-50 flex flex-col items-center px-2">
      {/* Hero Section */}
      <section ref={heroRef} className="w-full max-w-2xl mx-auto text-center pt-24 pb-10">
        <Camera className="mx-auto mb-4 w-14 h-14 text-pink-200 opacity-40" />
        <h1 className="text-4xl md:text-5xl font-light mb-2 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          Maternity Magic
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-2 font-light">
          Capturing the most beautiful journey of your life with artistic elegance and heartfelt emotion.
        </p>
      </section>

      {/* Navigation Pills */}
      <nav ref={navRef} className="w-full max-w-xl mx-auto flex justify-center gap-2 mb-8">
        {Object.entries(categories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-5 py-2 rounded-full text-sm font-light transition-all duration-200 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-200/40 ${
              activeCategory === key
                ? `bg-gradient-to-r ${category.color} text-white shadow-md scale-105`
                : 'bg-white text-gray-600 hover:bg-pink-50'
            }`}
          >
            {category.title}
          </button>
        ))}
      </nav>

      {/* Category Info */}
      <div className="w-full max-w-xl mx-auto text-center mb-10">
        <h2 className={`text-2xl font-light mb-1 bg-gradient-to-r ${categories[activeCategory].color} bg-clip-text text-transparent`}>
          {categories[activeCategory].subtitle}
        </h2>
        <p className="text-gray-500 text-base mb-2 font-light">
          {categories[activeCategory].description}
        </p>
      </div>

      {/* Gallery */}
      <section ref={galleryRef} className="w-full max-w-2xl mx-auto mb-14">
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {categories[activeCategory].images.map((image, idx) => (
            <div
              key={image.id}
              className="mb-6 break-inside-avoid relative overflow-hidden rounded-2xl shadow-md bg-white cursor-pointer group"
              onClick={() => setSelectedImage(image)}
              style={{ minHeight: 0 }}
            >
              <div className="aspect-[4/5] w-full h-full flex items-center justify-center overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute top-3 right-3 bg-white/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="w-5 h-5 text-pink-300" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="w-full max-w-xl mx-auto text-center mb-20">
        <div className="bg-white/80 rounded-2xl px-8 py-10 shadow border border-pink-100">
          <h3 className="text-2xl font-light text-gray-800 mb-3">
            Ready to Capture Your Journey?
          </h3>
          <p className="text-base text-gray-600 mb-7 font-light">
            Let's create timeless memories that celebrate this incredible chapter of your life.
          </p>
          <button className={`bg-gradient-to-r ${categories[activeCategory].color} text-white px-8 py-3 rounded-full font-light shadow hover:scale-105 transition-transform duration-200`}>
            Book Your Session
          </button>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
        />
      )}
    </div>
  );
};

export default MaternityPhotography;