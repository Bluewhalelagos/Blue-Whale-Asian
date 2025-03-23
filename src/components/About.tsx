import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface AboutProps {
  language?: 'en' | 'pt';
}

const About: React.FC<AboutProps> = ({ language = 'en' }) => {
  const translations = {
    en: {
      aboutUs: "About Us",
      paragraph1: "Nestled by the ocean, Blue Whale Restaurant in Lagos is a seafood lover's paradise. With a commitment to fresh, locally sourced ingredients, we create culinary masterpieces that blend tradition with innovation.",
      paragraph2: "From succulent lobster tails to grilled octopus, each dish is crafted to perfection. Pair your meal with our curated wine selection and enjoy breathtaking ocean views for a truly unforgettable dining experience."
    },
    pt: {
      aboutUs: "Sobre Nós",
      paragraph1: "Situado à beira-mar, o Blue Whale Restaurant em Lagos é um paraíso para os amantes de frutos do mar. Comprometemo-nos a usar ingredientes frescos e locais para criar pratos que combinam tradição e inovação.",
      paragraph2: "Desde caudas de lagosta suculentas até polvo grelhado, cada prato é preparado com perfeição. Harmonize sua refeição com nossa seleção de vinhos e desfrute de vistas deslumbrantes do oceano para uma experiência gastronômica inesquecível."
    }
  };

  const text = translations[language];

  // Animation controls
  const textControls = useAnimation();
  const imageControls = useAnimation();
  const underlineControls = useAnimation();

  // Set up refs for intersection observer with triggerOnce set to false to enable animations on scroll back
  const [textRef, textInView] = useInView({ 
    threshold: 0.2,
    triggerOnce: false
  });
  
  const [imageRef, imageInView] = useInView({ 
    threshold: 0.2,
    triggerOnce: false
  });

  // Trigger animations when elements come into view or leave view
  useEffect(() => {
    if (textInView) {
      textControls.start('visible');
      underlineControls.start('visible');
    } else {
      textControls.start('hidden');
      underlineControls.start('hidden');
    }
  }, [textControls, underlineControls, textInView]);

  useEffect(() => {
    if (imageInView) {
      imageControls.start('visible');
    } else {
      imageControls.start('hidden');
    }
  }, [imageControls, imageInView]);

  // Animation variants
  const textVariants = {
    hidden: { 
      opacity: 0, 
      x: -50,
      transition: {
        duration: 0.6,
        ease: "easeIn",
        staggerChildren: 0.2,
        staggerDirection: -1
      }
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.3
      }
    }
  };

  const paragraphVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      transition: { 
        duration: 0.4, 
        ease: "easeIn" 
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      }
    }
  };

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      x: 50,
      transition: { 
        duration: 0.6, 
        ease: "easeIn" 
      }
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      }
    }
  };

  const underlineVariants = {
    hidden: { 
      width: 0,
      transition: { 
        duration: 0.4, 
        ease: "easeIn" 
      }
    },
    visible: {
      width: "5rem",
      transition: { 
        duration: 0.6, 
        ease: "easeOut", 
        delay: 0.4 
      }
    }
  };

  return (
    <section id="about" className="py-20 bg-black text-gray-300 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            ref={textRef}
            initial="hidden"
            animate={textControls}
            variants={textVariants}
            className="order-2 md:order-1"
          >
            <motion.h2 className="text-4xl font-bold text-amber-400 mb-6 relative">
              {text.aboutUs}
              <motion.span 
                variants={underlineVariants}
                className="block h-1 bg-amber-500 mt-2"
              ></motion.span>
            </motion.h2>
            
            <motion.p 
              variants={paragraphVariants} 
              className="leading-relaxed mb-6"
            >
              {text.paragraph1}
            </motion.p>
            
            <motion.p 
              variants={paragraphVariants} 
              className="leading-relaxed"
            >
              {text.paragraph2}
            </motion.p>
          </motion.div>

          <motion.div 
            ref={imageRef}
            initial="hidden"
            animate={imageControls}
            variants={imageVariants}
            className="relative h-96 order-1 md:order-2 rounded-lg overflow-hidden shadow-xl group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-300/20 to-amber-500/20 mix-blend-overlay z-10 rounded-lg"></div>
            
            <motion.img 
              src="https://i.postimg.cc/pLHKMWdg/Interior.jpg"
              alt="Oceanfront dining at Blue Whale Restaurant"
              className="absolute inset-0 w-full h-full object-cover rounded-lg transform transition-transform duration-700 group-hover:scale-110"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;