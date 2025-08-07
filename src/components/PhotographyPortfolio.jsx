import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axiosinstance";
import { useNavigate } from "react-router-dom";

// LightGallery imports
import LightGallery from 'lightgallery/react';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import lgAutoplay from 'lightgallery/plugins/autoplay';
import lgFullscreen from 'lightgallery/plugins/fullscreen';
import lgShare from 'lightgallery/plugins/share';
import lgRotate from 'lightgallery/plugins/rotate';

// LightGallery CSS
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-autoplay.css';
import 'lightgallery/css/lg-fullscreen.css';
import 'lightgallery/css/lg-share.css';
import 'lightgallery/css/lg-rotate.css';

const PhotographyPortfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPortfolioImages();
  }, []);

  const fetchPortfolioImages = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch active gallery images
      const response = await axiosInstance.get("/gallery/images", {
        params: {
          isActive: "true",
          sortBy: "sortOrder",
          sortOrder: "asc",
          limit: 12, // Limit to first 12 images for portfolio
        },
      });

      const imagesData = response.data.images || response.data;

      if (imagesData && imagesData.length > 0) {
        // Transform API data to match portfolio format
        const transformedItems = imagesData.map((image, index) => ({
          id: image.id,
          title: image.title,
          category: image.category.toUpperCase(),
          image: image.thumb || image.src, // Use thumb for better performance
          fullImage: image.src,
          alt: image.alt,
          description: image.description,
          featured: image.featured,
          className: getGridClassName(index), // Dynamic grid layout
        }));

        setPortfolioItems(transformedItems);
      } else {
        // Fallback if no images
        setError("No portfolio images available");
      }
    } catch (error) {
      console.error("Error fetching portfolio images:", error);
      setError("Failed to load portfolio images");
      toast.error("Failed to load portfolio images");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic grid layout function
  const getGridClassName = (index) => {
    const layouts = [
      "col-span-1 row-span-1",
      "col-span-1 row-span-2",
      "col-span-1 row-span-1",
      "col-span-1 row-span-2",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
    ];
    return layouts[index % layouts.length];
  };

  // LightGallery event handlers
  const onInit = () => {
    console.log('LightGallery has been initialized');
  };

  const onBeforeSlide = (detail) => {
    const { index } = detail;
    console.log('About to show slide:', index);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center" style={{ backgroundColor: '#FAF0DC' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-black mx-auto mb-4" />
          <p className="text-black font-light">
            Loading our beautiful portfolio...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center" style={{ backgroundColor: '#FAF0DC' }}>
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-light text-black mb-2">
            Portfolio Unavailable
          </h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={fetchPortfolioImages}
            className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-sm tracking-wider transition-colors duration-300"
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4" style={{ backgroundColor: '#FAF0DC' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-black mb-6 leading-tight">
            We're Gleam a small and enthusiastic
            <br />
            photography studio based in Lucknow
          </h1>
          <p className="text-gray-800 max-w-3xl mx-auto leading-relaxed text-lg">
            We specialize in capturing life's most precious moments - from the
            tender first days of a newborn's life to the radiant glow of
            expectant mothers, and the bold expressions of fashion. Every
            photograph tells a unique story of beauty, love, and artistry.
          </p>

          {/* Portfolio Stats */}
          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-700">
            <span className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-black" />
              {portfolioItems.length} Featured Works
            </span>
            <span>
              {[...new Set(portfolioItems.map((item) => item.category))].length}{" "}
              Categories
            </span>
            <span>
              {portfolioItems.filter((item) => item.featured).length} Featured
              Pieces
            </span>
          </div>
        </div>

        {/* Portfolio Grid with LightGallery */}
        {portfolioItems.length > 0 ? (
          <LightGallery
            onInit={onInit}
            onBeforeSlide={onBeforeSlide}
            speed={500}
            plugins={[lgThumbnail, lgZoom, lgAutoplay, lgFullscreen, lgShare, lgRotate]}
            mode="lg-fade"
            thumbnail={true}
            animateThumb={true}
            showThumbByDefault={false}
            thumbWidth={100}
            thumbHeight="80px"
            thumbMargin={5}
            allowMediaOverlap={true}
            toggleThumb={true}
            enableDrag={true}
            enableSwipe={true}
            swipeThreshold={50}
            enableTouch={true}
            slideShowAutoplay={false}
            progressBar={true}
            counter={true}
            addClass="lg-custom-gallery"
            elementClassNames="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]"
          >
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className={`${item.className} group cursor-pointer`}
                data-lg-size="1400-800"
                data-src={item.fullImage}
                data-sub-html={`
                  <div class="lightGallery-captions">
                    <h4>${item.title}</h4>
                    <p>Category: ${item.category}</p>
                    ${item.description ? `<p>${item.description}</p>` : ''}
                    ${item.featured ? '<span class="featured-badge">⭐ Featured</span>' : ''}
                  </div>
                `}
              >
                <Card className="border-0 shadow-none overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-0 h-full relative">
                    {/* Featured Badge */}
                    {item.featured && (
                      <div className="absolute top-4 left-4 z-30">
                        <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
                          ⭐ Featured
                        </span>
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 z-10" />

                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.alt || item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to full image if thumb fails
                        if (e.target.src !== item.fullImage) {
                          e.target.src = item.fullImage;
                        } else {
                          // Final fallback to placeholder
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+";
                        }
                      }}
                    />

                    {/* Text Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-light mb-1">{item.title}</h3>
                      <p className="text-sm tracking-wider opacity-90">
                        {item.category}
                      </p>
                      {item.description && (
                        <p className="text-xs opacity-80 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Hover indicator */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                        <Camera className="w-6 h-6 text-black" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </LightGallery>
        ) : (
          <div className="text-center py-16">
            <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-light text-black mb-2">
              No Portfolio Items
            </h3>
            <p className="text-gray-700">
              Portfolio images will appear here once uploaded.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 cursor-pointer">
          <button
            className="bg-black cursor-pointer hover:bg-gray-800 text-white px-8 py-3 text-sm tracking-wider transition-colors duration-300 mr-4"
            onClick={() => {
              navigate("/gallery");
            }}
          >
            VIEW ALL WORK
          </button>
          <button
            className="border border-black hover:bg-black cursor-pointer hover:text-white text-black px-8 py-3 text-sm tracking-wider transition-colors duration-300"
            onClick={() => {
              navigate("/contact");
            }}
          >
            BOOK A SESSION
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotographyPortfolio;
