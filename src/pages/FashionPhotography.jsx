import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LightGallery from 'lightgallery/react'
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'

const themes = [
  { key: 'all', label: 'All' },
  { key: 'editorial', label: 'Editorial' },
  { key: 'commercial', label: 'Commercial' },
  { key: 'street', label: 'Street' },
  { key: 'beauty', label: 'Beauty' }
]

const images = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600',
    alt: 'Editorial fashion pose',
    themes: ['editorial']
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    alt: 'Commercial fashion shoot',
    themes: ['commercial']
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=600',
    alt: 'Street style fashion',
    themes: ['street']
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600',
    alt: 'Beauty portrait',
    themes: ['beauty']
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600',
    alt: 'Editorial outdoor fashion',
    themes: ['editorial', 'street']
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600',
    alt: 'Commercial product fashion',
    themes: ['commercial']
  }
]

const FashionPhotography = () => {
  const [activeTheme, setActiveTheme] = useState('all')

  // Animation refs
  const headerRef = useRef();
  const filterRef = useRef();
  const galleryRef = useRef();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // Header: fade in from left
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, x: -80 },
      {
        opacity: 1,
        x: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
    // Filter: fade in from right
    gsap.fromTo(
      filterRef.current,
      { opacity: 0, x: 80 },
      {
        opacity: 1,
        x: 0,
        duration: 1.5,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: filterRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      }
    );
    // Gallery: scale up and fade in
    gsap.fromTo(
      galleryRef.current,
      { opacity: 0, scale: 0.92 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.7,
        delay: 0.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [activeTheme])

  const filteredImages =
    activeTheme === 'all'
      ? images
      : images.filter(img => img.themes.includes(activeTheme))

  return (
    <div className="relative min-h-screen bg-white pt-20">
      {/* Minimal Header */}
      <div ref={headerRef} className="max-w-xl mx-auto px-4 py-10 text-center">
        <h1 className="text-4xl md:text-5xl font-light mb-2 tracking-tight text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Fashion Photography
        </h1>
        <p className="text-base md:text-lg text-gray-500 mb-8 font-light">
          Elevate your brand and style with our creative, minimal fashion photography. Editorial, commercial, and street looks—captured with clarity and elegance.
        </p>
      </div>
      {/* Minimal Theme Filter */}
      <div ref={filterRef} className="flex flex-wrap gap-2 justify-center mb-10">
        {themes.map(theme => (
          <button
            key={theme.key}
            onClick={() => setActiveTheme(theme.key)}
            className={`px-4 py-1 rounded-full text-xs font-medium border border-gray-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300 ${
              activeTheme === theme.key
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {theme.label}
          </button>
        ))}
      </div>
      {/* Masonry Gallery */}
      <LightGallery
        speed={400}
        plugins={[]}
        selector="a"
        elementClassName="w-full px-2 pb-16"
      >
        <div ref={galleryRef} className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-5 space-y-5 w-full">
          {filteredImages.map(image => (
            <a
              key={image.id}
              href={image.src}
              data-src={image.src}
              data-lg-size="600-800"
              data-sub-html={`<span>${image.alt}</span>`}
              className="block mb-5 rounded-lg overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors duration-200 break-inside-avoid"
            >
              <div className="w-full relative">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  style={{ aspectRatio: '4/5', display: 'block' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10 opacity-0 hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <div className="p-2 text-center">
                <span className="text-gray-500 font-light text-xs line-clamp-1">{image.alt}</span>
              </div>
            </a>
          ))}
        </div>
      </LightGallery>
    </div>
  )
}

export default FashionPhotography
