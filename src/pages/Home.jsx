import CTASection from "@/components/CtaSec";
import Hero from "@/components/Hero";
import JayaAbout from "@/components/Jayaabout";
import PhotographyPortfolio from "@/components/PhotographyPortfolio";
import Testimonial from "@/components/Testimonials";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Services from "@/components/Services";


const Home = () => {
  const heroRef = useRef();
  const aboutRef = useRef();
  const portfolioRef = useRef();
  const testimonialRef = useRef();
  const featuredRef = useRef();
  const ctaRef = useRef();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const sections = [
      { ref: heroRef, delay: 0 },
      { ref: aboutRef, delay: 0.1 },
      { ref: portfolioRef, delay: 0.2 },
      { ref: testimonialRef, delay: 0.3 },
      { ref: featuredRef, delay: 0.4 },
      { ref: ctaRef, delay: 0.5 },
    ];
    sections.forEach(({ ref, delay }) => {
      if (ref.current) {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
            delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
  return (
    <>
      <div ref={heroRef}>
        <Hero />
      </div>
      <div ref={portfolioRef}>
        <PhotographyPortfolio />
      </div>
       <div ref={featuredRef}>
        <Services/>
      </div>
      <div ref={aboutRef}>
        <JayaAbout />
      </div>
     
      <div ref={testimonialRef}>
        <Testimonial />
      </div>
     
      {/* <div><GalleryShowcase/></div> */}
      <div ref={ctaRef}>
        <CTASection />
      </div>
    </>
  );
};

export default Home;
