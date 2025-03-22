import React from 'react';

interface AboutProps {
  language?: 'en' | 'pt';
}

const About: React.FC<AboutProps> = ({ language = 'en' }) => {
  // Define translations similar to other sections
  const translations = {
    en: {
      aboutUs: "About Us",
      paragraph1: "With years of experience cooking in the finest restaurants, our chef has crafted a menu that takes you on a culinary journey through the best flavors of Asia.",
      paragraph2: "Every dish is prepared with the freshest ingredients and meticulous attention to detail, ensuring an unforgettable dining experience that combines tradition with modern innovation."
    },
    pt: {
      aboutUs: "Sobre Nós",
      paragraph1: "Com anos de experiência nos melhores restaurantes, o nosso chef criou um menu que o leva numa viagem culinária pelos melhores sabores da Ásia.",
      paragraph2: "Cada prato é preparado com os ingredientes mais frescos e atenção meticulosa aos detalhes, garantindo uma experiência gastronómica inesquecível que combina tradição e inovação."
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
              alt="Chef preparing Asian fusion cuisine"
              className="absolute inset-0 w-full h-full object-cover rounded-lg transform transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
