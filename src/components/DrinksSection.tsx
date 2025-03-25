import React, { useState } from "react";
import { Martini, AlertTriangle, Wine, Cocktail } from "lucide-react";

interface DrinksSectionProps {
  language: 'en' | 'pt';
}

// Translations for the Drinks Menu section (existing translations remain the same)
const translations = {
  en: {
    title: "Cocktail Mixology",
    subtitle: "Innovative Beverages at Blue Whale",
    description: "EXPLORE OUR CAREFULLY CRAFTED COCKTAIL COLLECTION. OUR MIXOLOGISTS BLEND INNOVATIVE TECHNIQUES WITH UNIQUE INGREDIENTS, CREATING A SENSORY JOURNEY THAT COMPLEMENTS OUR ASIAN FUSION CUISINE.",
    viewMenu: "Explore Drink Selection",
    clickToOpen: "Click to Discover Cocktails",
    closeMenu: "Close Drinks Menu",
    barInfo: {
      title: "Our Mixology Craft",
      description: "Immerse yourself in a world of liquid artistry. Our bar is a sanctuary of innovation, where traditional techniques meet contemporary creativity. Each cocktail is a carefully composed symphony of flavors, crafted to surprise and delight."
    },
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
    barInfo: {
      title: "Nossa Arte da Mixologia",
      description: "Mergulhe em um mundo de arte líquida. Nosso bar é um santuário de inovação, onde técnicas tradicionais encontram criatividade contemporânea. Cada coquetel é uma sinfonia cuidadosamente composta de sabores, criada para surpreender e encantar."
    },
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

const DrinksSection: React.FC<DrinksSectionProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get the appropriate translations based on the current language
  const text = translations[language];

  // Drinks menu PDF URL
  const pdfUrl = "https://drive.google.com/file/d/1KUj1bDZ30RWWVaF8I45jbAizdKAAcS01/preview";

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
      {/* Overlay with pattern */}
      <div className="absolute inset-0 bg-black bg-opacity-70 z-0" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-amber-400 mb-2">{text.title}</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
          
          <p className="text-gray-300 max-w-2xl mx-auto mt-8 leading-relaxed">
            {text.description}
          </p>
        </div>

        {/* Bar Information Section */}
        <div className="max-w-5xl mx-auto mb-16 grid md:grid-cols-2 gap-8 items-center">
          <div className="relative overflow-hidden rounded-lg shadow-xl group">
            <img 
              src="https://i.postimg.cc/T3hL1Pqz/cocktails.jpg" 
              alt="Blue Whale Mixology Bar" 
              className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-center">
                <Cocktail className="mx-auto mb-4 text-amber-400" size={48} />
                <p className="text-white text-lg font-semibold px-4">{text.barInfo.title}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-amber-400 mb-4">{text.barInfo.title}</h3>
            <p className="text-gray-300 leading-relaxed">
              {text.barInfo.description}
            </p>
            <div className="mt-6 flex space-x-4">
              <Wine className="text-amber-400" size={32} />
              <Martini className="text-amber-400" size={32} />
            </div>
          </div>
        </div>

        {/* Rest of the existing code remains the same */}
        <div className="max-w-3xl mx-auto">
          {isOpen ? (
            <>
              <div className="backdrop-blur-md bg-black/60 rounded-lg border border-amber-400/20 shadow-xl p-6 mb-6">
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

              {/* Disclaimer Section */}
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
            </>
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
      </div>
    </section>
  );
};

export default DrinksSection;