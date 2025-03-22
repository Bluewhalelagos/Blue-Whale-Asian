import React, { useState } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(0);
  const reviewsCount = text.reviews.length;
  
  // Function to rotate to next review
  const nextReview = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % reviewsCount);
  };
  
  // Function to rotate to previous review
  const prevReview = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + reviewsCount) % reviewsCount);
  };
  
  // Auto-rotate every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      nextReview();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Get the indices of the previous, current, and next reviews
  const getReviewIndex = (offset: number) => {
    return (activeIndex + offset + reviewsCount) % reviewsCount;
  };

  return (
    <section id="reviews" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-amber-400 mb-2">{text.title}</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative h-96">
          {/* Carousel container with perspective */}
          <div className="perspective-container relative h-full w-full overflow-hidden">
            {/* Previous Review (Left Side) */}
            <div 
              className="absolute top-0 left-0 w-4/5 lg:w-1/3 h-full transition-all duration-500 ease-in-out transform -translate-x-8 scale-90 opacity-60 z-10"
              style={{ 
                transform: 'translateX(-6%) translateZ(-100px) rotateY(10deg) scale(0.9)',
                filter: 'brightness(0.7)' 
              }}
            >
              <ReviewCard review={text.reviews[getReviewIndex(-1)]} />
            </div>
            
            {/* Active Review (Center) */}
            <div 
              className="absolute top-0 left-0 right-0 mx-auto w-4/5 lg:w-2/5 h-full transition-all duration-500 ease-in-out transform translate-y-0 scale-100 z-20"
              style={{ 
                transform: 'translateX(0) translateZ(0) rotateY(0deg) scale(1)',
                left: '50%',
                marginLeft: '-40%',
                '@media (min-width: 1024px)': {
                  marginLeft: '-20%'
                }
              }}
            >
              <ReviewCard review={text.reviews[activeIndex]} />
            </div>
            
            {/* Next Review (Right Side) */}
            <div 
              className="absolute top-0 right-0 w-4/5 lg:w-1/3 h-full transition-all duration-500 ease-in-out transform translate-x-8 scale-90 opacity-60 z-10"
              style={{ 
                transform: 'translateX(6%) translateZ(-100px) rotateY(-10deg) scale(0.9)',
                filter: 'brightness(0.7)' 
              }}
            >
              <ReviewCard review={text.reviews[getReviewIndex(1)]} />
            </div>
          </div>
          
          {/* Navigation buttons */}
          <button 
            onClick={prevReview}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-amber-400/80 hover:bg-amber-500 rounded-full p-2 text-black"
            aria-label="Previous review"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextReview}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-amber-400/80 hover:bg-amber-500 rounded-full p-2 text-black"
            aria-label="Next review"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-8 space-x-2 absolute bottom-0 left-0 right-0">
            {text.reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-amber-400' : 'bg-amber-400/30'}`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Add custom styles for 3D effect */}
      <style jsx>{`
        .perspective-container {
          perspective: 1000px;
          transform-style: preserve-3d;
        }
      `}</style>
    </section>
  );
};

// Separate component for each review card
const ReviewCard = ({ review }: { review: any }) => {
  return (
    <div className="h-full backdrop-blur-sm bg-black/40 rounded-lg border border-amber-400/20 shadow-xl p-8 text-center">
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
  );
};

export default Reviews;