import React, { useState, useEffect, useRef } from "react";
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
  const [imagesLoaded, setImagesLoaded] = useState(new Set());

  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    fetchPortfolioImages();
  }, []);

  // ✅ GSAP Scroll Animation Setup (Lazy-loaded) - Uses CSS transforms to avoid CLS
  useEffect(() => {
    if (loading || error) return;

    (async () => {
      try {
        const gsapModule = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        const gsap = gsapModule.default;
        gsap.registerPlugin(ScrollTrigger);

        let ctx = gsap.context(() => {
          // ✅ Use opacity and transform (no autoAlpha/y for initial state to prevent CLS)
          gsap.set([".header-content", ".gallery-item", ".cta-content"], {
            opacity: 1, // Start visible to prevent CLS
          });

          // Header animation - only opacity and scale (no layout shifts)
          gsap.fromTo(
            ".header-content",
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".header-content",
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );

          // Gallery items with stagger - CSS transforms only
          gsap.utils.toArray(".gallery-item").forEach((item, index) => {
            gsap.fromTo(
              item,
              { opacity: 0, scale: 0.95 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: item,
                  start: "top 85%",
                  toggleActions: "play none none reverse",
                },
                delay: index * 0.05,
              }
            );
          });

          // CTA section
          gsap.fromTo(
            ".cta-content",
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".cta-content",
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );

          // Gallery hover animations - CSS transforms only
          gsap.utils.toArray(".gallery-item").forEach((item) => {
            const img = item.querySelector("img");
            const overlay = item.querySelector(".hover-overlay");
            const indicator = item.querySelector(".hover-indicator");

            const hoverTl = gsap.timeline({ paused: true });
            hoverTl
              .to(img, {
                scale: 1.1,
                duration: 0.4,
                ease: "power2.out",
              })
              .to(
                overlay,
                { opacity: 1, duration: 0.3, ease: "power2.out" },
                0
              )
              .fromTo(
                indicator,
                { scale: 0, opacity: 0 },
                {
                  scale: 1,
                  opacity: 1,
                  duration: 0.4,
                  ease: "back.out(1.7)",
                },
                0.1
              );

            item.addEventListener("mouseenter", () => hoverTl.play());
            item.addEventListener("mouseleave", () => hoverTl.reverse());
          });

          // Button hover animations
          gsap.utils.toArray(".animated-button").forEach((button) => {
            const arrow = button.querySelector(".arrow");
            if (!arrow) return;
            
            const hoverTl = gsap.timeline({ paused: true });
            hoverTl
              .to(button, { scale: 1.05, duration: 0.3, ease: "power2.out" })
              .to(arrow, { x: 8, duration: 0.3, ease: "power2.out" }, 0);

            button.addEventListener("mouseenter", () => hoverTl.play());
            button.addEventListener("mouseleave", () => hoverTl.reverse());
          });
        }, containerRef);

        return () => {
          ctx.revert();
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
      } catch (error) {
        console.warn("GSAP failed to load:", error);
      }
    })();
  }, [loading, error, portfolioItems]);

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
          .filter(item => item.fullImage && item.image);

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

  const handleImageLoad = (id) => {
    setImagesLoaded(prev => new Set([...prev, id]));
  };

  // Loading state with reserved space
  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4" style={{ backgroundColor: '#FAF0DC' }}>
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <div className="h-12 w-64 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>

          {/* Gallery Skeleton - Reserved space with aspect ratio */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                style={{ aspectRatio: '1/1' }}
              />
            ))}
          </div>
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
            className="animated-button text-black border-b border-black hover:border-gray-600 transition-colors duration-200 text-sm"
          >
            <span className="button-text">Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative py-20 px-4 overflow-hidden" 
      style={{ backgroundColor: '#F0E7E5' }}
    >
      {/* Background decorations - no parallax to avoid CLS */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-black/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-black/3 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="header-content">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2 tracking-tight leading-relaxed">
              Capturing Life's
              <br />
              <span className="inline-block bg-gradient-to-r from-black to-gray-600 bg-clip-text">
                Beautiful Moments
              </span>
            </h1>
            
            <p className="text-gray-700 max-w-md mx-auto text-base font-medium leading-relaxed mt-4">
              A curated selection of our finest work showcasing newborn, maternity, 
              and fashion photography.
            </p>
          </div>
        </div>

        {/* Portfolio Grid */}
        {portfolioItems.length > 0 ? (
          <LightGallery
            speed={400}
            plugins={[lgThumbnail, lgZoom, lgFullscreen]}
            mode="lg-fade"
            thumbnail={true}
            showThumbByDefault={false}
            counter={true}
            addClass="lg-minimal-gallery"
            selector=".gallery-item"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2">
              {portfolioItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="gallery-item group cursor-pointer overflow-hidden relative rounded-lg shadow-lg"
                  style={{ aspectRatio: '1/1' }} // ✅ Fixed aspect ratio prevents CLS
                  data-src={item.fullImage || item.image}
                  data-sub-html={`
                    <div class="text-center">
                      <h4 class="text-lg font-light mb-2">${item.title}</h4>
                      <p class="text-sm opacity-80">${item.category}</p>
                    </div>
                  `}
                >
                  {/* Hover overlay */}
                  <div className="hover-overlay absolute inset-0 bg-black/0 transition-opacity duration-500 z-10 opacity-0" />
                  
                  {/* Featured indicator */}
                  {item.featured && (
                    <div className="absolute top-3 left-3 z-20">
                      <div className="w-2 h-2 bg-white rounded-full shadow-lg animate-pulse"></div>
                    </div>
                  )}

                  {/* Skeleton loader */}
                  {!imagesLoaded.has(item.id) && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                  )}

                  {/* Image with proper dimensions */}
                  <img
                    src={item.image}
                    alt={item.alt}
                    width="400"
                    height="400"
                    className="w-full h-full object-cover transition-transform duration-500"
                    loading={index < 4 ? "eager" : "lazy"} // ✅ First 4 images eager, rest lazy
                    fetchpriority={index < 2 ? "high" : "auto"} // ✅ Prioritize first 2 images
                    decoding={index < 4 ? "sync" : "async"}
                    onLoad={() => handleImageLoad(item.id)}
                    onError={(e) => {
                      if (e.target.src !== item.fullImage && item.fullImage) {
                        e.target.src = item.fullImage;
                      } else {
                        e.target.closest('.gallery-item').style.display = 'none';
                      }
                    }}
                    style={{ aspectRatio: '1/1' }} // ✅ Inline aspect ratio
                  />

                  {/* Hover indicator */}
                  <div className="hover-indicator absolute inset-0 flex items-center justify-center z-20 opacity-0">
                    <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 border-2 border-black rounded-full"></div>
                    </div>
                  </div>

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 z-15"></div>
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

        {/* Call to Action */}
        <div className="text-center mt-16 space-y-4">
          <div className="cta-content">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <button
                onClick={() => navigate("/gallery")}
                className="animated-button group flex items-center gap-2 text-black transition-all duration-300 cursor-pointer hover:text-gray-700"
              >
                <span className="button-text font-bold text-lg">View Complete Gallery</span>
                <ArrowRight className="arrow w-5 h-5 transition-all duration-300" />
              </button>
              
              <div className="w-px h-6 bg-gray-300 hidden sm:block"></div>
              
              <button
                onClick={() => navigate("/contact-us")}
                className="animated-button text-black font-bold text-lg transition-all duration-300 cursor-pointer border-b-2 border-transparent hover:border-black"
              >
                <span className="button-text">Book a Session</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ✅ Ensure images maintain aspect ratio */
        img {
          max-width: 100%;
          height: auto;
          display: block;
        }

        .loading-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        .lg-minimal-gallery .lg-backdrop {
          background-color: rgba(0, 0, 0, 0.95);
        }

        .lg-minimal-gallery .lg-toolbar {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
        }

        /* ✅ Prevent layout shifts during image load */
        .gallery-item {
          contain: layout style paint;
        }
      `}</style>
    </div>
  );
};

export default PhotographyPortfolio;
