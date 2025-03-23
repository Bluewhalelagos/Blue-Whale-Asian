import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface GalleryProps {
  language: 'en' | 'pt';
}

// Define translations for the Gallery component
const translations = {
  en: {
    title: "Our Gallery",
    description: "Explore our mouth-watering Asian fusion dishes and cozy ambiance.",
    viewMore: "View Details",
    prev: "Previous",
    next: "Next"
  },
  pt: {
    title: "Nossa Galeria",
    description: "Explore nossos pratos de fusão asiática de dar água na boca e um ambiente aconchegante.",
    viewMore: "Ver Detalhes",
    prev: "Anterior",
    next: "Próximo"
  }
};

const Gallery: React.FC<GalleryProps> = ({ language }) => {
  // Get the appropriate translations based on the current language
  const text = translations[language];
  
  // State to track the current slide
  const [currentIndex, setCurrentIndex] = useState(0);

  // Images hosted on PostImage
  const images = [
    {
      img: "https://i.postimg.cc/76nnmD9x/image4.jpg",
      alt: "Sushi platter"
    },
    {
      img: "https://i.postimg.cc/x8jyZ7pL/image2.jpg",
      alt: "Asian noodle soup"
    },
    {
      img: "https://i.postimg.cc/vTPLwzCk/image3.jpg",
      alt: "Dim sum selection"
    },
    {
      img: "https://i.postimg.cc/fW5vdzkC/Image1.jpg",
      alt: "Restaurant interior"
    },
    {
      img: "https://i.postimg.cc/dt1jmbyY/image5.jpg",
      alt: "Restaurant interior"
    },
    {
      img: "https://i.postimg.cc/SNv7Zg6z/image6.jpg",
      alt: "Restaurant interior"
    }
  ];

  // Animation variants for the heading section
  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: -50,
      transition: { duration: 0.5, ease: "easeIn" }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const underlineVariants = {
    hidden: { 
      width: 0,
      transition: { duration: 0.3, ease: "easeIn" }
    },
    visible: { 
      width: "100%",
      transition: { duration: 0.5, ease: "easeOut", delay: 0.2 }
    }
  };

  // Animation variants for carousel slides
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        duration: 0.5
      }
    })
  };

  // Create InView reference for the title section
  const [titleRef, titleInView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  });

  // Create InView reference for the carousel
  const [carouselRef, carouselInView] = useInView({
    threshold: 0.2,
    triggerOnce: false
  });

  // Direction state for animations
  const [direction, setDirection] = useState(0);

  // Handler for next slide
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handler for previous slide
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Auto advance carousel every 5 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <section className="py-16 md:py-20 bg-black overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          ref={titleRef}
          initial="hidden"
          animate={titleInView ? "visible" : "hidden"}
          variants={titleVariants}
          className="text-center mb-10 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">{text.title}</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">{text.description}</p>
          <div className="relative h-1 w-16 md:w-24 mx-auto mt-3">
            <motion.div
              variants={underlineVariants}
              className="absolute h-full bg-amber-500"
            ></motion.div>
          </div>
        </motion.div>

        {/* Carousel container */}
        <div 
          ref={carouselRef} 
          className="relative h-64 md:h-90 lg:h-screen lg:max-h-[600px] overflow-hidden rounded-lg shadow-lg"
        >
          <AnimatePresence initial={false} custom={direction}>
            {/* Move the subtitle div to the bottom */}
<motion.div
key={currentIndex}
custom={direction}
variants={slideVariants}
initial="enter"
animate="center"
exit="exit"
className="absolute w-full h-full"
>
<img 
  src={images[currentIndex].img} 
  alt={images[currentIndex].alt}
  className="w-full h-full object-contain"
/>
<div className="absolute bottom-0 left-0 right-0 bg-black/60 py-3 px-4">
  <div className="text-white text-center">
    <div className="text-xl md:text-2xl font-bold">{images[currentIndex].alt}</div>
  </div>
</div>
</motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition-colors"
            aria-label={text.prev}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition-colors"
            aria-label={text.next}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Indicator dots */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
  {images.map((_, index) => (
    <button
      key={index}
      onClick={() => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
      }}
      className={`w-3 h-3 rounded-full transition-colors ${
        index === currentIndex ? 'bg-amber-400' : 'bg-white/50 hover:bg-white/80'
      }`}
      aria-label={`Go to slide ${index + 1}`}
    />
  ))}
</div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;