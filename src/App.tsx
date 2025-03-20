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
    <div className="min-h-screen bg-cream-50">
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
      <footer className="bg-cream-100 text-blue-400 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img src="src/BlueWhale-Final-logo1.png" alt="Blue Whale Asian Fusion Logo" className="w-64 h-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4 text-blue-500">Blue Whale Asian Fusion</h3>
              <p className="text-blue-400">Experience the Fusion of Flavors from Across Asia!</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-500">Hours</h3>
              <div className="flex items-center space-x-2 text-blue-400">
                <Clock className="w-4 h-4" />
                <span>Mon-Sat: 11:00 AM - 10:00 PM</span>
              </div>
              <div className="text-amber-400 font-semibold mt-2">SUNDAY CLOSED</div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-500">Contact</h3>
              <div className="space-y-2 text-blue-400">
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
                <a href="#" className="text-blue-400 hover:text-blue-600">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-blue-400 hover:text-blue-600">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-cream-200 text-center text-blue-400">
            <p><a href="./admin" className="hover:text-blue-600 transition-colors">&copy; 2024 Blue Whale Asian Fusion Restaurant. All rights reserved.</a></p>
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