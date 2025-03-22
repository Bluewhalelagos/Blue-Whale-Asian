import React, { useState, useEffect } from 'react';
import { BriefcaseIcon, ChevronRightIcon, SparklesIcon } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';

interface Career {
  id: string;
  title: string;
  title_pt?: string;
  type: string;
  type_pt?: string;
  experience: string;
  experience_pt?: string;
  description: string;
  description_pt?: string;
}

interface CareersProps {
  language: 'en' | 'pt';
}

// Define translations for the static content
const translations = {
  en: {
    title: "Join Our Team",
    subtitle: "We're always looking for talented individuals who are passionate about creating exceptional dining experiences for our guests.",
    loading: "Loading career opportunities...",
    noPositions: "No positions are currently available. Please check back later for new opportunities.",
    applyNow: "Apply Now"
  },
  pt: {
    title: "Junte-se à Nossa Equipa",
    subtitle: "Estamos sempre à procura de indivíduos talentosos que sejam apaixonados por criar experiências gastronómicas excepcionais para os nossos clientes.",
    loading: "A carregar oportunidades de carreira...",
    noPositions: "Não há vagas disponíveis no momento. Por favor, volte mais tarde para novas oportunidades.",
    applyNow: "Candidate-se Agora"
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  },
  hover: { 
    scale: 1.03,
    boxShadow: "0 25px 50px -12px rgba(234, 179, 8, 0.25)",
    borderColor: "rgba(234, 179, 8, 0.6)",
    transition: { duration: 0.3 }
  }
};

const titleVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: 0.1
    }
  }
};

const underlineVariants = {
  hidden: { width: 0, opacity: 0 },
  visible: { 
    width: "6rem", 
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const Careers: React.FC<CareersProps> = ({ language }) => {
  const [positions, setPositions] = useState<Career[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the appropriate translations based on the current language
  const text = translations[language];

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'careers'));
        const careersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Career[];
        setPositions(careersList);
      } catch (error) {
        console.error('Error fetching careers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCareers();
  }, []);

  // Helper function to get the correct language field
  const getLocalizedField = (position: Career, field: string) => {
    const langField = `${field}_${language}` as keyof Career;
    return position[langField] || position[field as keyof Career];
  };

  // Dynamic background elements
  const BackgroundElements = () => (
    <>
      <div className="absolute top-20 left-10 w-48 h-48 bg-amber-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
      <motion.div 
        className="absolute top-1/4 right-1/4 w-3 h-3 bg-amber-300 rounded-full"
        animate={{
          y: [0, 20, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-amber-500 rounded-full"
        animate={{
          y: [0, -15, 0],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div 
        className="absolute top-1/2 left-20 w-4 h-4 bg-amber-400 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
    </>
  );

  if (isLoading) {
    return (
      <section id="careers" className="py-24 bg-black relative overflow-hidden">
        <BackgroundElements />
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              transition: { delay: 0.2 }
            }}
          >
            <motion.div
              className="inline-block"
              animate={{ 
                rotate: 360,
                transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
              }}
            >
              <BriefcaseIcon className="w-10 h-10 text-amber-400 mb-4" />
            </motion.div>
            <p className="text-amber-300">{text.loading}</p>
          </motion.div>
        </div>
      </section>
    );
  }

  if (positions.length === 0) {
    return (
      <section id="careers" className="py-24 bg-black relative overflow-hidden">
        <BackgroundElements />
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <h2 
              className="text-4xl font-bold text-amber-400 mb-4"
            
            >
              {text.title}
            </h2>
            <motion.div 
              className="h-1 bg-amber-500 mx-auto mb-6"
              variants={underlineVariants}
            >
            </motion.div>
            <motion.p 
              className="text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: 0.5 }
              }}
            >
              {text.noPositions}
            </motion.p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="careers" className="py-24 bg-black relative overflow-hidden">
      <BackgroundElements />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="flex items-center justify-center gap-3 mb-2">
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
              }}
            >
              <SparklesIcon className="w-6 h-6 text-amber-300" />
            </motion.div>
            <h2 
              className="text-4xl font-bold text-amber-400"
              
            >
              {text.title}
            </h2>
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.3 }
              }}
            >
              <SparklesIcon className="w-6 h-6 text-amber-300" />
            </motion.div>
          </motion.div>
          <motion.div 
            className="h-1 bg-amber-500 mx-auto mb-6"
            variants={underlineVariants}
          ></motion.div>
          <motion.p 
            className="text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: 0.6 }
            }}
          >
            {text.subtitle}
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {positions.map((position, index) => (
            <motion.div 
              key={position.id} 
              className="backdrop-blur-sm bg-black/40 rounded-lg p-8 border border-amber-400/20 shadow-xl relative overflow-hidden group"
              variants={itemVariants}
              whileHover="hover"
              custom={index}
            >
              {/* Animated gradient background */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-amber-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={false}
                animate={{ 
                  background: [
                    "linear-gradient(to bottom right, rgba(146, 64, 14, 0.1), transparent)",
                    "linear-gradient(to bottom right, rgba(146, 64, 14, 0.2), transparent)",
                    "linear-gradient(to bottom right, rgba(146, 64, 14, 0.1), transparent)"
                  ]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <div className="flex items-center mb-6">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <BriefcaseIcon className="w-7 h-7 text-amber-400 mr-3" />
                </motion.div>
                <h3 className="text-xl font-semibold text-white">
                  {getLocalizedField(position, 'title')}
                </h3>
              </div>
              <div className="mb-6">
                <div className="flex justify-between mb-4">
                  <motion.span 
                    className="text-amber-300 font-medium text-sm px-3 py-1 rounded-full bg-amber-900/30 border border-amber-700/30"
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: "rgba(146, 64, 14, 0.4)",
                      borderColor: "rgba(217, 119, 6, 0.5)"
                    }}
                  >
                    {getLocalizedField(position, 'type')}
                  </motion.span>
                  <motion.span 
                    className="text-amber-300 font-medium text-sm px-3 py-1 rounded-full bg-amber-900/30 border border-amber-700/30"
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: "rgba(146, 64, 14, 0.4)",
                      borderColor: "rgba(217, 119, 6, 0.5)"
                    }}
                  >
                    {getLocalizedField(position, 'experience')}
                  </motion.span>
                </div>
                <p className="text-gray-300">
                  {getLocalizedField(position, 'description')}
                </p>
              </div>
              <motion.button 
                onClick={() => window.location.href = `mailto:bluewhalelagos@gmail.com?subject=Application for ${getLocalizedField(position, 'title')}`}
                className="w-full bg-amber-500 text-black font-bold py-3 rounded-md hover:bg-amber-400 transition-colors group relative overflow-hidden"
                whileHover={{ 
                  boxShadow: "0 10px 25px -5px rgba(234, 179, 8, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span 
                  className="absolute inset-0 w-0 bg-white/20"
                  initial={{ width: 0, x: "-100%" }}
                  whileHover={{ width: "100%", x: "0%" }}
                  transition={{ duration: 0.4 }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  {text.applyNow}
                  <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Careers;