import React, { useState, useEffect } from 'react';
import { Clock, Phone, MapPin, Facebook, Instagram, UtensilsCrossed } from 'lucide-react';

// Import your existing components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Gallery from './components/Gallery';
import MenuSection from './components/MenuSection';
import Reviews from './components/Reviews';
import Careers from './components/Careers';
import Delivery from './components/Delivery';
import Contact from './components/Contact';
import ReservationModal from './components/ReservationModal';

// Optional: Import translation utility if you have it
import { translateText } from './utils/translate';

// Define translations for the footer section
const footerTranslations = {
  en: {
    experienceFusion: "Experience the Fusion of Flavors from Across Asia!",
    hours: "Hours",
    openingHours: "Mon-Sat: 11:00 AM - 10:00 PM",
    sundayClosed: "SUNDAY CLOSED",
    contact: "Contact",
    address: "Largo Salazar Moscovo, Lote 4, Loja A, 8600-522, Lagos",
    copyright: "© 2025 Blue Whale Asian Fusion Restaurant. All rights reserved.",
    findUs: "Find Us"
  },
  pt: {
    experienceFusion: "Experimente a Fusão de Sabores de Toda a Ásia!",
    hours: "Horário",
    openingHours: "Seg-Sáb: 11:00 - 22:00",
    sundayClosed: "DOMINGO FECHADO",
    contact: "Contacto",
    address: "Largo Salazar Moscovo, Lote 4, Loja A, 8600-522, Lagos",
    copyright: "© 2025 Blue Whale Asian Fusion Restaurant. Todos os direitos reservados.",
    findUs: "Encontre-nos"
  }
};

function App() {
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'pt'>('en');
  
  // Listen for language changes from Navbar component
  const handleLanguageChange = (newLang: 'en' | 'pt') => {
    setLanguage(newLang);
  };

  const handleBookTable = () => {
    setIsReservationModalOpen(true);
  };

  // Use your footer translations
  const footerText = footerTranslations[language];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Pass language state & handler to Navbar */}
      <Navbar onBookTable={handleBookTable} />
      
      <main className="flex-grow pt-16"> {/* Added pt-16 to account for fixed navbar */}
        <Hero />
        <About />
        <Gallery />
        <MenuSection />
        <Reviews />
        <Careers />
        <Delivery />
        <Contact />
      </main>
      
      <footer className="bg-pink-50 text-pink-800 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
            <img 
              src="src/BlueWhale-Final-logo1.png" 
              alt="Restaurant Logo" 
              className="w-50 h-auto" 
            />
              <h3 className="text-xl font-bold mb-4">{footerText.experienceFusion}</h3>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">{footerText.hours}</h3>
              <div className="flex items-center justify-center mb-2">
                <Clock size={18} className="mr-2 text-pink-600" />
                <span>{footerText.openingHours}</span>
              </div>
              <p className="font-bold">{footerText.sundayClosed}</p>
            </div>
            
            <div className="text-center md:text-right">
              <h3 className="text-xl font-bold mb-4">{footerText.contact}</h3>
              <div className="flex items-center justify-center md:justify-end mb-2">
                <Phone size={18} className="mr-2 text-pink-600" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center justify-center md:justify-end mb-4">
                <MapPin size={18} className="mr-2 text-pink-600" />
                <span>{footerText.address}</span>
              </div>
              <div className="flex justify-center md:justify-end space-x-4">
                <Facebook size={24} className="cursor-pointer hover:text-pink-600" />
                <Instagram size={24} className="cursor-pointer hover:text-pink-600" />
                <UtensilsCrossed size={24} className="cursor-pointer hover:text-pink-600" />
              </div>
            </div>
          </div>
          
          {/* Map Widget */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-center">{footerText.findUs}</h3>
            <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
              <iframe
                title="Restaurant Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3213.1046391779385!2d-8.67236!3d37.10136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1b31e07f6d7553%3A0x4016490adb0bfc7d!2sLargo%20Salazar%20Moscovo%2C%20Lote%204%2C%20Loja%20A%2C%208600-522%20Lagos!5e0!3m2!1sen!2spt!4v1616505234240!5m2!1sen!2spt"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true}
                loading="lazy"
              ></iframe>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-pink-200 text-center">
            <p>{footerText.copyright}</p>
          </div>
        </div>
      </footer>
      
      <ReservationModal 
        isOpen={isReservationModalOpen} 
        onClose={() => setIsReservationModalOpen(false)}
        language={language}
      />
    </div>
  );
}

export default App;