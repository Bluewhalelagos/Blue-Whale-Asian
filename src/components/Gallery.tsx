import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface GalleryProps {
  language: 'en' | 'pt';
}

// Define translations for the Gallery component
const translations = {
  en: {
    title: "Our Gallery",
    description: "Explore our mouth-watering Asian fusion dishes and cozy ambiance.",
    viewMore: "View Details"
  },
  pt: {
    title: "Nossa Galeria",
    description: "Explore nossos pratos de fusão asiática de dar água na boca e um ambiente aconchegante.",
    viewMore: "Ver Detalhes"
  }
};

const Gallery: React.FC<GalleryProps> = ({ language }) => {
  // Get the appropriate translations based on the current language
  const text = translations[language];

  // Images hosted on PostImage with animation directions
  const images = [
    {
      img: "https://i.postimg.cc/76nnmD9x/image4.jpg",
      alt: "Sushi platter",
      span: "col-span-2 row-span-2",
      direction: { x: -100, y: 0 } // from left
    },
    {
      img: "https://i.postimg.cc/x8jyZ7pL/image2.jpg",
      alt: "Asian noodle soup",
      span: "col-span-1 row-span-1",
      direction: { x: 0, y: -100 } // from top
    },
    {
      img: "https://i.postimg.cc/vTPLwzCk/image3.jpg",
      alt: "Dim sum selection",
      span: "col-span-1 row-span-2",
      direction: { x: 100, y: 0 } // from right
    },
    {
      img: "https://i.postimg.cc/fW5vdzkC/Image1.jpg",
      alt: "Restaurant interior",
      span: "col-span-1 row-span-2",
      direction: { x: -100, y: 0 } // from left
    },
    {
      img: "https://i.postimg.cc/dt1jmbyY/image5.jpg",
      alt: "Restaurant interior",
      span: "col-span-2 row-span-1",
      direction: { x: 0, y: 100 } // from bottom
    },
    {
      img: "https://i.postimg.cc/SNv7Zg6z/image6.jpg",
      alt: "Restaurant interior",
      span: "col-span-1 row-span-1",
      direction: { x: 100, y: 0 } // from right
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

  // Create InView references for the title section
  const [titleRef, titleInView] = useInView({
    threshold: 0.3,
    triggerOnce: false
  });

  // Create a function to generate image variants based on direction
  const generateImageVariants = (direction) => {
    return {
      hidden: {
        opacity: 0,
        x: direction.x,
        y: direction.y,
        transition: { duration: 0.5, ease: "easeIn" }
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" }
      }
    };
  };

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

        {/* Mobile gallery (1 column) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {images.map((image, index) => {
            const [ref, inView] = useInView({
              threshold: 0.2,
              triggerOnce: false
            });
            
            return (
              <motion.div
                key={index}
                ref={ref}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={generateImageVariants(image.direction)}
                className="relative h-64 overflow-hidden rounded-lg shadow-lg group"
              >
                <img 
                  src={image.img} 
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center">
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tablet and Desktop gallery (grid layout) */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-min">
          {images.map((image, index) => {
            const [ref, inView] = useInView({
              threshold: 0.2,
              triggerOnce: false
            });
            
            return (
              <motion.div 
                key={index}
                ref={ref}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={generateImageVariants(image.direction)}
                className={`relative overflow-hidden rounded-lg shadow-lg group ${image.span}`}
                style={{ height: image.span.includes('row-span-2') ? '500px' : '240px' }}
              >
                <img 
                  src={image.img} 
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center">
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Gallery;