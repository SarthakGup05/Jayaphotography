import React, { useEffect, useRef } from "react";
import gsap from "gsap";

// Update the path to your logo as needed
const LOGO_SRC = "/logo.png";

const Loader = ({ onFinish }) => {
  const loaderRef = useRef();
  const logoRef = useRef();
  const ringRef = useRef();

  useEffect(() => {
    // Animate loader in
    gsap.fromTo(
      loaderRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" }
    );
    // Animate logo scale and fade
    gsap.fromTo(
      logoRef.current,
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 }
    );
    // Animate ring
    gsap.fromTo(
      ringRef.current,
      { scale: 0.8, opacity: 0, rotate: 0 },
      { scale: 1.1, opacity: 0.25, rotate: 360, duration: 1.4, ease: "power2.inOut", delay: 0.3, repeat: -1 }
    );
    // Animate loader out after delay
    const timeout = setTimeout(() => {
      gsap.to(loaderRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: onFinish
      });
    }, 1800); // 1.8s total loader time
    return () => clearTimeout(timeout);
  }, [onFinish]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-blue-50 transition-opacity duration-500"
      style={{ pointerEvents: "none" }}
    >
      <div className="relative flex items-center justify-center">
        <span
          ref={ringRef}
          className="absolute w-44 h-44 rounded-full border-8 border-pink-200 border-t-blue-400 border-b-transparent animate-spin-slow"
          style={{ borderStyle: 'solid' }}
        ></span>
        <img
          ref={logoRef}
          src={LOGO_SRC}
          alt="Logo"
          className="w-32 h-32 object-contain drop-shadow-xl relative z-10"
          draggable={false}
          style={{ userSelect: "none" }}
        />
      </div>
    </div>
  );
};

export default Loader;
