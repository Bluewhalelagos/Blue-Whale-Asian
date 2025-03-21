import React from 'react';

interface HeroProps {
  onBookTable: () => void;
  language: 'en' | 'pt';
}

// Define translations for the Hero component
const translations = {
  en: {
    heading: "Experience the Fusion of Flavors from Across Asia!",
    subheading: "Embark on a culinary journey through the finest Asian cuisines, expertly crafted and beautifully presented.",
    buttonText: "Book Your Table"
  },
  pt: {
    heading: "Experimente a Fusão de Sabores de Toda a Ásia!",
    subheading: "Embarque numa jornada culinária pelas melhores cozinhas asiáticas, habilmente elaboradas e lindamente apresentadas.",
    buttonText: "Reserve Sua Mesa"
  }
};

const Hero: React.FC<HeroProps> = ({ onBookTable, language }) => {
  // Get the appropriate translations based on the current language
  const text = translations[language];

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
            {text.heading}
          </h1>
          <p className="text-xl text-pink-50 mb-8 max-w-2xl mx-auto">
            {text.subheading}
          </p>
          <button
            onClick={onBookTable}
            className="bg-pink-400 text-pink-900 px-8 py-3 rounded-full
              text-lg font-semibold hover:bg-pink-300 transition-colors"
          >
            {text.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;