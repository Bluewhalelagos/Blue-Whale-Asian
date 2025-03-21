import React, { useState, useEffect } from 'react';
import { Menu, X, UtensilsCrossed, Clock, CheckCircle, XCircle } from 'lucide-react';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { translateText } from '../utils/translate';
import logoImage from '../BlueWhale-Final-logo1.png';

interface RestaurantStatus {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  lastUpdated: string;
}

interface NavbarProps {
  onBookTable: () => void;
  language: 'en' | 'pt';
  onLanguageChange: (language: 'en' | 'pt') => void;
}

// Define translations
const translations = {
  homeLink: { en: 'Home', pt: 'Início' },
  aboutLink: { en: 'About Us', pt: 'Sobre Nós' },
  menuLink: { en: 'Menu', pt: 'Cardápio' },
  bookTableLink: { en: 'Book Table', pt: 'Reservar Mesa' },
  deliveryLink: { en: 'Delivery', pt: 'Entrega' },
  careersLink: { en: 'Careers', pt: 'Carreiras' },
  openNow: { en: 'Open Now', pt: 'Aberto Agora' },
  closed: { en: 'Closed', pt: 'Fechado' },
  open: { en: 'Open', pt: 'Aberto' },
  until: { en: 'Until', pt: 'Até' },
  opensAt: { en: 'Opens at', pt: 'Abre às' },
  wereOpen: { en: 'We\'re Open', pt: 'Estamos Abertos' },
  wereClosed: { en: 'We\'re Closed', pt: 'Estamos Fechados' }
};

const Navbar: React.FC<NavbarProps> = ({ onBookTable, language, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dynamicTranslations, setDynamicTranslations] = useState<Record<string, string>>({});
  const [restaurantStatus, setRestaurantStatus] = useState<RestaurantStatus>({
    isOpen: true,
    openTime: '11:00 AM',
    closeTime: '10:00 PM',
    lastUpdated: new Date().toISOString()
  });

  // Translate function
  const t = (key: string): string => {
    return translations[key]?.[language] || dynamicTranslations[key] || key;
  };

  // Toggle language
  const toggleLanguage = async () => {
    const newLang = language === 'en' ? 'pt' : 'en';
    onLanguageChange(newLang);
    
    // Fetch dynamic translations for time-related texts if needed
    if (newLang === 'pt' && Object.keys(dynamicTranslations).length === 0) {
      try {
        const timeFormat = await translateText(`${restaurantStatus.openTime}`, 'pt');
        setDynamicTranslations(prev => ({
          ...prev,
          timeFormat
        }));
      } catch (error) {
        console.error("Translation error:", error);
      }
    }
  };

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Firebase restaurant status listener
  useEffect(() => {
    const statusRef = doc(db, 'settings', 'restaurantStatus');
    
    const unsubscribe = onSnapshot(statusRef, (snapshot) => {
      if (snapshot.exists()) {
        setRestaurantStatus(snapshot.data() as RestaurantStatus);
      }
    }, (error) => {
      console.error("Error getting restaurant status:", error);
    });
    
    return () => unsubscribe();
  }, []);

  const StatusIndicator = () => (
    <div className={`flex items-center px-3 py-1 rounded-full transition-all duration-300 ${
      restaurantStatus.isOpen       ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
      : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
    }`}>
      <div className="flex items-center mr-2">
        {restaurantStatus.isOpen ? (
          <CheckCircle className="h-4 w-4 mr-1 animate-pulse" />
        ) : (
          <XCircle className="h-4 w-4 mr-1" />
        )}
        <span className="font-medium text-sm">
          {restaurantStatus.isOpen ? t('openNow') : t('closed')}
        </span>
      </div>
      <div className="text-xs font-light opacity-90">
        {restaurantStatus.isOpen 
          ? `${t('until')} ${restaurantStatus.closeTime}` 
          : `${t('opensAt')} ${restaurantStatus.openTime}`}
      </div>
    </div>
  );

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-pink-300 shadow-lg text-pink-800' 
        : 'bg-pink-200 text-pink-700'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <img src={logoImage} alt="Blue Whale Asian Fusion Logo" className="w-32 h-auto" />
          </div>

          {/* Status Indicator - Desktop */}
          <div className="hidden md:flex items-center">
            <StatusIndicator />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="font-medium hover:text-pink-500 transition-colors duration-200">{t('homeLink')}</a>
            <a href="#about" className="font-medium hover:text-pink-500 transition-colors duration-200">{t('aboutLink')}</a>
            <a href="#menu" className="font-medium hover:text-pink-500 transition-colors duration-200">{t('menuLink')}</a>
            <button 
              onClick={onBookTable}
              className="font-medium flex items-center space-x-1 hover:text-pink-500 transition-colors duration-200"
            >
              <span>{t('bookTableLink')}</span>
              <UtensilsCrossed className="h-4 w-4" />
            </button>
            <a href="#delivery" className="font-medium hover:text-pink-500 transition-colors duration-200">{t('deliveryLink')}</a>
            <a href="#careers" className="font-medium hover:text-pink-500 transition-colors duration-200">{t('careersLink')}</a>
          </div>

          {/* Language Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => language !== 'en' && toggleLanguage()}
              className={`font-medium transition-colors duration-200 ${
                language === 'en' ? 'text-pink-500' : 'hover:text-pink-500'
              }`}
            >EN</button>
            <span className="text-pink-400">|</span>
            <button 
              onClick={() => language !== 'pt' && toggleLanguage()}
              className={`font-medium transition-colors duration-200 ${
                language === 'pt' ? 'text-pink-500' : 'hover:text-pink-500'
              }`}
            >PT</button>
          </div>

          {/* Mobile Status & Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <StatusIndicator />
            <button 
              className="p-1 text-pink-700"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - with smooth transition */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Full status display in mobile menu */}
            <div className={`flex items-center justify-between px-3 py-2 mb-2 rounded transition-all duration-300 ${
              restaurantStatus.isOpen 
                ? 'bg-green-500/20 border-l-4 border-green-500' 
                : 'bg-red-500/20 border-l-4 border-red-500'
            }`}>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span className="font-medium">
                  {restaurantStatus.isOpen ? t('wereOpen') : t('wereClosed')}
                </span>
              </div>
              <div className="text-xs">
                {restaurantStatus.isOpen 
                  ? `${t('until')} ${restaurantStatus.closeTime}` 
                  : `${t('opensAt')} ${restaurantStatus.openTime}`}
              </div>
            </div>
            
            <a href="#" className="block px-3 py-2 font-medium hover:bg-pink-200 rounded transition-colors duration-200">{t('homeLink')}</a>
            <a href="#about" className="block px-3 py-2 font-medium hover:bg-pink-200 rounded transition-colors duration-200">{t('aboutLink')}</a>
            <a href="#menu" className="block px-3 py-2 font-medium hover:bg-pink-200 rounded transition-colors duration-200">{t('menuLink')}</a>
            <button 
              onClick={() => {
                onBookTable();
                setIsOpen(false);
              }}
              className="flex items-center w-full text-left px-3 py-2 font-medium hover:bg-pink-200 rounded transition-colors duration-200"
            >
              <span>{t('bookTableLink')}</span>
              <UtensilsCrossed className="h-4 w-4 ml-1" />
            </button>
            <a href="#delivery" className="block px-3 py-2 font-medium hover:bg-pink-200 rounded transition-colors duration-200">{t('deliveryLink')}</a>
            <a href="#careers" className="block px-3 py-2 font-medium hover:bg-pink-200 rounded transition-colors duration-200">{t('careersLink')}</a>
            
            {/* Language toggle in mobile menu */}
            <div className="flex space-x-4 px-3 py-2">
              <button 
                onClick={() => language !== 'en' && toggleLanguage()}
                className={`font-medium transition-colors duration-200 ${
                  language === 'en' ? 'text-pink-500' : 'hover:text-pink-500'
                }`}
              >EN</button>
              <span className="text-pink-400">|</span>
              <button 
                onClick={() => language !== 'pt' && toggleLanguage()}
                className={`font-medium transition-colors duration-200 ${
                  language === 'pt' ? 'text-pink-500' : 'hover:text-pink-500'
                }`}
              >PT</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;