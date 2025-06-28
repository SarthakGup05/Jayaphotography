import React, { useState, useRef, useEffect } from "react";
import { Baby, Heart, Star, Camera, ChevronRight, Play } from "lucide-react";
import Slider from "react-slick";
import gsap from "gsap";
// Add LightGallery imports
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

const BabyPhotographyPage = () => {
  const [activeCategory, setActiveCategory] = useState("newborn");
  const [selectedImage, setSelectedImage] = useState(null);

  // Animation refs
  const heroRef = useRef();
  const navRef = useRef();
  const descRef = useRef();
  const sliderRef = useRef();
  const galleryRef = useRef();
  const ctaRef = useRef();

  useEffect(() => {
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out" }
    );
    gsap.fromTo(
      descRef.current,
      { opacity: 0, x: -60 },
      { opacity: 1, x: 0, duration: 1, delay: 0.4, ease: "power3.out" }
    );
    gsap.fromTo(
      sliderRef.current,
      { opacity: 0, x: 60 },
      { opacity: 1, x: 0, duration: 1, delay: 0.6, ease: "power3.out" }
    );
    gsap.fromTo(
      galleryRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: "power3.out" }
    );
    gsap.fromTo(
      ctaRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, delay: 1, ease: "power3.out" }
    );
  }, [activeCategory]);

  const categories = {
    newborn: {
      title: "Newborn Photography",
      subtitle: "0-2 Weeks",
      description:
        "Capture the first precious moments of your little one's life. Our newborn sessions focus on creating timeless, artistic portraits that showcase the delicate beauty and innocence of your baby's earliest days. We specialize in safe posing techniques and use gentle lighting to create dreamy, ethereal images that you'll treasure forever.",
      features: [
        "Safe posing techniques",
        "Gentle studio lighting",
        "Props and wraps included",
        "Parent + baby shots",
        "Artistic black & white options",
      ],
      images: [
        "https://images.unsplash.com/photo-1560251180-24d389314061?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG5ldyUyMGJvcm58ZW58MHx8MHx8fDA%3D",
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1546015720-b8b30df5aa27?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1544268211-ba72491bf350?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fG5ldyUyMGJvcm58ZW58MHx8MHx8fDA%3D",
        "https://images.unsplash.com/photo-1630650916169-87efcfd2cd3a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG5ldyUyMGJvcm58ZW58MHx8MHx8fDA%3D",
      ],
      color: "from-pink-200 to-rose-200",
    },
    sixmonths: {
      title: "6-Month Sessions",
      subtitle: "4-8 Months",
      description:
        "Celebrate your baby's milestone moments with our 6-month photography sessions. At this stage, babies are full of personality, able to sit up, and show beautiful expressions. We capture their curious nature, adorable giggles, and emerging personality in both studio and natural light settings.",
      features: [
        "Sitting milestone capture",
        "Interactive play sessions",
        "Colorful props and toys",
        "Family interaction shots",
        "Natural expressions",
      ],
      images: [
        "https://images.unsplash.com/photo-1560155001-dde9ad4954fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1534982841079-afde227ada8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1499887142886-791eca5918cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1520529277867-dbf8c5e0b340?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1544013778-5f85b962508a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      ],
      color: "from-blue-200 to-cyan-200",
    },
    toddler: {
      title: "Toddler Photography",
      subtitle: "1-3 Years",
      description:
        "Toddlers are full of energy, curiosity, and boundless personality! Our toddler sessions are designed to capture their unique spirit through playful, candid moments. We use interactive techniques to bring out genuine smiles and showcase their developing independence and character.",
      features: [
        "Active play sessions",
        "Candid lifestyle shots",
        "Outdoor location options",
        "Personality-driven poses",
        "Sibling interactions",
      ],
      images: [
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1512552288940-3a300922a275?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1495131292899-bc096577e8f5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dG9kZGxlcnxlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1519689373023-dd07c7988603?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      ],
      color: "from-green-200 to-emerald-200",
    },
  };

  const currentCategory = categories[activeCategory];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    adaptiveHeight: true,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-blue-50">
      {/* Hero Section */}
      <section ref={heroRef} className="relative flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-r from-pink-100 via-rose-50 to-orange-50 overflow-hidden mt-16">
        <div className="absolute inset-0 bg-white/40 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <span className="inline-flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full border border-pink-200/50 text-xs text-pink-600 font-light tracking-wide">
            Precious Moments
          </span>
          <h1
            className="text-4xl md:text-5xl font-thin text-gray-800 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Baby{" "}
            <span className="font-thin text-pink-500"> Photography</span>
          </h1>
          <p className="text-base md:text-lg font-light text-gray-600 max-w-2xl text-center">
            Capturing the fleeting moments of your little one's journey from
            their first breath to their first steps. Each stage brings unique
            beauty that deserves to be preserved forever.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            <span className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full text-xs text-gray-500">
              <Heart className="w-3 h-3 text-pink-400" />
              Safe & Gentle
            </span>
            <span className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full text-xs text-gray-500">
              <Star className="w-3 h-3 text-yellow-400" />
              Award-Winning
            </span>
            <span className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full text-xs text-gray-500">
              <Camera className="w-3 h-3 text-blue-400" />
              Pro Studio
            </span>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <nav ref={navRef} className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-1 shadow border border-white/20">
            <div className="flex gap-1">
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-4 py-2 rounded-lg font-light text-sm tracking-wide transition-all duration-300 ${
                    activeCategory === key
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow"
                      : "text-gray-600 hover:text-pink-600 hover:bg-white/60"
                  }`}
                >
                  <div className="text-center">
                    <div>{category.title.split(" ")[0]}</div>
                    <div className="text-[10px] opacity-75">
                      {category.subtitle}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Category Content */}
      <section className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-start mb-16">
        {/* Left: Description */}
        <div ref={descRef} className="space-y-6">
          <div className="space-y-4">
            <span
              className={`inline-block px-4 py-2 bg-gradient-to-r ${currentCategory.color} rounded-full text-xs text-gray-700 font-light`}
            >
              {currentCategory.subtitle}
            </span>
            <h2
              className="text-2xl md:text-3xl font-thin text-gray-800"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {currentCategory.title}
            </h2>
            <p className="text-sm md:text-base font-light text-gray-600">
              {currentCategory.description}
            </p>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-light text-gray-800 mb-2">
              What's Included
            </h3>
            <ul className="space-y-1">
              {currentCategory.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 text-gray-600 font-light text-sm"
                >
                  <ChevronRight className="w-3 h-3 text-pink-400" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <button className="group bg-gradient-to-r from-pink-500 to-rose-500 text-white font-light px-6 py-3 rounded-xl text-sm hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-300 shadow hover:shadow-lg">
            <span className="flex items-center gap-2">
              <span>Book This Session</span>
              <Camera className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </span>
          </button>
        </div>

        {/* Right: Featured Image Slider */}
        <div ref={sliderRef} className="relative">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <Slider {...sliderSettings}>
              {currentCategory.images.map((img, idx) => (
                <div key={idx}>
                  <img
                    src={img}
                    alt={currentCategory.title}
                    className="w-full h-72 object-cover rounded-2xl"
                  />
                </div>
              ))}
            </Slider>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-base font-light">{currentCategory.title}</p>
              <p className="text-white/80 text-xs font-light">
                {currentCategory.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section ref={galleryRef} className="max-w-6xl mx-auto px-4 mb-16">
        <div className="text-center mb-6">
          <h3
            className="text-2xl font-thin text-gray-800"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Gallery
          </h3>
          <p className="text-sm font-light text-gray-600">
            Recent work from our {currentCategory.title.toLowerCase()} sessions
          </p>
        </div>
        <LightGallery
          speed={500}
          plugins={[lgThumbnail, lgZoom]}
          elementClassNames="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2"
        >
          {currentCategory.images.map((image, index) => (
            <a
              key={index}
              href={image}
              data-lg-size="600-600"
              className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer shadow hover:shadow-lg"
            >
              <img
                src={image}
                alt={`${currentCategory.title} ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Play className="w-6 h-6 text-white" />
              </div>
            </a>
          ))}
        </LightGallery>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-2xl max-h-full">
            <img
              src={selectedImage}
              alt="Gallery image"
              className="w-full h-full object-contain rounded-xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white p-1 rounded-full hover:bg-white/30 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section ref={ctaRef} className="text-center mt-10 py-10 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl max-w-3xl mx-auto mb-10">
        <h3
          className="text-xl font-thin text-gray-800 mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Ready to Capture These Precious Moments?
        </h3>
        <p className="text-sm font-light text-gray-600 mb-5 max-w-xl mx-auto">
          Every day your little one grows and changes. Don't let these fleeting
          moments slip away. Book your session today and create memories that
          will last a lifetime.
        </p>
        <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-light px-8 py-3 rounded-xl text-sm hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-300 shadow hover:shadow-lg">
          Schedule Your Session
        </button>
      </section>
    </div>
  );
};

export default BabyPhotographyPage;
