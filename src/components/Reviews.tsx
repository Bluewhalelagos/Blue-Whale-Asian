import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Star } from 'lucide-react';

interface ReviewsProps {
  language: 'en' | 'pt';
}

// Define translations for the Reviews component
const translations = {
  en: {
    title: "Customer Reviews",
    reviews: [
      {
        name: "Sarah Chen",
        rating: 5,
        text: "The fusion of flavors here is incredible! The Blue Whale Special Ramen is a must-try.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      },
      {
        name: "Michael Rodriguez",
        rating: 5,
        text: "Best Asian fusion restaurant in the city. The attention to detail in every dish is remarkable.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      },
      {
        name: "Emily Wong",
        rating: 5,
        text: "Amazing ambiance and even better food. The service is impeccable!",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      }
    ]
  },
  pt: {
    title: "Avaliações dos Clientes",
    reviews: [
      {
        name: "Sarah Chen",
        rating: 5,
        text: "A fusão de sabores aqui é incrível! O Ramen Especial Blue Whale é imperdível.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      },
      {
        name: "Michael Rodriguez",
        rating: 5,
        text: "O melhor restaurante de fusão asiática da cidade. A atenção aos detalhes em cada prato é notável.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      },
      {
        name: "Emily Wong",
        rating: 5,
        text: "Ambiente incrível e comida ainda melhor. O serviço é impecável!",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
      }
    ]
  }
};

const Reviews: React.FC<ReviewsProps> = ({ language }) => {
  // Get the appropriate translations based on the current language
  const text = translations[language];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    dotsClass: "slick-dots custom-dots"
  };

  return (
    <section id="reviews" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-amber-400 mb-2">{text.title}</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Slider {...settings}>
            {text.reviews.map((review, index) => (
              <div key={index} className="px-4">
                <div className="backdrop-blur-sm bg-black/40 rounded-lg border border-amber-400/20 shadow-xl p-8 text-center">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-20 h-20 rounded-full mx-auto mb-6 object-cover border-2 border-amber-400"
                  />
                  <div className="flex justify-center mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-current text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic mb-6 text-lg">"{review.text}"</p>
                  <p className="font-semibold text-amber-300 text-lg">{review.name}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      
      {/* Add custom styles for slider dots to match theme */}
      <style jsx>{`
        :global(.custom-dots li button:before) {
          color: #f59e0b !important; /* amber-500 */
        }
        :global(.custom-dots li.slick-active button:before) {
          color: #f59e0b !important; /* amber-500 */
        }
      `}</style>
    </section>
  );
};

export default Reviews;