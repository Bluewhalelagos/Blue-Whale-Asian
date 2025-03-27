

import React, { useState, useEffect } from "react";
import { UtensilsCrossed, AlertTriangle, ChefHat } from "lucide-react";
import { db } from '../firebase/config';
import { 
  collection, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';

interface TodaysSpecial {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isActive: boolean;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  validUntil: string;
  isActive: boolean;
  showOnLoad: boolean;
}

interface MenuSectionProps {
  language?: 'en' | 'pt';
}

// Translations remain the same as in the original code
const translations = { 
  en: {
    title: "Our Menu",
    subtitle: "Blue Whale Asian Fusion",
    clickToOpen: "Click to open",
    closeMenu: "Close Menu",
    description: "FOOD IS AN INTEGRAL PART OF ASIAN CULTURE AND HERITAGE. THE SIGNATURE MENU AT BLUE WHALE LAGOS CELEBRATES ASIAN CUISINE WITH AN EXTENSIVE SELECTION OF DISHES. FROM RICH AND AROMATIC CURRIES TO DELICATELY PREPARED RAMEN, OUR MISSION IS TO BRING A TASTE OF ASIAN FUSION CUISINE TO YOUR TABLE.",
    viewMenu: "View Our Menu",
    todaysSpecial: "Today's Special",
    specialOffers: "Special Offers",
    validUntil: "Valid until",
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
    todaysSpecial: "Especial do Dia",
    specialOffers: "Ofertas Especiais",
    validUntil: "Válido até",
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

const MenuSection: React.FC<MenuSectionProps> = ({ 
  language = 'en'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [todaysSpecials, setTodaysSpecials] = useState<TodaysSpecial[]>([]);
  const [activeOffers, setActiveOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the appropriate translations based on the current language
  const text = translations[language];
  
  // Using your hosted PDF URL
  const pdfUrl = "https://drive.google.com/file/d/173omJROvNhoX49x-zMB7oPR0R8Vb_2We/preview";

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setIsLoading(true);

        // Fetch Today's Specials
        const specialsQuery = query(
          collection(db, 'specials'), 
          where('isActive', '==', true)
        );
        const specialsSnapshot = await getDocs(specialsQuery);
        const specialsList = specialsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TodaysSpecial[];
        setTodaysSpecials(specialsList);

        // Fetch Active Offers
        const offersQuery = query(
          collection(db, 'offers'), 
          where('isActive', '==', true)
        );
        const offersSnapshot = await getDocs(offersQuery);
        const offersList = offersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Offer[];
        
        // Filter offers that are still valid
        const currentDate = new Date();
        const validOffers = offersList.filter(offer => 
          new Date(offer.validUntil) >= currentDate
        );
        
        setActiveOffers(validOffers);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  if (isLoading) {
    return (
      <section className="py-24 bg-black bg-opacity-50 text-center text-white">
        Loading menu data...
      </section>
    );
  }

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

        {/* Today's Special Section */}
        {todaysSpecials.length > 0 && (
          <div className="max-w-3xl mx-auto mb-12 bg-black/60 backdrop-blur-sm rounded-lg border border-amber-400/20 p-6">
            <div className="flex items-center mb-4">
              <ChefHat className="text-amber-400 mr-3" size={32} />
              <h3 className="text-2xl font-bold text-amber-400">
                {text.todaysSpecial}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {todaysSpecials.map((special) => (
                <div key={special.id} className="flex items-center space-x-6">
                  <img 
                    src={special.image} 
                    alt={special.name}
                    className="w-40 h-40 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">
                      {special.name}
                    </h4>
                    <p className="text-gray-300 mb-3">
                      {special.description}
                    </p>
                    <p className="text-2xl font-bold text-amber-400">
                      €{special.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Offers Section */}
        {activeOffers.length > 0 && (
          <div className="max-w-3xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeOffers.map((offer) => (
                <div 
                  key={offer.id}
                  className="bg-amber-400/10 backdrop-blur-sm border border-amber-400/20 rounded-lg p-6"
                >
                  <h4 className="text-xl font-semibold text-amber-400 mb-2">
                    {offer.title}
                  </h4>
                  <p className="text-gray-300 mb-3">
                    {offer.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-white">
                      {offer.discountPercentage}% OFF
                    </span>
                    <span className="text-sm text-gray-400">
                      {text.validUntil} {new Date(offer.validUntil).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rest of the component remains the same */}
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