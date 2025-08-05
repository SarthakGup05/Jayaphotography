import React, { useState, useEffect, useRef } from "react";
import { Camera, Filter, Grid, Heart, Eye, Calendar, Tag } from "lucide-react";
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
import Modal from "../Layout/modal";          // ← Updated import
import ContactForm from "../components/form"; // ← Import ContactForm
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

  const lightGalleryRef = useRef(null);

  useEffect(() => {
    fetchGalleryImages();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterAndSortImages();
  }, [images, activeCategory, sortBy]);

  /* ─────────────────────────────────────────────────────────
     Custom booking handler for gallery inquiries
  ───────────────────────────────────────────────────────── */
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

  // Fetch gallery images from API
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

  // Fetch categories from API
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
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          <p className="text-gray-600 font-light">
            Loading beautiful memories...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-light text-gray-800 mb-2">
            Gallery Unavailable
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchGalleryImages}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-light px-6 py-3 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-pink-100 via-rose-50 to-orange-50 overflow-hidden mt-16">
        <div className="absolute inset-0 bg-white/40 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full border border-pink-200/50 text-xs text-pink-600 font-light tracking-wide mb-6">
            <Camera className="w-4 h-4" />
            Professional Portfolio
          </span>
          <h1
            className="text-4xl md:text-6xl font-thin text-gray-800 tracking-tight mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Photography <span className="text-pink-500">Gallery</span>
          </h1>
          <p className="text-lg md:text-xl font-light text-gray-600 max-w-2xl mx-auto">
            Discover our collection of captured moments, each telling a unique
            story of love, joy, and life's most precious memories.
          </p>
        </div>
      </section>

      {/* Filter Controls */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === "all"
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                  : "bg-white/80 text-gray-700 hover:bg-pink-50 hover:text-pink-600 border border-gray-200"
              }`}
            >
              <span className="flex items-center gap-2">
                <Grid className="w-4 h-4" />
                All ({images.length})
              </span>
            </button>
            {categories.map((category) => {
              const count = images.filter(
                (img) => img.category === category
              ).length;
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 capitalize ${
                    activeCategory === category
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                      : "bg-white/80 text-gray-700 hover:bg-pink-50 hover:text-pink-600 border border-gray-200"
                  }`}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/80 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                <option value="newest">Latest First</option>
                <option value="title">Alphabetical</option>
                <option value="category">By Category</option>
              </select>
            </div>

            <div className="flex bg-white/80 border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("masonry")}
                className={`p-2 rounded transition-all duration-200 ${
                  viewMode === "masonry"
                    ? "bg-pink-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-pink-600"
                }`}
                title="Masonry Layout"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-pink-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-pink-600"
                }`}
                title="Grid Layout"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 font-light">
            Showing {filteredImages.length}{" "}
            {filteredImages.length === 1 ? "image" : "images"}
            {activeCategory !== "all" && (
              <span>
                {" "}
                in{" "}
                <span className="font-medium capitalize">
                  {activeCategory}
                </span>{" "}
                category
              </span>
            )}
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        {filteredImages.length === 0 ? (
          <div className="text-center py-16">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-light text-gray-600 mb-2">
              No images found
            </h3>
            <p className="text-gray-500">
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
              lgShare,
              lgAutoplay,
              lgPager,
              lgRotate,
            ]}
            mode="lg-fade"
            thumbnail={true}
            download={false}
            autoplayFirstVideo={false}
            pager={true}
            zoomFromOrigin={false}
            allowMediaOverlap={true}
            toggleThumb={true}
            showZoomInOutIcons={true}
            actualSize={false}
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
                  } transform hover:scale-[1.02] transition-all duration-300`}
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
                        <span>📅 ${formatDate(
                          image.date || image.createdAt
                        )}</span>
                      </div>
                    </div>
                  `}
                  data-exthumbimage={image.thumb}
                  href={image.src}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
                    {image.featured && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                          ⭐ Featured
                        </span>
                      </div>
                    )}

                    <div className="relative overflow-hidden">
                      <img
                        src={image.thumb}
                        alt={image.alt}
                        className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                          viewMode === "masonry" ? "h-auto" : "h-64"
                        }`}
                        loading="lazy"
                        style={viewMode === "masonry" ? { height: "auto" } : {}}
                        onError={(e) => {
                          if (e.target.src !== image.src) {
                            e.target.src = image.src;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="absolute inset-0 bg-pink-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                          <Eye className="w-6 h-6 text-pink-600" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-800 line-clamp-1 flex-1">
                          {image.title}
                        </h3>
                        <span className="bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded-full capitalize font-medium ml-2 flex-shrink-0">
                          {image.category}
                        </span>
                      </div>

                      {image.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {image.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(image.date || image.createdAt)}
                        </span>
                        {image.service && (
                          <span className="flex items-center gap-1 text-pink-600">
                            <Camera className="w-3 h-3" />
                            {image.service.title}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </LightGallery>
        )}
      </section>

      {/* Call to Action with Modal - Updated */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="text-center py-12 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl">
          <h3
            className="text-2xl md:text-3xl font-thin text-gray-800 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Love What You See?
          </h3>
          <p className="text-base font-light text-gray-600 mb-8 max-w-2xl mx-auto">
            Ready to create your own beautiful memories? Let's discuss your
            photography needs and create something amazing together.
          </p>
          
          {/* Modal with ContactForm */}
          <Modal
            trigger={
              <Button className="rounded-full px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Book Your Session
                </span>
              </Button>
            }
            title={
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📸</span>
                <div>
                  <span className="text-xl font-semibold">Book Your Photography Session</span>
                  <div className="text-sm text-muted-foreground font-normal">
                    Let's create beautiful memories together
                  </div>
                </div>
              </div>
            }
            description="Inspired by our gallery? Fill in your details below and we'll help you create your own stunning photography session tailored to your vision."
            className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
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
                  close(); // ← Close modal after successful submission
                }}
                className="max-w-none"
              />
            )}
          </Modal>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
