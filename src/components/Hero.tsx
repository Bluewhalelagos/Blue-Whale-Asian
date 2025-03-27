import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import logoImage from '../BlueWhale-Final-logo.png';
import ReservationsClosedModal from './ReservationsClosedModal';

interface HeroProps {
  onBookTable: () => void;
  language: 'en' | 'pt';
  isReservationsOpen?: boolean;
}

// Define translations for the Hero component
const translations = {
  en: {
    subheading: "Blue Whale Lagos is open for dine-in and take away from Thursday to Tuesday with dinner service available from 5:00 PM to 10:00 PM.",
    heading: "Embark on a culinary journey through the finest Asian cuisines, expertly crafted and beautifully presented.",
    buttonText: "Book Your Table",
    reservationsOpen: "Reservations Open",
    reservationsClosed: "Reservations Closed"
  },
  pt: {
    subheading: "O Blue Whale Lagos está aberto para refeições no local e para levar de quinta a terça-feira, com serviço de jantar disponível das 17h00 às 22h00.",
    heading: "Embarque numa jornada culinária pelas melhores cozinhas asiáticas, habilmente elaboradas e lindamente apresentadas.",
    buttonText: "Reserve Sua Mesa",
    reservationsOpen: "Reservas Abertas",
    reservationsClosed: "Reservas Fechadas"
  }
};

const Hero: React.FC<HeroProps> = ({ onBookTable, language, isReservationsOpen = true }) => {
  const [showClosedModal, setShowClosedModal] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const text = translations[language];

  const handleBookTableClick = () => {
    if (isReservationsOpen) {
      onBookTable();
    } else {
      setShowClosedModal(true);
    }
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      {/* Background and overlay */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        initial={{ scale: 1.1 }}
        animate={{ 
          scale: 1, 
          y: scrollY * 0.2
        }}
        transition={{ 
          scale: { duration: 1.5, ease: "easeOut" }
        }}
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80")',
        }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </motion.div>

      {/* Main content */}
      <div className="relative h-full flex items-center justify-center text-center">
        <div className="container mx-auto px-6">
          {/* Logo and Status */}
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src={logoImage} 
                  alt="Blue Whale Asian Fusion Logo" 
                  className="w-28"
                />
              </div>
            </motion.div>

            {/* Reservation Status Indicator */}
            
          </div>

          {/* Heading */}
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {text.heading}
          </motion.h1>
          
          {/* Subheading */}
          <motion.p 
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto drop-shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {text.subheading}
          </motion.p>
          
          {/* Book Table Button */}
          <motion.button
            onClick={handleBookTableClick}
            className={`relative px-8 py-3 rounded-full text-lg font-semibold shadow-lg 
              transition-all duration-300 hover:scale-105 overflow-hidden z-10 ${
              isReservationsOpen
                ? 'bg-amber-500 text-black hover:bg-amber-400'
                : 'bg-gray-500 text-white cursor-not-allowed'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            whileHover={isReservationsOpen ? { scale: 1.05 } : {}}
            whileTap={isReservationsOpen ? { scale: 0.98 } : {}}
          >
            {text.buttonText}
          </motion.button>
        </div>
      </div>

      {/* Scroll Indicator */}
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

      {/* Reservations Closed Modal */}
      <ReservationsClosedModal
        isOpen={showClosedModal}
        onClose={() => setShowClosedModal(false)}
        language={language}
      />
    </div>
  );
};

export default Hero;