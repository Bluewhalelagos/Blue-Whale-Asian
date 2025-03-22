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
        name: "Katherine020",
        location: "Scotland",
        rating: 5,
        text: "This restaurant was recommended to us and we are glad we went. What a nice place. Excellent service and tasty food. We will return.",
        date: "January 20, 2025",
        image: "https://i.postimg.cc/C17JjbJm/default-avatar-2020-44.jpg"
      },
      {
        name: "Lennekevs",
        location: "Rotterdam",
        rating: 5,
        text: "What a nice restaurant! You can sit here really nice, the service is friendly, and the food is unbelievably good! We will come back!",
        date: "January 9, 2025",
        image: "https://i.postimg.cc/85NtJZd7/default-avatar-2020-68.jpg"
      },
      {
        name: "Naomi v",
        location: "Rotterdam",
        rating: 5,
        text: "Tasty dishes, lovely vegetarian options (I recommend the lemongrass soup), and kid-friendly. Would recommend it!",
        date: "January 2025",
        image: "https://i.postimg.cc/yxfQz0Zk/default-avatar-2020-32.jpg"
      },
      {
        name: "Heather S",
        location: "Unknown",
        rating: 5,
        text: "Love! Love! Love this place! Service was exceptional and food was even better. The Korean chicken wings were crispy and perfectly seasoned. I had the Pad Thai chicken. It was so flavorful. My husband said the buttered prawns might be his best meal ever!",
        date: "September 2024",
        image: "https://i.postimg.cc/mrM5Fc05/default-avatar-2020-63.jpg"
      },
      {
        name: "Lesley E",
        location: "Unknown",
        rating: 5,
        text: "We visited last night having heard from family and friends how good it was. Everything was freshly prepared. We all had different meals and all agreed they were full of flavor, very tasty, and high quality. Will be going back very soon to try some new dishes. There are plenty of vegetarian options as well. Staff are brilliant. Highly recommend you to try it as you won't be disappointed.",
        date: "August 12, 2022",
        image: "https://i.postimg.cc/C5K7JdQY/default-avatar-2020-14.jpg"
      }
    ]
  },
  pt: {
    title: "Avaliações dos Clientes",
    reviews: [
      {
        name: "Katherine020",
        location: "Escócia",
        rating: 5,
        text: "Este restaurante foi recomendado para nós e ficamos felizes por termos ido. Que lugar agradável. Serviço excelente e comida saborosa. Voltaremos.",
        date: "20 de janeiro de 2025",
        image: "https://i.postimg.cc/C17JjbJm/default-avatar-2020-44.jpg"
      },
      {
        name: "Lennekevs",
        location: "Roterdã",
        rating: 5,
        text: "Que restaurante agradável! O ambiente é ótimo, o atendimento é amigável e a comida é incrivelmente boa! Voltaremos!",
        date: "9 de janeiro de 2025",
        image: "https://i.postimg.cc/85NtJZd7/default-avatar-2020-68.jpg"
      },
      {
        name: "Naomi v",
        location: "Roterdã",
        rating: 5,
        text: "Pratos saborosos, ótimas opções vegetarianas (recomendo a sopa de capim-limão) e um ambiente adequado para crianças. Recomendo!",
        date: "janeiro de 2025",
        image: "https://i.postimg.cc/yxfQz0Zk/default-avatar-2020-32.jpg"
      },
      {
        name: "Heather S",
        location: "Desconhecido",
        rating: 5,
        text: "Amo! Amo! Amo este lugar! O serviço foi excepcional e a comida foi ainda melhor. As asas de frango coreanas estavam crocantes e perfeitamente temperadas. Comi o Pad Thai de frango, que estava cheio de sabor. Meu marido disse que os camarões amanteigados podem ter sido a melhor refeição da vida dele!",
        date: "setembro de 2024",
        image: "https://i.postimg.cc/mrM5Fc05/default-avatar-2020-63.jpg"
      },
      {
        name: "Lesley E",
        location: "Desconhecido",
        rating: 5,
        text: "Visitamos na noite passada depois de ouvir de amigos e familiares o quão bom era. Tudo foi preparado na hora. Todos pedimos pratos diferentes e concordamos que eram cheios de sabor, muito gostosos e de alta qualidade. Voltaremos em breve para experimentar novos pratos. Há muitas opções vegetarianas também. A equipe é incrível. Recomendo muito que você experimente, pois não ficará desapontado.",
        date: "12 de agosto de 2022",
        image: "https://i.postimg.cc/C5K7JdQY/default-avatar-2020-14.jpg"
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
      <div className="mb-16 md:mb-24 text-center pb-6">
      <h2 
        className="text-4xl font-bold text-amber-400 mb-1" 
        aria-label={text.title}
      >
        {text.title}
      </h2>
      <div className="w-24 h-1 bg-amber-500 mx-auto mb-16 "></div>
    </div>
    
        
        <div className="max-w-6xl mx-auto relative h-auto min-h-96 mt-16 md:mt-16">
          {/* Carousel container with perspective */}
          <div className="perspective-container relative h-full w-full overflow-visible py-8">
            {/* Previous Review (Left Side) */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 left-0 w-4/5 lg:w-1/3 transition-all duration-500 ease-in-out z-10"
              style={{ 
                transform: 'translateX(-6%) translateZ(-100px) translateY(-50%) rotateY(10deg) scale(0.9)',
                filter: 'brightness(0.7)' 
              }}
            >
              <ReviewCard review={text.reviews[getReviewIndex(-1)]} />
            </div>
            
            {/* Active Review (Center) */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 left-0 right-0 mx-auto w-4/5 lg:w-2/5 transition-all duration-500 ease-in-out z-20"
              style={{ 
                transform: 'translateZ(0) translateY(-50%) rotateY(0deg)',
                left: '50%',
                marginLeft: '-40%'
              }}
            >
              <ReviewCard review={text.reviews[activeIndex]} />
            </div>
            
            {/* Next Review (Right Side) */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 right-0 w-4/5 lg:w-1/3 transition-all duration-500 ease-in-out z-10"
              style={{ 
                transform: 'translateX(6%) translateZ(-100px) translateY(-50%) rotateY(-10deg) scale(0.9)',
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
          <div className="flex justify-center mt-8 space-x-2 absolute bottom-2 left-0 right-0">
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
    <div className="bg-black/80 backdrop-blur-sm rounded-lg border border-amber-400/20 shadow-xl p-8 text-center flex flex-col h-full max-h-96 overflow-auto">
      <div className="flex-shrink-0 flex justify-center mb-4">
        <div className="w-20 h-20 relative">
          <img
            src={review.image}
            alt={review.name}
            className="w-full h-full rounded-full mx-auto object-cover border-2 border-amber-400"
            onError={(e) => {
              e.currentTarget.src = '/api/placeholder/80/80';
              e.currentTarget.alt = 'Placeholder image';
            }}
          />
        </div>
      </div>
      <div className="flex justify-center mb-4 flex-shrink-0">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} className="w-6 h-6 fill-current text-amber-400" />
        ))}
      </div>
      <div className="flex-grow overflow-auto mb-4">
        <p className="text-gray-300 italic text-lg">"{review.text}"</p>
      </div>
      <div className="flex-shrink-0">
        <p className="font-semibold text-amber-300 text-lg">{review.name}</p>
        <p className="text-amber-200/70 text-sm">{review.location}</p>
        
        {/* TripAdvisor badge */}
        <div className="mt-3 flex justify-center">
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block hover:opacity-80 transition-opacity"
            aria-label="View on TripAdvisor"
          >
            <img 
              src="https://i.postimg.cc/CMGd4SyB/Tripadvisor-Svg.png" 
              alt="TripAdvisor Verified" 
              className="h-6"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Reviews;