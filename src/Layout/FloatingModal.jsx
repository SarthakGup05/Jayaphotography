// src/components/FloatingModal.jsx
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { X, Sparkles, Star } from "lucide-react";

const FloatingModal = ({ buttonText = " Leave a Review", children }) => {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const buttonRef = useRef(null);
  const sparkleRefs = useRef([]);

  useEffect(() => {
    if (buttonRef.current) {
      // Enhanced button animation with glow effect
      gsap.to(buttonRef.current, {
        scale: 1.05,
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "power2.inOut",
      });
      
      // Add glow animation
      gsap.to(buttonRef.current, {
        boxShadow: "0 0 30px rgba(255, 165, 0, 0.6)",
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "power1.inOut",
      });
    }
  }, []);

  useEffect(() => {
    if (open) {
      // Backdrop animation
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { 
          opacity: 1, 
          duration: 0.3, 
          ease: "power2.out" 
        }
      );
      
      // Modal entrance - simplified to avoid interference
      gsap.fromTo(
        modalRef.current,
        { 
          y: 50, 
          opacity: 0, 
          scale: 0.95
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        }
      );

      // Sparkle animations - made non-intrusive
      sparkleRefs.current.forEach((sparkle, index) => {
        if (sparkle) {
          gsap.fromTo(
            sparkle,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 0.6,
              duration: 0.5,
              delay: index * 0.1,
              ease: "power2.out",
            }
          );
          
          // Gentle continuous animation
          gsap.to(sparkle, {
            scale: 1.1,
            repeat: -1,
            yoyo: true,
            duration: 2,
            delay: index * 0.3,
            ease: "power1.inOut",
          });
        }
      });
    }
  }, [open]);

  const closeModal = () => {
    gsap.to(modalRef.current, {
      y: -30,
      opacity: 0,
      scale: 0.95,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => setOpen(false),
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
    });
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) {
      closeModal();
    }
  };

  return (
    <>
      {/* Add custom scrollbar styles to global CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .modal-custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 165, 0, 0.3) transparent;
          }
          
          .modal-custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .modal-custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .modal-custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #fbbf24, #f97316);
            border-radius: 3px;
          }
          
          .modal-custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #f59e0b, #ea580c);
          }

          /* Ensure form elements are interactive */
          .modal-form-container * {
            pointer-events: auto !important;
          }
        `
      }} />

      {/* Enhanced Floating Button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-50 group"
      >
        <div className="relative">
          {/* Main button with gradient and enhanced styling */}
          <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 text-white px-3 py-3.5 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 font-bold text-sm uppercase tracking-wider border border-white/20 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 animate-pulse" />
              <span>{buttonText}</span>
              <Sparkles className="w-4 h-4" />
            </div>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </div>
          
          {/* Pulsing ring effect */}
          <div className="absolute inset-0 rounded-2xl border-2 border-yellow-400/50 animate-ping opacity-20"></div>
          <div className="absolute inset-0 rounded-2xl border border-orange-300/30 animate-pulse"></div>
        </div>
      </button>

      {/* Enhanced Modal */}
      {open && (
        <div
          ref={overlayRef}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)',
            backdropFilter: 'blur(8px)'
          }}
        >
          {/* Floating sparkles - made non-interactive */}
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              ref={el => sparkleRefs.current[index] = el}
              className="absolute pointer-events-none select-none"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                zIndex: 1
              }}
            >
              <Sparkles className="w-6 h-6 text-yellow-300 opacity-40" />
            </div>
          ))}

          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
            className="relative w-full max-w-2xl h-[90vh] max-h-[700px] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              zIndex: 10
            }}
          >
            {/* Decorative top gradient */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500"></div>
            
            {/* Animated background pattern - made more subtle */}
            <div className="absolute inset-0 opacity-3 pointer-events-none">
              <div className="absolute top-4 left-4 w-32 h-32 bg-yellow-300 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-4 right-4 w-40 h-40 bg-pink-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-300 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Enhanced close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 group"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200/50 hover:bg-white hover:scale-110 transition-all duration-200">
                <X size={20} className="text-gray-600 group-hover:text-gray-800" />
              </div>
            </button>

            {/* Fixed Header */}
            <div className="flex-shrink-0 p-6 pb-4 text-center relative z-10">
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Share Your Experience
              </h2>
            </div>

            {/* Scrollable Content Area - Enhanced for form interaction */}
            <div className="flex-1 overflow-hidden px-6 relative z-10">
              <div className="h-full overflow-y-auto pr-2 modal-custom-scrollbar">
                <div className="pb-6 modal-form-container">
                  {children}
                </div>
              </div>
            </div>

            {/* Bottom gradient decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 opacity-50 pointer-events-none"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingModal;
