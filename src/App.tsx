import React, { useState } from 'react';
import { Menu, Clock, Phone, MapPin, Facebook, Instagram, UtensilsCrossed } from 'lucide-react';
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

function App() {
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  const handleBookTable = () => {
    setIsReservationModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onBookTable={handleBookTable} />
      <main>
        <Hero onBookTable={handleBookTable} />
        <About />
        <Gallery />
        <MenuSection />
        <Reviews />
        <Delivery />
        <Careers />
        <Contact />
      </main>
      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Blue Whale</h3>
              <p className="text-blue-200">Experience the Fusion of Flavors from Across Asia!</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Hours</h3>
              <div className="flex items-center space-x-2 text-blue-200">
                <Clock className="w-4 h-4" />
                <span>Mon-Sat: 11:00 AM - 10:00 PM</span>
              </div>
              <div className="text-amber-400 font-semibold mt-2">SUNDAY CLOSED</div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-blue-200">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>123 Ocean Drive, Seaside City</span>
                </div>
              </div>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-blue-200 hover:text-white">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-blue-200 hover:text-white">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-blue-800 text-center text-blue-200">
            <p><a href="./admin" className="hover:text-white transition-colors">&copy; 2024 Blue Whale Asian Fusion Restaurant. All rights reserved.</a></p>
          </div>
        </div>
      </footer>
      <ReservationModal 
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
      />
    </div>
  );
}

export default App;