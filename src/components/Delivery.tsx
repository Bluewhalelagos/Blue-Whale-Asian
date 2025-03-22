import React from 'react';
import { BeerIcon as UberIcon } from 'lucide-react';

interface DeliveryProps {
  language: 'en' | 'pt';
}

// Define translations for the Delivery component
const translations = {
  en: {
    title: "Order for Delivery",
    description: "Discover flavors that will make you want more. Get ready to fall in love with our menu selections. Don’t just order, create a masterpiece with our menu. Order now!",
    uberEatsInfo: "Order now through Uber Eats for quick and reliable delivery.",
    orderButton: "Order on Uber Eats"
  },
  pt: {
    title: "Encomende para Entrega",
    description: "Descubra sabores que vão deixá-lo com vontade de mais. Prepare-se para se apaixonar pelas nossas opções do menu. Não se limite a encomendar, crie uma verdadeira obra-prima com o nosso menu. Peça agora!",
    uberEatsInfo: "Encomende agora através do Uber Eats para uma entrega rápida e confiável.",
    orderButton: "Encomendar no Uber Eats"
  }
};


const Delivery: React.FC<DeliveryProps> = ({ language }) => {
  // Get the appropriate translations based on the current language
  const text = translations[language];

  return (
    <section id="delivery" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-amber-400 mb-2">{text.title}</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>
        
        <div className="max-w-3xl mx-auto backdrop-blur-sm bg-black/40 p-8 rounded-lg border border-amber-400/20 shadow-xl">
          <div className="text-center space-y-6">
            <p className="text-gray-300 text-lg">{text.description}</p>
            <p className="text-gray-300">{text.uberEatsInfo}</p>
            
            <a 
              href="https://www.ubereats.com/pt-en/store/blue-whale/LGjKJ7FRQKG0Cem15PZSGA" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center bg-amber-500 text-black font-bold px-6 py-3 rounded-md hover:bg-amber-400 transition-colors"
            >
              <UberIcon className="w-5 h-5 mr-2" />
              {text.orderButton}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Delivery;