import React, { useState, useEffect } from "react";
import { Camera, Loader2, AlertCircle, ArrowRight } from "lucide-react";
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

      const response = await axiosInstance.get("/gallery/images", {
        params: {
          isActive: "true",
          sortBy: "sortOrder",
          sortOrder: "asc",
          limit: 8,
        },
      });

      const imagesData = response.data.images || response.data;

      if (imagesData && imagesData.length > 0) {
        // Filter out items without valid image sources
        const transformedItems = imagesData
          .map((image) => ({
            id: image.id,
            title: image.title || 'Untitled',
            category: image.category || 'Photography',
            image: image.thumb || image.src,
            fullImage: image.src,
            alt: image.alt || image.title || 'Portfolio image',
            description: image.description || '',
            featured: image.featured,
          }))
          .filter(item => item.fullImage && item.image); // Only include items with valid images

        setPortfolioItems(transformedItems);
      } else {
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center" style={{ backgroundColor: '#FAF0DC' }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-black mx-auto mb-4" />
          <p className="text-black font-light text-sm">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center" style={{ backgroundColor: '#FAF0DC' }}>
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-light text-black mb-2">Portfolio Unavailable</h2>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <button
            onClick={fetchPortfolioImages}
            className="text-black border-b border-black hover:border-gray-600 transition-colors duration-200 text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-4" style={{ backgroundColor: '#F0E7E5' }}>
      <div className="max-w-6xl mx-auto">
        {/* Minimal Header */}
        <div className="text-center mb-16">
          {/* <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black/5 mb-8">
            <Camera className="w-5 h-5 text-black" />
          </div>
           */}
          <h1 className="text-3xl md:text-4xl font-semibold text-black mb-2 tracking-tight leading-relaxed">
            Capturing Life's
            Beautiful Moments
          </h1>
          
          <p className="text-gray-700 max-w-md mx-auto text-base font-medium leading-relaxed">
            A curated selection of our finest work showcasing newborn, maternity, 
            and fashion photography.
          </p>
        </div>

        {/* Minimal Portfolio Grid */}
        {portfolioItems.length > 0 ? (
          <LightGallery
            speed={400}
            plugins={[lgThumbnail, lgZoom, lgFullscreen]}
            mode="lg-fade"
            thumbnail={true}
            showThumbByDefault={false}
            counter={true}
            addClass="lg-minimal-gallery"
            selector=".gallery-item" // Add explicit selector
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2">
              {portfolioItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="gallery-item aspect-square group cursor-pointer overflow-hidden relative"
                  data-src={item.fullImage || item.image} // Fallback to thumbnail if fullImage is missing
                  data-sub-html={`
                    <div class="text-center">
                      <h4 class="text-lg font-light mb-2">${item.title}</h4>
                      <p class="text-sm opacity-80">${item.category}</p>
                    </div>
                  `}
                >
                  {/* Simple overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 z-10" />
                  
                  {/* Minimal featured indicator */}
                  {item.featured && (
                    <div className="absolute top-3 left-3 z-20">
                      <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                    </div>
                  )}

                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to fullImage if thumbnail fails
                      if (e.target.src !== item.fullImage && item.fullImage) {
                        e.target.src = item.fullImage;
                      } else {
                        // Hide the item if both images fail
                        e.target.closest('.gallery-item').style.display = 'none';
                      }
                    }}
                  />

                  {/* Minimal hover indicator */}
                  <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-2 h-2 border border-black rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </LightGallery>
        ) : (
          <div className="text-center py-20">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-light text-black mb-2">No Portfolio Items</h3>
            <p className="text-gray-600 text-sm">Portfolio images will appear here once uploaded.</p>
          </div>
        )}

        {/* Minimal Call to Action */}
        <div className="text-center mt-16 space-y-4 cursor-pointer">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <button
              onClick={() => navigate("/gallery")}
              className="group flex items-center gap-2 text-black hover:gap-3 transition-all duration-200 cursor-pointer"
            >
              <span className="font-bold">View Complete Gallery</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
            
            <div className="w-px h-6 bg-gray-300 hidden sm:block"></div>
            
            <button
              onClick={() => navigate("/contact")}
              className="text-black font-bold hover:text-gray-600 transition-colors cursor-pointer duration-200 border-b border-transparent hover:border-gray-300"
            >
              Book a Session
            </button>
          </div>
          
          {/* Minimal stats */}
          {/* <div className="pt-8 border-t border-gray-200/50 mt-12">
            <div className="flex items-center justify-center gap-8 text-xs text-gray-500 font-medeium">
              <span>{portfolioItems.length} Featured Works</span>
              <span>•</span>
              <span>{[...new Set(portfolioItems.map(item => item.category))].length} Categories</span>
              <span>•</span>
              <span>Professional Studio</span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PhotographyPortfolio;
