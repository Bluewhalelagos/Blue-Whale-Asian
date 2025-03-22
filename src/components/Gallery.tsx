import React from 'react';
import Image1 from '../Image1.jpg';
import Image2 from '../Image2.jpg';
import Image3 from '../Image3.jpg';
import Image4 from '../Image4.jpg';
import Image5 from '../Image5.jpg';
import Image6 from '../Image6.jpg';

interface GalleryProps {
  language: 'en' | 'pt';
}

// Define translations for the Gallery component
const translations = {
  en: {
    title: "Our Gallery",
    description: "Explore our mouth-watering Asian fusion dishes and cozy ambiance.",
    viewMore: "View Details"
  },
  pt: {
    title: "Nossa Galeria",
    description: "Explore nossos pratos de fusão asiática de dar água na boca e um ambiente aconchegante.",
    viewMore: "Ver Detalhes"
  }
};

const Gallery: React.FC<GalleryProps> = ({ language }) => {
  // Get the appropriate translations based on the current language
  const text = translations[language];

  // Import images directly to ensure they're properly bundled
  const images = [
    {
      img: Image4,
      alt: "Sushi platter",
      span: "col-span-2 row-span-2"
    },
    {
      img: Image2,
      alt: "Asian noodle soup",
      span: "col-span-1 row-span-1"
    },
    {
      img: Image3,
      alt: "Dim sum selection",
      span: "col-span-1 row-span-2"
    },
    {
      img: Image1,
      alt: "Restaurant interior",
      span: "col-span-1 row-span-2"
    },
    {
      img: Image5,
      alt: "Restaurant interior",
      span: "col-span-2 row-span-1"
    },
    {
      img: Image6,
      alt: "Restaurant interior",
      span: "col-span-1 row-span-1"
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">{text.title}</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">{text.description}</p>
          <div className="w-16 md:w-24 h-1 bg-amber-500 mx-auto mt-3"></div>
        </div>

        {/* Mobile gallery (1 column) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {images.map((image, index) => (
            <div key={index} className="relative h-64 overflow-hidden rounded-lg shadow-lg group">
              <img 
                src={image.img} 
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center">
                <p className="text-amber-400 text-lg font-semibold text-center px-2">{image.alt}</p>
                <button className="mt-3 px-4 py-2 bg-amber-500 text-black text-sm font-medium rounded hover:bg-amber-400 transition-colors">
                  {text.viewMore}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet and Desktop gallery (grid layout) */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-min">
          {images.map((image, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden rounded-lg shadow-lg group ${image.span}`}
              style={{ height: image.span.includes('row-span-2') ? '500px' : '240px' }}
            >
              <img 
                src={image.img} 
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center">
                <p className="text-amber-400 text-lg font-semibold text-center px-2">{image.alt}</p>
                <button className="mt-3 px-4 py-2 bg-amber-500 text-black text-sm font-medium rounded hover:bg-amber-400 transition-colors">
                  {text.viewMore}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;