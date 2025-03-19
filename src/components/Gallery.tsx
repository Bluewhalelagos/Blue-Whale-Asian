import React from 'react';

const Gallery = () => {
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
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Our Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <div key={index} className="relative h-64 overflow-hidden rounded-lg shadow-lg">
              <img 
                src={image.url} 
                alt={image.alt}
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;