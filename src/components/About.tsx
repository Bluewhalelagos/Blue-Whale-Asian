import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface AboutProps {
  language?: 'en' | 'pt';
}

const About: React.FC<AboutProps> = ({ language = 'en' }) => {
  const translations = {
    en: {
      aboutUs: "Innovation with Elegance.",
      paragraph1: "Founded in 2022, Blue Whale Lagos celebrates Asian Fusion cuisine through innovative techniques, with locally sourced freshest ingredients and contemporary flair.",
      paragraph2: "The kitchen is led by our talented chef whose passion lies in crafting uniquely rooted yet modern dishes. Every dish is prepared with meticulous attention to detail, ensuring an unforgettable dining experience with succulent from the wok to Special Lamb stew, each dish is crafted to perfection. Pair your meal with our curated wine selection and enjoy a truly unforgettable dining experience. Visit us and discover Blue Whale’s Fusion Feast."
    },
    pt: {
      aboutUs: "Inovação com Elegância.",
      paragraph1: "Fundado em 2022, o Blue Whale Lagos celebra a culinária de Fusão Asiática através de técnicas inovadoras, com os ingredientes mais frescos e um toque contemporâneo.",
      paragraph2: "A cozinha é liderada pelo nosso talentoso chef, cuja paixão reside na criação de pratos unicamente enraizados, mas modernos. Cada prato é preparado com atenção meticulosa aos detalhes, garantindo uma experiência gastronômica inesquecível, desde pratos suculentos preparados no wok até o Ensopado Especial de Cordeiro, cada prato é feito com perfeição. Harmonize sua refeição com nossa seleção de vinhos e desfrute de uma experiência verdadeiramente inesquecível. Visite-nos e descubra o Banquete de Fusão do Blue Whale."
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