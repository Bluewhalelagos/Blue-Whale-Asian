import React, { useState, useEffect } from 'react';
import { BriefcaseIcon } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

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

  if (isLoading) {
    return (
      <section id="careers" className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-amber-300">{text.loading}</p>
          </div>
        </div>
      </section>
    );
  }

  if (positions.length === 0) {
    return (
      <section id="careers" className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-amber-400 mb-4">{text.title}</h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-gray-300">{text.noPositions}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="careers" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-amber-400 mb-2">{text.title}</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">{text.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {positions.map((position) => (
            <div 
              key={position.id} 
              className="backdrop-blur-sm bg-black/40 rounded-lg p-8 border border-amber-400/20 shadow-xl hover:border-amber-400/40 transition-all"
            >
              <div className="flex items-center mb-6">
                <BriefcaseIcon className="w-7 h-7 text-amber-400 mr-3" />
                <h3 className="text-xl font-semibold text-white">
                  {getLocalizedField(position, 'title')}
                </h3>
              </div>
              <div className="mb-6">
                <div className="flex justify-between mb-4">
                  <span className="text-amber-300 font-medium text-sm px-3 py-1 rounded-full bg-amber-900/30 border border-amber-700/30">
                    {getLocalizedField(position, 'type')}
                  </span>
                  <span className="text-amber-300 font-medium text-sm px-3 py-1 rounded-full bg-amber-900/30 border border-amber-700/30">
                    {getLocalizedField(position, 'experience')}
                  </span>
                </div>
                <p className="text-gray-300">
                  {getLocalizedField(position, 'description')}
                </p>
              </div>
              <button 
                onClick={() => window.location.href = `mailto:bluewhalelagos@gmail.com ?subject=Application for ${getLocalizedField(position, 'title')}`}
                className="w-full bg-amber-500 text-black font-bold py-3 rounded-md hover:bg-amber-400 transition-colors"
              >
                {text.applyNow}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Careers;