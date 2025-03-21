import React, { useContext } from 'react';

// Assuming you might have a language context, but making it optional
interface AboutProps {
  language?: 'en' | 'pt';
}

const About: React.FC<AboutProps> = ({ language = 'en' }) => {
  // Define translations similar to your navbar component
  const translations = {
    en: {
      aboutUs: "About Us",
      paragraph1: "With years of experience cooking in the finest restaurants, our chef has crafted a menu that takes you on a culinary journey through the best flavors of Asia. From rich and aromatic curries to delicately prepared sushi, our mission is to bring a taste of authentic Asian fusion cuisine to your table.",
      paragraph2: "Every dish is prepared with the freshest ingredients and meticulous attention to detail, ensuring an unforgettable dining experience that combines traditional techniques with modern innovation."
    },
    pt: {
      aboutUs: "Sobre Nós",
      paragraph1: "Com anos de experiência a cozinhar nos melhores restaurantes, o nosso chef criou um menu que o leva numa viagem culinária pelos melhores sabores da Ásia. Desde curries ricos e aromáticos até sushi delicadamente preparado, a nossa missão é trazer um sabor de autêntica cozinha de fusão asiática à sua mesa.",
      paragraph2: "Cada prato é preparado com os ingredientes mais frescos e com meticulosa atenção aos detalhes, garantindo uma experiência gastronómica inesquecível que combina técnicas tradicionais com inovação moderna."
    }
  };

  const text = translations[language];

  return (
    <section id="about" className="py-20 bg-pink-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-pink-700 mb-6 relative">
              {text.aboutUs}
              <span className="block h-1 w-20 bg-pink-400 mt-2"></span>
            </h2>
            <p className="text-pink-800 leading-relaxed mb-6">
              {text.paragraph1}
            </p>
            <p className="text-pink-800 leading-relaxed">
              {text.paragraph2}
            </p>
          </div>
          <div className="relative h-96 order-1 md:order-2 rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-300/30 to-pink-500/30 mix-blend-overlay z-10 rounded-lg"></div>
            <img 
              src="https://images.unsplash.com/photo-1512212621149-107ffe572d2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
              alt="Chef preparing Asian fusion cuisine"
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;