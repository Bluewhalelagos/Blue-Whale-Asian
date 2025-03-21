import React, { useState, useEffect } from 'react';
import { BriefcaseIcon } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

interface Career {
  id: string;
  title: string;
  type: string;
  experience: string;
  description: string;
}

const Careers = () => {
  const [positions, setPositions] = useState<Career[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <section id="careers" className="py-20 bg-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">Loading career opportunities...</p>
          </div>
        </div>
      </section>
    );
  }

  if (positions.length === 0) {
    return (
      <section id="careers" className="py-20 bg-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Join Our Team</h2>
            <p className="text-gray-600">
              No positions are currently available. Please check back later for new opportunities.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="careers" className="py-20 bg-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Join Our Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're always looking for talented individuals who are passionate about creating 
            exceptional dining experiences for our guests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {positions.map((position) => (
            <div key={position.id} className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <BriefcaseIcon className="w-6 h-6 text-amber-400 mr-2" />
                <h3 className="text-xl font-semibold text-blue-900">{position.title}</h3>
              </div>
              <div className="mb-4">
                <p className="text-gray-600 mb-2"><span className="font-medium">Type:</span> {position.type}</p>
                <p className="text-gray-600 mb-4"><span className="font-medium">Experience:</span> {position.experience}</p>
                <p className="text-gray-700">{position.description}</p>
              </div>
              <button 
                onClick={() => window.location.href = `mailto:careers@bluewhale.com?subject=Application for ${position.title}`}
                className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition-colors"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Careers;