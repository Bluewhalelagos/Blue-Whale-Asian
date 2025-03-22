import React from 'react';

interface AboutProps {
  language?: 'en' | 'pt';
}

const About: React.FC<AboutProps> = ({ language = 'en' }) => {
  const translations = {
    en: {
      aboutUs: "About Us",
      paragraph1: "Nestled by the ocean, Blue Whale Restaurant in Lagos is a seafood lover’s paradise. With a commitment to fresh, locally sourced ingredients, we create culinary masterpieces that blend tradition with innovation.",
      paragraph2: "From succulent lobster tails to grilled octopus, each dish is crafted to perfection. Pair your meal with our curated wine selection and enjoy breathtaking ocean views for a truly unforgettable dining experience."
    },
    pt: {
      aboutUs: "Sobre Nós",
      paragraph1: "Situado à beira-mar, o Blue Whale Restaurant em Lagos é um paraíso para os amantes de frutos do mar. Comprometemo-nos a usar ingredientes frescos e locais para criar pratos que combinam tradição e inovação.",
      paragraph2: "Desde caudas de lagosta suculentas até polvo grelhado, cada prato é preparado com perfeição. Harmonize sua refeição com nossa seleção de vinhos e desfrute de vistas deslumbrantes do oceano para uma experiência gastronômica inesquecível."
    }
  };

  const text = translations[language];

  return (
    <section id="about" className="py-20 bg-black text-gray-300">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl font-bold text-amber-400 mb-6 relative">
              {text.aboutUs}
              <span className="block h-1 w-20 bg-amber-500 mt-2"></span>
            </h2>
            <p className="leading-relaxed mb-6">{text.paragraph1}</p>
            <p className="leading-relaxed">{text.paragraph2}</p>
          </div>

          <div className="relative h-96 order-1 md:order-2 rounded-lg overflow-hidden shadow-xl group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-300/20 to-amber-500/20 mix-blend-overlay z-10 rounded-lg"></div>
            <img 
              src="https://images.unsplash.com/photo-1512212621149-107ffe572d2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
              alt="Oceanfront dining at Blue Whale Restaurant"
              className="absolute inset-0 w-full h-full object-cover rounded-lg transform transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
