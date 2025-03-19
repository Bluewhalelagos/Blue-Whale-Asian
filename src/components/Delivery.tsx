import React from 'react';
import { BeerIcon as UberIcon } from 'lucide-react';

const Delivery = () => {
  return (
    <section id="delivery" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Order for Delivery</h2>
          <p className="text-gray-600 mb-8">
            Enjoy our delicious Asian fusion cuisine from the comfort of your home. 
            Order now through Uber Eats for quick and reliable delivery.
          </p>
          <a 
            href="https://www.ubereats.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-colors"
          >
            <span className="mr-2">Order on Uber Eats</span>
            <UberIcon className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Delivery;