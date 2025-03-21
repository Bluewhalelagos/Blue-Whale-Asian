import React from 'react';

interface HeroProps {
  onBookTable: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookTable }) => {
  return (
    <div className="relative h-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-pink-900/50"></div>
      </div>
      
      <div className="relative h-full flex items-center justify-center text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Experience the Fusion of Flavors from Across Asia!
          </h1>
          <p className="text-xl text-pink-50 mb-8 max-w-2xl mx-auto">
            Embark on a culinary journey through the finest Asian cuisines, 
            expertly crafted and beautifully presented.
          </p>
          <button 
            onClick={onBookTable}
            className="bg-pink-400 text-pink-900 px-8 py-3 rounded-full 
              text-lg font-semibold hover:bg-pink-300 transition-colors"
          >
            Book Your Table
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;