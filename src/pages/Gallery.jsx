import React, { useState, useEffect, useRef } from "react";
import { Camera, Filter, Grid, Heart, Eye, Calendar, Tag, ArrowUp, Sparkles, Image as ImageIcon } from "lucide-react";
import LightGallery from "lightgallery/react";
import { toast } from "react-hot-toast";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Import lightGallery styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-fullscreen.css";
import "lightgallery/css/lg-share.css";
import "lightgallery/css/lg-autoplay.css";
import "lightgallery/css/lg-pager.css";
import "lightgallery/css/lg-rotate.css";

// Import plugins
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import lgShare from "lightgallery/plugins/share";
import lgAutoplay from "lightgallery/plugins/autoplay";
import lgPager from "lightgallery/plugins/pager";
import lgRotate from "lightgallery/plugins/rotate";

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
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [favorites, setFavorites] = useState(new Set());

  const containerRef = useRef(null);
  const lightGalleryRef = useRef(null);

  // GSAP Animations
  useEffect(() => {
    if (loading || error) return;

    let ctx = gsap.context(() => {
      // Set initial states for scroll-triggered elements
      gsap.set(['.hero-content', '.filter-section', '.gallery-item', '.cta-section'], {
        autoAlpha: 0,
        y: 50
      });

      // Hero section fast entrance
      gsap.fromTo('.hero-content',
        {
          autoAlpha: 0,
          y: 60,
          scale: 0.9
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.hero-content',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Filter section slide up
      gsap.fromTo('.filter-section',
        {
          autoAlpha: 0,
          y: 40
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.filter-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Gallery items staggered animation
      gsap.utils.toArray('.gallery-item').forEach((item, index) => {
        gsap.fromTo(item,
          {
            autoAlpha: 0,
            y: 30,
            scale: 0.9
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
            delay: Math.min(index * 0.05, 1), // Cap delay at 1s
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // CTA section entrance
      gsap.fromTo('.cta-section',
        {
          autoAlpha: 0,
          y: 50,
          scale: 0.95
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Floating background elements
      gsap.fromTo('.floating-bg',
        {
          autoAlpha: 0,
          scale: 0.5
        },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.hero-content',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );

    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [loading, error, filteredImages]);

  // Fast hover animations for gallery items
  useEffect(() => {
    if (loading || error) return;

    const galleryItems = gsap.utils.toArray('.gallery-item');
    galleryItems.forEach(item => {
      const hoverTl = gsap.timeline({ paused: true });
      hoverTl
        .to(item, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        })
        .to(item.querySelector('img'), {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out'
        }, 0);

      item.addEventListener('mouseenter', () => hoverTl.play());
      item.addEventListener('mouseleave', () => hoverTl.reverse());
    });

  }, [filteredImages, loading, error]);

  useEffect(() => {
    fetchGalleryImages();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterAndSortImages();
  }, [images, activeCategory, sortBy]);

  // Scroll to top functionality
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
      
      toast.success("Inquiry sent successfully! We'll contact you soon to discuss your photography needs.");
      
      console.log("Gallery inquiry response:", response.data);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to submit inquiry. Please try again.";
      toast.error(errorMessage);
      console.error("Gallery booking error:", error);
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

      console.log("Fetched images:", imagesData);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
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
      console.error("Error fetching categories:", error);
      if (images.length > 0) {
        const uniqueCategories = [
          ...new Set(images.map((img) => img.category)),
        ];
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
        filtered.sort(
          (a, b) =>
            new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
        );
        break;
    }

    setFilteredImages(filtered);
    setImagesLoaded(0);
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

  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1);
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

  const getMasonryHeight = (index) => {
    const heights = [300, 350, 260, 380, 320, 400, 280, 360];
    return heights[index % heights.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f3e6fa] via-white to-[#f3e6fa]/70">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
            <Camera className="absolute inset-0 m-auto w-8 h-8 text-purple-600 animate-pulse" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Loading Gallery</h3>
            <p className="text-gray-600 animate-pulse">Preparing beautiful moments for you...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f3e6fa] via-white to-[#f3e6fa]/70">
        <div className="text-center max-w-md">
          <div className="mb-6 p-4 bg-white rounded-full shadow-lg inline-block">
            <Camera className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Gallery Unavailable</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchGalleryImages}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-[#f3e6fa] via-white to-[#f3e6fa]/50">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-bg absolute top-20 left-10 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="floating-bg absolute top-40 right-20 w-40 h-40 bg-pink-200/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="floating-bg absolute bottom-32 left-1/3 w-36 h-36 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="hero-content max-w-6xl mx-auto text-center relative z-10">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-light text-gray-800 mb-6 tracking-tight">
            Our{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent font-medium">
              Gallery
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl font-light text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Explore our curated collection of captured moments, where every image tells a story of love, joy, and life's most treasured memories.
          </p>
        </div>
      </section>

      {/* Enhanced Filter Controls */}
      <section className="filter-section max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === "all"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl ring-4 ring-purple-200"
                    : "bg-white/80 text-gray-700 hover:bg-white border border-gray-200 hover:border-purple-300 hover:text-purple-600"
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
                    className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 capitalize transform hover:scale-105 ${
                      activeCategory === category
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl ring-4 ring-purple-200"
                        : "bg-white/80 text-gray-700 hover:bg-white border border-gray-200 hover:border-purple-300 hover:text-purple-600"
                    }`}
                  >
                    {category} ({count})
                  </button>
                );
              })}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                >
                  <option value="newest">Latest First</option>
                  <option value="title">Alphabetical</option>
                  <option value="category">By Category</option>
                </select>
              </div>

              <div className="flex bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("masonry")}
                  className={`p-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    viewMode === "masonry"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                  }`}
                  title="Masonry Layout"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                  }`}
                  title="Grid Layout"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Results Info */}
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
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full inline-block mb-6">
              <Camera className="w-16 h-16 text-purple-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">No Images Found</h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              {activeCategory !== "all"
                ? `No images found in the ${activeCategory} category. Try browsing other categories.`
                : "No images available at the moment. Please check back later for new content."}
            </p>
          </div>
        ) : (
          <LightGallery
            ref={lightGalleryRef}
            speed={500}
            plugins={[
              lgThumbnail,
              lgZoom,
              lgFullscreen,
              lgAutoplay,
              lgPager,
              lgRotate,
            ]}
            mode="lg-fade"
            thumbnail={true}
            download={false}
            autoplayFirstVideo={false}
            pager={false}
            zoomFromOrigin={false}
            allowMediaOverlap={true}
            toggleThumb={true}
            showZoomInOutIcons={true}
            actualSize={true}
            exThumbImage="data-exthumbimage"
            iframeMaxWidth="60%"
            closable={true}
            mousewheel={true}
            getCaptionFromTitleOrAlt={false}
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
                  ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-0"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:columns-3 xl:grid-cols-4 gap-6"
              }
            >
              {filteredImages.map((image, index) => (
                <a
                  key={image.id}
                  className={`gallery-item group cursor-pointer block ${
                    viewMode === "masonry" ? "mb-6 break-inside-avoid" : ""
                  } transition-all duration-300 hover:z-10 relative`}
                  data-src={image.src}
                  data-sub-html={`
                    <div class="lg-sub-html">
                      <h4 style="margin-bottom: 8px; font-size: 20px; font-weight: 600; color: #fff;">${
                        image.title
                      }</h4>
                      <p style="margin-bottom: 12px; opacity: 0.9; color: #fff;">${
                        image.description || ""
                      }</p>
                      <div style="display: flex; align-items: center; gap: 16px; font-size: 14px; opacity: 0.8; color: #fff;">
                        <span>📷 ${image.category}</span>
                        <span>📅 ${formatDate(image.date || image.createdAt)}</span>
                      </div>
                    </div>
                  `}
                  data-exthumbimage={image.thumb}
                  href={image.src}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white group-hover:shadow-purple-200/50">
                    {/* Featured Badge */}
                    {image.featured && (
                      <div className="absolute top-4 left-4 z-20">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg flex items-center gap-1">
                          ⭐ Featured
                        </span>
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(image.id, e)}
                      className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                    >
                      <Heart 
                        className={`w-4 h-4 transition-all duration-200 ${
                          favorites.has(image.id) 
                            ? 'text-red-500 fill-red-500' 
                            : 'text-gray-600 hover:text-red-500'
                        }`} 
                      />
                    </button>

                    <div className="relative overflow-hidden">
                      <img
                        src={image.thumb}
                        alt={image.alt}
                        className={`w-full object-cover transition-all duration-500 group-hover:scale-110 ${
                          viewMode === "masonry" ? "h-auto" : "h-80"
                        }`}
                        style={
                          viewMode === "masonry" 
                            ? { height: `${getMasonryHeight(index)}px` } 
                            : {}
                        }
                        loading="lazy"
                        onLoad={handleImageLoad}
                        onError={(e) => {
                          if (e.target.src !== image.src) {
                            e.target.src = image.src;
                          }
                        }}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* View Icon */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="bg-white/95 backdrop-blur-sm rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100 shadow-xl">
                          <Eye className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                    </div>

                    {/* Image Info */}
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

      {/* Call to Action */}
      <section className="cta-section max-w-5xl mx-auto px-4 pb-20 relative z-10">
        <div className="text-center py-16 bg-gradient-to-br from-white/80 via-white/90 to-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600"></div>
          
          <div className="relative z-10">
            <div className="mb-8">
              <div className="inline-flex p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full shadow-lg mb-4">
                <Camera className="w-12 h-12 text-purple-600" />
              </div>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Love What You See?
            </h3>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Ready to create your own beautiful memories? Let's discuss your photography vision and bring it to life with our professional expertise.
            </p>
            
            <Modal
              trigger={
                <Button className="cursor-pointer rounded-full px-12 py-6 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white font-bold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 text-lg border-0">
                  <span className="flex items-center gap-3">
                    <Camera className="w-6 h-6" />
                    Start Your Session
                    <Sparkles className="w-5 h-5" />
                  </span>
                </Button>
              }
              title={
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">📸</span>
                  <div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Book Your Dream Session
                    </span>
                    <div className="text-sm text-gray-600 font-normal">
                      Let's create something beautiful together
                    </div>
                  </div>
                </div>
              }
              description="Inspired by our gallery? Share your vision with us and we'll craft a personalized photography experience that captures your unique story perfectly."
              className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto"
            >
              {({ close }) => (
                <ContactForm
                  initialData={{
                    serviceType: activeCategory !== "all" ? activeCategory : "",
                    message: `Hello! I've been exploring your beautiful gallery${activeCategory !== "all" ? ` and I'm particularly drawn to your ${activeCategory} photography` : ""}. I'd love to discuss creating something similar for myself. Could we talk about your packages and availability?`
                  }}
                  submitButtonText="Send My Inquiry"
                  onSubmit={async (formData) => {
                    await handleBookingSubmit(formData);
                    close();
                  }}
                  className="max-w-none"
                />
              )}
            </Modal>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-8 z-50 p-4 bg-white/95 backdrop-blur-sm hover:bg-white text-purple-600 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border border-purple-100"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .lg-outer .lg-thumb-outer {
          background: linear-gradient(135deg, #f3e6fa 0%, #e8d5ff 100%);
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
