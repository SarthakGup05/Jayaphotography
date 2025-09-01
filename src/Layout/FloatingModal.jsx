// src/components/FloatingModal.jsx
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { X, Sparkles, Star } from "lucide-react";

const FloatingModal = ({ buttonText = " Leave a Review", children }) => {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (buttonRef.current) {
      // Subtle button animation
      gsap.to(buttonRef.current, {
        scale: 1.02,
        repeat: -1,
        yoyo: true,
        duration: 2.5,
        ease: "power2.inOut",
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
      
      // Modal entrance
      gsap.fromTo(
        modalRef.current,
        { 
          y: 40, 
          opacity: 0, 
          scale: 0.95
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
        }
      );
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
      {/* Custom scrollbar and form styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .modal-custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(168, 85, 247, 0.2) transparent;
          }
          
          .modal-custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          
          .modal-custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .modal-custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(168, 85, 247, 0.3);
            border-radius: 2px;
          }
          
          .modal-custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(168, 85, 247, 0.5);
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
        className="fixed bottom-8 right-8 z-50 group cursor-pointer"
      >
        <div className="relative">
          {/* Main button */}
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white px-5 py-3 rounded-2xl transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>{buttonText}</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          
          {/* Subtle pulsing ring */}
          <div className="absolute inset-0 rounded-2xl border-2 border-purple-400/30 animate-pulse opacity-60"></div>
        </div>
      </button>

      {/* Enhanced Modal */}
      {open && (
        <div
          ref={overlayRef}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(243, 230, 250, 0.8) 0%, rgba(240, 231, 229, 0.8) 100%)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl h-[90vh] max-h-[700px] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/30"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* Decorative top gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600"></div>
            
            {/* Enhanced close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 group"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md border border-gray-200/50 hover:bg-white hover:scale-110 transition-all duration-200">
                <X size={18} className="text-gray-600 group-hover:text-gray-800" />
              </div>
            </button>

            {/* Enhanced Header */}
            <div className="flex-shrink-0 p-6 pb-4 text-center relative">
              <div className="mb-4">
                <div className="inline-flex p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full shadow-md">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Share Your Experience
              </h2>
              <p className="text-gray-600 text-sm">
                We'd love to hear about your photography session
              </p>
            </div>

            {/* Enhanced Scrollable Content Area */}
            <div className="flex-1 overflow-hidden px-6 relative">
              <div className="h-full overflow-y-auto pr-2 modal-custom-scrollbar">
                <div className="pb-6 modal-form-container">
                  {children}
                </div>
              </div>
            </div>

            {/* Decorative bottom element */}
            <div className="flex-shrink-0 h-8 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingModal;
