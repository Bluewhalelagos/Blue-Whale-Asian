import React from 'react';

interface GalleryProps {
  language: 'en' | 'pt';
}

// Define translations for the Gallery component
const translations = {
  en: {
    title: "Our Gallery",
    description: "Explore our mouth-watering Asian fusion dishes and cozy ambiance."
  },
  pt: {
    title: "Nossa Galeria",
    description: "Explore nossos pratos de fusão asiática de dar água na boca e um ambiente aconchegante."
  }
};

const Gallery: React.FC<GalleryProps> = ({ language }) => {
  // Get the appropriate translations based on the current language
  const text = translations[language];

  const images = [
    {
      url: "https://images.unsplash.com/photo-1535016120720-40c646be5580?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
      alt: "Sushi platter"
    },
    {
      url: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
      alt: "Asian noodle soup"
    },
    {
      url: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
      alt: "Dim sum selection"
    },
    {
      url: "https://images.unsplash.com/photo-1583835746434-cf1534674b41?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
      alt: "Restaurant interior"
    }
  ];

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-400 mb-2">{text.title}</h2>
          <p className="text-gray-300">{text.description}</p>
          <div className="w-24 h-1 bg-amber-500 mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <div key={index} className="relative h-64 overflow-hidden rounded-lg shadow-lg group">
              <img 
                src={image.url} 
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <p className="text-amber-400 text-lg font-semibold text-center">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
