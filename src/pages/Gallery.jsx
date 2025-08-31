import React, { useState, useEffect, useRef } from "react";
import { Camera, Filter, Grid, Heart, Eye, Calendar, Tag, ArrowUp } from "lucide-react";
import LightGallery from "lightgallery/react";
import { toast } from "react-hot-toast";

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

  const lightGalleryRef = useRef(null);

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
    setImagesLoaded(0); // Reset loaded counter when filters change
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    // Add smooth scroll to gallery section
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

  // Enhanced masonry heights for more variation
  const getMasonryHeight = (index) => {
    const heights = [280, 320, 240, 360, 300, 380, 260, 340];
    return heights[index % heights.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#9575CD' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <Camera className="absolute inset-0 m-auto w-6 h-6 text-white animate-pulse" />
          </div>
          <p className="text-white font-light animate-pulse">
            Loading beautiful memories...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#9575CD' }}>
        <div className="text-center">
          <Camera className="w-16 h-16 text-white mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-light text-white mb-2">
            Gallery Unavailable
          </h2>
          <p className="text-white/80 mb-4">{error}</p>
          <button
            onClick={fetchGalleryImages}
            className="bg-white text-purple-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: `#D3D3FF`, }}>
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-purple-600/10 to-pink-500/20 pointer-events-none"></div>
      
      {/* Hero Section with enhanced animations */}
      <section className="relative py-20 px-4 overflow-hidden mt-16" style={{ backgroundColor: 'rgba(250, 240, 220, 0.95)' }}>
        <div className="absolute inset-0 bg-white/10 pointer-events-none" />
        
        {/* Floating elements for decoration */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-300/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-300 text-sm text-black font-light tracking-wide mb-8 hover:bg-white/80 transition-all duration-300 transform hover:scale-105">
            <Camera className="w-5 h-5" />
            Professional Portfolio
          </span>
          <h1
            className="text-5xl md:text-7xl font-light text-black tracking-tight mb-8 animate-fade-in"
            style={{ fontFamily: "Raleway, sans-serif" }}
          >
            Photography{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium">
              Gallery
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover our collection of captured moments, each telling a unique
            story of love, joy, and life's most precious memories.
          </p>
        </div>
      </section>

      {/* Enhanced Filter Controls */}
      <section className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Category Filters with enhanced styling */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeCategory === "all"
                    ? "bg-white text-purple-700 shadow-xl ring-2 ring-purple-300"
                    : "bg-white/20 text-white hover:bg-white/30 border border-white/30 hover:border-white/50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Grid className="w-4 h-4" />
                  All ({images.length})
                </span>
              </button>
              {categories.map((category) => {
                const count = images.filter((img) => img.category === category).length;
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 capitalize transform hover:scale-105 ${
                      activeCategory === category
                        ? "bg-white text-purple-700 shadow-xl ring-2 ring-purple-300"
                        : "bg-white/20 text-white hover:bg-white/30 border border-white/30 hover:border-white/50"
                    }`}
                  >
                    {category} ({count})
                  </button>
                );
              })}
            </div>

            {/* Enhanced View Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-black" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 transition-all duration-300"
                >
                  <option value="newest" className="text-purple-700 bg-white">Latest First</option>
                  <option value="title" className="text-purple-700 bg-white">Alphabetical</option>
                  <option value="category" className="text-purple-700 bg-white">By Category</option>
                </select>
              </div>

              <div className="flex bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("masonry")}
                  className={`p-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    viewMode === "masonry"
                      ? "bg-white text-purple-700 shadow-lg"
                      : "text-white hover:text-white hover:bg-white/20"
                  }`}
                  title="Masonry Layout"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    viewMode === "grid"
                      ? "bg-white text-purple-700 shadow-lg"
                      : "text-white hover:text-white hover:bg-white/20"
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

          {/* Enhanced Results Info */}
          <div className="mt-6 text-center">
            <p className="text-white font-light text-lg">
              Showing{" "}
              <span className="font-semibold bg-white/20 px-3 py-1 rounded-full">
                {filteredImages.length}
              </span>{" "}
              {filteredImages.length === 1 ? "image" : "images"}
              {activeCategory !== "all" && (
                <span>
                  {" "}in{" "}
                  <span className="font-medium capitalize bg-white/20 px-3 py-1 rounded-full ml-2">
                    {activeCategory}
                  </span>{" "}
                  category
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Gallery Section */}
      <section id="gallery-section" className="max-w-7xl mx-auto px-4 pb-16 relative z-10">
        {filteredImages.length === 0 ? (
          <div className="text-center py-20 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20">
            <Camera className="w-20 h-20 text-white/60 mx-auto mb-6 animate-bounce" />
            <h3 className="text-2xl font-light text-white mb-4">No images found</h3>
            <p className="text-white/70 text-lg">
              {activeCategory !== "all"
                ? `No images found in the ${activeCategory} category.`
                : "No images available at the moment. Please check back later."}
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
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              }
            >
              {filteredImages.map((image, index) => (
                <a
                  key={image.id}
                  className={`gallery-item group cursor-pointer block ${
                    viewMode === "masonry" ? "mb-6 break-inside-avoid" : ""
                  } transform hover:scale-[1.03] transition-all duration-500 hover:z-10 relative`}
                  data-src={image.src}
                  data-sub-html={`
                    <div class="lg-sub-html">
                      <h4 style="margin-bottom: 8px; font-size: 18px; font-weight: 600;">${
                        image.title
                      }</h4>
                      <p style="margin-bottom: 8px; opacity: 0.9;">${
                        image.description || ""
                      }</p>
                      <div style="display: flex; align-items: center; gap: 16px; font-size: 14px; opacity: 0.8;">
                        <span>📷 ${image.category}</span>
                        <span>📅 ${formatDate(image.date || image.createdAt)}</span>
                      </div>
                    </div>
                  `}
                  data-exthumbimage={image.thumb}
                  href={image.src}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-sm border border-white/20 group-hover:border-white/40">
                    {/* Enhanced Featured Badge */}
                    {image.featured && (
                      <div className="absolute top-4 left-4 z-20">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs px-4 py-2 rounded-full font-semibold shadow-lg animate-pulse flex items-center gap-1">
                          ⭐ Featured
                        </span>
                      </div>
                    )}

                    {/* Love/Heart Icon */}
                   

                    <div className="relative overflow-hidden">
                      <img
                        src={image.thumb}
                        alt={image.alt}
                        className={`w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 ${
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
                      
                      {/* Enhanced Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Enhanced Center Eye Icon */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                        <div className="bg-white/95 backdrop-blur-sm rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-200 shadow-2xl">
                          <Eye className="w-8 h-8 text-purple-700" />
                        </div>
                      </div>
                    </div>

                  
                  </div>
                </a>
              ))}
            </div>
          </LightGallery>
        )}
      </section>

      {/* Enhanced Call to Action */}
      <section className="max-w-5xl mx-auto px-4 pb-20 relative z-10">
        <div className="text-center py-16 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="mb-6">
              <Camera className="w-16 h-16 text-white mx-auto mb-4 animate-bounce" />
            </div>
            <h3
              className="text-3xl md:text-4xl font-light text-white mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Love What You See?
            </h3>
            <p className="text-lg font-light text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              Ready to create your own beautiful memories? Let's discuss your
              photography needs and create something amazing together.
            </p>
            
            <Modal
              trigger={
                <Button className=" cursor-pointer rounded-full px-10 py-6 bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-white text-purple-700 font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 text-lg">
                  <span className="flex items-center gap-3">
                    <Camera className="w-6 h-6" />
                    Book Your Session
                  </span>
                </Button>
              }
              title={
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">📸</span>
                  <div>
                    <span className="text-2xl font-semibold">Book Your Photography Session</span>
                    <div className="text-sm text-muted-foreground font-normal">
                      Let's create beautiful memories together
                    </div>
                  </div>
                </div>
              }
              description="Inspired by our gallery? Fill in your details below and we'll help you create your own stunning photography session tailored to your vision."
              className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto"
            >
              {({ close }) => (
                <ContactForm
                  initialData={{
                    serviceType: activeCategory !== "all" ? activeCategory : "",
                    message: `Hi! I've been browsing your gallery${activeCategory !== "all" ? ` and I'm particularly interested in your ${activeCategory} photography` : ""}. I'd love to discuss booking a session. Please let me know about your packages and availability.`
                  }}
                  submitButtonText="Send Inquiry"
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
          className="fixed bottom-20 right-8 z-50 bg-white/90 backdrop-blur-sm hover:bg-white text-purple-700 p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border border-purple-200"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Gallery;
