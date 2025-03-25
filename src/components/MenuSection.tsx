import React, { useState } from "react";
import { UtensilsCrossed, AlertTriangle } from "lucide-react";

interface MenuSectionProps {
  language: 'en' | 'pt';
}

// Define translations for the Menu component
const translations = { 
  en: {
    title: "Our Menu",
    subtitle: "Blue Whale Asian Fusion",
    clickToOpen: "Click to open",
    closeMenu: "Close Menu",
    description: "FOOD IS AN INTEGRAL PART OF ASIAN CULTURE AND HERITAGE. THE SIGNATURE MENU AT BLUE WHALE LAGOS CELEBRATES ASIAN CUISINE WITH AN EXTENSIVE SELECTION OF DISHES. FROM RICH AND AROMATIC CURRIES TO DELICATELY PREPARED RAMEN, OUR MISSION IS TO BRING A TASTE OF ASIAN FUSION CUISINE TO YOUR TABLE.",
    viewMenu: "View Our Menu",
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
    title: "Nosso Menu",
    subtitle: "Blue Whale Fusão Asiática",
    clickToOpen: "Clique para abrir",
    closeMenu: "Fechar Menu",
    description: "A comida é uma parte essencial da cultura e herança asiática. O menu exclusivo do Blue Whale Lagos celebra a culinária asiática com uma ampla seleção de pratos. Desde curries ricos e aromáticos até Ramen delicadamente preparados, nossa missão é trazer o sabor da fusão asiática para a sua mesa.",
    viewMenu: "Ver Nosso Menu",
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

const MenuSection: React.FC<MenuSectionProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get the appropriate translations based on the current language
  const text = translations[language];
  
  // Using your hosted PDF URL
  const pdfUrl = "https://drive.google.com/file/d/173omJROvNhoX49x-zMB7oPR0R8Vb_2We/preview";

  return (
    <section 
      id="menu" 
      className="py-24 bg-black bg-opacity-50 relative"
      style={{
        backgroundImage: "url('https://i.postimg.cc/SRVj0htp/Menu.png')",
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
                    title="Blue Whale Asian Fusion Menu"
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
                <UtensilsCrossed className="w-24 h-24 text-amber-400 mb-6" />
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

export default MenuSection;