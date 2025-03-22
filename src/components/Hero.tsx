import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  onBookTable: () => void;
  language: 'en' | 'pt';
}

// Define translations for the Hero component
const translations = {
  en: {
    heading: "Experience the Fusion of Flavors from Across Asia!",
    subheading: "Embark on a culinary journey through the finest Asian cuisines, expertly crafted and beautifully presented.",
    buttonText: "Book Your Table"
  },
  pt: {
    heading: "Experimente a Fusão de Sabores de Toda a Ásia!",
    subheading: "Embarque numa jornada culinária pelas melhores cozinhas asiáticas, habilmente elaboradas e lindamente apresentadas.",
    buttonText: "Reserve Sua Mesa"
  }
};

const Hero: React.FC<HeroProps> = ({ onBookTable, language }) => {
  // Get the appropriate translations based on the current language
  const text = translations[language];
  
  // For parallax effect
  const [scrollY, setScrollY] = useState(0);
  
  // Track scroll position for parallax
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Floating animation for visual elements
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Parallax Background with Zoom Effect */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        initial={{ scale: 1.1 }}
        animate={{ 
          scale: 1, 
          y: scrollY * 0.2 // Parallax effect
        }}
        transition={{ 
          scale: { duration: 1.5, ease: "easeOut" }
        }}
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80")',
        }}
      >
        {/* Overlay with gradient for better readability */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        ></motion.div>
      </motion.div>
      
      {/* Decorative Food Icons (SVG) floating in the background */}
      <motion.div 
        className="absolute top-20 right-20 text-amber-400/20 hidden md:block"
        animate={floatingAnimation}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11 3H13V21H11V3Z M3 13H21V11H3V13Z"/>
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-20 left-20 text-amber-400/20 hidden md:block"
        animate={{
          ...floatingAnimation,
          transition: {
            ...floatingAnimation.transition,
            delay: 1
          }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
      </motion.div>
      
      {/* Main Content with Animations */}
      <div className="relative h-full flex items-center justify-center text-center">
        <div className="container mx-auto px-6">
          {/* Animated Heading */}
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {text.heading.split(' ').map((word, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.2 + i * 0.1,
                  ease: "easeOut" 
                }}
              >
                {word}{' '}
              </motion.span>
            ))}
          </motion.h1>
          
          {/* Animated Subheading */}
          <motion.p 
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto drop-shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {text.subheading}
          </motion.p>
          
          {/* Animated Button with Pulse Effect */}
          <motion.button
            onClick={onBookTable}
            className="relative bg-amber-500 text-black px-8 py-3 rounded-full text-lg font-semibold shadow-lg 
              hover:bg-amber-400 transition-all duration-300 hover:scale-105 overflow-hidden z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Pulse effect behind button */}
            <motion.span
              className="absolute inset-0 rounded-full bg-amber-400"
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ 
                scale: [0, 1.5], 
                opacity: [0.8, 0] 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                repeatDelay: 1 
              }}
              style={{ zIndex: -1 }}
            />
            {text.buttonText}
          </motion.button>
        </div>
      </div>
      
      {/* Animated Scrolldown Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      >
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="40" 
          height="40" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-amber-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
        </motion.svg>
      </motion.div>
    </div>
  );
};

export default Hero;