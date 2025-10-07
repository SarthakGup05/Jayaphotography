import React, { useState, useEffect, useRef } from "react";
import { Camera, Filter, Grid, Heart, Eye, ArrowUp, Sparkles, ImageIcon } from "lucide-react";
import LightGallery from "lightgallery/react";
import { toast } from "react-hot-toast";

// Import lightGallery styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-fullscreen.css";

// Import only essential plugins
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgFullscreen from "lightgallery/plugins/fullscreen";

import axiosInstance from "../lib/axiosinstance";
import Modal from "../Layout/modal";
import ContactForm from "../components/form";
import { Button } from "@/components/ui/button";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("masonry");
  const [sortBy, setSortBy] = useState("newest");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(new Set());
  const [favorites, setFavorites] = useState(new Set());

  const containerRef = useRef(null);
  const lightGalleryRef = useRef(null);

  // Preload first 3 images for instant LCP
  useEffect(() => {
    if (filteredImages.length > 0) {
      filteredImages.slice(0, 3).forEach((image) => {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = image.thumb || image.src;
        preloadLink.fetchpriority = 'high';
        document.head.appendChild(preloadLink);
      });

      return () => {
        document.querySelectorAll('link[rel="preload"][as="image"]').forEach(link => {
          if (document.head.contains(link)) {
            document.head.removeChild(link);
          }
        });
      };
    }
  }, [filteredImages]);

  // ✅ Optimized GSAP Animations - Lazy loaded
  useEffect(() => {
    if (loading || error) return;

    (async () => {
      try {
        const gsapModule = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        const gsap = gsapModule.default;
        gsap.registerPlugin(ScrollTrigger);

        let ctx = gsap.context(() => {
          // ✅ Hero - only opacity and scale
          gsap.fromTo('.hero-content',
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.hero-content',
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );

          // ✅ Filter section
          gsap.fromTo('.filter-section',
            { opacity: 0, scale: 0.98 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.filter-section',
                start: 'top 80%',
                toggleActions: 'play none none none'
              }
            }
          );

          // ✅ CTA section
          gsap.fromTo('.cta-section',
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.cta-section',
                start: 'top 80%',
                toggleActions: 'play none none none'
              }
            }
          );
        }, containerRef);

        return () => {
          ctx.revert();
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
      } catch (error) {
        console.warn("GSAP failed to load:", error);
      }
    })();
  }, [loading, error]);

  useEffect(() => {
    fetchGalleryImages();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterAndSortImages();
  }, [images, activeCategory, sortBy]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingSubmit = async (formData) => {
    try {
      const bookingData = {
        ...formData,
        source: "gallery",
        bookingType: "gallery_inquiry",
        currentCategory: activeCategory !== "all" ? activeCategory : null
      };

      const response = await axiosInstance.post("/enquiries/create-enquiry", bookingData);
      toast.success("Inquiry sent successfully! We'll contact you soon.");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to submit inquiry.";
      toast.error(errorMessage);
    }
  };

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get("/gallery/images", {
        params: {
          isActive: "true",
          sortBy: "date",
          sortOrder: "desc",
        },
      });

      const imagesData = response.data.images || response.data;
      setImages(imagesData);
    } catch (error) {
      setError("Failed to load gallery images");
      toast.error("Failed to load gallery images");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/gallery/categories");
      setCategories(response.data);
    } catch (error) {
      if (images.length > 0) {
        const uniqueCategories = [...new Set(images.map((img) => img.category))];
        setCategories(uniqueCategories);
      }
    }
  };

  const filterAndSortImages = () => {
    let filtered =
      activeCategory === "all"
        ? images
        : images.filter((img) => img.category === activeCategory);

    switch (sortBy) {
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "category":
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
        break;
    }

    setFilteredImages(filtered);
    setImagesLoaded(new Set());
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    const gallerySection = document.querySelector('#gallery-section');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleImageView = async (imageId) => {
    try {
      await axiosInstance.get(`/gallery/image/${imageId}`);
    } catch (error) {
      console.error("Error tracking image view:", error);
    }
  };

  const handleImageLoad = (imageId) => {
    setImagesLoaded(prev => new Set([...prev, imageId]));
  };

  const toggleFavorite = (imageId, event) => {
    event.preventDefault();
    event.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(imageId)) {
      newFavorites.delete(imageId);
    } else {
      newFavorites.add(imageId);
    }
    setFavorites(newFavorites);
  };

  // ✅ Fixed heights to prevent CLS
  const getMasonryHeight = (index) => {
    const heights = [300, 350, 280, 380, 320, 360, 300, 340];
    return heights[index % heights.length];
  };

  // ✅ Loading skeleton with proper aspect ratios
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f3e6fa] via-white to-[#f3e6fa]/70 py-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header skeleton */}
          <div className="text-center mb-16">
            <div className="h-16 w-64 bg-gray-200 rounded mx-auto mb-6 animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>

          {/* Filter skeleton */}
          <div className="bg-white/70 rounded-3xl p-8 mb-12">
            <div className="flex gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 w-32 bg-gray-200 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Gallery skeleton with fixed aspect ratios */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="mb-6 break-inside-avoid bg-gray-200 rounded-2xl animate-pulse"
                style={{ height: `${getMasonryHeight(i)}px`, aspectRatio: '4/5' }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f3e6fa] via-white to-[#f3e6fa]/70">
        <div className="text-center max-w-md">
          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Gallery Unavailable</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchGalleryImages}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-[#f3e6fa] via-white to-[#f3e6fa]/50">
      {/* Simplified Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-pink-200/25 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4">
        <div className="hero-content max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-light text-gray-800 mb-6 tracking-tight">
            Our{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent font-medium">
              Gallery
            </span>
          </h1>

          <p className="text-xl md:text-2xl font-light text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Explore our curated collection of captured moments, where every image tells a story of love, joy, and life's most treasured memories.
          </p>
        </div>
      </section>

      {/* Filter Controls */}
      <section className="filter-section max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === "all"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl"
                    : "bg-white/80 text-gray-700 hover:bg-white border border-gray-200"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Grid className="w-4 h-4" />
                  All Photos ({images.length})
                </span>
              </button>
              {categories.map((category) => {
                const count = images.filter((img) => img.category === category).length;
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 capitalize ${
                      activeCategory === category
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl"
                        : "bg-white/80 text-gray-700 hover:bg-white border border-gray-200"
                    }`}
                  >
                    {category} ({count})
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="newest">Latest First</option>
                  <option value="title">Alphabetical</option>
                  <option value="category">By Category</option>
                </select>
              </div>

              <div className="flex bg-white/80 border border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("masonry")}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    viewMode === "masonry"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-purple-600"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-purple-600"
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-purple-50 px-6 py-3 rounded-full border border-purple-100">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              <p className="text-gray-700 font-medium">
                Showing {filteredImages.length} {filteredImages.length === 1 ? "image" : "images"}
                {activeCategory !== "all" && (
                  <span className="text-purple-600 font-semibold"> in {activeCategory}</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery-section" className="max-w-7xl mx-auto px-4 pb-16 relative z-10">
        {filteredImages.length === 0 ? (
          <div className="text-center py-20 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl">
            <Camera className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-gray-800 mb-4">No Images Found</h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              {activeCategory !== "all"
                ? `No images found in the ${activeCategory} category.`
                : "No images available at the moment."}
            </p>
          </div>
        ) : (
          <LightGallery
            ref={lightGalleryRef}
            speed={400}
            plugins={[lgThumbnail, lgZoom, lgFullscreen]}
            mode="lg-fade"
            thumbnail={true}
            download={false}
            selector=".gallery-item"
            onBeforeSlide={(detail) => {
              const currentImage = filteredImages[detail.index];
              if (currentImage) {
                handleImageView(currentImage.id);
              }
            }}
          >
            <div
              className={
                viewMode === "masonry"
                  ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              }
            >
              {filteredImages.map((image, index) => (
                <a
                  key={image.id}
                  className={`gallery-item group cursor-pointer block ${
                    viewMode === "masonry" ? "mb-6 break-inside-avoid" : ""
                  } transition-all duration-300 relative`}
                  data-src={image.src}
                  data-sub-html={`
                    <div class="lg-sub-html">
                      <h4 style="margin-bottom: 8px; font-size: 20px; font-weight: 600;">${image.title}</h4>
                      <p style="margin-bottom: 12px; opacity: 0.9;">${image.description || ""}</p>
                      <div style="display: flex; gap: 16px; font-size: 14px; opacity: 0.8;">
                        <span>📷 ${image.category}</span>
                        <span>📅 ${formatDate(image.date || image.createdAt)}</span>
                      </div>
                    </div>
                  `}
                  href={image.src}
                  style={{ contain: 'layout style paint' }}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
                    {/* Featured Badge */}
                    {image.featured && (
                      <div className="absolute top-4 left-4 z-20">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                          ⭐ Featured
                        </span>
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(image.id, e)}
                      className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Heart 
                        className={`w-4 h-4 ${
                          favorites.has(image.id) 
                            ? 'text-red-500 fill-red-500' 
                            : 'text-gray-600'
                        }`} 
                      />
                    </button>

                    {/* Skeleton */}
                    {!imagesLoaded.has(image.id) && (
                      <div 
                        className="absolute inset-0 bg-gray-200 animate-pulse"
                        style={
                          viewMode === "masonry"
                            ? { height: `${getMasonryHeight(index)}px` }
                            : { height: '320px' }
                        }
                      />
                    )}

                    <div className="relative overflow-hidden">
                      <img
                        src={image.thumb}
                        alt={image.alt}
                        width="400"
                        height={viewMode === "masonry" ? getMasonryHeight(index) : 320}
                        className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                          imagesLoaded.has(image.id) ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={
                          viewMode === "masonry" 
                            ? { height: `${getMasonryHeight(index)}px`, aspectRatio: '4/5' } 
                            : { height: '320px', aspectRatio: '4/5' }
                        }
                        loading={index < 12 ? "eager" : "lazy"}
                        fetchpriority={index < 3 ? "high" : "auto"}
                        decoding={index < 12 ? "sync" : "async"}
                        onLoad={() => handleImageLoad(image.id)}
                        onError={(e) => {
                          if (e.target.src !== image.src) {
                            e.target.src = image.src;
                          }
                        }}
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/95 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                          <Eye className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h4 className="font-semibold text-lg mb-1">{image.title}</h4>
                      <p className="text-sm opacity-90 capitalize">{image.category}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </LightGallery>
        )}
      </section>

      {/* CTA Section */}
      <section className="cta-section max-w-5xl mx-auto px-4 pb-20 relative z-10">
        <div className="text-center py-16 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600"></div>
          
          <div className="relative z-10">
            <div className="inline-flex p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full shadow-lg mb-4">
              <Camera className="w-12 h-12 text-purple-600" />
            </div>
            
            <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Love What You See?
            </h3>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Ready to create your own beautiful memories? Let's discuss your photography vision.
            </p>
            
            <Modal
              trigger={
                <Button className="cursor-pointer rounded-full px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-2xl transition-all duration-300 text-lg">
                  <span className="flex items-center gap-3">
                    <Camera className="w-6 h-6" />
                    Start Your Session
                    <Sparkles className="w-5 h-5" />
                  </span>
                </Button>
              }
              title="📸 Book Your Dream Session"
              description="Share your vision with us and we'll craft a personalized photography experience."
              className="sm:max-w-[700px]"
            >
              {({ close }) => (
                <ContactForm
                  initialData={{
                    serviceType: activeCategory !== "all" ? activeCategory : "",
                    message: `Hello! I've been exploring your gallery${activeCategory !== "all" ? ` and I'm drawn to your ${activeCategory} photography` : ""}. I'd love to discuss creating something similar.`
                  }}
                  onSubmit={async (formData) => {
                    await handleBookingSubmit(formData);
                    close();
                  }}
                />
              )}
            </Modal>
          </div>
        </div>
      </section>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-8 z-50 p-4 bg-white/95 hover:bg-white text-purple-600 rounded-full shadow-2xl transition-all duration-300"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      <style jsx global>{`
        /* ✅ Prevent layout shifts */
        img {
          max-width: 100%;
          height: auto;
          display: block;
        }

        .gallery-item {
          contain: layout style paint;
        }

        /* ✅ Masonry specific */
        .columns-1, .columns-2, .columns-3, .columns-4 {
          column-gap: 1.5rem;
        }

        .break-inside-avoid {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .lg-outer .lg-toolbar {
          background: linear-gradient(135deg, rgba(243, 230, 250, 0.95) 0%, rgba(232, 213, 255, 0.95) 100%);
          backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  );
};

export default Gallery;
