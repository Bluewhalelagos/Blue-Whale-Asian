import React, { useState } from 'react';
import { Menu, X, UtensilsCrossed } from 'lucide-react';

interface NavbarProps {
  onBookTable: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onBookTable }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-900 text-white fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
          <img 
    src="https://freeimage.host/i/3xXrzru" 
    alt="Blue Whale Logo" 
    className="h-8 w-8" 
  />
  <span className="text-xl font-bold">Blue Whale Asian</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="hover:text-amber-400 transition-colors">Home</a>
            <a href="#about" className="hover:text-amber-400 transition-colors">About Us</a>
            <a href="#menu" className="hover:text-amber-400 transition-colors">Menu</a>
            <button 
              onClick={onBookTable}
              className="hover:text-amber-400 transition-colors"
            >
              Book Table
            </button>
            <a href="#delivery" className="hover:text-amber-400 transition-colors">Delivery</a>
            <a href="#careers" className="hover:text-amber-400 transition-colors">Careers</a>
          </div>

          {/* Language Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-amber-400">EN</button>
            <span>|</span>
            <button>PT</button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 hover:bg-blue-800 rounded">Home</a>
              <a href="#about" className="block px-3 py-2 hover:bg-blue-800 rounded">About Us</a>
              <a href="#menu" className="block px-3 py-2 hover:bg-blue-800 rounded">Menu</a>
              <button 
                onClick={() => {
                  onBookTable();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 hover:bg-blue-800 rounded"
              >
                Book Table
              </button>
              <a href="#delivery" className="block px-3 py-2 hover:bg-blue-800 rounded">Delivery</a>
              <a href="#careers" className="block px-3 py-2 hover:bg-blue-800 rounded">Careers</a>
              <div className="flex space-x-4 px-3 py-2">
                <button className="text-amber-400">EN</button>
                <span>|</span>
                <button>PT</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;