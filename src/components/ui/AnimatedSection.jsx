import React from "react";
import { motion } from "framer-motion";

const variantsMap = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.7, ease: [0.6, 0.01, -0.05, 0.95] } },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.7, ease: [0.6, 0.01, -0.05, 0.95] },
    }),
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -40 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.7, ease: [0.6, 0.01, -0.05, 0.95] },
    }),
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i = 1) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.15, duration: 0.7, ease: [0.6, 0.01, -0.05, 0.95] },
    }),
  },
  slideLeft: {
    hidden: { opacity: 0, x: 60 },
    visible: (i = 1) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.15, duration: 0.7, ease: [0.6, 0.01, -0.05, 0.95] },
    }),
  },
  slideRight: {
    hidden: { opacity: 0, x: -60 },
    visible: (i = 1) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.15, duration: 0.7, ease: [0.6, 0.01, -0.05, 0.95] },
    }),
  },
};

/**
 * AnimatedSection - Utility wrapper for multiple modern animations
 * @param {React.ReactNode} children
 * @param {number} custom - Stagger index for delay
 * @param {string} animation - Animation preset (fadeIn, fadeInUp, fadeInDown, zoomIn, slideLeft, slideRight)
 * @param {object} variants - Optional custom variants (overrides animation prop)
 * @param {string} className - Optional className for styling
 */
const AnimatedSection = ({
  children,
  custom = 0,
  animation = "fadeInUp",
  variants,
  className = "",
  ...props
}) => {
  const chosenVariants = variants || variantsMap[animation] || variantsMap.fadeInUp;
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={chosenVariants}
      custom={custom}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
