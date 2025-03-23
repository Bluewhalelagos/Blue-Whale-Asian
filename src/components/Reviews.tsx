import React, { useState, useEffect } from 'react';
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

const Reviews = ({ language = 'en' }: ReviewsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const text = translations[language];
  
  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % text.reviews.length);
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + text.reviews.length) % text.reviews.length);
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 7000);
    
    return () => clearInterval(interval);
  }, [currentIndex]);
  
  return (
    <section 
      className="py-16 text-white overflow-hidden relative bg-black"
      style={{
        backgroundImage: 'url("https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/55 backdrop-blur-sm"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-400 relative inline-block pb-2">
            {text.title}
            <span className="absolute bottom-0 left-1/2 w-20 h-1 bg-amber-500 transform -translate-x-1/2"></span>
          </h2>
          
          {/* Restaurant rating summary */}
          <div className="mt-8 flex flex-col items-center">
            <h3 className="text-xl md:text-3xl font-bold text-white">Blue Whale - Asian Fusion Restaurant</h3>
            <div className="flex items-center mt-2">
              <div className="text-4xl font-bold text-amber-400 mr-4">4.7</div>
              <div className="flex">
                {[1, 2, 3, 4].map(i => (
                  <Star key={i} className="w-6 h-6 text-amber-400 fill-current" />
                ))}
                <Star className="w-6 h-6 text-amber-400" strokeWidth={2} />
              </div>
            </div>
            <div className="text-gray-400 mt-1">
              Based on 136 reviews
            </div>
          </div>
        </div>
        
        {/* Reviews Carousel */}
        <div className="max-w-4xl mx-auto relative">
          <div className="relative overflow-hidden min-h-96 rounded-xl shadow-2xl">
            {/* Current Review */}
            <div className={`transition-all duration-500 ease-in-out ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-md border border-amber-500/30 rounded-xl p-8 md:p-10">
                {/* Content layout */}
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Profile section */}
                  <div className="flex flex-col items-center md:w-1/3">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-amber-400 shadow-lg mb-4">
                      <img 
                        src={text.reviews[currentIndex].image} 
                        alt={text.reviews[currentIndex].name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/api/placeholder/100/100';
                          e.currentTarget.alt = 'Profile placeholder';
                        }}
                      />
                    </div>
                    
                    <h3 className="text-xl font-bold text-amber-300">{text.reviews[currentIndex].name}</h3>
                    <p className="text-amber-300/70 text-sm mb-3">{text.reviews[currentIndex].location}</p>
                    
                    {/* Rating stars */}
                    <div className="flex mb-2">
                      {[...Array(text.reviews[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-gray-400 text-xs">{text.reviews[currentIndex].date}</p>
                    
                    {/* Verified badge */}
                    <div className="mt-4 bg-gray-800/50 rounded-full px-3 py-1 flex items-center border border-amber-500/20">
                      <img 
                        src="https://i.postimg.cc/CMGd4SyB/Tripadvisor-Svg.png" 
                        alt="TripAdvisor Verified" 
                        className="h-4 mr-2"
                      />
                      <span className="text-xs text-gray-300">Verified Review</span>
                    </div>
                  </div>
                  
                  {/* Review text */}
                  <div className="md:w-2/3 flex items-center">
                    <p className="text-gray-200 text-lg md:text-xl leading-relaxed italic">
                      {text.reviews[currentIndex].text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation controls */}
          <div className="flex justify-between items-center mt-8">
            <button 
              onClick={handlePrev}
              className="bg-amber-500 hover:bg-amber-600 text-black rounded-full p-3 shadow-lg transform transition-transform hover:scale-105"
              aria-label="Previous review"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Pagination dots */}
            <div className="flex space-x-2">
              {text.reviews.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => {
                    setIsAnimating(true);
                    setCurrentIndex(index);
                    setTimeout(() => setIsAnimating(false), 500);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-amber-500 w-8' 
                      : 'bg-amber-500/30 hover:bg-amber-500/50'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={handleNext}
              className="bg-amber-500 hover:bg-amber-600 text-black rounded-full p-3 shadow-lg transform transition-transform hover:scale-105"
              aria-label="Next review"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* View all reviews link */}
          <div className="text-center mt-8">
            <a 
              href="https://www.tripadvisor.com/Restaurant_Review-g189117-d23844421-Reviews-or75-Blue_Whale_Asian_Fusion_Restaurant-Lagos_Faro_District_Algarve.html#REVIEWS" 
              className="inline-block bg-transparent border-2 border-amber-500 text-amber-400 font-semibold py-2 px-6 rounded-full hover:bg-amber-500 hover:text-black transition-all duration-300"
            >
              View All 136 Reviews
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;