import React, { useState } from "react";
import { UtensilsCrossed } from "lucide-react";

interface MenuSectionProps {
  language: 'en' | 'pt';
}

// Define translations for the Menu component
const translations = {
  en: {
    title: "Our Menu",
    subtitle: "Blue Whale Asian Fusion",
    clickToOpen: "Click to open",
    closeMenu: "Close Menu"
  },
  pt: {
    title: "Nosso Menu",
    subtitle: "Blue Whale Fusão Asiática",
    clickToOpen: "Clique para abrir",
    closeMenu: "Fechar Menu"
  }
};

const MenuSection: React.FC<MenuSectionProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get the appropriate translations based on the current language
  const text = translations[language];
  
  // Using your hosted PDF URL
  const pdfUrl = "https://drive.google.com/file/d/173omJROvNhoX49x-zMB7oPR0R8Vb_2We/preview";

  return (
    <section id="menu" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-amber-400 mb-2">{text.title}</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>

        <div className="max-w-3xl mx-auto">
          {isOpen ? (
            <div className="backdrop-blur-sm bg-black/40 rounded-lg border border-amber-400/20 shadow-xl p-6">
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
          ) : (
            <div 
              className="book-cover cursor-pointer mx-auto max-w-sm" 
              onClick={() => setIsOpen(true)}
            >
              <div className="flex flex-col items-center justify-center h-96 bg-black text-white p-8 rounded-lg border border-amber-400/40 shadow-xl transition-all duration-300 hover:translate-y-2 hover:shadow-amber-500/20 hover:shadow-lg">
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
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;