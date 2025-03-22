import React, { useState } from 'react';
import { Clock, Facebook, Instagram, UtensilsCrossed, Mail, Phone } from 'lucide-react';

// Import components
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
import logoImage from './BlueWhale-Final-logo1.png';

// Define translations for the footer
const footerTranslations = {
  en: {
    experienceFusion: "Experience the Fusion of Flavors from Across Asia!",
    hours: "Hours",
    openingHours: "Thu - Tue: 5:00 PM - 10:00 PM",
    wednesdayClosed: "WEDNESDAY CLOSED",
    copyright: "© 2025 Blue Whale Asian Fusion Restaurant. All rights reserved.",
    findUs: "Find Us",
    followUs: "Follow Us",
    contactUs: "Contact Us",
    phone: "Phone",
    email: "Email"
  },
  pt: {
    experienceFusion: "Experimente a Fusão de Sabores de Toda a Ásia!",
    hours: "Horário",
    openingHours: "Qui - Ter: 17:00 - 22:00",
    wednesdayClosed: "QUARTA-FEIRA FECHADO",
    copyright: "© 2025 Blue Whale Asian Fusion Restaurant. Todos os direitos reservados.",
    findUs: "Encontre-nos",
    followUs: "Siga-nos",
    contactUs: "Contate-nos",
    phone: "Telefone",
    email: "E-mail"
  }
};

function App() {
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'pt'>('en');

  const handleLanguageChange = (newLang: 'en' | 'pt') => {
    setLanguage(newLang);
  };

  const handleBookTable = () => {
    setIsReservationModalOpen(true);
  };

  const footerText = footerTranslations[language];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar 
        onBookTable={handleBookTable} 
        language={language} 
        onLanguageChange={handleLanguageChange} 
      />
      
      <main className="flex-grow pt-16">
        <Hero onBookTable={handleBookTable} language={language} />
        <About language={language} />
        <Gallery language={language} />
        <MenuSection language={language} />
        <Reviews language={language} />
        <Careers language={language} />
        <Delivery language={language} />
        <Contact language={language} />
      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-200 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
            
            {/* Column 1 - Logo & Tagline & Social Media */}
            <div className="flex flex-col items-center md:items-start">
              <img src={logoImage} alt="Blue Whale Logo" className="w-50 height-auto mb-4" />
              <h3 className="text-xl font-semibold text-amber-400 text-center md:text-centre">
                {footerText.experienceFusion}
              </h3>
              
            </div>

            {/* Column 2 - Opening Hours */}
            <div>
              <h3 className="text-lg font-semibold text-amber-400">{footerText.hours}</h3>
              <div className="flex items-center justify-center md:justify-start mt-2">
                <Clock size={18} className="mr-2 text-amber-400" />
                <span>{footerText.openingHours}</span>
              </div>
              <p className="font-bold mt-2">{footerText.wednesdayClosed}</p>
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-amber-400">{footerText.followUs}</h4>
                <div className="flex justify-center md:justify-start space-x-4 mt-2">
  <a href="https://www.facebook.com/your-facebook-page" target="_blank" rel="noopener noreferrer">
    <Facebook size={24} className="cursor-pointer hover:text-amber-400 transition-colors" />
  </a>
  <a href="https://www.instagram.com/bluewhalelagos?igsh=MTdyaTJuMGp0dTVkYw==" target="_blank" rel="noopener noreferrer">
    <Instagram size={24} className="cursor-pointer hover:text-amber-400 transition-colors" />
  </a>
  <UtensilsCrossed 
    size={24} 
    className="cursor-pointer hover:text-amber-400 transition-colors" 
    onClick={handleBookTable} 
  />
</div>


              </div>
            </div>

            {/* Column 3 - Contact & Map */}
            <div>
              <h3 className="text-lg font-semibold text-amber-400">{footerText.contactUs}</h3>
              <div className="mt-2 flex flex-col space-y-2">
                <div className="flex items-center justify-center md:justify-start">
                  <Phone size={18} className="text-amber-400 mr-2" />
                  <span>+351 920 221 805</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Mail size={18} className="text-amber-400 mr-2" />
                  <span>bluewhalelagos@gmail.com</span>
                </div>
              </div>

              {/* Map Section */}
              <h3 className="text-lg font-semibold text-amber-400 mt-6">{footerText.findUs}</h3>
              <div className="w-full h-48 rounded-lg overflow-hidden shadow-lg mt-2">
                <iframe
                  title="Restaurant Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3213.1046391779385!2d-8.673272!3d37.09243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1b31e07f6d7553%3A0x4016490adb0bfc7d!2sBlue%20Whale%20Restaurant!5e0!3m2!1sen!2spt!4v1616505234240!5m2!1sen!2spt"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true}
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-10 pt-4 border-t border-gray-700 text-center">
            <p className="text-gray-400">{footerText.copyright}</p>
          </div>
        </div>
      </footer>

      {/* Reservation Modal */}
      <ReservationModal 
        isOpen={isReservationModalOpen} 
        onClose={() => setIsReservationModalOpen(false)}
        language={language}
      />
    </div>
  );
}

export default App;
