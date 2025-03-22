import React, { useState, useEffect } from 'react';
import { Star, X, Send, CheckCircle } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  Timestamp,
  where
} from 'firebase/firestore';

interface ReviewsProps {
  language: 'en' | 'pt';
}

interface Review {
  id?: string;
  name: string;
  rating: number;
  text: string;
  source: string;
  date: Timestamp | string;
  color?: string;
}

interface NewReviewForm {
  name: string;
  email: string;
  rating: number;
  text: string;
}

// Define translations for the Reviews component
const translations = {
  en: {
    title: "Customer Reviews",
    filterLabel: "Show reviews from:",
    allSources: "All Sources",
    leaveReview: "Leave a Review",
    modalTitle: "Share Your Experience",
    formLabels: {
      name: "Your Name",
      email: "Email Address",
      rating: "Your Rating",
      review: "Your Review"
    },
    placeholders: {
      name: "Enter your name",
      email: "Enter your email",
      review: "Tell us about your experience..."
    },
    submitButton: "Submit Review",
    closeButton: "Close",
    successMessage: "Thank you for your review!",
    requiredField: "This field is required",
    invalidEmail: "Please enter a valid email address",
    sourceLabels: {
      website: "Our Website",
      fork: "The Fork",
      tripadvisor: "TripAdvisor"
    }
  },
  pt: {
    title: "Avaliações dos Clientes",
    filterLabel: "Mostrar avaliações de:",
    allSources: "Todas as Fontes",
    leaveReview: "Deixe uma Avaliação",
    modalTitle: "Compartilhe Sua Experiência",
    formLabels: {
      name: "Seu Nome",
      email: "Endereço de Email",
      rating: "Sua Avaliação",
      review: "Sua Opinião"
    },
    placeholders: {
      name: "Digite seu nome",
      email: "Digite seu email",
      review: "Conte-nos sobre sua experiência..."
    },
    submitButton: "Enviar Avaliação",
    closeButton: "Fechar",
    successMessage: "Obrigado pela sua avaliação!",
    requiredField: "Este campo é obrigatório",
    invalidEmail: "Por favor, insira um endereço de email válido",
    sourceLabels: {
      website: "Nosso Site",
      fork: "The Fork",
      tripadvisor: "TripAdvisor"
    }
  }
};

// Your Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Reviews: React.FC<ReviewsProps> = ({ language }) => {
  // Get the appropriate translations based on the current language
  const text = translations[language];
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Form state
  const [formValues, setFormValues] = useState<NewReviewForm>({
    name: '',
    email: '',
    rating: 5,
    text: ''
  });
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    text: ''
  });
  
  // Random pastel colors for review cards
  const pastelColors = [
    'bg-gradient-to-br from-amber-500/20 to-amber-700/20',
    'bg-gradient-to-br from-blue-500/20 to-blue-700/20',
    'bg-gradient-to-br from-green-500/20 to-green-700/20',
    'bg-gradient-to-br from-purple-500/20 to-purple-700/20',
    'bg-gradient-to-br from-red-500/20 to-red-700/20',
    'bg-gradient-to-br from-teal-500/20 to-teal-700/20'
  ];

  // Fetch reviews from Firebase when component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let q = query(collection(db, 'reviews'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const fetchedReviews = querySnapshot.docs.map((doc, index) => {
          const data = doc.data() as Review;
          return {
            id: doc.id,
            ...data,
            color: pastelColors[index % pastelColors.length]
          };
        });
        
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Filter reviews based on selected source
  const filteredReviews = selectedSource 
    ? reviews.filter(review => review.source === selectedSource)
    : reviews;
  
  const reviewsCount = filteredReviews.length;
  
  // Reset active index when filter changes
  React.useEffect(() => {
    setActiveIndex(0);
  }, [selectedSource]);
  
  // Function to rotate to next review
  const nextReview = () => {
    if (reviewsCount > 0) {
      setActiveIndex((prevIndex) => (prevIndex + 1) % reviewsCount);
    }
  };
  
  // Function to rotate to previous review
  const prevReview = () => {
    if (reviewsCount > 0) {
      setActiveIndex((prevIndex) => (prevIndex - 1 + reviewsCount) % reviewsCount);
    }
  };
  
  // Auto-rotate every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      nextReview();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [reviewsCount]);
  
  // Get the indices of the previous, current, and next reviews
  const getReviewIndex = (offset: number) => {
    return (activeIndex + offset + reviewsCount) % reviewsCount;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    
    // Reset validation error when user types
    setFormErrors({
      ...formErrors,
      [name]: ''
    });
  };
  
  // Handle rating change
  const handleRatingChange = (rating: number) => {
    setFormValues({
      ...formValues,
      rating
    });
  };
  
  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors = {
      name: formValues.name.trim() ? '' : text.requiredField,
      email: !formValues.email.trim() 
        ? text.requiredField 
        : !isValidEmail(formValues.email) 
          ? text.invalidEmail 
          : '',
      text: formValues.text.trim() ? '' : text.requiredField
    };
    
    setFormErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Create new review object for Firestore
      const newReview: Omit<Review, 'id' | 'color'> = {
        name: formValues.name,
        rating: formValues.rating,
        text: formValues.text,
        source: "website", // Mark as from our website
        date: Timestamp.now()
      };
      
      // Add document to Firestore
      const docRef = await addDoc(collection(db, 'reviews'), newReview);
      
      // Add the new review to the beginning of the reviews array
      const createdReview: Review = {
        ...newReview,
        id: docRef.id,
        color: pastelColors[reviews.length % pastelColors.length]
      };
      
      setReviews([createdReview, ...reviews]);
      
      // Show success message
      setSubmissionStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormValues({
          name: '',
          email: '',
          rating: 5,
          text: ''
        });
        
        // Close modal after showing success message for 2 seconds
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmissionStatus('idle');
        }, 2000);
      }, 500);
    } catch (error) {
      console.error("Error adding review:", error);
      setSubmissionStatus('error');
    }
  };

  // Source filter buttons
  const sourceOptions = [
    { id: null, label: text.allSources },
    { id: 'website', label: text.sourceLabels.website },
    { id: 'fork', label: text.sourceLabels.fork },
    { id: 'tripadvisor', label: text.sourceLabels.tripadvisor }
  ];

  // Get source icon based on review source
  const getSourceIcon = (source: string) => {
    switch(source) {
      case 'tripadvisor':
        return (
          <div className="text-green-500 text-xs font-semibold flex items-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 mr-1" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
            TripAdvisor
          </div>
        );
      case 'fork':
        return (
          <div className="text-red-500 text-xs font-semibold flex items-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 mr-1" fill="currentColor">
              <path d="M16 3.23c2.01 2.2 3 4.95 3 7.77s-.99 5.57-3 7.77l1.42 1.42C19.7 17.69 21 13.95 21 11s-1.3-6.69-3.58-9.19L16 3.23zM4.42 1.81L3 3.23C5.28 5.73 7 9.47 7 12s-1.72 6.27-4 8.77l1.42 1.42C7.01 20.1 9 16.57 9 12c0-4.57-1.99-8.1-4.58-10.19zM12 7c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2s2-.9 2-2V9c0-1.1-.9-2-2-2z"/>
            </svg>
            The Fork
          </div>
        );
      default:
        return (
          <div className="text-amber-400 text-xs font-semibold flex items-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 mr-1" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/>
            </svg>
            Our Website
          </div>
        );
    }
  };

  // Function to format Firestore timestamp
  const formatDate = (timestamp: Timestamp | string) => {
    if (typeof timestamp === 'string') return timestamp;
    
    const date = timestamp.toDate();
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section id="reviews" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-amber-400 mb-2">{text.title}</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-8"></div>
          
          {/* Source filter and Leave Review button */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-center justify-center mb-4">
              <p className="text-gray-300 mb-2 md:mb-0 md:mr-4">{text.filterLabel}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {sourceOptions.map(option => (
                  <button
                    key={option.id || 'all'}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      selectedSource === option.id 
                        ? 'bg-amber-400 text-black font-medium' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedSource(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Leave a review button */}
            <button
              className="mt-6 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-full transition-colors flex items-center justify-center mx-auto"
              onClick={() => setIsModalOpen(true)}
            >
              <Star className="w-5 h-5 mr-2" />
              {text.leaveReview}
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-400"></div>
          </div>
        ) : reviewsCount > 0 ? (
          <div className="max-w-6xl mx-auto relative h-96">
            {/* Carousel container with perspective */}
            <div className="perspective-container relative h-full w-full overflow-hidden">
              {/* Previous Review (Left Side) */}
              {reviewsCount > 1 && (
                <div 
                  className="absolute top-0 left-0 w-4/5 lg:w-1/3 h-full transition-all duration-500 ease-in-out transform -translate-x-8 scale-90 opacity-60 z-10"
                  style={{ 
                    transform: 'translateX(-6%) translateZ(-100px) rotateY(10deg) scale(0.9)',
                    filter: 'brightness(0.7)' 
                  }}
                >
                  <ReviewCard 
                    review={filteredReviews[getReviewIndex(-1)]} 
                    getSourceIcon={getSourceIcon}
                    formatDate={formatDate}
                  />
                </div>
              )}
              
              {/* Active Review (Center) */}
              <div 
                className="absolute top-0 left-0 right-0 mx-auto w-4/5 lg:w-2/5 h-full transition-all duration-500 ease-in-out transform translate-y-0 scale-100 z-20"
                style={{ 
                  transform: 'translateX(0) translateZ(0) rotateY(0deg) scale(1)',
                  left: '50%',
                  marginLeft: '-40%'
                }}
              >
                <ReviewCard 
                  review={filteredReviews[activeIndex]} 
                  getSourceIcon={getSourceIcon}
                  formatDate={formatDate}
                />
              </div>
              
              {/* Next Review (Right Side) */}
              {reviewsCount > 1 && (
                <div 
                  className="absolute top-0 right-0 w-4/5 lg:w-1/3 h-full transition-all duration-500 ease-in-out transform translate-x-8 scale-90 opacity-60 z-10"
                  style={{ 
                    transform: 'translateX(6%) translateZ(-100px) rotateY(-10deg) scale(0.9)',
                    filter: 'brightness(0.7)' 
                  }}
                >
                  <ReviewCard 
                    review={filteredReviews[getReviewIndex(1)]} 
                    getSourceIcon={getSourceIcon}
                    formatDate={formatDate}
                  />
                </div>
              )}
            </div>
            
            {/* Navigation buttons */}
            {reviewsCount > 1 && (
              <>
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
              </>
            )}
            
            {/* Dots indicator */}
            {reviewsCount > 1 && (
              <div className="flex justify-center mt-8 space-x-2 absolute bottom-0 left-0 right-0">
                {filteredReviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-amber-400' : 'bg-amber-400/30'}`}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-16">
            No reviews found for the selected filter.
          </div>
        )}
      </div>
      
      {/* Review submission modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div 
            className="relative bg-gray-900 rounded-xl max-w-lg w-full border border-amber-400/20 shadow-xl overflow-hidden"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
          >
            {/* Modal header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-400 p-5">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-black">{text.modalTitle}</h3>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setSubmissionStatus('idle');
                    setFormErrors({ name: '', email: '', text: '' });
                  }}
                  className="text-black hover:bg-black/10 rounded-full p-1 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Success message */}
            {submissionStatus === 'success' ? (
              <div className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h4 className="text-amber-400 text-lg font-bold mb-2">{text.successMessage}</h4>
                <p className="text-gray-300">
                  Your review has been successfully submitted and is now visible.
                </p>
              </div>
            ) : submissionStatus === 'error' ? (
              <div className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <X className="w-16 h-16 text-red-500" />
                </div>
                <h4 className="text-red-400 text-lg font-bold mb-2">Error</h4>
                <p className="text-gray-300">
                  There was an error submitting your review. Please try again later.
                </p>
                <button
                  onClick={() => setSubmissionStatus('idle')}
                  className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-md transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              /* Form content */
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name input */}
                <div>
                  <label className="block text-amber-400 mb-1" htmlFor="name">
                    {text.formLabels.name}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formValues.name}
                    onChange={handleInputChange}
                    placeholder={text.placeholders.name}
                    className={`w-full px-4 py-2 bg-gray-800 rounded-md border ${
                      formErrors.name ? 'border-red-500' : 'border-gray-700'
                    } text-white focus:outline-none focus:border-amber-400`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>
                
                {/* Email input */}
                <div>
                  <label className="block text-amber-400 mb-1" htmlFor="email">
                    {text.formLabels.email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleInputChange}
                    placeholder={text.placeholders.email}
                    className={`w-full px-4 py-2 bg-gray-800 rounded-md border ${
                      formErrors.email ? 'border-red-500' : 'border-gray-700'
                    } text-white focus:outline-none focus:border-amber-400`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>
                
                {/* Rating input */}
                <div>
                  <label className="block text-amber-400 mb-2">
                    {text.formLabels.rating}
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className="focus:outline-none transition-all duration-200 transform hover:scale-110"
                      >
                        <Star 
                          className={`w-8 h-8 ${
                            star <= formValues.rating 
                              ? 'fill-current text-amber-400' 
                              : 'text-gray-600'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Review text input */}
                <div>
                  <label className="block text-amber-400 mb-1" htmlFor="review-text">
                    {text.formLabels.review}
                  </label>
                  <textarea
                    id="review-text"
                    name="text"
                    value={formValues.text}
                    onChange={handleInputChange}
                    placeholder={text.placeholders.review}
                    rows={4}
                    className={`w-full px-4 py-2 bg-gray-800 rounded-md border ${
                      formErrors.text ? 'border-red-500' : 'border-gray-700'
                    } text-white focus:outline-none focus:border-amber-400 resize-none`}
                  />
                  {formErrors.text && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.text}</p>
                  )}
                </div>
                
                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-md transition-colors flex items-center justify-center"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {text.submitButton}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      
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
const ReviewCard = ({ 
  review, 
  getSourceIcon,
  formatDate 
}: { 
  review: Review,
  getSourceIcon: (source: string) => JSX.Element,
  formatDate: (timestamp: Timestamp | string) => string
}) => {
  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // First letter of each word in different color
  const renderHighlightedName = (name: string) => {
    return name.split(' ').map((word, index) => (
      <span key={index}>
        <span className="text-amber-400">{word[0]}</span>
        <span>{word.slice(1)}</span>
        {index < name.split(' ').length - 1 && ' '}
      </span>
    ));
  };

  // Choose random quote style 
  const quoteStyles = [
    'before:content-["❝"] before:text-4xl before:text-amber-500 before:absolute before:-top-4 before:-left-1 after:content-["❞"] after:text-4xl after:text-amber-500 after:absolute after:-bottom-8 after:-right-1',
    'before:content-["«"] before:text-4xl before:text-amber-500 before:absolute before:-top-4 before:-left-1 after:content-["»"] after:text-4xl after:text-amber-500 after:absolute after:-bottom-8 after:-right-1',
    'border-l-4 border-amber-500 pl-4',
  ];
  
  // Use the review's color or choose a random one
  const cardColor = review.color || 'bg-gradient-to-br from-amber-500/20 to-amber-700/20';

  return (
    <div className={`h-full ${cardColor} rounded-lg border border-amber-400/20 backdrop-blur-sm shadow-xl p-8 flex flex-col`}>
      {/* Top section with avatar and rating */}
      <div className="flex justify-between items-start mb-6">
        {/* Avatar with initials */}
        <div className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-xl">
            {getInitials(review.name)}
          </div>
          <div className="ml-4">
            <h4 className="font-bold text-white text-lg">
              {renderHighlightedName(review.name)}
            </h4>
            <div className="flex items-center">
              {getSourceIcon(review.source)}
              <span className="text-gray-400 text-xs ml-2">
                {formatDate(review.date)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Star rating */}
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star}
              className={`w-5 h-5 ${star <= review.rating ? 'text-amber-400 fill-current' : 'text-gray-600'}`} 
            />
          ))}
        </div>
      </div>
      
      {/* Review text */}
      <div className="flex-grow">
        <p className={`text-gray-200 italic relative ${quoteStyles[Math.floor(Math.random() * quoteStyles.length)]}`}>
          {review.text}
        </p>
      </div>
    </div>
  );
};

export default Reviews;