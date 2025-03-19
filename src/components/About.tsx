import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-6">About Us</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              With years of experience cooking in the finest restaurants, our chef has crafted 
              a menu that takes you on a culinary journey through the best flavors of Asia. 
              From rich and aromatic curries to delicately prepared sushi, our mission is to 
              bring a taste of authentic Asian fusion cuisine to your table.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Every dish is prepared with the freshest ingredients and meticulous attention 
              to detail, ensuring an unforgettable dining experience that combines traditional 
              techniques with modern innovation.
            </p>
          </div>
          <div className="relative h-96">
            <img 
              src="https://images.unsplash.com/photo-1512212621149-107ffe572d2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
              alt="Chef preparing sushi"
              className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;