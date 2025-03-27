import React, { useState, useEffect } from 'react';
import { Clock, Facebook, Instagram, UtensilsCrossed, Mail, Phone, Users, CalendarDays, Truck, TrendingUp, Eye, X, Store, ChefHat, Tag, Save } from 'lucide-react';
import { db } from './firebase/config';
import { doc, onSnapshot, collection, getDocs, query, orderBy, limit, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
import DrinksSection from './components/DrinksSection';

interface RestaurantStatus {
  isOpen: boolean;
  lastUpdated: string;
}

interface TodaysSpecial {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isActive: boolean;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  validUntil: string;
  isActive: boolean;
}

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
    email: "Email",
    specialOffers: "Special Offers!",
    closeOffers: "Close"
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
    email: "E-mail",
    specialOffers: "Ofertas Especiais!",
    closeOffers: "Fechar"
  }
};

function App() {
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'pt'>('en');
  const [restaurantStatus, setRestaurantStatus] = useState<RestaurantStatus>({
    isOpen: true,
    lastUpdated: new Date().toISOString()
  });
  const [todaysSpecial, setTodaysSpecial] = useState<TodaysSpecial | null>(null);
  const [activeOffers, setActiveOffers] = useState<Offer[]>([]);
  const [showOfferPopup, setShowOfferPopup] = useState(false);

  useEffect(() => {
    // Listen to restaurant status changes
    const statusRef = doc(db, 'settings', 'restaurantStatus');
    const unsubscribe = onSnapshot(statusRef, (snapshot) => {
      if (snapshot.exists()) {
        setRestaurantStatus(snapshot.data() as RestaurantStatus);
      }
    });

    // Listen to today's special changes
    const specialRef = doc(db, 'settings', 'todaysSpecial');
    const specialUnsubscribe = onSnapshot(specialRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as TodaysSpecial;
        if (data.isActive) {
          setTodaysSpecial(data);
        } else {
          setTodaysSpecial(null);
        }
      }
    });

    // Listen to active offers
    const offersRef = collection(db, 'offers');
    const offersUnsubscribe = onSnapshot(offersRef, (snapshot) => {
      const offers = snapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id } as Offer))
        .filter(offer => 
          offer.isActive && 
          new Date(offer.validUntil) > new Date()
        );
      setActiveOffers(offers);
      setShowOfferPopup(offers.length > 0);
    });

    return () => {
      unsubscribe();
      specialUnsubscribe();
      offersUnsubscribe();
    };
  }, []);

  const handleLanguageChange = (newLang: 'en' | 'pt') => {
    setLanguage(newLang);
  };

  const handleBookTable = () => {
    if (restaurantStatus.isOpen) {
      setIsReservationModalOpen(true);
    }
  };

  const footerText = footerTranslations[language];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar 
        onBookTable={handleBookTable} 
        language={language} 
        onLanguageChange={handleLanguageChange}
        isReservationsOpen={restaurantStatus.isOpen}
      />
      
      <main className="flex-grow pt-16">
        <Hero 
          onBookTable={handleBookTable} 
          language={language}
          isReservationsOpen={restaurantStatus.isOpen} 
        />
        <About language={language} />
        <Gallery language={language} />
        <MenuSection 
          language={language} 
          todaysSpecial={todaysSpecial}
          activeOffers={activeOffers}
        />
        <DrinksSection language={language} />
        <Reviews language={language} />
        <Careers language={language} />
        <Delivery language={language} />
        <Contact language={language} />
      </main>

      {/* Offers Popup */}
      {showOfferPopup && activeOffers.length > 0 && (
        <div className="fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-xl border border-amber-400/20 p-4 z-50">
          <button 
            onClick={() => setShowOfferPopup(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
          <h3 className="text-lg font-semibold text-amber-600 mb-2">
            {footerText.specialOffers}
          </h3>
          {activeOffers.map((offer, index) => (
            <div 
              key={offer.id}
              className={`${index > 0 ? 'mt-2 pt-2 border-t border-gray-200' : ''}`}
            >
              <p className="font-medium text-gray-800">{offer.title}</p>
              <p className="text-sm text-gray-600">{offer.description}</p>
              <p className="text-amber-500 font-semibold mt-1">
                {offer.discountPercentage}% OFF
              </p>
            </div>
          ))}
        </div>
      )}

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
                    className={`cursor-pointer transition-colors ${
                      restaurantStatus.isOpen 
                        ? 'hover:text-amber-400' 
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={restaurantStatus.isOpen ? handleBookTable : undefined}
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