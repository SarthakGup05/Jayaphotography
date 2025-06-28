import AboutStorySection from '@/components/AboutStory'
import CTASection from '@/components/CtaSec'
import JayaAbout from '@/components/Jayaabout'
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const About = () => {
  const jayaRef = useRef();
  const storyRef = useRef();
  const ctaRef = useRef();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const sections = [
      { ref: jayaRef, delay: 0 },
      { ref: storyRef, delay: 0.2 },
      { ref: ctaRef, delay: 0.4 },
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
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <div ref={jayaRef}><JayaAbout/></div>
      <div ref={storyRef}><AboutStorySection/></div>
      <div ref={ctaRef}><CTASection/></div>
    </>
  )
}

export default About