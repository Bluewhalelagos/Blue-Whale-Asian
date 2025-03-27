import React, { useState, useEffect } from "react";
import { Martini, AlertTriangle, Wine, GlassWater as Cocktail, ChevronLeft, ChevronRight } from "lucide-react";
import tequila from "../Tequila.jpg"
interface DrinksSectionProps {
  language: 'en' | 'pt';
}

// Translations for the Drinks Menu section
const translations = {
  en: {
    title: "Cocktail Mixology",
    subtitle: "Innovative Beverages at Blue Whale",
    description: "EXPLORE OUR CAREFULLY CRAFTED COCKTAIL COLLECTION. OUR MIXOLOGISTS BLEND INNOVATIVE TECHNIQUES WITH UNIQUE INGREDIENTS, CREATING A SENSORY JOURNEY THAT COMPLEMENTS OUR ASIAN FUSION CUISINE.",
    viewMenu: "Explore Drink Selection",
    clickToOpen: "Click to Discover Cocktails",
    closeMenu: "Close Drinks Menu",
    disclaimer: {
      title: "Important Notice",
      content: "Pricing is in Euro (€). Guests with allergies and intolerances should inform a member of the team before placing an order for food or beverages.",
      allergenInfo: "Allergen & Dietary Indicators:"
    },
    allergenLogos: {
      vegan: "🌱 Vegan",
      vegetarian: "🥬 Vegetarian",
      glutenFree: "🌾 Gluten Free",
      lactoseFree: "🥛 Lactose Free",
      nutFree: "🥜 Nut Free"
    }
  },
  pt: {
    title: "Mixologia de Coquetéis",
    subtitle: "Bebidas Inovadoras no Blue Whale",
    description: "EXPLORE NOSSA COLEÇÃO CUIDADOSAMENTE ELABORADA DE COQUETÉIS. NOSSOS MIXOLOGISTAS COMBINAM TÉCNICAS INOVADORAS COM INGREDIENTES ÚNICOS, CRIANDO UMA JORNADA SENSORIAL QUE COMPLEMENTA NOSSA CULINÁRIA FUSION ASIÁTICA.",
    viewMenu: "Explorar Seleção de Bebidas",
    clickToOpen: "Clique para Descobrir Coquetéis",
    closeMenu: "Fechar Menu de Bebidas",
    disclaimer: {
      title: "Aviso Importante",
      content: "Os preços estão em Euros (€). Convidados com alergias e intolerâncias devem informar um membro da equipe antes de fazer um pedido de comida ou bebida.",
      allergenInfo: "Indicadores de Alérgenos e Dieta:"
    },
    allergenLogos: {
      vegan: "🌱 Vegano",
      vegetarian: "🥬 Vegetariano",
      glutenFree: "🌾 Sem Glúten",
      lactoseFree: "🥛 Sem Lactose",
      nutFree: "🥜 Sem Nozes"
    }
  }
};

// Carousel images data
const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80",
    title: "Signature Martini",
    description: "Our house special with a twist of citrus"
  },
  {
    url: "https://i.postimg.cc/V6hGkctX/Gin-and-Tonic.jpg",
    title: "Gin and Tonic",
    description: "Crisp gin with bubbly tonic and a zesty citrus twist."
  },
    {
    url: tequila,
    title: "Tequila Sunrise",
    description: "Vibrant tequila with citrus and a sunset glow."
  },
];

const DrinksSection: React.FC<DrinksSectionProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const text = translations[language];
  const pdfUrl = "https://drive.google.com/file/d/1KUj1bDZ30RWWVaF8I45jbAizdKAAcS01/preview";

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, isAnimating]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section 
      id="drinks" 
      className="py-24 bg-black bg-opacity-50 relative"
      style={{
        backgroundImage: "url('https://i.postimg.cc/dt3XzP0m/drinks.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundBlendMode: "overlay"
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70 z-0" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-amber-400 mb-2">{text.title}</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
          <p className="text-gray-300 max-w-2xl mx-auto mt-8 leading-relaxed">
            {text.description}
          </p>
        </div>

        {/* Animated Carousel Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="relative overflow-hidden rounded-xl shadow-2xl">
            <div className="relative h-[500px] md:h-[600px]">
              {carouselImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                    index === currentSlide 
                      ? 'translate-x-0 opacity-100'
                      : index < currentSlide 
                        ? '-translate-x-full opacity-0'
                        : 'translate-x-full opacity-0'
                  }`}
                >
                  <div className="relative h-full">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <h3 className="text-3xl font-bold mb-2">{image.title}</h3>
                        <p className="text-gray-300">{image.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ChevronRight size={24} />
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? 'bg-amber-400 w-4' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="max-w-3xl mx-auto mb-12">
          {isOpen ? (
            <div className="backdrop-blur-md bg-black/60 rounded-lg border border-amber-400/20 shadow-xl p-6">
              <div className="flex justify-end mb-4">
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  {text.closeMenu}
                </button>
              </div>
              
              {/* PDF Viewer */}
              <div className="w-full aspect-[3/4] rounded overflow-hidden">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-0"
                  title="Blue Whale Drinks Menu"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <div 
              className="book-cover cursor-pointer mx-auto max-w-sm" 
              onClick={() => setIsOpen(true)}
            >
              <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-b from-black to-gray-900 text-white p-8 rounded-lg border border-amber-400/40 shadow-xl transition-all duration-300 hover:translate-y-2 hover:shadow-amber-500/20 hover:shadow-lg">
                <Martini className="w-24 h-24 text-amber-400 mb-6" />
                <h1 className="text-4xl font-bold text-white text-center mb-3">
                  {text.title}
                </h1>
                <h2 className="text-2xl text-amber-400 text-center">
                  {text.subtitle}
                </h2>
                <p className="text-gray-300 text-center mt-6">
                  {text.clickToOpen}
                </p>

                <div className="mt-8 flex justify-center">
                  <div className="w-12 h-1 bg-amber-400/50"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Always Visible Disclaimer Section */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-amber-900/20 border border-amber-400/30 rounded-lg p-6 text-center">
            <div className="flex justify-center items-center mb-4">
              <AlertTriangle className="text-amber-400 mr-3" size={32} />
              <h3 className="text-2xl font-bold text-amber-400">
                {text.disclaimer.title}
              </h3>
            </div>

            <div className="mb-4">
              <p className="text-gray-300 max-w-2xl mx-auto mb-4">
                {text.disclaimer.content}
              </p>
            </div>

            <div className="bg-amber-900/30 rounded-lg p-4">
              <h4 className="text-amber-300 font-semibold mb-3">
                {text.disclaimer.allergenInfo}
              </h4>
              <div className="flex justify-center space-x-4 flex-wrap">
                {Object.entries(text.allergenLogos).map(([key, label]) => (
                  <span 
                    key={key} 
                    className="text-sm text-gray-200 bg-black/30 px-3 py-1 rounded-full flex items-center"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DrinksSection;