import React, { useState, useEffect } from 'react';
import { Menu, X, UtensilsCrossed, Clock, CheckCircle, XCircle } from 'lucide-react';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

interface RestaurantStatus {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  lastUpdated: string;
}

interface NavbarProps {
  onBookTable: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onBookTable }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [restaurantStatus, setRestaurantStatus] = useState<RestaurantStatus>({
    isOpen: true,
    openTime: '11:00 AM',
    closeTime: '10:00 PM',
    lastUpdated: new Date().toISOString()
  });

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
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

  return (
    <nav className={`text-white fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-blue-900 shadow-lg' : 'bg-blue-900/95'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <img 
              src="src/BlueWhale-Final-logo1.png" 
              alt="Blue Whale Asian Fusion Logo" 
              className="w-40 h-auto" 
            />
            <span className="text-xl font-bold">Blue Whale Asian</span>
          </div>

          {/* Status Indicator - Desktop */}
          <div className="hidden md:flex items-center">
            <div className={`flex items-center px-3 py-1 rounded-full transition-all duration-300 ${
              restaurantStatus.isOpen 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
            }`}>
              <div className="flex items-center mr-2">
                {restaurantStatus.isOpen ? (
                  <CheckCircle className="h-4 w-4 mr-1 animate-pulse" />
                ) : (
                  <XCircle className="h-4 w-4 mr-1" />
                )}
                <span className="font-medium text-sm">
                  {restaurantStatus.isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>
              <div className="text-xs font-light opacity-90">
                {restaurantStatus.isOpen 
                  ? `Until ${restaurantStatus.closeTime}` 
                  : `Opens at ${restaurantStatus.openTime}`}
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="font-medium hover:text-amber-400 transition-colors duration-200">Home</a>
            <a href="#about" className="font-medium hover:text-amber-400 transition-colors duration-200">About Us</a>
            <a href="#menu" className="font-medium hover:text-amber-400 transition-colors duration-200">Menu</a>
            <button 
              onClick={onBookTable}
              className="font-medium flex items-center space-x-1 hover:text-amber-400 transition-colors duration-200"
            >
              <span>Book Table</span>
              <UtensilsCrossed className="h-4 w-4" />
            </button>
            <a href="#delivery" className="font-medium hover:text-amber-400 transition-colors duration-200">Delivery</a>
            <a href="#careers" className="font-medium hover:text-amber-400 transition-colors duration-200">Careers</a>
          </div>

          {/* Language Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="font-medium text-amber-400 transition-colors duration-200 hover:text-amber-300">EN</button>
            <span>|</span>
            <button className="font-medium transition-colors duration-200 hover:text-amber-400">PT</button>
          </div>

          {/* Mobile Status & Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <div className={`flex items-center px-2 py-1 rounded-full text-xs transition-all duration-300 ${
              restaurantStatus.isOpen 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
            }`}>
              {restaurantStatus.isOpen ? (
                <CheckCircle className="h-3 w-3 mr-1 animate-pulse" />
              ) : (
                <XCircle className="h-3 w-3 mr-1" />
              )}
              <span>{restaurantStatus.isOpen ? 'Open' : 'Closed'}</span>
            </div>
            
            <button 
              className="p-1"
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
                  {restaurantStatus.isOpen ? 'We\'re Open' : 'We\'re Closed'}
                </span>
              </div>
              <div className="text-xs">
                {restaurantStatus.isOpen 
                  ? `Until ${restaurantStatus.closeTime}` 
                  : `Opens at ${restaurantStatus.openTime}`}
              </div>
            </div>
            
            <a href="#" className="block px-3 py-2 font-medium hover:bg-blue-800 rounded transition-colors duration-200">Home</a>
            <a href="#about" className="block px-3 py-2 font-medium hover:bg-blue-800 rounded transition-colors duration-200">About Us</a>
            <a href="#menu" className="block px-3 py-2 font-medium hover:bg-blue-800 rounded transition-colors duration-200">Menu</a>
            <button 
              onClick={() => {
                onBookTable();
                setIsOpen(false);
              }}
              className="flex items-center w-full text-left px-3 py-2 font-medium hover:bg-blue-800 rounded transition-colors duration-200"
            >
              <span>Book Table</span>
              <UtensilsCrossed className="h-4 w-4 ml-1" />
            </button>
            <a href="#delivery" className="block px-3 py-2 font-medium hover:bg-blue-800 rounded transition-colors duration-200">Delivery</a>
            <a href="#careers" className="block px-3 py-2 font-medium hover:bg-blue-800 rounded transition-colors duration-200">Careers</a>
            <div className="flex space-x-4 px-3 py-2">
              <button className="font-medium text-amber-400 transition-colors duration-200 hover:text-amber-300">EN</button>
              <span>|</span>
              <button className="font-medium transition-colors duration-200 hover:text-amber-400">PT</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;